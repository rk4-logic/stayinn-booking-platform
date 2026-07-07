"use client";

import { useState } from "react";
import { format, addMonths, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store";
import CalendarMonth from "./CalendarMonth";
import { useEffect, useRef } from "react";

interface DateRangePickerProps {
  onClose: () => void;
}

export default function DateRangePicker({ onClose }: DateRangePickerProps) {
  const checkIn = useSearchStore((state) => state.filters.checkIn);
  const checkOut = useSearchStore((state) => state.filters.checkOut);
  const setFilter = useSearchStore((state) => state.setFilter);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const nextMonth = addMonths(currentMonth, 1);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setFilter("checkIn", date);
      setFilter("checkOut", null);
    } else {
      if (isBefore(date, checkIn)) {
        setFilter("checkIn", date);
        setFilter("checkOut", null);
      } else {
        setFilter("checkOut", date);
      }
    }
  };

  const handleClear = () => {
    setFilter("checkIn", null);
    setFilter("checkOut", null);
  };

  return (
    <div
      ref={ref}
      className="absolute top-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border p-6 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {checkIn && (
            <span className="font-medium">{format(checkIn, "MMM d")}</span>
          )}
          {checkIn && checkOut && <span>→</span>}
          {checkOut && (
            <span className="font-medium">{format(checkOut, "MMM d")}</span>
          )}
          {!checkIn && (
            <span className="text-gray-400">Select check-in date</span>
          )}
          {checkIn && !checkOut && (
            <span className="text-gray-400">Select check-out date</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close date picker"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Two month calendar */}
      <div className="flex gap-8">
        <CalendarMonth
          month={currentMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          hoveredDate={hoveredDate}
          onDateClick={handleDateClick}
          onDateHover={setHoveredDate}
        />
        <div className="w-px bg-gray-200" />
        <CalendarMonth
          month={nextMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          hoveredDate={hoveredDate}
          onDateClick={handleDateClick}
          onDateHover={setHoveredDate}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <button
          className="text-sm text-gray-500 underline hover:text-gray-700"
          onClick={handleClear}
        >
          Clear dates
        </button>
        <Button onClick={onClose} disabled={!checkIn || !checkOut}>
          Apply dates
        </Button>
      </div>
    </div>
  );
}