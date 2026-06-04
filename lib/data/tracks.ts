import type { Track } from "@/lib/types";

export const tracks: Track[] = [
  {
    slug: "apple-fundamentals",
    title: "Apple Fundamentals",
    level: "Débutant",
    lessons: 18,
    description: "Maîtrise les bases de l'écosystème Apple : macOS, iOS, iPadOS, sécurité et services entreprise.",
    duration: "12 h",
    icon: "🍏",
    certification: "Apple Fundamentals",
  },
  {
    slug: "apple-device-support",
    title: "Apple Device Support",
    level: "Intermédiaire",
    lessons: 32,
    description: "Prépare la certification Apple Device Support : dépannage macOS, réseau, comptes et support utilisateur.",
    duration: "24 h",
    icon: "💻",
    certification: "Apple Device Support",
  },
  {
    slug: "apple-it-professional",
    title: "Apple IT Professional",
    level: "Avancé",
    lessons: 40,
    description: "MDM Apple, Automated Device Enrollment, Apps & Books, APNs et architecture de sécurité entreprise.",
    duration: "30 h",
    icon: "🔐",
    certification: "Apple IT Professional",
  },
  {
    slug: "jamf-100",
    title: "Jamf 100",
    level: "Pro",
    lessons: 20,
    description: "Fondamentaux Jamf Pro : inventaire, smart groups, configuration profiles et policies de base.",
    duration: "16 h",
    icon: "📱",
    certification: "Jamf Certified Associate",
  },
  {
    slug: "jamf-170",
    title: "Jamf 170",
    level: "Pro",
    lessons: 24,
    description: "Administration avancée Jamf Pro : extension attributes, scripts, Self Service et workflows.",
    duration: "20 h",
    icon: "⚙️",
    certification: "Jamf Certified Admin",
  },
  {
    slug: "jamf-200",
    title: "Jamf 200",
    level: "Expert",
    lessons: 28,
    description: "Expertise Jamf : API, patch management, integrations tierces et architecture à grande échelle.",
    duration: "24 h",
    icon: "🏆",
    certification: "Jamf Certified Expert",
  },
  {
    slug: "intune-mac",
    title: "Microsoft Intune pour Mac",
    level: "Pro",
    lessons: 26,
    description: "Gestion Apple avec Intune : enrollment ABM, conformité, Conditional Access et déploiement macOS/iOS.",
    duration: "18 h",
    icon: "☁️",
    certification: "Intune Apple Admin",
  },
];

export function getTrack(slug: string) {
  return tracks.find((t) => t.slug === slug);
}

export function getTrackBySlug(slug: string) {
  return getTrack(slug);
}
