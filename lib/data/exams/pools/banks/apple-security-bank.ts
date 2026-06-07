import type { ExamBankInput } from "./exam-bank-builder";
import { buildExamBank } from "./exam-bank-builder";

const APPLE_SECURITY_INPUTS: ExamBankInput[] = [
  // ── FileVault (15) ──────────────────────────────────────────────────────
  {
    id: "asec-fv01",
    domain: "filevault",
    difficulty: "easy",
    text: "FileVault 2 chiffre quel volume sur un Mac Apple Silicon ?",
    correct: "Le volume de démarrage complet (données utilisateur incluses)",
    distractors: ["Uniquement le dossier Documents", "La RAM au repos", "Le volume Recovery uniquement"],
    explanation:
      "FileVault utilise XTS-AES-128 sur l'intégralité du volume APFS de démarrage. Toutes les données au repos — documents, caches, profils — sont chiffrées. Le Secure Enclave gère la clé de volume ; sans mot de passe ou clé de récupération, le disque reste illisible même retiré physiquement.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv02",
    domain: "filevault",
    difficulty: "medium",
    text: "Pour l'escrow de clé FileVault via MDM sur macOS Ventura+, quel prérequis compte administrateur est indispensable ?",
    correct: "Un compte admin avec Secure Token ou Bootstrap Token généré par MDM",
    distractors: ["Un compte standard sans privilèges", "Un Apple ID personnel iCloud", "Un certificat APNs utilisateur"],
    explanation:
      "Le Bootstrap Token, créé lors de l'enrollment ADE supervisé, permet au serveur MDM de demander l'escrow de la clé de récupération FileVault sans interaction utilisateur. Sans Secure Token sur au moins un compte admin, l'escrow échoue silencieusement ou reste en attente.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv03",
    domain: "filevault",
    difficulty: "medium",
    text: "Un Mac est conforme Intune « FileVault activé » mais la clé de récupération n'apparaît pas dans la console. Cause la plus probable ?",
    correct: "L'escrow MDM n'a pas abouti — check-in retardé ou Bootstrap Token absent",
    distractors: ["Gatekeeper bloque l'escrow", "Le serial ABM est invalide", "SIP est désactivé"],
    explanation:
      "La conformité « FileVault ON » vérifie l'état local ; l'escrow est une étape distincte nécessitant un profil FDE avec redirection vers le MDM. Sans Bootstrap Token ou après effacement sans re-enrollment ADE, la clé reste locale et le helpdesk ne peut pas déverrouiller le Mac.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv04",
    domain: "filevault",
    difficulty: "easy",
    text: "Quelle stratégie de clé de récupération privilégie une flotte macOS gérée en entreprise ?",
    correct: "Escrow MDM avec clé récupérable par l'équipe IT depuis la console",
    distractors: ["Clé affichée une seule fois à l'utilisateur sans sauvegarde IT", "Aucune clé — mot de passe iCloud uniquement", "Clé partagée par email à toute l'équipe"],
    explanation:
      "L'escrow centralise la clé de récupération dans Jamf, Intune ou autre MDM, permettant au support de déverrouiller un Mac si l'employé oublie son mot de passe. La clé institutionnelle seule ou iCloud Recovery Key ne convient pas aux postes corporate sans compte personnel.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv05",
    domain: "filevault",
    difficulty: "hard",
    text: "Après remplacement de la carte mère sur un Mac Intel avec FileVault, que doit faire l'IT ?",
    correct: "Utiliser la clé de récupération escrow ou institutionnelle — le mot de session utilisateur ne suffit plus",
    distractors: ["Réinitialiser le T2 via iCloud", "Désactiver SIP en Recovery", "Effacer ABM pour regénérer la clé"],
    explanation:
      "Le remplacement matériel change l'identité du Secure Enclave / T2. FileVault reste actif avec la clé de récupération existante ; le mot de passe utilisateur peut ne plus déverrouiller jusqu'à réassociation. L'escrow MDM ou la clé institutionnelle est le seul recours fiable en entreprise.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv06",
    domain: "filevault",
    difficulty: "medium",
    text: "Un profil MDM « Force FileVault » avec « Defer » activé signifie :",
    correct: "FileVault s'active au prochain logout ou shutdown, pas immédiatement à l'installation du profil",
    distractors: ["FileVault reste optionnel pour l'utilisateur", "Le chiffrement est reporté indéfiniment", "Seul le volume Data est chiffré"],
    explanation:
      "Le defer permet d'éviter un chiffrement long pendant les heures ouvrées. L'utilisateur voit des invites jusqu'à ce qu'il se déconnecte ; à ce moment le volume est chiffré. Sans defer forcé, l'activation peut interrompre la productivité sur de gros volumes.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv07",
    domain: "filevault",
    difficulty: "easy",
    text: "FileVault et iCloud « Retrouver mon Mac » sur un Mac personnel : relation correcte ?",
    correct: "iCloud peut stocker une clé de récupération ; en entreprise on préfère l'escrow MDM sans Apple ID perso",
    distractors: ["Les deux sont mutuellement exclusifs", "FileVault nécessite obligatoirement un Apple ID", "iCloud désactive FileVault automatiquement"],
    explanation:
      "Sur un Mac BYOD, l'utilisateur peut lier FileVault à iCloud. En flotte corporate ADE, la politique standard interdit la liaison iCloud perso et impose l'escrow MDM pour conformité SOC2 et capacité de récupération centralisée.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv08",
    domain: "filevault",
    difficulty: "medium",
    text: "fdesetup status renvoie « FileVault is On, Deferred enablement or disablement pending ». Action IT ?",
    correct: "Demander à l'utilisateur de se déconnecter ou redémarrer pour finaliser l'activation",
    distractors: ["Réinstaller macOS immédiatement", "Supprimer le profil MDM FileVault", "Désactiver SIP"],
    explanation:
      "L'état « deferred » indique que la conversion APFS est planifiée mais pas terminée. Un logout déclenche la conversion réelle. Le MDM peut aussi forcer un logout via commande ; surveiller fdesetup status jusqu'à « FileVault is On » sans pending.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-fv09",
    domain: "filevault",
    difficulty: "hard",
    text: "Rotation de clé FileVault (personal recovery key rotation) via MDM : prérequis critique ?",
    correct: "Mac en ligne, FileVault actif, escrow fonctionnel et OS supportant la commande MDM de rotation",
    distractors: ["SIP désactivé temporairement", "Compte Apple Business Manager admin", "APNs expiré renouvelé"],
    explanation:
      "La rotation génère une nouvelle clé personnelle et met à jour l'escrow. Si l'escrow est cassé ou le Mac offline, la rotation peut laisser une clé orpheline. Tester sur un pilote avant déploiement fleet-wide après incident de fuite de clés.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv10",
    domain: "filevault",
    difficulty: "medium",
    text: "Un Mac ADE enrollé sans compte admin local au Setup Assistant : impact FileVault escrow ?",
    correct: "Aucun Secure Token initial — créer un compte admin managé ou utiliser Bootstrap Token avant escrow fiable",
    distractors: ["FileVault s'active automatiquement sans admin", "L'escrow utilise le compte MDM système uniquement", "ABM fournit la clé de récupération"],
    explanation:
      "Sans compte admin avec Secure Token au premier boot, le Bootstrap Token MDM devient le mécanisme principal pour l'escrow. Les workflows « primary user only » standard nécessitent quand même un token ; les scénarios zero-touch avec compte standard pur exigent une architecture Bootstrap Token validée.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv11",
    domain: "filevault",
    difficulty: "easy",
    text: "Quel algorithme de chiffrement FileVault utilise-t-il sur les Mac récents ?",
    correct: "XTS-AES-128 sur le volume APFS",
    distractors: ["AES-256-GCM sur fichiers individuels", "Chiffrement XOR logiciel", "RSA-4096 sur secteurs"],
    explanation:
      "Apple documente XTS-AES-128 pour FileVault 2, avec clés liées au Secure Enclave. La protection est transparente au niveau volume ; les performances sur Apple Silicon sont optimisées matériellement.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv12",
    domain: "filevault",
    difficulty: "medium",
    text: "Compliance policy exige FileVault + « recovery key escrowed ». Mac avec FileVault ON mais non compliant : diagnostic ?",
    correct: "Vérifier l'inventaire MDM pour Personal Recovery Key et refaire check-in ou réappliquer le profil FDE",
    distractors: ["Augmenter le timeout APNs", "Changer le Team ID Gatekeeper", "Révoquer le certificat Wi-Fi"],
    explanation:
      "Intune et Jamf distinguent « chiffré » et « clé escrowed ». Un profil FDE mal configuré (redirect URL, certificat) ou un enrollment user-based sans Bootstrap Token explique l'écart. Corriger le profil puis forcer une synchronisation MDM.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-fv13",
    domain: "filevault",
    difficulty: "medium",
    text: "Institutional Recovery Key (IRK) vs Personal Recovery Key (PRK) en entreprise :",
    correct: "L'IRK est unique par organisation et déployée via profil ; le PRK est par appareil et escrowed via MDM",
    distractors: ["L'IRK est liée au Apple ID utilisateur", "Le PRK est identique sur toute la flotte", "Les deux sont obsolètes sur Apple Silicon"],
    explanation:
      "L'IRK permet une clé organisationnelle statique dans un payload FDE ; le PRK est généré par appareil et idéalement escrowed. Beaucoup d'organisations combinent profil Force FileVault + escrow PRK pour audit et rotation par machine.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv14",
    domain: "filevault",
    difficulty: "hard",
    text: "Migration Mac Intel vers Apple Silicon avec restauration Migration Assistant et FileVault source actif : bonne pratique ?",
    correct: "Déverrouiller le Mac source, migrer, puis appliquer FileVault/escrow MDM sur le nouveau Mac via ADE",
    distractors: ["Cloner le volume chiffré bit à bit sans déverrouillage", "Désactiver FileVault sur les deux pendant la migration", "Copier uniquement la clé IRK manuellement"],
    explanation:
      "Migration Assistant gère le déchiffrement transitif si le volume source est déverrouillé. Sur le Mac M-series, reconfigurer FileVault via MDM garantit un nouveau PRK escrowed. Ne jamais supposer que l'ancienne clé s'applique au nouveau Secure Enclave.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-fv15",
    domain: "filevault",
    difficulty: "easy",
    text: "FileVault est-il compatible avec le démarrage sécurisé (Secure Boot) sur Apple Silicon ?",
    correct: "Oui — FileVault et Secure Boot sont complémentaires (données au repos vs intégrité au démarrage)",
    distractors: ["Non, il faut choisir l'un ou l'autre", "FileVault désactive Secure Boot", "Secure Boot remplace FileVault"],
    explanation:
      "Secure Boot vérifie la chaîne de confiance du firmware et du OS ; FileVault chiffre le contenu disque. Ensemble ils couvrent l'intégrité au boot et la confidentialité au repos, objectif standard des déploiements enterprise macOS.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── Gatekeeper (10) ─────────────────────────────────────────────────────
  {
    id: "asec-gk01",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "Une application métier signée mais non notarisée est bloquée au lancement. Solution enterprise temporaire ?",
    correct: "Autoriser le Team ID développeur via payload SystemPolicyControl (MDM)",
    distractors: ["Désactiver SIP globalement", "Autoriser « Anywhere » via defaults write permanent", "Jailbreak du Mac"],
    explanation:
      "Le profil com.apple.systempolicy.control permet une allow list de Team IDs signés pendant la migration vers la notarisation. C'est préférable à spctl --master-disable qui affaiblit toute la flotte et n'est pas durable en compliance.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk02",
    domain: "gatekeeper",
    difficulty: "easy",
    text: "La notarisation Apple pour macOS garantit principalement :",
    correct: "Qu'Apple a scanné le binaire pour malware avant distribution hors App Store",
    distractors: ["Que l'application est gratuite", "Le chiffrement FileVault automatique", "La supervision ADE de l'appareil"],
    explanation:
      "Notarization est une étape de soumission à Apple incluant scan automatique et stapling du ticket. Gatekeeper vérifie signature Developer ID + ticket notarized au premier lancement, réduisant les apps malveillantes sideload.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk03",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "Payload MDM « Allow apps from App Store and identified developers » vs « App Store only » : impact enterprise ?",
    correct: "« Identified developers » autorise les apps signées Developer ID (notarisées) hors App Store",
    distractors: ["Aucune différence sur macOS Ventura+", "« App Store only » autorise les PKG internes", "Les deux bloquent Java"],
    explanation:
      "La restriction la plus stricte limite aux apps App Store. La plupart des flottes corporate autorisent identified developers + notarization, combiné à une allow list Team ID pour les outils internes en transition.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk04",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "spctl --assess --verbose sur une app échoue avec « rejected (the code is valid but does not seem to be an app) ». Cause ?",
    correct: "Le bundle n'a pas la structure Mach-O exécutable attendue ou le binaire principal est mal référencé",
    distractors: ["FileVault bloque l'évaluation", "APNs expiré", "SIP désactivé"],
    explanation:
      "Gatekeeper évalue le CFBundleExecutable et la signature. Les outils CLI mal empaquetés, scripts renommés en .app ou builds corrompus échouent cette vérification indépendamment de la notarisation. Rebuild et re-signer le bundle.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk05",
    domain: "gatekeeper",
    difficulty: "easy",
    text: "Qu'est-ce que le « ticket stapling » de notarisation ?",
    correct: "Attacher le ticket notarized au binaire pour validation offline par Gatekeeper",
    distractors: ["Agrafer un PDF de conformité dans le DMG", "Lier l'app à un Apple ID utilisateur", "Certificat APNs pour l'application"],
    explanation:
      "stapler staple le ticket notarization dans l'app ou le PKG. Sans staple, Gatekeeper peut exiger une vérification en ligne au premier lancement. Les pipelines CI enterprise incluent xcrun notarytool submit puis staple avant distribution interne.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk06",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "Un PKG interne signé Developer ID mais non notarisé : comportement Gatekeeper par défaut sur macOS Sonoma ?",
    correct: "Bloqué ou avertissement — la notarisation est requise pour installation silencieuse sans override utilisateur",
    distractors: ["Installé silencieusement via MDM sans condition", "Autorisé car PKG ≠ app", "Ignoré si signé avec certificat MDM"],
    explanation:
      "Les PKG hors App Store suivent les mêmes exigences notarization. MDM peut installer des PKG signés via commande InstallEnterpriseApplication, mais Gatekeeper s'applique au contenu. Notariser reste la voie supportée.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk07",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "Quel outil CLI vérifie la politique Gatekeeper effective sur un Mac managé ?",
    correct: "spctl --status et profiles pour les payloads SystemPolicyControl",
    distractors: ["fdesetup only", "profiles -P uniquement pour Wi-Fi", "systemextensionsctl pour Gatekeeper"],
    explanation:
      "spctl --status montre assessments enabled/disabled. Les profils MDM SystemPolicyControl et SystemPolicyRules overrident les réglages locaux. Croiser spctl, log show --predicate 'subsystem == \"com.apple.security.syspolicy\"' pour le dépannage.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk08",
    domain: "gatekeeper",
    difficulty: "hard",
    text: "App universelle (Intel + arm64) : une branche arm64 non notarisée mais x86_64 notarisée. Gatekeeper sur M-series ?",
    correct: "Échec — toutes les architectures livrées doivent être couvertes par la soumission notarized",
    distractors: ["Seule la branche native compte", "Gatekeeper ignore fat binary", "La branche Intel est utilisée via Rosetta sans scan"],
    explanation:
      "Apple exige que chaque executable dans le universal binary soit inclus dans la soumission notarization. Sur Apple Silicon, la slice arm64 est exécutée nativement ; une slice non conforme bloque l'app même si l'autre est notarized.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk09",
    domain: "gatekeeper",
    difficulty: "easy",
    text: "Gatekeeper contrôle principalement :",
    correct: "L'exécution des applications et l'origine logicielle (signature, notarisation)",
    distractors: ["Le chiffrement Wi-Fi enterprise", "Les tokens push MDM", "Les profils de certificats email"],
    explanation:
      "Gatekeeper est la couche « qu'est-ce qui peut s'exécuter ». Il complète XProtect (malware connu) et SIP (intégrité système). Les admins le configurent via MDM plutôt que d'inviter les utilisateurs à contourner via clic droit > Ouvrir.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-gk10",
    domain: "gatekeeper",
    difficulty: "medium",
    text: "Restriction « disable override » via MDM sur Gatekeeper empêche :",
    correct: "Le contournement manuel par l'utilisateur (clic droit Ouvrir) pour apps non conformes",
    distractors: ["L'installation de mises à jour Apple", "L'escrow FileVault", "Le check-in MDM"],
    explanation:
      "AllowOverride=false verrouille la politique. Utile pour empêcher les utilisateurs d'autoriser des outils non notarisés. Combiner avec allow list Team ID pour les exceptions contrôlées plutôt qu'un override utilisateur permanent.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },

  // ── XProtect (8) ────────────────────────────────────────────────────────
  {
    id: "asec-xp01",
    domain: "xprotect",
    difficulty: "easy",
    text: "Comment XProtect reçoit-il les mises à jour de signatures antimalware ?",
    correct: "Via les mises à jour de sécurité système silencieuses (com.apple.XProtectPayloads)",
    distractors: ["Téléchargement manuel depuis l'App Store", "Un abonnement antivirus tiers obligatoire", "Renouvellement du certificat APNs"],
    explanation:
      "Apple pousse XProtect et MRT (Malware Removal Tool) indépendamment des grosses versions macOS. Les Mac managés doivent autoriser les security updates rapidement ; bloquer les updates expose la flotte aux signatures obsolètes.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp02",
    domain: "xprotect",
    difficulty: "medium",
    text: "XProtect Remediator (MRT) diffère de XProtect classique car :",
    correct: "Il peut supprimer ou neutraliser activement des malwares déjà présents",
    distractors: ["Il remplace FileVault", "Il nécessite une licence enterprise séparée", "Il scanne uniquement les emails"],
    explanation:
      "XProtect analyse à l'ouverture et au téléchargement ; MRT/XProtect Remediator exécute des actions correctives sur menaces identifiées. Les deux sont intégrés — pas un substitut à EDR tiers mais une baseline obligatoire à ne pas désactiver.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp03",
    domain: "xprotect",
    difficulty: "medium",
    text: "Un utilisateur télécharge un outil signé ; XProtect bloque à l'ouverture malgré notarisation récente. Explication plausible ?",
    correct: "Signature ajoutée après soumission notarized — révoquée ou détectée post-notarization",
    distractors: ["FileVault corrompu", "Gatekeeper désactivé empêche XProtect", "SIP bloque les mises à jour XProtect"],
    explanation:
      "Apple peut révoquer des apps notarized si malware découvert ultérieurement (notarization revocation). XProtect utilise des signatures plus récentes que le ticket staple. Vérifier Gatekeeper logs et OCSP/CRL ; retirer l'app du parc via MDM.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp04",
    domain: "xprotect",
    difficulty: "hard",
    text: "Comment auditer la version XProtect installée sur un parc macOS via MDM ?",
    correct: "Inventaire Software Update / attribut extension ou script lisant Info.plist de XProtect payloads",
    distractors: ["Uniquement via antivirus tiers", "Le serial number ABM", "Certificat push APNs version"],
    explanation:
      "Jamf Extension Attributes et Intune custom fields lisent /Library/Apple/System/Library/CoreServices/XProtect.bundle ou les receipts des updates. Corréler avec les Mac sans security update depuis X jours pour risque de couverture antimalware stale.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp05",
    domain: "xprotect",
    difficulty: "easy",
    text: "XProtect analyse les fichiers principalement :",
    correct: "Au téléchargement, à l'ouverture et à l'exécution (signatures connues)",
    distractors: ["Uniquement lors du backup Time Machine", "Seulement les apps App Store", "En continu comme un scan planifié complet du disque"],
    explanation:
      "XProtect n'est pas un antivirus à scan planifié complet type enterprise EDR. Il applique des signatures sur points d'entrée. Microsoft Defender ou CrowdStrike complètent pour comportement et visibilité SOC.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp06",
    domain: "xprotect",
    difficulty: "medium",
    text: "Bloquer toutes les mises à jour macOS via MDM : impact XProtect ?",
    correct: "Signatures antimalware obsolètes — exposition accrue même si Gatekeeper reste actif",
    distractors: ["Aucun — XProtect est indépendant des updates", "FileVault se désactive", "XProtect se met à jour via App Store apps"],
    explanation:
      "Les security-only updates transportent souvent XProtect/MRT. Une policy OS max/min mal calibrée ou un freeze updates prolongé crée une fenêtre de vulnérabilité. Autoriser au minimum les rapid security responses et XProtect payload updates.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp07",
    domain: "xprotect",
    difficulty: "hard",
    text: "Conflit entre XProtect Remediator et un EDR tiers supprimant le même fichier : bonne pratique ?",
    correct: "Coordonner exclusions EDR avec chemins système Apple ; ne pas désactiver XProtect",
    distractors: ["Désinstaller XProtect via SIP off", "Désactiver Gatekeeper", "Ignorer — le premier gagne toujours"],
    explanation:
      "EDR agressifs peuvent quarantiner des composants légitimes ou rivaliser avec MRT. Apple ne supporte pas la désactivation de XProtect. Ajuster exclusions vendor-specific tout en conservant les security updates Apple.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-xp08",
    domain: "xprotect",
    difficulty: "medium",
    text: "XProtect sur macOS vs iOS : différence majeure pour l'admin enterprise ?",
    correct: "iOS/XProtect intégré sans visibilité logs comparable ; macOS permet plus de diagnostic et coexistence EDR",
    distractors: ["XProtect n'existe pas sur iOS", "iOS requiert notarization Developer ID", "macOS n'a pas XProtect sur Apple Silicon"],
    explanation:
      "Les deux plateformes embarquent des mécanismes antimalware Apple, mais iOS sandbox limite l'investigation. Les stratégies enterprise macOS incluent monitoring EDR ; iOS repose sur supervision, restrictions et Managed Open In.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── SIP (10) ────────────────────────────────────────────────────────────
  {
    id: "asec-sip01",
    domain: "sip",
    difficulty: "easy",
    text: "System Integrity Protection (SIP) protège principalement :",
    correct: "Fichiers système, processus kernel et zones sensibles — même contre root",
    distractors: ["Uniquement les photos iCloud", "Les emails utilisateur dans Mail.app", "Les téléchargements Safari"],
    explanation:
      "SIP restreint l'écriture dans /System, /usr (sauf /usr/local), les entitlements kernel et NVRAM protégée. Les outils legacy demandant SIP off indiquent souvent une incompatibilité à migrer vers System Extensions ou MDM.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip02",
    domain: "sip",
    difficulty: "medium",
    text: "SIP a été désactivé en Recovery pour dépannage. Remédiation enterprise ?",
    correct: "Recovery → csrutil enable → redémarrage ; documenter l'exception et rescan conformité",
    distractors: ["Laisser SIP off pour éviter futurs blocages", "Effacer le Mac depuis ABM uniquement", "Renouveler le token MDM"],
    explanation:
      "SIP off est un signal de compromission ou mauvaise pratique. Réactiver immédiatement, vérifier intégrité OS, et utiliser un MDM compliance rule « SIP enabled » pour alerter. Jamf et Intune peuvent inventorier csrutil status.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip03",
    domain: "sip",
    difficulty: "medium",
    text: "csrutil status affiche « custom configuration ». Signification ?",
    correct: "Certaines protections SIP sont désactivées sélectivement (ex. allow unsigned kexts)",
    distractors: ["Configuration MDM FileVault", "Mode développeur Xcode normal sans risque", "APNs en mode debug"],
    explanation:
      "csrutil enable --without kext par exemple affaiblit SIP partiellement. En enterprise, toute config custom doit être exception approuvée. Les kexts legacy poussent vers System Extensions ou remplacement software.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip04",
    domain: "sip",
    difficulty: "hard",
    text: "Un agent sécurité tiers exige SIP disabled. Décision architecte enterprise ?",
    correct: "Refuser ou exiger migration vers System Extension / Endpoint Security API compatible SIP",
    distractors: ["Désactiver SIP fleet-wide via script", "Remplacer par antivirus Windows", "Utiliser user enrollment BYOD"],
    explanation:
      "Apple Endpoint Security framework et System Extensions permettent monitoring avec SIP actif. Désactiver SIP sur des milliers de Macs viole CIS benchmarks et Conditional Access. Exiger roadmap vendor conforme Apple platform security.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip05",
    domain: "sip",
    difficulty: "easy",
    text: "Où vérifie-t-on l'état SIP sur un Mac ?",
    correct: "Terminal : csrutil status (depuis macOS booté) ou Recovery pour modification",
    distractors: ["Réglages Système > Apple ID", "Console ABM", "Certificat APNs dans Trousseau"],
    explanation:
      "csrutil status en mode normal indique enabled/disabled. La modification nécessite Recovery (Intel ou Apple Silicon). Les scripts MDM d'inventaire automatisent la collecte pour compliance dashboards.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip06",
    domain: "sip",
    difficulty: "medium",
    text: "SIP et modification de /System via MDM :",
    correct: "MDM ne contourne pas SIP — les patches OS passent par Software Update Apple signés",
    distractors: ["MDM peut écrire dans /System avec profil root", "SIP se désactive automatiquement si supervisé", "Les PKG MDM modifient le kernel directement"],
    explanation:
      "Les payloads MDM agissent dans des domaines autorisés (profiles, user space). Toute tentative d'altérer le système hors mécanismes Apple viole SIP. Les custom packages doivent installer dans /Library ou Application Support.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip07",
    domain: "sip",
    difficulty: "medium",
    text: "SIP protège-t-il les données utilisateur dans ~/Documents ?",
    correct: "Non directement — FileVault et TCC protègent les données user ; SIP vise l'intégrité système",
    distractors: ["Oui, SIP chiffre Documents", "SIP remplace Gatekeeper pour Documents", "Documents sont dans une partition SIP"],
    explanation:
      "Comprendre la séparation des couches : SIP empêche malware root de persister dans le OS ; FileVault protège confidentialité ; TCC contrôle accès apps aux données. Un audit security stack couvre les trois.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip08",
    domain: "sip",
    difficulty: "hard",
    text: "Apple Silicon Mac avec Reduced Security boot policy : rapport avec SIP ?",
    correct: "Politique boot distincte — Reduced Security peut autoriser OS plus permissif ; SIP reste généralement actif en mode standard",
    distractors: ["Reduced Security désactive FileVault automatiquement", "SIP n'existe pas sur M-series", "Identique à csrutil disable"],
    explanation:
      "Startup Security Utility permet Full vs Reduced Security pour dual-boot ou kernels non signés. En enterprise, Full Security est standard. Reduced Security ≠ SIP off mais augmente la surface ; bloquer via supervision et ADE.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip09",
    domain: "sip",
    difficulty: "easy",
    text: "Pourquoi les guides Apple déconseillent csrutil disable en production ?",
    correct: "Malware ou admin compromis peut modifier le OS de façon persistante",
    distractors: ["Cela invalide la garantie hardware uniquement", "Cela bloque Wi-Fi enterprise", "Cela empêche MDM enrollment"],
    explanation:
      "SIP est une défense profonde contre persistence rootkits. Les environnements dev peuvent temporairement l'affaiblir ; production corporate exige enabled et monitoring compliance.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-sip10",
    domain: "sip",
    difficulty: "medium",
    text: "Compliance Intune « System Integrity Protection enabled » échoue sur un Mac pourtant sain : cause ?",
    correct: "Delay inventaire, Mac non check-in, ou config custom SIP non reconnue comme enabled",
    distractors: ["FileVault désactivé", "Gatekeeper en App Store only", "Token ABM expiré"],
    explanation:
      "Forcer un check-in MDM et vérifier csrutil status localement. Les configs custom peuvent être traitées comme non compliant selon la règle. Aligner la policy sur « fully enabled » sans exceptions non approuvées.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── Activation Lock (10) ────────────────────────────────────────────────
  {
    id: "asec-al01",
    domain: "activation-lock",
    difficulty: "medium",
    text: "iPhone supervisé ADE bloqué sur Activation Lock après reset. Déblocage IT standard ?",
    correct: "Bypass code ABM ou effacement supervisé MDM avec Activation Lock override",
    distractors: ["Reset mot de passe Apple ID personnel seul", "Jailbreak puis restore", "Recovery DFU sans MDM"],
    explanation:
      "Les appareils owned-by-organization inscrits ABM avec Activation Lock managé permettent bypass via ABM ou commande MDM Erase avec clear Activation Lock si configuré. Documenter les bypass codes lors du déploiement ADE.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al02",
    domain: "activation-lock",
    difficulty: "medium",
    text: "Find My iPhone personnel activé avant assignation ABM : conséquence ?",
    correct: "Activation Lock persiste après effacement IT jusqu'à retrait Find My ou procédure utilisateur",
    distractors: ["ABM efface automatiquement Find My", "FileVault Mac est impacté", "Le token APNs expire"],
    explanation:
      "Les appareils achetés via canaux non-ABM ou avec compte perso pré-configuré gardent le lien iCloud. Procédure : retirer Find My avant reassignment ou utiliser Apple Configurator pour ajouter à ABM avec workflow release. Prévenir via achats ABM-only.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al03",
    domain: "activation-lock",
    difficulty: "easy",
    text: "Activation Lock sur Mac avec puce T2 / Apple Silicon :",
    correct: "Lié à Find My / compte Apple — empêche réactivation sans identifiants ou bypass org",
    distractors: ["Uniquement sur iPhone", "Désactivé par FileVault", "Contrôlé par certificat Wi-Fi"],
    explanation:
      "Activation Lock s'étend aux Mac T2+ avec Find My Mac. En ADE, l'org peut imposer Activation Lock managé sans compte perso. Essentiel pour anti-vol parc desktop portable.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al04",
    domain: "activation-lock",
    difficulty: "hard",
    text: "Policy MDM « Activation Lock Allowed While Supervised » = false : effet ?",
    correct: "Empêche l'utilisateur d'activer Activation Lock lié à un Apple ID perso sur appareil supervisé",
    distractors: ["Désactive FileVault", "Bloque toutes les mises à jour iOS", "Supprime le bypass ABM"],
    explanation:
      "Restriction iOS/macOS supervisé pour empêcher Find My perso sur corporate devices. Combiner avec Managed Apple Account strategy et block personal iCloud via restrictions pour éviter lockout au offboarding.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al05",
    domain: "activation-lock",
    difficulty: "medium",
    text: "Où récupérer le bypass code Activation Lock pour un appareil ABM ?",
    correct: "Apple Business Manager > Devices > sélectionner l'appareil > Activation Lock bypass code",
    distractors: ["App Store Connect > Users", "Certificat APNs MDM", "Intune > Conditional Access"],
    explanation:
      "ABM stocke le bypass code pour appareils eligible MDM-managed Activation Lock. Le helpdesk doit accéder ABM avec rôle approprié. Jamf/Intune peuvent aussi afficher le statut Activation Lock inventaire.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al06",
    domain: "activation-lock",
    difficulty: "easy",
    text: "Activation Lock diffère du code passe écran car :",
    correct: "Il lie l'appareil au compte iCloud/organisational — reformatage ne suffit pas sans bypass",
    distractors: ["C'est identique au PIN SIM", "Il chiffre uniquement Photos", "Il remplace MDM enrollment"],
    explanation:
      "Le passcode protège l'accès local ; Activation Lock empêche reconfiguration après effacement. C'est la différence clé pour vol device et pourquoi les orgs activent le mode managé via ABM.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al07",
    domain: "activation-lock",
    difficulty: "medium",
    text: "Employé quitte l'entreprise avec iPhone corporate et Find My perso actif. Action préventive idéale ?",
    correct: "Procédure offboarding : effacement supervisé MDM + retrait Activation Lock avant restitution",
    distractors: ["Changer uniquement le passcode MDM", "Retirer le profil Wi-Fi", "Attendre expiration ABM token"],
    explanation:
      "Sans effacement supervisé et clear lock, l'iPhone devient brique pour reuse. Workflows Intune/Jamf automatisent wipe + verify Activation Lock cleared. SSO offboarding doit déclencher wipe corporate mobile.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al08",
    domain: "activation-lock",
    difficulty: "hard",
    text: "Shared iPad avec Managed Apple ID : Activation Lock géré comment ?",
    correct: "Mode supervisé + ADE — Activation Lock org sans lien compte perso étudiant",
    distractors: ["Pas d'Activation Lock sur Shared iPad", "Chaque élève crée Find My perso obligatoire", "FileVault gère le lock"],
    explanation:
      "Shared iPad en éducation/retail utilise Managed Apple IDs et supervision pour éviter locks personnels. Policies ABM et restrictions iCloud empêchent Find My perso sur devices partagés.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al09",
    domain: "activation-lock",
    difficulty: "medium",
    text: "Mac portable volé avec Find My Mac org activé : capacité IT à distance ?",
    correct: "Localiser, verrouiller, effacer via MDM/Find My org — réactivation bloquée sans bypass",
    distractors: ["Déverrouiller FileVault à distance sans clé", "Désactiver SIP via cloud", "Restaurer backup iCloud user"],
    explanation:
      "Find My + Activation Lock org complète FileVault : données chiffrées et appareil inutilisable pour revente. Remote wipe via Intune/Jamf/ABM avec processus bypass documenté pour remplacement hardware.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-al10",
    domain: "activation-lock",
    difficulty: "easy",
    text: "Pour éviter Activation Lock perso sur flotte iOS corporate, achat recommandé :",
    correct: "Canal Apple Business Manager / Apple Authorized Reseller avec assignation MDM server",
    distractors: ["Retail Apple Store sans lien ABM", "Marketplace occasion sans wipe", "Import Configurator seul sans ABM"],
    explanation:
      "ADE depuis ABM garantit supervision et Activation Lock organisation dès le premier boot. Les achats hors programme laissent souvent des comptes perso et compliquent le lifecycle.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── MDA — Managed Device Attestation (8) ────────────────────────────────
  {
    id: "asec-mda01",
    domain: "mda",
    difficulty: "medium",
    text: "Managed Device Attestation échoue sur iPhone BYOD user enrollment. Cause ?",
    correct: "Attestation requiert appareil supervisé ADE — user enrollment insuffisant",
    distractors: ["FileVault non activé sur iPhone", "Gatekeeper macOS", "Certificat email manquant"],
    explanation:
      "Device Attestation (Apple + CA) valide l'intégrité hardware/software sur appareils managed corporate. BYOD user enrollment n'offre pas le même niveau ; Conditional Access avec attestation exige supervised fleet iOS 16+ / macOS 14+ selon policy.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda02",
    domain: "mda",
    difficulty: "medium",
    text: "Attestation iOS enterprise typique combine :",
    correct: "Supervision ADE + OS minimum + policy MDM attestation + CA (ex. Microsoft Entra)",
    distractors: ["Apple ID perso + iCloud Keychain", "macOS Mojave + jailbreak detect", "APNs seul sans MDM"],
    explanation:
      "Microsoft et autres IdP utilisent Apple Device Attestation pour prouver device genuineness avant émission certificat auth. Prérequis : enrollment conforme, OS supporté, pas de compromission signalee.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda03",
    domain: "mda",
    difficulty: "hard",
    text: "Attestation macOS échoue après OS update overnight — piste principale ?",
    correct: "Version OS sous minimum attestation ou reboot pending avant regénération attestation",
    distractors: ["Wi-Fi guest changé", "Safari cache", "Serial ABM réassigné"],
    explanation:
      "Les policies CA lient attestation à build OS specifique. Fast ring updates peuvent temporairement fail jusqu'à patch IdP. Vérifier compliance OS min, forcer check-in, consulter logs MDM Attestation payload.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda04",
    domain: "mda",
    difficulty: "easy",
    text: "Device Attestation sert principalement à :",
    correct: "Prouver cryptographiquement qu'un appareil est authentique et conforme avant accès ressources",
    distractors: ["Chiffrer le disque dur", "Pousser apps VPP", "Configurer Wi-Fi enterprise"],
    explanation:
      "Zero Trust modern utilise attestation au lieu de confiance implicite IP. Apple fournit le mécanisme hardware-backed ; Entra/Jamf Trust complètent la chaîne jusqu'à Conditional Access.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda05",
    domain: "mda",
    difficulty: "medium",
    text: "Différence attestation vs compliance MDM classique (FileVault ON) ?",
    correct: "Attestation = preuve crypto intégrité device ; compliance = états configurables rapportés par agent",
    distractors: ["Identiques — synonymes", "Compliance remplace attestation sur iOS 17", "Attestation ne fonctionne que sur Android"],
    explanation:
      "Compliance vérifie FileVault, OS version, jailbreak indicators. Attestation ajoute une assertion signée Secure Enclave difficile à falsifier. Les deux peuvent être requis simultanément pour accès M365 haute sensibilité.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda06",
    domain: "mda",
    difficulty: "hard",
    text: "Mac avec Reduced Security boot échoue attestation Entra. Pourquoi ?",
    correct: "Politique boot affaiblie incompatible avec garanties d'intégrité attestation",
    distractors: ["FileVault escrow manquant uniquement", "Team ID Gatekeeper", "Managed Apple ID expiré"],
    explanation:
      "Attestation valide secure boot chain. Reduced Security autorise kernels non standard — signal de risque. Remettre Full Security, re-enroll si nécessaire, regénérer certificat device.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda07",
    domain: "mda",
    difficulty: "easy",
    text: "Quel type d'enrollment Apple est requis pour Device Attestation enterprise ?",
    correct: "Automated Device Enrollment (ADE) supervisé — pas enrollment personnel ad hoc",
    distractors: ["Invitation email Apple Configurator sans ABM", "Compte iCloud famille", "Profile web téléchargé sans supervision"],
    explanation:
      "La supervision ADE établit la chaîne de confiance MDM-org-device nécessaire aux payloads sécurité avancés incluant attestation. User enrollment BYOD est hors périmètre attestation stricte.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-mda08",
    domain: "mda",
    difficulty: "medium",
    text: "Renouvellement certificat attestation device : bonne pratique ?",
    correct: "Automatiser via MDM + IdP avec surveillance expiration inventaire — rotation avant échec auth",
    distractors: ["Désactiver attestation après 90 jours", "Utiliser certificat wildcard SSL web", "Rotation manuelle par utilisateur final"],
    explanation:
      "Les certificats attestation ont une durée de vie. Intune/Jamf inventaire + alertes évitent outage massif Conditional Access. Tester renewal sur groupe pilote avant expiration CA root.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── Compliance (10) ─────────────────────────────────────────────────────
  {
    id: "asec-cmp01",
    domain: "compliance",
    difficulty: "medium",
    text: "Stack Microsoft : FileVault conforme Intune → Conditional Access Entra. Chaîne correcte ?",
    correct: "Mac reporte FileVault ON → Intune marque compliant → CA autorise accès M365",
    distractors: ["CA ignore Intune pour macOS", "FileVault communique directement à Entra", "Jamf seul sans connecteur"],
    explanation:
      "Intune compliance policies alimentent Entra device state. CA rules « require compliant device » bloquent Exchange/SharePoint si FileVault off ou OS trop vieux. Intégrer Apple compliance dans identity fabric.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp02",
    domain: "compliance",
    difficulty: "easy",
    text: "Secure Enclave stocke principalement :",
    correct: "Clés biométriques, clés crypto device-bound et secrets Touch ID / unlock",
    distractors: ["Documents utilisateur en clair", "Profils MDM XML", "Tokens ABM server"],
    explanation:
      "Le Secure Enclave est isolé du CPU principal — même le kernel ne lit pas directement les clés. FileVault, attestation et biometrics s'appuient dessus ; compromission logicielle ne extrait pas facilement les clés.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp03",
    domain: "compliance",
    difficulty: "medium",
    text: "Grace period compliance policy Intune 24h après violation : usage ?",
    correct: "Laisser accès temporaire tout en notifiant utilisateur pour remédier avant blocage CA",
    distractors: ["Désactiver FileVault automatiquement", "Supprimer MDM enrollment", "Ignorer violations indéfiniment"],
    explanation:
      "Grace period équilibre UX et sécurité — ex. escrow FileVault en attente après deploy profil. Trop long = risque ; zéro = helpdesk saturé. Aligner avec SLA remediation corporate.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp04",
    domain: "compliance",
    difficulty: "hard",
    text: "Mac compliant hier, non compliant aujourd'hui sans changement user visible : causes top 3 ?",
    correct: "OS update hors max version, escrow FileVault expiré, SIP/EDR status changé",
    distractors: ["Logo wallpaper changé", "Langue clavier", "Nom du Mac renommé"],
    explanation:
      "Les policies silent OS updates ou deferred FileVault causent des flapping compliance. Dashboard Intune/Jamf montre raison exacte par device. Automatiser security updates compatibles compliance bounds.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp05",
    domain: "compliance",
    difficulty: "medium",
    text: "Jamf Compliance Editor avec Microsoft Entra : rôle ?",
    correct: "Mapper critères Jamf (extensions, apps, SIP) vers état compliant Entra pour CA",
    distractors: ["Remplacer APNs Apple", "Gérer achats VPP uniquement", "Créer certificats Wi-Fi"],
    explanation:
      "Les orgs Jamf+Microsoft utilisent Compliance Editor pour étendre au-delà d'Intune native Mac management. Unifie Conditional Access pour flottes hybrides Jamf-managed.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp06",
    domain: "compliance",
    difficulty: "easy",
    text: "CIS Apple macOS benchmark en enterprise sert à :",
    correct: "Baseline durcissement alignée audits — complète policies MDM compliance",
    distractors: ["Remplacer ABM", "Configurer APNs", "Licences App Store"],
    explanation:
      "CIS fournit checklist (FileVault, Gatekeeper, logging). Mapper chaque contrôle à un profil MDM ou EDR rule pour preuve audit SOC2/ISO27001.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp07",
    domain: "compliance",
    difficulty: "medium",
    text: "Non-compliance action « mark device inactive » vs « block access » :",
    correct: "Block = CA coupe accès ; mark inactive = reporting sans blocage immédiat selon config",
    distractors: ["Identiques sur macOS", "Mark inactive efface le Mac", "Block supprime Apple ID"],
    explanation:
      "Configurer actions selon sévérité : block pour FileVault off, notify-only pour grace period OS. Harmoniser avec HR offboarding pour wipe vs block.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp08",
    domain: "compliance",
    difficulty: "hard",
    text: "Compliance exige « Microsoft Defender healthy » sur Mac : prérequis souvent oublié ?",
    correct: "PPPC Full Disk Access + Network Extension pour Defender + daemon non tué",
    distractors: ["SIP disabled", "Gatekeeper Anywhere", "Bootstrap Token révoqué"],
    explanation:
      "Defender macOS requiert FDA via PPPC profile et parfois System Extension approval. Sans cela, tamper protection fail et Intune marque unhealthy malgré install PKG.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp09",
    domain: "compliance",
    difficulty: "medium",
    text: "Minimum OS version compliance vs « latest OS » : piège enterprise ?",
    correct: "« Latest » force updates immédiats — risque casse apps ; min/max bande est plus sûr",
    distractors: ["Latest est toujours recommandé sans test", "Min OS n'est pas supporté par Apple", "macOS n'a pas de min OS MDM"],
    explanation:
      "Définir floor (security) et ceiling (validation apps métier). Pilot ring avant élargir max version. Rapid Security Response peut être autorisé sans full OS bump.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-cmp10",
    domain: "compliance",
    difficulty: "easy",
    text: "Conditional Access « require compliant device » protège :",
    correct: "Accès cloud (M365, SaaS) si l'appareil ne respecte pas policies sécurité org",
    distractors: ["Uniquement le réseau Wi-Fi local", "Physical USB ports", "Imprimantes AirPrint"],
    explanation:
      "CA est identity-centric : même sur réseau trusted, device non compliant bloque token OAuth. Fondamental Zero Trust Apple + Microsoft stack.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── Privacy Preferences / PPPC (8) ──────────────────────────────────────
  {
    id: "asec-pppc01",
    domain: "privacy-preferences",
    difficulty: "easy",
    text: "Un profil PPPC (Privacy Preferences Policy Control) sert à :",
    correct: "Pré-approuver accès TCC (disque complet, caméra, micro) pour apps gérées",
    distractors: ["Configurer Wi-Fi enterprise", "Renouveler certificat APNs", "Assigner licences VPP"],
    explanation:
      "Sans PPPC, macOS affiche des prompts utilisateur pour Full Disk Access, Contacts, etc. Les agents EDR, backup et MDM helpers requièrent PPPC déployé via MDM pour fonctionnement silencieux et compliance.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc02",
    domain: "privacy-preferences",
    difficulty: "medium",
    text: "PPPC avec IdentifierType bundleID vs path : recommandation ?",
    correct: "bundleID préféré — résiste aux déplacements app ; path pour binaires CLI sans bundle",
    distractors: ["path toujours obligatoire", "PPPC ne supporte pas bundleID", "IdentifierType n'existe pas"],
    explanation:
      "com.apple.TCC.configuration.profile avec Identifier com.vendor.app et CodeRequirement (anchor apple generic...) garantit que seul le binaire signé attendu reçoit TCC. CLI tools utilisent path absolu avec signature requirement.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc03",
    domain: "privacy-preferences",
    difficulty: "medium",
    text: "Microsoft Defender demande Full Disk Access mais reste unhealthy : diagnostic ?",
    correct: "PPPC FDA manquant ou CodeRequirement ne match pas binaire installé (wrong build)",
    distractors: ["FileVault off", "Gatekeeper App Store only", "ABM token expiré"],
    explanation:
      "Comparer bundle version Defender avec PPPC profile. Updates Defender changent parfois path helper binaries — mettre à jour PPPC via MDM dynamiquement. Vérifier tccutil reset n'a pas été poussé par script conflictuel.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc04",
    domain: "privacy-preferences",
    difficulty: "hard",
    text: "PPPC Allowed vs AllowStandardUserToSetSystemService sur SystemPolicyAllFiles :",
    correct: "Allowed accorde FDA silencieux ; AllowStandardUserToSetSystemService laisse user modifier — éviter en enterprise",
    distractors: ["Identiques", "Allowed bloque FDA", "SystemPolicyAllFiles n'est pas TCC"],
    explanation:
      "Les payloads mal configurés laissent utilisateurs révoquer FDA dans Réglages, cassant EDR. Verrouiller via MDM et surveiller tcc.db avec privacy audit tools en cas incident.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc05",
    domain: "privacy-preferences",
    difficulty: "easy",
    text: "TCC (Transparency, Consent, and Control) gère :",
    correct: "Autorisations confidentialité macOS (caméra, micro, fichiers, accessibilité)",
    distractors: ["Tokens push MDM", "Certificats SSL Wi-Fi", "Serial numbers ABM"],
    explanation:
      "TCC est le framework prompts privacy. PPPC est la voie enterprise MDM pour pré-consent. Distinct de Gatekeeper (exécution apps) et FileVault (chiffrement).",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc06",
    domain: "privacy-preferences",
    difficulty: "medium",
    text: "Jamf Connect ou agent SSO exige Accessibility PPPC car :",
    correct: "Interception touches clavier / menu bar login extensions nécessite entitlement accessibility",
    distractors: ["Chiffrement FileVault", "Push APNs notifications", "Scan XProtect"],
    explanation:
      "Les outils SSO macOS simulant keystrokes ou overlay login window déclenchent TCC Accessibility. Déployer PPPC avant rollout sinon chaque user doit approuver manuellement — casse zero-touch.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc07",
    domain: "privacy-preferences",
    difficulty: "hard",
    text: "User Approved MDM (UAMDM) requis pour certains PPPC : implication enrollment ?",
    correct: "ADE supervisé accorde UAMDM au bootstrap — user enrollment limite payloads TCC avancés",
    distractors: ["UAMDM remplace APNs", "UAMDM désactive SIP", "Non requis sur macOS Ventura"],
    explanation:
      "Certains accès TCC sensibles exigent que l'utilisateur ou ADE ait approuvé MDM. ADE supervised fleet obtient UAMDM automatiquement ; BYOD profile install seul peut bloquer PPPC SystemPolicyAllFiles.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-pppc08",
    domain: "privacy-preferences",
    difficulty: "medium",
    text: "Audit PPPC déployé vs effectif sur un Mac : commande utile ?",
    correct: "sudo tccutil ou sqlite3 lecture TCC.db + comparaison profiles list",
    distractors: ["fdesetup status seul", "networksetup -listallhardwareports", "defaults read com.apple.APNs"],
    explanation:
      "Dépannage : profiles show -type configuration pour PPPC payload, croiser avec System Settings > Privacy. Les conflits multi-profiles MDM peuvent écraser partiellement — consolider un seul PPPC master profile.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── System Extensions (8) ───────────────────────────────────────────────
  {
    id: "asec-se01",
    domain: "system-extensions",
    difficulty: "medium",
    text: "Direction Apple : Kernel Extensions (kexts) vs System Extensions ?",
    correct: "System Extensions user-space remplacent kexts dépréciés — compatible SIP",
    distractors: ["kexts obligatoires sur Apple Silicon", "Extensions interdites en enterprise", "Identiques sans migration"],
    explanation:
      "Network Extension, Endpoint Security, DriverKit migrent hors kernel. Les vendors EDR/VPN doivent ship System Extensions notarized. kext allow lists MDM sont exception temporaire Intel legacy.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se02",
    domain: "system-extensions",
    difficulty: "easy",
    text: "systemextensionsctl list montre extension « waiting for user ». Action MDM ?",
    correct: "Payload SystemExtension install + approve via MDM sans prompt user sur supervisé",
    distractors: ["Désactiver SIP fleet-wide", "Supprimer Gatekeeper", "Effacer NVRAM"],
    explanation:
      "Sur Mac supervisé ADE, MDM peut approuver system extensions silencieusement via com.apple.system-extension-policy. Essentiel pour EDR zero-touch ; BYOD requiert approbation utilisateur Réglages.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se03",
    domain: "system-extensions",
    difficulty: "medium",
    text: "TeamIdentifier dans profil System Extension policy : rôle ?",
    correct: "Autoriser uniquement extensions signées par Team ID vendor approuvé",
    distractors: ["Identifiant Wi-Fi SSID", "Serial ABM", "UUID profil APNs"],
    explanation:
      "Allow list Team ID identique philosophie Gatekeeper — seuls CrowdStrike, Microsoft, Zscaler etc. autorisés. Bloque extensions malveillantes ou non approuvées shadow IT.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se04",
    domain: "system-extensions",
    difficulty: "hard",
    text: "Extension réseau (content filter) + extension endpoint security du même vendor : déploiement ?",
    correct: "Deux bundles distincts — deux entrées policy MDM ; ordre install + reboot si requis",
    distractors: ["Un seul PKG suffit toujours", "Impossible d'avoir deux extensions", "Kernel extension combine les deux"],
    explanation:
      "Les EDR modernes livrent ES + Network Extension séparés. Profils MDM doivent lister chaque bundleIdentifier. Tester load order et conflits avec VPN Apple ou third-party.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se05",
    domain: "system-extensions",
    difficulty: "medium",
    text: "Legacy kext sur Mac Apple Silicon :",
    correct: "Non supporté — migration System Extension ou DriverKit obligatoire",
    distractors: ["kexts natifs M-series recommandés", "SIP off active kexts ARM", "ABM approuve kexts"],
    explanation:
      "Apple Silicon elimine la plupart des kexts Intel. Audit parc : identifier extensions kernel restantes via kmutil inspect ou inventaire Jamf avant refresh hardware.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se06",
    domain: "system-extensions",
    difficulty: "easy",
    text: "Endpoint Security System Extension permet :",
    correct: "Monitoring événements sécurité (process, file, network) via API Apple avec SIP actif",
    distractors: ["Désactiver FileVault", "Modifier /System", "Remplacer APNs"],
    explanation:
      "ES framework est la voie supportée pour EDR macOS moderne. Les agents utilisent ES au lieu de kexts pour conformité Apple platform security program.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se07",
    domain: "system-extensions",
    difficulty: "hard",
    text: "System extension load échoue après update vendor : cause fréquente ?",
    correct: "Nouvelle signature / bundle ID non mise à jour dans profil MDM allow list",
    distractors: ["FileVault rotation", "Gatekeeper staple expiré seul", "Managed Apple ID lock"],
    explanation:
      "Chaque release EDR peut changer bundle version ou identifier. Automatiser sync MDM policy avec catalog vendor. systemextensionsctl diagnose fournit erreur codes précis.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-se08",
    domain: "system-extensions",
    difficulty: "medium",
    text: "Network Extension pour VPN per-app vs système : choix enterprise ?",
    correct: "Per-app pour split tunnel apps métier ; full tunnel pour Zero Trust selon policy sécurité",
    distractors: ["VPN impossible via System Extension", "Per-app remplace MDM", "Full tunnel interdit par Apple"],
    explanation:
      "Les vendors (Cisco, Palo Alto, Zscaler) utilisent Network Extension framework. MDM peut pousser config VPN + approuver extension. Aligner avec Conditional Access et DNS filtering.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },

  // ── Troubleshooting (13) ────────────────────────────────────────────────
  {
    id: "asec-ts01",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Mac compliant hier, non compliant après update macOS overnight : première vérification ?",
    correct: "OS version vs bande min/max compliance + FileVault escrow toujours valide",
    distractors: ["Renouveler certificat APNs", "Changer wallpaper", "Serial ABM"],
    explanation:
      "Auto-update nuit est scénario classique : OS dépasse max autorisé ou security update change reporting FileVault. Intune device compliance blade montre raison exacte — ne pas wipe sans diagnostic.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts02",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "Defender macOS « unhealthy » dans Intune malgré install réussie :",
    correct: "Full Disk Access PPPC manquant ou Network Extension non approuvée",
    distractors: ["FileVault off obligatoire", "Gatekeeper Anywhere", "Token ABM invalide"],
    explanation:
      "Deploy séquence : PKG Defender → PPPC FDA → System Extension policy → verify wdavdaemon healthy. logs at /Library/Logs/Microsoft/mdatp. Compliance revient healthy après TCC correct.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts03",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "FileVault escrow absent après ADE enroll : checklist rapide ?",
    correct: "Bootstrap Token présent, profil FDE avec redirect MDM, check-in réussi",
    distractors: ["Renouveler Wi-Fi", "Désactiver XProtect", "Changer Apple ID store"],
    explanation:
      "Parcourir : profiles | grep fdesetup, jamf manage, Intune sync. Sans Bootstrap Token sur admin-less deploy, corriger workflow Setup Assistant ou pousser createBootstrapToken.",
    relatedModuleSlug: "apple-it-professional/filevault-chiffrement",
  },
  {
    id: "asec-ts04",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Gatekeeper bloque app métier après re-sign certificat expiré renouvelé :",
    correct: "Re-notariser avec nouveau certificat Developer ID et re-stapler — ancien ticket invalide",
    distractors: ["Désactiver SIP seulement", "Changer Team ID dans ABM", "Révoquer APNs"],
    explanation:
      "Renouvellement cert dev change hash signature — notarization doit être refaite. Allow list Team ID aide si même team mais ticket stale échoue quand même. Pipeline CI : sign → notarize → staple → deploy.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-ts05",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "iPhone Activation Lock après wipe non supervisé : recours IT ?",
    correct: "Bypass ABM si eligible ADE org ; sinon contact prior owner Apple ID — pas de backdoor MDM",
    distractors: ["Commande MDM unlock sans supervision", "Reset SIP Mac", "FileVault key"],
    explanation:
      "Wipe non supervisé ne clear pas lock perso. Prévention : supervision ADE + block personal Find My. Inventory Activation Lock status avant offboarding.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts06",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "csrutil status disabled sur Mac inventaire Jamf : action ?",
    correct: "Ticket helpdesk → Recovery enable SIP → compliance follow-up",
    distractors: ["Ignorer si utilisateur VIP", "Effacer via ABM sans investigation", "Désactiver Gatekeeper"],
    explanation:
      "SIP off = alerte sécurité. Smart group « SIP disabled » pour remediation automatique notification. Possible indicator compromise — envisager reimage ADE.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts07",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "MDM check-in échoue — impossible pousser PPPC update. Impact sécurité ?",
    correct: "Appareil drift — EDR sans FDA, FileVault status stale, compliance faux négatif",
    distractors: ["Aucun — profils restent dynamiques sans check-in", "FileVault se désactive", "SIP s'active automatiquement"],
    explanation:
      "Diagnostiquer APNs cert expiry, network, user removed enrollment. Mac offline prolongé = risque. Alertes last check-in > 7 days avec actions escalation.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts08",
    domain: "troubleshooting",
    difficulty: "hard",
    text: "Attestation Entra fail massif post CA cert rotation : fix ?",
    correct: "Redéployer trust chain MDM + regénérer device cert — vérifier intermediate dans payload",
    distractors: ["Désactiver Conditional Access permanent", "Wipe fleet", "Disable FileVault"],
    explanation:
      "Rotation CA mal propagée casse chaîne attestation. Staged rollout new CA with overlap period. Monitor sign-in logs Entra pour error codes attestation specific.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts09",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "XProtect bloque outil interne légitime signé : workflow ?",
    correct: "Soumettre false positive Apple + allow list distribution interne temporaire notarized",
    distractors: ["Désactiver XProtect via defaults", "SIP off", "Retirer Gatekeeper fleet"],
    explanation:
      "Vérifier si binaire match signature malware connu. Developer resubmit notarization avec fix. En parallèle Team ID allow si urgence — pas désactiver protections globales.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts10",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Utilisateur voit « You do not have permission to open the application » Gatekeeper :",
    correct: "App non notarisée ou Team ID non allow — vérifier spctl --assess et profil MDM",
    distractors: ["FileVault locked", "iCloud down", "MDM unenroll"],
    explanation:
      "Message utilisateur typique Gatekeeper block. Helpdesk : identifier app path, vérifier signature/notarization, deploy allow list ou update app. Éviter override manuel non documenté.",
    relatedModuleSlug: "apple-it-professional/gatekeeper-notarisation",
  },
  {
    id: "asec-ts11",
    domain: "troubleshooting",
    difficulty: "hard",
    text: "System Extension EDR load loop après macOS point update :",
    correct: "Vendor compatibility matrix — update agent + MDM extension policy bundle IDs",
    distractors: ["Rollback ABM assignment", "Disable FileVault", "Remove all PPPC"],
    explanation:
      "OS point releases cassent parfois ES extensions until vendor patch. Maintenir liaison vendor support + defer updates until compatibility confirmed. systemextensionsctl reset non recommandé sans guidance vendor.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts12",
    domain: "troubleshooting",
    difficulty: "medium",
    text: "PPPC déployé mais TCC prompt persiste pour même bundleID : cause ?",
    correct: "CodeRequirement mismatch — app update signée autrement ou wrong identifier type",
    distractors: ["APNs push delay", "FileVault deferred", "ABM serial conflict"],
    explanation:
      "Recalculer requirement avec codesign -dv --verbose=4. PPPC doit matcher team et hash ou utiliser anchor apple generic with identifier. Consolidate duplicate conflicting profiles.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
  {
    id: "asec-ts13",
    domain: "troubleshooting",
    difficulty: "easy",
    text: "Premier reflex troubleshooting compliance Mac dans Intune + Jamf hybrid ?",
    correct: "Identifier source vérité compliance (Jamf via connector) et last check-in des deux",
    distractors: ["Réinstaller macOS immédiatement", "Supprimer ABM device record", "Changer Apple ID utilisateur"],
    explanation:
      "Hybride crée confusion si Intune et Jamf reportent états différents. Compliance Editor mapping, vérifier duplicate conflicting profiles FileVault/Gatekeeper. Une console pilot avec runbook clair.",
    relatedModuleSlug: "apple-it-professional/macos-security",
  },
];

export const appleSecurityBank = buildExamBank(APPLE_SECURITY_INPUTS);
