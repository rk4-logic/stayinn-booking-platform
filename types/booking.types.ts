import mongoose, { Types } from "mongoose";
import { IBaseDocument, Currency } from "./common.types";
import type { Property } from "./property.types";
import type { Room } from "./room.types";
import type { PopulatedUser } from "./user.types";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  UNPAID = "unpaid",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  REFUNDED = "refunded",
}

export interface IGuests {
  adults: number;
  children: number;
  infants: number;
}

export interface IBooking extends IBaseDocument {
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  roomId: Types.ObjectId; 
  checkIn: Date;
  checkOut: Date;
  guests: IGuests;
  totalPrice: number;
  currency: Currency;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: Date;
}

export interface CreateBookingData {
  userId: string;
  propertyId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children?: number;
    infants?: number;
  };
  pricePerNight: number;
  currency?: IBooking["currency"];
}

export interface BookingWidgetProps {
  propertyId: string;
  currency: string;
}

export interface BookingListItem {
  _id: string;
  checkIn: Date | string;
  checkOut: Date | string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  currency: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  propertyId: {
    name?: string;
    location?: {
      city?: string;
      country?: string;
    };
  } | null;
  roomId: {
    roomName?: string;
    roomType?: string;
  } | null;

  userId?: PopulatedUser | string;
}

export interface BookingDates {
  checkIn: Date | null;
  checkOut: Date | null;
}

export interface BookingGuests {
  adults: number;
  children: number;
  infants: number;
}

export interface BookingSelection {
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomName: string;
  pricePerNight: number;
  currency: Currency;
}

export interface BookingFlowProps {
  property: Property;
  availableRooms: Room[];
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
}

export interface BookingStore {
  dates: BookingDates;
  guests: BookingGuests;
  selection: BookingSelection | null;
  setDates: (dates: BookingDates) => void;
  setGuests: (guests: Partial<BookingGuests>) => void;
  setSelection: (selection: BookingSelection) => void;
  clearBooking: () => void;
}

export interface BookingConfirmationProps {
  bookingId: string;
  propertyName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  currency: string;
}

export interface IPendingCheckout {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalPrice: number;
  currency: string;
  stripeSessionId?: string;
  status: "pending" | "failed_overbooked" | "completed";
  createdAt: Date;
  updatedAt: Date;
}