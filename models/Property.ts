import mongoose, { Model, Schema } from "mongoose";
import { IProperty, PropertyStatus, PropertyType } from "@/types/property.types";
import { Currency } from "@/types/common.types";
import { schemaOptions } from "@/lib/schema-options";
import { imageSchema } from "@/models/schemas/image.schema";
import { locationSchema } from "@/models/schemas/location.schema";
import { contactSchema } from "@/models/schemas/contact.schema";

const propertySchema = new Schema<IProperty>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
      index: true,
    },
    location: { type: locationSchema, required: true },
    contact: { type: contactSchema, required: true },
    amenities: [{ type: String }], // TODO: Replace with IAmenity[] after Amenity module
    images: [imageSchema],
    // in the schema fields, update rating and startingPrice:
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      // Denormalized from reviews — never update manually, use review.service.ts
    },
    totalReviews: {
      type: Number,
      default: 0,
      // Denormalized from reviews — never update manually, use review.service.ts
    },
    startingPrice: {
      type: Number,
      default: 0,
      min: 0,
      // Denormalized from rooms — never update manually, use room.service.ts
    },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.DRAFT,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USD,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  schemaOptions
);

// weighted text search — name matches rank higher
propertySchema.index(
  { name: "text", description: "text" },
  { weights: { name: 10, description: 3 } }
);

// home page — approved properties, featured first
propertySchema.index({ status: 1, propertyType: 1, isFeatured: -1 });

// search by location
propertySchema.index({ "location.city": 1, "location.country": 1 });

// "hotels near me" — requires coordinates in GeoJSON format
propertySchema.index({ "location.coordinates": "2dsphere" });

const Property: Model<IProperty> =
  mongoose.models.Property ||
  mongoose.model<IProperty>("Property", propertySchema);

export default Property;