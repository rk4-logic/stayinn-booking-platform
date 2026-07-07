import {
  isSameDay,
  isWithinInterval,
  isBefore,
  startOfDay,
} from "date-fns";

export function isPastDate(date: Date): boolean {
  return isBefore(date, startOfDay(new Date()));
}

export function isStartDate(date: Date, checkIn: Date | null): boolean {
  return checkIn ? isSameDay(date, checkIn) : false;
}

export function isEndDate(date: Date, checkOut: Date | null): boolean {
  return checkOut ? isSameDay(date, checkOut) : false;
}

export function isSelectedDate(
  date: Date,
  checkIn: Date | null,
  checkOut: Date | null
): boolean {
  return isStartDate(date, checkIn) || isEndDate(date, checkOut);
}

export function isInDateRange(
  date: Date,
  checkIn: Date | null,
  checkOut: Date | null,
  hoveredDate: Date | null
): boolean {
  if (checkIn && checkOut) {
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  }
  if (checkIn && hoveredDate && !checkOut) {
    const start = isBefore(hoveredDate, checkIn) ? hoveredDate : checkIn;
    const end = isBefore(hoveredDate, checkIn) ? checkIn : hoveredDate;
    return isWithinInterval(date, { start, end });
  }
  return false;
}