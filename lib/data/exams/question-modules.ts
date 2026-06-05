import type { Question } from "@/lib/types";

/** Liens module pour corrections examen */
const PREFIX_MODULES: { prefix: string; href: string; label: string }[] = [
  { prefix: "itp-", href: "/cours/apple-it-professional/abm-creation-roles", label: "Apple IT Professional" },
  { prefix: "j100-", href: "/cours/jamf-100/smart-groups", label: "Jamf 100" },
  { prefix: "j200-", href: "/cours/jamf-200/patch-management", label: "Jamf 200" },
  { prefix: "int-", href: "/cours/intune-mac/abm-intune", label: "Intune Apple" },
  { prefix: "ia-", href: "/cours/intune-mac/abm-intune", label: "Intune Apple Devices" },
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
