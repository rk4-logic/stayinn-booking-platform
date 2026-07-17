import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { UserRole } from "@/types/user.types";
import type { ClerkUserData } from "@/types/user.types";

export async function getUserByClerkId(clerkId: string) {
  await connectDB();
  return User.findOne({ clerkId }).lean();
}

export async function syncUser(data: ClerkUserData) {
  await connectDB();

  // 1. Build $set dynamically with ONLY provided fields
  const updateFields: Record<string, string> = {
    email: data.email,
  };

  if (data.firstName) updateFields.firstName = data.firstName;
  if (data.lastName) updateFields.lastName = data.lastName;
  if (data.imageUrl) updateFields.imageUrl = data.imageUrl;

  // 2. Perform atomic insert/update query
  return User.findOneAndUpdate(
    { clerkId: data.clerkId },
    {
      $set: updateFields,
      $setOnInsert: {
        clerkId: data.clerkId,
        role: UserRole.CUSTOMER, // Set default role ONLY on creation
      },
    },
    {
      new: true,   // Return the updated document instead of the original
      upsert: true, // Create a new document if it doesn't exist
    }
  );
}

export async function deleteUser(clerkId: string) {
  await connectDB();
  return User.findOneAndDelete({ clerkId });
}