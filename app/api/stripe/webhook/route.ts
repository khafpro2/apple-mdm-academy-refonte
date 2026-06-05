import { NextResponse } from "next/server";
import { stripeConfig, getTierFromPlanSlug } from "@/lib/pricing/stripe-config";

/** Webhook placeholder — valider signature STRIPE_WEBHOOK_SECRET */
export async function POST(request: Request) {
  if (!stripeConfig.enabled) {
    return NextResponse.json({ received: false, error: "Stripe disabled" }, { status: 503 });
  }

  const body = await request.text();
  void body;

  // Événements à gérer : checkout.session.completed, customer.subscription.updated, deleted
  return NextResponse.json({ received: true, tier: getTierFromPlanSlug("pro") });
}
