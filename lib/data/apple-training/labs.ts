import type { Lab } from "@/lib/types";

function step(id: string, title: string, instruction: string, expectedResult: string) {
  return { id, title, instruction, expectedResult };
}

function trainingLab(
  slug: string,
  title: string,
  description: string,
  technology: Lab["technology"],
  objectives: string[],
  steps: ReturnType<typeof step>[],
  expectedResult: string
): Lab {
  return {
    slug,
    title,
    description: `${description} Scénario entreprise documenté — aligné Apple Training.`,
    level: "Avancé",
    duration: "60 min",
    technology,
    trackSlug: "apple-it-professional",
    objectives,
    prerequisites: [
      "Organisation ABM lab ou simulation",
      "Tenant Intune ou Jamf Pro",
      "Mac/iPhone test effaçable",
      "Accès admin Entra ID (Platform SSO / MAID)",
    ],
    steps,
    expectedResult,
    objective: objectives[0] ?? title,
  };
}

/** 8 labs Apple Training — ABM, ADE, APNs, Apps & Books, MAID, PSSO, DDM, FileVault */
export const appleTrainingLabs: Lab[] = [
  trainingLab(
    "apple-training-lab-abm",
    "Lab Apple Business Manager",
    "Gouvernance ABM multi-sites : Locations, rôles, domaine, fédération Entra et serveurs MDM.",
    "ABM + Intune",
    [
      "Structurer Locations et rôles moindre privilège",
      "Vérifier domaine et fédération Managed Apple ID",
      "Enregistrer serveurs MDM Production et Staging",
    ],
    [
      step("loc", "Locations", "Créez 3 Emplacements ABM (HQ, EMEA, AMER) avec admins régionaux.", "Locations actives avec admins assignés."),
      step("roles", "Rôles", "Matrice : 2 Administrator, 3 Device Enrollment Manager, 1 Content Manager.", "CSV matrice rôles archivé."),
      step("domain", "Domaine", "Vérifiez domaine @entreprise.com via TXT DNS.", "Domaine Verified dans ABM."),
      step("federation", "Fédération Entra", "Wizard fédération ABM → Microsoft Entra ID. Test 1 MAID.", "MAID créé via Entra sans mot de passe Apple séparé."),
      step("mdm", "Serveurs MDM", "Créez serveurs Intune Production + Jamf Staging, importez tokens .p7m.", "2 serveurs MDM actifs, dates expiration calendrier."),
    ],
    "ABM enterprise opérationnel : gouvernance, identité fédérée, MDM prêt pour ADE."
  ),
  trainingLab(
    "apple-training-lab-ade",
    "Lab Automated Device Enrollment",
    "Profil ADE supervisé, Await Device Configured, pilote 10 Mac zero-touch.",
    "ABM + Intune",
    [
      "Assigner serials au serveur MDM",
      "Créer profil ADE macOS supervisé",
      "Valider first-boot zero-touch sur Mac pilote",
    ],
    [
      step("assign", "Assignation serials", "ABM → Devices → assign bulk au serveur MDM Production.", "Serials assignés, sync MDM OK."),
      step("profile", "Profil ADE", "Intune/Jamf : Supervised, Locked enrollment, Await Device Configured, skip screens.", "Profil ADE publié."),
      step("minimal", "Profils minimaux", "Limitez profils ADE au strict nécessaire (Wi-Fi, compliance).", "Set ADE léger — policies post-enrollment."),
      step("pilot", "Pilote Mac", "Effacez Mac test → Setup Assistant → Remote Management.", "Mac supervisé, check-in MDM < 30 min."),
      step("metrics", "Métriques", "Documentez time-to-productivity et tickets support pilote.", "Rapport go/no-go 95% succès."),
    ],
    "ADE zero-touch validé : supervision, await configured, pilote documenté."
  ),
  trainingLab(
    "apple-training-lab-apns",
    "Lab APNs — certificat push MDM",
    "Création, renouvellement et validation certificat APNs Apple Push Notification service.",
    "APNs + Apple",
    [
      "Créer certificat APNs avec Apple ID entreprise",
      "Importer .pem dans Intune et Jamf",
      "Valider push avec commande test",
    ],
    [
      step("apple-id", "Apple ID entreprise", "Identifiez Apple ID créateur certificat APNs existant (CRITIQUE même ID renouvellement).", "Apple ID documenté vault IT."),
      step("csr", "CSR MDM", "Intune/Jamf → générez CSR, uploadez portal Apple Push Certificates.", "Certificat .pem téléchargé."),
      step("import", "Import MDM", "Importez .pem dans chaque console MDM.", "APNs valide, date expiration > 6 mois."),
      step("test-push", "Test push", "Envoyez Lock ou Sync command à 1 appareil test.", "Commande reçue < 5 min."),
      step("calendar", "Calendrier", "Alertes J-90/J-30/J-7 renouvellement APNs.", "Calendrier ops partagé."),
    ],
    "APNs opérationnel avec renouvellement planifié et push validé."
  ),
  trainingLab(
    "apple-training-lab-apps-books",
    "Lab Apps & Books",
    "Achat licences VPP, assignation MDM, déploiement Required sur flotte pilote.",
    "Apps & Books",
    [
      "Sync token contenu ABM",
      "Acheter et assigner licences app",
      "Déployer app Required via Intune/Jamf",
    ],
    [
      step("token", "Token contenu", "ABM → Apps & Books → sync token vers MDM.", "Token contenu actif."),
      step("purchase", "Achat licences", "Achetez 50 licences Microsoft Teams ou app métier test.", "Licences disponibles ABM."),
      step("assign-mdm", "Assign MDM", "Assignez licences au serveur MDM Production.", "Licences visibles console MDM."),
      step("deploy", "Deploy Required", "Intune/Jamf : app Required au groupe pilote Mac/iOS.", "App installée sans App Store perso."),
      step("audit", "Audit licences", "Rapport licences utilisées vs disponibles.", "Dashboard VPP documenté."),
    ],
    "Apps & Books : licences VPP assignées et app Required déployée."
  ),
  trainingLab(
    "apple-training-lab-managed-apple-ids",
    "Lab Managed Apple IDs",
    "Création MAID, fédération Entra, restrictions et test services iCloud org.",
    "Managed Apple ID",
    [
      "Configurer fédération domaine Entra",
      "Créer utilisateurs MAID pilote",
      "Appliquer restrictions iCloud MDM",
    ],
    [
      step("federation", "Fédération", "ABM → Settings → Accounts → Federated Authentication → Microsoft Entra.", "Fédération active domaine vérifié."),
      step("maid-create", "Création MAID", "Invitez 3 utilisateurs pilote — MAID auto-créés.", "MAID actifs dans ABM People."),
      step("restrict", "Restrictions", "Profil MDM : iCloud Drive off, Notes/Mail org autorisés selon policy.", "Profil restrictions assigné."),
      step("login", "Test login", "Utilisateur pilote se connecte services Apple avec identité Entra.", "SSO MAID fonctionnel."),
      step("support", "Runbook", "Documentez reset mot de passe MAID via Entra admin.", "Runbook helpdesk publié."),
    ],
    "Managed Apple IDs fédérés Entra avec restrictions enterprise."
  ),
  trainingLab(
    "apple-training-lab-platform-sso",
    "Lab Platform SSO",
    "Déploiement Platform SSO macOS avec Entra ID et Intune/Jamf.",
    "Platform SSO",
    [
      "Créer profil Platform SSO MDM",
      "Enregistrer utilisateur pilote",
      "Valider unlock/login et apps M365",
    ],
    [
      step("prereq", "Prérequis", "macOS 14+, Mac supervisé ADE, extension Microsoft installée.", "Mac pilote prêt."),
      step("profile", "Profil PSSO", "Intune → macOS → Device configuration → Platform SSO. Team ID Microsoft.", "Profil PSSO créé."),
      step("assign", "Assignation", "Scope groupe pilote macOS uniquement.", "Profil pending → installed."),
      step("register", "Registration", "Utilisateur pilote : enregistrement Platform SSO au login.", "PSSO registered Entra."),
      step("apps", "Test apps", "Outlook, Teams, Safari — SSO sans re-prompt MFA excessif.", "Expérience SSO documentée."),
    ],
    "Platform SSO opérationnel Mac pilote Entra + MDM."
  ),
  trainingLab(
    "apple-training-lab-ddm",
    "Lab Declarative Device Management",
    "Declarations software update, status reports, migration imperative → declarative.",
    "Jamf Pro",
    [
      "Créer declaration DDM software update",
      "Lire status reports MDM",
      "Planifier migration profils legacy",
    ],
    [
      step("os-check", "OS minimum", "Vérifiez macOS 14+ / iOS 17+ sur pilotes.", "Appareils éligibles DDM."),
      step("declaration", "Declaration", "Intune Settings Catalog DDM ou Jamf declarative management.", "Declaration publiée."),
      step("status", "Status reports", "Console MDM → status channel DDM sur appareil pilote.", "Rapport status reçu."),
      step("enforce", "Enforcement", "Configurez deadline OS update via DDM.", "Policy update visible device."),
      step("migrate", "Migration plan", "Liste profils legacy à migrer vers DDM Q2.", "Roadmap migration documentée."),
    ],
    "DDM pilote actif avec status reports et plan migration."
  ),
  trainingLab(
    "apple-training-lab-filevault",
    "Lab FileVault enterprise",
    "Force encrypt, escrow clé MDM, bootstrap token, procédure recovery helpdesk.",
    "FileVault",
    [
      "Profil FileVault MDM force encrypt",
      "Valider escrow clé Intune/Jamf",
      "Tester procédure recovery ITSM",
    ],
    [
      step("profile", "Profil MDM", "Disk Encryption : Force encrypt ON, escrow enabled, institutional key off.", "Payload FileVault configuré."),
      step("scope", "Scope ADE", "Assignez groupe Mac supervisés ADE uniquement.", "Profil assigned Required."),
      step("encrypt", "Chiffrement", "Mac pilote : FileVault encrypting → encrypted.", "Statut encrypted confirmé."),
      step("escrow", "Escrow", "Console MDM → recovery key visible admin.", "Clé escrow récupérable."),
      step("recovery", "Recovery test", "Simulez ticket helpdesk recovery sur Mac pilote.", "Procédure ITSM validée."),
    ],
    "FileVault enterprise : chiffrement forcé, escrow MDM, recovery documenté."
  ),
];
