"use server";

import { revalidatePath } from "next/cache";
import { createBookingSchema } from "@/lib/validations/booking.validation";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getPropertyBookings,
  getOwnerBookings,
  cancelBooking,
  updateBookingStatus,
  updatePaymentStatus,
} from "@/services/booking.service";
import { UserRole } from "@/types/user.types";
import { BookingStatus, PaymentStatus } from "@/types/booking.types";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser, requireRole } from "./user.actions";

export async function createBookingAction(
  formData: unknown
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();

    const parsed = createBookingSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const booking = await createBooking({
      userId: user._id.toString(),
      ...parsed.data,
    });

    revalidatePath("/dashboard/bookings");
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking failed",
    };
  }
}

export async function getBookingAction(bookingId: string) {
  await getAuthenticatedUser();
  return getBookingById(bookingId);
}

export async function getUserBookingsAction(page = 1, limit = 10) {
  const user = await getAuthenticatedUser();
  return getUserBookings(user._id.toString(), page, limit);
}

export async function getPropertyBookingsAction(
  propertyId: string,
  page = 1,
  limit = 10
) {
  await getAuthenticatedUser();
  return getPropertyBookings(propertyId, page, limit);
}

export async function getOwnerBookingsAction(page = 1, limit = 10) {
  const user = await requireRole(UserRole.OWNER, UserRole.ADMIN);
  return getOwnerBookings(user._id.toString(), page, limit);
}

export async function cancelBookingAction(
  bookingId: string
): Promise<ActionResult<object>> {
  try {
    const user = await getAuthenticatedUser();
    const booking = await cancelBooking(bookingId, user._id.toString());
    if (!booking) return { success: false, error: "Booking not found" };

    revalidatePath("/dashboard/bookings");
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Cancellation failed",
    };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus
): Promise<ActionResult<object>> {
  try {
    await requireRole(UserRole.ADMIN, UserRole.OWNER);
    const booking = await updateBookingStatus(bookingId, status);
    if (!booking) return { success: false, error: "Booking not found" };

    revalidatePath("/owner/bookings");
    revalidatePath("/admin/bookings");
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}

export async function updatePaymentStatusAction(
  bookingId: string,
  paymentStatus: PaymentStatus
): Promise<ActionResult<object>> {
  try {
    await requireRole(UserRole.ADMIN);
    const booking = await updatePaymentStatus(bookingId, paymentStatus);
    if (!booking) return { success: false, error: "Booking not found" };

    revalidatePath("/admin/bookings");
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed",
    };
  }
}