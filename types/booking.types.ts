import { Types } from "mongoose";
import { IBaseDocument, Currency } from "./common.types";

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
}