import { PropertyCardData, type PropertyCardInput } from "@/types/property.types";


export function toPropertyCardData(property: PropertyCardInput): PropertyCardData {
  const location = property.location ?? {};

  return {
    _id: String(property._id),
    name: property.name ?? "Untitled property",
    slug: property.slug ?? "",
    location: {
      city: location.city ?? "Location",
      country: location.country ?? "Unknown",
    },
    images: property.images ?? [],
    rating: property.rating ?? 0,
    totalReviews: property.totalReviews ?? 0,
    startingPrice: property.startingPrice ?? 0,
    currency: property.currency ?? "USD",
    propertyType: property.propertyType ?? "hotel",
  };
}