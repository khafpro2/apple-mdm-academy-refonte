import type { Question } from "@/lib/types";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Questions alignées Microsoft Learn — scénarios, dépannage, architecture Intune Apple */
export const intuneLearnExamQuestions: Question[] = [
  q(
    "il-01",
    "Scénario : les commandes MDM Intune ne parviennent pas aux iPhone. Première vérification :",
    ["Renouveler le token ABM", "Certificat Apple MDM Push (APNs) actif dans Intune", "Supprimer Company Portal", "Réinstaller macOS"],
    1,
    "Sans APNs valide, Intune ne peut pas réveiller les appareils pour check-in MDM."
  ),
  q(
    "il-02",
    "Renouveler le certificat APNs avec un Apple ID différent du certificat initial :",
    ["Est recommandé par Microsoft", "Force à recréer le certificat depuis zéro", "N'a aucun impact", "Désactive FileVault"],
    1,
    "Le renouvellement APNs doit utiliser le même Apple ID entreprise que le certificat existant."
  ),
  q(
    "il-03",
    "L'Enrollment Program Token (.p7m) expire typiquement après :",
    ["7 jours", "30 jours", "1 an", "Jamais"],
    2,
    "Le token serveur ABM doit être renouvelé annuellement dans ABM et réimporté dans Intune."
  ),
  q(
    "il-04",
    "Scénario : Mac neuf ABM affiche Remote Management mais n'apparaît pas dans Intune. Cause probable :",
    ["FileVault désactivé", "Synchronisation token ABM non effectuée ou appareil non assigné au serveur MDM", "Defender absent", "Platform SSO actif"],
    1,
    "L'appareil doit être assigné au serveur MDM dans ABM et le token synchronisé dans Intune."
  ),
  q(
    "il-05",
    "Automated Device Enrollment (ADE) permet principalement :",
    ["Enrollment manuel utilisateur uniquement", "Enrollment zero-touch supervisé pour appareils ABM", "Jailbreak assisté", "Désactivation MDM par l'utilisateur"],
    1,
    "ADE inscrit automatiquement les appareils assignés dans ABM avec supervision."
  ),
  q(
    "il-06",
    "Dans Intune, les profils de configuration macOS se créent sous :",
    ["Apps > macOS", "Devices > Configuration profiles > macOS", "Tenant administration > Connectors", "Reports > Device compliance"],
    1,
    "Device configuration > Configuration profiles, platform macOS."
  ),
  q(
    "il-07",
    "Une compliance policy macOS peut exiger :",
    ["Wallpaper spécifique uniquement", "FileVault activé et version OS minimale", "Nom iCloud", "Langue clavier"],
    1,
    "Compliance vérifie état sécurité : chiffrement, OS, jailbreak/root, Defender, etc."
  ),
  q(
    "il-08",
    "Conditional Access consomme l'état de conformité Intune via :",
    ["APNs directement", "Connecteur Intune dans Entra ID (compliance state)", "Apple Business Manager", "VPP token"],
    1,
    "Entra ID reçoit compliant/non compliant depuis Intune pour les décisions CA."
  ),
  q(
    "il-09",
    "Avant d'activer une policy Conditional Access en production, Microsoft recommande :",
    ["Enforcement immédiat pour tous", "Mode report-only puis analyse sign-in logs", "Désactiver MFA", "Supprimer break-glass accounts"],
    1,
    "Report-only permet de simuler l'impact sans bloquer les utilisateurs."
  ),
  q(
    "il-10",
    "Platform SSO macOS requiert typiquement :",
    ["macOS 10.12", "macOS 14+ et extension Enterprise SSO déployée via Intune", "iPhone supervisé", "Certificat SCEP uniquement"],
    1,
    "Platform SSO nécessite macOS récent et profil MDM Platform SSO avec extension Microsoft."
  ),
  q(
    "il-11",
    "Microsoft Defender for Endpoint sur Mac s'onboarde via Intune dans :",
    ["Apps > iOS store", "Endpoint security > Microsoft Defender ATP > macOS onboarding", "Enrollment > Apple", "Compliance > iOS"],
    1,
    "Endpoint security policies déploient le package onboarding Defender."
  ),
  q(
    "il-12",
    "App Protection Policies (MAM) protègent :",
    ["Le disque entier sans enrollment", "Les données dans les apps Microsoft même sur appareil non géré", "APNs uniquement", "Le token ABM"],
    1,
    "MAM contrôle copier/coller, PIN, chiffrement dans Outlook/Teams sans MDM complet."
  ),
  q(
    "il-13",
    "Scénario : profil Wi-Fi Intune reste Pending sur iPhone. Action de dépannage :",
    ["Renouveler ABM token", "Vérifier APNs, sync appareil, conflit payload et supervision requise", "Effacer Entra ID", "Désactiver CA"],
    1,
    "Pending = souvent offline, conflit, OS incompatible ou payload non supporté sans supervision."
  ),
  q(
    "il-14",
    "Locked Enrollment dans un profil ADE signifie :",
    ["L'utilisateur peut retirer MDM librement", "L'utilisateur ne peut pas retirer la gestion MDM", "FileVault est désactivé", "APNs est optionnel"],
    1,
    "Locked enrollment empêche l'utilisateur de supprimer le profil MDM."
  ),
  q(
    "il-15",
    "FileVault recovery key escrow Intune permet :",
    ["Récupérer la clé de déchiffrement depuis la console Intune", "Bypass Activation Lock ABM", "Renouveler APNs", "Sync VPP"],
    0,
    "Intune peut stocker la recovery key FileVault pour support IT."
  ),
  q(
    "il-16",
    "VPP / Apps & Books licences doivent être assignées dans ABM à :",
    ["L'utilisateur final uniquement", "Le serveur MDM Intune", "Apple Developer Portal", "Entra ID connector"],
    1,
    "Les licences VPP assignées au MDM server sont synchronisées avec Intune."
  ),
  q(
    "il-17",
    "Scénario : utilisateur Mac conforme bloqué par CA. Vérifier en priorité :",
    ["Couleur du MacBook", "Sign-in logs Entra + délai evaluation compliance Intune (jusqu'à 4h)", "Version Safari", "Modèle clavier"],
    1,
    "Compliance peut mettre jusqu'à 4h à évaluer ; sign-in logs montrent la raison du blocage."
  ),
  q(
    "il-18",
    "Await Device Configured dans profil ADE macOS :",
    ["Accélère Setup Assistant", "Retarde fin setup jusqu'à application profils Intune", "Désactive supervision", "Remplace APNs"],
    1,
    "Await Device Configured garde Setup Assistant ouvert jusqu'à configuration MDM."
  ),
  q(
    "il-19",
    "Pour lier ABM à Intune, l'ordre correct est :",
    [
      "Importer APNs → créer serveur MDM ABM → upload token",
      "Créer serveur MDM ABM avec clé Intune → download token → import Intune → APNs",
      "Enrollment utilisateur → token ABM",
      "Defender → ABM",
    ],
    1,
    "Chaîne : serveur MDM ABM, token .p7m, import Intune, certificat APNs."
  ),
  q(
    "il-20",
    "Device configuration status Failed dans Intune indique :",
    ["Succès complet", "Erreur payload ou conflit — consulter per-setting error", "Appareil compliant", "Token ABM valide 10 ans"],
    1,
    "Failed requiert analyse détail profil sur la fiche appareil."
  ),
  q(
    "il-21",
    "Supervised iOS devices permettent :",
    ["Restrictions MDM avancées et install silencieux VPP", "Retrait MDM par utilisateur", "Pas de profils", "APNs optionnel"],
    0,
    "Supervision débloque payloads et déploiement app silencieux."
  ),
  q(
    "il-22",
    "Microsoft Intune admin center URL :",
    ["portal.azure.com uniquement", "endpoint.microsoft.com", "business.apple.com", "jamfcloud.com"],
    1,
    "Le portail unifié Endpoint Manager est endpoint.microsoft.com."
  ),
  q(
    "il-23",
    "Scénario : token ABM expiré. Impact :",
    ["Tous les Mac effacés", "Nouveaux enrollments ADE bloqués ; appareils déjà gérés restent", "APNs invalidé", "Entra ID supprimé"],
    1,
    "Token expiré bloque nouveaux enrollments, pas les appareils déjà inscrits."
  ),
  q(
    "il-24",
    "Defender macOS status Not healthy peut être causé par :",
    ["FileVault on", "Full Disk Access non accordé à l'agent Defender", "Token ABM valide", "Platform SSO"],
    1,
    "L'agent Defender requiert permissions système (FDA) sur macOS."
  ),
  q(
    "il-25",
    "Managed Apple ID fédéré Entra ID permet :",
    ["App Store personnel complet", "Connexion MAID via SSO entreprise", "Désactivation APNs", "Enrollment Android"],
    1,
    "Fédération ABM-Entra synchronise identités pour Managed Apple IDs."
  ),
];

/** Questions quiz module 11 — scénarios additionnels */
export const intuneModule11QuizQuestions: Question[] = [
  q(
    "m11-il-01",
    "Architecture : Intune envoie commande MDM à iPhone via :",
    ["Email SMTP", "Apple Push Notification service (APNs)", "Bluetooth", "AirDrop"],
    1,
    "Chaîne standard MDM Apple : serveur → APNs → appareil."
  ),
  q(
    "m11-il-02",
    "Dépannage : « Device not found » après sync ABM. Vérifier :",
    ["Serial assigné au bon serveur MDM dans ABM", "Couleur boîtier", "iCloud photos", "Safari version"],
    0,
    "L'assignation serveur MDM dans ABM est requise avant sync Intune."
  ),
  q(
    "m11-il-03",
    "Bonnes pratiques : séparation profils ADE iOS et macOS car :",
    ["Apple l'interdit sinon", "Options Setup Assistant et payloads diffèrent par plateforme", "APNs est différent", "VPP ne fonctionne pas"],
    1,
    "Profils ADE platform-specific évitent erreurs configuration."
  ),
  q(
    "m11-il-04",
    "Compliance + CA : appareil Non compliant accès Outlook. Comportement attendu :",
    ["Accès autorisé", "Accès bloqué si CA exige compliant device", "APNs renouvelé", "MDM retiré"],
    1,
    "CA grant control require compliant device bloque les non conformes."
  ),
  q(
    "m11-il-05",
    "Où importer le certificat .pem APNs dans Intune ?",
    ["Apps > macOS", "Devices > Enrollment > Apple > Apple MDM Push Certificate", "Compliance policies", "Scripts"],
    1,
    "Chemin documenté Microsoft Learn pour APNs."
  ),
];
