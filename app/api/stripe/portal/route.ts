import { NextResponse } from "next/server";
import { stripeConfig } from "@/lib/pricing/stripe-config";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";
import { getUser } from "@/lib/supabase/server";

export async function POST() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  if (isFreePlatformMode()) {
    return NextResponse.json(
      { error: "Facturation désactivée — accès gratuit", url: "/dashboard" },
      { status: 403 }
    );
  }
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
