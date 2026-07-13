"use client";

import { CheckCircle, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils/formatDate";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { BookingConfirmationProps } from "@/types/booking.types";

export default function BookingConfirmation({
  bookingId,
  propertyName,
  roomName,
  checkIn,
  checkOut,
  nights,
  totalPrice,
  currency,
}: BookingConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-10">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500">
          Your booking has been confirmed. Check your email for details.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white border rounded-xl p-6 text-left space-y-4">
        <div className="text-xs text-gray-400 font-mono">
          Booking ID: {bookingId}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Property</span>
            <span className="font-medium text-gray-900">{propertyName}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Room</span>
            <span className="font-medium text-gray-900">{roomName}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Check-in</span>
            <span className="font-medium">{formatDate(checkIn)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Check-out</span>
            <span className="font-medium">{formatDate(checkOut)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Nights</span>
            <span className="font-medium">{nights}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
            <span>Total Paid</span>
            <span>{formatCurrency(totalPrice, currency)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard/bookings">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Calendar className="h-4 w-4" />
            View My Bookings
          </Button>
        </Link>
        <Link href="/properties">
          <Button className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Browse More Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}