import mongoose, { Model, Schema } from "mongoose";
import { IBooking, BookingStatus, PaymentStatus } from "@/types/booking.types";
import { Currency } from "@/types/common.types";
import { schemaOptions } from "@/lib/schema-options";
import { guestsSchema } from "@/models/schemas/guests.schema";

const bookingSchema = new Schema<IBooking>(
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
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: guestsSchema, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USD,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  schemaOptions
);

// customer dashboard
bookingSchema.index({ userId: 1, status: 1 });

// owner dashboard
bookingSchema.index({ propertyId: 1, status: 1 });

// availability check — status excludes cancelled bookings
bookingSchema.index({ roomId: 1, status: 1, checkIn: 1, checkOut: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;