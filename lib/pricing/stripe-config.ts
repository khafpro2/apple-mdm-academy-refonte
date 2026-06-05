/**
 * Architecture Stripe — prête pour intégration future.
 * Ne pas connecter en production sans clés secrètes côté serveur.
 */

export const stripeConfig = {
  enabled: false,
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  /** Mapping plan slug → Stripe Price ID */
  priceIds: {
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly_placeholder",
    entreprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? "price_enterprise_monthly_placeholder",
  } as const,
  /** URLs de redirection post-checkout */
  successUrl: "/dashboard?checkout=success",
  cancelUrl: "/pricing?checkout=cancelled",
};

export type SubscriptionTier = "free" | "pro" | "enterprise";

export function getTierFromPlanSlug(slug: string): SubscriptionTier {
  if (slug === "pro") return "pro";
  if (slug === "entreprise") return "enterprise";
  return "free";
}

/** Endpoint futur : POST /api/stripe/checkout { planSlug } */
export const stripeApiRoutes = {
  checkout: "/api/stripe/checkout",
  portal: "/api/stripe/portal",
  webhook: "/api/stripe/webhook",
} as const;
