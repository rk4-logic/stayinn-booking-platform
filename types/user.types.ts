import type { Types } from "mongoose";
import type { IBaseDocument } from "./common.types";

export enum UserRole {
  CUSTOMER = "customer",
  OWNER = "owner",
  ADMIN = "admin",
}

export interface IUser extends IBaseDocument {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: UserRole;
}

export interface SyncUserData {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

export interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

export interface PopulatedUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
}