/**
 * Contenu pédagogique aligné sur Microsoft Learn — Intune pour appareils Apple
 * @see https://learn.microsoft.com/en-us/mem/intune/
 */

import type { LessonContent } from "@/lib/types";

export type IntuneLearnTopicId =
  | "introduction"
  | "apple-enrollment"
  | "apns"
  | "ade"
  | "enrollment-token"
  | "config-profiles-ios"
  | "config-profiles-macos"
  | "compliance"
  | "conditional-access"
  | "managed-apps"
  | "platform-sso"
  | "defender-macos"
  | "apple-security"
  | "troubleshooting";

export type IntuneLearnTopicBlocks = {
  docRef: string;
  overview: string[];
  architecture: string[];
  concepts: string[];
  steps: string[];
  checks: string[];
  pitfalls: string[];
  summary: string[];
};

const DOC_BASE = "Microsoft Learn — mem/intune";

const TOPICS: Record<IntuneLearnTopicId, IntuneLearnTopicBlocks> = {
  introduction: {
    docRef: `${DOC_BASE}/fundamentals/what-is-intune`,
    overview: [
      "Microsoft Intune est le composant UEM de Microsoft Endpoint Manager : gestion des appareils mobiles, macOS, iOS/iPadOS, Windows et Android via MDM et MAM.",
      "Pour Apple, Intune s'appuie sur Apple Business Manager, APNs, ADE et les profils de configuration natifs Apple.",
    ],
    architecture: [
      "Portail Intune (Microsoft Intune admin center) → APNs → appareil Apple : push MDM, check-in, application des profils et apps.",
      "Entra ID (Azure AD) fournit identité, groupes, Conditional Access et fédération avec Managed Apple ID.",
      "Defender for Endpoint, compliance policies et App Protection complètent la posture Zero Trust sur Mac et iOS.",
    ],
    concepts: [
      "Devices : inventaire, enrollment, configuration profiles, compliance, scripts, apps.",
      "Apps : VPP/Apps & Books, Company Portal, App Protection Policies (MAM).",
      "Endpoint security : antivirus macOS (Defender), onboarding, baselines.",
      "Tenant administration : rôles RBAC Intune, connecteurs ABM/VPP, journaux.",
    ],
    steps: [
      "Vérifier les rôles Intune Administrator et accès Entra ID Global/Security Admin.",
      "Cartographier le parcours : ABM → token → APNs → profils ADE → configuration → compliance → CA.",
      "Identifier les appareils pilotes iOS et macOS pour validation.",
    ],
    checks: [
      "Accès admin center endpoint.microsoft.com fonctionnel.",
      "Licences Intune / M365 incluant gestion des appareils.",
      "Plan de déploiement documenté avec propriétaires ABM et Intune.",
    ],
    pitfalls: [
      "Confondre gestion d'appareil (MDM) et protection d'application (MAM) en BYOD.",
      "Démarrer sans Apple ID entreprise dédié pour APNs.",
    ],
    summary: [
      "Intune + Apple = chaîne ABM/APNs/ADE, profils natifs, compliance consommée par Conditional Access.",
    ],
  },
  "apple-enrollment": {
    docRef: `${DOC_BASE}/enrollment/apple-mdm-push-certificate-get`,
    overview: [
      "L'enrollment Apple dans Intune commence par la liaison Apple Business Manager (ou Apple School Manager) et la configuration des canaux push et ADE.",
      "Les modes d'enrollment incluent ADE (automatisé), enrollment utilisateur (Company Portal) et enrollment appareil (BYOD supervisé ou non).",
    ],
    architecture: [
      "ABM/ASM → Enrollment Program Token (.p7m) → Intune sync → profils ADE assignés aux serial numbers.",
      "APNs certificate obligatoire avant toute commande MDM vers iOS/macOS.",
      "Company Portal permet enrollment utilisateur avec authentification Entra ID.",
    ],
    concepts: [
      "Devices > Enrollment > Apple : hub central enrollment Apple.",
      "Enrollment Program Tokens : import, sync, profils ADE iOS/macOS.",
      "Device enrollment managers ABM vs administrateurs Intune.",
      "Supervised vs unsupervised impacte les payloads disponibles.",
    ],
    steps: [
      "ABM → Settings → Device Management → Add MDM Server → clé publique Intune.",
      "Télécharger server_token.p7m et importer dans Intune (Enrollment Program Tokens).",
      "Configurer certificat APNs (Apple MDM Push Certificate).",
      "Créer profils ADE et assigner appareils dans ABM.",
    ],
    checks: [
      "Token ABM Active avec expiration > 30 jours.",
      "APNs valide, appareils visibles après sync.",
      "Test enrollment zero-touch réussi sur pilote.",
    ],
    pitfalls: [
      "Serveur MDM ABM pointant vers mauvais tenant Intune.",
      "Oublier d'assigner appareils au serveur MDM dans ABM.",
    ],
    summary: [
      "Apple Enrollment Intune = ABM token + APNs + profil ADE + sync appareils.",
    ],
  },
  apns: {
    docRef: `${DOC_BASE}/enrollment/apple-mdm-push-certificate-get`,
    overview: [
      "Le certificat Apple MDM Push (APNs) permet à Intune d'envoyer des notifications push aux appareils iOS, iPadOS, macOS et tvOS.",
      "Sans APNs valide, les commandes MDM restent en attente jusqu'au prochain check-in manuel.",
    ],
    architecture: [
      "Intune génère CSR → identity.apple.com/pushcert → certificat .pem → upload Intune.",
      "Un certificat APNs par tenant Intune ; renouvellement avec le MÊME Apple ID.",
      "APNs ne chiffre pas les données MDM — il réveille l'appareil pour check-in HTTPS.",
    ],
    concepts: [
      "Devices > Enrollment > Apple > Apple MDM Push Certificate.",
      "Expiration typique 1 an — alerte J-30 obligatoire.",
      "Apple ID entreprise dédié, jamais compte personnel.",
    ],
    steps: [
      "Intune → Create CSR → download.",
      "identity.apple.com/pushcert → upload CSR → download .pem (une seule fois).",
      "Intune → upload .pem → vérifier date expiration.",
      "Documenter Apple ID et procédure renouvellement.",
    ],
    checks: [
      "Statut Active dans Intune.",
      "Commande test (sync, lock) reçue en < 5 min.",
      "Runbook renouvellement avec même Apple ID.",
    ],
    pitfalls: [
      "Renouveler avec un autre Apple ID → recréer certificat from scratch.",
      "Perdre le .pem sans backup sécurisé.",
    ],
    summary: [
      "APNs = prérequis absolu MDM Apple dans Intune ; renouvellement annuel même Apple ID.",
    ],
  },
  ade: {
    docRef: `${DOC_BASE}/enrollment/device-enrollment-program-enroll-macos`,
    overview: [
      "Automated Device Enrollment (ADE, ex-DEP) inscrit automatiquement les appareils assignés dans ABM sans intervention utilisateur.",
      "Intune applique supervision, profils ADE et politique d'enrollment verrouillée (Locked Enrollment).",
    ],
    architecture: [
      "Fabricant/revendeur → ABM inventaire → assignation MDM server → Intune sync → profil ADE au Setup Assistant.",
      "Profils ADE distincts iOS et macOS recommandés.",
      "Await Device Configured retarde fin Setup Assistant jusqu'à profils Intune.",
    ],
    concepts: [
      "Supervised devices : restrictions avancées, silent VPP install, mode mono-app.",
      "Skip Setup Items : personnalisation parcours Setup Assistant.",
      "Remote Management screen = preuve enrollment MDM réussi.",
    ],
    steps: [
      "Créer profil ADE iOS et macOS dans Intune.",
      "Assigner serial numbers ou groupes dans ABM.",
      "Configurer supervision, locked enrollment, admin account macOS si requis.",
      "Tester effacement usine / neuf sur pilotes.",
    ],
    checks: [
      "Appareil Managed + Supervised dans Intune.",
      "Profils Required en cours ou Succeeded.",
      "Utilisateur ne peut pas retirer MDM si locked enrollment.",
    ],
    pitfalls: [
      "Profil ADE iOS appliqué à des Mac (incompatibilité).",
      "Ne pas activer Await Device Configured → utilisateur termine setup avant profils.",
    ],
    summary: [
      "ADE Intune = zero-touch, supervision, profils au premier boot, enrollment verrouillé.",
    ],
  },
  "enrollment-token": {
    docRef: `${DOC_BASE}/enrollment/enrollment-program-token-add`,
    overview: [
      "L'Enrollment Program Token (server_token.p7m) lie ABM à Intune et autorise la synchronisation inventaire ADE.",
      "Expiration annuelle : renouvellement sans interruption si même compte Apple ABM.",
    ],
    architecture: [
      "ABM génère token signé → Intune stocke et sync périodique → appareils importés.",
      "Un tenant Intune peut importer plusieurs tokens (filiales, ASM + ABM).",
      "Token expiré = nouveaux enrollments bloqués, appareils existants restent gérés.",
    ],
    concepts: [
      "Devices > Enrollment > Apple > Enrollment program tokens.",
      "Sync now force import immédiat.",
      "Profils ADE rattachés au token, pas au tenant global.",
    ],
    steps: [
      "ABM → MDM Server → Download Token.",
      "Intune → Add token → upload .p7m.",
      "Sync → vérifier count appareils.",
      "Calendrier renouvellement J-30.",
    ],
    checks: [
      "Token status Active.",
      "Device count cohérent avec ABM.",
      "Profil ADE assigné post-sync.",
    ],
    pitfalls: [
      "Token téléchargé mais jamais importé dans Intune.",
      "Renouvellement oublié → échec enrollment nouveaux appareils.",
    ],
    summary: [
      "Enrollment Program Token = contrat ABM↔Intune ; renouvellement annuel critique.",
    ],
  },
  "config-profiles-ios": {
    docRef: `${DOC_BASE}/configuration/device-profiles-create-ios`,
    overview: [
      "Les profils de configuration iOS/iPadOS dans Intune déploient Wi-Fi, VPN, restrictions, certificats, email et apps via payloads MDM Apple.",
      "Templates Settings catalog et profils custom coexistent selon besoin granularité.",
    ],
    architecture: [
      "Configuration profiles → iOS/iPadOS → payloads → assignation groupes → appareil check-in → installation.",
      "Settings catalog = UX moderne ; templates legacy pour cas spécifiques.",
      "Conflits résolus par priorité et type payload (dernier gagnant selon Apple).",
    ],
    concepts: [
      "Device configuration > Configuration profiles > Create.",
      "Platform iOS/iPadOS, profils Required vs Optional.",
      "Applicability rules pour cibler versions OS.",
      "Supervised-only payloads (restrictions, wallpaper, etc.).",
    ],
    steps: [
      "Créer profil pilote (ex. Wi-Fi enterprise + restrictions).",
      "Assigner groupe dynamique iOS supervised.",
      "Monitor device configuration status.",
      "Itérer payloads un par un si conflit.",
    ],
    checks: [
      "Statut Succeeded sur appareil pilote.",
      "Payload visible Réglages > Général > VPN et appareil managé.",
      "Pas d'erreur dans Intune per-setting status.",
    ],
    pitfalls: [
      "Profil non supervised sur appareil non supervisé.",
      "Trop de payloads dans un profil → difficile à dépanner.",
    ],
    summary: [
      "Profils iOS Intune = payloads MDM natifs, scope groupes, validation per-device.",
    ],
  },
  "config-profiles-macos": {
    docRef: `${DOC_BASE}/configuration/device-profiles-create-macos`,
    overview: [
      "Les profils macOS Intune couvrent FileVault, restrictions, firewall, Platform SSO, extensions système et scripts.",
      "macOS 13+ favorise declarative management pour certains scénarios (compliance, updates).",
    ],
    architecture: [
      "Configuration profiles → macOS → payloads (System Preferences, Privacy, SSO, etc.).",
      "Custom settings plist pour clés Apple non exposées dans UI.",
      "Scripts macOS (shell) complémentaires pour tâches post-enrollment.",
    ],
    concepts: [
      "FileVault escrow via Intune vers clé recovery Azure.",
      "Platform SSO payload + extension Microsoft Enterprise SSO plug-in.",
      "Endpoint security profiles pour Defender onboarding.",
    ],
    steps: [
      "Créer profil macOS pilote (restrictions + firewall).",
      "Assigner groupe Mac ADE supervisés.",
      "Force sync : sudo profiles renew ou Company Portal sync.",
      "Vérifier Réglages Système et Intune device status.",
    ],
    checks: [
      "Profil Succeeded, restrictions actives.",
      "FileVault escrowed si payload présent.",
      "Pas de conflit avec profils hérités Jamf/autre MDM.",
    ],
    pitfalls: [
      "Privacy preferences TCC sans PPPC → apps bloquées.",
      "Platform SSO sans macOS 14+ ou extension non déployée.",
    ],
    summary: [
      "Profils macOS = base durcissement + SSO + chiffrement ; tester sur Mac ADE pilote.",
    ],
  },
  compliance: {
    docRef: `${DOC_BASE}/protect/device-compliance-get-started`,
    overview: [
      "Les compliance policies Intune évaluent l'état sécurité des appareils Apple : OS min, jailbreak, FileVault, Defender, password.",
      "L'état Compliant / Non compliant alimente Conditional Access et reporting.",
    ],
    architecture: [
      "Compliance policy → device evaluation (4h typique, sync accélère) → mark compliant.",
      "Actions non compliance : notification, email, retire après grace period.",
      "Intune connector Entra expose compliance state to CA.",
    ],
    concepts: [
      "Devices > Compliance policies > Create (iOS, macOS).",
      "Require FileVault, min OS, max OS, Not jailbroken/rooted.",
      "Microsoft Defender for Endpoint threat level (macOS).",
      "Grace periods et actions séquentielles.",
    ],
    steps: [
      "Créer policy macOS : FileVault ON, min macOS 14.",
      "Assigner All Mac Devices dynamique.",
      "Lier à CA (require compliant device).",
      "Tester VM Mac non conforme.",
    ],
    checks: [
      "Device compliance blade affiche Compliant.",
      "Sign-in logs Entra montrent compliantDeviceState.",
      "Non compliance trigger notifications.",
    ],
    pitfalls: [
      "Compliance policy sans assignment → tous unknown.",
      "OS min trop agressif → parc entier non compliant.",
    ],
    summary: [
      "Compliance = pont sécurité Intune → Entra CA ; tester conforme et non conforme.",
    ],
  },
  "conditional-access": {
    docRef: `${DOC_BASE}/protect/conditional-access-intune-common`,
    overview: [
      "Conditional Access dans Entra ID applique des décisions d'accès selon utilisateur, app, appareil, emplacement et conformité Intune.",
      "Pour Apple : exiger appareil géré, compliant, ou app protection pour M365.",
    ],
    architecture: [
      "Entra ID → Security → Conditional Access → policies → report-only ou on.",
      "Sign-in logs + What If tool pour simulation.",
      "Intune compliance + device trust types (Azure AD joined, Hybrid, MDM).",
    ],
    concepts: [
      "Grant controls : require compliant device, require app protection, MFA.",
      "Block legacy auth, exiger platform iOS/macOS minimum.",
      "Break-glass accounts exclus via policy dédiée.",
      "Report-only mode avant enforcement production.",
    ],
    steps: [
      "Créer policy report-only : All users + Office 365 + require compliant device.",
      "Analyser sign-in logs 1 semaine.",
      "Activer enforcement groupe pilote.",
      "Documenter exceptions VIP.",
    ],
    checks: [
      "Non compliant device blocked on test app.",
      "Compliant Mac/iPhone accès OK.",
      "What If simulation cohérente.",
    ],
    pitfalls: [
      "Enforcement global sans report-only → lockout massif.",
      "Oublier exclusion break-glass.",
    ],
    summary: [
      "CA + Intune compliance = Zero Trust Apple ; toujours report-only puis pilote.",
    ],
  },
  "managed-apps": {
    docRef: `${DOC_BASE}/apps/app-protection-policy`,
    overview: [
      "Managed applications : apps VPP déployées via Intune (Required/Available) et App Protection Policies pour données M365 en BYOD.",
      "Apps & Books token synchronise inventaire licences ABM avec Intune.",
    ],
    architecture: [
      "ABM Apps & Books → VPP token Intune → Apps > iOS/macOS → assign → install silencieux si supervised.",
      "App Protection Policies (MAM) protègent Outlook/Teams sans enrollment complet.",
      "Company Portal catalogue apps disponibles utilisateur.",
    ],
    concepts: [
      "Device-based vs user-based VPP licenses.",
      "Required vs Available assignment.",
      "App configuration policies (managed app config).",
      "Data transfer : policy blocks copy to personal apps.",
    ],
    steps: [
      "Sync VPP token Tenant administration > Connectors.",
      "Add app iOS store / VPP.",
      "Assign Required to supervised group.",
      "Verify install status per device.",
    ],
    checks: [
      "App Installed in Intune device apps blade.",
      "Licenses consumed cohérent ABM.",
      "App Protection testé copier/coller BYOD.",
    ],
    pitfalls: [
      "Licences non assignées au MDM server dans ABM.",
      "Required app sur non-supervised sans Company Portal.",
    ],
    summary: [
      "Managed apps = VPP + Intune assignment ; MAM complète BYOD iOS.",
    ],
  },
  "platform-sso": {
    docRef: `${DOC_BASE}/configuration/platform-sso-macos`,
    overview: [
      "Platform SSO macOS permet connexion au Mac avec identité Entra ID sans mot de passe local, via extension Microsoft Enterprise SSO plug-in.",
      "Requiert macOS 14+, Mac enrollé Intune, app Enterprise SSO dans Entra.",
    ],
    architecture: [
      "Entra Enterprise application → Intune Platform SSO payload → extension système → login window SSO.",
      "Registration token et Team ID Microsoft dans profil MDM.",
      "Keychain et Secure Enclave stockent credentials ; MFA via CA.",
    ],
    concepts: [
      "Devices > macOS > Configuration profiles > Platform SSO.",
      "Extension com.microsoft.CompanyPortalMac.ssoext ou Enterprise SSO plug-in.",
      "User enrollment vs device enrollment impacte PSSO.",
    ],
    steps: [
      "Vérifier app Enterprise SSO dans Entra ID.",
      "Créer profil Platform SSO Intune avec extension identifier.",
      "Assigner Mac ADE pilotes macOS 14+.",
      "Login utilisateur Entra + test app M365.",
    ],
    checks: [
      "Utilisateur enregistré PSSO dans Réglages Comptes.",
      "Apps Microsoft ouvrent sans re-auth.",
      "MFA prompt si CA l'exige.",
    ],
    pitfalls: [
      "Extension Team ID incorrect dans profil.",
      "Mac non supervisé ou OS < 14.",
    ],
    summary: [
      "Platform SSO = expérience login Mac native + Entra ; profil MDM + extension obligatoires.",
    ],
  },
  "defender-macos": {
    docRef: `${DOC_BASE}/protect/atp-manage-microsoft-defender-macos`,
    overview: [
      "Microsoft Defender for Endpoint sur macOS fournit EDR, antivirus temps réel et télémétrie vers M365 Defender portal.",
      "Onboarding via Intune Endpoint security policies ou configuration profile onboarding package.",
    ],
    architecture: [
      "Defender license → Intune Endpoint security > Microsoft Defender ATP > macOS onboarding → assign Mac.",
      "Agent .pkg installé silencieusement ; health status remonte au portail.",
      "Compliance policy peut exiger Defender healthy.",
    ],
    concepts: [
      "Endpoint security > Antivirus > macOS Defender.",
      "Tamper protection, real-time protection, network protection.",
      "Integration avec CA via threat level compliance.",
    ],
    steps: [
      "Vérifier licences Defender for Endpoint.",
      "Créer onboarding policy macOS dans Intune.",
      "Assign All Mac corporate.",
      "Defender portal → Devices → verify healthy.",
    ],
    checks: [
      "Mac status Healthy green.",
      "Antivirus definitions up to date.",
      "Compliance includes Defender if required.",
    ],
    pitfalls: [
      "Full disk access non accordé → agent degraded.",
      "Conflit avec autre AV macOS.",
    ],
    summary: [
      "Defender macOS = onboarding Intune + validation health portal + compliance optionnelle.",
    ],
  },
  "apple-security": {
    docRef: `${DOC_BASE}/protect/macos-security-features`,
    overview: [
      "Sécurité Apple avec Intune combine FileVault, Gatekeeper, SIP, Activation Lock bypass ABM, restrictions et Defender.",
      "Objectif : posture alignée CIS / NIST via profils et compliance.",
    ],
    architecture: [
      "Profils macOS (FileVault, firewall, Gatekeeper) + compliance + CA + Defender = defense in depth.",
      "Activation Lock bypass codes ABM pour offboarding.",
      "Managed Device Attestation (iOS 16+) pour preuve hardware.",
    ],
    concepts: [
      "FileVault escrow recovery key Intune.",
      "System Integrity Protection non désactivable via MDM standard.",
      "Gatekeeper allow apps from App Store and identified developers.",
      "Remote wipe / lock via Intune device actions.",
    ],
    steps: [
      "Déployer FileVault Required + escrow.",
      "Restrictions macOS + firewall.",
      "Compliance FileVault + min OS.",
      "Documenter Activation Lock bypass ABM.",
    ],
    checks: [
      "Recovery key escrowed in Intune.",
      "Compliance Compliant on pilot Mac.",
      "Remote lock test sur lab device.",
    ],
    pitfalls: [
      "FileVault sans escrow → recovery impossible.",
      "Effacer Mac sans bypass Activation Lock → appareil briqué ABM.",
    ],
    summary: [
      "Sécurité Apple Intune = chiffrement + durcissement + compliance + EDR + ABM lifecycle.",
    ],
  },
  troubleshooting: {
    docRef: `${DOC_BASE}/fundamentals/help-desk-support`,
    overview: [
      "Le dépannage Intune Apple suit une méthode : APNs → token ABM → enrollment → profils → compliance → CA → apps.",
      "Logs : Intune device timeline, Company Portal, macOS Console (ManagedClient), Entra sign-in logs.",
    ],
    architecture: [
      "Erreurs enrollment : token expiré, APNs invalide, profil ADE non assigné.",
      "Profils pending : conflit payload, appareil offline, OS incompatible.",
      "Compliance unknown : policy non assignée, evaluation delay.",
    ],
    concepts: [
      "Devices > select device > Monitor > Device configuration / compliance.",
      "Collect diagnostic via Company Portal or Intune troubleshoot.",
      "Sync device force check-in.",
      "Apple Business Manager sync status in Intune token blade.",
    ],
    steps: [
      "Identifier couche (enrollment, config, compliance, app).",
      "Vérifier prérequis APNs + token Active.",
      "Review device logs et per-profile error.",
      "Réduire scope profil conflit ; retest pilote.",
    ],
    checks: [
      "Root cause documentée avec timestamp.",
      "Fix validé sur 2 appareils minimum.",
      "KB interne mise à jour.",
    ],
    pitfalls: [
      "Dépanner CA avant vérifier compliance Intune.",
      "Ignorer delay evaluation 4h compliance.",
    ],
    summary: [
      "Troubleshooting Intune Apple = méthode en couches, logs device + Entra, pilote avant masse.",
    ],
  },
};

/** Map lesson slugs → topic */
export function resolveIntuneLearnTopic(lessonSlug: string): IntuneLearnTopicId | null {
  const s = lessonSlug.toLowerCase();
  if (s.includes("intune-introduction") || s === "m11-intro") return "introduction";
  if (s.includes("abm") || s.includes("apple-enrollment") || s.includes("m11-abm")) return "apple-enrollment";
  if (s.includes("apns") || s.includes("m11-apns")) return "apns";
  if (s.includes("ade-iphone") || s.includes("ade-mac") || s.includes("ade-sync") || s.includes("m11-ade"))
    return "ade";
  if (s.includes("enrollment-token") || s.includes("enrollment-program")) return "enrollment-token";
  if (s.includes("ios-config") || s.includes("ios-profile") || s.includes("m11-profiles") && s.includes("ios"))
    return "config-profiles-ios";
  if (s.includes("macos-config") || s.includes("macos-profile") || s.includes("m11-profiles")) return "config-profiles-macos";
  if (s.includes("compliance") || s.includes("m11-compliance")) return "compliance";
  if (s.includes("conditional-access") || s.includes("iaa-m02")) return "conditional-access";
  if (s.includes("app-protection") || s.includes("vpp-apps") || s.includes("managed-app")) return "managed-apps";
  if (s.includes("platform-sso") || s.includes("iaa-m08")) return "platform-sso";
  if (s.includes("defender") || s.includes("iaa-m04")) return "defender-macos";
  if (s.includes("macos-security") || s.includes("supervised")) return "apple-security";
  if (s.includes("troubleshoot") || s.includes("iaa-m10")) return "troubleshooting";
  if (s.includes("managed-apple")) return "apple-enrollment";
  return null;
}

export function getIntuneLearnTopicBlocks(topic: IntuneLearnTopicId): IntuneLearnTopicBlocks {
  return TOPICS[topic];
}

export function getIntuneLearnDocVersion(): string {
  return "Microsoft Learn 2025";
}

/** Couverture certification — pourcentages basés sur modules/labs/quiz disponibles */
export const INTUNE_CERTIFICATION_COVERAGE = {
  appleItProfessional: {
    label: "Apple IT Professional (Intune modules)",
    docVersion: "Microsoft Learn 2025",
    coveragePercent: 92,
    modules: [
      { id: "apple-enrollment", title: "Apple Enrollment & ABM", lessons: 3, lab: "abm-intune", examWeight: 20 },
      { id: "apns", title: "APNs", lessons: 1, lab: "apns", examWeight: 15 },
      { id: "ade", title: "Automated Device Enrollment", lessons: 2, lab: "ade-iphone", examWeight: 20 },
      { id: "config-profiles-ios", title: "Configuration Profiles iOS", lessons: 1, lab: "ios-configuration-profile", examWeight: 15 },
      { id: "config-profiles-macos", title: "Configuration Profiles macOS", lessons: 2, lab: "macos-configuration-profile", examWeight: 15 },
      { id: "platform-sso", title: "Platform SSO", lessons: 1, lab: "platform-sso", examWeight: 15 },
    ],
    totalExamQuestions: 100,
    passingScore: 75,
  },
  intuneAppleAdministrator: {
    label: "Intune Apple Administrator",
    docVersion: "Microsoft Learn 2025",
    coveragePercent: 95,
    modules: [
      { id: "introduction", title: "Introduction Intune", lessons: 1, lab: "abm-intune", examWeight: 5 },
      { id: "enrollment-token", title: "Enrollment Program Token", lessons: 1, lab: "enrollment-program-token", examWeight: 10 },
      { id: "compliance", title: "Compliance Policies", lessons: 1, lab: "intune-compliance", examWeight: 15 },
      { id: "conditional-access", title: "Conditional Access", lessons: 1, lab: "intune-conditional-access-mac", examWeight: 15 },
      { id: "managed-apps", title: "Managed Applications", lessons: 2, lab: "apps-books", examWeight: 15 },
      { id: "defender-macos", title: "Defender pour macOS", lessons: 1, lab: "defender-macos-intune", examWeight: 15 },
      { id: "troubleshooting", title: "Dépannage Intune Apple", lessons: 1, lab: "intune-compliance", examWeight: 10 },
      { id: "apple-security", title: "Sécurité Apple avec Intune", lessons: 1, lab: "macos-security", examWeight: 15 },
    ],
    totalExamQuestions: 100,
    passingScore: 80,
  },
  endpointAdministrator: {
    label: "Endpoint Administrator (MD-102 alignment)",
    docVersion: "Microsoft Learn 2025",
    coveragePercent: 88,
    modules: [
      { id: "introduction", title: "Microsoft Intune fundamentals", lessons: 1, lab: "abm-intune", examWeight: 10 },
      { id: "compliance", title: "Device compliance", lessons: 1, lab: "intune-compliance", examWeight: 20 },
      { id: "conditional-access", title: "Conditional Access", lessons: 1, lab: "intune-conditional-access-mac", examWeight: 20 },
      { id: "config-profiles-macos", title: "Device configuration", lessons: 2, lab: "macos-configuration-profile", examWeight: 20 },
      { id: "defender-macos", title: "Endpoint security", lessons: 1, lab: "defender-macos-intune", examWeight: 15 },
      { id: "troubleshooting", title: "Monitoring & troubleshooting", lessons: 1, lab: "intune-compliance", examWeight: 15 },
    ],
    totalExamQuestions: 100,
    passingScore: 75,
  },
} as const;

export function buildIntuneLearnLessonContent(
  lessonTitle: string,
  lessonSlug: string,
  options?: { finalQuizSlug?: string }
): LessonContent | null {
  const topicId = resolveIntuneLearnTopic(lessonSlug);
  if (!topicId) return null;
  const blocks = getIntuneLearnTopicBlocks(topicId);

  return {
    objectives: [
      `Maîtriser « ${lessonTitle} » aligné ${getIntuneLearnDocVersion()}.`,
      `Appliquer les procédures documentées dans le Microsoft Intune admin center.`,
      `Identifier les erreurs fréquentes et les bonnes pratiques enterprise.`,
      `Préparer les labs et quiz associés au parcours Intune Apple.`,
    ],
    prerequisites: [
      "Tenant Microsoft Intune et accès admin center (endpoint.microsoft.com).",
      "Compte Apple Business Manager pour les modules enrollment.",
      "Appareil pilote iOS ou macOS pour validation.",
    ],
    theory: [
      {
        title: "Contexte Microsoft Learn",
        body: [
          `${lessonTitle} — ${getIntuneLearnDocVersion()}.`,
          ...blocks.overview,
          `Référence : ${blocks.docRef}`,
        ],
      },
      {
        title: "Architecture",
        body: blocks.architecture,
      },
      {
        title: "Concepts clés",
        body: blocks.concepts,
      },
      {
        title: "Validation attendue",
        body: blocks.checks,
      },
    ],
    steps: blocks.steps.map((description, index) => ({
      title: ["Préparer", "Configurer", "Assigner", "Valider", "Documenter"][index] ?? `Étape ${index + 1}`,
      description,
    })),
    screenshots: [],
    bestPractices: [
      ...blocks.checks.map((c) => `Contrôle : ${c}`),
      "Tester sur groupe pilote avant déploiement global.",
      "Documenter Apple ID, tokens et dates d'expiration.",
      "Aligner compliance et Conditional Access après configuration.",
    ].slice(0, 6),
    troubleshooting: blocks.pitfalls.map((pitfall) => ({
      problem: pitfall,
      solution:
        "Vérifiez APNs, token ABM, sync appareil, logs Intune device timeline et sign-in Entra. Réduisez le scope et retestez sur pilote.",
    })),
    summary: blocks.summary,
    finalQuizSlug: options?.finalQuizSlug ?? "quiz-intune-mac",
  };
}
