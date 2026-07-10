import { useQuery } from "@tanstack/react-query";
import {
  getRoomsByPropertyAction,
  getAvailableRoomsAction,
} from "@/actions/room.actions";
import { QUERY_STALE_TIME } from "@/lib/constants/query";

export const roomKeys = {
  all: ["rooms"] as const,
  byProperty: (propertyId: string) =>
    [...roomKeys.all, "property", propertyId] as const,
  available: (propertyId: string, checkIn: string, checkOut: string, guests: number) =>
    [...roomKeys.all, "available", propertyId, checkIn, checkOut, guests] as const,
};

export function useRoomsByProperty(propertyId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: roomKeys.byProperty(propertyId),
    queryFn: () => getRoomsByPropertyAction(propertyId, page, limit),
    enabled: !!propertyId,
    staleTime: QUERY_STALE_TIME.MEDIUM
  });
}

export function useAvailableRooms(
  propertyId: string,
  checkIn: Date | null,
  checkOut: Date | null,
  guests: number
) {
  return useQuery({
    queryKey: roomKeys.available(
      propertyId,
      checkIn?.toISOString() ?? "",
      checkOut?.toISOString() ?? "",
      guests
    ),
    queryFn: () =>
      getAvailableRoomsAction(
        propertyId,
        checkIn!,
        checkOut!,
        guests
      ),
    // only run when all required values exist
    enabled: !!propertyId && !!checkIn && !!checkOut && guests > 0,
    staleTime: QUERY_STALE_TIME.SHORT
  });
}