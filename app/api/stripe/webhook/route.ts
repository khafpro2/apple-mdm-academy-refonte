import { NextRequest, NextResponse } from "next/server";
import { stripeConfig, getTierFromPlanSlug } from "@/lib/pricing/stripe-config";
import { createClient } from "@/lib/supabase/server";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

/**
 * Webhook Stripe — vérifie la signature avant tout traitement.
 * Configure l'URL dans Stripe Dashboard > Webhooks :
 * https://your-domain.vercel.app/api/stripe/webhook
 * Événements : checkout.session.completed, customer.subscription.updated/deleted
 */
export async function POST(request: NextRequest) {
  if (!stripeConfig.enabled) {
    return NextResponse.json({ received: false, error: "Stripe disabled" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // ── Vérification signature ────────────────────────────────────────────────
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET non configuré");
    return NextResponse.json({ error: "Webhook secret manquant" }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Signature Stripe manquante" }, { status: 400 });
  }

  // Vérification manuelle de la signature Stripe (sans SDK pour réduire le bundle)
  // Format: t=timestamp,v1=signature
  let isValid = false;
  try {
    const parts = Object.fromEntries(
      signature.split(",").map((p) => p.split("="))
    ) as Record<string, string>;

    const timestamp = parts["t"];
    const receivedSig = parts["v1"];

    if (!timestamp || !receivedSig) {
      throw new Error("Format de signature invalide");
    }

    // Vérifier que le timestamp est récent (< 5 min)
    const ts = parseInt(timestamp, 10);
    if (Math.abs(Date.now() / 1000 - ts) > 300) {
      throw new Error("Timestamp expiré");
    }

    // Calculer la signature attendue
    const signedPayload = `${timestamp}.${body}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(STRIPE_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
    const expectedSig = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    isValid = expectedSig === receivedSig;
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (!isValid) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // ── Traitement des événements ─────────────────────────────────────────────
  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(body) as typeof event;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session["metadata"] as Record<string, string> | undefined;
      const planSlug = (session["metadata"] as Record<string, string> | undefined)?.planSlug ?? "pro";
      const tier = getTierFromPlanSlug(planSlug);

      if (supabase && userId?.userId) {
        await supabase.from("profiles").update({ tier }).eq("id", userId.userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub["customer"] as string;
      if (supabase && customerId) {
        await supabase.from("profiles").update({ tier: "free" }).eq("stripe_customer_id", customerId);
      }
      break;
    }
    default:
      // Événement non géré — ignorer
      break;
  }

  return NextResponse.json({ received: true });
}
