import { Building2, Users, FileCheck, CalendarDays, LayoutDashboard } from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Properties",
    href: "/properties",
    visibility: "public",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    visibility: "authenticated",
  },
  {
    label: "List Property",
    href: "/dashboard/become-owner",
    visibility: "authenticated",
  },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const ADMIN_NAV = [
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Owner Requests", href: "/admin/owner-requests", icon: FileCheck },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Users", href: "/admin/users", icon: Users },
];

export const OWNER_NAV = [
  { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { label: "My Properties", href: "/owner/properties", icon: Building2 },
  { label: "Bookings", href: "/owner/bookings", icon: CalendarDays },
];