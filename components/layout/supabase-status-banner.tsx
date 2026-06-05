import { getSupabaseEnv } from "@/lib/env";

export function SupabaseStatusBanner() {
  const { configured } = getSupabaseEnv();
  if (configured) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-900"
    >
      Mode démo — Supabase non configuré. Connexion et sauvegarde de progression indisponibles.
    </div>
  );
}
