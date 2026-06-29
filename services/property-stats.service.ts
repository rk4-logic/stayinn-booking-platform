import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import Room from "@/models/Room";
import Review from "@/models/Review";
import { toObjectId } from "@/lib/utils/object-id";

// Called by room.service after room create/update/delete
// Never call this manually — denormalized field
export async function updateStartingPrice(propertyId: string) {
  await connectDB();

  const result = await Room.aggregate([
    {
      $match: {
        propertyId: toObjectId(propertyId),
        isDeleted: false,
        isAvailable: true,
      },
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$pricePerNight" },
      },
    },
  ]);

  const startingPrice = result[0]?.minPrice ?? 0;

  const property = await Property.findByIdAndUpdate(
    propertyId,
    { $set: { startingPrice } },
    { new: true }
  ).lean();

  return property ?? null;
}

// Called by review.service after review create/update/delete
// Never call this manually — denormalized field
export async function updatePropertyRating(propertyId: string) {
  await connectDB();

  const result = await Review.aggregate([
    {
      $match: {
        propertyId: toObjectId(propertyId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = result[0]?.avgRating
    ? Math.round(result[0].avgRating * 10) / 10
    : 0;
  const totalReviews = result[0]?.totalReviews ?? 0;

  const property = await Property.findByIdAndUpdate(
    propertyId,
    { $set: { rating: avgRating, totalReviews } },
    { new: true }
  ).lean();

  return property ?? null;
}