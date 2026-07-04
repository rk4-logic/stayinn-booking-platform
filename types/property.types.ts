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

export interface PropertyCardData {
  _id: string;
  name: string;
  slug: string;
  location: {
    city: string;
    country: string;
  };
  images: { url: string; publicId: string; isCover: boolean }[];
  rating: number;
  totalReviews: number;
  startingPrice: number;
  currency: string;
  propertyType: PropertyType;
}

export interface PropertySearchFilters {
  city?: string;
  country?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export type PropertyCardInput = Pick<IProperty, "_id" | "name" | "slug" | "location" | "images" | "rating" | "totalReviews" | "startingPrice" | "currency" | "propertyType">;

export interface GalleryImage {
  url: string;
  alt?: string;
  isCover: boolean;
}

export interface PropertyGalleryProps {
  images: GalleryImage[];
  name: string;
}

export interface PropertyInfoProps {
  property: {
    name: string;
    description: string;
    propertyType: string;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      formattedAddress?: string;
    };
    contact: {
      phone: string;
      whatsapp?: string;
      email?: string;
    };
    amenities: string[];
    rating: number;
    totalReviews: number;
  };
}