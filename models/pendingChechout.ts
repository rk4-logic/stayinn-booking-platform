import type { IPendingCheckout } from "@/types/booking.types";
import mongoose, { Schema, Model } from "mongoose";

const PendingCheckoutSchema = new Schema<IPendingCheckout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },
    totalPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    stripeSessionId: { type: String, index: true },
    status: { 
      type: String, 
      enum: ["pending", "failed_overbooked", "completed"], 
      default: "pending" 
    },
  },
  {
    timestamps: true,
  }
);

const PendingCheckout: Model<IPendingCheckout> = 
  mongoose.models.PendingCheckout || mongoose.model<IPendingCheckout>("PendingCheckout", PendingCheckoutSchema);

export default PendingCheckout;