import Link from "next/link";
import Container from "@/components/shared/Container";
import { CheckCircle, Calendar, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Booking Confirmed — StayInn",
};

export default function BookingSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Container>
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
              Your booking is being confirmed. This usually takes a few seconds.
            </p>
          </div>

          {/* Pending indicator */}
          <div className="bg-white border rounded-xl p-5 flex items-center gap-3 text-left">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Confirming your booking...
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Full booking details will appear in your dashboard shortly.
              </p>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400">
            Booking confirmation is processed securely. If your booking does not
            appear within a few minutes, please contact support.
          </p>

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
      </Container>
    </div>
  );
}