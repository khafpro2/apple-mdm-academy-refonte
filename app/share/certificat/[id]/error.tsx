"use client";
import { useEffect } from "react";
import Link from "next/link";
export default function ShareError({ reset }: { reset: () => void }) {
  useEffect(() => {}, []);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-lg font-bold text-ink">Certificat introuvable</p>
      <p className="text-sm text-ink-secondary">Ce lien est invalide ou le certificat a été supprimé.</p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">Réessayer</button>
        <Link href="/dashboard" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">Dashboard</Link>
      </div>
    </div>
  );
}
