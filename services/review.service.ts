import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { BookingStatus } from "@/types/booking.types";
import { getPaginationMeta, normalizePagination } from "@/lib/utils/pagination";
import { toObjectId } from "@/lib/utils/object-id";
import { ACTIVE_FILTER } from "@/lib/db/query";
import { updatePropertyRating } from "./property-stats.service";

export interface CreateReviewData {
  userId: string;
  propertyId: string;
  bookingId: string;
  rating: number;
  review: string;
}

export async function createReview(data: CreateReviewData) {
  await connectDB();

  const booking = await Booking.findOne({
    _id: data.bookingId,
    userId: toObjectId(data.userId),
    propertyId: toObjectId(data.propertyId),
    ...ACTIVE_FILTER,
  });

  if (!booking) throw new Error("Booking not found");

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can only review after your stay is completed");
  }

  // verifiedStay set by service only — never manually
  const review = await Review.create({ ...data, verifiedStay: true });

  await updatePropertyRating(data.propertyId);

  return review.toObject();
}

export async function getPropertyReviews(
  propertyId: string,
  page = 1,
  limit = 10
) {
  await connectDB();

  const { page: safePage, limit: safeLimit, skip } = normalizePagination(page, limit);

  const [reviews, total] = await Promise.all([
    Review.find({ propertyId, ...ACTIVE_FILTER })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("userId", "firstName lastName imageUrl")
      .lean(),
    Review.countDocuments({ propertyId, ...ACTIVE_FILTER }),
  ]);

  return { reviews, ...getPaginationMeta(total, safePage, safeLimit) };
}

export async function getReviewById(reviewId: string) {
  await connectDB();

  return Review.findOne({ _id: reviewId, ...ACTIVE_FILTER })
    .populate("userId", "firstName lastName imageUrl")
    .lean() ?? null;
}

export async function updateReview(
  reviewId: string,
  userId: string,
  data: { rating?: number; review?: string }
) {
  await connectDB();

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, userId, ...ACTIVE_FILTER },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!review) return null;

  await updatePropertyRating(review.propertyId.toString());
  return review;
}

export async function deleteReview(reviewId: string, userId: string) {
  await connectDB();

  const review = await Review.findOne({
    _id: reviewId,
    userId,
    ...ACTIVE_FILTER,
  });

  if (!review) return null;

  await Review.findByIdAndUpdate(reviewId, {
    $set: { isDeleted: true, deletedAt: new Date() },
  });

  await updatePropertyRating(review.propertyId.toString());
  return review;
}

export async function addOwnerReply(
  reviewId: string,
  ownerId: string,
  reply: string
) {
  await connectDB();

  const review = await Review.findOne({ _id: reviewId, ...ACTIVE_FILTER });
  if (!review) return null;

  const property = await Property.findOne({
    _id: review.propertyId,
    ownerId: toObjectId(ownerId),
    ...ACTIVE_FILTER,
  });

  if (!property) throw new Error("Not authorized to reply to this review");

  return Review.findByIdAndUpdate(
    reviewId,
    { $set: { ownerReply: reply } },
    { new: true }
  ).lean() ?? null;
}

export async function getUserReviews(userId: string) {
  await connectDB();

  return Review.find({ userId, ...ACTIVE_FILTER })
    .sort({ createdAt: -1 })
    .populate("propertyId", "name slug images")
    .lean();
}