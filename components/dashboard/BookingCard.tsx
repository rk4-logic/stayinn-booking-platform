"use client";

import { Calendar, MapPin, Users, CreditCard, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BookingStatusBadge from "./BookingStatusBadge";

import { formatDate } from "@/lib/utils/formatDate";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatPaymentStatus } from "@/lib/utils/formatStatus";

import {
  BookingStatus,
  type BookingListItem,
} from "@/types/booking.types";
import type { PopulatedUser } from "@/types/user.types";

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
  const property = booking.propertyId;
  const room = booking.roomId;
  const { adults, children, infants } = booking.guests;

  // Safely extract populated user if present
  const booker =
    booking.userId && typeof booking.userId === "object"
      ? (booking.userId as PopulatedUser)
      : null;

  const cancellableStatuses = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
  ];

  const canCancel = cancellableStatuses.includes(booking.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="p-5 border-b">
        <div className="flex items-start justify-between gap-4">

          <div className="space-y-1">

            <h3 className="text-lg font-semibold text-gray-900">
              {property?.name ?? "Property"}
            </h3>

            {room?.roomName && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BedDouble className="h-4 w-4" />
                <span>{room.roomName}</span>
              </div>
            )}

            {property?.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.location.city}, {property.location.country}
                </span>
              </div>
            )}

          </div>

          <BookingStatusBadge status={booking.status} />

        </div>
      </div>

      {/* Body */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Dates */}
        <div className="space-y-4">

          <div className="flex gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Check In
              </p>

              <p className="font-medium text-gray-900">
                {formatDate(booking.checkIn)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Check Out
              </p>

              <p className="font-medium text-gray-900">
                {formatDate(booking.checkOut)}
              </p>
            </div>
          </div>

        </div>

        {/* Guests */}
        <div className="space-y-4">

          <div className="flex gap-3">

            <Users className="h-5 w-5 text-blue-600 mt-0.5" />

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Guests
              </p>

              <p className="font-medium text-gray-900">
                {adults} Adult{adults > 1 ? "s" : ""}
                {children > 0 && ` • ${children} Child${children > 1 ? "ren" : ""}`}
                {infants > 0 && ` • ${infants} Infant${infants > 1 ? "s" : ""}`}
              </p>

            </div>

          </div>

          <div className="flex gap-3">

            <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Payment
              </p>

              <Badge variant="outline">
                {formatPaymentStatus(booking.paymentStatus)}
              </Badge>

            </div>

          </div>

        </div>

      </div>

      {/* Booker Info - Displays guest details for Owner & Admin */}
      {booker && (
        <div className="px-5 py-3 bg-gray-50 border-t flex items-center gap-3 text-sm text-gray-700">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            {booker.firstName?.[0] || "U"}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              Booked by: {booker.firstName ?? "Guest"} {booker.lastName ?? ""}
            </p>
            {booker.email && (
              <p className="text-xs text-gray-500">{booker.email}</p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total Paid
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(
              booking.totalPrice,
              booking.currency
            )}
          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            size="sm"
          >
            View Details
          </Button>

          {showCancelButton && canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(booking._id)}
            >
              Cancel Booking
            </Button>
          )}

        </div>

      </div>

    </div>
  );
}