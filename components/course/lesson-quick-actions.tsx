import Link from "next/link";

type Props = {
  labSlug?: string;
  quizHref?: string;
  videoSlug?: string;
  videoHasMp4?: boolean;
  resourceHref?: string;
};

export function LessonQuickActions({ labSlug, quizHref, videoSlug, videoHasMp4, resourceHref }: Props) {
  const actions = [
    videoSlug && {
      href: `/videos/${videoSlug}`,
      label: videoHasMp4 ? "Vidéo" : "Script vidéo",
      hint: videoHasMp4 ? "Regarder" : "En production",
      accent: true,
    },
    labSlug && { href: `/labs/${labSlug}`, label: "Lab", hint: "Pratique" },
    quizHref && { href: quizHref, label: "Quiz", hint: "Valider" },
    resourceHref && { href: resourceHref, label: "Ressource", hint: "PDF" },
  ].filter(Boolean) as { href: string; label: string; hint: string; accent?: boolean }[];

  if (actions.length === 0) return null;

  return (
    <nav
      aria-label="Actions rapides de la leçon"
      className="mt-6 flex flex-wrap gap-2"
    >
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={`inline-flex flex-col rounded-2xl border px-4 py-2.5 transition ${
            action.accent
              ? "border-accent/30 bg-accent/5 hover:bg-accent/10"
              : "border-border-light bg-surface-elevated hover:border-accent/20"
          }`}
        >
          <span className="text-sm font-semibold text-ink">{action.label}</span>
          <span className="text-xs text-ink-tertiary">{action.hint}</span>
        </Link>
      ))}
    </nav>
  );
}
