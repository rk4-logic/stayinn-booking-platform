import { getAuthenticatedUser } from "@/actions/user.actions";
import { getUserBookingsAction } from "@/actions/booking.actions";
import { getUserReviewsAction } from "@/actions/review.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import BookingList from "@/components/dashboard/BookingList";
import { redirect } from "next/navigation";
import type { BookingListItem } from "@/types/booking.types";
import { UserRole } from "@/types/user.types";

export const metadata = {
  title: "Dashboard — StayInn",
};

export default async function DashboardPage() {
  const user = await getAuthenticatedUser().catch(() => null);
  if (!user) redirect("/sign-in");

  if (user.role === UserRole.ADMIN) redirect("/admin/properties");
  if (user.role === UserRole.OWNER) redirect("/owner/properties");

  const [bookingsResult, reviews] = await Promise.all([
    getUserBookingsAction(1, 5),
    getUserReviewsAction(),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title={`Welcome back, ${user.firstName ?? "there"}!`}
          description="Manage your bookings and reviews"
        />

        <DashboardStats
          totalBookings={bookingsResult.total ?? 0}
          totalReviews={Array.isArray(reviews) ? reviews.length : 0}
        />

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Bookings
          </h2>
          <BookingList
            bookings={(bookingsResult.bookings ?? []) as unknown as BookingListItem[]}
          />
        </div>
      </Container>
    </div>
  );
}