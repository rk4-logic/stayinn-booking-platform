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

  // 1. Mirror Clerk identity fields exactly
  // Empty string is a valid update (user intentionally cleared the field)
  const updateFields = {
    email: data.email,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    imageUrl: data.imageUrl ?? "",
  };

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
      returnDocument: 'after',
      upsert: true, // Create a new document if it doesn't exist
    }
  );
}

export async function deleteUser(clerkId: string) {
  await connectDB();
  return User.findOneAndDelete({ clerkId });
}