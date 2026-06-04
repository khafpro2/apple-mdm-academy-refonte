import type { Badge } from "@/lib/types";

export const badgeCatalog: Badge[] = [
  { id: "first-quiz", name: "Premier quiz", icon: "🎯", description: "Réussis ton premier quiz", earned: false },
  { id: "jamf-100", name: "Jamf 100", icon: "📱", description: "Réussis le quiz Jamf 100", earned: false },
  { id: "apple-fundamentals", name: "Apple Basics", icon: "🍏", description: "Réussis le quiz Apple Fundamentals", earned: false },
  { id: "intune-mac", name: "Intune Admin", icon: "☁️", description: "Réussis le quiz Intune pour Mac", earned: false },
  { id: "exam-ads", name: "ADS Ready", icon: "💻", description: "Réussis l'examen blanc Apple Device Support", earned: false },
  { id: "exam-jamf-200", name: "Jamf Expert", icon: "🏆", description: "Réussis l'examen blanc Jamf 200", earned: false },
  { id: "quiz-master", name: "Quiz Master", icon: "⭐", description: "100% sur 3 quiz différents", earned: false },
];

/** Badge débloqué quand un quiz est réussi */
export const quizBadgeMap: Record<string, string> = {
  "quiz-jamf-100": "jamf-100",
  "quiz-apple-fundamentals": "apple-fundamentals",
  "quiz-intune-mac": "intune-mac",
  "examen-apple-device-support": "exam-ads",
  "examen-jamf-200": "exam-jamf-200",
};

export function getBadgeById(id: string) {
  return badgeCatalog.find((b) => b.id === id);
}
