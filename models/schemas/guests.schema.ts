import { Schema } from "mongoose";

export const guestsSchema = new Schema(
  {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    infants: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);