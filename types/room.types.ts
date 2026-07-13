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

export interface Room {
  _id: unknown;
  roomName: string;
  roomType: string;
  bedType: string;
  beds: number;
  maxGuests: number;
  pricePerNight: number;
  amenities?: string[];
  isAvailable: boolean;
}

export interface RoomSelectorProps {
  rooms: Room[];
  currency: string;
  onSelect: (room: Room) => void;
}

export interface RoomListProps {
  rooms: Room[];
  propertyId: string;
  currency: string;
}

export interface RoomManagerProps {
  propertyId: string;
  rooms: Room[];
  currency: string;
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