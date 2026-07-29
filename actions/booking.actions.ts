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
  BookingService,
} from "@/services/booking.service";
import { UserRole } from "@/types/user.types";
import { BookingStatus, PaymentStatus, type BookingListItem } from "@/types/booking.types";
import { type ActionResult } from "@/types/common.types";
import { getAuthenticatedUser, requireRole } from "./user.actions";
import { serializeData } from "@/lib/utils/serialize";
import { auth } from "@clerk/nextjs/server";

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
  const booking = await getBookingById(bookingId);
  return serializeData(booking);
}

export async function getUserBookingsAction(page = 1, limit = 10) {
  const user = await getAuthenticatedUser();
  const result = await getUserBookings(user._id.toString(), page, limit);
  return serializeData(result);
}

export async function getPropertyBookingsAction(
  propertyId: string,
  page = 1,
  limit = 10
) {
  await getAuthenticatedUser();
  const result = await getPropertyBookings(propertyId, page, limit);
  return serializeData(result);
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

export async function getOwnerSideBookingsAction(): Promise<{
  success: boolean;
  bookings?: BookingListItem[];
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const bookings = await BookingService.getOwnerBookings(userId);
    return { success: true, bookings };
  } catch (error) {
    console.error("[GET_OWNER_BOOKINGS_ERROR]", error);
    return { success: false, error: "Failed to fetch owner bookings." };
  }
}

export async function getAdminBookingsAction(): Promise<{
  success: boolean;
  bookings?: BookingListItem[];
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    // You can add admin role validation check here if applicable
    const bookings = await BookingService.getAdminBookings();
    return { success: true, bookings };
  } catch (error) {
    console.error("[GET_ADMIN_BOOKINGS_ERROR]", error);
    return { success: false, error: "Failed to fetch admin bookings." };
  }
}