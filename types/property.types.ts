import { Types } from "mongoose";
import { IBaseDocument, IImage, ILocation, Currency } from "./common.types";

export enum PropertyStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  INACTIVE = "inactive",
}

export enum PropertyType {
  HOTEL = "hotel",
  APARTMENT = "apartment",
  GUEST_HOUSE = "guest_house",
  RESORT = "resort",
  VILLA = "villa",
  HOSTEL = "hostel",
  HOMESTAY = "homestay",
  COTTAGE = "cottage",
}

export interface IPropertyContact {
  phone: string;
  whatsapp?: string;
  email?: string;
}

export interface IProperty extends IBaseDocument {
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  location: ILocation;
  contact: IPropertyContact;
  amenities: string[];
  images: IImage[];
  rating: number;
  totalReviews: number;
  startingPrice: number;  
  isFeatured: boolean;     
  status: PropertyStatus;
  currency: Currency;
}