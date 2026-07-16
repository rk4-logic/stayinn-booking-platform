import { getOwnerBookingsAction } from "@/actions/booking.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import BookingList from "@/components/dashboard/BookingList";
import type { BookingListItem } from "@/types/booking.types";

export const metadata = {
  title: "Owner Bookings — StayInn",
};

export default async function OwnerBookingsPage() {
  const result = await getOwnerBookingsAction(1, 20);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Owner Bookings"
          description="Review bookings for your properties"
        />
        <BookingList
          bookings={
            (result.bookings ?? []) as unknown as BookingListItem[]
          }
          showCancelButton={false}
        />
      </Container>
    </div>
  );
}
