import type { Question } from "@/lib/types";

/** Liens module pour corrections examen */
const PREFIX_MODULES: { prefix: string; href: string; label: string }[] = [
  { prefix: "itp-", href: "/cours/apple-it-professional/abm-creation-roles", label: "Apple IT Professional" },
  { prefix: "j100-", href: "/cours/jamf-100/smart-groups", label: "Jamf 100" },
  { prefix: "j200-", href: "/cours/jamf-200/patch-management", label: "Jamf 200" },
  { prefix: "int-", href: "/cours/intune-mac/abm-intune", label: "Intune Apple" },
  { prefix: "ia-", href: "/cours/intune-mac/abm-intune", label: "Intune Apple Devices" },
  { prefix: "j300-", href: "/cours/jamf-300/j300-m01", label: "Jamf 300 Prep" },
  { prefix: "j400-", href: "/cours/jamf-400/j400-m01", label: "Jamf 400 Prep" },
  { prefix: "aee-", href: "/cours/apple-enterprise-expert/aee-m01", label: "Apple Enterprise Expert" },
  { prefix: "iaa-", href: "/cours/intune-apple-advanced/iaa-m01", label: "Intune Apple Advanced" },
];

export function enrichQuestionWithModule(q: Question): Question {
  if (q.moduleHref) return q;
  const baseId = q.id.replace(/-v\d+$/, "").replace(/^exam-[^-]+-\d+-/, "");
  for (const m of PREFIX_MODULES) {
    if (baseId.startsWith(m.prefix)) {
      return { ...q, moduleHref: m.href, moduleLabel: m.label };
    }
  }
  return q;
}

export function enrichPool(questions: Question[]): Question[] {
  return questions.map(enrichQuestionWithModule);
}
