"use server";

import { revalidatePath } from "next/cache";
import { serializeData } from "@/lib/utils/serialize";
import {
  createRoomSchema,
  updateRoomSchema,
} from "@/lib/validations/room.validation";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getRoomsByProperty,
  getAvailableRooms,
  type CreateRoomData,
  type UpdateRoomData,
} from "@/services/room.service";
import { getPropertyById } from "@/services/property.service";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser } from "./user.actions";

async function verifyPropertyOwnership(propertyId: string, userId: string) {
  const property = await getPropertyById(propertyId);
  if (!property) throw new Error("Property not found");
  if (property.ownerId.toString() !== userId) throw new Error("Unauthorized");
  return property;
}

export async function createRoomAction(
  propertyId: string,
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();
    await verifyPropertyOwnership(propertyId, user._id.toString());

    const parsed = createRoomSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const roomData: CreateRoomData = {
      ...(parsed.data as unknown as CreateRoomData),
      propertyId,
    };

    const room = await createRoom(roomData);

    // Revalidate route cache so Server Components update
    revalidatePath(`/owner/properties/${propertyId}/rooms`);

    // Serialize Mongoose ObjectIds & Dates to plain types before returning to Client Component
    return { success: true, data: serializeData(room) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create room",
    };
  }
}

export async function updateRoomAction(
  roomId: string,
  propertyId: string,
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();
    await verifyPropertyOwnership(propertyId, user._id.toString());

    const parsed = updateRoomSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const room = await updateRoom(
      roomId,
      propertyId,
      parsed.data as unknown as UpdateRoomData
    );
    if (!room) return { success: false, error: "Room not found" };

    revalidatePath(`/owner/properties/${propertyId}/rooms`);

    // Serialize Mongoose ObjectIds & Dates to plain types
    return { success: true, data: serializeData(room) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update room",
    };
  }
}

export async function deleteRoomAction(
  roomId: string,
  propertyId: string
): Promise<ActionResult> {
  try {
    const user = await getAuthenticatedUser();
    await verifyPropertyOwnership(propertyId, user._id.toString());

    const room = await deleteRoom(roomId, propertyId);
    if (!room) return { success: false, error: "Room not found" };

    revalidatePath(`/owner/properties/${propertyId}/rooms`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete room",
    };
  }
}

export async function getRoomAction(roomId: string) {
  const room = await getRoomById(roomId);
  return room ? serializeData(room) : null;
}

export async function getRoomsByPropertyAction(
  propertyId: string,
  page = 1,
  limit = 10
) {
  const result = await getRoomsByProperty(propertyId, page, limit);
  return serializeData(result);
}

export async function getAvailableRoomsAction(
  propertyId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number
) {
  const rooms = await getAvailableRooms(propertyId, checkIn, checkOut, guests);
  return serializeData(rooms);
}