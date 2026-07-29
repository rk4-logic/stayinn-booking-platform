"use client";

import { useState } from "react";
import { toast } from "sonner";
import RoomSelector from "./RoomSelector";
import BookingSummary from "./BookingSummary";
import BookingConfirmation from "./BookingConfirmation";
import type { Room } from "@/types/room.types";
import type { BookingFlowProps } from "@/types/booking.types";
import { calculateNights, calculateTotalPrice } from "@/lib/utils/booking";

export type BookingStep = "select-room" | "summary" | "confirmed";

export default function BookingFlow({
    property,
    availableRooms,
    checkIn,
    checkOut,
    guestCount,
}: BookingFlowProps) {
    const [step, setStep] = useState<BookingStep>("select-room");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(false);
    const [bookingId] = useState<string | null>(null);


    const dates = { checkIn, checkOut };
    const nights = calculateNights(dates);
    const totalPrice = selectedRoom
        ? calculateTotalPrice(dates, selectedRoom.pricePerNight)
        : 0;

    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        setStep("summary");
    };

    const handleConfirmBooking = async () => {
        if (!selectedRoom) return;

        setLoading(true);

        try {
            const response = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    propertyId: String(property._id),
                    roomId: String(selectedRoom._id),
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                    adults: guestCount,
                    children: 0,
                    infants: 0,
                }),
            });

            const data = await response.json();

            // Handle server errors
            if (!response.ok) {
                toast.error(data.error || "Failed to initialize Stripe checkout.");
                return;
            }

            // Redirect user to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
                return;
            }

            toast.error("Stripe checkout URL was not returned.");
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === "confirmed" && bookingId) {
        return (
            <BookingConfirmation
                bookingId={bookingId}
                propertyName={property.name}
                roomName={selectedRoom?.roomName ?? ""}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                totalPrice={totalPrice}
                currency={property.currency}
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left — Steps */}
            <div className="flex-1">
                {step === "select-room" && (
                    <RoomSelector
                        rooms={availableRooms}
                        currency={property.currency}
                        onSelect={handleRoomSelect}
                    />
                )}

                {step === "summary" && selectedRoom && (
                    <BookingSummary
                        property={property}
                        room={selectedRoom}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        nights={nights}
                        totalPrice={totalPrice}
                        currency={property.currency}
                        loading={loading}
                        onBack={() => setStep("select-room")}
                        onConfirm={handleConfirmBooking}
                    />
                )}
            </div>

            {/* Right — Booking Info Card */}
            <aside className="w-full lg:w-72 shrink-0">
                <div className="bg-white border rounded-xl p-5 space-y-4 sticky top-24">
                    <h3 className="font-semibold text-gray-900">{property.name}</h3>
                    <p className="text-sm text-gray-500">
                        {property.location.city}, {property.location.country}
                    </p>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Check-in</span>
                            <span className="font-medium">
                                {checkIn.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Check-out</span>
                            <span className="font-medium">
                                {checkOut.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Nights</span>
                            <span className="font-medium">{nights}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Guests</span>
                            <span className="font-medium">{guestCount}</span>
                        </div>
                    </div>

                    {selectedRoom && (
                        <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Room</span>
                                <span className="font-medium">{selectedRoom.roomName}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900">
                                <span>Total</span>
                                <span>
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: property.currency,
                                        minimumFractionDigits: 0,
                                    }).format(totalPrice)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Step indicator */}
                    <div className="border-t pt-4">
                        {(() => {
                            const steps = ["select-room", "summary"];
                            const currentStepIndex = steps.indexOf(step);
                            return (
                                <>
                                    <div className="flex items-center gap-2">
                                        {steps.map((s, i) => (
                                            <div key={s} className="flex items-center gap-2">
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${i === currentStepIndex
                                                        ? "bg-blue-600 text-white"
                                                        : i < currentStepIndex
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-500"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </div>
                                                {i < steps.length - 1 && (
                                                    <div className="h-px bg-gray-200 w-8" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>Select Room</span>
                                        <span>Confirm</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            </aside>
        </div>
    );
}