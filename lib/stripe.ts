import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
}

// Initializes using the reliable SDK-provided baseline defaults
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;