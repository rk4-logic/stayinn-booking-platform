import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { BookingService } from "@/services/booking.service";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const booking = await BookingService.getBookingByStripeSession(sessionId);
    return NextResponse.json({ booking });
  } catch (error) {
    console.error("[GET_BOOKING_BY_SESSION_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}