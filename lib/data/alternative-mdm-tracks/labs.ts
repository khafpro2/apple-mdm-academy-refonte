import type { Lab, LabLevel, LabTechnology } from "@/lib/types";
import { generateModuleLabs } from "@/lib/data/alternative-mdm-tracks/lab-factory";

function altLab(
  slug: string,
  title: string,
  description: string,
  level: LabLevel,
  duration: string,
  technology: LabTechnology,
  trackSlug: string,
  scenario: string,
  objectives: string[],
  prerequisites: string[],
  steps: Lab["steps"],
  expectedResult: string
): Lab {
  return {
    slug,
    title,
    description: `${description} Scénario : ${scenario}`,
    level,
    duration,
    technology,
    trackSlug,
    objectives,
    prerequisites,
    steps,
    expectedResult,
    objective: objectives[0] ?? description,
  };
}

const checklistStep = (id: string, title: string, items: string[]) => ({
  id,
  title,
  instruction: `Checklist validation :\n${items.map((i) => `• ${i}`).join("\n")}`,
  expectedResult: "Tous les points cochés et documentés.",
});

/** 9 labs nommés Phase 14 */
const handCraftedAltMdmLabs: Lab[] = [
  altLab(
    "kandji-blueprint",
    "Lab — Blueprint Kandji",
    "Créez un Blueprint Kandji complet pour Mac développeurs.",
    "Intermédiaire",
    "60 min",
    "Kandji",
    "kandji-fundamentals",
    "Startup 200 Mac dev — Blueprint avec apps, compliance FileVault et Passport.",
    ["Créer Blueprint", "Ajouter Library Items", "Configurer compliance", "Assigner ADE devices"],
    ["Console Kandji admin", "Mac test ADE", "Token ABM lié"],
    [
      { id: "blueprint", title: "Créer Blueprint", instruction: "Devices → Blueprints → New. Nom : LAB-Dev-Mac.", expectedResult: "Blueprint créé vide." },
      { id: "library", title: "Library Items", instruction: "Ajoutez profil Wi-Fi, restrictions et Auto App Slack.", expectedResult: "3 Library Items attachés." },
      { id: "compliance", title: "Compliance", instruction: "Exigez FileVault ON et OS ≥ 14.", expectedResult: "Règle compliance active." },
      checklistStep("validate", "Validation", ["Mac test enrolled", "Compliance verte", "Documentation screenshot"]),
    ],
    "Blueprint opérationnel, Mac test conforme, checklist validée."
  ),
  altLab(
    "kandji-liftoff",
    "Lab — Liftoff Kandji",
    "Configurez Liftoff pour onboarding zero-touch Mac.",
    "Intermédiaire",
    "45 min",
    "Kandji",
    "kandji-fundamentals",
    "Nouveaux Mac livrés — expérience Liftoff personnalisée sans ticket IT.",
    ["Configurer Liftoff", "Personnaliser écran accueil", "Lier Passport", "Tester enrollment"],
    ["Blueprint existant", "Mac ADE non enrollé"],
    [
      { id: "liftoff", title: "Configurer Liftoff", instruction: "Blueprint → Liftoff → Enable. Message bienvenue + apps essentielles.", expectedResult: "Liftoff activé." },
      { id: "passport", title: "Passport", instruction: "Configurez Passport SSO ou compte local selon IdP.", expectedResult: "Identité configurée." },
      { id: "test", title: "Test enrollment", instruction: "Enroll Mac test via ADE. Suivez parcours Liftoff.", expectedResult: "Utilisateur arrive sur Mac configuré." },
      checklistStep("validate", "Checklist", ["Liftoff UX validée", "Apps installées", "Passport OK"]),
    ],
    "Liftoff testé, onboarding zero-touch documenté."
  ),
  altLab(
    "mosyle-enrollment",
    "Lab — Enrollment Mosyle",
    "Configurez enrollment ABM/ADE dans Mosyle.",
    "Intermédiaire",
    "50 min",
    "Mosyle",
    "mosyle-fundamentals",
    "École 300 iPad — enrollment ADE automatisé via Mosyle.",
    ["Lier token ABM", "Configurer ADE profile", "Assigner devices", "Valider enrollment"],
    ["Compte Mosyle admin", "Token ABM Mosyle", "iPad test ADE"],
    [
      { id: "abm", title: "Token ABM", instruction: "Management → Apple → Upload token ABM MDM.", expectedResult: "Token actif, devices visibles." },
      { id: "ade", title: "ADE Profile", instruction: "Créez profil ADE iPad avec Wi-Fi et supervision.", expectedResult: "Profil ADE assigné ABM." },
      { id: "enroll", title: "Enrollment test", instruction: "Activez iPad test. Vérifiez supervision et check-in Mosyle.", expectedResult: "iPad supervisé dans console." },
      checklistStep("validate", "Validation", ["Supervision OK", "Check-in < 5 min", "Profil appliqué"]),
    ],
    "ADE Mosyle opérationnel, iPad test supervisé."
  ),
  altLab(
    "mosyle-auth",
    "Lab — Mosyle Auth",
    "Déployez Mosyle Auth pour SSO Mac.",
    "Avancé",
    "55 min",
    "Mosyle",
    "mosyle-fundamentals",
    "Entreprise Entra ID — login Mac unifié via Mosyle Auth.",
    ["Configurer IdP", "Déployer Mosyle Auth", "Tester login Mac", "Valider SSO"],
    ["Entra ID admin", "Mac test enrollé Mosyle", "Mosyle Auth license"],
    [
      { id: "idp", title: "Configurer IdP", instruction: "Liez Entra ID dans Mosyle Auth settings.", expectedResult: "IdP connecté." },
      { id: "deploy", title: "Déployer agent", instruction: "Scope Mosyle Auth au Mac test via profile.", expectedResult: "Agent installé." },
      { id: "login", title: "Test login", instruction: "Logout/login Mac. Vérifiez SSO Entra ID.", expectedResult: "Login SSO réussi." },
      checklistStep("validate", "Checklist", ["SSO OK", "MFA respectée", "Logs auth archivés"]),
    ],
    "Mosyle Auth déployé, SSO Mac validé."
  ),
  altLab(
    "addigy-policy",
    "Lab — Policy Addigy",
    "Créez et déployez une policy Addigy multi-actions.",
    "Intermédiaire",
    "50 min",
    "Addigy",
    "addigy-fundamentals",
    "MSP client — policy FileVault + app requise + script audit.",
    ["Créer policy", "Ajouter conditions", "Scope devices", "Valider remediation"],
    ["Console Addigy", "Mac client test"],
    [
      { id: "policy", title: "Créer policy", instruction: "Policies → New. Nom LAB-Compliance-Mac.", expectedResult: "Policy créée." },
      { id: "actions", title: "Actions", instruction: "Exigez FileVault, installez app requise, script audit.", expectedResult: "3 actions configurées." },
      { id: "scope", title: "Scope", instruction: "Assignez au groupe client test.", expectedResult: "Devices ciblés." },
      checklistStep("validate", "Validation", ["Compliance OK", "Script exécuté", "Remediation documentée"]),
    ],
    "Policy Addigy active, devices conformes."
  ),
  altLab(
    "addigy-golive",
    "Lab — GoLive Addigy",
    "Configurez workflow GoLive post-enrollment.",
    "Intermédiaire",
    "45 min",
    "Addigy",
    "addigy-fundamentals",
    "Nouveau Mac client MSP — GoLive automatise apps + config initiale.",
    ["Créer GoLive", "Séquencer actions", "Lier enrollment", "Tester workflow"],
    ["Policy Addigy base", "Mac ADE test"],
    [
      { id: "golive", title: "Créer GoLive", instruction: "GoLive → New workflow LAB-Onboard.", expectedResult: "Workflow créé." },
      { id: "sequence", title: "Séquencer", instruction: "Apps → Config → Compliance check → Notification user.", expectedResult: "4 étapes ordonnées." },
      { id: "test", title: "Test", instruction: "Enroll Mac ADE. Observez GoLive execution.", expectedResult: "Workflow complet sans erreur." },
      checklistStep("validate", "Checklist", ["GoLive 100%", "User notifié", "Runbook MSP"]),
    ],
    "GoLive opérationnel, onboarding automatisé."
  ),
  altLab(
    "workspace-one-apple-enrollment",
    "Lab — Apple Enrollment Workspace ONE",
    "Configurez enrollment Apple dans WS1 UEM.",
    "Intermédiaire",
    "60 min",
    "Workspace ONE",
    "workspace-one-apple",
    "Enterprise VMware — Mac/iOS enrollment ABM via Workspace ONE.",
    ["Configurer APNs", "Token ABM", "Enrollment profiles", "Assign devices"],
    ["WS1 UEM admin", "Certificat APNs", "Token ABM"],
    [
      { id: "apns", title: "APNs", instruction: "Settings → Apple → Upload certificat APNs.", expectedResult: "APNs actif." },
      { id: "abm", title: "ABM Token", instruction: "Upload token MDM ABM. Sync devices.", expectedResult: "Devices ABM visibles." },
      { id: "profile", title: "Enrollment profile", instruction: "Créez profils macOS et iOS ADE.", expectedResult: "Profils assignés ABM." },
      checklistStep("validate", "Validation", ["Mac/iOS enrollés", "Supervision OK", "Group assignment"]),
    ],
    "Enrollment Apple WS1 configuré, devices supervisés."
  ),
  altLab(
    "workspace-one-compliance",
    "Lab — Compliance Workspace ONE",
    "Créez compliance policies Apple dans WS1.",
    "Intermédiaire",
    "50 min",
    "Workspace ONE",
    "workspace-one-apple",
    "Compliance macOS — OS, FileVault, Defender requis pour accès apps.",
    ["Créer compliance policy", "Critères macOS", "Lier Conditional Access", "Tester non-conformité"],
    ["Devices enrollés WS1", "Entra ID pour CA"],
    [
      { id: "compliance", title: "Compliance policy", instruction: "Devices → Compliance → macOS : OS ≥ 14, FileVault ON.", expectedResult: "Policy créée." },
      { id: "assign", title: "Assignment", instruction: "Scope à Smart Group Mac production.", expectedResult: "Devices évalués." },
      { id: "ca", title: "Conditional Access", instruction: "Liez compliance à règle CA Entra (optionnel demo).", expectedResult: "CA configurée." },
      checklistStep("validate", "Checklist", ["Conforme/non-conforme testés", "Remediation plan", "Logs archivés"]),
    ],
    "Compliance WS1 active, tests conformité validés."
  ),
  altLab(
    "mdm-comparison",
    "Lab — Matrice comparatif MDM",
    "Élaborez une matrice de décision MDM pour votre organisation.",
    "Intermédiaire",
    "90 min",
    "Sécurité macOS",
    "mdm-comparatif-apple",
    "DSI doit choisir entre Jamf, Intune, Kandji, Mosyle, Addigy et WS1 pour 800 Mac.",
    ["Collecter exigences", "Scorer solutions", "Estimer coûts", "Recommandation finale"],
    ["Parcours comparatif complété", "Accès stakeholders IT"],
    [
      { id: "requirements", title: "Exigences", instruction: "Listez : budget, stack existant, Apple-only vs multi-OS, MSP, API needs.", expectedResult: "Grille exigences pondérée." },
      { id: "matrix", title: "Matrice", instruction: "Scorez Jamf, Intune, Kandji, Mosyle, Addigy, WS1 sur 10 critères.", expectedResult: "Tableau comparatif complet." },
      { id: "cost", title: "Coûts placeholder", instruction: "Estimez €/device/mois × 800 devices × 3 ans (placeholder).", expectedResult: "TCO indicatif documenté." },
      { id: "recommend", title: "Recommandation", instruction: "Rédigez recommandation avec POC 30 jours proposé.", expectedResult: "Document décision DSI." },
      checklistStep("validate", "Validation", ["Matrice signée", "POC planifié", "Risques identifiés"]),
    ],
    "Matrice décision MDM livrée, recommandation documentée."
  ),
];

/** 40 labs — 9 nommés + 31 auto-générés par module */
export const altMdmLabs: Lab[] = [...handCraftedAltMdmLabs, ...generateModuleLabs()];
