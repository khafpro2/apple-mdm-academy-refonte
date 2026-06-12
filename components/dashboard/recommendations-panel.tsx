import Link from "next/link";
import { Badge } from "@/components/ui";

type Recommendation = {
  type: "course" | "exam" | "lab" | "resource" | "revision";
  title: string;
  reason: string;
  href: string;
  urgency: "high" | "medium" | "low";
};

const ICONS: Record<Recommendation["type"], string> = {
  course: "📚",
  exam: "📝",
  lab: "🔧",
  resource: "📄",
  revision: "🧠",
};

const URGENCY_BADGE: Record<Recommendation["urgency"], "error" | "warning" | "default"> = {
  high: "error",
  medium: "warning",
  low: "default",
};

const URGENCY_LABEL: Record<Recommendation["urgency"], string> = {
  high: "Priorité haute",
  medium: "Recommandé",
  low: "À explorer",
};

interface RecommendationsPanelProps {
  /** Score moyen en % sur les derniers examens */
  avgScore?: number;
  /** Parcours en cours (slugs) */
  activeTracks?: string[];
  /** Dernière activité (date ISO) */
  lastActivity?: string;
}

function buildRecommendations(props: RecommendationsPanelProps): Recommendation[] {
  const { avgScore = 0, activeTracks = [], lastActivity } = props;
  const recs: Recommendation[] = [];

  // Score faible → mode révision SM-2 recommandé
  if (avgScore > 0 && avgScore < 60) {
    recs.push({
      type: "revision",
      title: "Mode révision — répétition espacée",
      reason: `Votre score moyen de ${avgScore}% suggère de réviser vos points faibles avec la répétition espacée SM-2.`,
      href: "/revision",
      urgency: "high",
    });
  }

  // Jamf 100 en cours → recommander Jamf 200
  if (activeTracks.includes("jamf-100") && avgScore >= 70) {
    recs.push({
      type: "course",
      title: "Jamf 200 — Admin avancé",
      reason: "Votre score Jamf 100 est excellent — continuez avec Jamf 200 pour la certification Admin.",
      href: "/cours/jamf-200",
      urgency: "medium",
    });
  }

  // Inactif depuis 7+ jours
  if (lastActivity) {
    const daysSince = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince >= 7) {
      recs.push({
        type: "lab",
        title: "Lab pratique : Smart Groups Jamf",
        reason: `${daysSince} jours sans activité — un lab pratique rapide pour reprendre la progression.`,
        href: "/labs/smart-groups-jamf",
        urgency: "medium",
      });
    }
  }

  // Apple IT Pro → ressource utile
  if (activeTracks.includes("apple-it-professional")) {
    recs.push({
      type: "resource",
      title: "Checklist ADE/ABM setup",
      reason: "Ressource pratique pour votre préparation Apple Certified IT Professional.",
      href: "/resources/ade-abm-checklist",
      urgency: "low",
    });
  }

  // Si aucune reco spécifique — reco générale
  if (recs.length === 0) {
    recs.push(
      {
        type: "exam",
        title: "Commencer un examen blanc",
        reason: "Testez vos connaissances Apple MDM avec un examen blanc pour identifier vos points faibles.",
        href: "/examens",
        urgency: "medium",
      },
      {
        type: "lab",
        title: "Découvrir les labs pratiques",
        reason: "40+ labs guidés pas à pas — Jamf Pro, Intune, FileVault et sécurité Apple.",
        href: "/labs",
        urgency: "low",
      }
    );
  }

  return recs.slice(0, 3);
}

export function RecommendationsPanel(props: RecommendationsPanelProps) {
  const recs = buildRecommendations(props);

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-ink">Recommandé pour vous</p>
      <div className="space-y-3">
        {recs.map((rec, i) => (
          <Link
            key={i}
            href={rec.href}
            className="group flex items-start gap-3 rounded-2xl border border-border-light bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-sm"
          >
            <span className="mt-0.5 text-xl" aria-hidden="true">
              {ICONS[rec.type]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink group-hover:text-accent transition-colors">
                  {rec.title}
                </p>
                <Badge variant={URGENCY_BADGE[rec.urgency]}>
                  {URGENCY_LABEL[rec.urgency]}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">
                {rec.reason}
              </p>
            </div>
            <span className="mt-1 shrink-0 text-ink-tertiary transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
