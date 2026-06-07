"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Dernier recours — erreur racine (layout). Ne pas inclure PageShell ni composants métier. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#fbfbfd] font-sans text-[#1d1d1f] antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm font-semibold text-[#0071e3]">Erreur critique</p>
          <h1 className="mt-3 text-3xl font-bold">Un problème est survenu</h1>
          <p className="mt-4 text-[#515154]">
            Nos équipes ont été notifiées. Réessayez ou consultez le statut des services.
          </p>
          {isDev && (
            <p className="mt-4 break-words text-left text-xs text-red-800">{error.message}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Réessayer
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#d2d2d7] px-6 py-3 text-sm font-semibold text-[#515154] hover:text-[#1d1d1f]"
            >
              Accueil
            </Link>
          </div>
          <Link href="/status" className="mt-8 text-sm text-[#0071e3] hover:underline">
            Statut des services
          </Link>
        </div>
      </body>
    </html>
  );
}
