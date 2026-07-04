import { notFound } from "next/navigation";
import { getPropertyBySlugAction } from "@/actions/property.actions";
import { getRoomsByPropertyAction } from "@/actions/room.actions";
import { getPropertyReviewsAction } from "@/actions/review.actions";
import Container from "@/components/shared/Container";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import RoomList from "@/components/property/RoomList";
import ReviewList from "@/components/property/ReviewList";
import BookingWidget from "@/components/booking/BookingWidget";
import { Suspense } from "react";
import Loading from "@/components/shared/Loading";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlugAction(slug);

  if (!property) {
    return { title: "Property Not Found — StayInn" };
  }

  return {
    title: `${property.name} — StayInn`,
    description: property.description,
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const property = await getPropertyBySlugAction(slug);

  if (!property) notFound();

  const [roomsResult, reviewsResult] = await Promise.all([
    getRoomsByPropertyAction(String(property._id)),
    getPropertyReviewsAction(String(property._id)),
  ]);

  return (
    <div className="bg-white min-h-screen">
      <Container className="py-8">
        {/* Property Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {property.name}
        </h1>

        {/* Gallery */}
        <PropertyGallery images={property.images ?? []} name={property.name} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10 mt-8">
          {/* Left — Info + Rooms + Reviews */}
          <div className="flex-1 space-y-10">
            <PropertyInfo property={property} />

            <Suspense fallback={<Loading text="Loading rooms..." />}>
              <RoomList
                rooms={roomsResult.rooms ?? []}
                propertyId={String(property._id)}
                currency={property.currency}
              />
            </Suspense>

            <Suspense fallback={<Loading text="Loading reviews..." />}>
              <ReviewList
                reviews={reviewsResult.reviews ?? []}
                rating={property.rating}
                totalReviews={property.totalReviews}
              />
            </Suspense>
          </div>

          {/* Right — Booking Widget */}
          <aside className="w-full lg:w-80 shrink-0">
            <BookingWidget
              propertyId={String(property._id)}
              currency={property.currency}
            />
          </aside>
        </div>
      </Container>
    </div>
  );
}