import { NextResponse } from "next/server";
import { stripeConfig } from "@/lib/pricing/stripe-config";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";

import { getUser } from "@/lib/supabase/server";

/** Crée une session Stripe Checkout pour un plan donné */
export async function POST(request: Request) {
  // Auth required — only authenticated users can initiate checkout
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  if (isFreePlatformMode()) {
    return NextResponse.json(
      { error: "Paiements désactivés — plateforme en accès gratuit", url: "/pricing" },
      { status: 403 }
    );
  }
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
