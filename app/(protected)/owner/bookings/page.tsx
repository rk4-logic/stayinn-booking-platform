import { getOwnerSideBookingsAction } from "@/actions/booking.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import BookingList from "@/components/dashboard/BookingList";

export const metadata = {
  title: "Owner Bookings — StayInn",
};

export default async function OwnerBookingsPage() {
  const { bookings = [] } = await getOwnerSideBookingsAction();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Property Bookings"
          description="All verified bookings across your listed properties"
        />
        <BookingList bookings={bookings} showCancelButton={false} />
      </Container>
    </div>
  );
}
