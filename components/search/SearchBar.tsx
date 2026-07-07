"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store";
import { buildSearchParams } from "@/lib/utils/search";
import { calculateTotalGuests } from "@/lib/utils/booking";
import { cn } from "@/lib/utils";
import DateRangePicker from "./DateRangePicker";
import GuestSelector from "./GuestSelector";

interface SearchBarProps {
    className?: string;
    variant?: "hero" | "compact";
}

export default function SearchBar({
    className,
    variant = "hero",
}: SearchBarProps) {
    const router = useRouter();

    const city = useSearchStore((state) => state.filters.city);
    const checkIn = useSearchStore((state) => state.filters.checkIn);
    const checkOut = useSearchStore((state) => state.filters.checkOut);
    const adults = useSearchStore((state) => state.filters.adults);
    const children = useSearchStore((state) => state.filters.children);
    const infants = useSearchStore((state) => state.filters.infants);
    const setFilter = useSearchStore((state) => state.setFilter);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestSelector, setShowGuestSelector] = useState(false);

    const totalGuests = calculateTotalGuests({ adults, children, infants });

    const handleSearch = () => {
        const queryString = buildSearchParams({
            city,
            checkIn,
            checkOut,
            adults,
            children,
            infants,
        });
        router.push(`/properties?${queryString}`);
    };

    const formatDateDisplay = (date: Date | null) =>
        date ? format(date, "MMM d") : null;

    const openDatePicker = () => {
        setShowDatePicker(true);
        setShowGuestSelector(false);
    };

    const openGuestSelector = () => {
        setShowGuestSelector(true);
        setShowDatePicker(false);
    };

    if (variant === "compact") {
        return (
            <div
                className={cn(
                    "flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-sm",
                    className
                )}
            >
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search destinations..."
                    value={city}
                    onChange={(e) => setFilter("city", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    aria-label="Search destination"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white p-1.5 rounded-full"
                    aria-label="Search"
                >
                    <Search className="h-3 w-3" />
                </button>
            </div>
        );
    }

    return (
        <div className={cn("w-full max-w-4xl mx-auto", className)}>
            <div className="bg-white rounded-2xl shadow-xl border p-2 flex flex-col lg:flex-row gap-2">
                {/* Destination */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900">Destination</p>
                        <Input
                            placeholder="Where are you going?"
                            value={city}
                            onChange={(e) => setFilter("city", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="border-0 p-0 h-auto text-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
                            aria-label="Destination"
                        />
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Check In */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openDatePicker}
                    onKeyDown={(e) => e.key === "Enter" && openDatePicker()}
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
                    aria-label="Select check-in date"
                >
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-gray-900">Check in</p>
                        <p className="text-sm text-gray-600">
                            {formatDateDisplay(checkIn) ?? (
                                <span className="text-gray-400">Add dates</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Check Out */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openDatePicker}
                    onKeyDown={(e) => e.key === "Enter" && openDatePicker()}
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
                    aria-label="Select check-out date"
                >
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-gray-900">Check out</p>
                        <p className="text-sm text-gray-600">
                            {formatDateDisplay(checkOut) ?? (
                                <span className="text-gray-400">Add dates</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-200" />

                {/* Guests */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={openGuestSelector}
                    onKeyDown={(e) => e.key === "Enter" && openGuestSelector()}
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
                    aria-label="Select guests"
                >
                    <Users className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-gray-900">Guests</p>
                        <p className="text-sm text-gray-600">
                            {totalGuests > 0 ? (
                                `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                            ) : (
                                <span className="text-gray-400">Add guests</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    size="lg"
                    className="rounded-xl gap-2 px-6 shrink-0"
                    aria-label="Search properties"
                >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </div>

            {/* Dropdowns */}
            {showDatePicker && (
                <div className="relative">
                    <DateRangePicker onClose={() => setShowDatePicker(false)} />
                </div>
            )}

            {showGuestSelector && (
                <div className="relative">
                    <GuestSelector onClose={() => setShowGuestSelector(false)} />
                </div>
            )}
        </div>
    );
}