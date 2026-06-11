"use client";
import { useEffect } from "react";
export default function AnalyticsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-6">
      <p className="font-bold text-ink">Erreur analytics</p>
      <button type="button" onClick={reset} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">Réessayer</button>
    </div>
  );
}
