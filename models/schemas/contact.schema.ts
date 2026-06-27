import { Schema } from "mongoose";

export const contactSchema = new Schema(
  {
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String },
  },
  { _id: false }
);