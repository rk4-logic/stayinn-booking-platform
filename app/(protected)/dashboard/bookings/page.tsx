import { getUserBookingsAction } from "@/actions/booking.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import BookingList from "@/components/dashboard/BookingList";
import type { BookingListItem } from "@/types/booking.types";

export const metadata = {
  title: "My Bookings — StayInn",
};

export default async function BookingsPage() {
  const result = await getUserBookingsAction(1, 20);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="My Bookings"
          description="View and manage all your bookings"
        />
        <BookingList
          bookings={
            (result.bookings ?? []) as unknown as BookingListItem[]
          }
        />
      </Container>
    </div>
  );
}