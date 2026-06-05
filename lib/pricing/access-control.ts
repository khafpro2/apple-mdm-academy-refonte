import type { SubscriptionTier } from "@/lib/pricing/types";

const TIER_RANK: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export function tierMeetsRequirement(
  userTier: SubscriptionTier,
  required: SubscriptionTier
): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

/** Labs accessibles en offre gratuite (aperçu) */
export const FREE_LAB_SLUGS = new Set(["jamf-discovery"]);

/** Cours entièrement accessibles en gratuit */
export const FREE_COURSE_SLUGS = new Set(["apple-fundamentals"]);

/** Ressources gratuites */
export const FREE_RESOURCE_SLUGS = new Set([
  "checklist-abm",
  "checklist-apns",
  "checklist-jamf-fundamentals",
]);

/** Quiz gratuits (slug prefix ou liste) */
export const FREE_QUIZ_SLUGS = new Set([
  "quiz-apple-fundamentals",
  "quiz-jamf-100-intro",
]);

/** Parcours expert Phase 13 */
export const ADVANCED_TRACK_SLUGS = new Set([
  "jamf-300",
  "jamf-400",
  "apple-enterprise-expert",
  "intune-apple-advanced",
]);

export const ENTERPRISE_TRACK_SLUGS = new Set(["jamf-400", "apple-enterprise-expert"]);

const ENTERPRISE_EXAM_ROUTES = new Set(["jamf-400", "apple-enterprise-expert"]);

export function getRequiredTierForLab(slug: string): SubscriptionTier {
  return FREE_LAB_SLUGS.has(slug) ? "free" : "pro";
}

export function getRequiredTierForCourse(slug: string): SubscriptionTier {
  if (FREE_COURSE_SLUGS.has(slug)) return "free";
  if (ENTERPRISE_TRACK_SLUGS.has(slug)) return "enterprise";
  if (ADVANCED_TRACK_SLUGS.has(slug)) return "pro";
  return "pro";
}

export function getRequiredTierForExam(routeOrQuizSlug: string): SubscriptionTier {
  if (ENTERPRISE_EXAM_ROUTES.has(routeOrQuizSlug)) return "enterprise";
  if (routeOrQuizSlug.includes("jamf-400") || routeOrQuizSlug.includes("apple-enterprise-expert")) return "enterprise";
  if (routeOrQuizSlug.includes("jamf-300") || routeOrQuizSlug.includes("intune-apple-advanced")) return "pro";
  return "pro";
}

export function getRequiredTierForResource(slug: string): SubscriptionTier {
  return FREE_RESOURCE_SLUGS.has(slug) ? "free" : "pro";
}

export function getRequiredTierForCertificate(): SubscriptionTier {
  return "pro";
}

export function getRequiredTierForVideo(_slug: string): SubscriptionTier {
  return "pro";
}

export type ContentType = "lab" | "course" | "exam" | "resource" | "certificate" | "video";

export function getRequiredTier(contentType: ContentType, slug?: string): SubscriptionTier {
  switch (contentType) {
    case "lab":
      return getRequiredTierForLab(slug ?? "");
    case "course":
      return getRequiredTierForCourse(slug ?? "");
    case "exam":
      return getRequiredTierForExam(slug ?? "");
    case "resource":
      return getRequiredTierForResource(slug ?? "");
    case "certificate":
      return getRequiredTierForCertificate();
    case "video":
      return getRequiredTierForVideo(slug ?? "");
    default:
      return "pro";
  }
}

export function canAccessContent(
  userTier: SubscriptionTier,
  contentType: ContentType,
  slug?: string
): boolean {
  return tierMeetsRequirement(userTier, getRequiredTier(contentType, slug));
}
