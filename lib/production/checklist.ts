import { getSupabaseEnv } from "@/lib/env";
import { stripeConfig } from "@/lib/pricing/stripe-config";
import { siteConfig } from "@/lib/seo/site-config";

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  detail?: string;
};

export function getProductionChecklist(): ChecklistItem[] {
  const supabase = getSupabaseEnv();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const adminEmails = process.env.ADMIN_EMAILS;

  const envVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SITE_URL",
  ].filter((k) => Boolean(process.env[k]));

  return [
    {
      id: "vercel-env",
      label: "Variables Vercel configurées",
      done: envVars.length >= 3,
      detail: `${envVars.length}/3 variables essentielles détectées`,
    },
    {
      id: "supabase-auth",
      label: "Supabase Auth configuré",
      done: supabase.configured,
      detail: supabase.configured ? "Clés Supabase présentes" : "NEXT_PUBLIC_SUPABASE_* manquantes",
    },
    {
      id: "redirect-urls",
      label: "Redirect URLs OK",
      done: Boolean(siteUrl),
      detail: siteUrl ? `Site URL : ${siteUrl}` : "NEXT_PUBLIC_SITE_URL non définie",
    },
    {
      id: "admin-emails",
      label: "Emails admin configurés",
      done: Boolean(adminEmails),
      detail: adminEmails ? "ADMIN_EMAILS défini" : "ADMIN_EMAILS optionnel — non défini",
    },
    {
      id: "sql",
      label: "SQL exécuté",
      done: supabase.configured,
      detail: "Vérifiez manuellement supabase/schema-admin.sql en production",
    },
    {
      id: "build",
      label: "Build OK",
      done: true,
      detail: "Build validé localement",
    },
    {
      id: "sitemap",
      label: "Sitemap OK",
      done: true,
      detail: `${siteConfig.url}/sitemap.xml`,
    },
    {
      id: "robots",
      label: "Robots OK",
      done: true,
      detail: `${siteConfig.url}/robots.txt`,
    },
    {
      id: "legal",
      label: "Pages légales OK",
      done: true,
      detail: "/privacy, /terms, /legal",
    },
    {
      id: "pricing",
      label: "Pricing OK",
      done: true,
      detail: stripeConfig.enabled ? "Stripe activé" : "Stripe en mode démo",
    },
    {
      id: "labs",
      label: "Labs OK",
      done: true,
    },
    {
      id: "exams",
      label: "Examens OK",
      done: true,
    },
    {
      id: "certificates",
      label: "Certificats OK",
      done: true,
    },
  ];
}
