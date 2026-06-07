"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  RESOURCE_BADGES,
  RESOURCE_CATEGORIES,
  RESOURCE_LEVELS,
  academyResources,
  getCategoryLabel,
  type AcademyResource,
  type ResourceBadge,
  type ResourceCategory,
  type ResourceLevel,
} from "@/src/lib/resources";
import { Badge } from "@/components/ui";

const BADGE_COLORS: Record<ResourceBadge, string> = {
  Apple: "bg-gray-100 text-gray-800",
  Intune: "bg-blue-50 text-blue-800",
  Jamf: "bg-indigo-50 text-indigo-800",
  Sécurité: "bg-red-50 text-red-800",
};

const APPLE_TRAINING_GUIDES = [
  "apple-it-professional-guide",
  "apple-business-manager-guide",
  "apple-deployment-guide",
  "apple-security-guide",
  "platform-sso-guide",
  "ddm-guide",
  "device-attestation-guide",
] as const;

export function ResourcesCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [level, setLevel] = useState<ResourceLevel | "all">("all");
  const [badge, setBadge] = useState<ResourceBadge | "all">("all");
  const [appleTrainingOnly, setAppleTrainingOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return academyResources.filter((r) => {
      if (appleTrainingOnly && !(APPLE_TRAINING_GUIDES as readonly string[]).includes(r.slug)) return false;
      if (category !== "all" && r.category !== category) return false;
      if (level !== "all" && r.level !== level) return false;
      if (badge !== "all" && r.badge !== badge) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q)
      );
    });
  }, [search, category, level, badge, appleTrainingOnly]);

  return (
    <div>
      <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
        <input
          type="search"
          placeholder="Rechercher une ressource…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border-light px-4 py-2.5 text-sm"
          aria-label="Rechercher"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={!appleTrainingOnly} onClick={() => setAppleTrainingOnly(false)}>
            Toutes ressources
          </FilterChip>
          <FilterChip active={appleTrainingOnly} onClick={() => setAppleTrainingOnly(true)}>
            Guides Apple Training (7)
          </FilterChip>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>Toutes catégories</FilterChip>
          {RESOURCE_CATEGORIES.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {getCategoryLabel(c)}
            </FilterChip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={level === "all"} onClick={() => setLevel("all")}>Tous niveaux</FilterChip>
          {RESOURCE_LEVELS.map((l) => (
            <FilterChip key={l} active={level === l} onClick={() => setLevel(l)}>{l}</FilterChip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip active={badge === "all"} onClick={() => setBadge("all")}>Tous badges</FilterChip>
          {RESOURCE_BADGES.map((b) => (
            <FilterChip key={b} active={badge === b} onClick={() => setBadge(b)}>{b}</FilterChip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-secondary">
        {filtered.length} ressource{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-secondary">Aucune ressource ne correspond à vos filtres.</p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active ? "bg-accent text-white" : "bg-surface text-ink-secondary hover:bg-border-light"
      }`}
    >
      {children}
    </button>
  );
}

function ResourceCard({ resource }: { resource: AcademyResource }) {
  return (
    <article className="flex flex-col rounded-3xl border border-border-light bg-surface-elevated p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_COLORS[resource.badge]}`}>
          {resource.badge}
        </span>
        <Badge variant="default">{getCategoryLabel(resource.category)}</Badge>
      </div>
      <h3 className="mt-3 font-bold text-ink">{resource.title}</h3>
      <p className="mt-2 flex-1 text-sm text-ink-secondary line-clamp-2">{resource.description}</p>
      <p className="mt-2 text-xs text-ink-tertiary">{resource.module} · {resource.level}</p>
      <Link
        href={`/resources/${resource.slug}`}
        className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:opacity-90"
      >
        Ouvrir la ressource
      </Link>
    </article>
  );
}
