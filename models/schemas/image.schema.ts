import { Schema } from "mongoose";

export const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number },
    isCover: { type: Boolean, default: false },
  },
  { _id: false }
);