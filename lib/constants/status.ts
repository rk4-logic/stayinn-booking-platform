export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-green-100 text-green-700",
  checked_out: "bg-gray-100 text-gray-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const PROPERTY_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  inactive: "bg-gray-100 text-gray-500",
};

export const ROLE_COLORS: Record<string, string> = {
  customer: "bg-gray-100 text-gray-700",
  owner: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
};