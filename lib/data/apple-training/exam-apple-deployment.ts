import type { Question } from "@/lib/types";
import { buildQuestion, resetQuestionPositionCounter } from "@/lib/quiz/question-builder";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { variantQuestion } from "@/lib/quiz/normalize-questions";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";

export type AppleDeploymentDomain = "abm" | "ade" | "apns" | "apps-books" | "maid" | "psso" | "ddm" | "mda" | "architecture";

export const APPLE_DEPLOYMENT_DOMAIN_COUNTS: Record<AppleDeploymentDomain, number> = {
  abm: 15,
  ade: 15,
  apns: 12,
  "apps-books": 10,
  maid: 12,
  psso: 12,
  ddm: 12,
  mda: 6,
  architecture: 6,
};

export const APPLE_DEPLOYMENT_EXAM_TOTAL = 100;
export const APPLE_DEPLOYMENT_PASSING_SCORE = 80;

type QInput = {
  id: string;
  domain: AppleDeploymentDomain;
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
  { id: "adep-abm01", domain: "abm", text: "GlobalTech 3 entités juridiques — comment segmenter inventaire ABM ?", correct: "Emplacements (Locations) par entité avec admins régionaux", distractors: ["Un Apple ID admin global", "Smart Groups Jamf", "Certificat APNs par pays"], explanation: "Locations ABM segmentent achats et gouvernance multi-pays." },
  { id: "adep-abm02", domain: "abm", text: "Rôle ABM pour assigner serials sans accès Apps & Books ?", correct: "Device Enrollment Manager", distractors: ["Content Manager", "People Manager", "Support"], explanation: "DEM gère ADE et assignations MDM." },
  { id: "adep-ade01", domain: "ade", text: "500 Mac zero-touch : assignation serials avant livraison se fait dans :", correct: "ABM Devices → MDM server", distractors: ["Setup Assistant manuel", "Apple Configurator seul", "Email PDF"], explanation: "ADE requiert assignation ABM pré-unboxing." },
  { id: "adep-ade02", domain: "ade", text: "Await Device Configured sur profil ADE :", correct: "Retarde bureau jusqu'à fin policies MDM", distractors: ["Accélère Wi-Fi", "Désactive supervision", "Force iCloud perso"], explanation: "Blocage jusqu'à configuration MDM terminée." },
  { id: "adep-apns01", domain: "apns", text: "Renouvellement APNs avec mauvais Apple ID — symptôme ?", correct: "Aucune commande MDM push reçue", distractors: ["FileVault off", "Mail seul", "Safari crash"], explanation: "APNs lié Apple ID créateur — mauvais ID = push mort." },
  { id: "adep-apns02", domain: "apns", text: "Certificat APNs expire J-7. Action prioritaire ?", correct: "Renouveler avec MÊME Apple ID, importer .pem MDM", distractors: ["Changer serial ABM", "Wipe flotte", "Désactiver ADE"], explanation: "Renouvellement même Apple ID préserve topic push." },
  { id: "adep-vpp01", domain: "apps-books", text: "Licence VPP device-based suit :", correct: "Serial ou UDID appareil", distractors: ["Email RH", "Apple ID perso", "Nom compte local"], explanation: "Device-based VPP lie licence au device." },
  { id: "adep-vpp02", domain: "apps-books", text: "App VPP Required reste Not Installed Intune — cause fréquente ?", correct: "Licences non assignées serveur MDM dans ABM", distractors: ["FileVault off", "Gatekeeper", "SIP off"], explanation: "ABM Apps & Books → assign licenses to MDM." },
  { id: "adep-maid01", domain: "maid", text: "Managed Apple ID vs Apple ID personnel enterprise ?", correct: "MAID créé/géré org — achats perso séparés", distractors: ["Identiques", "MAID requis APNs", "Apple ID perso obligatoire MDM"], explanation: "MAID = identité org contrôlée IT." },
  { id: "adep-maid02", domain: "maid", text: "Fédération Entra → MAID échoue. Vérification DNS ?", correct: "TXT domaine vérifié ABM Settings", distractors: ["MX mail", "CNAME www", "SRV LDAP"], explanation: "Apple exige TXT pour propriété domaine." },
  { id: "adep-psso01", domain: "psso", text: "Platform SSO macOS avec Entra : prérequis clé ?", correct: "Mac supervisé ADE + extension Microsoft + profil PSSO MDM", distractors: ["Apple ID perso", "Jailbreak", "Certificat email"], explanation: "PSSO requiert enrollment MDM et extension SSO." },
  { id: "adep-psso02", domain: "psso", text: "MFA à chaque unlock macOS malgré PSSO — cause ?", correct: "Conditional Access sign-in frequency trop agressive", distractors: ["APNs expiré", "FileVault off", "Serial ABM"], explanation: "Ajuster CA session lifetime + PSSO registration." },
  { id: "adep-ddm01", domain: "ddm", text: "DDM vs profils impératifs legacy :", correct: "Declarations + status reports remplacent push one-shot", distractors: ["Identiques", "DDM interdit MDM", "Legacy obligatoire iOS 17"], explanation: "DDM = modèle déclaratif avec feedback device." },
  { id: "adep-ddm02", domain: "ddm", text: "Software update enforcement DDM OS minimum :", correct: "macOS 14+ / iOS 17+ selon declaration", distractors: ["macOS 10.15", "Tous OS", "Windows only"], explanation: "DDM software update requiert OS récents." },
  { id: "adep-mda01", domain: "mda", text: "Managed Device Attestation échoue BYOD :", correct: "Appareil non supervisé ou OS sous minimum", distractors: ["FileVault off", "Gatekeeper", "Mail config"], explanation: "MDA réservé appareils supervisés ADE récents." },
  { id: "adep-arch01", domain: "architecture", text: "Chaîne déploiement Apple enterprise :", correct: "ABM → ADE → MDM (Intune/Jamf) → APNs → policies", distractors: ["iCloud seul", "Apple ID perso", "Apple Configurator chaque device"], explanation: "Stack standard ABM inventory + MDM management." },
  { id: "adep-ade03", domain: "ade", text: "Mac bloqué « Configuring your Mac » 2h ADE :", correct: "Vérifier réseau, MDM reachable, profils ADE trop lourds", distractors: ["Attendre 48h", "Remplacer hardware", "Désactiver APNs"], explanation: "Split profils ADE minimal + post-enrollment." },
  { id: "adep-abm03", domain: "abm", text: "Token server_token.p7m expiré — symptôme Intune ?", correct: "Nouveaux appareils ADE absents après sync", distractors: ["Safari crash", "FileVault off", "Gatekeeper"], explanation: "Token expiré rompt sync ABM ↔ MDM." },
  { id: "adep-apns03", domain: "apns", text: "Test validation APNs après renouvellement :", correct: "Commande Lock ou Sync sur appareil test", distractors: ["Reboot ABM", "Acheter VPP", "Changer domaine"], explanation: "Push test confirme certificat opérationnel." },
  { id: "adep-psso03", domain: "psso", text: "Platform SSO offline grace :", correct: "Credential cache TTL limité — break-glass documenté", distractors: ["Infini offline", "Impossible offline", "Requiert iCloud"], explanation: "PSSO offline limité par design sécurité." },
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

function buildDomainPools(): Record<AppleDeploymentDomain, Question[]> {
  resetQuestionPositionCounter();
  const byDomain = {} as Record<AppleDeploymentDomain, Question[]>;
  for (const input of BASE) {
    const question = q(input);
    if (!byDomain[input.domain]) byDomain[input.domain] = [];
    byDomain[input.domain]!.push(question);
  }
  const result = {} as Record<AppleDeploymentDomain, Question[]>;
  for (const [domain, count] of Object.entries(APPLE_DEPLOYMENT_DOMAIN_COUNTS) as [AppleDeploymentDomain, number][]) {
    result[domain] = expandPool(byDomain[domain] ?? [], count);
  }
  return result;
}

export function buildAppleDeploymentExamPool100(): Question[] {
  const pools = buildDomainPools();
  return (Object.keys(pools) as AppleDeploymentDomain[]).flatMap((d) => pools[d]);
}

export const appleDeploymentExamPool100 = buildAppleDeploymentExamPool100();

export function pickAppleDeploymentExamQuestions(sessionSeed: string): Question[] {
  const pools = buildDomainPools();
  const picked: Question[] = [];
  for (const [domain, count] of Object.entries(APPLE_DEPLOYMENT_DOMAIN_COUNTS) as [AppleDeploymentDomain, number][]) {
    const shuffled = shuffleArray(pools[domain] ?? [], `${sessionSeed}-${domain}`);
    picked.push(...shuffled.slice(0, count));
  }
  const final = shuffleArray(picked, sessionSeed);
  return final.map((question, i) =>
    enrichQuestionWithModule({
      ...question,
      id: `adep-exam-${sessionSeed.slice(0, 8)}-${i}-${question.id}`,
    })
  );
}
