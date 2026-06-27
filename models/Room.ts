import mongoose, { Model, Schema } from "mongoose";
import { IRoom, RoomType, BedType, RoomSizeUnit } from "@/types/room.types";
import { Currency } from "@/types/common.types";
import { schemaOptions } from "@/lib/schema-options";
import { imageSchema } from "@/models/schemas/image.schema";

const roomSchema = new Schema<IRoom>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    roomName: { type: String, required: true, trim: true },
    roomType: {
      type: String,
      enum: Object.values(RoomType),
      required: true,
    },
    bedType: {
      type: String,
      enum: Object.values(BedType),
      required: true,
    },
    beds: { type: Number, required: true, min: 1 },
    maxGuests: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USD,
    },
    roomSize: { type: Number },
    roomSizeUnit: {
      type: String,
      enum: Object.values(RoomSizeUnit),
    },
    images: [imageSchema],
    amenities: [{ type: String }], // TODO: Replace with IAmenity[] after Amenity module
    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  schemaOptions
);

// available rooms for a property
roomSchema.index({ propertyId: 1, isAvailable: 1 });

// filter by type, availability and price
roomSchema.index({ roomType: 1, isAvailable: 1, pricePerNight: 1 });

// prevent duplicate room names within the same property
roomSchema.index({ propertyId: 1, roomName: 1 }, { unique: true });

const Room: Model<IRoom> =
  mongoose.models.Room ||
  mongoose.model<IRoom>("Room", roomSchema);

export default Room;