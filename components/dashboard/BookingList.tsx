"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import ConfirmDialog from "../shared/ConfirmDialogue";
import EmptyState from "@/components/shared/EmptyState";
import BookingCard from "./BookingCard";
import { cancelBookingAction } from "@/actions/booking.actions";
import type { BookingListItem } from "@/types/booking.types";

interface BookingListProps {
  bookings: BookingListItem[];
  showCancelButton?: boolean;
}

export default function BookingList({ bookings, showCancelButton = true }: BookingListProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!cancellingId) return;
    setLoading(true);

    const result = await cancelBookingAction(cancellingId);

    if (result.success) {
      toast.success("Booking cancelled successfully");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to cancel booking");
    }

    setLoading(false);
    setCancellingId(null);
  };

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No bookings yet"
        description="Start exploring properties and make your first booking."
        actionLabel="Browse Properties"
        actionHref="/properties"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={setCancellingId}
            showCancelButton={showCancelButton}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!cancellingId}
        onClose={() => setCancellingId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking?"
        confirmLabel="Yes, Cancel"
        loading={loading}
      />
    </>
  );
}