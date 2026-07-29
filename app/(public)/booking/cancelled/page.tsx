import Link from "next/link";
import Container from "@/components/shared/Container";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Booking Cancelled — StayInn",
};

export default function BookingCancelledPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Container>
        <div className="max-w-lg mx-auto text-center space-y-6">

          {/* Cancelled Icon */}
          <div className="flex justify-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Cancelled
            </h1>
            <p className="text-gray-500">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          {/* Info box */}
          <div className="bg-white border rounded-xl p-5 text-left space-y-2 shadow-sm">
            <p className="text-sm font-medium text-gray-900">
              What happened?
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>You cancelled the checkout process on Stripe</li>
              <li>Your card was not charged</li>
              <li>The room reservation has been released</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/properties">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
            <Link href="/properties">
              <Button className="gap-2 w-full sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                Find Another Room
              </Button>
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}