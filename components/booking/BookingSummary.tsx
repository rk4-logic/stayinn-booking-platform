"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";

interface Room {
  _id: unknown;
  roomName: string;
  roomType: string;
  bedType: string;
  beds: number;
  maxGuests: number;
  pricePerNight: number;
}

interface Property {
  name: string;
  location: { city: string; country: string };
}

interface BookingSummaryProps {
  property: Property;
  room: Room;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  currency: string;
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export default function BookingSummary({
  property,
  room,
  checkIn,
  checkOut,
  nights,
  totalPrice,
  currency,
  loading,
  onBack,
  onConfirm,
}: BookingSummaryProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to room selection
      </button>

      <h2 className="text-lg font-semibold text-gray-900">
        Booking Summary
      </h2>

      {/* Property + Room */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">{property.name}</h3>
          <p className="text-sm text-gray-500">
            {property.location.city}, {property.location.country}
          </p>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Room</span>
            <span className="font-medium">{room.roomName}</span>
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
            <span>Duration</span>
            <span className="font-medium">
              {nights} night{nights > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white border rounded-xl p-5 space-y-3">
        <h4 className="font-semibold text-gray-900">Price Breakdown</h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {formatCurrency(room.pricePerNight, currency)} × {nights} nights
            </span>
            <span>{formatCurrency(totalPrice, currency)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes & fees</span>
            <span>Included</span>
          </div>
        </div>

        <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(totalPrice, currency)}</span>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Free cancellation</p>
        <p>Cancel before check-in for a full refund.</p>
      </div>

      {/* Confirm Button */}
      <Button
        className="w-full gap-2"
        size="lg"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Redirecting to payment..." : `Pay ${formatCurrency(totalPrice, currency)}`}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        By confirming, you agree to our terms and conditions.
      </p>
    </div>
  );
}