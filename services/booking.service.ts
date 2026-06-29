import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { IBooking, BookingStatus, PaymentStatus } from "@/types/booking.types";
import { getPaginationMeta, normalizePagination } from "@/lib/utils/pagination";
import { toObjectId } from "@/lib/utils/object-id";
import { ACTIVE_FILTER } from "@/lib/db/query";
import { checkRoomAvailability } from "@/services/room.service";

export interface CreateBookingData {
  userId: string;
  propertyId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children?: number;
    infants?: number;
  };
  pricePerNight: number;
  currency?: IBooking["currency"];
}

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