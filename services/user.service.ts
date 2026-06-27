import User from "@/models/User";
import { connectDB } from "@/lib/db";
import type { SyncUserData } from "@/types/user.types";

export async function getUserByClerkId(clerkId: string) {
  await connectDB();

  return User.findOne({ clerkId }).lean();
}

export async function createUser(data: SyncUserData) {
  await connectDB();

  return User.create({
    clerkId: data.clerkId,
    email: data.email,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    imageUrl: data.imageUrl ?? "",
  });
}

export async function syncUser(data: SyncUserData) {
  await connectDB();

  const existingUser = await User.findOne({
    clerkId: data.clerkId,
  });

  if (existingUser) {
    return existingUser;
  }

  return createUser(data);
}

export async function deleteUser(clerkId: string) {
  await connectDB();
  return User.findOneAndDelete({ clerkId });
}