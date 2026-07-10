import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserBookingsAction,
  getBookingAction,
  cancelBookingAction,
} from "@/actions/booking.actions";

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...bookingKeys.lists(), { page, limit }] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
};

export function useUserBookings(page = 1, limit = 10) {
  return useQuery({
    queryKey: bookingKeys.list(page, limit),
    queryFn: () => getUserBookingsAction(page, limit),
    staleTime: 60 * 1000,
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => getBookingAction(bookingId),
    enabled: !!bookingId,
    staleTime: 60 * 1000,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBookingAction(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}