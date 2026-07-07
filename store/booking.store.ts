import type { BookingStore } from "@/types/booking.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";


export const useBookingStore = create<BookingStore>()(
  devtools(
    (set) => ({
      dates: { checkIn: null, checkOut: null },
      guests: { adults: 1, children: 0, infants: 0 },
      selection: null,

      setDates: (dates) =>
        set({ dates }, false, "booking/setDates"),

      setGuests: (guests) =>
        set(
          (state) => ({ guests: { ...state.guests, ...guests } }),
          false,
          "booking/setGuests"
        ),

      setSelection: (selection) =>
        set({ selection }, false, "booking/setSelection"),

      clearBooking: () =>
        set(
          {
            dates: { checkIn: null, checkOut: null },
            guests: { adults: 1, children: 0, infants: 0 },
            selection: null,
          },
          false,
          "booking/clearBooking"
        ),
    }),
    { name: "BookingStore" }
  )
);