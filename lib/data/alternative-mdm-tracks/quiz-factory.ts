import type { Question, Quiz } from "@/lib/types";
import type { AltMdmModuleDef } from "@/lib/data/alternative-mdm-tracks/module-definitions";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

const TRACK_HINTS: Record<string, string> = {
  "kandji-fundamentals": "Kandji",
  "mosyle-fundamentals": "Mosyle",
  "addigy-fundamentals": "Addigy",
  "workspace-one-apple": "Workspace ONE UEM",
  "mdm-comparatif-apple": "comparatif MDM Apple",
};

function questionsForModule(mod: AltMdmModuleDef): Question[] {
  const vendor = TRACK_HINTS[mod.trackSlug] ?? "MDM Apple";
  const bases: Question[] = [
    q(`${mod.slug}-01`, `Quel est l'objectif principal du module « ${mod.title} » (${vendor}) ?`, [
      "Désactiver la supervision",
      `Maîtriser ${mod.title} en contexte entreprise Apple`,
      "Supprimer ABM",
      "Ignorer la compliance",
    ], 1, `${mod.title} vise une mise en production fiable avec ${vendor}.`),
    q(`${mod.slug}-02`, `Avant déploiement « ${mod.title} », quelle pratique est recommandée ?`, [
      "Production directe sans test",
      "Pilot group et validation checklist",
      "Partager tokens admin",
      "Désactiver les logs",
    ], 1, "Toujours valider en pilot avant déploiement à grande échelle."),
    q(`${mod.slug}-03`, `Quel indicateur mesure la réussite de « ${mod.title} » ?`, [
      "Couleur wallpaper",
      "Conformité device, check-in MDM et objectif métier atteint",
      "Nombre d'emails",
      "Taille disque uniquement",
    ], 1, "KPIs : conformité, inventaire à jour, objectifs métier."),
    q(`${mod.slug}-04`, `En cas d'échec sur « ${mod.title} », action prioritaire :`, [
      "Wipe massif",
      "Analyser logs MDM, scope et prérequis",
      "Révoquer APNs global",
      "Supprimer ABM",
    ], 1, "Diagnostic : scope, logs, prérequis, check-in."),
    q(`${mod.slug}-05`, `« ${mod.title} » s'intègre typiquement avec :`, [
      "Aucun système",
      "ABM, IdP (Entra/Okta) et SIEM",
      "FTP anonyme",
      "Excel uniquement",
    ], 1, "L'écosystème Apple entreprise est interconnecté."),
    q(`${mod.slug}-06`, `Documentation essentielle pour « ${mod.title} » :`, [
      "Aucune",
      "Runbook, checklist validation et rollback plan",
      "Posts réseaux sociaux",
      "Captures non datées",
    ], 1, "Runbooks garantissent reproductibilité et audit."),
    q(`${mod.slug}-07`, `Sécurité dans « ${mod.title} » :`, [
      "Tokens en clair",
      "Moindre privilège et rotation secrets",
      "Mot de passe admin global",
      "Désactiver chiffrement",
    ], 1, "Moindre privilège, vault secrets, rotation certificats."),
    q(`${mod.slug}-08`, `Rôle IT responsable de « ${mod.title} » :`, [
      "Marketing",
      "Administrateur MDM / Ingénieur endpoint Apple",
      "Comptabilité",
      "Design",
    ], 1, "Administrateurs MDM et Apple platform engineers."),
  ];

  const trackSpecific: Question[] = [];
  if (mod.trackSlug === "kandji-fundamentals") {
    trackSpecific.push(
      q(`${mod.slug}-09`, "Les Blueprints Kandji servent à :", ["Backup iCloud", "Modéliser le cycle de vie device (enrollment → compliance)", "Gérer DNS", "Créer APNs"], 1, "Blueprints = workflow device Kandji."),
      q(`${mod.slug}-10`, "Library Items Kandji permettent :", ["Jailbreak", "Réutiliser configs/profils entre Blueprints", "Supprimer DEP", "FTP"], 1, "Library = composants réutilisables."),
      q(`${mod.slug}-11`, "Kandji Passport gère :", ["Photos iCloud", "Identité utilisateur macOS (SSO/local)", "Patch Windows", "DNS public"], 1, "Passport = gestion identité macOS."),
      q(`${mod.slug}-12`, "Liftoff Kandji concerne :", ["Patch Linux", "Expérience enrollment zero-touch Mac", "Email marketing", "Antivirus Windows"], 1, "Liftoff = onboarding utilisateur Mac."),
      q(`${mod.slug}-13`, "Kandji EDR ajoute :", ["Stockage cloud", "Détection menaces endpoint macOS", "Gestion paie", "CRM"], 1, "EDR = sécurité endpoint intégrée."),
      q(`${mod.slug}-14`, "Auto Apps Kandji :", ["Installe apps sans contrôle IT", "Automatise déploiement apps depuis App Store/VPP", "Désactive MDM", "Remplace ABM"], 1, "Auto Apps = déploiement app automatisé."),
      q(`${mod.slug}-15`, "Compliance Kandji vérifie :", ["Wallpaper", "OS, FileVault, apps requises, posture sécurité", "Langue clavier", "iCloud photos"], 1, "Compliance = état sécurité et config device.")
    );
  } else if (mod.trackSlug === "mosyle-fundamentals") {
    trackSpecific.push(
      q(`${mod.slug}-09`, "Mosyle Business/Enterprise cible :", ["Windows Server", "Flottes Apple macOS/iOS", "Android uniquement", "Mainframe"], 1, "Mosyle = MDM Apple cloud-native."),
      q(`${mod.slug}-10`, "Enrollment Mosyle via ABM requiert :", ["Token MDM lié Mosyle", "Compte iCloud perso", "License Adobe", "Cert SSL web"], 0, "Liaison ABM ↔ Mosyle via token MDM."),
      q(`${mod.slug}-11`, "Mosyle Auth permet :", ["Jailbreak", "SSO/authentification utilisateur Mac", "Patch BIOS", "Gestion paie"], 1, "Mosyle Auth = identité et SSO Mac."),
      q(`${mod.slug}-12`, "Mosyle Fuse est :", ["Antivirus Windows", "Agent fusion management/sécurité Mosyle", "Cloud storage", "IDE"], 1, "Fuse = agent unifié Mosyle."),
      q(`${mod.slug}-13`, "Management Profiles Mosyle contiennent :", ["Factures", "Payloads MDM (Wi-Fi, restrictions, etc.)", "Logs APNs bruts", "Tokens ABM"], 1, "Profils = payloads configuration."),
      q(`${mod.slug}-14`, "Apps & Books Mosyle utilise :", ["VPP/ABM Apps & Books", "Side loading non signé", "FTP", "Email"], 0, "Distribution apps via Apple Business Manager."),
      q(`${mod.slug}-15`, "Reporting Mosyle fournit :", ["Recettes cuisine", "Inventaire, compliance, usage apps", "Code source", "DNS logs"], 1, "Reporting = visibilité flotte et conformité.")
    );
  } else if (mod.trackSlug === "addigy-fundamentals") {
    trackSpecific.push(
      q(`${mod.slug}-09`, "Addigy cible principalement :", ["Imprimantes réseau", "Mac et Apple devices en MSP/enterprise", "Routeurs Cisco", "Serveurs Linux"], 1, "Addigy = MDM Apple avec focus MSP."),
      q(`${mod.slug}-10`, "GoLive Addigy sert à :", ["Backup Time Machine", "Automatiser onboarding device post-enrollment", "Gérer paie", "DNS"], 1, "GoLive = workflow post-enrollment."),
      q(`${mod.slug}-11`, "Policies Addigy définissent :", ["Couleur logo", "Règles config, scripts et remediation", "Facturation", "Email"], 1, "Policies = règles et actions sur devices."),
      q(`${mod.slug}-12`, "Smart Software Addigy :", ["Installe sans contrôle", "Gère versions apps et mises à jour intelligentes", "Désactive SIP", "Remplace APNs"], 1, "Smart Software = gestion apps intelligente."),
      q(`${mod.slug}-13`, "Remote Management Addigy inclut :", ["Physique sur site", "Actions à distance (lock, wipe, scripts)", "Courrier postal", "Impression"], 1, "Remote = actions MDM à distance."),
      q(`${mod.slug}-14`, "Compliance Addigy mesure :", ["Wallpaper", "Posture sécurité (FileVault, OS, apps)", "Photos", "Musique"], 1, "Compliance = état sécurité device."),
      q(`${mod.slug}-15`, "Dépannage Addigy commence par :", ["Wipe all", "Logs agent, check-in, policy scope", "Supprimer ABM", "Format disque"], 1, "Diagnostic : agent, check-in, scope.")
    );
  } else if (mod.trackSlug === "workspace-one-apple") {
    trackSpecific.push(
      q(`${mod.slug}-09`, "Workspace ONE UEM (ex-AirWatch) gère :", ["Apple uniquement", "Multi-plateforme dont Apple", "Mainframe", "Imprimantes seules"], 1, "WS1 = UEM multi-OS incluant Apple."),
      q(`${mod.slug}-10`, "Apple Enrollment WS1 requiert :", ["Token ABM + APNs configurés", "Compte Facebook", "License Oracle", "FTP"], 0, "ABM token + certificat APNs pour Apple MDM."),
      q(`${mod.slug}-11`, "Profils macOS WS1 contiennent :", ["Payloads configuration (Wi-Fi, restrictions, certs)", "Code Java", "Factures", "Logs SMTP"], 0, "Profils = payloads MDM macOS."),
      q(`${mod.slug}-12`, "Conditional Access WS1 avec Apple :", ["Ignore device state", "Exige conformité device avant accès apps", "Ouvre tout", "Désactive MFA"], 1, "CA = device compliance requis."),
      q(`${mod.slug}-13`, "Compliance policies WS1 vérifient :", ["Wallpaper", "OS version, encryption, jailbreak", "Nom iCloud", "Modèle écran"], 1, "Compliance = critères sécurité device."),
      q(`${mod.slug}-14`, "Apps WS1 pour Apple utilisent :", ["VPP/ABM et Managed App Distribution", "Sideload non signé", "Email", "USB"], 0, "Distribution via Apple Business Manager."),
      q(`${mod.slug}-15`, "Reporting WS1 Intelligence fournit :", ["Recettes", "Dashboards inventaire, compliance, apps", "Code source", "DNS"], 1, "Intelligence = analytics et reporting UEM.")
    );
  } else {
    trackSpecific.push(
      q(`${mod.slug}-09`, "Jamf Pro est reconnu pour :", ["Android natif", "Profondeur Apple et écosystème Jamf", "ERP", "CRM"], 1, "Jamf = leader MDM Apple historique."),
      q(`${mod.slug}-10`, "Intune excelle pour :", ["Organisations Microsoft-first avec Apple", "Gestion mainframe", "Impression", "ERP seul"], 0, "Intune = UEM Microsoft + Apple via ABM."),
      q(`${mod.slug}-11`, "Kandji se différencie par :", ["Blueprints et UX moderne Apple-only", "Gestion Android native", "ERP", "Antivirus Windows"], 0, "Kandji = Apple-native, Blueprints, Liftoff."),
      q(`${mod.slug}-12`, "Mosyle vise :", ["Grandes entreprises Windows", "PME/éducation Apple avec pricing compétitif", "Mainframe", "IoT industriel"], 1, "Mosyle = Apple MDM accessible, éducation/PME."),
      q(`${mod.slug}-13`, "Addigy convient aux :", ["MSP gérant flottes Mac multi-clients", "Imprimeries", "Restaurants", "Aviation seule"], 0, "Addigy = modèle MSP, multi-tenant."),
      q(`${mod.slug}-14`, "Workspace ONE convient si :", ["Écosystème VMware/Broadcom déjà en place", "Aucun MDM", "Pas de Apple devices", "ERP seul"], 0, "WS1 = choix si stack VMware existant."),
      q(`${mod.slug}-15`, "Critère coût indicatif (placeholder) :", ["Identique pour tous", "Varie par device/mois, modules et support", "Gratuit toujours", "Uniquement par email"], 1, "Coût = licensing par device + add-ons.")
    );
  }

  const pool = [...bases, ...trackSpecific];
  const result: Question[] = [];
  for (let i = 0; i < mod.quizCount; i++) {
    const base = pool[i % pool.length];
    result.push({
      ...base,
      id: `${mod.quizSlug}-${String(i + 1).padStart(2, "0")}`,
    });
  }
  return result;
}

export function createModuleQuiz(mod: AltMdmModuleDef): Quiz {
  return {
    slug: mod.quizSlug,
    trackSlug: mod.trackSlug,
    title: `Quiz — ${mod.title}`,
    type: "quiz",
    description: `${mod.quizCount} questions — ${mod.title}.`,
    duration: "25 min",
    passingScore: 75,
    questions: questionsForModule(mod),
  };
}

export function createAllModuleQuizzes(modules: AltMdmModuleDef[]): Quiz[] {
  return modules.map(createModuleQuiz);
}
