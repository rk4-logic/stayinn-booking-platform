import { z } from "zod";
import { RoomType, BedType, RoomSizeUnit } from "@/types/room.types";
import { Currency } from "@/types/common.types";

export const createRoomSchema = z.object({
  roomName: z.string().trim().min(1, "Room name is required"),
  roomType: z.enum(Object.values(RoomType) as [string, ...string[]], {
    error: "Room type is required",
  }),
  bedType: z.enum(Object.values(BedType) as [string, ...string[]], {
    error: "Bed type is required",
  }),
  beds: z.number().int().min(1, "At least 1 bed required"),
  maxGuests: z.number().int().min(1, "At least 1 guest required"),
  pricePerNight: z.number().min(0, "Price cannot be negative"),
  currency: z.enum(Object.values(Currency) as [string, ...string[]]).optional(),
  roomSize: z.number().positive().optional(),
  roomSizeUnit: z.enum(Object.values(RoomSizeUnit) as [string, ...string[]]).optional(),
  amenities: z.array(z.string().trim()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;