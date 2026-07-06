"use server";

import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser, getUserByClerkId } from "@/services/user.service";
import { UserRole } from "@/types/user.types";

export async function syncCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("User email not found");

  return syncUser({
    clerkId: clerkUser.id,
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  });
}

export async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await getUserByClerkId(userId);
  if (!user) throw new Error("User not found");

  return user;
}

export async function requireRole(...roles: UserRole[]) {
  const user = await getAuthenticatedUser();

  if (!roles.includes(user.role as UserRole)) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function getUsersAction() {
  await requireRole(UserRole.ADMIN);

  const { connectDB } = await import("@/lib/db");
  const User = (await import("@/models/User")).default;

  await connectDB();

  return User.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
}