function isRealSupabaseValue(url?: string, anonKey?: string): boolean {
  if (!url || !anonKey) return false;
  if (url.includes("your-project")) return false;
  if (!url.startsWith("https://") || !url.includes("supabase.co")) return false;
  if (anonKey === "your-anon-key" || anonKey.startsWith("your-") || anonKey.length < 20) return false;
  return true;
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anonKey, configured: isRealSupabaseValue(url, anonKey) };
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
