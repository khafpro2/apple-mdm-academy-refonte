import type { PricingPlan, Badge, UserProgress } from "@/lib/types";

export const pricingPlans: PricingPlan[] = [
  {
    slug: "decouverte",
    name: "Découverte",
    price: 0,
    period: "Gratuit",
    description: "Accès aux bases pour démarrer ton parcours Apple MDM.",
    features: [
      "Apple Fundamentals (aperçu)",
      "2 labs gratuits",
      "1 quiz d'évaluation",
      "Dashboard basique",
    ],
    cta: "Commencer",
  },
  {
    slug: "pro",
    name: "Pro",
    price: 29,
    period: "/ mois",
    description: "Accès complet à tous les parcours et examens blancs.",
    features: [
      "Tous les parcours (7 certifications)",
      "Labs pratiques illimités",
      "Examens blancs complets",
      "Dashboard premium + badges",
      "Fiches de révision PDF",
      "Support communautaire",
    ],
    highlighted: true,
    cta: "S'abonner Pro",
  },
  {
    slug: "entreprise",
    name: "Entreprise",
    price: 99,
    period: "/ mois",
    description: "Pour les équipes IT : gestion multi-utilisateurs et reporting.",
    features: [
      "Tout le plan Pro",
      "Jusqu'à 25 apprenants",
      "Tableau de bord admin",
      "Reporting progression équipe",
      "Certificats PDF personnalisés",
      "Support prioritaire",
      "Sessions live mensuelles",
    ],
    cta: "Contacter l'équipe",
  },
];

export const badges: Badge[] = [
  { id: "first-lab", name: "Premier lab", icon: "🧪", description: "Complète ton premier lab pratique", earned: true, earnedAt: "2026-05-01" },
  { id: "jamf-100", name: "Jamf 100", icon: "📱", description: "Réussis le quiz Jamf 100 avec 75%+", earned: true, earnedAt: "2026-05-12" },
  { id: "streak-7", name: "Streak 7 jours", icon: "🔥", description: "7 jours consécutifs d'apprentissage", earned: false },
  { id: "apple-pro", name: "Apple Pro", icon: "🍏", description: "Complète Apple IT Professional", earned: false },
  { id: "quiz-master", name: "Quiz Master", icon: "🎯", description: "100% sur 5 quiz différents", earned: false },
  { id: "lab-expert", name: "Lab Expert", icon: "⚡", description: "Complète 6 labs pratiques", earned: false },
];

export const userProgress: UserProgress = {
  globalPercent: 78,
  tracks: [
    { slug: "jamf-100", title: "Jamf 100", percent: 100 },
    { slug: "apple-device-support", title: "Apple Device Support", percent: 82 },
    { slug: "apple-it-professional", title: "Apple IT Professional", percent: 64 },
    { slug: "jamf-200", title: "Jamf 200", percent: 38 },
    { slug: "intune-mac", title: "Intune pour Mac", percent: 22 },
  ],
  recentActivity: [
    { label: "Quiz Jamf 100 — 92%", date: "2026-06-04", type: "quiz" },
    { label: "Lab : Smart Groups Jamf", date: "2026-06-03", type: "lab" },
    { label: "Leçon : API Jamf Pro REST", date: "2026-06-02", type: "cours" },
    { label: "Examen blanc ADS — 78%", date: "2026-06-01", type: "examen" },
  ],
};

export const certificates = [
  { name: "Jamf 100 — Examen blanc", score: "92%", date: "12 mai 2026", status: "available" as const },
  { name: "Apple Device Support — Partiel", score: "78%", date: "3 mai 2026", status: "available" as const },
  { name: "Apple IT Professional", score: "—", date: "—", status: "locked" as const },
];

export const leaderboard = [
  { rank: 1, name: "Marie L.", points: 2840 },
  { rank: 2, name: "Thomas K.", points: 2650 },
  { rank: 3, name: "Toi", points: 1920, highlight: true },
  { rank: 4, name: "Sophie R.", points: 1780 },
  { rank: 5, name: "Alex M.", points: 1540 },
];
