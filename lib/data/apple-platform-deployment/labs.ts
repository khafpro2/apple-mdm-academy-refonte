import type { Lab } from "@/lib/types";

function step(id: string, title: string, instruction: string, expectedResult: string) {
  return { id, title, instruction, expectedResult };
}

/** Labs Apple Platform Deployment — scénarios enterprise documentés */
export const applePlatformDeploymentLabs: Lab[] = [
  {
    slug: "abm-enterprise-complete",
    title: "Configuration complète Apple Business Manager",
    description:
      "Lab enterprise GlobalTech : 5 pays, emplacements, rôles, domaine vérifié, serveurs MDM et Apps & Books. Scénario entreprise : 1000 employés, gouvernance multi-sites.",
    level: "Avancé",
    duration: "90 min",
    technology: "ABM + Intune",
    trackSlug: "apple-it-professional",
    objectives: [
      "Structurer 5 Emplacements ABM alignés entités juridiques",
      "Matrice rôles Administrator / Device Enrollment Manager / Content Manager",
      "Vérifier domaine et préparer fédération Entra ID",
      "Enregistrer serveurs MDM Production et Staging",
    ],
    prerequisites: [
      "Organisation ABM avec rôle Administrator",
      "Accès DNS pour enregistrement TXT domaine",
      "Tenant Microsoft Entra ID (lab ou prod)",
      "Environnement MDM Intune ou Jamf de test",
    ],
    steps: [
      step(
        "locations",
        "Créer les 5 Emplacements",
        "ABM → Preferences → Locations. Créez FR, DE, UK, US, CA avec admins régionaux documentés.",
        "5 Locations visibles avec au moins 1 admin chacune."
      ),
      step(
        "roles",
        "Matrice rôles",
        "Assignez Administrator (2), Device Enrollment Manager (5), Content Manager (1), People Manager (1). Export CSV matrice.",
        "Matrice rôles × personnes archivée ITSM."
      ),
      step(
        "domain",
        "Vérifier domaine",
        "Settings → Accounts → Domains. Ajoutez @globaltech-lab.com, publiez TXT DNS, validez.",
        "Domaine « Verified » dans ABM."
      ),
      step(
        "federation",
        "Préparer fédération Entra",
        "Configurez fédération Microsoft Entra (wizard ABM). Testez 1 utilisateur pilote MAID.",
        "Utilisateur Entra → MAID créé sans mot de passe Apple séparé."
      ),
      step(
        "mdm-servers",
        "Serveurs MDM",
        "Créez « Intune Production » et « Jamf Staging ». Téléchargez tokens .p7m, importez dans MDM.",
        "2 serveurs actifs, dates expiration calendrier IT."
      ),
      step(
        "apps-books",
        "Apps & Books pilote",
        "Achetez 10 licences app test, assignez au serveur MDM Production, sync token contenu.",
        "App visible catalogue MDM avec licences disponibles."
      ),
      step(
        "assign-test",
        "Assignation appareil test",
        "Assignez 1 serial test au serveur Production. Vérifiez inventaire MDM sous 24 h.",
        "Serial visible ABM + MDM avec assignation correcte."
      ),
    ],
    expectedResult:
      "ABM multi-sites opérationnel : Locations, rôles, domaine, fédération, MDM et VPP pilote documentés.",
    objective:
      "Déployer une gouvernance ABM enterprise complète pour organisation 1000 employés / 5 pays — runbook ITSM livré.",
  },
  {
    slug: "ade-zero-touch-500",
    title: "ADE zero-touch — rollout 500 MacBook",
    description:
      "Lab LogiCorp : commande 500 MacBook M4, profil ADE supervisé, pilote 50 puis production. Scénario entreprise : déploiement zero-touch 6 semaines.",
    level: "Avancé",
    duration: "120 min",
    technology: "ABM + Intune",
    trackSlug: "apple-it-professional",
    objectives: [
      "Assigner serials bulk au serveur MDM",
      "Créer profil ADE macOS supervisé avec Await Device Configured",
      "Piloter 50 Mac et mesurer time-to-productivity",
      "Documenter runbook first-boot utilisateur",
    ],
    prerequisites: [
      "ABM configuré avec inventaire serials (simulation CSV OK)",
      "Intune tenant avec certificat APNs valide",
      "Mac test effaçable ou VM macOS lab",
    ],
    steps: [
      step(
        "bulk-assign",
        "Assignation bulk ABM",
        "ABM → Devices → import CSV 500 serials (ou 10 lab) → Assign to MDM « Intune Production ».",
        "Serials assignés, sync Intune déclenchée."
      ),
      step(
        "ade-profile",
        "Profil ADE macOS",
        "Intune → Devices → Apple → Apple enrollment → Enrollment program tokens → Profiles. Supervised, Locked, Await configured, skip screens.",
        "Profil ADE « LogiCorp Mac » publié."
      ),
      step(
        "compliance",
        "Compliance FileVault",
        "Créez policy FileVault ON + scope groupe ADE-Mac-Pilot.",
        "Policy assignée groupe pilote."
      ),
      step(
        "pilot-50",
        "Pilote 50 Mac",
        "Effacez 1 Mac test, passez Setup Assistant. Vérifiez Remote Management, supervision, FileVault escrow.",
        "Mac supervisé, check-in < 30 min, clé escrow MDM."
      ),
      step(
        "apps-required",
        "Apps Required VPP",
        "Assignez Teams/Company Portal Required au groupe pilote. Vérifiez install silencieuse.",
        "Apps installées sans App Store perso."
      ),
      step(
        "metrics",
        "Métriques rollout",
        "Tableau : time-to-productivity, tickets support, % succès. Seuil go/no-go 95 %.",
        "Rapport pilote prêt pour rollout 450 Mac."
      ),
      step(
        "runbook",
        "Runbook utilisateur",
        "Rédigez fiche : Allumer → Wi-Fi → Entra ID → attendre apps. Helpdesk FAQ.",
        "Runbook publié intranet + ticket template."
      ),
    ],
    expectedResult:
      "Chaîne ADE zero-touch validée : profil supervisé, compliance, apps Required, métriques pilote et runbook utilisateur.",
    objective:
      "Industrialiser ADE pour 500 MacBook — pilote 50 appareils validé avant production LogiCorp.",
  },
];
