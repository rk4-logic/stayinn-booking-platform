"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { BookingWidgetProps } from "@/types/booking.types";


export default function BookingWidget({
  propertyId,
}: BookingWidgetProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const params = new URLSearchParams({
      propertyId,
      checkIn,
      checkOut,
      guests: String(guests),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-md sticky top-24 space-y-4">
      <h3 className="font-semibold text-gray-900 text-lg">Book this property</h3>

      <div className="space-y-1.5">
        <Label>Check-in</Label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Check-out</Label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Guests</Label>
        <Input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <Button
        className="w-full"
        onClick={handleSearch}
        disabled={!checkIn || !checkOut}
      >
        {isSignedIn ? "Check Availability" : "Sign in to Book"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}