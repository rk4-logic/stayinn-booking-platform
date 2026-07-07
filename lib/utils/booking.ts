import { differenceInCalendarDays } from "date-fns";
import type { BookingDates, BookingGuests } from "@/types/booking.types";

export function calculateNights(dates: BookingDates): number {
  if (!dates.checkIn || !dates.checkOut) return 0;
  const nights = differenceInCalendarDays(dates.checkOut, dates.checkIn);
  return nights > 0 ? nights : 0;
}

export function calculateTotalPrice(
  dates: BookingDates,
  pricePerNight: number
): number {
  return calculateNights(dates) * pricePerNight;
}

export function calculateTotalGuests(guests: BookingGuests): number {
  return guests.adults + guests.children + guests.infants;
}