export enum UserRole {
  CUSTOMER = "customer",
  OWNER = "owner",
  ADMIN = "admin",
}

export interface IUser {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncUserData {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}