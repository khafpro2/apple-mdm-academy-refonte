"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VideoTranscript } from "@/src/lib/video-transcripts";
import { searchTranscripts } from "@/src/lib/video-transcripts";

type Props = {
  transcripts: VideoTranscript[];
};

export function TranscriptsLibrary({ transcripts }: Props) {
  const [query, setQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => searchTranscripts(query, transcripts), [query, transcripts]);

  const copyText = async (slug: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="mt-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans les transcripts…"
          className="w-full rounded-2xl border border-border-light bg-surface-elevated px-5 py-3 text-sm text-ink placeholder:text-ink-tertiary focus:border-accent focus:outline-none"
        />
        <p className="mt-2 text-sm text-ink-tertiary">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {filtered.map((t) => (
          <article
            key={t.slug}
            id={t.slug}
            className="scroll-mt-24 rounded-2xl border border-border-light bg-surface-elevated p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-accent">{t.module}</p>
                <h2 className="mt-1 text-lg font-bold text-ink">
                  <Link href={`/videos/${t.slug}`} className="hover:text-accent">
                    {t.title}
                  </Link>
                </h2>
                <p className="mt-1 text-xs text-ink-tertiary">{t.wordCount} mots</p>
              </div>
              <button
                type="button"
                onClick={() => copyText(t.slug, t.fullText)}
                className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-surface"
              >
                {copiedSlug === t.slug ? "Copié ✓" : "Copier transcript"}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {t.scenes.map((scene, i) => (
                <div key={i} className="rounded-xl bg-surface p-4">
                  <p className="text-xs font-semibold text-ink-tertiary">{scene.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{scene.text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Link href="/videos" className="mt-10 inline-block text-sm font-semibold text-accent hover:underline">
        ← Bibliothèque vidéos
      </Link>
    </>
  );
}
