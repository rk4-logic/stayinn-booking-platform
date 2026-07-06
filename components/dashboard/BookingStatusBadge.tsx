import { BOOKING_STATUS_COLORS } from "@/lib/constants/status";
import { formatBookingStatus } from "@/lib/utils/formatStatus";

interface BookingStatusBadgeProps {
  status: string;
}

export default function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
        BOOKING_STATUS_COLORS[status] ?? BOOKING_STATUS_COLORS.pending
      }`}
    >
      {formatBookingStatus(status)}
    </span>
  );
}