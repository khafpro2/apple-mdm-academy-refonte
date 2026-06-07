/** Apple Security — scénarios entreprise, dépannage, bonnes pratiques */

export type SecurityTopic = {
  id: string;
  title: string;
  lessonSlugs: string[];
  labSlug: string;
  resourceSlug: string;
  examWeight: number;
  coveragePercent: number;
  scenarios: SecurityScenario[];
};

export type SecurityScenario = {
  id: string;
  title: string;
  context: string;
  symptom: string;
  diagnosis: string;
  resolution: string;
  bestPractice: string;
};

const BASE_SECURITY: Omit<SecurityTopic, "coveragePercent">[] = [
  {
    id: "filevault",
    title: "FileVault",
    lessonSlugs: ["filevault-chiffrement", "m18-filevault"],
    labSlug: "apple-training-lab-filevault",
    resourceSlug: "apple-security-guide",
    examWeight: 25,
    scenarios: [
      {
        id: "fv-01",
        title: "Escrow clé manquante post-ADE",
        context: "LogiCorp — 200 Mac ADE, compliance Intune exige FileVault ON + escrow.",
        symptom: "FileVault activé mais clé recovery absente console Intune.",
        diagnosis: "Compte admin sans Secure Token avant chiffrement.",
        resolution: "Redéployer avec bootstrap token ADE ; recréer admin avec secure token.",
        bestPractice: "Toujours activer FileVault via MDM après compte admin sécurisé ADE.",
      },
      {
        id: "fv-02",
        title: "Recovery helpdesk sans escrow",
        context: "Finance — utilisateur oublie mot de passe Mac chiffré.",
        symptom: "Helpdesk ne peut pas déverrouiller, pas de clé institutionnelle.",
        diagnosis: "Escrow jamais configuré ou clé perdue lors migration Jamf→Intune.",
        resolution: "Procédure break-glass : wipe supervisé + re-ADE si données non récupérables.",
        bestPractice: "Tester escrow sur pilote 5 Mac avant rollout 500.",
      },
    ],
  },
  {
    id: "gatekeeper",
    title: "Gatekeeper",
    lessonSlugs: ["gatekeeper-notarisation"],
    labSlug: "apple-training-lab-filevault",
    resourceSlug: "apple-security-guide",
    examWeight: 20,
    scenarios: [
      {
        id: "gk-01",
        title: "App métier legacy non notarisée",
        context: "ERP interne signé Team ID mais pré-notarisation Apple.",
        symptom: "« cannot be opened because the developer cannot be verified ».",
        diagnosis: "Gatekeeper bloque app non notarisée.",
        resolution: "Profil MDM System Policy Control — allow Team ID pendant migration.",
        bestPractice: "Planifier notarisation Apple avant deadline compliance.",
      },
    ],
  },
  {
    id: "sip",
    title: "SIP",
    lessonSlugs: ["gatekeeper-notarisation", "macos-security"],
    labSlug: "apple-training-lab-filevault",
    resourceSlug: "apple-security-guide",
    examWeight: 15,
    scenarios: [
      {
        id: "sip-01",
        title: "SIP désactivé après debug Recovery",
        context: "DevOps a désactivé SIP pour driver test, jamais réactivé.",
        symptom: "Jamf Protect / compliance SIP = Non compliant.",
        diagnosis: "csrutil disable laissé actif.",
        resolution: "Recovery → csrutil enable → reboot → re-check compliance.",
        bestPractice: "Interdire SIP off via compliance policy + alerte SIEM.",
      },
    ],
  },
  {
    id: "xprotect",
    title: "XProtect",
    lessonSlugs: ["macos-security"],
    labSlug: "apple-training-lab-filevault",
    resourceSlug: "apple-security-guide",
    examWeight: 15,
    scenarios: [
      {
        id: "xp-01",
        title: "Malware détecté XProtect silencieux",
        context: "SOC alerte sur hash malware connu macOS.",
        symptom: "Utilisateur ne voit rien ; logs unified logging montrent blocage.",
        diagnosis: "XProtect a quarantiné fichier via defs OS update.",
        resolution: "Confirmer suppression, analyser vecteur (email, download), renforcer Gatekeeper.",
        bestPractice: "Maintenir macOS à jour — XProtect via security updates.",
      },
    ],
  },
  {
    id: "activation-lock",
    title: "Activation Lock",
    lessonSlugs: ["abm-creation-roles"],
    labSlug: "apple-training-lab-abm",
    resourceSlug: "apple-security-guide",
    examWeight: 15,
    scenarios: [
      {
        id: "al-01",
        title: "iPhone corporate bloqué Find My perso",
        context: "Employé part avec iPhone ADE, Find My activé Apple ID perso.",
        symptom: "Activation Lock après wipe IT.",
        diagnosis: "Find My lié compte perso avant release ABM.",
        resolution: "Bypass code ABM si supervisé ; sinon procédure Apple Support org.",
        bestPractice: "Policy : pas de Apple ID perso sur devices corp ; release ABM formalisé.",
      },
    ],
  },
  {
    id: "mda",
    title: "Managed Device Attestation",
    lessonSlugs: ["managed-device-attestation"],
    labSlug: "apple-training-lab-ddm",
    resourceSlug: "device-attestation-guide",
    examWeight: 10,
    scenarios: [
      {
        id: "mda-01",
        title: "Attestation échoue iOS BYOD",
        context: "CA Entra exige device attestation pour accès M365.",
        symptom: "Attestation failed — device not eligible.",
        diagnosis: "Appareil non supervisé ou OS sous minimum attestation.",
        resolution: "Migrer vers ADE supervision ou ajuster CA pour BYOD sans attestation.",
        bestPractice: "MDA réservé appareils supervisés ADE iOS 17+ / macOS 14+.",
      },
    ],
  },
];

function scoreSecurityTopic(t: Omit<SecurityTopic, "coveragePercent">): number {
  let s = 40; // leçons documentées via topic-overrides
  if (t.scenarios.length >= 2) s += 30;
  if (t.labSlug) s += 20;
  if (t.resourceSlug) s += 10;
  return Math.min(100, s);
}

export const APPLE_SECURITY_TOPICS: SecurityTopic[] = BASE_SECURITY.map((t) => ({
  ...t,
  coveragePercent: scoreSecurityTopic(t),
}));

export const ALL_SECURITY_SCENARIOS: SecurityScenario[] = APPLE_SECURITY_TOPICS.flatMap((t) => t.scenarios);
