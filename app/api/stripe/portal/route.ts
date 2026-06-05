import { NextResponse } from "next/server";
import { stripeConfig } from "@/lib/pricing/stripe-config";

export async function POST() {
  if (!stripeConfig.enabled) {
    return NextResponse.json(
      { error: "Stripe non configuré", url: "/account/billing" },
      { status: 503 }
    );
  }
  return NextResponse.json({
    url: "/account/billing",
    message: "Implémenter stripe.billingPortal.sessions.create() ici",
  });
}
