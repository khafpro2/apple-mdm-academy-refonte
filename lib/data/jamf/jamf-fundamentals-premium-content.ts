import type { JamfFundamentalsModuleId } from "@/lib/data/jamf/jamf-fundamentals-premium";

export type JamfPremiumLessonSection = {
  title: string;
  items: string[];
};

export type JamfPremiumModuleContent = {
  introduction: string[];
  concepts: string[];
  architecture: string[];
  demonstration: string[];
  bestPractices: string[];
  commonErrors: string[];
  summary: string[];
  heygenScript: string;
  labSteps: string[];
  enterpriseScenario: string;
};

function mod(
  introduction: string[],
  concepts: string[],
  architecture: string[],
  demonstration: string[],
  bestPractices: string[],
  commonErrors: string[],
  summary: string[],
  heygenScript: string,
  labSteps: string[],
  enterpriseScenario: string
): JamfPremiumModuleContent {
  return {
    introduction,
    concepts,
    architecture,
    demonstration,
    bestPractices,
    commonErrors,
    summary,
    heygenScript,
    labSteps,
    enterpriseScenario,
  };
}

export const JAMF_FUNDAMENTALS_PREMIUM_CONTENT: Record<JamfFundamentalsModuleId, JamfPremiumModuleContent> = {
  "intro-jamf-pro": mod(
    [
      "Jamf Pro est la plateforme MDM de référence pour gérer Mac, iPhone et iPad en entreprise.",
      "Ce module pose les fondations certification Jamf 100 : composants, rôles et valeur MDM Apple.",
    ],
    [
      "MDM Apple : enrollment, profils, policies, inventaire push via APNs.",
      "Jamf Cloud vs on-prem : même console, hébergement différent.",
      "ABM/ADE : source de vérité pour appareils supervisés zero-touch.",
      "Self Service, Patch Management, Jamf Protect : extensions du socle Jamf Pro.",
    ],
    [
      "Chaîne : ABM → Jamf Pro → APNs → appareil (check-in MDM).",
      "Distribution Points pour packages ; LDAP/IdP pour identités admin.",
      "Sites pour multi-tenant MSP et filiales.",
    ],
    [
      "Connexion console Jamf Pro → Dashboard : appareils gérés, alertes certificats.",
      "Parcours Computers → fiche Mac pilote → inventaire et Management History.",
      "Settings → Global Management → vérifier token ABM et certificat APNs.",
    ],
    [
      "Documenter architecture (ABM, APNs, Jamf URL) avant tout déploiement.",
      "Groupe pilote 5–10 Mac/iPad pour valider chaque brique.",
      "Runbook ITSM pour enrollment et support niveau 1.",
    ],
    [
      "Confondre Jamf Account (licence) et console Jamf Pro (MDM).",
      "Ignorer expiration token ABM (365 jours).",
      "Déployer en production sans Mac pilote supervisé.",
    ],
    ["Jamf Pro = hub MDM Apple. Maîtrisez Dashboard, Computers et prérequis ABM/APNs avant Smart Groups et policies."],
    `Bonjour et bienvenue dans le parcours Jamf Fundamentals Premium d'Apple MDM Academy.

Module 1 — Introduction à Jamf Pro. Objectif Jamf 100 : comprendre l'écosystème et la chaîne MDM Apple.

Scénario entreprise : une PME de 400 Mac rejoint un programme de conformité — vous devez expliquer le rôle de Jamf Pro face à ABM et APNs.

Jamf Pro centralise l'inventaire, les profils MDM, les policies et le déploiement logiciel. Apple Business Manager alimente l'enrollment automatique. APNs transporte les commandes push.

Démonstration : Dashboard → Computers → fiche Mac → Management History. Settings → certificats.

Bonnes pratiques : pilote supervisé, documentation architecture, renouvellement ABM planifié.

Erreurs fréquentes : confondre compte Jamf et console, oublier APNs.

Résumé : Jamf Pro est le moteur MDM. Passez au lab jamf-discovery puis au quiz intro.`,
    [
      "Se connecter à Jamf Pro et explorer le Dashboard",
      "Ouvrir la fiche d'un Mac pilote et l'inventaire",
      "Vérifier Settings → Global Management (ABM, APNs)",
      "Documenter l'architecture dans le runbook",
    ],
    "PME 400 Mac — onboarding Jamf Pro avec architecture ABM + APNs documentée."
  ),
  "interface-jamf": mod(
    [
      "L'interface Jamf Pro structure le travail admin : Dashboard, Computers, Policies, Settings.",
      "Navigation efficace = diagnostic rapide et moindre risque d'erreur de scope.",
    ],
    [
      "Dashboard : KPI enrollment, policies en erreur, certificats.",
      "Sites : isolation multi-entité (MSP, filiales).",
      "RBAC : rôles Read/Create/Update par ressource.",
      "Recherche globale Computers et filtres inventaire.",
    ],
    [
      "Admin SAML via Settings → System Settings → SSO.",
      "Audit logs admin dans Jamf Pro Server logs.",
      "Distribution Points listés par site.",
    ],
    [
      "Dashboard → identifier alertes APNs ou ABM.",
      "Computers → recherche serial → fiche détaillée.",
      "Settings → Jamf Pro Users → rôle Auditor Read-only.",
    ],
    [
      "Créer comptes admin least-privilege par équipe (L1/L2).",
      "Utiliser Sites avant Smart Groups pour isolation client.",
      "Policy Logs avant modification d'une policy en production.",
    ],
    [
      "Full Access pour tous les admins.",
      "Ignorer les alertes Dashboard certificats.",
      "Modifier policy sans consulter Policy Logs.",
    ],
    ["Interface = Dashboard + inventaire + RBAC. Sites et rôles granulaires pour enterprise multi-tenant."],
    `Module 2 — Interface Jamf Pro. Certification Jamf 100.

Scénario : MSP avec 12 clients sur une instance — chaque admin client ne voit que son Site.

Dashboard : vue santé parc. Computers : opérations quotidiennes. Settings : SSO, Sites, certificats.

Démonstration : créer rôle Auditor Read-only. Filtrer Computers par Site.

Erreurs : Full Access généralisé, alertes certificats ignorées.

Lab jamf-discovery section navigation. Quiz interface.`,
    ["Explorer Dashboard et noter alertes", "Rechercher Mac par serial", "Configurer rôle Read-only test", "Documenter navigation L1"],
    "MSP 12 clients — RBAC Site-scoped et rôle Auditor pour équipe support."
  ),
  inventory: mod(
    [
      "L'inventaire Jamf alimente Smart Groups, rapports et conformité.",
      "Extension Attributes et Advanced Search distinguent scope vs reporting.",
    ],
    [
      "Inventaire collecté à chaque check-in MDM : hardware, OS, apps, profils.",
      "Extension Attributes : champs custom (script, LDAP, regex).",
      "Advanced Search : requêtes ad hoc sans impact scope.",
      "Smart Groups : critères dynamiques pour déploiement.",
    ],
    [
      "EA Script s'exécute sur client → valeur remonte inventaire.",
      "Inventaire stocké Jamf Pro DB ; API REST pour export.",
      "Application Usage et FileVault status dans fiche Mac.",
    ],
    [
      "Computers → Mac pilote → Inventory tab.",
      "Settings → Extension Attributes → New Script EA.",
      "Advanced Search → critères OS + app → Save (sans Smart Group).",
    ],
    [
      "EA idempotents, logs locaux, éviter scripts lourds à chaque check-in.",
      "Advanced Search pour audit ; Smart Groups pour scope.",
      "Nommer EA avec préfixe entreprise (CORP-FV-STATUS).",
    ],
    [
      "Smart Group pour reporting ponctuel (recalculs inutiles).",
      "EA sans gestion erreur → inventaire vide.",
      "Confondre Last Check-in et Last Inventory Update.",
    ],
    ["Inventaire = carburant automation. EA + Advanced Search + Smart Groups complémentaires."],
    `Module 3 — Inventory Jamf Pro 11.16.

Scénario : audit FileVault — identifier Mac non chiffrés via EA + Advanced Search.

Extension Attributes enrichissent inventaire. Advanced Search pour rapport ad hoc. Smart Groups pour scope policy FileVault.

Lab jamf-discovery inventaire. Quiz quiz-jamf-inventory. PDF jamf-guide-inventory.`,
    ["Créer EA FileVault status", "Advanced Search Mac FV off", "Smart Group scope remediation", "Exporter résultats"],
    "Audit conformité FileVault — EA + Advanced Search + Smart Group remediation."
  ),
  computers: mod(
    [
      "La section Computers est le centre opérationnel pour chaque Mac géré.",
      "Fiche Mac : inventaire, profils, policies, logs et actions distantes.",
    ],
    [
      "Management History : timeline profils et policies.",
      "Actions : Update Inventory, Wipe, Lock, Unmanage.",
      "Scope tab : groupes et profils actifs sur le Mac.",
      "Policy Logs par Mac via fiche ou policy.",
    ],
    [
      "Check-in MDM déclenché par APNs ou `sudo jamf policy`.",
      "Local user vs MDM user dans fiche Security.",
      "Bootstrap Token pour FileVault escrow ADE.",
    ],
    [
      "Computers → Mac pilote → Management History.",
      "Forcer Update Inventory → vérifier Last Check-in.",
      "Policy Logs depuis fiche Mac.",
    ],
    [
      "Toujours Update Inventory avant diagnostic scope.",
      "Documenter serial + asset tag dans EA.",
      "Pilote avant action Wipe/Lock.",
    ],
    [
      "Wipe sans confirmation asset tag.",
      "Ignorer Management History après échec profil.",
      "Unmanage accidentel en production.",
    ],
    ["Computers = fiche Mac complète. Management History et Policy Logs = premier réflexe dépannage."],
    `Module 4 — Computers Jamf Pro.

Scénario : policy profil Wi-Fi échoue — diagnostiquer via Management History et Policy Logs sur fiche Mac.

Démonstration fiche Mac complète. Lab jamf-discovery. Quiz quiz-jamf-computers.`,
    ["Ouvrir fiche Mac pilote", "Analyser Management History", "Forcer Update Inventory", "Consulter Policy Logs"],
    "Support L2 — diagnostic profil Wi-Fi via fiche Mac et logs."
  ),
  "mobile-devices": mod(
    [
      "Mobile Devices gère iPhone et iPad supervisés via MDM Apple.",
      "Profils, apps VPP et actions distantes diffèrent des workflows Mac.",
    ],
    [
      "Supervision requise pour options avancées (silent install, restrictions).",
      "ADE iOS : PreStage mobile + ABM.",
      "Configuration Profiles iOS : Wi-Fi, VPN, restrictions, SSO extension.",
      "Apps : VPP token, App Store apps, custom B2B.",
    ],
    [
      "Mobile Devices → fiche iPad → Profiles / Apps / Security.",
      "Shared iPad vs user-assigned selon cas école/retail.",
      "Commands : Erase, Clear Passcode, Sync.",
    ],
    [
      "Mobile Devices → iPad pilote ADE → profils installés.",
      "Créer profil Wi-Fi iOS scoped groupe pilote.",
      "Vérifier Last Push et Last Inventory.",
    ],
    [
      "PreStage mobile miroir Mac (apps de base, profils).",
      "Tester profils iOS sur iPad pilote supervisé.",
      "Séparer Sites mobile vs Mac si parc mixte.",
    ],
    [
      "Profils macOS copiés sur iOS sans adaptation payloads.",
      "Oublier supervision pour silent VPP install.",
      "Wipe sans mode Lost Device check.",
    ],
    ["Mobile Devices = parc iOS/iPadOS supervisé. PreStage + profils + VPP = triptyque onboarding."],
    `Module 5 — Mobile Devices Jamf Pro.

Scénario : déployer Wi-Fi corporate sur 200 iPad retail supervisés ADE.

Mobile Devices console, profils iOS, VPP. Lab jamf-mobile-devices. Quiz dédié.`,
    ["Enroller iPad pilote ADE", "Créer profil Wi-Fi iOS", "Scope groupe pilote", "Valider connexion Wi-Fi"],
    "Retail 200 iPad — Wi-Fi corporate via profil MDM iOS supervisé."
  ),
  "smart-groups": mod(
    [
      "Smart Groups mettent à jour dynamiquement l'appartenance selon critères inventaire.",
      "Fondamental Jamf 100 pour scope policies, profils et patch policies.",
    ],
    [
      "Critères : OS, apps, EA, site, group membership.",
      "Opérateurs AND/OR ; preview membership obligatoire.",
      "Smart Computer / Mobile / User Groups.",
      "Différence Advanced Search (reporting) vs Smart Group (scope).",
    ],
    [
      "Recalcul à check-in ; critères circulaires = charge serveur.",
      "Exclusions via Static Groups ou critère NOT.",
      "Nested Smart Groups possibles avec prudence.",
    ],
    [
      "New Smart Computer Group → critères OS + app.",
      "Preview membership → compter Mac.",
      "Scope policy pilote → Policy Logs.",
    ],
    [
      "Preview avant production ; nommage SITE-FONCTION-CRITERE.",
      "Éviter critères circulaires entre Smart Groups.",
      "Documenter règle métier dans description groupe.",
    ],
    [
      "Scope production sans preview.",
      "Smart Group circulaire A↔B.",
      "Critère trop large (tous Mac sauf un).",
    ],
    ["Smart Groups = moteur ciblage dynamique. Preview, critères stables, pas de circularité."],
    `Module 6 — Smart Groups. Vidéo pilote Jamf Training Premium.

Scénario 800 Mac : déployer Teams sur Sonoma sans l'app, hors VIP.

Lab jamf-smart-groups. Quiz module 13. Storyboard jamf-smart-groups.`,
    ["Créer Smart Group critères OS+app", "Preview membership", "Scope policy pilote", "Exclure Static VIP"],
    "800 Mac — Smart Group Sonoma sans Teams, exclusion VIP."
  ),
  "static-groups": mod(
    [
      "Static Groups = listes manuelles de Mac, mobile ou users.",
      "Complément Smart Groups : VIP, labo, exclusions, tests.",
    ],
    [
      "Ajout/retrait manuel ou CSV ; pas de recalcul automatique.",
      "Exclusions policies : Static Group LAB ou VIP.",
      "Combinaison Smart scope + Static exclusion = pattern enterprise.",
    ],
    [
      "Static Computer Groups dans Computers → Static Computer Groups.",
      "Membership visible dans fiche Mac → Groups tab.",
      "Utilisé aussi pour permissions Self Service ciblées.",
    ],
    [
      "Créer Static Group VIP-MAC-2024.",
      "Ajouter 3 Mac pilotes manuellement.",
      "Policy scope Smart Group + exclusion Static VIP.",
    ],
    [
      "Static pour exceptions stables (VIP, labo, break-fix).",
      "Revue trimestrielle membership Static Groups.",
      "Ne pas dupliquer Smart Group en Static sans raison.",
    ],
    [
      "Static Group non maintenu → exclusions obsolètes.",
      "Oublier Static exclusion sur policy massive.",
      "Confondre Static et Smart pour reporting.",
    ],
    ["Static Groups = listes manuelles pour VIP/labo/exclusions. Toujours maintenir membership."],
    `Module 7 — Static Groups Jamf Pro 11.16.

Scénario : exclure Mac labo et VIP d'une policy maintenance nocturne.

Lab jamf-static-groups. Quiz quiz-jamf-static-groups.`,
    ["Créer Static Group LAB", "Ajouter Mac labo", "Policy scope Smart + exclusion Static", "Vérifier Policy Logs"],
    "Maintenance nocturne — exclusion Static LAB et VIP."
  ),
  policies: mod(
    [
      "Policies automatisent scripts, packages, maintenance et actions compte.",
      "Triggers et frequency contrôlent quand et combien de fois une policy s'exécute.",
    ],
    [
      "Triggers : Enrollment Complete, Recurring Check-in, Login, Self Service.",
      "Payloads : Scripts, Packages, Maintenance, User Interaction.",
      "Scope Smart/Static ; retrait scope ≠ rollback réglages appliqués.",
      "Policy Logs : succès/échec par Mac.",
    ],
    [
      "Priority numérique pour conflits multi-policies.",
      "Self Service tab expose policy à l'utilisateur.",
      "User Interaction : deferrals, deadlines, messages.",
    ],
    [
      "New Policy → Recurring Check-in → Script payload.",
      "Scope Smart Group → exclusion Static.",
      "Mac pilote : sudo jamf policy → Policy Logs.",
    ],
    [
      "Policy pilote avant généralisation.",
      "Frequency conservative sur Recurring Check-in.",
      "Idempotence scripts avec logs `/var/log/`.",
    ],
    [
      "Enrollment Complete surchargé (trop payloads).",
      "Frequency agressive → charge check-in.",
      "Oublier Restart Options après package.",
    ],
    ["Policies = automation Jamf. Triggers + scope + logs = triptyque opérationnel."],
    `Module 8 — Policies. Vidéo pilote Premium.

Scénario FileVault compliance script hebdomadaire finance.

Lab jamf-policies. Quiz module 14.`,
    ["Policy Recurring Check-in", "Payload Script idempotent", "Scope + exclusions", "Policy Logs Completed"],
    "Conformité FileVault — policy hebdo scope finance."
  ),
  "configuration-profiles": mod(
    [
      "Configuration Profiles transportent payloads MDM Apple signés.",
      "Wi-Fi, VPN, FileVault, restrictions, PPPC — distincts des packages PKG.",
    ],
    [
      "Computers → Configuration Profiles → payloads composables.",
      "Push via APNs ; visible Réglages → Profils sur Mac.",
      "FileVault escrow vers Jamf (Bootstrap Token ADE).",
      "Management History pour conflits profils.",
    ],
    [
      "Profil signé Jamf → commande InstallProfile MDM.",
      "Un profil peut contenir plusieurs payloads.",
      "Removal : unmanage profil ou payload Remove.",
    ],
    [
      "New profil Wi-Fi enterprise + FileVault.",
      "Scope ADE pilote → check-in.",
      "Vérifier Security tab inventaire.",
    ],
    [
      "Un profil par domaine (Wi-Fi, FV) pour faciliter rollback.",
      "Pilote ADE supervisé avant production.",
      "Documenter SSID et certificats dans runbook.",
    ],
    [
      "Deux profils Wi-Fi même SSID.",
      "FileVault sans escrow IT.",
      "Scope production sans pilote.",
    ],
    ["Configuration Profiles = payloads MDM scoped. ≠ packages. Escrow FileVault enterprise."],
    `Module 9 — Configuration Profiles. Vidéo pilote.

Wi-Fi enterprise + FileVault ADE. Lab jamf-discovery. Quiz quiz-jamf-configuration-profiles.`,
    ["Profil Wi-Fi WPA2-Enterprise", "Payload FileVault escrow", "Scope ADE pilote", "Vérifier profils Mac"],
    "Onboarding ADE — Wi-Fi + FileVault escrow dès premier boot."
  ),
  "self-service": mod(
    [
      "Self Service est le portail utilisateur macOS pour apps et ressources IT.",
      "Policies avec trigger Self Service apparaissent dans l'app Self Service.",
    ],
    [
      "App Self Service installée via policy ou ADE.",
      "Branding : logo, couleurs, catégories.",
      "Policies Self Service tab + description UX.",
      "Patch policies : disponibles mais hors recherche Self Service.",
    ],
    [
      "Self Service Mobile pour iOS (distinct macOS).",
      "Notifications macOS pour nouvelles ressources.",
      "Policy logs identiques workflows macOS.",
    ],
    [
      "Policy package → Self Service tab ON.",
      "Self Service app Mac pilote → installer ressource.",
      "Branding Settings → Self Service.",
    ],
    [
      "Descriptions claires utilisateur final.",
      "Catégories par fonction (Productivité, Sécurité).",
      "Tester UX sur Mac non-admin.",
    ],
    [
      "Policy Self Service sans app installée.",
      "Patch policy attendue dans recherche SS (non listée).",
      "Branding non testé dark/light.",
    ],
    ["Self Service = UX utilisateur. Policy tab + branding + catégories."],
    `Module 10 — Self Service. Vidéo pilote.

Catalogue apps finance. Lab jamf-self-service. Quiz quiz-jamf-self-service.`,
    ["Policy Self Service package", "Branding console", "Test app Mac pilote", "Collecter feedback UX"],
    "Catalogue Self Service apps métier — UX testée finance."
  ),
  packages: mod(
    [
      "Packages PKG/DMG déployés via Distribution Points et policy Packages payload.",
      "Workflow : upload DP → enregistrement Jamf → policy Install/Cache.",
    ],
    [
      "Distribution Point : repo packages par site.",
      "Actions : Install, Cache, Uninstall.",
      "Feuille de route : DP accessible, espace disque, signature.",
      "Différence package vs profil MDM.",
    ],
    [
      "Policy Packages payload référence package ID.",
      "Cache met package en local sans install immédiate.",
      "Logs échec : réseau DP, permissions, espace.",
    ],
    [
      "Upload package Chrome PKG sur DP.",
      "Policy Install scoped pilote.",
      "Vérifier installation et Policy Logs.",
    ],
    [
      "Tester DP depuis réseau distant (VPN).",
      "Cache avant rollout massif.",
      "Versionner packages dans nom fichier.",
    ],
    [
      "Package sans DP configuré.",
      "Install sans espace disque check.",
      "Confondre package et profil.",
    ],
    ["Packages = DP + policy Packages. Install/Cache/Uninstall selon scénario."],
    `Module 11 — Packages. Vidéo pilote.

Déploiement Chrome PKG finance. Lab jamf-packages. Quiz quiz-jamf-packages.`,
    ["Upload PKG sur DP", "Policy Install", "Scope pilote", "Policy Logs + app installée"],
    "Déploiement Chrome PKG — DP + policy Install scope finance."
  ),
  scripts: mod(
    [
      "Scripts Bash exécutés via policy Scripts payload sur Mac client.",
      "Variables Jamf, logs et exit codes prouvent l'effet réel.",
    ],
    [
      "Variables : $4 param policy, $loggedInUser, etc.",
      "Exit 0 requis succès ; logs `/var/log/jamf-*.log`.",
      "Idempotence : script safe si re-run.",
      "Policy Logs + fichier témoin local.",
    ],
    [
      "Script stocké Jamf Pro → push policy → `/usr/local/jamf/bin/jamf`.",
      "Extension Attributes script pour inventaire custom.",
    ],
    [
      "Policy Script compliance → logs.",
      "Mac : sudo jamf policy → vérifier log.",
      "Ajuster script si exit non-zero.",
    ],
    [
      "Toujours logger actions et erreurs.",
      "Tester sur Mac pilote non-production.",
      "Fichier témoin + EA pour preuve conformité.",
    ],
    [
      "Exit 0 sans action réelle.",
      "Script non idempotent sur re-run.",
      "Absence logs → impossible support L2.",
    ],
    ["Scripts = automation client. Logs + idempotence + Policy Logs = preuve."],
    `Module 12 — Scripts. Vidéo pilote.

Script conformité avec logs. Lab jamf-scripts. Quiz module 15.`,
    ["Écrire script idempotent", "Policy Scripts payload", "sudo jamf policy", "Analyser logs"],
    "Script conformité — logs locaux + Policy Logs Jamf."
  ),
  "patch-management": mod(
    [
      "Patch Management Jamf automatise mises à jour apps tierces (Chrome, Firefox, etc.).",
      "Software Titles + patch policies + eligible devices preview.",
    ],
    [
      "Catalogue Jamf Software Titles.",
      "Patch policy General : version cible, Patch Unknown Versions.",
      "Eligible list auto-générée ; preview avant scope.",
      "Deadlines force install ; patch SS non searchable.",
    ],
    [
      "Patch dashboard reporting conformité version.",
      "Integration Self Service optionnelle.",
      "Scope Smart Groups identique policies.",
    ],
    [
      "Software Title Chrome → patch policy.",
      "Preview eligible Mac.",
      "Scope + vérifier patch appliqué.",
    ],
    [
      "Preview eligible avant scope production.",
      "Patch Unknown Versions selon politique sécurité.",
      "Communiquer deadlines utilisateurs.",
    ],
    [
      "Scope sans preview eligible.",
      "Mac hors eligible jamais patché (critères General).",
      "Attendre patch policy dans recherche SS.",
    ],
    ["Patch Management = Software Titles + patch policies + eligible preview."],
    `Module 13 — Patch Management. Vidéo pilote.

Chrome patch policy finance. Lab jamf-patch-management. Quiz module 16.`,
    ["Software Title Chrome", "Patch policy + preview", "Scope Smart Group", "Vérifier version app"],
    "Patch Chrome — policy avec preview eligible finance."
  ),
  reporting: mod(
    [
      "Reporting Jamf : Advanced Search, exports et tableaux de bord patch/inventaire.",
      "Distinction reporting ad hoc vs Smart Groups scope.",
    ],
    [
      "Advanced Search : requêtes inventaire sauvegardées.",
      "Exports CSV pour audit conformité.",
      "Patch dashboard pour versions apps.",
      "Policy reporting via logs agrégés.",
    ],
    [
      "Advanced Search ≠ Smart Group.",
      "API REST pour BI externe (Tableau, Power BI).",
      "Scheduled exports via automation externe.",
    ],
    [
      "Advanced Search FileVault off → export CSV.",
      "Patch dashboard Chrome versions.",
      "Sauvegarder recherche pour audit trimestriel.",
    ],
    [
      "Nommer recherches ADV-* pour audit.",
      "Revues trimestrielles exports conformité.",
      "Ne pas scope via Advanced Search.",
    ],
    [
      "Smart Group pour rapport ponctuel.",
      "Export sans champs EA nécessaires.",
      "Confondre Last Check-in et conformité patch.",
    ],
    ["Reporting = Advanced Search + exports + dashboards patch. Pas de scope via Advanced Search."],
    `Module 14 — Reporting Jamf Pro.

Audit FileVault CSV trimestriel. Lab jamf-reporting. Quiz quiz-jamf-reporting.`,
    ["Advanced Search FV off", "Export CSV", "Sauvegarder recherche", "Documenter audit"],
    "Audit trimestriel FileVault — Advanced Search + export CSV."
  ),
  troubleshooting: mod(
    [
      "Dépannage Jamf : Policy Logs, Management History, APNs, ABM, check-in.",
      "Méthode L1→L2 structurée pour policies, profils, packages, enrollment.",
    ],
    [
      "Policy échoue : DP, espace disque, scope, trigger, logs.",
      "Profil bloqué : conflit payload, supervision, certificat.",
      "Enrollment : token ABM, PreStage, APNs push.",
      "Check-in : `sudo jamf policy`, Update Inventory.",
    ],
    [
      "Jamf Pro logs serveur pour erreurs push.",
      "Management History timeline sur fiche Mac.",
      "Smart Group circulaire → perf serveur.",
    ],
    [
      "Policy package Failed → Policy Logs → DP ping.",
      "Profil Wi-Fi → Management History.",
      "APNs cert expiry → Dashboard alert.",
    ],
    [
      "Checklist L1 : scope, logs, check-in, espace disque.",
      "Escalade L2 avec serial + policy ID + logs.",
      "Runbook par scénario (package, profil, enrollment).",
    ],
    [
      "Modifier policy sans lire logs.",
      "Renouveler APNs en urgence sans procédure.",
      "Wipe comme premier réflexe.",
    ],
    ["Troubleshooting = Policy Logs + Management History + check-in + certificats. Runbook L1/L2."],
    `Module 15 — Troubleshooting Jamf Pro.

Scénario package Failed Mac distant. Lab jamf-troubleshooting. Quiz quiz-jamf-troubleshooting.`,
    ["Reproduire échec policy", "Policy Logs + Management History", "Check-list DP/réseau", "Runbook L1 documenté"],
    "Package Failed remote — diagnostic Policy Logs + DP + runbook L1."
  ),
};

export function getJamfPremiumLessonSections(
  moduleId: JamfFundamentalsModuleId
): JamfPremiumLessonSection[] {
  const c = JAMF_FUNDAMENTALS_PREMIUM_CONTENT[moduleId];
  return [
    { title: "Introduction", items: c.introduction },
    { title: "Concepts", items: c.concepts },
    { title: "Architecture", items: c.architecture },
    { title: "Démonstration", items: c.demonstration },
    { title: "Bonnes pratiques", items: c.bestPractices },
    { title: "Erreurs fréquentes", items: c.commonErrors },
    { title: "Résumé", items: c.summary },
  ];
}
