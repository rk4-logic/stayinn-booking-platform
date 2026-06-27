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