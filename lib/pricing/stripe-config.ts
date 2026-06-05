/**
 * Architecture Stripe — prête pour intégration future.
 * Activer avec STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 */

import type { SubscriptionTier } from "@/lib/pricing/types";

export const stripeConfig = {
  enabled: Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ),
  secretKey: process.env.STRIPE_SECRET_KEY ?? "",
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  priceIds: {
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly_placeholder",
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? "price_enterprise_monthly_placeholder",
  } as const,
  successUrl: "/checkout/success",
  cancelUrl: "/checkout?cancelled=1",
  billingPortalReturnUrl: "/account/billing",
};

export const stripeApiRoutes = {
  checkout: "/api/stripe/checkout",
  portal: "/api/stripe/portal",
  webhook: "/api/stripe/webhook",
} as const;

export function getTierFromPlanSlug(slug: string): SubscriptionTier {
  if (slug === "pro") return "pro";
  if (slug === "enterprise" || slug === "entreprise") return "enterprise";
  return "free";
}

/** Placeholder revenus MRR */
export function estimateMrr(proUsers: number, enterpriseUsers: number): number {
  return proUsers * 29 + enterpriseUsers * 99;
}
