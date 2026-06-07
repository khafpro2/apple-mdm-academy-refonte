/** Validation partagée des variables d'environnement Supabase — sans exposer les secrets. */

export type EnvVarState = "configured" | "invalid" | "missing";

export type EnvValidationResult = {
  state: EnvVarState;
  detail: string;
  isPlaceholder: boolean;
};

const PLACEHOLDER_SUBSTRINGS = [
  "your-project",
  "your-anon-key",
  "your-service-role-key",
  "changeme",
  "placeholder",
  "example.com",
  "xxx",
  "todo",
  "replace-me",
  "insert-",
] as const;

/** Patterns considérés invalides (export diagnostic). */
export const PLACEHOLDER_PATTERNS = PLACEHOLDER_SUBSTRINGS;

export function isPlaceholderValue(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("your-")) return true;
  return PLACEHOLDER_SUBSTRINGS.some((token) => normalized.includes(token));
}

export function isEmptyEnvValue(value?: string | null): boolean {
  return !value?.trim();
}

export function validateSupabaseUrl(url?: string): EnvValidationResult {
  if (isEmptyEnvValue(url)) {
    return { state: "missing", detail: "Variable absente ou vide", isPlaceholder: false };
  }
  const trimmed = url!.trim();
  if (isPlaceholderValue(trimmed)) {
    return { state: "invalid", detail: "Placeholder détecté (copié depuis .env.example)", isPlaceholder: true };
  }
  if (!trimmed.startsWith("https://")) {
    return { state: "invalid", detail: "URL invalide — doit commencer par https://", isPlaceholder: false };
  }
  if (!trimmed.includes("supabase.co")) {
    return { state: "invalid", detail: "URL invalide — hôte *.supabase.co attendu", isPlaceholder: false };
  }
  try {
    new URL(trimmed);
  } catch {
    return { state: "invalid", detail: "Format URL invalide", isPlaceholder: false };
  }
  return { state: "configured", detail: "URL Supabase valide", isPlaceholder: false };
}

export function validateAnonKey(key?: string): EnvValidationResult {
  if (isEmptyEnvValue(key)) {
    return { state: "missing", detail: "Variable absente ou vide", isPlaceholder: false };
  }
  const trimmed = key!.trim();
  if (isPlaceholderValue(trimmed)) {
    return { state: "invalid", detail: "Placeholder détecté (ex. your-anon-key)", isPlaceholder: true };
  }
  if (trimmed.length < 20) {
    return {
      state: "invalid",
      detail: `Clé trop courte (${trimmed.length} caractères, minimum 20)`,
      isPlaceholder: false,
    };
  }
  return { state: "configured", detail: "Clé anon publique valide", isPlaceholder: false };
}

export function validateSiteUrl(url?: string): EnvValidationResult {
  if (isEmptyEnvValue(url)) {
    return { state: "missing", detail: "Variable absente ou vide", isPlaceholder: false };
  }
  const trimmed = url!.trim();
  if (isPlaceholderValue(trimmed)) {
    return { state: "invalid", detail: "Placeholder détecté", isPlaceholder: true };
  }
  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://localhost")) {
    return { state: "invalid", detail: "URL invalide — https:// requis en production", isPlaceholder: false };
  }
  try {
    new URL(trimmed);
  } catch {
    return { state: "invalid", detail: "Format URL invalide", isPlaceholder: false };
  }
  return { state: "configured", detail: "URL publique du site valide", isPlaceholder: false };
}

export function isSupabaseConfigured(url?: string, anonKey?: string): boolean {
  return validateSupabaseUrl(url).state === "configured" && validateAnonKey(anonKey).state === "configured";
}

export function envVarLabel(state: EnvVarState, configuredLabel = "✅ Configurée"): string {
  if (state === "configured") return configuredLabel;
  if (state === "invalid") return "❌ Invalide";
  return "❌ Absente";
}

export function envVarPresenceLabel(state: EnvVarState): string {
  if (state === "missing") return "Absente";
  if (state === "invalid") return "Invalide";
  return "Présente";
}

export const SUPABASE_SETUP_VARIABLES = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    example: "https://uqlhjtgcfbbhkcvjdybs.supabase.co",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    example: "[clé anon public — Project Settings → API]",
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    example: "https://apple-mdm-academy-refonte.vercel.app",
  },
] as const;
