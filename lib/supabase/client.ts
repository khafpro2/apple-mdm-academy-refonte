import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const { url, anonKey, configured } = getSupabaseEnv();
  if (!configured) {
    throw new Error("Supabase non configuré — ajoutez les variables d'environnement.");
  }
  return createBrowserClient(url!, anonKey!);
}

export function isSupabaseConfigured() {
  return getSupabaseEnv().configured;
}
