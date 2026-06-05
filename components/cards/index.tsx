import Link from "next/link";
import type { Track } from "@/lib/types";
import { Card, Badge, ButtonLink } from "@/components/ui";

export function TrackCard({ track }: { track: Track }) {
  return (
    <Card hover className="flex flex-col">
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl" aria-hidden="true">{track.icon}</span>
        <Badge>{track.level}</Badge>
      </div>
      <h3 className="text-xl font-bold text-ink">{track.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">{track.description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink-tertiary">
        <span>{track.lessons} leçons</span>
        <span>·</span>
        <span>{track.duration}</span>
      </div>
      {track.certification && (
        <p className="mt-2 text-xs font-medium text-accent">{track.certification}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href={`/cours/${track.slug}`} size="sm" className="flex-1 text-center">
          Voir le cours
        </ButtonLink>
        <ButtonLink href={`/parcours/${track.slug}`} variant="secondary" size="sm">
          Détails
        </ButtonLink>
      </div>
    </Card>
  );
}

export function LabCard({
  slug,
  title,
  duration,
  level,
  technology,
  index,
}: {
  slug: string;
  title: string;
  duration: string;
  level: string;
  technology?: string;
  index: number;
}) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between">
        <Badge variant="accent">Lab {index + 1}</Badge>
        <span className="text-xs text-ink-tertiary">{duration}</span>
      </div>
      {technology && (
        <p className="mt-2 text-xs font-semibold text-accent">{technology}</p>
      )}
      <h3 className="mt-3 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-secondary">
        Objectif, prérequis, étapes guidées et validation.
      </p>
      <p className="mt-3 text-xs font-medium text-ink-tertiary">{level}</p>
      <ButtonLink href={`/labs/${slug}`} size="sm" className="mt-6 w-full text-center">
        Accéder au Lab
      </ButtonLink>
    </Card>
  );
}

export function QuizCard({
  slug,
  title,
  type,
  questions,
  duration,
}: {
  slug: string;
  title: string;
  type: "quiz" | "examen";
  questions: number;
  duration: string;
}) {
  return (
    <Link href={`/quiz/${slug}`} className="group block">
      <Card hover className={type === "examen" ? "border-ink bg-ink text-white" : ""}>
        <Badge variant={type === "examen" ? "dark" : "accent"}>
          {type === "examen" ? "Examen blanc" : "Quiz"}
        </Badge>
        <h3 className={`mt-3 text-lg font-bold ${type === "examen" ? "text-white" : "text-ink group-hover:text-accent"}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm ${type === "examen" ? "text-zinc-300" : "text-ink-secondary"}`}>
          {questions} questions · {duration}
        </p>
      </Card>
    </Link>
  );
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted,
  cta,
  href,
}: {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  href: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl p-8 ${
        highlighted
          ? "border-2 border-accent bg-surface-elevated shadow-xl ring-1 ring-accent/20"
          : "border border-border-light bg-surface-elevated shadow-sm"
      }`}
    >
      {highlighted && (
        <Badge variant="accent" className="mb-4 self-start">
          Populaire
        </Badge>
      )}
      <h3 className="text-xl font-bold text-ink">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-ink">{price === 0 ? "Gratuit" : `${price}€`}</span>
        {price > 0 && <span className="text-ink-secondary">{period}</span>}
      </div>
      <p className="mt-3 text-sm text-ink-secondary">{description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span className="mt-0.5 text-accent" aria-hidden="true">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        variant={highlighted ? "primary" : "secondary"}
        className="mt-8 w-full text-center"
      >
        {cta}
      </ButtonLink>
    </div>
  );
}

export function ProgressOverview({ percent, tracks }: { percent: number; tracks: { title: string; percent: number }[] }) {
  return (
    <div className="rounded-3xl bg-ink p-6 text-white shadow-2xl">
      <div className="rounded-2xl bg-white/5 p-6 backdrop-blur">
        <p className="text-sm text-zinc-400">Progression globale</p>
        <p className="mt-2 text-5xl font-bold">{percent}%</p>
        <div className="mt-6 space-y-5">
          {tracks.map((track) => (
            <div key={track.title}>
              <div className="mb-2 flex justify-between text-sm">
                <span>{track.title}</span>
                <span className="text-zinc-400">{track.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-700">
                <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${track.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
