import { z } from "zod";
import { PropertyType, PropertyStatus } from "@/types/property.types";
import { Currency } from "@/types/common.types";
import { requiredString } from "./common.validation";

export const locationSchema = z.object({
  address: requiredString,
  city: requiredString,
  state: requiredString,
  country: requiredString,
  postalCode: z.string().trim().optional(),
  formattedAddress: z.string().trim().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const contactSchema = z.object({
  phone: requiredString,
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email").optional(),
});

const uploadedImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  isCover: z.boolean().default(false),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
});

export const createPropertySchema = z.object({
  name: z.string().trim()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  description: z.string().trim()
    .min(20, "Minimum 20 characters"),
  propertyType: z.nativeEnum(PropertyType, {
    error: "Property type is required",
  }),
  location: locationSchema,
  contact: contactSchema,
  amenities: z.array(z.string().trim()).optional().default([]),
  currency: z.nativeEnum(Currency).optional().default(Currency.USD),
  images: z.array(uploadedImageSchema).optional().default([]),
});

export const updatePropertySchema = createPropertySchema.partial();

export const updatePropertyStatusSchema = z.object({
  status: z.nativeEnum(PropertyStatus),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;