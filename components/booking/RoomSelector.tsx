"use client";

import { BedDouble, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Price from "@/components/property/Price";
import EmptyState from "@/components/shared/EmptyState";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import type { RoomSelectorProps } from "@/types/room.types";



export default function RoomSelector({
  rooms,
  currency,
  onSelect,
}: RoomSelectorProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <EmptyState
        icon={BedDouble}
        title="No rooms available"
        description="No rooms are available for your selected dates and guest count."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Select a Room ({rooms.length} available)
      </h2>

      {rooms.map((room) => (
        <div
          key={String(room._id)}
          className="bg-white border rounded-xl p-5 space-y-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {room.roomName}
                </h3>
                <Badge variant="secondary" className="capitalize text-xs">
                  {formatPropertyType(room.roomType)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>
                    {room.beds} {room.bedType} bed
                    {room.beds > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.maxGuests} guests</span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 5).map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs text-gray-500"
                    >
                      <Check className="h-3 w-3 text-green-500" />
                      {amenity}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right space-y-3 shrink-0">
              <Price
                amount={room.pricePerNight}
                currency={currency}
                size="lg"
              />
              <Button onClick={() => onSelect(room)}>Select Room</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}