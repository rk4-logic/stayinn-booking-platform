import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/actions/user.actions";
import { getPropertyAction } from "@/actions/property.actions";
import { getAvailableRoomsAction } from "@/actions/room.actions";
import Container from "@/components/shared/Container";
import BookingFlow from "@/components/booking/BookingFlow";
import { serializeData } from "@/lib/utils/serialize";

interface PageProps {
  searchParams: Promise<{
    propertyId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export const metadata = {
  title: "Book Your Stay — StayInn",
};

export default async function BookingPage({ searchParams }: PageProps) {
  const user = await getAuthenticatedUser().catch(() => null);
  if (!user) redirect("/sign-in");

  const { propertyId, checkIn, checkOut, guests } = await searchParams;

  if (!propertyId || !checkIn || !checkOut) {
    redirect("/properties");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const guestCount = Number(guests) || 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (
    isNaN(checkInDate.getTime()) ||
    isNaN(checkOutDate.getTime()) ||
    checkInDate < today ||
    checkOutDate <= checkInDate
  ) {
    redirect("/properties");
  }

  const [property, availableRooms] = await Promise.all([
    getPropertyAction(propertyId).catch(() => null), // ← fixed: use _id not slug
    getAvailableRoomsAction(
      propertyId,
      checkInDate,
      checkOutDate,
      guestCount
    ).catch(() => []),
  ]);

  if (!property) redirect("/properties");

  // serialize to avoid Mongoose ObjectId issues passing to client components
  const serializedProperty = serializeData(property);
  const serializedRooms = serializeData(availableRooms);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Complete Your Booking
        </h1>
        <BookingFlow
          property={serializedProperty}
          availableRooms={serializedRooms ?? []}
          checkIn={checkInDate}
          checkOut={checkOutDate}
          guestCount={guestCount}
        />
      </Container>
    </div>
  );
}