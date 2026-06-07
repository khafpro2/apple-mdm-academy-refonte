import { createProductionStoryboard } from "@/src/lib/video-storyboard-factory";
import { jamfTrainingStoryboards } from "@/lib/data/jamf/jamf-training-storyboards";

/** 18+ storyboards production — format standard 5 scènes */
export const productionVideoStoryboards = [
  createProductionStoryboard({
    slug: "apple-business-manager",
    title: "Comprendre Apple Business Manager",
    module: "Apple Business Manager",
    level: "Débutant",
    objective: "Identifier le rôle d'ABM dans l'écosystème Apple Enterprise et préparer la liaison MDM.",
    courseSlug: "apple-it-professional",
    labSlug: "abm-intune",
    quizSlug: "quiz-abm-certification",
    visualType: "architecture",
    intro: {
      narration:
        "Sans Apple Business Manager, impossible de déployer des iPhone, iPad ou Mac en entreprise de façon industrialisée. Dans cette vidéo, nous comprenons pourquoi ABM est le socle de toute stratégie Apple MDM.",
      visual: "Avatar HeyGen sur fond clair + logo ABM SVG",
      animation: "Fade-in titre + icône abm.svg",
      onScreenText: ["Apple Business Manager", "Socle du déploiement Apple"],
    },
    architecture: {
      narration:
        "ABM centralise quatre piliers : l'inventaire des appareils achetés en volume, les serveurs MDM, Apps & Books pour les licences, et les Managed Apple IDs pour les identités d'entreprise.",
      visual: "Diagramme ABM → Devices / MDM Servers / Apps & Books / Users",
      animation: "AnimatedArchitecture — nœuds qui s'allument séquentiellement",
      nodes: [
        { id: "abm", label: "Apple Business Manager", icon: "abm" },
        { id: "dev", label: "Devices", icon: "apple-device" },
        { id: "mdm", label: "MDM Servers", icon: "cloud" },
        { id: "apps", label: "Apps & Books", icon: "certificate" },
      ],
      connections: [
        { from: "abm", to: "dev" },
        { from: "abm", to: "mdm" },
        { from: "abm", to: "apps" },
      ],
      onScreenText: ["Inventaire", "Serveurs MDM", "Licences VPP"],
    },
    demo: {
      narration:
        "Connectez-vous à business.apple.com. Vérifiez le tableau de bord : section Devices pour l'inventaire, MDM Servers pour Intune ou Jamf, et Users pour les administrateurs. Assignez le rôle Device Manager au minimum pour la suite du parcours.",
      visual: "Capture ABM Dashboard avec zones Devices et MDM Servers surlignées",
      animation: "Screen Studio — zoom séquentiel sur chaque section",
      durationSeconds: 165,
      requiredScreenshots: [
        "ABM → Dashboard",
        "ABM → Devices → liste appareils",
        "ABM → Settings → Device Management → MDM Servers",
        "ABM → Users → rôles administrateur",
      ],
      onScreenText: ["Dashboard ABM", "Devices", "MDM Servers"],
    },
    errors: {
      narration:
        "Erreur fréquente : l'appareil n'apparaît pas dans ABM — vérifiez le revendeur agréé et le numéro de commande. Autre piège : créer plusieurs serveurs MDM pour le même tenant Intune, ce qui fragmente l'inventaire ADE.",
      visual: "Slide checklist erreurs avec icône warning",
      animation: "Apparition progressive des puces rouges",
      checklistItems: [
        "Revendeur non agréé Apple",
        "Serveur MDM dupliqué",
        "Rôle administrateur insuffisant",
        "Organisation ABM non liée au tenant",
      ],
      onScreenText: ["Erreurs fréquentes ABM"],
    },
    recap: {
      narration:
        "ABM est prêt. Passez au lab pour lier Intune, puis validez vos acquis avec le quiz certification ABM.",
      visual: "Carte récap + boutons Lab et Quiz",
      animation: "Transition recap avec flèche vers lab",
      onScreenText: ["Lab : abm-intune", "Quiz ABM", "Prochaine vidéo : ABM → Intune"],
    },
  }),

  createProductionStoryboard({
    slug: "abm-intune",
    title: "Relier Apple Business Manager à Microsoft Intune",
    module: "ABM + Intune",
    level: "Intermédiaire",
    objective: "Établir la relation de confiance ABM ↔ Intune via le token serveur MDM.",
    courseSlug: "intune-mac",
    labSlug: "abm-intune",
    quizSlug: "quiz-intune-mac",
    visualType: "architecture",
    intro: {
      narration:
        "Votre flotte Apple est dans ABM, mais Intune ne peut pas encore la gérer. Il faut créer un serveur MDM dans ABM et importer le token dans le portail Microsoft Intune.",
      visual: "Split screen ABM + logo Intune",
      animation: "Logos qui convergent au centre",
      onScreenText: ["ABM ↔ Intune", "Token serveur MDM"],
    },
    architecture: {
      narration:
        "Le flux est : ABM génère un fichier server_token.p7m, Intune l'importe dans Apple Enrollment, puis synchronise les appareils et profils ADE. APNs est requis pour pousser les commandes.",
      visual: "ABM → Token .p7m → Intune → APNs → Appareil",
      animation: "Flèches animées + fichier token qui glisse",
      nodes: [
        { id: "abm", label: "ABM", icon: "abm" },
        { id: "intune", label: "Intune", icon: "intune" },
        { id: "apns", label: "APNs", icon: "apns" },
        { id: "dev", label: "Appareil", icon: "apple-device" },
      ],
      connections: [
        { from: "abm", to: "intune", label: "Token" },
        { from: "intune", to: "apns" },
        { from: "apns", to: "dev" },
      ],
      onScreenText: ["server_token.p7m", "Synchronisation ADE"],
    },
    demo: {
      narration:
        "Dans ABM, créez le serveur MDM Intune et téléchargez le token. Dans Intune : Devices → Apple → Enrollment Program Tokens → ajoutez le fichier .p7m. Attendez la synchronisation, puis vérifiez les appareils dans Devices → All devices.",
      visual: "Démonstration pas-à-pas ABM puis Intune admin center",
      animation: "Enregistrement Screen Studio avec curseur surligné",
      durationSeconds: 180,
      requiredScreenshots: [
        "ABM → MDM Servers → Add MDM Server",
        "ABM → Download server token",
        "Intune → Devices → Apple → Enrollment program tokens",
        "Intune → Devices → All devices → appareils Apple",
      ],
      onScreenText: ["Import token", "Sync devices"],
    },
    errors: {
      narration:
        "Token expiré ou réimport d'un mauvais fichier : la sync échoue silencieusement. Token APNs manquant : les appareils apparaissent mais restent non conformes. Vérifiez aussi que le profil ADE est assigné au bon groupe.",
      visual: "Tableau erreurs Intune + ABM",
      animation: "Highlight rouge sur messages d'erreur portail",
      checklistItems: [
        "Token serveur expiré (> 1 an)",
        "APNs non configuré dans Intune",
        "Profil ADE non assigné",
        "Mauvais tenant Microsoft",
      ],
      requiredScreenshots: ["Intune → Apple → APNs certificate status"],
      onScreenText: ["Token expiré ?", "APNs OK ?"],
    },
    recap: {
      narration: "La liaison ABM-Intune est opérationnelle. Enchaînez avec le déploiement ADE iPhone, puis le lab abm-intune.",
      visual: "Récap schéma + CTA lab",
      animation: "Zoom out vers checklist certification",
      onScreenText: ["Lab abm-intune", "Vidéo suivante : ADE iPhone"],
    },
  }),

  createProductionStoryboard({
    slug: "ade-iphone",
    title: "Déployer un iPhone avec ADE",
    module: "Automated Device Enrollment — iPhone",
    level: "Intermédiaire",
    objective: "Comprendre le parcours ADE iPhone de la boîte à la supervision Intune ou Jamf.",
    courseSlug: "intune-mac",
    labSlug: "ade-iphone",
    quizSlug: "quiz-ade-certification",
    visualType: "process",
    intro: {
      narration:
        "Un iPhone neuf en entreprise doit rejoindre le MDM sans que l'utilisateur installe un profil manuellement. L'Automated Device Enrollment rend ce zero-touch possible.",
      visual: "iPhone boîte → Setup Assistant",
      animation: "Unboxing animé + icône apple-device.svg",
      onScreenText: ["ADE iPhone", "Zero-touch"],
    },
    architecture: {
      narration:
        "ABM assigne l'iPhone au serveur MDM. Au premier démarrage, iOS contacte Apple, récupère le profil ADE et affiche Remote Management. L'appareil devient supervisé.",
      visual: "Flux ABM → ADE Profile → Setup Assistant → MDM",
      animation: "Processus en 4 cartes animées",
      nodes: [
        { id: "abm", label: "ABM", icon: "abm" },
        { id: "ade", label: "Profil ADE", icon: "certificate" },
        { id: "setup", label: "Setup Assistant", icon: "apple-device" },
        { id: "mdm", label: "Intune/Jamf", icon: "intune" },
      ],
      connections: [
        { from: "abm", to: "ade" },
        { from: "ade", to: "setup" },
        { from: "setup", to: "mdm" },
      ],
      onScreenText: ["Remote Management", "Supervision"],
    },
    demo: {
      narration:
        "Dans Intune, créez un profil ADE iPhone : nom, utilisateur assigné ou non, configuration Wi-Fi optionnelle. Assignez-le au groupe d'appareils ABM. Allumez l'iPhone : l'écran Remote Management apparaît avant la création du compte.",
      visual: "Capture profil ADE + vidéo Setup Assistant iPhone",
      animation: "Split : portail Intune + simulateur iOS",
      durationSeconds: 170,
      requiredScreenshots: [
        "Intune → Devices → Apple → Enrollment → ADE profiles",
        "Intune → ADE profile assignment",
        "iPhone Setup Assistant → Remote Management",
        "Intune → Device compliance iPhone enrollé",
      ],
      onScreenText: ["Profil ADE", "Remote Management"],
    },
    errors: {
      narration:
        "Si Remote Management n'apparaît pas, l'iPhone n'est pas dans ABM ou le mauvais profil ADE est assigné. Un iPhone déjà activé avec un Apple ID personnel nécessite un effacement complet pour ADE.",
      visual: "Checklist dépannage ADE iPhone",
      animation: "Comparaison supervisé vs non supervisé",
      checklistItems: [
        "Appareil absent d'ABM",
        "Profil ADE non assigné au serial",
        "Activation préalable avec Apple ID perso",
        "Wi-Fi requis au setup non fourni",
      ],
      onScreenText: ["Pas de Remote Management ?"],
    },
    recap: {
      narration: "Votre iPhone est supervisé et prêt pour les profils silencieux. Passez au lab ade-iphone puis au quiz ADE.",
      visual: "iPhone vert checkmark + liens lab/quiz",
      animation: "Récap 3 bullet points",
      onScreenText: ["Lab ade-iphone", "Quiz ADE"],
    },
  }),

  createProductionStoryboard({
    slug: "ade-mac",
    title: "Déployer un Mac avec ADE",
    module: "Automated Device Enrollment — macOS",
    level: "Intermédiaire",
    objective: "Déployer un Mac via ADE avec profils macOS et escrow FileVault.",
    courseSlug: "intune-mac",
    labSlug: "ade-mac",
    quizSlug: "quiz-ade-certification",
    visualType: "process",
    intro: {
      narration:
        "Le déploiement Mac en entreprise suit le même principe ADE qu'iOS, avec des spécificités : profils système, PPPC et chiffrement FileVault dès le premier boot.",
      visual: "MacBook + Setup Assistant macOS",
      animation: "Intro Mac avec logo apple-device",
      onScreenText: ["ADE macOS", "Supervision Mac"],
    },
    architecture: {
      narration:
        "Le Mac est assigné dans ABM, le profil ADE macOS est poussé au Setup Assistant. Une fois inscrit, Intune ou Jamf déploie FileVault, compte admin et apps.",
      visual: "Diagramme ABM → ADE Mac → MDM → FileVault",
      animation: "Architecture animée 4 nœuds",
      nodes: [
        { id: "abm", label: "ABM", icon: "abm" },
        { id: "ade", label: "ADE macOS", icon: "certificate" },
        { id: "mdm", label: "MDM", icon: "intune" },
        { id: "fv", label: "FileVault", icon: "security" },
      ],
      connections: [
        { from: "abm", to: "ade" },
        { from: "ade", to: "mdm" },
        { from: "mdm", to: "fv" },
      ],
      onScreenText: ["ADE Mac", "Escrow clé"],
    },
    demo: {
      narration:
        "Créez le profil ADE macOS dans Intune avec skip screens adaptés. Au premier démarrage, validez Remote Management. Vérifiez l'inscription dans Devices, puis confirmez que le profil FileVault est en attente ou appliqué.",
      visual: "Capture Intune ADE Mac + System Settings macOS",
      animation: "Screen Studio Mac enrollment",
      durationSeconds: 175,
      requiredScreenshots: [
        "Intune → ADE profile macOS",
        "macOS Setup Assistant → Remote Management",
        "Intune → Mac device record",
        "macOS System Settings → Profiles",
      ],
      onScreenText: ["Profil ADE Mac", "Inscription OK"],
    },
    errors: {
      narration:
        "Sur Mac Apple Silicon, l'utilisateur local créé au setup peut bloquer certains profils système. Oublier l'escrow FileVault empêche la récupération de clé en support.",
      visual: "Erreurs Mac ADE checklist",
      animation: "Highlight FileVault escrow manquant",
      checklistItems: [
        "Profil système non approuvé par admin",
        "FileVault sans escrow MDM",
        "Mac non supervisé (BYOD)",
        "Token ADE expiré",
      ],
      onScreenText: ["Mac non supervisé ?"],
    },
    recap: {
      narration: "Le Mac est prêt pour FileVault et les profils enterprise. Lab ade-mac, puis vidéo FileVault.",
      visual: "Récap Mac + next steps",
      animation: "Fade recap",
      onScreenText: ["Lab ade-mac", "Vidéo FileVault"],
    },
  }),

  createProductionStoryboard({
    slug: "apns",
    title: "Créer et renouveler APNs",
    module: "APNs",
    level: "Intermédiaire",
    objective: "Générer, importer et renouveler le certificat Apple Push Notification service.",
    courseSlug: "apple-it-professional",
    labSlug: "apns",
    quizSlug: "examen-apple-it-pro",
    visualType: "diagram",
    intro: {
      narration:
        "Sans certificat APNs valide, votre serveur MDM ne peut pas réveiller les appareils. Aucun profil, aucune app, aucune commande distante ne passera.",
      visual: "Schéma MDM muet vs MDM avec push",
      animation: "Pulse APNs animé",
      onScreenText: ["APNs obligatoire", "Push MDM"],
    },
    architecture: {
      narration:
        "Le MDM génère une CSR, Apple signe le certificat push, le MDM l'installe. Chaque commande part en notification push silencieuse vers l'appareil.",
      visual: "MDM → CSR → Apple → Certificat → Device",
      animation: "Flux certificat animé",
      nodes: [
        { id: "mdm", label: "Serveur MDM", icon: "cloud" },
        { id: "apns", label: "APNs Apple", icon: "apns" },
        { id: "dev", label: "Appareil", icon: "apple-device" },
      ],
      connections: [
        { from: "mdm", to: "apns" },
        { from: "apns", to: "dev" },
      ],
      onScreenText: ["Certificat push", "365 jours"],
    },
    demo: {
      narration:
        "Dans Intune : Devices → Apple → Apple MDM Push Certificate. Téléchargez la CSR, uploadez-la sur identity.apple.com/pushcert, récupérez le certificat .pem et importez-le. Notez la date d'expiration dans votre calendrier admin.",
      visual: "Démo Intune + portail Apple Push Certificates",
      animation: "Split screen enregistrement",
      durationSeconds: 160,
      requiredScreenshots: [
        "Intune → Apple MDM Push Certificate",
        "identity.apple.com/pushcert → upload CSR",
        "Intune → certificate expiration date",
      ],
      onScreenText: ["CSR → Apple → Import"],
    },
    errors: {
      narration:
        "Renouveler avec une nouvelle CSR au lieu du renouvellement du certificat existant casse le push pour tous les appareils. Oublier APNs après migration tenant est une cause classique de flotte orpheline.",
      visual: "Timeline renouvellement vs nouvelle CSR",
      animation: "Comparaison renew vs new",
      checklistItems: [
        "Nouvelle CSR au lieu de renew",
        "Certificat expiré",
        "Mauvais Apple ID utilisé",
        "Jamf et Intune partagent certificats distincts",
      ],
      onScreenText: ["Renouveler, pas recréer"],
    },
    recap: {
      narration: "APNs est configuré. Testez un push avec un profil test, puis lab apns.",
      visual: "Certificat valide checkmark",
      animation: "Récap",
      onScreenText: ["Lab apns", "Tester push"],
    },
  }),

  createProductionStoryboard({
    slug: "apps-books",
    title: "Distribuer des apps avec Apps & Books",
    module: "Apps & Books (VPP)",
    level: "Intermédiaire",
    objective: "Synchroniser les licences VPP et déployer des apps métier en volume.",
    courseSlug: "apple-it-professional",
    labSlug: "apps-books",
    quizSlug: "examen-apple-it-pro",
    visualType: "process",
    intro: {
      narration:
        "Demander à chaque employé d'acheter Teams ou Outlook avec son Apple ID personnel est une faille de gouvernance. Apps & Books résout cela avec des licences assignées par le MDM.",
      visual: "App Store perso barré → VPP check",
      animation: "Transition vers VPP",
      onScreenText: ["Apps & Books", "Licences volume"],
    },
    architecture: {
      narration:
        "ABM achète les licences, le token VPP synchronise le catalogue MDM, APNs réveille l'appareil pour installation silencieuse sur appareils supervisés.",
      visual: "ABM Apps → Token → MDM → iPhone app installée",
      animation: "Diagramme VPP animé",
      nodes: [
        { id: "abm", label: "Apps & Books", icon: "abm" },
        { id: "mdm", label: "MDM", icon: "intune" },
        { id: "dev", label: "Appareil", icon: "apple-device" },
      ],
      connections: [
        { from: "abm", to: "mdm", label: "Token VPP" },
        { from: "mdm", to: "dev", label: "Install" },
      ],
      onScreenText: ["Token VPP", "Install silencieuse"],
    },
    demo: {
      narration:
        "Dans ABM Apps & Books, achetez ou assignez des licences Microsoft Teams. Synchronisez le token dans Intune. Créez une app iOS assignée à un groupe, mode Required. Vérifiez l'installation sur l'iPhone supervisé.",
      visual: "ABM + Intune app deployment",
      animation: "Screen Studio apps flow",
      durationSeconds: 170,
      requiredScreenshots: [
        "ABM → Apps & Books → app catalog",
        "Intune → Apps → iOS → Add app (VPP)",
        "Intune → App assignment Required",
        "iPhone → app installed",
      ],
      onScreenText: ["Licence assignée", "Required install"],
    },
    errors: {
      narration:
        "Licences insuffisantes, app retirée du store VPP, ou appareil non supervisé empêchent l'install silencieuse. Le token VPP expiré désynchronise tout le catalogue.",
      visual: "Erreurs VPP",
      animation: "Checklist",
      checklistItems: [
        "Token VPP expiré",
        "Licences épuisées",
        "Appareil non supervisé",
        "Conflit Apple ID perso sur app managée",
      ],
      onScreenText: ["Licences OK ?"],
    },
    recap: {
      narration: "Vos apps métier sont déployées en volume. Lab apps-books, quiz Apple IT Pro.",
      visual: "Récap apps",
      animation: "Outro",
      onScreenText: ["Lab apps-books"],
    },
  }),

  createProductionStoryboard({
    slug: "managed-apple-ids",
    title: "Créer des Managed Apple IDs",
    module: "Managed Apple IDs",
    level: "Intermédiaire",
    objective: "Provisionner et fédérer les Managed Apple IDs pour l'entreprise.",
    courseSlug: "apple-it-professional",
    labSlug: "managed-apple-ids",
    quizSlug: "examen-apple-it-pro",
    visualType: "diagram",
    intro: {
      narration:
        "Les Managed Apple IDs séparent la vie professionnelle de l'Apple ID personnel. Indispensables pour Shared iPad, certaines fonctionnalités ABM et la conformité.",
      visual: "Managed ID vs Apple ID personnel",
      animation: "Split comparison",
      onScreenText: ["Managed Apple IDs"],
    },
    architecture: {
      narration:
        "ABM crée les identités ou les fédère depuis Microsoft Entra. Les services Apple (iCloud org, notes, cours) utilisent ces comptes gérés.",
      visual: "Entra → ABM → Managed IDs → Services",
      animation: "Fédération animée",
      nodes: [
        { id: "entra", label: "Entra ID", icon: "cloud" },
        { id: "abm", label: "ABM Users", icon: "abm" },
        { id: "maid", label: "Managed Apple ID", icon: "certificate" },
      ],
      connections: [
        { from: "entra", to: "abm", label: "Fédération" },
        { from: "abm", to: "maid" },
      ],
      onScreenText: ["Fédération SSO"],
    },
    demo: {
      narration:
        "Dans ABM Users, créez un Managed Apple ID manuellement ou configurez la fédération Entra. Testez la connexion sur un appareil managé. Vérifiez les rôles administrateur séparés des comptes utilisateurs.",
      visual: "ABM Users + fédération",
      animation: "Capture guidée",
      durationSeconds: 155,
      requiredScreenshots: [
        "ABM → Users → Managed Apple IDs",
        "ABM → Settings → Federation",
        "ABM → Managed Apple IDs → create user",
      ],
      onScreenText: ["Créer / Fédérer"],
    },
    errors: {
      narration:
        "Confondre Apple ID perso et Managed ID sur le même appareil crée des conflits iCloud. La fédération mal configurée bloque la création de comptes au setup.",
      visual: "Erreurs identité",
      animation: "Checklist",
      checklistItems: [
        "DNS fédération incorrect",
        "UPN Entra non mappé",
        "Conflit iCloud perso",
        "Mot de passe Managed ID oublié sans processus reset",
      ],
      onScreenText: ["Fédération OK ?"],
    },
    recap: {
      narration: "Identités gérées en place. Lab managed-apple-ids, puis Platform SSO.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab managed-apple-ids"],
    },
  }),

  createProductionStoryboard({
    slug: "platform-sso",
    title: "Configurer Platform SSO",
    module: "Platform SSO",
    level: "Avancé",
    objective: "Déployer Platform SSO macOS avec Microsoft Entra ID.",
    courseSlug: "apple-it-professional",
    labSlug: "platform-sso",
    quizSlug: "examen-apple-it-pro",
    visualType: "architecture",
    intro: {
      narration:
        "Platform SSO permet à macOS d'utiliser la session Entra pour s'authentifier nativement dans les apps — sans ressaisir mot de passe à chaque ouverture.",
      visual: "Mac login → apps sans re-auth",
      animation: "SSO flow intro",
      onScreenText: ["Platform SSO", "macOS + Entra"],
    },
    architecture: {
      narration:
        "Entra émet des tokens, le profil Platform SSO macOS configure l'extension d'authentification Microsoft, les apps utilisent le SSO natif Apple.",
      visual: "Entra → Profil SSO → macOS → Apps",
      animation: "Architecture SSO",
      nodes: [
        { id: "entra", label: "Entra ID", icon: "cloud" },
        { id: "sso", label: "Platform SSO Profile", icon: "certificate" },
        { id: "mac", label: "macOS", icon: "apple-device" },
      ],
      connections: [
        { from: "entra", to: "sso" },
        { from: "sso", to: "mac" },
      ],
      onScreenText: ["Extension Microsoft"],
    },
    demo: {
      narration:
        "Déployez l'extension Company Portal ou SSO extension via Intune. Créez le profil Platform SSO avec tenant ID, client ID et redirect URI. Inscrivez un Mac supervisé et testez Safari + Outlook sans re-login.",
      visual: "Intune SSO profile + macOS test",
      animation: "Demo enrollment + login",
      durationSeconds: 180,
      requiredScreenshots: [
        "Intune → macOS → Configuration → Platform SSO",
        "macOS System Settings → Profiles → SSO",
        "macOS → app opens without password",
      ],
      onScreenText: ["Profil SSO", "Test app"],
    },
    errors: {
      narration:
        "Redirect URI incorrect, Mac non supervisé, ou extension non installée : le SSO échoue avec des prompts répétés. Conditional Access peut bloquer les appareils non conformes.",
      visual: "Erreurs SSO",
      animation: "Checklist",
      checklistItems: [
        "Redirect URI mismatch",
        "Mac non supervisé",
        "Extension SSO absente",
        "Conditional Access bloquant",
      ],
      onScreenText: ["SSO ne marche pas ?"],
    },
    recap: {
      narration: "Platform SSO déployé. Lab platform-sso, préparation certification Apple IT Pro.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab platform-sso"],
    },
  }),

  createProductionStoryboard({
    slug: "ios-ipados-profiles",
    title: "Profils de configuration iOS / iPadOS",
    module: "Profils iOS/iPadOS",
    level: "Intermédiaire",
    objective: "Créer et assigner des profils Wi-Fi, VPN, restrictions et certificats iOS.",
    courseSlug: "apple-it-professional",
    labSlug: "ios-profiles",
    quizSlug: "examen-apple-it-pro",
    visualType: "process",
    intro: {
      narration:
        "Les profils de configuration sont le langage du MDM sur iPhone et iPad : une fois supervisés, ils s'installent sans intervention utilisateur.",
      visual: "Grille icônes profils iOS",
      animation: "Icons fade in",
      onScreenText: ["Profils iOS/iPadOS"],
    },
    architecture: {
      narration:
        "Intune ou Jamf compose le profil XML, APNs push l'installation, iOS valide la signature MDM et applique payloads Wi-Fi, VPN, restrictions.",
      visual: "MDM → APNs → Profile → iOS",
      animation: "Push profile animation",
      nodes: [
        { id: "mdm", label: "MDM", icon: "intune" },
        { id: "apns", label: "APNs", icon: "apns" },
        { id: "ios", label: "iOS", icon: "apple-device" },
      ],
      connections: [
        { from: "mdm", to: "apns" },
        { from: "apns", to: "ios" },
      ],
      onScreenText: ["Payloads", "Supervision"],
    },
    demo: {
      narration:
        "Créez un profil Wi-Fi enterprise avec certificat SCEP, puis un profil Restrictions bloquant l'App Store perso. Assignez à un groupe iOS supervisé. Vérifiez dans Réglages → Général → VPN et appareil management.",
      visual: "Intune profile wizard + iOS Settings",
      animation: "Screen Studio Intune + iPhone",
      durationSeconds: 175,
      requiredScreenshots: [
        "Intune → Configuration profiles → iOS",
        "Intune → Wi-Fi + SCEP payload",
        "Intune → Restrictions profile",
        "iOS → Settings → General → VPN & Device Management",
      ],
      onScreenText: ["Wi-Fi + Restrictions"],
    },
    errors: {
      narration:
        "Profil Wi-Fi avec certificat expiré, SCEP mal configuré, ou appareil non supervisé : l'install échoue ou demande interaction. Trop de profils conflictuels ralentit le check-in.",
      visual: "Erreurs profils iOS",
      animation: "Checklist",
      checklistItems: [
        "Certificat SCEP expiré",
        "Appareil non supervisé",
        "Profils conflictuels",
        "Scope assignment incorrect",
      ],
      onScreenText: ["Profil en erreur ?"],
    },
    recap: {
      narration: "Profils iOS maîtrisés. Lab ios-profiles, quiz certification.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab ios-profiles"],
    },
  }),

  createProductionStoryboard({
    slug: "macos-profiles",
    title: "Profils de configuration macOS",
    module: "Profils macOS",
    level: "Intermédiaire",
    objective: "Déployer profils système, PPPC et extensions sur Mac supervisé.",
    courseSlug: "intune-mac",
    labSlug: "macos-profiles",
    quizSlug: "quiz-intune-mac",
    visualType: "process",
    intro: {
      narration:
        "macOS exige une approche différente d'iOS : profils système, approbation admin local, PPPC pour apps tierces, et extensions système.",
      visual: "Mac + profils système popup",
      animation: "Intro macOS profiles",
      onScreenText: ["Profils macOS", "PPPC"],
    },
    architecture: {
      narration:
        "Le MDM pousse le profil, macOS affiche le panneau d'approbation système si requis, les payloads s'appliquent au niveau machine.",
      visual: "MDM → macOS System Settings → Profiles",
      animation: "Flow macOS profile",
      nodes: [
        { id: "mdm", label: "Intune/Jamf", icon: "intune" },
        { id: "mac", label: "macOS", icon: "apple-device" },
      ],
      connections: [{ from: "mdm", to: "mac" }],
      onScreenText: ["Profil système"],
    },
    demo: {
      narration:
        "Créez un profil PPPC pour Microsoft Teams (micro, caméra). Déployez un profil Dock et wallpaper. Sur Mac supervisé, l'install est silencieuse ; sinon l'admin local doit approuver dans Réglages système.",
      visual: "Intune macOS profile + System Settings",
      animation: "Screen Studio Mac",
      durationSeconds: 170,
      requiredScreenshots: [
        "Intune → macOS configuration profile",
        "Intune → PPPC payload Teams",
        "macOS System Settings → Privacy & Security",
        "macOS System Settings → Profiles",
      ],
      onScreenText: ["PPPC Teams", "Approval"],
    },
    errors: {
      narration:
        "Oublier PPPC provoque des popups micro/caméra répétés. Profil non approuvé reste en attente indéfiniment sur Mac non supervisé.",
      visual: "Erreurs macOS",
      animation: "Checklist",
      checklistItems: [
        "PPPC manquant",
        "Profil non approuvé",
        "Extension système bloquée",
        "Conflit avec profile utilisateur",
      ],
      onScreenText: ["PPPC requis"],
    },
    recap: {
      narration: "Profils macOS déployés. Lab macos-profiles, enchaîner FileVault.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab macos-profiles"],
    },
  }),

  createProductionStoryboard({
    slug: "filevault",
    title: "Sécuriser macOS avec FileVault",
    module: "FileVault",
    level: "Avancé",
    objective: "Activer FileVault via MDM avec escrow des clés de récupération.",
    courseSlug: "apple-it-professional",
    labSlug: "macos-security",
    quizSlug: "examen-apple-it-pro",
    visualType: "diagram",
    intro: {
      narration:
        "Un Mac portable perdu sans chiffrement disque expose toutes les données corporate. FileVault est la baseline sécurité macOS exigée par la plupart des frameworks.",
      visual: "Mac perdu → disque chiffré",
      animation: "Cadenas FileVault",
      onScreenText: ["FileVault", "Chiffrement disque"],
    },
    architecture: {
      narration:
        "Le profil MDM force FileVault, macOS génère une clé de récupération escrow vers Intune ou Jamf, l'admin peut déverrouiller sans mot de passe utilisateur.",
      visual: "MDM → FileVault → Escrow key → Console admin",
      animation: "Escrow flow",
      nodes: [
        { id: "mdm", label: "MDM", icon: "intune" },
        { id: "fv", label: "FileVault", icon: "security" },
        { id: "escrow", label: "Clé escrow", icon: "certificate" },
      ],
      connections: [
        { from: "mdm", to: "fv" },
        { from: "fv", to: "escrow" },
      ],
      onScreenText: ["Escrow obligatoire"],
    },
    demo: {
      narration:
        "Déployez le profil FileVault Intune avec escrow vers Azure AD ou clé personal recovery key désactivée. Vérifiez sur Mac : System Settings → Privacy & Security → FileVault On. Récupérez la clé dans Intune device record.",
      visual: "Intune FV profile + macOS FileVault pane",
      animation: "Screen Studio",
      durationSeconds: 165,
      requiredScreenshots: [
        "Intune → macOS FileVault profile",
        "macOS System Settings → FileVault ON",
        "Intune → Mac → Recovery key",
      ],
      onScreenText: ["FileVault ON", "Clé escrow"],
    },
    errors: {
      narration:
        "Pas d'escrow = impossible de débloquer un Mac si l'utilisateur oublie son mot de passe. FileVault activé avant ADE peut compliquer le déploiement initial.",
      visual: "Erreurs FileVault",
      animation: "Checklist",
      checklistItems: [
        "Escrow non configuré",
        "Personal recovery key autorisée",
        "Clé non synchronisée dans MDM",
        "Utilisateur refuse redémarrage chiffrement",
      ],
      onScreenText: ["Escrow OK ?"],
    },
    recap: {
      narration: "Mac chiffrés et conformes. Lab macos-security, quiz Apple IT Pro.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab macos-security"],
    },
  }),

  createProductionStoryboard({
    slug: "gatekeeper-xprotect-sip",
    title: "Gatekeeper, XProtect et SIP",
    module: "Sécurité macOS native",
    level: "Avancé",
    objective: "Comprendre les mécanismes de défense natifs macOS et leur complément MDM.",
    courseSlug: "apple-it-professional",
    labSlug: "macos-security",
    quizSlug: "examen-apple-it-pro",
    visualType: "comparison",
    intro: {
      narration:
        "macOS intègre Gatekeeper, XProtect et System Integrity Protection avant même votre EDR. Un admin MDM doit les connaître pour ne pas les contourner par erreur.",
      visual: "Trois boucliers : GK, XProtect, SIP",
      animation: "Triple shield intro",
      onScreenText: ["Gatekeeper", "XProtect", "SIP"],
    },
    architecture: {
      narration:
        "Gatekeeper vérifie notarisation des apps, XProtect/MRT bloquent malwares connus via mises à jour silencieuses, SIP protège les fichiers système contre modifications même root.",
      visual: "Couches sécurité macOS + EDR optionnel",
      animation: "Layered defense diagram",
      nodes: [
        { id: "gk", label: "Gatekeeper", icon: "security" },
        { id: "xp", label: "XProtect/MRT", icon: "security" },
        { id: "sip", label: "SIP", icon: "security" },
        { id: "edr", label: "Jamf Protect / Defender", icon: "cloud" },
      ],
      connections: [
        { from: "gk", to: "xp" },
        { from: "xp", to: "edr", label: "Complément" },
      ],
      onScreenText: ["Défense en profondeur"],
    },
    demo: {
      narration:
        "Dans System Settings → Privacy & Security, montrez App Store + identified developers. Terminal : spctl --assess sur app notarisée vs non. Vérifiez XProtect updates dans Software Update. Expliquez pourquoi désactiver SIP est interdit en prod.",
      visual: "macOS Security settings + Terminal spctl",
      animation: "Screen Studio macOS + Terminal",
      durationSeconds: 170,
      requiredScreenshots: [
        "macOS System Settings → Privacy & Security → Allow apps",
        "Terminal → spctl --assess example.app",
        "macOS Software Update → security updates",
      ],
      onScreenText: ["Notarisation", "SIP actif"],
    },
    errors: {
      narration:
        "Autoriser apps anywhere ouvre la porte au malware. Désactiver SIP pour installer un agent legacy crée une dette sécurité majeure. Retarder les mises à jour XProtect laisse des signatures obsolètes.",
      visual: "Erreurs sécurité macOS",
      animation: "Comparison mauvaise vs bonne config",
      comparison: {
        left: "Apps anywhere + SIP off — NON",
        right: "Notarized only + SIP on — OUI",
      },
      checklistItems: [
        "Apps from anywhere autorisé",
        "SIP désactivé en prod",
        "Updates sécurité retardées",
        "PPPC contournant Gatekeeper",
      ],
      onScreenText: ["Ne pas désactiver SIP"],
    },
    recap: {
      narration: "Défenses natives comprises. Complétez avec Jamf Protect. Lab macos-security.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab macos-security", "Vidéo Jamf Protect"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-pro-fundamentals",
    title: "Découvrir Jamf Pro",
    module: "Jamf Pro Fundamentals",
    level: "Pro",
    objective: "Naviguer dans Jamf Pro : inventaire, sites, catégories et check-in MDM.",
    courseSlug: "jamf-100",
    labSlug: "jamf-discovery",
    quizSlug: "quiz-jamf-100",
    visualType: "screenshot",
    intro: {
      narration:
        "Jamf Pro est la référence MDM Apple pour les organisations qui veulent un contrôle granulaire sur macOS et iOS. Cette vidéo pose les fondations de la console.",
      visual: "Jamf Pro dashboard hero",
      animation: "Logo jamf.svg + dashboard fade",
      onScreenText: ["Jamf Pro", "Console admin"],
    },
    architecture: {
      narration:
        "Jamf Pro repose sur l'inventaire MDM, les Smart Groups pour le ciblage, les Configuration Profiles et les Policies pour l'automatisation.",
      visual: "Jamf stack : Inventory → Groups → Profiles → Policies",
      animation: "Jamf architecture diagram",
      nodes: [
        { id: "inv", label: "Inventory", icon: "jamf" },
        { id: "sg", label: "Smart Groups", icon: "jamf" },
        { id: "pol", label: "Policies", icon: "certificate" },
      ],
      connections: [
        { from: "inv", to: "sg" },
        { from: "sg", to: "pol" },
      ],
      onScreenText: ["Inventaire", "Automatisation"],
    },
    demo: {
      narration:
        "Connectez-vous à Jamf Pro. Explorez Computers & Devices : recherche par serial, OS version, last check-in. Créez un site test, une catégorie, et localisez Self Service et Settings.",
      visual: "Tour guidé console Jamf",
      animation: "Screen Studio Jamf navigation",
      durationSeconds: 175,
      requiredScreenshots: [
        "Jamf Pro → Dashboard",
        "Jamf Pro → Computers → inventory detail",
        "Jamf Pro → Mobile Devices",
        "Jamf Pro → Settings → Global Management",
      ],
      onScreenText: ["Inventory", "Check-in"],
    },
    errors: {
      narration:
        "Check-in absent signifie APNs ou réseau bloqué. Mauvais site assignment fausse les scopes. Ne jamais modifier les built-in groups sans comprendre l'impact.",
      visual: "Erreurs Jamf base",
      animation: "Checklist",
      checklistItems: [
        "APNs expiré",
        "Appareil hors ligne > 7 jours",
        "Scope site incorrect",
        "Extension attributes mal typés",
      ],
      onScreenText: ["Last check-in ?"],
    },
    recap: {
      narration: "Console Jamf maîtrisée. Lab jamf-discovery, quiz Jamf 100, vidéo Smart Groups.",
      visual: "Récap Jamf",
      animation: "Outro",
      onScreenText: ["Lab jamf-discovery", "Quiz Jamf 100"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-smart-groups",
    title: "Créer des Smart Groups Jamf",
    module: "Jamf Smart Groups",
    level: "Pro",
    objective: "Construire des Smart Groups dynamiques pour cibler policies et profils.",
    courseSlug: "jamf-100",
    labSlug: "jamf-smart-groups",
    quizSlug: "quiz-jamf-100",
    visualType: "process",
    intro: {
      narration:
        "Les groupes statiques deviennent ingérables à 500 Macs. Les Smart Groups mettent à jour le membership automatiquement selon OS, apps, EA ou localisation.",
      visual: "Static group vs Smart Group animation",
      animation: "Comparison groups",
      onScreenText: ["Smart Groups", "Ciblage dynamique"],
    },
    architecture: {
      narration:
        "Critères inventory → Smart Group → scope policies/profiles. Extension Attributes enrichissent les critères avec données custom scripts.",
      visual: "Criteria → Smart Group → Policies",
      animation: "Flow Smart Group",
      nodes: [
        { id: "crit", label: "Critères", icon: "jamf" },
        { id: "sg", label: "Smart Group", icon: "jamf" },
        { id: "pol", label: "Policies", icon: "certificate" },
      ],
      connections: [
        { from: "crit", to: "sg" },
        { from: "sg", to: "pol" },
      ],
      onScreenText: ["Extension Attributes"],
    },
    demo: {
      narration:
        "Créez un Smart Computer Group : macOS Sonoma + Microsoft Teams absent + last check-in < 7 days. Scope une policy test. Observez le membership se mettre à jour après un reconnaissance inventory.",
      visual: "Jamf Smart Group builder",
      animation: "Screen Studio criteria builder",
      durationSeconds: 165,
      requiredScreenshots: [
        "Jamf Pro → Smart Computer Groups → New",
        "Jamf → Criteria OS version + Application",
        "Jamf → Group membership preview",
        "Jamf → Policy scope to Smart Group",
      ],
      onScreenText: ["Critères AND/OR", "Membership"],
    },
    errors: {
      narration:
        "Critères trop larges ciblent toute la flotte par erreur. Oublier de recalculer inventory retarde le membership. Nested groups mal conçus créent des boucles de scope.",
      visual: "Erreurs Smart Groups",
      animation: "Checklist",
      checklistItems: [
        "Critères trop permissifs",
        "Inventory stale",
        "Smart Group vide au scope",
        "Conflit nested groups",
      ],
      onScreenText: ["Preview membership"],
    },
    recap: {
      narration: "Smart Groups opérationnels. Lab jamf-smart-groups, vidéo Policies.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab jamf-smart-groups"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-policies",
    title: "Créer des Policies Jamf",
    module: "Jamf Policies",
    level: "Pro",
    objective: "Automatiser déploiements avec policies, triggers et Self Service.",
    courseSlug: "jamf-100",
    labSlug: "jamf-policies",
    quizSlug: "quiz-jamf-100",
    visualType: "process",
    intro: {
      narration:
        "Les policies Jamf sont le moteur d'automatisation : installer apps, scripts, packages au enrollment, au check-in ou via Self Service.",
      visual: "Policy triggers icons",
      animation: "Triggers intro",
      onScreenText: ["Policies Jamf", "Triggers"],
    },
    architecture: {
      narration:
        "Trigger → Policy payloads (packages, scripts, profiles) → Scope Smart Group → Execution logs sur chaque Mac.",
      visual: "Policy anatomy diagram",
      animation: "Policy flow",
      nodes: [
        { id: "trig", label: "Trigger", icon: "jamf" },
        { id: "pol", label: "Policy", icon: "jamf" },
        { id: "mac", label: "Mac", icon: "apple-device" },
      ],
      connections: [
        { from: "trig", to: "pol" },
        { from: "pol", to: "mac" },
      ],
      onScreenText: ["Enrollment", "Recurring check-in"],
    },
    demo: {
      narration:
        "Créez une policy Enrollment Complete installant un package .pkg test. Ajoutez un script de banner bienvenue. Scope sur Smart Group pilotes. Vérifiez les logs policy sur un Mac test.",
      visual: "Jamf policy editor walkthrough",
      animation: "Screen Studio policy creation",
      durationSeconds: 180,
      requiredScreenshots: [
        "Jamf Pro → Policies → New",
        "Jamf → Policy triggers + packages",
        "Jamf → Policy execution logs",
        "Jamf Pro → Self Service policy",
      ],
      onScreenText: ["Enrollment Complete", "Logs"],
    },
    errors: {
      narration:
        "Policies en conflit sur le même trigger s'exécutent dans un ordre imprévisible. Oublier de désactiver une policy de test en prod cause redeploy loops. Scripts sans exit code proper masquent les échecs.",
      visual: "Erreurs policies",
      animation: "Checklist",
      checklistItems: [
        "Policies conflictuelles",
        "Policy test en prod",
        "Script exit 0 forcé",
        "Scope trop large",
      ],
      onScreenText: ["Vérifier logs"],
    },
    recap: {
      narration: "Policies maîtrisées. Lab jamf-policies, vidéo Scripts Jamf.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab jamf-policies"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-scripts",
    title: "Déployer des scripts Jamf",
    module: "Jamf Scripts",
    level: "Pro",
    objective: "Intégrer scripts bash/zsh dans policies avec paramètres et logs.",
    courseSlug: "jamf-170",
    labSlug: "jamf-scripts",
    quizSlug: "quiz-jamf-100",
    visualType: "process",
    intro: {
      narration:
        "Quand le profil MDM ne suffit pas, les scripts Jamf automatisent configuration fine, API calls et remediation — avec paramètres $4–$11.",
      visual: "Terminal + Jamf script icon",
      animation: "Script + policy link",
      onScreenText: ["Scripts Jamf", "Automatisation"],
    },
    architecture: {
      narration:
        "Script uploadé dans Jamf → attaché à Policy → exécuté root ou user → logs dans policy history et fichier local.",
      visual: "Script → Policy → Mac Terminal",
      animation: "Script execution flow",
      nodes: [
        { id: "script", label: "Script", icon: "jamf" },
        { id: "pol", label: "Policy", icon: "certificate" },
        { id: "mac", label: "Mac", icon: "apple-device" },
      ],
      connections: [
        { from: "script", to: "pol" },
        { from: "pol", to: "mac" },
      ],
      onScreenText: ["Paramètres $4–$11"],
    },
    demo: {
      narration:
        "Uploadez un script bash vérifiant FileVault status, paramètre $4 = seuil alerte. Liez à policy Recurring Check-in daily. Testez sur Mac pilote, lisez /var/log/jamf.log et policy logs.",
      visual: "Jamf script editor + Terminal tail log",
      animation: "Screen Studio script deploy",
      durationSeconds: 170,
      requiredScreenshots: [
        "Jamf Pro → Scripts → New",
        "Jamf → Policy with script + parameters",
        "Mac Terminal → jamf log",
        "Jamf → Policy log success/fail",
      ],
      onScreenText: ["jamf.log", "Exit code"],
    },
    errors: {
      narration:
        "Scripts hardcodés sans paramètres, chemins absolus fragiles, ou exécution user au lieu de root pour tâches système. Timeout policy trop court sur scripts longs.",
      visual: "Erreurs scripts",
      animation: "Checklist",
      checklistItems: [
        "Mauvais contexte root/user",
        "Pas de set -e / exit code",
        "Chemin absolu incorrect",
        "Timeout policy",
      ],
      onScreenText: ["Tester en pilote"],
    },
    recap: {
      narration: "Scripts déployés. Lab jamf-scripts, Patch Management ensuite.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab jamf-scripts"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-patch-management",
    title: "Patch Management Jamf",
    module: "Jamf Patch Management",
    level: "Expert",
    objective: "Surveiller et déployer mises à jour applicatives avec Jamf Patch.",
    courseSlug: "jamf-200",
    labSlug: "jamf-patch-management",
    quizSlug: "examen-jamf-200",
    visualType: "process",
    intro: {
      narration:
        "Les apps tierces sont le vecteur d'attaque le plus négligé. Jamf Patch Management surveille versions Chrome, Zoom, Firefox et déploie updates automatiquement.",
      visual: "Patch dashboard avec apps outdated",
      animation: "Patch catalog intro",
      onScreenText: ["Patch Management", "Conformité apps"],
    },
    architecture: {
      narration:
        "Catalogue Patch → Software Title → Patch Policy → Smart Group non conforme → Policy install update → reporting conformité.",
      visual: "Patch pipeline Jamf",
      animation: "Patch flow diagram",
      nodes: [
        { id: "cat", label: "Patch Catalog", icon: "jamf" },
        { id: "title", label: "Software Title", icon: "certificate" },
        { id: "mac", label: "Mac updated", icon: "apple-device" },
      ],
      connections: [
        { from: "cat", to: "title" },
        { from: "title", to: "mac" },
      ],
      onScreenText: ["Software Title", "Deadline"],
    },
    demo: {
      narration:
        "Activez un Software Title Chrome dans Patch Management. Définissez seuil minimum version et deadline 14 jours. Scope patch policy sur Smart Group. Consultez Patch Compliance report.",
      visual: "Jamf Patch UI walkthrough",
      animation: "Screen Studio patch",
      durationSeconds: 175,
      requiredScreenshots: [
        "Jamf Pro → Patch Management → Software Titles",
        "Jamf → Patch Policy configuration",
        "Jamf → Patch Compliance report",
        "Jamf Pro → Policies → Patch install",
      ],
      onScreenText: ["Compliance %", "Deadline"],
    },
    errors: {
      narration:
        "Custom apps non reconnues par le catalogue nécessitent Extension Attributes manuels. Patch policy sans Self Service fallback bloque les users en deadline.",
      visual: "Erreurs patch",
      animation: "Checklist",
      checklistItems: [
        "App non dans catalogue",
        "Deadline trop agressive",
        "Policy patch sans test pilote",
        "Inventory apps stale",
      ],
      onScreenText: ["Piloter d'abord"],
    },
    recap: {
      narration: "Patch Management actif. Lab jamf-patch-management, quiz Jamf 200.",
      visual: "Récap",
      animation: "Outro",
      onScreenText: ["Lab jamf-patch-management"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-protect",
    title: "Introduction à Jamf Protect",
    module: "Jamf Protect",
    level: "Expert",
    objective: "Déployer plans de sécurité Jamf Protect et corréler avec Jamf Pro.",
    courseSlug: "jamf-200",
    labSlug: "jamf-protect",
    quizSlug: "examen-jamf-200",
    visualType: "architecture",
    intro: {
      narration:
        "XProtect ne suffit pas face aux menaces ciblées. Jamf Protect analyse comportements endpoint macOS et remonte analytics au SOC.",
      visual: "Jamf Protect + Mac shield",
      animation: "Protect intro",
      onScreenText: ["Jamf Protect", "EDR macOS"],
    },
    architecture: {
      narration:
        "Jamf Pro inscrit l'agent Protect, les plans définissent règles MITRE, alertes remontent dans Protect dashboard et peuvent déclencher workflows Jamf Pro.",
      visual: "Jamf Pro ↔ Protect ↔ Mac",
      animation: "Protect architecture",
      nodes: [
        { id: "jamf", label: "Jamf Pro", icon: "jamf" },
        { id: "protect", label: "Jamf Protect", icon: "security" },
        { id: "mac", label: "macOS", icon: "apple-device" },
      ],
      connections: [
        { from: "jamf", to: "protect" },
        { from: "protect", to: "mac" },
      ],
      onScreenText: ["Security Plans", "Analytics"],
    },
    demo: {
      narration:
        "Liez Jamf Pro à Protect, déployez l'agent via policy. Créez un Security Plan baseline avec blocage binaries non signés. Simulez une alerte test et tracez la remediation dans Protect dashboard.",
      visual: "Jamf Protect console demo",
      animation: "Screen Studio Protect",
      durationSeconds: 180,
      requiredScreenshots: [
        "Jamf Protect → Plans → New",
        "Jamf Protect → Analytics dashboard",
        "Jamf Pro → Policy → Jamf Protect agent",
        "Jamf Protect → Alert detail",
      ],
      onScreenText: ["Agent installé", "Plan actif"],
    },
    errors: {
      narration:
        "Agent Protect non installé sur Mac Silicon sans approval system extension. Plans trop agressifs génèrent alert fatigue. Pas de processus SOC pour trier les alertes Protect.",
      visual: "Erreurs Protect",
      animation: "Checklist",
      checklistItems: [
        "System extension bloquée",
        "Plan non assigné",
        "Alertes non triées",
        "Pas d'intégration SIEM",
      ],
      onScreenText: ["Extension approuvée ?"],
    },
    recap: {
      narration: "Jamf Protect déployé. Lab jamf-protect, examen blanc Jamf 200. Certification Jamf 200 Ready.",
      visual: "Récap certification",
      animation: "Outro certif",
      onScreenText: ["Lab jamf-protect", "Examen Jamf 200"],
    },
  }),
  ...jamfTrainingStoryboards,
];
