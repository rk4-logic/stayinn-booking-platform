import { z } from "zod";
import { UserRole } from "@/types/user.types";

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole, { error: "Role is required" }),
});

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;