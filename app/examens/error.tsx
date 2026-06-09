"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ExamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[exam/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold text-accent">Erreur inattendue</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Un problème est survenu</h1>
      <p className="mt-4 text-ink-secondary">
        L&apos;examen a rencontré une erreur. Vos réponses ont été sauvegardées localement.
        Réessayez ou revenez à la liste des examens.
      </p>
      {error.digest && (
        <p className="mt-3 rounded-lg bg-surface-elevated px-3 py-2 font-mono text-xs text-ink-tertiary">
          Ref : {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Réessayer
        </button>
        <Link
          href="/examens"
          className="inline-flex items-center justify-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink"
        >
          Tous les examens
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
