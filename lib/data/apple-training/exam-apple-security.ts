import type { Question } from "@/lib/types";
import { buildQuestion, resetQuestionPositionCounter } from "@/lib/quiz/question-builder";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { variantQuestion } from "@/lib/quiz/normalize-questions";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";

export type AppleSecurityDomain = "filevault" | "gatekeeper" | "sip" | "xprotect" | "activation-lock" | "mda" | "compliance" | "troubleshooting";

export const APPLE_SECURITY_DOMAIN_COUNTS: Record<AppleSecurityDomain, number> = {
  filevault: 20,
  gatekeeper: 15,
  sip: 12,
  xprotect: 10,
  "activation-lock": 12,
  mda: 10,
  compliance: 11,
  troubleshooting: 10,
};

export const APPLE_SECURITY_EXAM_TOTAL = 100;
export const APPLE_SECURITY_PASSING_SCORE = 80;

type QInput = {
  id: string;
  domain: AppleSecurityDomain;
  text: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
};

function q(input: QInput): Question {
  return buildQuestion({
    id: input.id,
    text: input.text,
    correct: input.correct,
    distractors: input.distractors,
    explanation: input.explanation,
    moduleLabel: input.domain,
  });
}

const BASE: QInput[] = [
  { id: "asec-fv01", domain: "filevault", text: "FileVault escrow clé MDM : prérequis macOS récent ?", correct: "Secure Token / Bootstrap Token compte admin MDM", distractors: ["Apple ID perso", "Certificat email", "APNs user"], explanation: "Bootstrap Token permet escrow clé FileVault." },
  { id: "asec-fv02", domain: "filevault", text: "Compliance Intune FileVault ON mais device non compliant :", correct: "Escrow clé non remontée ou delay check-in", distractors: ["Gatekeeper", "Serial ABM", "Safari"], explanation: "Compliance exige ON + parfois escrow confirmé." },
  { id: "asec-gk01", domain: "gatekeeper", text: "App métier signée non notarisée bloquée : solution enterprise temporaire ?", correct: "Team ID allow list via profil MDM System Policy Control", distractors: ["Désactiver SIP", "Jailbreak", "Any app allow"], explanation: "Team ID allow list migration notarisation." },
  { id: "asec-gk02", domain: "gatekeeper", text: "Notarisation Apple garantit :", correct: "Scan malware Apple avant distribution hors App Store", distractors: ["App gratuite", "Chiffrement disque", "Supervision ADE"], explanation: "Notarization requise apps macOS outside App Store." },
  { id: "asec-sip01", domain: "sip", text: "SIP protège principalement :", correct: "Fichiers système — modification restreinte même root", distractors: ["Photos iCloud", "Mail user", "Downloads"], explanation: "SIP empêche altération composants système." },
  { id: "asec-sip02", domain: "sip", text: "SIP désactivé après debug Recovery — remediation ?", correct: "Recovery → csrutil enable → reboot", distractors: ["Release ABM", "Wipe iCloud", "New APNs"], explanation: "Réactiver SIP en Recovery OS." },
  { id: "asec-xp01", domain: "xprotect", text: "XProtect met à jour via :", correct: "Mises à jour système silencieuses signatures malware", distractors: ["App Store manuel", "Antivirus tiers obligatoire", "Certificat APNs"], explanation: "XProtect defs via OS security updates." },
  { id: "asec-al01", domain: "activation-lock", text: "Activation Lock org iPhone supervisé — déblocage IT ?", correct: "Bypass code ABM ou effacement supervisé MDM", distractors: ["Reset Apple ID perso seul", "Jailbreak", "Recovery sans MDM"], explanation: "ABM bypass Activation Lock appareils org." },
  { id: "asec-al02", domain: "activation-lock", text: "Find My perso activé avant release ABM — conséquence ?", correct: "Activation Lock persiste après wipe IT", distractors: ["Auto-release", "FileVault off", "APNs expire"], explanation: "Find My perso bloque release sans procédure." },
  { id: "asec-mda01", domain: "mda", text: "Managed Device Attestation CA Entra échoue BYOD :", correct: "Device non supervisé ou OS sous minimum attestation", distractors: ["FileVault off", "Mail config", "Gatekeeper"], explanation: "MDA requiert supervision ADE + OS récent." },
  { id: "asec-comp01", domain: "compliance", text: "Stack Microsoft FileVault + Conditional Access :", correct: "Intune compliance FileVault ON → CA Entra device compliant", distractors: ["Jamf seul sans Entra", "Apple ID perso", "Gatekeeper off"], explanation: "Compliance device gate accès M365." },
  { id: "asec-comp02", domain: "compliance", text: "PPPC profile sert à :", correct: "Pré-approuver accès TCC apps gérées (FDA, caméra)", distractors: ["Wi-Fi config", "Renouveler APNs", "VPP assign"], explanation: "PPPC évite prompts TCC utilisateur." },
  { id: "asec-ts01", domain: "troubleshooting", text: "Mac compliant hier, non compliant après update macOS overnight :", correct: "OS dépassé max version ou FileVault escrow failed", distractors: ["APNs", "Serial ABM", "Safari"], explanation: "Auto-update peut violer compliance OS min." },
  { id: "asec-ts02", domain: "troubleshooting", text: "Defender macOS Unhealthy Intune :", correct: "Full Disk Access non accordé Microsoft Defender", distractors: ["FileVault off", "Gatekeeper", "ADE token"], explanation: "Deploy PPPC + FDA profile Defender." },
  { id: "asec-fv03", domain: "filevault", text: "Institutional recovery key vs personal escrow MDM enterprise préfère :", correct: "Escrow MDM avec clé recovery admin console", distractors: ["Clé utilisateur seule", "Pas de clé", "iCloud Keychain"], explanation: "Escrow MDM permet helpdesk recovery." },
  { id: "asec-gk03", domain: "gatekeeper", text: "System Extensions vs Kernel Extensions direction Apple :", correct: "System Extensions remplacent kexts dépréciés", distractors: ["kexts obligatoires", "Extensions interdites", "Identiques"], explanation: "Apple migre vers System Extensions user-space." },
  { id: "asec-mda02", domain: "mda", text: "Attestation iOS 17 minimum typique enterprise :", correct: "Supervised ADE + OS 17+ + MDM attestation policy", distractors: ["BYOD user enrollment", "Apple ID perso", "macOS 10.14"], explanation: "MDA enterprise = supervised fleet récente." },
  { id: "asec-comp03", domain: "compliance", text: "Secure Enclave stocke :", correct: "Clés biométriques et opérations crypto isolées", distractors: ["Documents user", "Profils MDM", "Tokens ABM"], explanation: "Secure Enclave = coprocesseur sécurité matérielle." },
];

function expandPool(questions: Question[], target: number): Question[] {
  const pool = [...questions];
  let v = 0;
  while (pool.length < target) {
    for (const base of questions) {
      if (pool.length >= target) break;
      pool.push(variantQuestion(base, v));
    }
    v++;
  }
  return pool.slice(0, target);
}

function buildDomainPools(): Record<AppleSecurityDomain, Question[]> {
  resetQuestionPositionCounter();
  const byDomain = {} as Record<AppleSecurityDomain, Question[]>;
  for (const input of BASE) {
    const question = q(input);
    if (!byDomain[input.domain]) byDomain[input.domain] = [];
    byDomain[input.domain]!.push(question);
  }
  const result = {} as Record<AppleSecurityDomain, Question[]>;
  for (const [domain, count] of Object.entries(APPLE_SECURITY_DOMAIN_COUNTS) as [AppleSecurityDomain, number][]) {
    result[domain] = expandPool(byDomain[domain] ?? [], count);
  }
  return result;
}

export function buildAppleSecurityExamPool100(): Question[] {
  const pools = buildDomainPools();
  return (Object.keys(pools) as AppleSecurityDomain[]).flatMap((d) => pools[d]);
}

export const appleSecurityExamPool100 = buildAppleSecurityExamPool100();

export function pickAppleSecurityExamQuestions(sessionSeed: string): Question[] {
  const pools = buildDomainPools();
  const picked: Question[] = [];
  for (const [domain, count] of Object.entries(APPLE_SECURITY_DOMAIN_COUNTS) as [AppleSecurityDomain, number][]) {
    const shuffled = shuffleArray(pools[domain] ?? [], `${sessionSeed}-${domain}`);
    picked.push(...shuffled.slice(0, count));
  }
  const final = shuffleArray(picked, sessionSeed);
  return final.map((question, i) =>
    enrichQuestionWithModule({
      ...question,
      id: `asec-exam-${sessionSeed.slice(0, 8)}-${i}-${question.id}`,
    })
  );
}
