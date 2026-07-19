import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import Room from "@/models/Room";
import User from "@/models/User";
import PendingCheckout from "@/models/pendingChechout";
import { checkRoomAvailability } from "@/services/room.service";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId, roomId, checkIn, checkOut, adults, children, infants } = await req.json();

    if (!propertyId || !roomId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User account not found in database" }, { status: 404 });
    }

    const [property, room] = await Promise.all([
      Property.findById(propertyId).lean(),
      Room.findById(roomId).lean(),
    ]);

    if (!property || !room) {
      return NextResponse.json({ error: "Property or room details not found" }, { status: 404 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Initial check before opening checkout
    const isAvailable = await checkRoomAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return NextResponse.json({ error: "Room is no longer available for these dates" }, { status: 409 });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / msPerDay);
    const totalPrice = nights * room.pricePerNight;

    // Create tracking document inside our db
    const pendingCheckout = await PendingCheckout.create({
      userId: user._id,
      propertyId,
      roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: { adults: adults || 1, children: children || 0, infants: infants || 0 },
      totalPrice,
      currency: room.currency,
      status: "pending"
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: room.currency.toLowerCase(),
            product_data: {
              name: `${property.name} — ${room.roomName}`,
              description: `${nights} night(s) | Check-in: ${checkInDate.toDateString()} | Check-out: ${checkOutDate.toDateString()}`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { 
        pendingCheckoutId: pendingCheckout._id.toString() 
      },
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/booking/cancelled`,
    });

    pendingCheckout.stripeSessionId = session.id;
    await pendingCheckout.save();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to initialize payment gateway" }, { status: 500 });
  }
}