import mongoose, { Model, Schema } from "mongoose";
import { schemaOptions } from "@/lib/schema-options";
import { OwnerRequestStatus } from "@/lib/constants/status";
import type { IOwnerRequest } from "@/types/owner.types";

const ownerRequestSchema = new Schema<IOwnerRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one request per user
    },
    businessName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(OwnerRequestStatus),
      default: OwnerRequestStatus.PENDING,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  schemaOptions
);

const OwnerRequest: Model<IOwnerRequest> =
  mongoose.models.OwnerRequest ||
  mongoose.model<IOwnerRequest>("OwnerRequest", ownerRequestSchema);

export default OwnerRequest;