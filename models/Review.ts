import mongoose, { Model, Schema } from "mongoose";
import { IReview } from "@/types/review.types";
import { schemaOptions } from "@/lib/schema-options";

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // one review per booking only
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true, minlength: 10 },
    ownerReply: { type: String, trim: true },
    verifiedStay: {
      type: Boolean,
      default: false,
      // NOTE: set by review.service.ts only — never set manually
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  schemaOptions
);

// property page — newest reviews first
reviewSchema.index({ propertyId: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", reviewSchema);

export default Review;