import Stripe from "stripe";

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly";

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
}
