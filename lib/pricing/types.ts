export type SubscriptionTier = "free" | "pro" | "enterprise";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "none";

export type PlanSlug = "free" | "pro" | "enterprise";

export type CommercialPlan = {
  slug: PlanSlug;
  name: string;
  price: number | null;
  priceLabel: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaHref: string;
  tier: SubscriptionTier;
};

export type SubscriptionState = {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  planSlug: PlanSlug;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};

export type ComparisonFeature = {
  label: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
};

export type InvoicePlaceholder = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
};
