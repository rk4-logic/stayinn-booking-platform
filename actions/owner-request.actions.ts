"use server";

import { connectDB } from "@/lib/db";
import OwnerRequest from "@/models/OwnerRequest";
import User from "@/models/User";
import { UserRole } from "@/types/user.types";
import { getAuthenticatedUser, requireRole } from "@/actions/user.actions";
import type { ActionResult } from "@/types/common.types";
import { revalidatePath } from "next/cache";
import { OwnerRequestStatus } from "@/lib/constants/status";
import type { IOwnerRequest, OwnerRequestType, SubmitOwnerRequestData } from "@/types/owner.types";

type PopulatedOwnerRequest = Omit<IOwnerRequest, "userId"> & {
  userId: {
    firstName?: string;
    lastName?: string;
    email?: string;
    imageUrl?: string;
  } | null;
};

export async function submitOwnerRequestAction(
  data: SubmitOwnerRequestData
): Promise<ActionResult<void>> {
  try {
    const user = await getAuthenticatedUser();

    if (user.role === UserRole.OWNER) {
      return { success: false, error: "You are already an owner" };
    }

    if (user.role === UserRole.ADMIN) {
      return { success: false, error: "Admins cannot request owner role" };
    }

    await connectDB();

    // check if already submitted
    const existing = await OwnerRequest.findOne({
      userId: user._id,
    });

    if (existing && existing.status === OwnerRequestStatus.PENDING) {
      return {
        success: false,
        error: "You already have a pending request",
      };
    }

    if (existing) {
      // update existing rejected request
      await OwnerRequest.findByIdAndUpdate(existing._id, {
        $set: { ...data, status: OwnerRequestStatus.PENDING },
      });
    } else {
      await OwnerRequest.create({ userId: user._id, ...data });
    }

    revalidatePath("/dashboard/become-owner");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function getOwnerRequestsAction(): Promise<OwnerRequestType[]> {
  try {
    await requireRole(UserRole.ADMIN);
    await connectDB();

    // 1. Fetch using lean for high performance
    const records = await OwnerRequest.find({})
      .populate("userId", "firstName lastName email imageUrl")
      .sort({ createdAt: -1 })
      .lean();

    // 2. Explicitly map fields to match the 'OwnerRequest' interface exactly
    return (records as unknown as PopulatedOwnerRequest[]).map((record) => ({
      _id: record._id.toString(), 
      businessName: record.businessName,
      phone: record.phone,
      country: record.country,
      reason: record.reason,
      status: record.status,
      createdAt: record.createdAt instanceof Date 
        ? record.createdAt.toISOString() 
        : String(record.createdAt),
      userId: record.userId ? {
        firstName: record.userId.firstName ?? "",
        lastName: record.userId.lastName ?? "",
        email: record.userId.email ?? "",
        imageUrl: record.userId.imageUrl ?? ""
      } : null
    }));

  } catch (error) {
    console.error("❌ Production Log — Failed to fetch owner requests:", error);
    return [];
  }
}

export async function getUserOwnerRequestAction() {
  try {
    const user = await getAuthenticatedUser();
    await connectDB();

    return OwnerRequest.findOne({ userId: user._id }).lean();
  } catch {
    return null;
  }
}

export async function reviewOwnerRequestAction(
  requestId: string,
  status: OwnerRequestStatus.APPROVED | OwnerRequestStatus.REJECTED
): Promise<ActionResult<void>> {
  try {
    const admin = await requireRole(UserRole.ADMIN);
    await connectDB();

    const request = await OwnerRequest.findById(requestId);
    if (!request) return { success: false, error: "Request not found" };

    await OwnerRequest.findByIdAndUpdate(requestId, {
      $set: {
        status,
        reviewedBy: admin._id,
        reviewedAt: new Date(),
      },
    });

    // if approved, update user role
    if (status === OwnerRequestStatus.APPROVED) {
      await User.findByIdAndUpdate(request.userId, {
        $set: { role: UserRole.OWNER },
      });
    }

    revalidatePath("/admin/owner-requests");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}