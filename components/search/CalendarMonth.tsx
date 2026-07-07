import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import CalendarDay from "./CalendarDay";
import {
  isPastDate,
  isStartDate,
  isEndDate,
  isSelectedDate,
  isInDateRange,
} from "@/lib/utils/calendar";

interface CalendarMonthProps {
  month: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  hoveredDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
}

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarMonth({
  month,
  checkIn,
  checkOut,
  hoveredDate,
  onDateClick,
  onDateHover,
}: CalendarMonthProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  const firstDayOfWeek = startOfMonth(month).getDay();

  return (
    <div className="flex-1">
      <h3 className="text-center font-semibold text-gray-900 mb-4">
        {format(month, "MMMM yyyy")}
      </h3>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-400 font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            isPast={isPastDate(date)}
            isSelected={isSelectedDate(date, checkIn, checkOut)}
            isInRange={isInDateRange(date, checkIn, checkOut, hoveredDate)}
            isStart={isStartDate(date, checkIn)}
            isEnd={isEndDate(date, checkOut)}
            onClick={() => onDateClick(date)}
            onMouseEnter={() => onDateHover(date)}
            onMouseLeave={() => onDateHover(null)}
          />
        ))}
      </div>
    </div>
  );
}