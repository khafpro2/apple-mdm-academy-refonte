/**
 * Contenu pédagogique aligné sur la documentation Jamf Pro 11.16
 * @see https://learn.jamf.com/r/en-US/jamf-pro-documentation-11.16.0/
 */

export type Jamf116TopicId =
  | "fundamentals"
  | "inventory"
  | "enrollment"
  | "configuration-profiles"
  | "smart-groups"
  | "policies"
  | "packages"
  | "scripts"
  | "patch-management"
  | "self-service";

export type Jamf116TopicBlocks = {
  docRef: string;
  overview: string[];
  architecture: string[];
  concepts: string[];
  steps: string[];
  checks: string[];
  pitfalls: string[];
  summary: string[];
};

const DOC_BASE = "Jamf Pro 11.16 — learn.jamf.com";

const TOPICS: Record<Jamf116TopicId, Jamf116TopicBlocks> = {
  fundamentals: {
    docRef: `${DOC_BASE}/Jamf_Pro_Overview`,
    overview: [
      "Jamf Pro 11.16 centralise l'inventaire, l'enrollment ADE, les Configuration Profiles, les policies, les packages et Self Service pour macOS, iOS/iPadOS et tvOS.",
      "Le framework de gestion Jamf et le canal MDM Apple (via APNs) permettent d'inventorier les appareils, pousser des profils et exécuter des actions à distance.",
    ],
    architecture: [
      "Console Jamf Pro → APNs → appareil géré : le serveur envoie une notification push, l'appareil check-in et reçoit les commandes MDM (profils, policies, apps).",
      "Apple Business Manager alimente l'ADE : token serveur MDM (.p7m), assignation appareils, PreStage Enrollment pour Mac et mobile.",
      "Sites segmentent l'infrastructure multi-BU ; Distribution Points hébergent packages et apps pour le déploiement.",
    ],
    concepts: [
      "Computers / Mobile Devices : inventaire General, Hardware, Software, Security, Extension Attributes, Management History.",
      "Computer PreStage et Mobile Device PreStage automatisent enrollment, scope initial et Configuration Profiles au Setup Assistant.",
      "Self Service macOS/iOS expose un catalogue IT approuvé (apps, policies, patch policies sélectionnées).",
      "Advanced Search sert au reporting ; Smart Groups servent au scope et au déploiement (recommandation Jamf 11.16).",
    ],
    steps: [
      "Jamf Pro → Settings → Global Management → Apple Push Notification service : vérifier certificat APNs valide.",
      "Settings → Computer Management → Automated Device Enrollment : importer token ABM, synchroniser appareils.",
      "Computers → recherche appareil pilote → vérifier last check-in, OS, supervision, profils installés.",
      "Computers → Configuration Profiles / Policies : identifier objets scoped au parc pilote.",
      "Self Service → configurer branding et catégories pour le catalogue utilisateur.",
    ],
    checks: [
      "APNs valide avec date d'expiration > 30 jours.",
      "Token ADE synchronisé, appareils visibles dans Jamf.",
      "Inventaire remonté (Software, Security) sur Mac pilote.",
      "Self Service installé et catalogue accessible sur appareil test.",
    ],
    pitfalls: [
      "Renouveler APNs avec un Apple ID différent du certificat initial.",
      "Confondre Advanced Search (reporting) et Smart Groups (scope) — Jamf déconseille les Smart Groups circulaires.",
      "PreStage trop lourd ralentissant le premier boot Mac.",
    ],
    summary: [
      "Jamf Pro 11.16 repose sur APNs, ADE/ABM, inventaire fiable et objets scoped (profils, policies, packages).",
      "Fundamentals = navigation console, enrollment, inventaire, Self Service et chaîne push MDM.",
    ],
  },
  "smart-groups": {
    docRef: `${DOC_BASE}/Smart_Groups`,
    overview: [
      "Les Smart Groups (Computers, Mobile Devices, Users) mettent à jour l'appartenance dynamiquement selon l'inventaire.",
      "Jamf Pro 11.16 recommande les Smart Groups pour le scope, le déploiement et les actions — pas pour le reporting (utiliser Advanced Search).",
    ],
    architecture: [
      "Critères inventaire → moteur Smart Group → membership dynamique → scope policies / profils / patch policies.",
      "Extension Attributes enrichissent les critères (script, LDAP, pattern) sans modifier l'inventaire Apple natif.",
      "Éviter deux Smart Groups qui dépendent mutuellement de l'appartenance l'une de l'autre (recalcul circulaire, impact performance).",
    ],
    concepts: [
      "Computers → Smart Computer Groups → New : critères AND/OR, parenthèses, preview membership.",
      "Critères : OS version, modèle, apps installées, FileVault, EA, last check-in, Managed Apple ID, etc.",
      "Static Groups = membership manuelle pour pilotes ; Smart Groups = dynamique pour production.",
      "Computer Inventory and Criteria Reference (doc 11.16) liste tous les attributs disponibles.",
    ],
    steps: [
      "Définir l'intention : scope policy, patch, profil ou exclusion.",
      "Computers → Smart Computer Groups → New → nom conventionné (SITE-ROLE-OS).",
      "Ajouter critères mesurables (ex. macOS ≥ 14, app installée, EA equals).",
      "Preview → comparer nombre de membres à l'attendu.",
      "Utiliser le Smart Group dans Scope d'une policy pilote avant production.",
    ],
    checks: [
      "Membership preview cohérent avec Advanced Search sur mêmes critères.",
      "Exclusions Static/Smart Groups protègent VIP et lab.",
      "Aucune dépendance circulaire entre Smart Groups.",
    ],
    pitfalls: [
      "Critère trop large (« Computer Name contains Mac ») scope des milliers d'appareils.",
      "Oublier qu'un changement d'inventaire déplace automatiquement un Mac hors/ dans le groupe.",
      "Utiliser Smart Groups pour des rapports ad hoc au lieu d'Advanced Search.",
    ],
    summary: [
      "Smart Groups 11.16 = ciblage dynamique pour scope et déploiement, critères stables, preview obligatoire.",
    ],
  },
  policies: {
    docRef: `${DOC_BASE}/Policies`,
    overview: [
      "Les policies automatisent scripts, packages, maintenance et gestion de comptes sur les Mac gérés.",
      "Configuration : payloads (General, Packages, Scripts…), trigger, execution frequency, scope, exclusions, Self Service optionnel.",
    ],
    architecture: [
      "Trigger (Enrollment Complete, Recurring Check-in, Login, Startup, Self Service, custom) → policy queue → jamf binary / agent → logs Policy.",
      "Scope = Smart/Static Groups + exclusions ; la policy s'exécute au prochain check-in si critères General remplis.",
      "Retirer une cible du scope ne supprime pas les réglages déjà appliqués si la policy a déjà tourné (doc 11.16).",
    ],
    concepts: [
      "Computers → Policies → New : General (trigger, frequency, category, target drive).",
      "Payloads : Scripts, Packages, Maintenance, Directory Binding, etc.",
      "Self Service tab : rendre la policy exécutable à la demande par l'utilisateur.",
      "User Interaction tab : messages, deferrals, deadlines.",
      "Policy logs : Computers → [Mac] → Management → Policy Logs.",
    ],
    steps: [
      "Computers → Policies → New → nom descriptif + trigger adapté au scénario.",
      "Configurer payload (script test ou package) avec logs exploitables.",
      "Scope → Smart Group pilote ; exclusions si nécessaire.",
      "Save → forcer check-in (`sudo jamf policy`) ou attendre trigger.",
      "Vérifier Policy Logs et résultat sur Mac.",
    ],
    checks: [
      "Trigger et frequency correspondent à l'objectif (once vs recurring).",
      "Scope limité au pilote ; exclusions testées.",
      "Logs Completed sans erreur ; rollback documenté.",
    ],
    pitfalls: [
      "Policy Enrollment Complete trop lourde au premier boot.",
      "Recurring Check-in + fréquence agressive = charge serveur et UX dégradée.",
      "Oublier Restart Options après installation package nécessitant reboot.",
    ],
    summary: [
      "Policies 11.16 = automation scoped avec triggers explicites ; Self Service pour exécution utilisateur.",
    ],
  },
  packages: {
    docRef: `${DOC_BASE}/Packages`,
    overview: [
      "Un package Jamf Pro est un PKG ou DMG déployé vers les Mac — construit via Composer ou outil tiers.",
      "Workflow 11.16 : ajouter à Distribution Point → enregistrer dans Jamf → déployer via policy (payload Packages).",
    ],
    architecture: [
      "Distribution Point stocke le fichier ; Jamf Pro référence métadonnées (nom, catégorie, OS min).",
      "Policy payload Packages : Install, Cache, Uninstall — action + distribution point + restart options.",
      "Deploying a Package Using a Policy (11.16) : General → Packages → Scope → Self Service (optionnel).",
    ],
    concepts: [
      "Computers → Packages → New : upload ou Composer, catégorie, OS requirements.",
      "Action pop-up : Install, Cache, Uninstall selon scénario.",
      "Distribution point : site default ou réplica pour téléchargement Mac.",
      "Packages ≠ Configuration Profiles (payloads MDM vs fichiers installables).",
    ],
    steps: [
      "Préparer PKG/DMG signé (Composer ou pkgbuild).",
      "Computers → Packages → New → upload vers Distribution Point.",
      "Computers → Policies → New → payload Packages → Add package → Install.",
      "Scope Smart Group pilote ; Restart Options si requis.",
      "Option Self Service tab pour installation à la demande.",
    ],
    checks: [
      "Package visible sur Distribution Point, checksum OK.",
      "Policy Packages exécutée, app installée ou fichier présent.",
      "Uninstall policy testée si cycle de vie complet requis.",
    ],
    pitfalls: [
      "Package sans requirement OS → échec silencieux sur version incompatible.",
      "Oublier Distribution Point pour sites distants (bande passante).",
      "Mélanger package cache et install sans comprendre l'action choisie.",
    ],
    summary: [
      "Packages 11.16 = PKG/DMG sur Distribution Point, déploiement via policy Packages payload.",
    ],
  },
  scripts: {
    docRef: `${DOC_BASE}/Scripts`,
    overview: [
      "Les scripts (Settings → Computer Management → Scripts) s'exécutent via payload Scripts d'une policy.",
      "Paramètres Jamf ($4–$11), idempotence, codes retour et logs sont essentiels en production.",
    ],
    architecture: [
      "Script stocké Jamf → policy payload Scripts → exécution root via jamf framework → Policy Logs + fichier log local.",
      "Priority (Before/After) ordonne les policies au check-in.",
      "Scripts peuvent alimenter Extension Attributes pour Smart Groups dynamiques.",
    ],
    concepts: [
      "Settings → Computer Management → Scripts → New : upload .sh, notes, OS requirements.",
      "Policy → Scripts payload : fréquence Once per computer / Every run.",
      "Paramètres : jamf setParameter / arguments positionnels documentés.",
      "Code retour non zéro = échec policy ; journaliser dans /var/log/ ou /Library/Logs/.",
    ],
    steps: [
      "Écrire script idempotent avec shebang, set -euo pipefail si adapté, logging.",
      "Tester localement sur Mac lab identique au parc.",
      "Upload script Jamf + documenter paramètres.",
      "Policy Scripts scoped pilote, Once per computer pour test.",
      "Analyser Policy Logs ; relancer pour valider idempotence.",
    ],
    checks: [
      "Script relançable sans effet de bord.",
      "Secrets via EA ou fichier sécurisé, jamais en clair dans le script.",
      "Exit code et stdout/stderr dans logs Jamf.",
    ],
    pitfalls: [
      "Environnement shell policy ≠ Terminal interactif (PATH, TCC, user context).",
      "Script qui réussit (exit 0) sans effectuer l'action.",
      "Oublier OS requirement sur script spécifique Apple Silicon.",
    ],
    summary: [
      "Scripts 11.16 = automation policy-scoped, paramètres documentés, logs et idempotence obligatoires.",
    ],
  },
  "patch-management": {
    docRef: `${DOC_BASE}/Creating_a_Patch_Policy`,
    overview: [
      "Patch Management Jamf Pro 11.16 suit Software Titles, inventaire versions et Patch Policies pour macOS et apps tierces.",
      "Patch policy : version cible, eligible computers auto-générés, scope, Self Service (non visible dans recherche Self Service).",
    ],
    architecture: [
      "Software Update Inventory + Extension Attributes → Software Title → Patch Policy → déploiement scope.",
      "General pane : install automatically vs Self Service ; Patch Unknown Versions inclut versions inconnues.",
      "Eligible computers link preview avant scope ; machine hors liste n'est patchée qu'après conformité critères.",
    ],
    concepts: [
      "Computers → Patch Management → Software Titles → Create Patch Policy.",
      "Target version, deadline, notifications utilisateur (User Interaction).",
      "Patch policies absentes de la recherche Self Service (doc 11.16) mais visibles si exposées.",
      "Markdown supporté dans Description Self Service.",
    ],
    steps: [
      "Vérifier Software Update Inventory remonte updates/apps.",
      "Sélectionner Software Title → Create Patch Policy → version cible.",
      "Configurer Patch Unknown Versions si parc hétérogène.",
      "Scope Smart Group pilote ; vérifier eligible computers.",
      "Monitorer Patch Management dashboard et logs ; rapport conformité.",
    ],
    checks: [
      "Eligible computers correspond au parc visé.",
      "Post-patch : version cible confirmée dans inventaire Software.",
      "Échecs groupés par cause (espace disque, app ouverte, réseau).",
    ],
    pitfalls: [
      "Forcer patch production sans pilote ni fenêtre maintenance.",
      "Confondre patch policy macOS et policy package app tierce.",
      "Scope manuel sur Mac non eligible → policy jamais appliquée.",
    ],
    summary: [
      "Patch Management 11.16 = Software Titles, patch policies scoped, eligible computers, reporting conformité.",
    ],
  },
  "self-service": {
    docRef: `${DOC_BASE}/Self_Service`,
    overview: [
      "Jamf Self Service macOS/iOS expose policies, apps VPP et ressources IT approuvées sans ticket pour chaque action.",
      "Policies peuvent être rendues disponibles via onglet Self Service ; patch policies aussi (hors recherche).",
    ],
    architecture: [
      "Configuration Profiles (Self Service macOS payload) + app Self Service sur appareil → catalogue + policies scoped.",
      "Branding : icônes, catégories, description Markdown pour policies patch.",
      "Utilisateur déclenche policy → même moteur d'exécution que trigger Self Service.",
    ],
    concepts: [
      "Settings → Self Service → macOS / iOS : branding, notifications, featured categories.",
      "Policy → Self Service tab : display name, description, button text, category.",
      "Limites : patch policies non trouvables via recherche Self Service (11.16).",
      "Apps VPP et eBooks assignés apparaissent selon scope et licences.",
    ],
    steps: [
      "Vérifier app Self Service installée (policy ou PreStage).",
      "Configurer branding et catégories (Productivité, Security, Utilities).",
      "Policies pilotes : cocher Self Service + description claire.",
      "Tester sur Mac utilisateur : installation app, exécution policy, deferrals.",
      "Collecter feedback UX avant catalogue production.",
    ],
    checks: [
      "Catalogue visible, policies exécutables, logs OK.",
      "Descriptions compréhensibles pour utilisateurs non techniques.",
      "Policies destructives jamais exposées Self Service sans garde-fous.",
    ],
    pitfalls: [
      "Trop d'items Self Service = catalogue inexploitable.",
      "Policy sans User Interaction sur action longue → utilisateur interrompt.",
      "Oublier que retirer du scope Self Service n'annule pas déploiements passés.",
    ],
    summary: [
      "Self Service 11.16 = catalogue IT contrôlé, policies à la demande, branding et catégories soignés.",
    ],
  },
  inventory: {
    docRef: `${DOC_BASE}/Computer_Inventory`,
    overview: [
      "L'inventaire Jamf Pro consolide General, Hardware, Software, Security, Extension Attributes et Management History par appareil.",
      "Advanced Search sert au reporting ad hoc ; Smart Groups servent au scope dynamique (doc 11.16).",
    ],
    architecture: [
      "Check-in MDM → collecte inventaire → EA scripts/LDAP → critères Smart Groups / Advanced Search.",
      "Last check-in et supervision indiquent la santé de la relation MDM appareil-serveur.",
    ],
    concepts: [
      "Computers → fiche appareil : onglets General, Hardware, Software, Security.",
      "Advanced Search : critères AND/OR, export CSV, saved searches.",
      "Extension Attributes : enrichissement inventaire pour conformité métier.",
      "Management History : profils et policies appliqués dans le temps.",
    ],
    steps: [
      "Computers → recherche Mac pilote → vérifier inventaire complet post-enrollment.",
      "Advanced Search : critère conformité (ex. FileVault OFF).",
      "Créer EA pilote alimentée par script ou LDAP.",
      "Comparer résultats Advanced Search vs Smart Group preview.",
    ],
    checks: [
      "Inventaire Software et Security remontés sous 24 h post-enrollment.",
      "Last check-in cohérent avec politique de maintenance.",
      "EA sans erreur script dans logs.",
    ],
    pitfalls: [
      "Utiliser Smart Groups pour reporting au lieu d'Advanced Search.",
      "Ignorer Mac stale (check-in > 7 jours) avant campagne conformité.",
      "EA script en échec silencieux faussant critères Smart Groups.",
    ],
    summary: [
      "Inventaire 11.16 = source de vérité scope/conformité, Advanced Search reporting, EA pour champs métier.",
    ],
  },
  enrollment: {
    docRef: `${DOC_BASE}/Automated_Device_Enrollment`,
    overview: [
      "Automated Device Enrollment (ADE) via Apple Business Manager assigne appareils au serveur MDM Jamf avec supervision.",
      "Computer/Mobile PreStage configure profils, policies et Self Service au Setup Assistant.",
    ],
    architecture: [
      "ABM → token serveur MDM (.p7m) → sync appareils → PreStage scope → enrollment zero-touch.",
      "APNs valide requis pour push commandes post-enrollment.",
    ],
    concepts: [
      "Settings → Computer Management → Automated Device Enrollment : token ABM, sync.",
      "Computer PreStage : scope initial, profils Wi-Fi/FileVault, packages agent.",
      "Mobile Device PreStage pour iOS/iPadOS supervisés.",
      "User-initiated enrollment vs ADE pour BYOD (hors scope certification Jamf 100).",
    ],
    steps: [
      "Vérifier APNs et token ABM valides.",
      "Sync appareils ABM → Jamf.",
      "Créer Computer PreStage lean : profils essentiels + agent.",
      "Tester erase Mac lab → enrollment ADE → validation profils.",
    ],
    checks: [
      "Appareil supervisé post-ADE.",
      "Profils PreStage installés au premier boot.",
      "Token ABM et APNs dates expiration > 30 jours.",
    ],
    pitfalls: [
      "PreStage trop lourd ralentissant Setup Assistant.",
      "Token ABM non renouvelé → appareils non synchronisés.",
      "APNs renouvelé avec Apple ID différent → push MDM cassé.",
    ],
    summary: [
      "Enrollment 11.16 = ADE ABM + PreStage scoped + APNs valide pour zero-touch enterprise.",
    ],
  },
  "configuration-profiles": {
    docRef: `${DOC_BASE}/Configuration_Profiles`,
    overview: [
      "Configuration Profiles transportent payloads MDM Apple : Wi-Fi, VPN, restrictions, FileVault, PPPC, extensions.",
      "Computers → Configuration Profiles → New : composer payloads, scope Smart Groups, déploiement push.",
    ],
    architecture: [
      "Jamf Pro signe profil → push APNs → appareil installe payloads MDM dans Réglages → Profils.",
      "Profils ≠ packages PKG : réglages MDM vs fichiers installables via policy Packages.",
    ],
    concepts: [
      "Payload Wi-Fi enterprise WPA2-Enterprise + certificat.",
      "Payload FileVault avec escrow clé recovery (Bootstrap Token requis).",
      "Restrictions, PPPC, System Extensions selon cas enterprise.",
      "Management History pour conflits profils multiples.",
    ],
    steps: [
      "Configuration Profiles → New → payloads Wi-Fi + FileVault.",
      "Scope Smart Group pilote ADE.",
      "Save → check-in Mac pilote.",
      "Vérifier Réglages → Profils et onglet Security inventaire.",
    ],
    checks: [
      "Profils installés sans conflit SSID.",
      "FileVault activé avec escrow visible Jamf.",
      "Management History cohérent.",
    ],
    pitfalls: [
      "Deux profils Wi-Fi même SSID → comportement imprévisible.",
      "FileVault sans escrow IT → recovery impossible.",
      "Scope production sans pilote.",
    ],
    summary: [
      "Configuration Profiles 11.16 = payloads MDM scoped, distincts des packages, escrow FileVault enterprise.",
    ],
  },
};

export function resolveJamf116Topic(lessonSlug: string, moduleSlug?: string): Jamf116TopicId | null {
  const s = `${lessonSlug} ${moduleSlug ?? ""}`.toLowerCase();
  if (s.includes("config-profile") || s.includes("config-profiles") || s.includes("profil")) return "configuration-profiles";
  if (s.includes("inventaire") || s.includes("inventory") || s.includes("extension-attribute")) return "inventory";
  if (s.includes("enrollment") || s.includes("prestage") || s.includes("ade")) return "enrollment";
  if (s.includes("smart") || s.includes("sg-") || s.includes("module-13")) return "smart-groups";
  if (s.includes("package") || s.includes("m14-package")) return "packages";
  if (s.includes("policy") || s.includes("m14-") || s.includes("policies-base") || s.includes("scope-deploiement"))
    return "policies";
  if (s.includes("script") || s.includes("m15-")) return "scripts";
  if (s.includes("patch") || s.includes("m16-")) return "patch-management";
  if (s.includes("self-service") || s.includes("m12-self")) return "self-service";
  if (
    s.includes("jamf") ||
    s.includes("m12-") ||
    s.includes("architecture-jamf") ||
    s.includes("inventaire") ||
    s.includes("enrollment") ||
    s.includes("module-12")
  )
    return "fundamentals";
  return null;
}

export function getJamf116TopicBlocks(topic: Jamf116TopicId): Jamf116TopicBlocks {
  return TOPICS[topic];
}

export function getJamf116DocVersion(): string {
  return "11.16.0";
}

/** Couverture certification Jamf 100 / 200 (objectifs officiels) */
export const JAMF_CERTIFICATION_COVERAGE = {
  jamf100: {
    label: "Jamf Certified Associate (Jamf 100)",
    docVersion: "11.16.0",
    modules: [
      { id: "fundamentals", title: "Jamf Pro Fundamentals", lessons: 5, lab: "jamf-discovery", examWeight: 25 },
      { id: "smart-groups", title: "Smart Groups", lessons: 5, lab: "jamf-smart-groups", examWeight: 25 },
      { id: "policies", title: "Policies", lessons: 6, lab: "jamf-policies", examWeight: 25 },
      { id: "packages", title: "Packages (déploiement)", lessons: 1, lab: "jamf-packages", examWeight: 12 },
      { id: "self-service", title: "Self Service", lessons: 1, lab: "jamf-self-service", examWeight: 13 },
    ],
    totalExamQuestions: 50,
    passingScore: 75,
  },
  jamf200: {
    label: "Jamf Certified Admin (Jamf 200)",
    docVersion: "11.16.0",
    modules: [
      { id: "scripts", title: "Scripts & automation", lessons: 5, lab: "jamf-scripts", examWeight: 30 },
      { id: "patch-management", title: "Patch Management", lessons: 5, lab: "jamf-patch-management", examWeight: 30 },
      { id: "packages-adv", title: "Packages avancés", lessons: 1, lab: "jamf-packages", examWeight: 15 },
      { id: "self-service-adv", title: "Self Service avancé", lessons: 1, lab: "jamf-self-service", examWeight: 10 },
      { id: "protect", title: "Jamf Protect", lessons: 5, lab: "jamf-protect", examWeight: 15 },
    ],
    totalExamQuestions: 50,
    passingScore: 75,
  },
} as const;
