import { PropertyCardData, type PropertyCardInput } from "@/types/property.types";


export function toPropertyCardData(property: PropertyCardInput): PropertyCardData {
  return {
    _id: String(property._id),
    name: property.name,
    slug: property.slug,
    location: {
      city: property.location.city,
      country: property.location.country,
    },
    images: property.images,
    rating: property.rating,
    totalReviews: property.totalReviews,
    startingPrice: property.startingPrice,
    currency: property.currency,
    propertyType: property.propertyType,
  };
}