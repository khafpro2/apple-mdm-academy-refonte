import { NextResponse } from "next/server";
import { stripeConfig } from "@/lib/pricing/stripe-config";

/** Placeholder — connecter Stripe Checkout Session côté serveur */
export async function POST(request: Request) {
  const body = (await request.json()) as { planSlug?: string };
  const planSlug = body.planSlug ?? "pro";

  if (planSlug === "enterprise") {
    return NextResponse.json({ url: "/contact-sales" });
  }

  if (!stripeConfig.enabled) {
    return NextResponse.json({
      url: `/checkout/success?demo=1&plan=${planSlug}`,
      message: "Mode démo — activer Stripe pour paiement réel",
    });
  }

  return NextResponse.json({
    url: `/checkout/success?plan=${planSlug}`,
    message: "Implémenter stripe.checkout.sessions.create() ici",
  });
}
