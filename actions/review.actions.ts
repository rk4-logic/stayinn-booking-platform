"use server";

import { revalidatePath } from "next/cache";
import {
  createReviewSchema,
  updateReviewSchema,
  ownerReplySchema,
} from "@/lib/validations/review.validation";
import {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  addOwnerReply,
  getUserReviews,
} from "@/services/review.service";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser } from "./user.actions";

export async function createReviewAction(
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const parsed = createReviewSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const review = await createReview({
      userId: user._id.toString(),
      ...parsed.data,
    });

    revalidatePath(`/properties/${parsed.data.propertyId}`);
    return { success: true, data: review };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Review failed",
    };
  }
}

export async function getPropertyReviewsAction(
  propertyId: string,
  page = 1,
  limit = 10
) {
  return getPropertyReviews(propertyId, page, limit);
}

export async function updateReviewAction(
  reviewId: string,
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const parsed = updateReviewSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const review = await updateReview(
      reviewId,
      user._id.toString(),
      parsed.data
    );
    if (!review) return { success: false, error: "Review not found" };

    revalidatePath(`/properties/${review.propertyId}`);
    return { success: true, data: review };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update review",
    };
  }
}

export async function deleteReviewAction(
  reviewId: string
): Promise<ActionResult> {
  try {
    const user = await getAuthenticatedUser();
    const review = await deleteReview(reviewId, user._id.toString());
    if (!review) return { success: false, error: "Review not found" };

    revalidatePath(`/properties/${review.propertyId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete review",
    };
  }
}

export async function addOwnerReplyAction(
  reviewId: string,
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const parsed = ownerReplySchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const review = await addOwnerReply(
      reviewId,
      user._id.toString(),
      parsed.data.reply
    );
    if (!review) return { success: false, error: "Review not found" };

    return { success: true, data: review };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add reply",
    };
  }
}

export async function getUserReviewsAction() {
  const user = await getAuthenticatedUser();
  return getUserReviews(user._id.toString());
}