import { NextResponse } from "next/server";
import { stripeConfig } from "@/lib/pricing/stripe-config";

/** Placeholder — connecter Stripe Checkout Session côté serveur */
export async function POST(request: Request) {
  if (!stripeConfig.enabled) {
    return NextResponse.json(
      { error: "Stripe non configuré", message: "Définissez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY et STRIPE_SECRET_KEY" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { planSlug?: string };
  const planSlug = body.planSlug ?? "pro";

  return NextResponse.json({
    url: `/pricing?checkout=pending&plan=${planSlug}`,
    message: "Implémenter stripe.checkout.sessions.create() ici",
  });
}
