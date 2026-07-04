import { Users, BedDouble } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Price from "./Price";
import EmptyState from "@/components/shared/EmptyState";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import type { RoomListProps } from "@/types/room.types";

export default function RoomList({ rooms, currency }: RoomListProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Rooms
        </h2>
        <EmptyState
          title="No rooms available"
          description="This property has no rooms listed yet."
        />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Available Rooms
      </h2>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={String(room._id)}
            className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{room.roomName}</h3>
                <Badge variant="secondary" className="text-xs capitalize">
                  {formatPropertyType(room.roomType)}
                </Badge>
                {!room.isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Unavailable
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4" />
                  <span>
                    {room.beds} {room.bedType} bed{room.beds > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.maxGuests} guests</span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 4).map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="text-xs"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0">
              <Price
                amount={room.pricePerNight}
                currency={currency}
                size="lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}