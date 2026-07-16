import type { OwnerRequestStatus } from "@/lib/constants/status";
import type mongoose from "mongoose";

export interface IOwnerRequest {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessName: string;
  phone: string;
  country: string;
  reason: string;
  status: OwnerRequestStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmitOwnerRequestData {
  businessName: string;
  phone: string;
  country: string;
  reason: string;
}

export interface OwnerRequestType {
  _id: string;
  businessName: string;
  phone: string;
  country: string;
  reason: string;
  status: string;
  createdAt: Date | string;
  userId: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}