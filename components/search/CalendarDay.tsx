import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  date: Date;
  isPast: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function CalendarDay({
  date,
  isPast,
  isSelected,
  isInRange,
  isStart,
  isEnd,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CalendarDayProps) {
  return (
    <div
      role="button"
      tabIndex={isPast ? -1 : 0}
      aria-label={format(date, "MMMM d, yyyy")}
      aria-disabled={isPast}
      className={cn(
        "relative h-10 flex items-center justify-center text-sm transition-colors",
        isInRange && !isSelected && "bg-blue-50",
        isStart && "rounded-l-full",
        isEnd && "rounded-r-full",
        isPast && "text-gray-300 cursor-not-allowed",
        !isPast && !isSelected && "hover:bg-gray-100 rounded-full cursor-pointer",
        isSelected && "bg-blue-600 text-white rounded-full font-medium z-10"
      )}
      onClick={() => !isPast && onClick()}
      onMouseEnter={() => !isPast && onMouseEnter()}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isPast) onClick();
      }}
    >
      {format(date, "d")}
    </div>
  );
}