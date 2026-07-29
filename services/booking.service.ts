import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { BookingStatus, PaymentStatus, type BookingListItem, type CreateBookingData } from "@/types/booking.types";
import { getPaginationMeta, normalizePagination } from "@/lib/utils/pagination";
import { toObjectId } from "@/lib/utils/object-id";
import { ACTIVE_FILTER } from "@/lib/db/query";
import { checkRoomAvailability } from "@/services/room.service";
import { serializeData } from "@/lib/utils/serialize";

function calculateTotalPrice(
  checkIn: Date,
  checkOut: Date,
  pricePerNight: number
): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);
  return nights * pricePerNight;
}

export async function createBooking(data: CreateBookingData) {
  await connectDB();

  const isAvailable = await checkRoomAvailability(
    data.roomId,
    data.checkIn,
    data.checkOut
  );

  if (!isAvailable) {
    throw new Error("Room is not available for the selected dates");
  }

  const totalPrice = calculateTotalPrice(
    data.checkIn,
    data.checkOut,
    data.pricePerNight
  );

  try {
    // Create booking with PENDING status
    // Payment must be completed to confirm
    const booking = await Booking.create({
      userId: data.userId,
      propertyId: data.propertyId,
      roomId: data.roomId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: {
        adults: data.guests.adults,
        children: data.guests.children ?? 0,
        infants: data.guests.infants ?? 0,
      },
      totalPrice,
      currency: data.currency,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    });

    return booking.toObject();
  } catch (error: unknown) {
    // Handle duplicate booking attempt
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new Error("This room was just booked. Please select different dates.");
    }
    throw error;
  }
}

export async function getBookingById(bookingId: string) {
  await connectDB();

  const booking = await Booking.findOne({ _id: bookingId, ...ACTIVE_FILTER })
    .populate("propertyId", "name slug images location")
    .populate("roomId", "roomName roomType pricePerNight images")
    .lean();

  return booking ?? null;
}

export async function getUserBookings(userId: string, page = 1, limit = 10) {
  await connectDB();

  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

  const [bookings, total] = await Promise.all([
    Booking.find({ userId, ...ACTIVE_FILTER })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("propertyId", "name slug images location")
      .populate("roomId", "roomName roomType pricePerNight")
      .lean(),
    Booking.countDocuments({ userId, ...ACTIVE_FILTER }),
  ]);

  return { bookings, ...getPaginationMeta(total, safePage, safeLimit) };
}

export async function getPropertyBookings(
  propertyId: string,
  page = 1,
  limit = 10
) {
  await connectDB();

  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

  const [bookings, total] = await Promise.all([
    Booking.find({ propertyId, ...ACTIVE_FILTER })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("userId", "firstName lastName email imageUrl")
      .populate("roomId", "roomName roomType")
      .lean(),
    Booking.countDocuments({ propertyId, ...ACTIVE_FILTER }),
  ]);

  return { bookings, ...getPaginationMeta(total, safePage, safeLimit) };
}

export async function getOwnerBookings(ownerId: string, page = 1, limit = 10) {
  await connectDB();

  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

  const ownerProperties = await Property.find({
    ownerId: toObjectId(ownerId),
    isDeleted: { $ne: true },
  })
    .select("_id")
    .lean<Array<{ _id: string | mongoose.Types.ObjectId }>>();

  const propertyObjectIds = ownerProperties.map((property) => {
    if (property._id instanceof mongoose.Types.ObjectId) {
      return property._id;
    }

    return toObjectId(property._id);
  });

  if (propertyObjectIds.length === 0) {
    return {
      bookings: [],
      page: safePage,
      limit: safeLimit,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  const [bookings, total] = await Promise.all([
    Booking.find({ propertyId: { $in: propertyObjectIds }, ...ACTIVE_FILTER })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("userId", "firstName lastName email imageUrl")
      .populate("propertyId", "name slug images location")
      .populate("roomId", "roomName roomType pricePerNight")
      .lean(),
    Booking.countDocuments({ propertyId: { $in: propertyObjectIds }, ...ACTIVE_FILTER }),
  ]);

  return { bookings, ...getPaginationMeta(total, safePage, safeLimit) };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  await connectDB();

  return Booking.findOneAndUpdate(
    { _id: bookingId, ...ACTIVE_FILTER },
    { $set: { status } },
    { new: true }
  ).lean() ?? null;
}

export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus
) {
  await connectDB();

  return Booking.findOneAndUpdate(
    { _id: bookingId, ...ACTIVE_FILTER },
    { $set: { paymentStatus } },
    { new: true }
  ).lean() ?? null;
}

export async function cancelBooking(bookingId: string, userId: string) {
  await connectDB();

  const booking = await Booking.findOne({
    _id: bookingId,
    userId,
    ...ACTIVE_FILTER,
  });

  if (!booking) return null;

  if (
    booking.status !== BookingStatus.PENDING &&
    booking.status !== BookingStatus.CONFIRMED
  ) {
    throw new Error("Only pending or confirmed bookings can be cancelled");
  }

  return Booking.findByIdAndUpdate(
    bookingId,
    { $set: { status: BookingStatus.CANCELLED } },
    { new: true }
  ).lean() ?? null;
}

export async function getBookingsByDateRange(
  propertyId: string,
  startDate: Date,
  endDate: Date
) {
  await connectDB();

  return Booking.find({
    propertyId: toObjectId(propertyId),
    ...ACTIVE_FILTER,
    status: { $nin: [BookingStatus.CANCELLED] },
    checkIn: { $lte: endDate },
    checkOut: { $gte: startDate },
  }).lean();
}

// Add these to services/booking.service.ts

export class BookingService {
  /**
   * Fetch all bookings for an Owner across all their properties
   */
  static async getOwnerBookings(ownerId: string, page = 1, limit = 10) {
    await connectDB();

    const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

    // 1. Get properties owned by this MongoDB User ID
    const ownerProperties = await Property.find({
      ownerId: toObjectId(ownerId),
      isDeleted: { $ne: true },
    })
      .select("_id")
      .lean();

    if (!ownerProperties.length) {
      return { bookings: [], ...getPaginationMeta(0, safePage, safeLimit) };
    }

    const propertyIds = ownerProperties.map((p) => p._id);

    // 2. Fetch bookings and populate Booker (userId), Property, and Room
    const [bookings, total] = await Promise.all([
      Booking.find({ propertyId: { $in: propertyIds }, ...ACTIVE_FILTER })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate({
          path: "userId",
          select: "firstName lastName email imageUrl",
        })
        .populate("propertyId", "name location")
        .populate("roomId", "roomName roomType")
        .lean(),
      Booking.countDocuments({ propertyId: { $in: propertyIds }, ...ACTIVE_FILTER }),
    ]);

    const plainBookings = serializeData(bookings);

    return {
      bookings: plainBookings as unknown as BookingListItem[],
      ...getPaginationMeta(total, safePage, safeLimit),
    };
  }

  static async cancelBooking(bookingId: string, userId: string) {
    await connectDB();

    // Verify booking exists and belongs to the user or property owner
    const booking = await Booking.findOne({
      _id: toObjectId(bookingId),
      $or: [{ userId: toObjectId(userId) }],
      isDeleted: { $ne: true },
    });

    if (!booking) return null;

    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    return serializeData(booking);
  }

  /**
   * Fetch all platform bookings for Admin
   */
  static async getAdminBookings(page = 1, limit = 20) {
    await connectDB();

    const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

    const [bookings, total] = await Promise.all([
      Booking.find({ ...ACTIVE_FILTER })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate({
          path: "userId",
          select: "firstName lastName email imageUrl",
        })
        .populate("propertyId", "name location")
        .populate("roomId", "roomName roomType")
        .lean(),
      Booking.countDocuments({ ...ACTIVE_FILTER }),
    ]);

    const plainBookings = serializeData(bookings);

    return {
      bookings: plainBookings as unknown as BookingListItem[],
      ...getPaginationMeta(total, safePage, safeLimit),
    };
  }

  /**
   * Fetch booking by Stripe Session ID (for success page)
   */
  static async getBookingByStripeSession(sessionId: string) {
    await connectDB();

    const booking = await Booking.findOne({
      stripeSessionId: sessionId,
      isDeleted: { $ne: true },
    })
      .populate("propertyId", "name location")
      .populate("roomId", "roomName roomType")
      .lean();

    return booking ? serializeData(booking) : null;
  }
}