import type { LabTechnology } from "@/lib/types";

export const TECHNOLOGY_STYLES: Record<LabTechnology, string> = {
  "ABM + Intune": "bg-gray-900 text-white",
  "ADE + Intune": "bg-sky-600 text-white",
  "APNs + Apple": "bg-orange-600 text-white",
  "Apps & Books": "bg-blue-600 text-white",
  "Managed Apple ID": "bg-slate-700 text-white",
  "Platform SSO": "bg-indigo-700 text-white",
  "Platform SSO + MFA": "bg-indigo-900 text-white",
  "Jamf Pro": "bg-violet-600 text-white",
  "Jamf Protect": "bg-fuchsia-700 text-white",
  FileVault: "bg-purple-700 text-white",
  "Sécurité macOS": "bg-emerald-700 text-white",
  "Intune Compliance": "bg-cyan-700 text-white",
  "Microsoft Entra ID": "bg-blue-800 text-white",
  "Microsoft Defender": "bg-red-700 text-white",
  "Managed Apple ID + Federation": "bg-slate-900 text-white",
};

export const STATUS_LABELS = {
  not_started: "Non commencé",
  in_progress: "En cours",
  completed: "Terminé",
} as const;

export const STATUS_STYLES = {
  not_started: "bg-surface text-ink-secondary border-border-light",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
} as const;
