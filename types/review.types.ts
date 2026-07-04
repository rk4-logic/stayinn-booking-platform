import { IBaseDocument } from "./common.types";
import { Types } from "mongoose";

export interface IReview extends IBaseDocument {
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  bookingId: Types.ObjectId; 
  rating: number;
  review: string;  
  ownerReply?: string;       
  verifiedStay: boolean;
}

export interface Review {
  _id: unknown;
  review: string;
  rating: number;
  createdAt: Date | string;
  verifiedStay: boolean;
  userId: unknown;
}

export interface ReviewListProps {
  reviews: Review[];
  rating: number;
  totalReviews: number;
}