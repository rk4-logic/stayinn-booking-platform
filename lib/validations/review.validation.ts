import { z } from "zod";
import { objectIdSchema } from "./common.validation";

export const createReviewSchema = z.object({
  bookingId: objectIdSchema,
  propertyId: objectIdSchema,
  rating: z.number().int().min(1, "Min rating is 1").max(5, "Max rating is 5"),
  review: z.string().trim()
    .min(10, "Minimum 10 characters")
    .max(1000, "Maximum 1000 characters"),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().trim().min(10).max(1000).optional(),
});

export const ownerReplySchema = z.object({
  reply: z.string().trim()
    .min(1, "Reply cannot be empty")
    .max(500, "Maximum 500 characters"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type OwnerReplyInput = z.infer<typeof ownerReplySchema>;