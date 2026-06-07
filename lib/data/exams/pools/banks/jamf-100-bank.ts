import type { Question } from "@/lib/types";
import { buildExamBank, type ExamBankInput } from "./exam-bank-builder";

const JAMF100_BANK_INPUTS: ExamBankInput[] = [
  // ── interface (10) ──────────────────────────────────────────────────────────
  {
    id: "j100-ui01",
    domain: "interface",
    difficulty: "easy",
    text: "Un nouvel administrateur Jamf rejoint l'équipe IT de GlobalRetail. Où consulte-t-il en priorité l'état global du parc (enrollment, politiques en erreur, certificats) ?",
    correct: "Dashboard Jamf Pro sur la page d'accueil",
    distractors: [
      "Console Apple Business Manager uniquement",
      "Application Self Service sur un Mac pilote",
      "Portail de support Jamf Community",
    ],
    explanation:
      "Le Dashboard Jamf Pro agrège les indicateurs clés : appareils gérés, statuts d'enrollment, alertes certificats et activité récente. C'est le point d'entrée standard pour un admin débutant.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui02",
    domain: "interface",
    difficulty: "easy",
    text: "Dans Jamf Pro, la section « Computers » permet principalement de :",
    correct: "Lister, rechercher et ouvrir la fiche détaillée de chaque Mac géré",
    distractors: [
      "Créer des certificats APNs pour le serveur",
      "Gérer les comptes administrateurs du portail Jamf Account",
      "Configurer les tokens Apps & Books dans ABM",
    ],
    explanation:
      "L'inventaire Computers centralise la vue opérationnelle sur les Mac : serial, OS, utilisateur, groupes, profils et logs. C'est la base de la gestion quotidienne.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui03",
    domain: "interface",
    difficulty: "medium",
    text: "Une filiale européenne et la maison mère partagent un même Jamf Pro avec des policies distinctes. Quel objet Jamf isole leurs configurations respectives ?",
    correct: "Sites — chaque entité possède son site avec scope et admins dédiés",
    distractors: [
      "Static Groups nommés par pays sans notion de Site",
      "Distribution Points partagés sans segmentation",
      "Un seul compte admin global pour toute l'organisation",
    ],
    explanation:
      "Les Sites segmentent l'infrastructure multi-tenant : policies, profils, groupes et droits RBAC peuvent être limités à un site. Indispensable pour MSP et grandes entreprises.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui04",
    domain: "interface",
    difficulty: "medium",
    text: "Un technicien niveau 1 doit consulter les logs d'exécution d'une policy sans modifier sa configuration. Quel onglet ouvre-t-il sur la fiche policy ?",
    correct: "Policy Logs — historique des exécutions par appareil et statut",
    distractors: [
      "General — pour changer le trigger d'exécution",
      "Scope — pour retirer des Smart Groups",
      "Maintenance — pour supprimer définitivement la policy",
    ],
    explanation:
      "Policy Logs affiche succès, échecs et détails par Mac sans risque de modification accidentelle. C'est l'outil de diagnostic de premier niveau après un déploiement.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-ui05",
    domain: "interface",
    difficulty: "medium",
    text: "Le rôle RBAC « Auditor » doit voir l'inventaire et les rapports sans créer de policies. Quelle action configure correctement ce profil dans Jamf Pro ?",
    correct: "Accorder les privilèges Read sur Computers, Mobile Devices et Reports ; refuser Create/Update sur Policies",
    distractors: [
      "Donner le rôle Full Access puis retirer manuellement chaque policy",
      "Créer un compte local macOS sur chaque Mac géré",
      "Désactiver l'authentification SAML pour simplifier l'accès",
    ],
    explanation:
      "Jamf Pro RBAC permet un contrôle granulaire par ressource et action. Un auditeur reçoit Read sans droits d'écriture sur les objets de déploiement.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui06",
    domain: "interface",
    difficulty: "medium",
    text: "Où un administrateur configure le lien SAML avec Entra ID pour l'authentification des admins Jamf Pro ?",
    correct: "Settings → System Settings → Single Sign-On",
    distractors: [
      "Computers → Extension Attributes → LDAP",
      "Configuration Profiles → Payload SSO macOS",
      "Self Service → Branding → Identity Provider",
    ],
    explanation:
      "L'authentification admin SAML se configure dans System Settings, distincte du Platform SSO utilisateur déployé via profils MDM.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui07",
    domain: "interface",
    difficulty: "hard",
    text: "Un MSP gère 40 clients sur une instance Jamf Pro. Un admin client ne doit voir que son site. Quelle combinaison garantit l'isolation ?",
    correct: "Compte admin limité au Site client + rôle sans accès aux autres sites",
    distractors: [
      "Smart Group par client sans restriction de Site",
      "Filtrage manuel dans la recherche Computers à chaque connexion",
      "Création d'une instance Jamf Pro séparée par client obligatoire",
    ],
    explanation:
      "Sites + RBAC site-scoped empêchent un admin client d'accéder aux objets d'un autre tenant. Les Smart Groups seuls ne filtrent pas l'interface admin.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui08",
    domain: "interface",
    difficulty: "easy",
    text: "La section « Mobile Devices » de Jamf Pro concerne principalement :",
    correct: "iPhone et iPad supervisés gérés via MDM",
    distractors: [
      "Téléphones Android enrollés via Work Profile",
      "MacBook Pro uniquement",
      "Serveurs Linux virtualisés",
    ],
    explanation:
      "Mobile Devices regroupe l'inventaire iOS/iPadOS supervisé : profils, apps VPP, PreStage mobile et commandes MDM Apple.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui09",
    domain: "interface",
    difficulty: "hard",
    text: "Après migration vers Jamf Cloud, l'équipe cherche l'URL d'API REST. Où la trouve-t-elle dans l'interface ?",
    correct: "Settings → System Settings → Jamf Pro URL — base URL du tenant cloud",
    distractors: [
      "Distribution Points → Cloud Distribution Point settings",
      "Policies → General → API endpoint field",
      "Self Service → Advanced → REST toggle",
    ],
    explanation:
      "L'URL Jamf Pro (cloud ou on-prem) est documentée dans System Settings. Les appels API utilisent https://{url}/api avec token ou compte dédié.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ui10",
    domain: "interface",
    difficulty: "medium",
    text: "Un admin souhaite exporter la liste des Mac avec macOS obsolète pour un comité de direction. Quelle fonctionnalité Jamf utilise-t-il sans créer de déploiement ?",
    correct: "Advanced Search avec critères OS Version, puis export CSV",
    distractors: [
      "Policy Recurring Check-in avec script de rapport",
      "Configuration Profile payload Restrictions",
      "Renouvellement du certificat APNs",
    ],
    explanation:
      "Advanced Search permet des requêtes inventaire complexes et l'export CSV/PDF pour reporting. Pas besoin de policy pour un simple rapport.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },

  // ── inventory (10) ──────────────────────────────────────────────────────────
  {
    id: "j100-inv01",
    domain: "inventory",
    difficulty: "easy",
    text: "Quelle action force un Mac à renvoyer immédiatement son inventaire complet à Jamf Pro ?",
    correct: "Inventory Update depuis la fiche ordinateur ou une policy Maintenance",
    distractors: [
      "Suppression et recréation du certificat APNs",
      "Réinstallation de macOS en mode Recovery",
      "Retrait du Mac de tous les Static Groups",
    ],
    explanation:
      "Inventory Update déclenche un check-in MDM complet : hardware, apps, profils, extension attributes. Utile après changement manuel ou dépannage.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv02",
    domain: "inventory",
    difficulty: "easy",
    text: "Les Extension Attributes (EA) servent principalement à :",
    correct: "Enrichir l'inventaire avec des données custom (script, LDAP, API) utilisables dans les Smart Groups",
    distractors: [
      "Remplacer les Configuration Profiles Wi-Fi",
      "Signer les packages .pkg avant déploiement",
      "Renouveler automatiquement le token ABM",
    ],
    explanation:
      "Les EA stockent des valeurs dynamiques ou statiques par appareil. Ils alimentent critères Smart Groups, policies et rapports avancés.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv03",
    domain: "inventory",
    difficulty: "medium",
    text: "Un EA de type Script s'exécute à chaque inventaire. Le script retourne une valeur vide sur 200 Mac. Première vérification ?",
    correct: "Policy Logs et jamf.log local — droits d'exécution, chemin script, exit code",
    distractors: [
      "Regénérer le certificat push APNs",
      "Convertir le Static Group en Smart Group",
      "Désactiver FileVault sur les postes concernés",
    ],
    explanation:
      "Un EA script dépend du framework Jamf sur le Mac, des permissions et du contenu du script. Les logs locaux et Policy Logs identifient l'échec.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv04",
    domain: "inventory",
    difficulty: "medium",
    text: "Advanced Search diffère d'un Smart Group car :",
    correct: "Advanced Search sert au reporting et export ; Smart Group sert au scope et déploiement dynamique",
    distractors: [
      "Advanced Search ne peut pas filtrer sur la version macOS",
      "Smart Group ne se met jamais à jour automatiquement",
      "Advanced Search remplace les Configuration Profiles",
    ],
    explanation:
      "Jamf distingue clairement reporting (Advanced Search) et ciblage opérationnel (Smart Groups). Les critères peuvent être similaires mais l'usage diffère.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv05",
    domain: "inventory",
    difficulty: "medium",
    text: "Le champ « Last Check-in » d'un Mac indique il y a 45 jours. L'appareil est allumé et en ligne. Cause probable ?",
    correct: "Framework Jamf corrompu, profil MDM retiré ou Mac hors scope management",
    distractors: [
      "Expiration normale du certificat APNs dans 45 jours",
      "Smart Group en recalcul circulaire",
      "Package en cache sur le Distribution Point",
    ],
    explanation:
      "Un Mac en ligne devrait check-in régulièrement. Un écart de 45 jours signale souvent profil MDM absent, agent Jamf défaillant ou désenrollment partiel.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv06",
    domain: "inventory",
    difficulty: "hard",
    text: "L'équipe RH fournit le département via LDAP. Quel type d'Extension Attribute récupère cette donnée sans script local ?",
    correct: "Extension Attribute de type LDAP Mapping lié au attribut directory",
    distractors: [
      "Extension Attribute String saisi manuellement par l'utilisateur",
      "Payload Restrictions dans un Configuration Profile",
      "Static Group mis à jour chaque semaine par un technicien",
    ],
    explanation:
      "Jamf peut mapper des attributs LDAP/AD vers l'inventaire pour alimenter Smart Groups (ex. département, site, cost center) sans script sur chaque Mac.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv07",
    domain: "inventory",
    difficulty: "medium",
    text: "Sur la fiche d'un Mac, l'onglet « Applications » affiche :",
    correct: "Les applications inventoriées localement avec version et chemin d'installation",
    distractors: [
      "Uniquement les apps VPP assignées depuis ABM",
      "Les policies Jamf en attente d'exécution",
      "Les certificats APNs du serveur Jamf Pro",
    ],
    explanation:
      "L'inventaire applications provient du scan local Jamf (apps dans /Applications, etc.). Distinct des apps MDM/VPP gérées via profils ou policies.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv08",
    domain: "inventory",
    difficulty: "easy",
    text: "Quelle information hardware est typiquement disponible dans l'inventaire Jamf d'un MacBook ?",
    correct: "Numéro de série, modèle, capacité RAM, version macOS et numéro de build",
    distractors: [
      "Mot de passe FileVault de l'utilisateur",
      "Clé privée du certificat APNs serveur",
      "Historique complet des achats App Store personnel",
    ],
    explanation:
      "Jamf collecte les métadonnées hardware et OS standard via MDM et l'agent. Les secrets (FileVault key, clés privées) ne sont pas exposés en clair.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },
  {
    id: "j100-inv09",
    domain: "inventory",
    difficulty: "hard",
    text: "Deux Smart Groups utilisent chacun l'appartenance à l'autre comme critère. Symptôme serveur ?",
    correct: "Recalculs circulaires prolongés et charge CPU élevée sur Jamf Pro",
    distractors: [
      "Expiration immédiate du certificat APNs",
      "Désinstallation automatique de Self Service",
      "Révocation des licences VPP",
    ],
    explanation:
      "Jamf met en garde contre les dépendances circulaires entre Smart Groups. Cela provoque des boucles de recalcul impactant les performances serveur.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-inv10",
    domain: "inventory",
    difficulty: "medium",
    text: "Un admin crée une recherche « Mac avec less than 20 % disk space ». Comment automatiser une alerte sans policy de déploiement ?",
    correct: "Smart Group critère espace disque + notification email Jamf ou intégration webhook",
    distractors: [
      "Configuration Profile payload Disk Encryption uniquement",
      "Renouvellement du token DEP dans ABM",
      "Static Group mis à jour manuellement chaque matin",
    ],
    explanation:
      "Smart Group sur critère inventaire + alertes Jamf (ou SIEM via API) permettent la surveillance proactive. Une policy n'est pas requise pour l'alerte seule.",
    relatedModuleSlug: "jamf-100/inventaire-recherche",
  },

  // ── enrollment (10) ─────────────────────────────────────────────────────────
  {
    id: "j100-enr01",
    domain: "enrollment",
    difficulty: "easy",
    text: "Pour un déploiement zero-touch de Mac neufs via ADE, où assigne-t-on les serials au serveur Jamf ?",
    correct: "Apple Business Manager → Devices → assigner au MDM server Jamf",
    distractors: [
      "Jamf Pro → Computers → Add by serial manuellement uniquement",
      "Self Service → Enroll This Mac sur le poste utilisateur",
      "Distribution Point → Upload serial list CSV",
    ],
    explanation:
      "ADE requiert l'assignation ABM des appareils au serveur MDM Jamf avant la première activation. Le Mac s'enroll automatiquement au Setup Assistant.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr02",
    domain: "enrollment",
    difficulty: "easy",
    text: "Un Computer PreStage Enrollment sert à :",
    correct: "Automatiser la configuration initiale des Mac ADE (profils, comptes, policies au premier boot)",
    distractors: [
      "Sauvegarder Time Machine vers Jamf Cloud",
      "Remplacer le certificat APNs du serveur",
      "Gérer les licences Microsoft 365",
    ],
    explanation:
      "PreStage définit le workflow d'enrollment ADE : profils, scope, comptes admin locaux, Skip Setup panes et policies immédiates.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr03",
    domain: "enrollment",
    difficulty: "medium",
    text: "Option « Await Device Configuration » sur un PreStage signifie :",
    correct: "Le Setup Assistant reste bloqué jusqu'à ce que Jamf termine les policies/profils assignés",
    distractors: [
      "L'utilisateur peut utiliser le Mac immédiatement sans profils",
      "Le Mac ne rejoint jamais le domaine Active Directory",
      "ADE est désactivé pour ces appareils",
    ],
    explanation:
      "Await Device Configuration retarde l'accès bureau jusqu'à fin du provisioning MDM — essentiel pour garantir conformité avant remise à l'utilisateur.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr04",
    domain: "enrollment",
    difficulty: "medium",
    text: "Le token MDM (server_token.p7m) entre ABM et Jamf expire. Symptôme typique ?",
    correct: "Les nouveaux appareils ADE n'apparaissent plus dans Jamf après sync ABM",
    distractors: [
      "Tous les Mac existants perdent FileVault instantanément",
      "Self Service affiche une page blanche",
      "Les Smart Groups se vident automatiquement",
    ],
    explanation:
      "Un token ABM expiré rompt la synchronisation inventaire ADE. Les appareils déjà enrollés restent gérés ; seuls les nouveaux flux ADE sont impactés.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr05",
    domain: "enrollment",
    difficulty: "medium",
    text: "Un Mac reconditionné doit être re-enrollé via ADE. Prérequis côté Apple ?",
    correct: "Release device from ABM si nécessaire, puis re-assignation au MDM server Jamf",
    distractors: [
      "Créer un nouveau certificat APNs avec un Apple ID différent",
      "Désinstaller Jamf Pro Server on-prem vers Cloud",
      "Convertir le Mac en Static Group avant wipe",
    ],
    explanation:
      "Le workflow reconditionnement passe par effacement, statut ABM (Release si hors org) et réassignation MDM pour un nouvel enrollment ADE propre.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr06",
    domain: "enrollment",
    difficulty: "hard",
    text: "Mobile Device PreStage s'applique à :",
    correct: "iPhone et iPad supervisés enrollés via ADE avec configuration automatisée",
    distractors: [
      "MacBook Pro Intel uniquement",
      "Appareils Android via Google Workspace",
      "Apple TV non supervisés en mode manuel",
    ],
    explanation:
      "Mobile PreStage configure iOS/iPadOS supervisés à l'activation : profils, apps, Skip Setup, supervision flags — équivalent mobile du Computer PreStage.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr07",
    domain: "enrollment",
    difficulty: "medium",
    text: "Enrollment manuel par invitation URL convient surtout pour :",
    correct: "Mac BYOD ou cas ponctuels hors ADE avec profil MDM téléchargé par l'utilisateur",
    distractors: [
      "Flotte de 5 000 Mac neufs zero-touch",
      "Renouvellement certificat APNs serveur",
      "Configuration Distribution Point cloud",
    ],
    explanation:
      "L'invitation user-initiated complète l'ADE pour BYOD ou exceptions. À grande échelle, ADE/PreStage reste le standard enterprise.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr08",
    domain: "enrollment",
    difficulty: "easy",
    text: "Automated Device Enrollment (ADE) exige que l'appareil soit :",
    correct: "Enregistré dans ABM/ASM et assigné à un serveur MDM",
    distractors: [
      "Lié à un Apple ID personnel iCloud",
      "Rootless désactivé (SIP off)",
      "Membre d'un Static Group Jamf avant unboxing",
    ],
    explanation:
      "ADE (ex-DEP) repose sur l'inventaire ABM et l'assignation MDM. Sans cette chaîne, seul l'enrollment manuel ou Configurator est possible.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr09",
    domain: "enrollment",
    difficulty: "hard",
    text: "Un Mac ADE affiche « Remote Management » au Setup Assistant mais n'apparaît pas dans Jamf. Vérification prioritaire ?",
    correct: "Serial assigné au bon MDM server dans ABM et token ABM valide côté Jamf",
    distractors: [
      "Smart Group critères incorrects",
      "Package cache corrompu sur Distribution Point",
      "Self Service branding manquant",
    ],
    explanation:
      "Remote Management confirme qu'un MDM est assigné ABM. Si Jamf ne voit pas l'appareil, l'assignation MDM ou le token/sync ABM est en cause.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-enr10",
    domain: "enrollment",
    difficulty: "medium",
    text: "Lors du PreStage, « Custom Package » permet de :",
    correct: "Déployer un .pkg ou .dmg spécifique pendant la phase d'enrollment initial",
    distractors: [
      "Modifier le certificat APNs Apple Push",
      "Créer un compte Apple Business Manager",
      "Remplacer les Smart Groups par des Static Groups",
    ],
    explanation:
      "Custom Package dans PreStage installe un logiciel dès le premier boot (agent interne, VPN client, etc.) avant les policies récurrentes.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },

  // ── smart-groups (15) ───────────────────────────────────────────────────────
  {
    id: "j100-sg01",
    domain: "smart-groups",
    difficulty: "easy",
    text: "Un Smart Group se distingue d'un Static Group car :",
    correct: "L'appartenance se met à jour automatiquement selon les critères d'inventaire définis",
    distractors: [
      "Il ne peut contenir que des iPhone",
      "Il remplace les Configuration Profiles",
      "Il doit être recréé manuellement chaque semaine",
    ],
    explanation:
      "Les Smart Groups évaluent dynamiquement critères OS, apps, EA, appartenance à d'autres groupes. Idéal pour scope policies sans maintenance manuelle.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg02",
    domain: "smart-groups",
    difficulty: "easy",
    text: "Critère « Operating System Version greater than 14.0 » dans un Smart Group cible :",
    correct: "Tous les Mac dont la version macOS inventoriée dépasse 14.0",
    distractors: [
      "Uniquement les Mac avec FileVault activé",
      "Les serveurs Windows avec agent Jamf",
      "Les iPad non supervisés",
    ],
    explanation:
      "Les critères OS sont standards pour cibler les upgrades, patches ou profils compatibles. L'inventaire Jamf alimente l'évaluation.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg03",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Smart Group « Marketing-Laptops » : critère Department EA equals Marketing AND Model contains MacBook. Un Mac change de département via LDAP. Que se passe-t-il ?",
    correct: "Le Mac sort ou entre automatiquement du Smart Group au prochain inventaire/check-in",
    distractors: [
      "Le Mac reste dans le groupe jusqu'à intervention manuelle",
      "La policy scoped est immédiatement désinstallée du Mac",
      "Le certificat APNs est révoqué",
    ],
    explanation:
      "Smart Groups réévaluent à chaque mise à jour inventaire. Changement LDAP → EA → recalcul appartenance → impact scope policies liées.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg04",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Pour cibler les Mac sans antivirus corporate installé, quel critère Smart Group est le plus fiable ?",
    correct: "Application Title does not contain [Nom AV] ou EA script confirmant absence",
    distractors: [
      "Last Check-in greater than 30 days",
      "Static Group nommé « No-AV » mis à jour manuellement",
      "Payload Restrictions App Store only",
    ],
    explanation:
      "L'inventaire applications permet de détecter présence/absence d'un binaire. Un EA script peut confirmer version ou service actif pour plus de précision.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg05",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Un Smart Group parent inclut critère « Member of Smart Group X ». Bonne pratique Jamf ?",
    correct: "Éviter les références circulaires ; structurer hiérarchie unidirectionnelle",
    distractors: [
      "Toujours imbriquer deux Smart Groups mutuellement pour performance",
      "Remplacer tous les Smart Groups par des Advanced Search",
      "Utiliser uniquement des Static Groups pour l'imbrication",
    ],
    explanation:
      "Jamf 11.x met en garde : critères circulaires entre Smart Groups dégradent performances. Préférer critères plats ou hiérarchie sans boucle.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg06",
    domain: "smart-groups",
    difficulty: "hard",
    text: "Smart Group critère « Extension Attribute Patch Status equals Out of Date » alimente patch policies. L'EA ne se met pas à jour. Impact ?",
    correct: "Mac restent hors Smart Group patch — aucun déploiement patch policy jusqu'à EA corrigé",
    distractors: [
      "Patch policy s'exécute sur toute la flotte par défaut",
      "APNs cesse de fonctionner",
      "Self Service se désinstalle",
    ],
    explanation:
      "Les patch policies s'appuient souvent sur EA ou critères inventaire. EA défaillant = mauvais scope = machines non patchées silencieusement.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg07",
    domain: "smart-groups",
    difficulty: "easy",
    text: "Combien de critères peut combiner un Smart Group avec opérateur AND ?",
    correct: "Plusieurs critères AND/OR — Jamf permet des combinaisons complexes",
    distractors: [
      "Un seul critère maximum",
      "Exactement deux critères sans exception",
      "Aucun — Smart Groups n'utilisent pas de critères",
    ],
    explanation:
      "Les Smart Groups supportent AND/OR et critères multiples (OS, apps, EA, group membership). C'est leur force pour le ciblage fin.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg08",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Scope exclusion sur une policy avec Smart Group « All-Except-Executives » se configure comment ?",
    correct: "Scope Smart Group large + Exclusions Smart/Static Group « Executives »",
    distractors: [
      "Impossible d'exclure depuis une policy Jamf",
      "Supprimer manuellement chaque Mac exécutif de l'inventaire",
      "Créer un second serveur Jamf Pro pour les exécutifs",
    ],
    explanation:
      "Les exclusions affinent le scope : inclure un Smart Group broad puis exclure un sous-groupe (Static ou Smart) est un pattern enterprise courant.",
    relatedModuleSlug: "jamf-100/scope-deploiement",
  },
  {
    id: "j100-sg09",
    domain: "smart-groups",
    difficulty: "hard",
    text: "Smart Group « Beta-Testers » : OS ≥ 15 AND Member of Static Group Beta-Volunteers. Pourquoi combiner Static et Smart ?",
    correct: "Static Group contrôle l'inscription volontaire ; Smart Group ajoute critère OS pour compatibilité beta",
    distractors: [
      "Obligation Jamf d'utiliser Static Group pour tout déploiement",
      "Static Group remplace le certificat APNs",
      "Smart Group ne peut pas filtrer sur version OS",
    ],
    explanation:
      "Pattern hybride : Static pour liste contrôlée (pilotes) + Smart pour prérequis techniques (OS, espace disque). Évite déploiement beta sur machines incompatibles.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg10",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Après modification des critères d'un Smart Group, quand les policies scoped s'appliquent-elles aux nouveaux membres ?",
    correct: "Au prochain check-in/trigger de la policy (selon trigger configuré)",
    distractors: [
      "Instantanément sans check-in MDM",
      "Uniquement après redémarrage du serveur Jamf",
      "Jamais — il faut recréer la policy",
    ],
    explanation:
      "Nouveaux membres Smart Group entrent dans le scope ; l'exécution policy dépend du trigger (Recurring Check-in, Login, etc.).",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg11",
    domain: "smart-groups",
    difficulty: "easy",
    text: "Smart Group basé sur « Last Inventory Update older than 7 days » sert à :",
    correct: "Identifier les Mac qui ne remontent plus inventaire régulièrement",
    distractors: [
      "Planifier renouvellement APNs annuel",
      "Attribuer licences VPP automatiquement",
      "Créer des comptes admin locaux",
    ],
    explanation:
      "Critère de santé management : Mac sans inventaire récent = candidat dépannage (profil MDM, réseau, agent Jamf).",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg12",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Site A et Site B ont chacun un Smart Group « All Managed Macs ». Les policies Site A doivent cibler uniquement Site A. Solution ?",
    correct: "Smart Group critère Site equals A (ou scope limité au Site dans la policy)",
    distractors: [
      "Un Smart Group global sans critère Site pour les deux",
      "Désactiver RBAC sur Jamf Pro",
      "Fusionner les deux sites en un seul",
    ],
    explanation:
      "En multi-site, critère Site ou scope site-level empêche le déploiement cross-tenant. Chaque site isole ses Smart Groups opérationnels.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg13",
    domain: "smart-groups",
    difficulty: "hard",
    text: "Critère « Application Version less than 2.0 » pour forcer upgrade Slack. Risque si inventaire apps retardé ?",
    correct: "Mac avec Slack 1.x non inventorié échappera au scope jusqu'au prochain scan apps",
    distractors: [
      "Slack sera désinstallé automatiquement de toute la flotte",
      "Le certificat push expire",
      "Smart Group devient Static Group",
    ],
    explanation:
      "Les critères applications dépendent de la fraîcheur inventaire. Combiner Inventory Update policy ou EA version garantit couverture.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg14",
    domain: "smart-groups",
    difficulty: "medium",
    text: "Jamf recommande d'utiliser les Smart Groups principalement pour :",
    correct: "Scope des policies, profils et actions de gestion",
    distractors: [
      "Stockage des packages sur Distribution Point",
      "Signature des certificats APNs",
      "Remplacement complet des rapports Advanced Search",
    ],
    explanation:
      "Doc Jamf : Smart Groups = ciblage opérationnel. Advanced Search = reporting. Ne pas confondre les deux usages.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-sg15",
    domain: "smart-groups",
    difficulty: "hard",
    text: "Smart Group « FileVault-Not-Enabled » pour compliance SOC2. Quel critère inventaire Jamf utiliser ?",
    correct: "Disk Encryption Status equals Not Enabled ou EA confirmant absence FV",
    distractors: [
      "Last Check-in less than 1 day",
      "Model contains MacBook uniquement",
      "Member of Static Group All-Macs",
    ],
    explanation:
      "Jamf inventorie l'état FileVault. Smart Group compliance cible les Mac non chiffrés pour policy FileVault ou alerte sécurité.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },

  // ── static-groups (5) ───────────────────────────────────────────────────────
  {
    id: "j100-st01",
    domain: "static-groups",
    difficulty: "easy",
    text: "Un Static Group convient particulièrement pour :",
    correct: "Liste pilote de Mac ajoutés manuellement pour test avant déploiement large",
    distractors: [
      "Cibler automatiquement tous les Mac macOS 15+",
      "Remplacer le certificat APNs expiré",
      "Synchroniser inventaire ABM automatiquement",
    ],
    explanation:
      "Static Groups = appartenance manuelle stable. Idéal pour pilotes, VIP, salles de réunion — cas où critères dynamiques ne conviennent pas.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-st02",
    domain: "static-groups",
    difficulty: "medium",
    text: "Différence clé Static vs Smart Group pour une policy de test ?",
    correct: "Static Group ne change pas sans action admin ; Smart Group fluctue selon inventaire",
    distractors: [
      "Static Group se met à jour à chaque check-in MDM",
      "Smart Group ne peut pas être scoped à une policy",
      "Static Group remplace les Configuration Profiles",
    ],
    explanation:
      "Tests contrôlés : Static Group garantit liste fixe. Smart Group pourrait ajouter/retirer des Mac automatiquement et fausser le test.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-st03",
    domain: "static-groups",
    difficulty: "medium",
    text: "Un Mac est retiré d'un Static Group scope d'une policy. Les changements déjà appliqués par la policy :",
    correct: "Persistent — retirer du scope n'annule pas les réglages déjà appliqués",
    distractors: [
      "Sont automatiquement rollback au retrait du groupe",
      "Effacent FileVault et réinstallent macOS",
      "Révoquent le certificat APNs du serveur",
    ],
    explanation:
      "Documentation Jamf Policies : retrait scope ≠ désinstallation automatique. Une policy de remediation ou profil removal est nécessaire pour rollback.",
    relatedModuleSlug: "jamf-100/scope-deploiement",
  },
  {
    id: "j100-st04",
    domain: "static-groups",
    difficulty: "hard",
    text: "Static Group « Boardroom-Macs » pour 4 iMac salle de conférence. Bonne pratique de scope ?",
    correct: "Static Group + policies/profils dédiés kiosk ou restrictions présentation",
    distractors: [
      "Smart Group critère Last User equals Boardroom sans maintenance",
      "Enrollment manuel sans ADE pour simplifier",
      "Aucun scope — déploiement global All Computers",
    ],
    explanation:
      "Équipements fixes = Static Group explicite. Évite qu'un Smart Group critère utilisateur/os n'inclue/exclue des machines par erreur.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },
  {
    id: "j100-st05",
    domain: "static-groups",
    difficulty: "easy",
    text: "Peut-on ajouter un iPhone supervisé à un Static Group Computers ?",
    correct: "Non — Static Groups Computers et Mobile Devices sont des types séparés",
    distractors: [
      "Oui, tous appareils Apple dans un seul Static Group",
      "Oui, via Extension Attribute uniquement",
      "Oui, si le iPhone exécute macOS",
    ],
    explanation:
      "Jamf sépare Computers et Mobile Devices. Chaque type a ses Static/Smart Groups. Un iPhone va dans Mobile Device Static Groups.",
    relatedModuleSlug: "jamf-100/smart-groups",
  },

  // ── policies (15) ───────────────────────────────────────────────────────────
  {
    id: "j100-pol01",
    domain: "policies",
    difficulty: "easy",
    text: "Le « Scope » d'une policy Jamf définit :",
    correct: "Quels ordinateurs, utilisateurs ou groupes sont ciblés par la policy",
    distractors: [
      "Le prix de la licence Jamf Pro",
      "La couleur du logo Self Service",
      "L'Apple ID utilisé pour APNs",
    ],
    explanation:
      "Scope = cibles (Computers, Smart/Static Groups, Buildings, Departments). Sans scope correct, la policy ne s'exécute sur aucun appareil.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol02",
    domain: "policies",
    difficulty: "easy",
    text: "Trigger « Recurring Check-in » sur une policy signifie :",
    correct: "La policy s'évalue à chaque check-in/inventory update MDM du Mac",
    distractors: [
      "Exécution unique au premier enrollment",
      "Exécution uniquement au login utilisateur",
      "La policy ne s'exécute jamais automatiquement",
    ],
    explanation:
      "Recurring Check-in est le trigger le plus courant pour maintenance continue : scripts, EA, packages conditionnels à chaque contact MDM.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol03",
    domain: "policies",
    difficulty: "medium",
    text: "Policy déploie un .pkg Zoom. Payload Packages action « Install ». Le Mac a déjà Zoom. Comportement par défaut typique ?",
    correct: "Jamf réinstalle ou met à jour selon version package si configuré ; sinon skip si même version",
    distractors: [
      "Désinstallation automatique de Zoom",
      "Suppression du profil MDM",
      "Révocation certificat APNs",
    ],
    explanation:
      "Actions Install/Cache/Uninstall contrôlent le comportement. Options « If available » ou version check évitent réinstall inutile.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol04",
    domain: "policies",
    difficulty: "medium",
    text: "Package action « Cache » dans une policy sert à :",
    correct: "Télécharger le package sur le Mac sans installation immédiate pour usage ultérieur",
    distractors: [
      "Supprimer le Distribution Point cloud",
      "Renouveler le token ABM",
      "Créer un Smart Group automatiquement",
    ],
    explanation:
      "Cache pré-positionne le .pkg localement (Self Service ou policy follow-up) — utile pour sites à bande passante limitée.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol05",
    domain: "policies",
    difficulty: "medium",
    text: "Ordre correct pour déployer un package logiciel en Jamf Pro ?",
    correct: "Uploader package sur Distribution Point → créer enregistrement Package → policy payload Packages scoped",
    distractors: [
      "Policy d'abord sans package enregistré dans Jamf",
      "Configuration Profile payload Packages uniquement",
      "Self Service sans policy ni package Jamf",
    ],
    explanation:
      "Workflow standard : DP → enregistrement Jamf → policy Packages (Install/Cache) → scope groupes.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol06",
    domain: "policies",
    difficulty: "hard",
    text: "Policy script retourne exit 0 mais l'action n'a pas eu lieu. Meilleure pratique de validation ?",
    correct: "Vérifier Policy Logs Jamf, fichier témoin, logs locaux (/var/log) et contenu script",
    distractors: [
      "Augmenter execution frequency à chaque minute",
      "Supprimer le certificat APNs",
      "Convertir en Static Group",
    ],
    explanation:
      "Exit 0 ne garantit pas l'effet. Validation post-exécution via logs, markers et tests sur Mac pilote est essentielle.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol07",
    domain: "policies",
    difficulty: "medium",
    text: "« Execution Frequency » dans General payload limite :",
    correct: "La fréquence minimale entre deux exécutions réussies de la policy sur un même Mac",
    distractors: [
      "Le nombre total de Mac dans le scope",
      "La taille maximale du package .pkg",
      "La durée de validité du certificat APNs",
    ],
    explanation:
      "Execution Frequency évite boucles : ex. Once every 24 hours empêche re-exécution script à chaque check-in.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol08",
    domain: "policies",
    difficulty: "easy",
    text: "Flush Policy Logs sur une policy sert à :",
    correct: "Effacer l'historique d'exécution pour retester la policy sur un état propre",
    distractors: [
      "Supprimer tous les Mac du scope",
      "Révoquer les profils MDM de la flotte",
      "Renouveler le token DEP ABM",
    ],
    explanation:
      "Flush logs = maintenance admin avant re-test. N'affecte pas les Mac ni les réglages déjà appliqués.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol09",
    domain: "policies",
    difficulty: "hard",
    text: "Policy Maintenance « Update Inventory » trop fréquente impacte :",
    correct: "Charge serveur Jamf et bande passante — limiter frequency et scope",
    distractors: [
      "Uniquement le certificat APNs sans impact serveur",
      "Self Service branding uniquement",
      "Licences VPP Apps & Books",
    ],
    explanation:
      "Inventory Update massif à haute fréquence sature Jamf et réseau. Cibler Smart Group et ajuster execution frequency.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol10",
    domain: "policies",
    difficulty: "medium",
    text: "Exposer une policy à l'utilisateur final via Self Service requiert :",
    correct: "Onglet Self Service de la policy activé + app Self Service installée sur le Mac",
    distractors: [
      "Trigger Login uniquement sans onglet Self Service",
      "Patch Management dashboard activé",
      "Advanced Search configurée",
    ],
    explanation:
      "Policies peuvent être user-triggered via Self Service tab : install apps, scripts, maintenance approuvés par IT.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol11",
    domain: "policies",
    difficulty: "easy",
    text: "Payload « Files and Processes » dans une policy permet :",
    correct: "Déployer fichiers sur le Mac et exécuter processus/scripts",
    distractors: [
      "Configurer le certificat APNs serveur",
      "Gérer les tokens ABM",
      "Créer des Smart Groups dynamiques",
    ],
    explanation:
      "Files and Processes = dépôt de config files, scripts shell, exécution commandes — brique d'automatisation policies.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol12",
    domain: "policies",
    difficulty: "medium",
    text: "Policy trigger « Login » vs « Recurring Check-in » — cas Login préférable ?",
    correct: "Action nécessitant contexte utilisateur connecté (mount home, user prefs)",
    distractors: [
      "Déploiement certificat APNs serveur",
      "Sync inventaire ABM nocturne",
      "Renouvellement token MDM ABM",
    ],
    explanation:
      "Login trigger exécute au login utilisateur — adapté aux tâches user-context. Check-in convient aux tâches machine-level sans session.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol13",
    domain: "policies",
    difficulty: "hard",
    text: "Deux policies scoped au même Smart Group installent le même .pkg. Risque ?",
    correct: "Exécutions redondantes — conflits logs, charge réseau ; consolider en une policy",
    distractors: [
      "Jamf fusionne automatiquement en une seule exécution",
      "APNs est révoqué",
      "Smart Group devient Static",
    ],
    explanation:
      "Doublons policies = maintenance difficile et exécutions multiples. Une policy consolidée avec bon trigger/frequency est préférable.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-pol14",
    domain: "policies",
    difficulty: "medium",
    text: "Scope Exclusions sur une policy « All Macs except Lab » :",
    correct: "Ajouter Static/Smart Group « Lab-Macs » dans Exclusions du scope",
    distractors: [
      "Supprimer le Smart Group All Macs",
      "Désactiver la policy les jours de lab",
      "Utiliser uniquement Configuration Profile",
    ],
    explanation:
      "Exclusions affinent le scope sans dupliquer policies. Pattern courant All + Exclude subgroup.",
    relatedModuleSlug: "jamf-100/scope-deploiement",
  },
  {
    id: "j100-pol15",
    domain: "policies",
    difficulty: "hard",
    text: "Policy FileVault Enable échoue sur Mac avec bootstrap token manquant (T2/Apple Silicon). Action ?",
    correct: "Vérifier ADE supervision, escrow bootstrap via MDM, réessayer après check-in ADE complet",
    distractors: [
      "Désactiver FileVault globalement",
      "Changer certificat APNs Apple ID",
      "Retirer tous les Configuration Profiles",
    ],
    explanation:
      "FileVault sur Apple Silicon/T2 requiert bootstrap token escrow via MDM supervisé. Enrollment incomplet = FV policy fail.",
    relatedModuleSlug: "jamf-100/policies-base",
  },

  // ── configuration-profiles (10) ─────────────────────────────────────────────
  {
    id: "j100-cp01",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Un Configuration Profile Jamf contient principalement :",
    correct: "Des payloads MDM (Wi-Fi, restrictions, certificats, etc.)",
    distractors: [
      "Uniquement des scripts shell exécutables",
      "Les packages .pkg du Distribution Point",
      "Le token server ABM server_token.p7m",
    ],
    explanation:
      "Configuration Profiles = conteneurs payloads Apple MDM. Distinct des policies qui orchestrent scripts, packages et maintenance.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp02",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Payload Restrictions permet de :",
    correct: "Bloquer ou autoriser fonctionnalités (App Store, caméra, AirDrop, etc.) sur appareils supervisés",
    distractors: [
      "Augmenter la RAM du Mac",
      "Renouveler certificat APNs",
      "Créer Smart Groups automatiquement",
    ],
    explanation:
      "Restrictions payload = contrôle fonctionnel iOS/macOS supervisé. Clé pour conformité et kiosque.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp03",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil Wi-Fi enterprise 802.1X avec certificat utilisateur. Payloads requis ?",
    correct: "Wi-Fi payload + Certificate ou SCEP payload pour auth EAP-TLS",
    distractors: [
      "Restrictions payload uniquement",
      "Package payload dans Configuration Profile",
      "APNs payload dans le profil mobile",
    ],
    explanation:
      "802.1X EAP-TLS requiert certificat client déployé via payload Certificate/SCEP lié au payload Wi-Fi.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp04",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil signé vs non signé — impact sur les Mac ?",
    correct: "Profil signé garantit intégrité et confiance ; non signé peut être refusé ou moins trusted",
    distractors: [
      "Aucune différence sur macOS",
      "Non signé obligatoire pour ADE",
      "Signé remplace le certificat APNs",
    ],
    explanation:
      "Signature profile (certificat Jamf ou PKI interne) renforce confiance utilisateur et sécurité supply chain profils.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp05",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Retirer un Configuration Profile du scope d'un Mac :",
    correct: "Jamf envoie commande Remove Profile — payload retiré si removal autorisé",
    distractors: [
      "Rollback automatique de toutes policies historiques",
      "Effacement complet du disque",
      "Révocation APNs serveur",
    ],
    explanation:
      "Remove profile via MDM retire payloads du profil. Certaines restrictions persistent selon type ; vérifier comportement par payload.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp06",
    domain: "configuration-profiles",
    difficulty: "hard",
    text: "Conflit deux profils Wi-Fi même SSID scoped au même Mac. Comportement ?",
    correct: "Dernier profil appliqué ou conflit — consolider en un profil Wi-Fi unique",
    distractors: [
      "Jamf fusionne automatiquement sans conflit",
      "APNs cesse de fonctionner",
      "Smart Group se vide",
    ],
    explanation:
      "Profils redondants même payload = imprévisibilité. Bonne pratique : un profil Wi-Fi par SSID/use case, scope Smart Group clair.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp07",
    domain: "configuration-profiles",
    difficulty: "easy",
    text: "Payload Privacy Preferences (PPPC) sert à :",
    correct: "Pré-approuver accès confidentialité (caméra, micro, accessibilité) pour apps enterprise",
    distractors: [
      "Configurer le certificat push APNs",
      "Gérer les licences VPP",
      "Créer des Static Groups",
    ],
    explanation:
      "PPPC réduit prompts TCC macOS — essentiel pour agents sécurité, Zoom, screencapture en environnement géré.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp08",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Profil DEP/PreStage vs profil ongoing : bonne pratique ADE ?",
    correct: "Profil minimal au PreStage (réseau, MDM) ; profils lourds post-enrollment via scope Smart Group",
    distractors: [
      "Tous payloads dans PreStage pour simplifier",
      "Aucun profil au PreStage",
      "Profils uniquement via Self Service sans MDM",
    ],
    explanation:
      "PreStage trop lourd bloque Setup Assistant. Split minimal ADE + déploiement ongoing accélère zero-touch.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp09",
    domain: "configuration-profiles",
    difficulty: "hard",
    text: "Payload Certificate avec certificat expiré scoped à 500 Mac. Symptôme utilisateur Wi-Fi VPN ?",
    correct: "Échec auth 802.1X/VPN — connexion rejetée jusqu'au renouvellement certificat et redeploy profil",
    distractors: [
      "Self Service branding incorrect",
      "Smart Group recalcul infini",
      "Inventaire ABM vide",
    ],
    explanation:
      "Certificats profils MDM expirent comme tout PKI. Processus renouvellement + scope update + remove/reinstall profil.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
  {
    id: "j100-cp10",
    domain: "configuration-profiles",
    difficulty: "medium",
    text: "Level « System » vs « User » sur un Configuration Profile macOS ?",
    correct: "System = machine-wide tous utilisateurs ; User = utilisateur connecté uniquement",
    distractors: [
      "System = iPhone uniquement",
      "User = serveur Jamf Cloud",
      "Identiques sans distinction",
    ],
    explanation:
      "Level contrôle portée installation profil macOS. System pour VPN enterprise ; User pour prefs utilisateur.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },

  // ── self-service (10) ─────────────────────────────────────────────────────────
  {
    id: "j100-ss01",
    domain: "self-service",
    difficulty: "easy",
    text: "Jamf Self Service permet aux utilisateurs de :",
    correct: "Installer apps, scripts et policies approuvés par IT depuis un catalogue",
    distractors: [
      "Modifier SIP et désactiver Gatekeeper",
      "Créer des comptes admin locaux sans contrôle",
      "Jailbreak iPhone supervisés",
    ],
    explanation:
      "Self Service = IT-approved catalogue user-initiated. Réduit tickets helpdesk pour apps standard.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss02",
    domain: "self-service",
    difficulty: "easy",
    text: "Pour qu'une policy apparaisse dans Self Service, il faut :",
    correct: "Activer l'onglet Self Service sur la policy et configurer catégorie/description",
    distractors: [
      "Trigger Startup uniquement",
      "Certificat APNs renouvelé dans les 24 h",
      "Static Group All Computers sans onglet Self Service",
    ],
    explanation:
      "Self Service tab expose la policy dans l'app. Sans activation, policy reste admin-triggered uniquement.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss03",
    domain: "self-service",
    difficulty: "medium",
    text: "Self Service branding (logo, couleurs) se configure :",
    correct: "Settings → Self Service → Branding pour personnaliser l'app",
    distractors: [
      "Configuration Profile payload Restrictions",
      "Distribution Point package settings",
      "Token ABM server settings",
    ],
    explanation:
      "Branding Self Service améliore adoption utilisateur — logo entreprise, couleurs, message accueil.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss04",
    domain: "self-service",
    difficulty: "medium",
    text: "Patch policies disponibles Self Service mais absentes recherche Self Service — pourquoi ?",
    correct: "Documentation Jamf : patch policies non indexées recherche Self Service par design",
    distractors: [
      "Bug APNs empêchant indexation",
      "Smart Group incorrect obligatoire",
      "Self Service désinstallé sur le Mac",
    ],
    explanation:
      "Jamf 11.x : patch policies peuvent être in Self Service catalog mais n'apparaissent pas dans search results.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss05",
    domain: "self-service",
    difficulty: "medium",
    text: "Utilisateur clique Install dans Self Service — rien ne se passe. Première vérification ?",
    correct: "Policy Logs, connexion MDM Mac, app Self Service à jour, policy scoped au Mac",
    distractors: [
      "Renouveler certificat APNs immédiatement",
      "Recréer tous Smart Groups",
      "Wipe complet du Mac",
    ],
    explanation:
      "Self Service déclenche policy côté serveur via MDM. Échec = scope, logs policy, connectivité ou version app Self Service.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss06",
    domain: "self-service",
    difficulty: "hard",
    text: "Self Service Mobile iOS vs macOS — différence déploiement catalogue ?",
    correct: "Configuration distincte Mobile Self Service apps/policies vs Mac Self Service policies/packages",
    distractors: [
      "Identique — mêmes policies Mac sur iPhone",
      "Self Service iOS remplace App Store",
      "Self Service Mac ne supporte pas packages",
    ],
    explanation:
      "Jamf configure Self Service par plateforme : apps VPP mobile vs policies/packages Mac. Scope et UI diffèrent.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss07",
    domain: "self-service",
    difficulty: "easy",
    text: "Catégories Self Service servent à :",
    correct: "Organiser le catalogue (Productivity, Security, Printers) pour navigation utilisateur",
    distractors: [
      "Remplacer les Smart Groups Jamf",
      "Signer les Configuration Profiles",
      "Gérer certificat APNs",
    ],
    explanation:
      "Catégories améliorent UX catalogue Self Service — regroupement logique des policies exposées.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss08",
    domain: "self-service",
    difficulty: "medium",
    text: "Policy Self Service installe printer driver .pkg. Prérequis côté Mac ?",
    correct: "App Self Service installée, Mac scoped, package sur DP accessible, policy Self Service tab ON",
    distractors: [
      "Apple ID personnel utilisateur obligatoire",
      "Désactivation FileVault",
      "Enrollment manuel sans MDM",
    ],
    explanation:
      "Chaîne complète : MDM managed + Self Service app + policy configurée + package reachable.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ss09",
    domain: "self-service",
    difficulty: "hard",
    text: "Limiter visibilité Self Service item aux membres Smart Group « Finance » ?",
    correct: "Scope policy au Smart Group Finance — seuls ces Mac voient l'item dans leur catalogue",
    distractors: [
      "Self Service branding par utilisateur LDAP dans Settings",
      "Configuration Profile Restrictions App Store",
      "Static Group sans lien scope policy",
    ],
    explanation:
      "Visibilité Self Service suit scope policy. Mac hors scope ne voit pas l'item dans leur instance Self Service.",
    relatedModuleSlug: "jamf-100/scope-deploiement",
  },
  {
    id: "j100-ss10",
    domain: "self-service",
    difficulty: "medium",
    text: "Self Service « Feature Flags » ou plugins (selon version) permettent :",
    correct: "Étendre fonctionnalités catalogue — bookmarks, notifications, intégrations custom",
    distractors: [
      "Remplacer Jamf Pro Server on-prem",
      "Créer certificat APNs sans Apple ID",
      "Désactiver supervision ADE",
    ],
    explanation:
      "Self Service supporte extensions et configuration avancée pour UX enterprise au-delà du catalogue policies de base.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },

  // ── apns-mdm (10) ───────────────────────────────────────────────────────────
  {
    id: "j100-ap01",
    domain: "apns-mdm",
    difficulty: "easy",
    text: "Jamf Pro communique avec les Mac/iOS via :",
    correct: "Apple Push Notification service (APNs) — canal push MDM",
    distractors: [
      "FTP vers chaque appareil",
      "Email SMTP uniquement",
      "SNMP polling toutes les 5 minutes",
    ],
    explanation:
      "Comme tout serveur MDM Apple, Jamf utilise APNs pour réveiller appareils et livrer commandes. Pas de polling permanent.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap02",
    domain: "apns-mdm",
    difficulty: "easy",
    text: "Renouveler le certificat APNs Jamf requiert :",
    correct: "Le MÊME Apple ID que celui ayant créé le certificat initial",
    distractors: [
      "Un nouvel Apple ID à chaque renouvellement",
      "Compte Apple Business Manager admin uniquement",
      "Token DEP server_token.p7m",
    ],
    explanation:
      "Changer Apple ID à renouvellement = nouveau topic push = tous appareils perdent contact MDM jusqu'à re-enrollment profil.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap03",
    domain: "apns-mdm",
    difficulty: "medium",
    text: "Certificat APNs expire demain. Symptôme si non renouvelé ?",
    correct: "Aucune commande MDM push reçue — policies et profils ne se déploient plus",
    distractors: [
      "FileVault se désactive automatiquement",
      "Uniquement Self Service affecté",
      "Inventaire local Mac effacé",
    ],
    explanation:
      "APNs expiré = canal push mort. Appareils semblent « offline » management malgré Internet OK.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap04",
    domain: "apns-mdm",
    difficulty: "medium",
    text: "Test post-renouvellement APNs — commande la plus simple ?",
    correct: "Lock Device ou Update Inventory sur Mac/iPhone test",
    distractors: [
      "Wipe flotte entière",
      "Changer token ABM",
      "Supprimer tous Configuration Profiles",
    ],
    explanation:
      "Commande push test confirme certificat opérationnel avant communication interne « crise résolue ».",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap05",
    domain: "apns-mdm",
    difficulty: "medium",
    text: "MDM Check-in d'un Mac comprend typiquement :",
    correct: "Contact serveur Jamf pour inventaire, policies, profils — initié par APNs push ou schedule",
    distractors: [
      "Uniquement téléchargement App Store",
      "Sync iCloud Photos obligatoire",
      "Reboot firmware Mac",
    ],
    explanation:
      "Check-in = cycle MDM standard. APNs wake → device contacte Jamf → inventaire/policies évalués.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap06",
    domain: "apns-mdm",
    difficulty: "hard",
    text: "Mac « Managed » mais Last MDM Push Failed dans logs. APNs OK. Cause suivante ?",
    correct: "Réseau/firewall bloque outbound vers Jamf ; profil MDM corrompu ; heure système incorrecte",
    distractors: [
      "Smart Group circulaire uniquement",
      "Static Group trop petit",
      "Self Service branding expiré",
    ],
    explanation:
      "Push APNs OK côté serveur ne garantit pas check-in réussi. Vérifier connectivité device→Jamf, profil MDM, NTP.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap07",
    domain: "apns-mdm",
    difficulty: "easy",
    text: "Le topic push MDM est lié à :",
    correct: "Certificat APNs du serveur Jamf — unique par certificat/Apple ID",
    distractors: [
      "Numéro serial ABM de chaque Mac",
      "Nom du Smart Group principal",
      "Licence VPP par application",
    ],
    explanation:
      "Topic APNs identifie le serveur MDM auprès d'Apple. Profils MDM enrollés référencent ce topic.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap08",
    domain: "apns-mdm",
    difficulty: "medium",
    text: "Jamf Cloud vs on-prem — APNs configuration :",
    correct: "Les deux requièrent certificat APNs uploadé dans Jamf Pro Settings",
    distractors: [
      "Jamf Cloud n'utilise pas APNs",
      "On-prem utilise SMTP au lieu d'APNs",
      "APNs automatique sans Apple ID en Cloud",
    ],
    explanation:
      "Jamf Cloud ou on-prem : l'admin doit toujours créer/renouveler certificat APNs via Apple ID et l'importer.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap09",
    domain: "apns-mdm",
    difficulty: "hard",
    text: "Recréation certificat APNs avec NOUVEL Apple ID par erreur. Recovery ?",
    correct: "Re-enrollment MDM tous appareils — nouveau topic incompatible anciens profils",
    distractors: [
      "Redémarrer seulement le serveur Jamf",
      "Flush Policy Logs",
      "Renommer Smart Groups",
    ],
    explanation:
      "Nouvel Apple ID = nouveau topic = profils MDM existants invalides pour push. Re-enroll massif requis — d'où règle même Apple ID.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ap10",
    domain: "apns-mdm",
    difficulty: "medium",
    text: "Commande MDM « Erase Device » sur iPhone supervisé :",
    correct: "Effacement complet — commande push via APNs, exécution immédiate si online",
    distractors: [
      "Désinstalle uniquement Self Service",
      "Retire Smart Group membership",
      "Renouvelle certificat Wi-Fi",
    ],
    explanation:
      "Erase = wipe MDM standard iOS supervisé. Illustration dépendance canal push APNs opérationnel.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },

  // ── troubleshooting (5) ───────────────────────────────────────────────────────
  {
    id: "j100-ts01",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Policy Recurring Check-in s'exécute trop souvent — première action ?",
    correct: "Revoir Execution Frequency et trigger dans General payload de la policy",
    distractors: [
      "Supprimer certificat APNs",
      "Désinstaller Self Service sur toute la flotte",
      "Convertir tous Smart Groups en Static",
    ],
    explanation:
      "Frequency + trigger contrôlent cadence. Réduire frequency ou changer trigger si exécutions excessives saturent Mac/serveur.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-ts02",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Mac ADE bloqué « Configuring your Mac » plus de 2 heures. Pistes ?",
    correct: "Réseau, reachability Jamf, profils PreStage trop lourds — alléger profil ADE initial",
    distractors: [
      "Attendre 48 h sans action",
      "Remplacer hardware Mac",
      "Désactiver APNs temporairement",
    ],
    explanation:
      "Blocage Setup Assistant souvent réseau ou PreStage surchargé. Profil minimal ADE + post-enrollment policies.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ts03",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Package policy échoue « File not found on Distribution Point ». Cause ?",
    correct: "Package non uploadé ou chemin DP incorrect — vérifier sync Distribution Point",
    distractors: [
      "Smart Group vide",
      "Apple ID APNs incorrect",
      "Self Service branding manquant",
    ],
    explanation:
      "Erreur DP = package absent ou réplication cloud DP incomplète. Vérifier upload et statut DP dans Jamf.",
    relatedModuleSlug: "jamf-100/policies-base",
  },
  {
    id: "j100-ts04",
    domain: "troubleshooting",
    difficulty: "hard",
    text: "Flotte entière Last Check-in > 7 jours simultanément. Cause la plus probable ?",
    correct: "Certificat APNs serveur expiré ou token push invalide",
    distractors: [
      "Un seul Mac infecté virus",
      "Smart Group critère OS incorrect",
      "Static Group pilote modifié",
    ],
    explanation:
      "Panne simultanée flotte = problème infrastructure MDM (APNs, DNS Jamf, certificat SSL serveur) pas device isolé.",
    relatedModuleSlug: "jamf-100/architecture-jamf",
  },
  {
    id: "j100-ts05",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Profil Configuration « Failed » sur fiche Mac. Diagnostic ?",
    correct: "Vérifier conflit payload, certificat profil expiré, logs MDM device et remove/reinstall profil",
    distractors: [
      "Renouveler token ABM immédiatement",
      "Supprimer inventaire Computers",
      "Désactiver tous Static Groups",
    ],
    explanation:
      "Profil Failed = erreur payload (cert, conflit Wi-Fi, PPPC). Logs MDM et test pilote identifient payload fautif.",
    relatedModuleSlug: "jamf-100/config-profiles-jamf",
  },
];

export const jamf100Bank: Question[] = buildExamBank(JAMF100_BANK_INPUTS);
