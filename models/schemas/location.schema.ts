import { Schema } from "mongoose";

export const locationSchema = new Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
    formattedAddress: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    // GeoJSON for "hotels near me" — 2dsphere index on Property model
    coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
},
  },
  { _id: false }
);