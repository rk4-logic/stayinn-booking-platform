"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { CheckCircle, Calendar, Home, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingListItem } from "@/types/booking.types";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Derive initial status based on whether sessionId exists
  const [status, setStatus] = useState<"loading" | "confirmed" | "pending">(
    sessionId ? "loading" : "pending"
  );
  const [bookingDetails, setBookingDetails] = useState<BookingListItem | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    let attempts = 0;
    const maxAttempts = 10; // Poll for ~30 seconds max

    const checkBookingStatus = async () => {
      try {
        const res = await fetch(`/api/booking/by-session?session_id=${sessionId}`);
        const data = await res.json();

        if (data?.booking) {
          if (isMounted) {
            setBookingDetails(data.booking);
            setStatus("confirmed");
          }
          return true;
        }
      } catch (err) {
        console.error("Error polling booking status:", err);
      }
      return false;
    };

    const interval = setInterval(async () => {
      attempts++;
      const found = await checkBookingStatus();

      if (found || attempts >= maxAttempts) {
        clearInterval(interval);
        if (!found && isMounted) {
          setStatus("pending");
        }
      }
    }, 3000);

    // Initial check
    checkBookingStatus();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId]);

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="text-gray-500">
          {status === "confirmed"
            ? "Your reservation has been officially confirmed!"
            : "Your booking is being processed. This usually takes a few seconds."}
        </p>
      </div>

      {/* Dynamic Status Box */}
      {status === "loading" && (
        <div className="bg-white border rounded-xl p-5 flex items-center gap-3 text-left shadow-sm">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
          <div>
            <p className="font-medium text-gray-900 text-sm">
              Confirming your booking...
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Syncing payment details with property management.
            </p>
          </div>
        </div>
      )}

      {status === "confirmed" && bookingDetails && (
        <div className="bg-white border border-green-200 rounded-xl p-5 text-left space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
            <Check className="h-4 w-4" />
            <span>Booking Verified</span>
          </div>
          <div className="text-sm space-y-1 text-gray-600 border-t pt-2">
            <p>
              <strong className="text-gray-900">Property:</strong>{" "}
              {bookingDetails.propertyId?.name ?? "Reserved Property"}
            </p>
            {bookingDetails.roomId?.roomName && (
              <p>
                <strong className="text-gray-900">Room:</strong>{" "}
                {bookingDetails.roomId.roomName}
              </p>
            )}
          </div>
        </div>
      )}

      {status === "pending" && (
        <p className="text-xs text-gray-400">
          Booking confirmation is processed securely via webhooks. If your booking does not
          appear in your dashboard within a few minutes, please contact support.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link href="/dashboard/bookings">
          <Button className="gap-2 w-full sm:w-auto">
            <Calendar className="h-4 w-4" />
            View My Bookings
          </Button>
        </Link>
        <Link href="/properties">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Browse Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Container>
        <Suspense fallback={<div className="text-center py-10">Loading page...</div>}>
          <SuccessPageContent />
        </Suspense>
      </Container>
    </div>
  );
}