"use client";

import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingStatusBadge from "./BookingStatusBadge";
import { formatDate } from "@/lib/utils/formatDate";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatPaymentStatus } from "@/lib/utils/formatStatus";
import { BookingStatus, type BookingListItem } from "@/types/booking.types";

interface BookingCardProps {
  booking: BookingListItem;
  onCancel: (id: string) => void;
  showCancelButton?: boolean;
}

export default function BookingCard({
  booking,
  onCancel,
  showCancelButton = true,
}: BookingCardProps) {
  const canCancel =
    booking.status === BookingStatus.PENDING ||
    booking.status === BookingStatus.CONFIRMED;

  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">
            {booking.propertyId?.name ?? "Property"}
          </h3>
          {booking.roomId?.roomName && (
            <p className="text-sm text-gray-500">
              {booking.roomId.roomName}
            </p>
          )}
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {booking.propertyId?.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>
              {booking.propertyId.location.city},{" "}
              {booking.propertyId.location.country}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>
            {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {booking.guests.adults} adult
            {booking.guests.adults > 1 ? "s" : ""}
            {booking.guests.children > 0 &&
              `, ${booking.guests.children} child`}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div>
          <span className="font-bold text-gray-900">
            {formatCurrency(booking.totalPrice, booking.currency)}
          </span>
          <Badge variant="outline" className="ml-2 text-xs capitalize">
            {formatPaymentStatus(booking.paymentStatus)}
          </Badge>
        </div>
        {showCancelButton && canCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onCancel(booking._id)}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}