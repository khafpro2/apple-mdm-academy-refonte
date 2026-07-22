import { isSupabaseConfigured } from "@/lib/supabase/env-validation";

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return { url, anonKey, configured: isSupabaseConfigured(url, anonKey) };
}

export function requireSupabaseEnv() {
  const env = getSupabaseEnv();
  if (!env.configured) {
    throw new Error(
      "Variables Supabase manquantes. Copiez .env.example vers .env.local et renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return env as { url: string; anonKey: string; configured: true };
}
