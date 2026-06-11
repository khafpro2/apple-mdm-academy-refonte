"use client";
import Link from "next/link";
export default function RevisionError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-6">
      <p className="font-bold text-ink">Erreur dans le mode révision</p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">Réessayer</button>
        <Link href="/" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">Accueil</Link>
      </div>
    </div>
  );
}
