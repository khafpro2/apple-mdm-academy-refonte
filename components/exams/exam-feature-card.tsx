import Link from "next/link";

type Props = {
  className?: string;
};

/** Carte cliquable « Examens blancs » — mène vers /examens */
export function ExamFeatureCard({ className = "" }: Props) {
  return (
    <Link
      href="/examens"
      aria-label="Voir les examens blancs — mode examen, chronomètre et correction détaillée"
      className={`group block cursor-pointer rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface-elevated to-surface-elevated p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">Certification</p>
      <h2 className="mt-2 text-2xl font-bold text-ink group-hover:text-accent">Examens blancs</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary">
        Mode examen, chronomètre, correction détaillée et historique des tentatives.
      </p>
      <span className="mt-5 inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-accent-hover">
        Voir les examens →
      </span>
    </Link>
  );
}
