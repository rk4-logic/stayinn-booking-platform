import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import PendingCheckout from "@/models/pendingChechout";
import { checkRoomAvailability } from "@/services/room.service";
import { BookingStatus, PaymentStatus } from "@/types/booking.types";
import type { Currency } from "@/types/common.types";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const pendingCheckoutId = session.metadata?.pendingCheckoutId;

    if (!pendingCheckoutId) {
      return NextResponse.json({ received: true });
    }

    // Idempotency check: Don't process the same event twice
    const existingBooking = await Booking.findOne({ stripeSessionId: session.id });
    if (existingBooking) {
      console.log(`Booking for session ${session.id} already exists.`);
      return NextResponse.json({ received: true });
    }

    const pending = await PendingCheckout.findById(pendingCheckoutId);
    if (!pending || pending.status === "completed") {
      return NextResponse.json({ received: true });
    }

    // ⚡ CRITICAL RE-CHECK: Webhook safety lock to prevent double bookings
    const stillAvailable = await checkRoomAvailability(pending.roomId.toString(), pending.checkIn, pending.checkOut);

    if (!stillAvailable) {
      console.warn(`🚨 Race Condition! Overbooking blocked for Room: ${pending.roomId}`);

      if (session.payment_intent) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
          reason: "requested_by_customer"
        });
      }

      pending.status = "failed_overbooked";
      await pending.save();
      
      return NextResponse.json({ received: true, error: "Overbooked_Refunded" });
    }

    // All clear! Create the real booking entry
    await Booking.create({
      userId: pending.userId,
      propertyId: pending.propertyId,
      roomId: pending.roomId,
      checkIn: pending.checkIn,
      checkOut: pending.checkOut,
      guests: pending.guests,
      totalPrice: pending.totalPrice,
      currency: pending.currency as Currency,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      stripeSessionId: session.id,
      stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      paidAt: new Date(),
    });

    pending.status = "completed";
    await pending.save();
  }

  return NextResponse.json({ received: true });
}