export interface IImage {
  url: string;
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
  isCover: boolean;
}

export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  coordinates: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface IBaseDocument {
  _id: import("mongoose").Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export enum Currency {
  USD = "USD",
  GBP = "GBP",
  EUR = "EUR",
  INR = "INR",
}