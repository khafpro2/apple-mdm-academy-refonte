"use client";
import Link from "next/link";
import { useEffect } from "react";


export default function LabSlugErrorError({
  error, reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="text-sm font-semibold text-accent">Erreur</p>
      <p className="font-semibold text-ink">Un problème est survenu.</p>
      {error.digest && <p className="font-mono text-xs text-ink-tertiary">{error.digest}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={reset}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
          Réessayer
        </button>
        <Link href="/labs"
          className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
          Labs
        </Link>
      </div>
    </div>
  );
}
