import { Types } from "mongoose";
import { IBaseDocument, IImage, Currency } from "./common.types";

export enum RoomType {
  SINGLE = "single",
  DOUBLE = "double",
  SUITE = "suite",
  DELUXE = "deluxe",
  PENTHOUSE = "penthouse",
}

export enum BedType {
  SINGLE = "single",
  DOUBLE = "double",
  QUEEN = "queen",
  KING = "king",
  BUNK = "bunk",
}

export enum RoomSizeUnit {
  SQFT = "sqft",
  SQM = "sqm",
}

export interface IRoom extends IBaseDocument {
  propertyId: Types.ObjectId;
  roomName: string;
  roomType: RoomType;
  bedType: BedType;
  beds: number;
  maxGuests: number;
  pricePerNight: number;
  currency: Currency;
  roomSize?: number;
  roomSizeUnit?: RoomSizeUnit;
  images: IImage[];
  amenities: string[]; 
  isAvailable: boolean;
}