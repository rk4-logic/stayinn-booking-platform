import { PropertyType } from "@/types/property.types";

export const PROPERTY_TYPE_OPTIONS = [
  { label: "All Types", value: "all" },
  { label: "Hotel", value: PropertyType.HOTEL },
  { label: "Apartment", value: PropertyType.APARTMENT },
  { label: "Villa", value: PropertyType.VILLA },
  { label: "Resort", value: PropertyType.RESORT },
  { label: "Guest House", value: PropertyType.GUEST_HOUSE },
  { label: "Hostel", value: PropertyType.HOSTEL },
  { label: "Homestay", value: PropertyType.HOMESTAY },
  { label: "Cottage", value: PropertyType.COTTAGE },
] as const;