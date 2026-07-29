import { getAdminBookingsAction } from "@/actions/booking.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import BookingList from "@/components/dashboard/BookingList";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const response = await getAdminBookingsAction();
  const bookings = response.bookings ?? [];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="All Platform Bookings"
          description="Comprehensive booking ledger across all properties"
        />
        <BookingList bookings={bookings} />
      </Container>
    </div>
  );
}