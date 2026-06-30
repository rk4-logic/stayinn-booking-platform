import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .length(24, "Invalid ID")
  .regex(/^[0-9a-fA-F]+$/, "Invalid ID");

export const requiredString = z.string().trim().min(1, "Required");

export const positiveInt = z.number().int().positive();

export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;