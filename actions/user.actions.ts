"use server";

import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { syncUser, getUserByClerkId } from "@/services/user.service";
import { UserRole } from "@/types/user.types";
import type { ActionResult } from "@/types/common.types";
import { connectDB } from "@/lib/db";
import User from "@/models/User";


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
  await connectDB();

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return users.map((user) => ({
    _id: user._id.toString(),
    clerkId: user.clerkId ?? "",
    email: user.email ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    imageUrl: user.imageUrl ?? "",
    role: user.role ?? "customer",
    createdAt: user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : String(user.createdAt ?? ""),
    updatedAt: user.updatedAt instanceof Date
      ? user.updatedAt.toISOString()
      : String(user.updatedAt ?? ""),
  }));
}

export async function requestOwnerRoleAction(): Promise<ActionResult<void>> {
  try {
    const user = await getAuthenticatedUser();

    if (user.role === UserRole.OWNER) {
      return { success: false, error: "You are already an owner" };
    }

    if (user.role === UserRole.ADMIN) {
      return { success: false, error: "Admins cannot become owners" };
    }

    await connectDB();
    await User.findByIdAndUpdate(user._id, {
      $set: { role: UserRole.OWNER },
    });

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<ActionResult<void>> {
  try {
    await requireRole(UserRole.ADMIN);
    await connectDB();

    await User.findByIdAndUpdate(userId, { $set: { role } });
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}