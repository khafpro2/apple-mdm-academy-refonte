import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import {
  envVarLabel,
  envVarPresenceLabel,
  validateAnonKey,
  validateSiteUrl,
  validateSupabaseUrl,
  isSupabaseConfigured,
  type EnvVarState,
} from "@/lib/supabase/env-validation";

export type RuntimeMode = "Production" | "Preview" | "Development";

export type DiagnosticStatus = "ok" | "fail" | "warning" | "skipped";

export type EnvVarDiagnostic = {
  name: string;
  state: EnvVarState | "optional";
  present: boolean;
  presence: "Présente" | "Absente" | "Invalide";
  status: DiagnosticStatus;
  label: string;
  note: string;
};

export type CheckDiagnostic = {
  name: string;
  status: DiagnosticStatus;
  detail: string;
};

export type RuntimeEnvFingerprint = {
  /** production | preview | development */
  environment: string;
  urlPresent: boolean;
  urlContainsAbcDe: boolean;
  urlContainsProjectRef: boolean;
  anonKeyPresent: boolean;
  anonKeyStartsWithEyJ: boolean;
  siteUrlPresent: boolean;
  configured: boolean;
  urlValidationDetail: string;
  anonKeyValidationDetail: string;
  /** Empreinte déploiement — confirme quel build tourne */
  vercelEnv: string | null;
  vercelUrl: string | null;
  vercelGitCommitSha: string | null;
  vercelDeploymentId: string | null;
  /** NEXT_PUBLIC_* sont injectées au build — pas au runtime */
  nextPublicBuildTimeNote: string;
  envVarNamesReadByApp: string[];
};

export type SupabaseDiagnostics = {
  runtimeMode: RuntimeMode;
  runtimeFingerprint: RuntimeEnvFingerprint;
  statusPageAuthDegraded: boolean;
  statusPageDbDegraded: boolean;
  rootCause: string;
  envVars: EnvVarDiagnostic[];
  primaryEnvVars: EnvVarDiagnostic[];
  checks: CheckDiagnostic[];
  configured: boolean;
  hasInvalidEnv: boolean;
};

export function getRuntimeMode(): RuntimeMode {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production") return "Production";
  if (vercelEnv === "preview") return "Preview";
  return "Development";
}

/** Noms exacts lus par le code — aucun alias alternatif pour Supabase client. */
export const SUPABASE_ENV_VAR_NAMES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAILS",
] as const;

export function getRuntimeEnvFingerprint(): RuntimeEnvFingerprint {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const urlValidation = validateSupabaseUrl(url);
  const anonValidation = validateAnonKey(anonKey);
  const vercelEnv = process.env.VERCEL_ENV ?? null;

  return {
    environment: vercelEnv ?? "development",
    urlPresent: Boolean(url?.trim()),
    urlContainsAbcDe: url?.includes("aBcDe") ?? false,
    urlContainsProjectRef: url?.includes("uqlhjtgcfbbhkcvjdybs") ?? false,
    anonKeyPresent: Boolean(anonKey?.trim()),
    anonKeyStartsWithEyJ: anonKey?.trim().startsWith("eyJ") ?? false,
    siteUrlPresent: Boolean(siteUrl?.trim()),
    configured: isSupabaseConfigured(url, anonKey),
    urlValidationDetail: urlValidation.detail,
    anonKeyValidationDetail: anonValidation.detail,
    vercelEnv,
    vercelUrl: process.env.VERCEL_URL ?? null,
    vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID?.slice(0, 12) ?? null,
    nextPublicBuildTimeNote:
      "NEXT_PUBLIC_* est injecté au moment du build (next build). Modifier les variables Vercel sans redéployer ne change pas /status. Vérifier aussi que les vars existent pour l'environnement actif (Production vs Preview).",
    envVarNamesReadByApp: [...SUPABASE_ENV_VAR_NAMES],
  };
}

function toDiagnosticStatus(state: EnvVarState | "optional"): DiagnosticStatus {
  if (state === "configured") return "ok";
  if (state === "optional") return "warning";
  return "fail";
}

function buildEnvVarRow(
  name: string,
  validation: { state: EnvVarState; detail: string },
  configuredLabel = "✅ Configurée"
): EnvVarDiagnostic {
  return {
    name,
    state: validation.state,
    present: validation.state !== "missing",
    presence: envVarPresenceLabel(validation.state) as EnvVarDiagnostic["presence"],
    status: toDiagnosticStatus(validation.state),
    label: envVarLabel(validation.state, configuredLabel),
    note: validation.detail,
  };
}

function validateServiceRoleKey(key?: string): { state: EnvVarState | "optional"; detail: string } {
  if (!key?.trim()) {
    return { state: "optional", detail: "Non requise côté client — seed démo / provision API uniquement" };
  }
  const anonLike = validateAnonKey(key);
  if (anonLike.state !== "configured") {
    return { state: "invalid", detail: anonLike.detail };
  }
  return { state: "configured", detail: "Clé service role présente (non affichée)" };
}

function buildEnvVarDiagnostics(): EnvVarDiagnostic[] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const urlValidation = validateSupabaseUrl(url);
  const anonValidation = validateAnonKey(anonKey);
  const siteValidation = validateSiteUrl(siteUrl);
  const serviceValidation = validateServiceRoleKey(serviceRoleKey);

  const serviceRow: EnvVarDiagnostic = {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    state: serviceValidation.state,
    present: serviceValidation.state !== "missing" && serviceValidation.state !== "optional",
    presence:
      serviceValidation.state === "optional"
        ? "Absente"
        : serviceValidation.state === "invalid"
          ? "Invalide"
          : "Présente",
    status: serviceValidation.state === "optional" ? "warning" : toDiagnosticStatus(serviceValidation.state),
    label:
      serviceValidation.state === "configured"
        ? "✅ Présente"
        : serviceValidation.state === "invalid"
          ? "❌ Invalide"
          : "⚠️ Non requise côté client",
    note: serviceValidation.detail,
  };

  return [
    buildEnvVarRow("NEXT_PUBLIC_SUPABASE_URL", urlValidation),
    buildEnvVarRow("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonValidation),
    buildEnvVarRow("NEXT_PUBLIC_SITE_URL", siteValidation),
    serviceRow,
    buildEnvVarRow("ADMIN_EMAILS", {
      state: process.env.ADMIN_EMAILS?.trim() ? "configured" : "missing",
      detail: process.env.ADMIN_EMAILS?.trim()
        ? "Liste d'emails admin configurée"
        : "Requise pour l'accès /admin via allowlist",
    }),
  ];
}

async function verifyAuthClient(url: string, anonKey: string): Promise<CheckDiagnostic> {
  try {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await client.auth.getSession();
    if (error) {
      return {
        name: "Vérification Auth Client",
        status: "fail",
        detail: `Client créé mais auth.getSession() a échoué : ${error.message}`,
      };
    }
    return {
      name: "Vérification Auth Client",
      status: "ok",
      detail: "Client Supabase Auth initialisé — endpoint auth joignable",
    };
  } catch (err) {
    return {
      name: "Vérification Auth Client",
      status: "fail",
      detail: err instanceof Error ? err.message : "Erreur inconnue lors de l'initialisation Auth",
    };
  }
}

async function verifyDbClient(url: string, anonKey: string): Promise<CheckDiagnostic> {
  try {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await client.from("profiles").select("id", { count: "exact", head: true });
    if (error) {
      return {
        name: "Vérification DB Client",
        status: "fail",
        detail: `Requête PostgreSQL échouée : ${error.message} (code ${error.code ?? "?"})`,
      };
    }
    return {
      name: "Vérification DB Client",
      status: "ok",
      detail: "Connexion REST Supabase OK — table profiles accessible",
    };
  } catch (err) {
    return {
      name: "Vérification DB Client",
      status: "fail",
      detail: err instanceof Error ? err.message : "Erreur inconnue lors de la requête DB",
    };
  }
}

async function verifyServerClient(): Promise<CheckDiagnostic> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        name: "Vérification Server Client (SSR)",
        status: "skipped",
        detail: "createClient() retourne null — variables Supabase invalides ou absentes",
      };
    }
    const { error } = await supabase.auth.getUser();
    if (error) {
      return {
        name: "Vérification Server Client (SSR)",
        status: "warning",
        detail: `Client SSR créé — getUser() : ${error.message}`,
      };
    }
    return {
      name: "Vérification Server Client (SSR)",
      status: "ok",
      detail: "Client SSR Next.js opérationnel (cookies + anon key)",
    };
  } catch (err) {
    return {
      name: "Vérification Server Client (SSR)",
      status: "fail",
      detail: err instanceof Error ? err.message : "Erreur client SSR",
    };
  }
}

export async function runSupabaseDiagnostics(): Promise<SupabaseDiagnostics> {
  const { url, anonKey, configured } = getSupabaseEnv();
  const envVars = buildEnvVarDiagnostics();
  const primaryEnvVars = envVars.filter((v) =>
    ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_URL"].includes(v.name)
  );
  const checks: CheckDiagnostic[] = [];

  const urlCheck = validateSupabaseUrl(url);
  checks.push({
    name: "Vérification URL Supabase",
    status: urlCheck.state === "configured" ? "ok" : "fail",
    detail: urlCheck.detail,
  });

  const anonCheck = validateAnonKey(anonKey);
  checks.push({
    name: "Vérification Anon Key",
    status: anonCheck.state === "configured" ? "ok" : "fail",
    detail: anonCheck.detail,
  });

  const siteCheck = validateSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  checks.push({
    name: "Vérification Site URL",
    status: siteCheck.state === "configured" ? "ok" : siteCheck.state === "missing" ? "warning" : "fail",
    detail: siteCheck.detail,
  });

  const serviceValidation = validateServiceRoleKey(process.env.SUPABASE_SERVICE_ROLE_KEY);
  checks.push({
    name: "Vérification Service Role Key",
    status:
      serviceValidation.state === "configured"
        ? "ok"
        : serviceValidation.state === "optional"
          ? "skipped"
          : "warning",
    detail: serviceValidation.detail,
  });

  if (configured && url && anonKey) {
    checks.push(await verifyAuthClient(url, anonKey));
    checks.push(await verifyDbClient(url, anonKey));
  } else {
    checks.push({
      name: "Vérification Auth Client",
      status: "skipped",
      detail: "Ignoré — variables Supabase invalides ou absentes",
    });
    checks.push({
      name: "Vérification DB Client",
      status: "skipped",
      detail: "Ignoré — variables Supabase invalides ou absentes",
    });
  }

  checks.push(await verifyServerClient());

  const hasInvalidEnv = primaryEnvVars.some((v) => v.state !== "configured");
  const runtimeFingerprint = getRuntimeEnvFingerprint();
  const statusPageAuthDegraded = !configured;
  const statusPageDbDegraded = !configured;

  let rootCause = "Configuration Supabase valide — la page /status devrait afficher Auth et DB opérationnels.";
  if (!configured) {
    const reasons = primaryEnvVars
      .filter((v) => v.state !== "configured")
      .map((v) => `${v.name} : ${v.presence}${v.note.includes("Placeholder") ? " (placeholder)" : ""}`);

    const deployHints: string[] = [];
    if (!runtimeFingerprint.urlContainsProjectRef && runtimeFingerprint.urlPresent) {
      deployHints.push("l'URL runtime ne contient pas le project ref uqlhjtgcfbbhkcvjdybs (build ancien ou mauvais environnement Vercel ?)");
    }
    if (runtimeFingerprint.anonKeyPresent && !runtimeFingerprint.anonKeyStartsWithEyJ) {
      deployHints.push("la clé anon runtime ne commence pas par eyJ (format JWT Supabase attendu)");
    }
    if (!runtimeFingerprint.vercelGitCommitSha) {
      deployHints.push("pas sur Vercel ou build local — .env.local peut différer de Production");
    }

    rootCause =
      `getSupabaseEnv().configured === false → Auth et DB « Dégradé ». ` +
      `Problèmes : ${reasons.join(" · ")}. ` +
      (deployHints.length ? `Indices déploiement : ${deployHints.join(" · ")}. ` : "") +
      runtimeFingerprint.nextPublicBuildTimeNote;
  }

  return {
    runtimeMode: getRuntimeMode(),
    runtimeFingerprint,
    statusPageAuthDegraded,
    statusPageDbDegraded,
    rootCause,
    envVars,
    primaryEnvVars,
    checks,
    configured,
    hasInvalidEnv,
  };
}
