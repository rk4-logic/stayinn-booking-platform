"use client";

import { useEffect, useRef } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store";
import { calculateTotalGuests } from "@/lib/utils/booking";

interface GuestSelectorProps {
  onClose: () => void;
}

interface GuestType {
  key: "adults" | "children" | "infants";
  label: string;
  description: string;
  min: number;
  max: number;
}

const GUEST_TYPES: GuestType[] = [
  {
    key: "adults",
    label: "Adults",
    description: "Ages 13 or above",
    min: 1,
    max: 16,
  },
  {
    key: "children",
    label: "Children",
    description: "Ages 2–12",
    min: 0,
    max: 10,
  },
  {
    key: "infants",
    label: "Infants",
    description: "Under 2",
    min: 0,
    max: 5,
  },
];

export default function GuestSelector({ onClose }: GuestSelectorProps) {
  const adults = useSearchStore((state) => state.filters.adults);
  const children = useSearchStore((state) => state.filters.children);
  const infants = useSearchStore((state) => state.filters.infants);
  const setFilter = useSearchStore((state) => state.setFilter);
  const ref = useRef<HTMLDivElement>(null);

  const guests = { adults, children, infants };
  const total = calculateTotalGuests(guests);

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

  const handleChange = (
    key: "adults" | "children" | "infants",
    delta: number,
    min: number,
    max: number
  ) => {
    const current = guests[key];
    const next = current + delta;
    if (next >= min && next <= max) {
      setFilter(key, next);
    }
  };

  const handleClear = () => {
    setFilter("adults", 1);
    setFilter("children", 0);
    setFilter("infants", 0);
  };

  return (
    <div
      ref={ref}
      className="absolute top-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border p-6 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Guests</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close guest selector"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Guest types */}
      <div className="space-y-5">
        {GUEST_TYPES.map(({ key, label, description, min, max }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleChange(key, -1, min, max)}
                disabled={guests[key] <= min}
                aria-label={`Decrease ${label}`}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-4 text-center text-sm font-medium">
                {guests[key]}
              </span>
              <button
                onClick={() => handleChange(key, 1, min, max)}
                disabled={guests[key] >= max}
                aria-label={`Increase ${label}`}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-600 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <button
          className="text-sm text-gray-500 underline hover:text-gray-700"
          onClick={handleClear}
        >
          Clear
        </button>
        <Button onClick={onClose}>
          {total} guest{total !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
}