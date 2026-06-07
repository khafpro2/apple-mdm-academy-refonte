"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold text-accent">Erreur inattendue</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Un problème est survenu</h1>
      <p className="mt-4 text-ink-secondary">
        Nos équipes ont été notifiées. Réessayez ou consultez le statut des services.
      </p>
      {isDev && (
        <details className="mt-6 w-full max-w-full rounded-xl border border-red-200 bg-red-50 p-4 text-left text-xs text-red-950">
          <summary className="cursor-pointer font-semibold">Détails (dev uniquement)</summary>
          <p className="mt-2 break-words font-mono">{error.message}</p>
          {error.digest && <p className="mt-1 font-mono text-red-800">digest: {error.digest}</p>}
          {error.stack && <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap">{error.stack}</pre>}
        </details>
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
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-ink-secondary hover:text-ink"
        >
          Accueil
        </Link>
      </div>
      <Link href="/status" className="mt-8 text-sm text-accent hover:underline">
        Statut des services
      </Link>
    </div>
  );
}
