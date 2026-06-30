import { z } from "zod";
import { Currency } from "@/types/common.types";
import { objectIdSchema } from "./common.validation";

export const guestsSchema = z.object({
  adults: z.number().int().min(1, "At least 1 adult required"),
  children: z.number().int().min(0).optional().default(0),
  infants: z.number().int().min(0).optional().default(0),
});

export const createBookingSchema = z
  .object({
    propertyId: objectIdSchema,
    roomId: objectIdSchema,
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: guestsSchema,
    pricePerNight: z.number().min(0),
    currency: z.nativeEnum(Currency).optional().default(Currency.USD),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.checkIn < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-in cannot be in the past",
        path: ["checkIn"],
      });
    }

    if (data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Check-out must be after check-in",
        path: ["checkOut"],
      });
    }
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;