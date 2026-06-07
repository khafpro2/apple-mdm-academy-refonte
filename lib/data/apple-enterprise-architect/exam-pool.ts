import type { Question } from "@/lib/types";
import { buildQuestion, resetQuestionPositionCounter } from "@/lib/quiz/question-builder";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { variantQuestion } from "@/lib/quiz/normalize-questions";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";
import type { AeaExamDomain } from "./domains";
import { AEA_DOMAIN_COUNTS } from "./domains";

type QInput = {
  id: string;
  domain: AeaExamDomain;
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
  // Architecture (10 base → 30)
  { id: "aea-a01", domain: "architecture", text: "Scénario 5000 Mac — où centraliser inventaire serials source vérité ?", correct: "Apple Business Manager", distractors: ["Spreadsheet RH", "Entra ID Devices seul", "DNS interne"], explanation: "ABM est la source officielle serials org pour ADE." },
  { id: "aea-a02", domain: "architecture", text: "APNs dans stack Apple Enterprise sert à :", correct: "Réveiller appareils pour check-in MDM", distractors: ["Chiffrer FileVault", "Sync Entra users", "Signer apps VPP"], explanation: "APNs = canal push Apple MDM." },
  { id: "aea-a03", domain: "architecture", text: "Dual enrollment Jamf + Intune même Mac — recommandation architecte ?", correct: "Éviter — un MDM owner par plateforme, migration planifiée", distractors: ["Toujours recommandé", "Requis Apple", "Remplace ABM"], explanation: "Coexistence dual MDM crée conflits profils." },
  { id: "aea-a04", domain: "architecture", text: "Managed Apple ID diffère Apple ID perso car :", correct: "Géré org ABM — pas App Store perso complet", distractors: ["Identiques", "Requis APNs", "Remplace Entra"], explanation: "MAID = identité organisationnelle Apple." },
  { id: "aea-a05", domain: "architecture", text: "Staging ABM/MDM sert à :", correct: "Tester ADE/profils avant production", distractors: ["Remplacer APNs prod", "Désactiver supervision", "Bypass CA"], explanation: "Séparation staging/prod limite risques rollout." },
  { id: "aea-a06", domain: "architecture", text: "Platform SSO macOS requiert :", correct: "macOS 14+ extension Entra + profil MDM", distractors: ["iTunes", "Apple ID perso", "Gatekeeper off"], explanation: "PSSO = extension + Entra + MDM payload." },
  { id: "aea-a07", domain: "architecture", text: "Token ABM expiré impacte :", correct: "Nouveaux enrollments ADE — pas appareils déjà gérés", distractors: ["Efface tous Mac", "Désactive Entra", "Supprime VPP"], explanation: "Token expiré bloque sync nouveaux serials." },
  { id: "aea-a08", domain: "architecture", text: "Architecte documente calendrier renouvellement :", correct: "APNs + ABM token + VPP — mêmes Apple ID", distractors: ["Uniquement passwords users", "Certificats email", "DNS seul"], explanation: "Ops critique : APNs même Apple ID, token annuel ABM." },
  { id: "aea-a09", domain: "architecture", text: "Supervision ADE permet :", correct: "Restrictions avancées + silent VPP install", distractors: ["Jailbreak", "Retrait MDM user", "iCloud perso obligatoire"], explanation: "Supervision débloque payloads enterprise." },
  { id: "aea-a10", domain: "architecture", text: "Await Device Configured ADE :", correct: "Retarde fin Setup jusqu'à profils MDM appliqués", distractors: ["Accélère Wi-Fi", "Désactive FileVault", "Bypass CA"], explanation: "Évite utilisateur prod avant config IT." },

  // Deployment (10)
  { id: "aea-d01", domain: "deployment", text: "Rollout 500 Mac zero-touch — assignation serials :", correct: "ABM bulk assign MDM server pré-livraison", distractors: ["Manuel post-setup", "Email users", "Configurator each"], explanation: "ADE requiert assignation ABM avant unboxing." },
  { id: "aea-d02", domain: "deployment", text: "Pilote 50 Mac avant 450 production — KPI clé ?", correct: "Time-to-productivity + taux échec enrollment", distractors: ["Couleur wallpaper", "Nombre emails", "Taille logo"], explanation: "Pilote mesure enrollment success et TTP." },
  { id: "aea-d03", domain: "deployment", text: "Profils ADE trop lourds causent :", correct: "Timeout Setup Assistant / Await Device Configured stuck", distractors: ["APNs invalid", "Entra delete", "SIP off"], explanation: "Minimal ADE + post-enrollment policies." },
  { id: "aea-d04", domain: "deployment", text: "VPP device-based licenses suivent :", correct: "Serial appareil supervisé", distractors: ["Email RH", "Apple ID perso", "IP"], explanation: "Device-based VPP = serial." },
  { id: "aea-d05", domain: "deployment", text: "Migration Jamf→Intune méthode propre :", correct: "Wipe/re-ADE ou retrait profil Jamf puis ADE Intune", distractors: ["Dual MDM permanent", "Ignore ABM", "User remove MDM"], explanation: "Migration = plan wipe/re-enroll typiquement." },
  { id: "aea-d06", domain: "deployment", text: "Intune global deployment segmente par :", correct: "Groupes dynamiques Entra région + profiles régionaux", distractors: ["Langue clavier seule", "Apple ID", "One profile all"], explanation: "Régions = assignments + Wi-Fi/VPN locaux." },
  { id: "aea-d07", domain: "deployment", text: "Jamf PreStage Enterprise 500 Mac inclut :", correct: "ADE minimal + policies post-enrollment scoped SG", distractors: ["Manual bind each", "No Smart Groups", "Skip APNs"], explanation: "PreStage léger + automation post-login." },
  { id: "aea-d08", domain: "deployment", text: "Remote Management Setup Assistant prouve :", correct: "Liaison Apple MDM ADE réussie", distractors: ["Recovery mode", "Hardware fault", "iCloud required"], explanation: "Remote Management = MDM profile downloaded." },
  { id: "aea-d09", domain: "deployment", text: "Company Portal macOS complète ADE pour :", correct: "Enrollment utilisateur / apps available BYOD", distractors: ["Remplace ABM", "Renouvelle APNs", "FileVault escrow"], explanation: "CP = user enrollment et catalogue apps." },
  { id: "aea-d10", domain: "deployment", text: "Release device ABM avant revente :", correct: "Serial libéré autre org + wipe supervisé", distractors: ["Garde Activation Lock", "Keep MDM", "Ignore wipe"], explanation: "Release + wipe = offboarding matériel." },

  // Security (10)
  { id: "aea-s01", domain: "security", text: "FileVault escrow MDM requiert :", correct: "Bootstrap/secure token compte admin MDM", distractors: ["Apple ID perso", "Email cert", "APNs user"], explanation: "Bootstrap token permet escrow vers MDM." },
  { id: "aea-s02", domain: "security", text: "Gatekeeper app legacy non notarisée enterprise :", correct: "Allow Team ID via MDM System Policy Control", distractors: ["Disable SIP", "Allow any", "Jailbreak"], explanation: "Team ID allow list transition notarisation." },
  { id: "aea-s03", domain: "security", text: "MDA Managed Device Attestation usage :", correct: "Preuve intégrité device Zero Trust iOS", distractors: ["Wallpaper", "VPP only", "DNS"], explanation: "Attestation crypto device trust." },
  { id: "aea-s04", domain: "security", text: "Audit sécurité 500 Mac sample :", correct: "10 % parc + compliance export + local verify", distractors: ["1 Mac only", "No MDM logs", "User survey"], explanation: "Audit statistique + preuves MDM." },
  { id: "aea-s05", domain: "security", text: "SIP compliance policy detect off alerte :", correct: "Mac booted Recovery csrutil disable — incident sécurité", distractors: ["Normal", "Ignore", "Disable CA"], explanation: "SIP off = anomalie production." },
  { id: "aea-s06", domain: "security", text: "Activation Lock org bypass via :", correct: "ABM bypass code ou erase supervisé MDM", distractors: ["Apple ID perso guess", "Jailbreak", "DNS"], explanation: "ABM fournit bypass org devices." },
  { id: "aea-s07", domain: "security", text: "Defender macOS + compliance stack :", correct: "Defender healthy in compliance → CA M365", distractors: ["Optional only", "Replaces FileVault", "No Entra"], explanation: "EDR + compliance + CA Zero Trust." },
  { id: "aea-s08", domain: "security", text: "XProtect updates via :", correct: "macOS system updates silently", distractors: ["Manual App Store", "APNs", "VPP"], explanation: "XProtect defs with OS updates." },
  { id: "aea-s09", domain: "security", text: "PPPC profile purpose :", correct: "Pre-approve TCC disk/camera/micro apps managed", distractors: ["Wi-Fi", "APNs renew", "ADE token"], explanation: "PPPC évite prompts TCC bloquants." },
  { id: "aea-s10", domain: "security", text: "ISO audit FileVault proof :", correct: "MDM escrow key present + compliance FileVault ON", distractors: ["User verbal confirm", "Screenshot only", "iCloud"], explanation: "Preuves MDM escrow + compliance." },

  // Jamf (8)
  { id: "aea-j01", domain: "jamf", text: "Smart Groups circulaires Jamf 11.16 :", correct: "Recalcul circulaire — éviter dépendances mutuelles", distractors: ["Recommandés", "Replace APNs", "Required API"], explanation: "Doc 11.16 warn circular Smart Groups." },
  { id: "aea-j02", domain: "jamf", text: "Policy scope retiré après exécution :", correct: "Ne rollback pas changements déjà appliqués", distractors: ["Undo all", "Uninstall auto", "Reset OS"], explanation: "Retrait scope ≠ revert settings." },
  { id: "aea-j03", domain: "jamf", text: "Patch policy eligible list :", correct: "Auto-generated preview before scope", distractors: ["Manual pick all", "Random", "APNs based"], explanation: "Preview eligible avant production patch." },
  { id: "aea-j04", domain: "jamf", text: "Distribution Point rôle 500 Mac WAN :", correct: "Cache packages regionally reduce bandwidth", distractors: ["Replace APNs", "Store emails", "DNS only"], explanation: "DP = cache déploiement packages." },
  { id: "aea-j05", domain: "jamf", text: "Script policy exit 0 but no change :", correct: "Verify jamf.log + witness file + Policy Logs", distractors: ["Ignore", "Delete SG", "Renew ABM"], explanation: "Scripts must prove effect." },
  { id: "aea-j06", domain: "jamf", text: "Self Service patch policies search :", correct: "Not in SS search results — use category/link", distractors: ["Always searchable", "Replace policies", "Hidden APNs"], explanation: "Jamf 11.16 patch SS search limitation." },
  { id: "aea-j07", domain: "jamf", text: "Jamf API OAuth2 automation :", correct: "Token refresh scheduled + secrets in vault", distractors: ["Hardcode password", "No refresh", "FTP"], explanation: "API prod = OAuth refresh + vault." },
  { id: "aea-j08", domain: "jamf", text: "500 Mac rollout Jamf trigger post-ADE :", correct: "Enrollment Complete + Recurring Check-in policies", distractors: ["Manual each", "Email script", "Skip PreStage"], explanation: "Automation triggers post enrollment." },

  // Intune (8)
  { id: "aea-i01", domain: "intune", text: "Intune APNs path :", correct: "Devices > Enrollment > Apple > MDM Push Certificate", distractors: ["Apps iOS", "Tenant branding", "Exchange"], explanation: "Chemin Microsoft Learn APNs." },
  { id: "aea-i02", domain: "intune", text: "Compliance unknown all devices :", correct: "Compliance policy not assigned", distractors: ["APNs ok", "Normal delay forever", "ABM down"], explanation: "Assignment required for evaluation." },
  { id: "aea-i03", domain: "intune", text: "Defender macOS unhealthy first fix :", correct: "Full Disk Access for Defender agent", distractors: ["Renew VPP", "Disable CA", "Remove ADE"], explanation: "FDA common degraded cause." },
  { id: "aea-i04", domain: "intune", text: "Intune script macOS user context :", correct: "Run as root cannot change user prefs — use launchctl asuser", distractors: ["Always works", "Use email", "APNs"], explanation: "Root vs user context scripts." },
  { id: "aea-i05", domain: "intune", text: "Global profile deployment latency :", correct: "Split profiles + regional pilot groups", distractors: ["One giant profile", "Disable sync", "Remove APNs"], explanation: "Staged rollout reduces failures." },
  { id: "aea-i06", domain: "intune", text: "Platform SSO Intune payload :", correct: "macOS configuration Platform SSO extension IDs", distractors: ["iOS only wallpaper", "APNs CSR", "VPP token"], explanation: "PSSO = macOS config profile." },
  { id: "aea-i07", domain: "intune", text: "Enrollment token sync fails :", correct: "Expired .p7m or wrong ABM MDM server", distractors: ["FileVault", "Safari", "Teams"], explanation: "Token + ABM assignment chain." },
  { id: "aea-i08", domain: "intune", text: "Intune macOS FileVault compliance + CA :", correct: "Non compliant blocks M365 when CA requires compliant", distractors: ["No link Entra", "Optional", "Blocks APNs"], explanation: "Compliance feeds Entra CA." },

  // Entra (10)
  { id: "aea-e01", domain: "entra", text: "ABM federation Entra enables :", correct: "Managed Apple IDs SSO org domain", distractors: ["Replace MDM", "APNs auto", "VPP delete"], explanation: "Federation = MAID + Entra identity." },
  { id: "aea-e02", domain: "entra", text: "CA report-only mode :", correct: "Logs impact without blocking — before enforcement", distractors: ["Blocks all", "Disables MFA", "Deletes devices"], explanation: "Report-only = safe CA rollout." },
  { id: "aea-e03", domain: "entra", text: "Break-glass accounts CA :", correct: "Excluded from block policies — monitored", distractors: ["Same rules all", "No MFA ever", "Public internet"], explanation: "Emergency access excluded but audited." },
  { id: "aea-e04", domain: "entra", text: "Dynamic group All Mac ADE criterion :", correct: "deviceEnrollmentProfileName or OS + management agent", distractors: ["Favorite color", "Apple ID", "Screen size"], explanation: "Dynamic groups for Intune assignments." },
  { id: "aea-e05", domain: "entra", text: "PSSO + MFA same session :", correct: "CA can require MFA at PSSO registration/apps", distractors: ["MFA impossible", "Disables SSO", "Blocks ABM"], explanation: "CA applies to Entra auth flows." },
  { id: "aea-e06", domain: "entra", text: "Sign-in logs diagnose CA block :", correct: "conditionalAccessStatus + failure reason", distractors: ["Only wallpaper", "DNS MX", "VPP"], explanation: "Entra logs = CA diagnostics." },
  { id: "aea-e07", domain: "entra", text: "Offboarding user Apple stack :", correct: "Disable Entra → revoke MAID → remote wipe corp device", distractors: ["Keep all access", "Only email", "Ignore ABM"], explanation: "Identity offboarding chain." },
  { id: "aea-e08", domain: "entra", text: "Hybrid UPN mismatch breaks :", correct: "Platform SSO and Conditional Access device trust", distractors: ["Only printer", "Gatekeeper", "XProtect"], explanation: "UPN sync critical PSSO/CA." },
  { id: "aea-e09", domain: "entra", text: "Require compliant device CA scope :", correct: "M365 apps + Intune compliance Apple devices", distractors: ["Public web all", "Guest unlimited", "No Intune"], explanation: "CA grant compliant for cloud apps." },
  { id: "aea-e10", domain: "entra", text: "Domain TXT ABM verification :", correct: "Proves domain ownership for federation", distractors: ["Email MX", "SSL web", "APNs"], explanation: "DNS TXT for ABM domain." },

  // Troubleshooting (10)
  { id: "aea-t01", domain: "troubleshooting", text: "MDM commands pending 24h — first check :", correct: "APNs certificate validity same Apple ID", distractors: ["User reboot only", "Change wallpaper", "Delete Entra"], explanation: "APNs first layer troubleshooting." },
  { id: "aea-t02", domain: "troubleshooting", text: "Profile Wi-Fi Failed 30% fleet :", correct: "802.1X cert expired — renew SCEP/PKI", distractors: ["Rename Mac", "ABM release", "Disable SIP"], explanation: "Cert lifecycle breaks Wi-Fi MDM." },
  { id: "aea-t03", domain: "troubleshooting", text: "Jamf policy success no install :", correct: "Check DP reachability and install.log", distractors: ["Ignore logs", "Delete ABM", "Turn off APNs"], explanation: "Package deploy = DP + logs." },
  { id: "aea-t04", domain: "troubleshooting", text: "Compliance delay after fix :", correct: "Up to 4h — force sync accelerates", distractors: ["Instant always", "Never updates", "Requires wipe"], explanation: "Intune compliance evaluation delay." },
  { id: "aea-t05", domain: "troubleshooting", text: "PSSO fails post macOS update :", correct: "Verify extension Team ID in MDM profile", distractors: ["Reinstall iTunes", "New ABM", "Disable FileVault"], explanation: "PSSO payload must match extension." },
  { id: "aea-t06", domain: "troubleshooting", text: "VPP app Not Installed Intune :", correct: "Licenses not assigned MDM server ABM", distractors: ["APNs renew", "User iCloud", "Gatekeeper"], explanation: "VPP license chain ABM→MDM." },
  { id: "aea-t07", domain: "troubleshooting", text: "Smart Group zero members valid criteria :", correct: "EA script timeout — simplify criteria", distractors: ["Normal always", "Delete Jamf", "APNs"], explanation: "EA failures empty Smart Groups." },
  { id: "aea-t08", domain: "troubleshooting", text: "Duplicate MDM profiles Jamf+Intune :", correct: "Migration incomplete — follow wipe/re-ADE runbook", distractors: ["Keep both forever", "User choice", "Ignore conflicts"], explanation: "Dual profiles = migration issue." },
  { id: "aea-t09", domain: "troubleshooting", text: "CA report-only but user blocked :", correct: "Another CA policy Enabled — check all policies", distractors: ["Impossible", "Only DNS", "VPP"], explanation: "Multiple CA policies interact." },
  { id: "aea-t10", domain: "troubleshooting", text: "Architect ops gap token renewal :", correct: "Shared calendar dual custodians alerts 30/7/1 days", distractors: ["Single person memory", "No docs", "Ignore expiry"], explanation: "Governance prevents enrollment outages." },
];

function expandDomainPool(questions: Question[], target: number): Question[] {
  if (questions.length === 0) return [];
  const pool: Question[] = [...questions];
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

function buildDomainPools(): Record<AeaExamDomain, Question[]> {
  resetQuestionPositionCounter();
  const byDomain = {} as Record<AeaExamDomain, Question[]>;
  for (const input of BASE) {
    const question = q(input);
    if (!byDomain[input.domain]) byDomain[input.domain] = [];
    byDomain[input.domain]!.push(question);
  }
  const result = {} as Record<AeaExamDomain, Question[]>;
  for (const [domain, count] of Object.entries(AEA_DOMAIN_COUNTS) as [AeaExamDomain, number][]) {
    result[domain] = expandDomainPool(byDomain[domain] ?? [], count);
  }
  return result;
}

export function buildAeaExamPool200(): Question[] {
  const pools = buildDomainPools();
  return (Object.keys(pools) as AeaExamDomain[]).flatMap((d) => pools[d]);
}

export const aeaExamPool200 = buildAeaExamPool200();

export function pickAeaExamQuestions(sessionSeed: string): Question[] {
  const pools = buildDomainPools();
  const picked: Question[] = [];
  for (const [domain, count] of Object.entries(AEA_DOMAIN_COUNTS) as [AeaExamDomain, number][]) {
    const shuffled = shuffleArray(pools[domain] ?? [], `${sessionSeed}-${domain}`);
    picked.push(...shuffled.slice(0, count));
  }
  return shuffleArray(picked, sessionSeed).map((question, i) =>
    enrichQuestionWithModule({
      ...question,
      id: `aea-exam-${sessionSeed.slice(0, 8)}-${i}-${question.id}`,
    })
  );
}
