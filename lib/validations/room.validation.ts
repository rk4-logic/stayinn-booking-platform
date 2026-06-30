import { z } from "zod";
import { RoomType, BedType, RoomSizeUnit } from "@/types/room.types";
import { Currency } from "@/types/common.types";

export const createRoomSchema = z.object({
  roomName: z.string().trim().min(1, "Room name is required"),
  roomType: z.nativeEnum(RoomType, { error: "Room type is required" }),
  bedType: z.nativeEnum(BedType, { error: "Bed type is required" }),
  beds: z.number().int().min(1, "At least 1 bed required"),
  maxGuests: z.number().int().min(1, "At least 1 guest required"),
  pricePerNight: z.number().min(0, "Price cannot be negative"),
  currency: z.nativeEnum(Currency).optional().default(Currency.USD),
  roomSize: z.number().positive().optional(),
  roomSizeUnit: z.nativeEnum(RoomSizeUnit).optional(),
  amenities: z.array(z.string().trim()).optional().default([]),
});

export const updateRoomSchema = createRoomSchema.partial();