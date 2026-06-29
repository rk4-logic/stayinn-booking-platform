import { connectDB } from "@/lib/db";
import Room from "@/models/Room";
import Booking from "@/models/Booking";
import { IRoom } from "@/types/room.types";
import { getPaginationMeta, normalizePagination } from "@/lib/utils/pagination";
import { toObjectId } from "@/lib/utils/object-id";
import { ACTIVE_FILTER } from "@/lib/db/query";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/constants/booking";
import { updateStartingPrice } from "./property-stats.service";

export interface CreateRoomData {
  propertyId: string;
  roomName: string;
  roomType: IRoom["roomType"];
  bedType: IRoom["bedType"];
  beds: number;
  maxGuests: number;
  pricePerNight: number;
  currency?: IRoom["currency"];
  roomSize?: number;
  roomSizeUnit?: IRoom["roomSizeUnit"];
  amenities?: string[];
}

export interface UpdateRoomData {
  roomName?: string;
  roomType?: IRoom["roomType"];
  bedType?: IRoom["bedType"];
  beds?: number;
  maxGuests?: number;
  pricePerNight?: number;
  currency?: IRoom["currency"];
  roomSize?: number;
  roomSizeUnit?: IRoom["roomSizeUnit"];
  amenities?: string[];
  isAvailable?: boolean;
}

export async function createRoom(data: CreateRoomData) {
  await connectDB();
  const room = await Room.create(data);
  await updateStartingPrice(data.propertyId);
  return room.toObject();
}

export async function updateRoom(
  roomId: string,
  propertyId: string,
  data: UpdateRoomData
) {
  await connectDB();

  const room = await Room.findOneAndUpdate(
    { _id: roomId, propertyId, ...ACTIVE_FILTER },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!room) return null;

  if (data.pricePerNight !== undefined || data.isAvailable !== undefined) {
    await updateStartingPrice(propertyId);
  }

  return room;
}

export async function deleteRoom(roomId: string, propertyId: string) {
  await connectDB();

  const room = await Room.findOneAndUpdate(
    { _id: roomId, propertyId, ...ACTIVE_FILTER },
    { $set: { isDeleted: true, deletedAt: new Date(), isAvailable: false } },
    { new: true }
  ).lean();

  if (!room) return null;

  await updateStartingPrice(propertyId);
  return room;
}

export async function getRoomById(roomId: string) {
  await connectDB();
  return Room.findOne({ _id: roomId, ...ACTIVE_FILTER }).lean() ?? null;
}

export async function getRoomsByProperty(
  propertyId: string,
  page = 1,
  limit = 10
) {
  await connectDB();

  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

  const [rooms, total] = await Promise.all([
    Room.find({ propertyId, ...ACTIVE_FILTER })
      .sort({ pricePerNight: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Room.countDocuments({ propertyId, ...ACTIVE_FILTER }),
  ]);

  return { rooms, ...getPaginationMeta(total, safePage, safeLimit) };
}

export async function getAvailableRooms(
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number
) {
  await connectDB();

  const bookedRoomIds = await Booking.distinct("roomId", {
    propertyId: toObjectId(propertyId),
    ...ACTIVE_FILTER,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  return Room.find({
    propertyId,
    ...ACTIVE_FILTER,
    isAvailable: true,
    maxGuests: { $gte: guests },
    _id: { $nin: bookedRoomIds },
  })
    .sort({ pricePerNight: 1 })
    .lean();
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  await connectDB();

  const conflict = await Booking.exists({
    roomId: toObjectId(roomId),
    ...ACTIVE_FILTER,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  return !conflict;
}