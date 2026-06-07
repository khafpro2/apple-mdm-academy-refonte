import {
  isSupabaseConfigured,
  validateAnonKey,
  validateSiteUrl,
  validateSupabaseUrl,
} from "@/lib/supabase/env-validation";
import { getRuntimeMode } from "@/lib/supabase/diagnostics.server";

export type RuntimeEnvVarCheck = {
  name: string;
  present: boolean;
  valid: boolean;
  validationDetail: string;
};

export type RuntimeEnvCheckReport = {
  runtimeMode: ReturnType<typeof getRuntimeMode>;
  variables: RuntimeEnvVarCheck[];
  supabaseConfigured: boolean;
  buildTimestamp: string;
  vercelGitCommitSha: string | null;
  checkedAt: string;
  redeployNote: string;
};

function getBuildTimestamp(): { display: string; sha: string | null } {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.trim() || null;
  if (sha) {
    return { display: sha, sha };
  }
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID?.trim();
  if (deploymentId) {
    return { display: `Déploiement ${deploymentId} (SHA absent)`, sha: null };
  }
  return { display: "Build local — VERCEL_GIT_COMMIT_SHA non défini", sha: null };
}

export function getRuntimeEnvCheckReport(): RuntimeEnvCheckReport {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const urlValidation = validateSupabaseUrl(url);
  const anonValidation = validateAnonKey(anonKey);
  const siteValidation = validateSiteUrl(siteUrl);
  const build = getBuildTimestamp();

  return {
    runtimeMode: getRuntimeMode(),
    variables: [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        present: Boolean(url?.trim()),
        valid: urlValidation.state === "configured",
        validationDetail: urlValidation.detail,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        present: Boolean(anonKey?.trim()),
        valid: anonValidation.state === "configured",
        validationDetail: anonValidation.detail,
      },
      {
        name: "NEXT_PUBLIC_SITE_URL",
        present: Boolean(siteUrl?.trim()),
        valid: siteValidation.state === "configured",
        validationDetail: siteValidation.detail,
      },
    ],
    supabaseConfigured: isSupabaseConfigured(url, anonKey),
    buildTimestamp: build.display,
    vercelGitCommitSha: build.sha,
    checkedAt: new Date().toISOString(),
    redeployNote:
      "Les variables NEXT_PUBLIC_* sont figées au build. Après modification sur Vercel, un redéploiement est requis pour les recharger.",
  };
}
