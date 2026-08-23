import type { AudioLesson } from "@/lib/data/audio/types";

export const macosAudioLessons: AudioLesson[] = [
  {
    slug: "install-config-macos",
    trackNumber: 1,
    title: "Installation et configuration de macOS",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Installer, mettre à jour ou mettre à niveau macOS, puis transférer les données avec l’Assistant migration.",
    summary:
      "Distinguer installation, mise à jour et mise à niveau, puis préparer un Mac propre ou migré pour un utilisateur d’entreprise.",
    narration: [
      "En support Apple, trois mots ne veulent pas dire la même chose. Une mise à jour apporte des correctifs dans la même version majeure. Une mise à niveau change de version majeure, par exemple vers macOS Tahoe. Une installation propre réécrit le système, souvent après un effacement.",
      "Avant toute intervention, notez le modèle, la puce, la version actuelle, l’espace libre et le type de compte. Un Mac Apple Silicon et un Mac Intel n’ont pas les mêmes gestes de démarrage. Vérifiez aussi FileVault, le verrouillage d’activation et la présence d’un profil de gestion.",
      "Pour mettre à jour, utilisez Réglages Système, Général, Mise à jour de logiciels. En entreprise, la mise à jour peut être reportée, imposée ou masquée par le service de gestion. Si le bouton habituel est absent ou grisé, cherchez d’abord une restriction gérée avant de suspecter un défaut matériel.",
      "L’Assistant migration copie comptes, apps, documents et réglages depuis un autre Mac, une sauvegarde Time Machine ou un PC Windows. Placez les deux machines sur le même réseau stable, alimentées, et laissez le transfert aller au bout. Un arrêt trop tôt produit un compte incomplet et des tickets en cascade.",
      "Après une mise à niveau, validez trois choses : l’ouverture de session, le réseau, et les apps critiques. Sur un Mac géré, confirmez que le profil est toujours présent et que le jeton d’amorçage pourra servir aux prochaines mises à jour. Si l’utilisateur doit livrer la machine, documentez la version finale et le compte utilisé.",
    ],
    quiz: [
      {
        id: "ads-audio-01-1",
        text: "Quelle action change de version majeure de macOS ?",
        options: [
          "Une mise à jour de correctifs",
          "Une mise à niveau",
          "Une réparation First Aid",
          "Un reset NVRAM",
        ],
        correctIndex: 1,
        explanation:
          "La mise à niveau change de version majeure. La mise à jour reste dans la même génération et apporte surtout des correctifs.",
      },
      {
        id: "ads-audio-01-2",
        text: "L’Assistant migration peut copier les données depuis :",
        options: [
          "Uniquement iCloud Drive",
          "Un autre Mac, Time Machine ou un PC Windows",
          "La partition de récupération uniquement",
          "Le Secure Enclave",
        ],
        correctIndex: 1,
        explanation:
          "L’Assistant migration prend en charge un Mac source, une sauvegarde Time Machine, ou un PC Windows.",
      },
      {
        id: "ads-audio-01-3",
        text: "Si Mise à jour de logiciels est grisée sur un Mac d’entreprise, le premier réflexe est :",
        options: [
          "Effacer le Mac immédiatement",
          "Chercher une restriction ou une politique de gestion",
          "Désactiver FileVault",
          "Réinstaller Safari",
        ],
        correctIndex: 1,
        explanation:
          "En parc géré, les mises à jour sont souvent contrôlées. Vérifiez la gestion avant d’agir sur le système.",
      },
      {
        id: "ads-audio-01-4",
        text: "Après une mise à niveau, que validez-vous en priorité ?",
        options: [
          "Uniquement le fond d’écran",
          "Session, réseau et applications critiques",
          "Le numéro de série public",
          "La suppression du compte local",
        ],
        correctIndex: 1,
        explanation:
          "Le support confirme que l’utilisateur peut ouvrir la session, rejoindre le réseau et travailler avec ses apps.",
      },
    ],
  },
  {
    slug: "utilisateurs-groupes",
    trackNumber: 2,
    title: "Utilisateurs, groupes et permissions",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Gérer les comptes utilisateurs, les mots de passe de session et les droits d’administration.",
    summary:
      "Comprendre administrateur, standard, partage uniquement, et réinitialiser un mot de passe sans casser le trousseau.",
    narration: [
      "macOS distingue plusieurs types de comptes. Un administrateur peut installer des apps, changer les réglages sensibles et gérer d’autres utilisateurs. Un compte standard travaille au quotidien avec moins de privilèges. Un compte Partage uniquement ouvre des ressources réseau sans session locale complète.",
      "Le premier administrateur créé à l’installation reçoit généralement un jeton sécurisé, indispensable pour FileVault. Ajouter un second administrateur ne lui donne pas automatiquement ce jeton. En entreprise, le jeton d’amorçage, conservé par le service de gestion, sert à débloquer certaines opérations comme l’activation de FileVault pour un compte mobile.",
      "Mot de passe oublié : si l’utilisateur connaît encore son identifiant Apple personnel lié à la session, la réinitialisation peut passer par ce compte. Sinon, un autre administrateur peut changer le mot de passe. En dernier recours, macOS Recovery propose l’utilitaire Réinitialiser le mot de passe. Attention : changer le mot de passe hors session crée souvent un nouveau trousseau de connexion.",
      "Les permissions POSIX et les listes de contrôle ACL expliquent beaucoup de tickets « je ne peux pas enregistrer ». Le dossier Départ appartient à l’utilisateur. Les dossiers partagés comme Utilisateurs, Partagé ont des règles précises. Ne donnez pas le rôle administrateur pour contourner un droit de fichier : corrigez le dossier, pas le privilège global.",
      "En support, documentez qui est admin local, si un compte de secours existe, et si FileVault est actif. Un mot de passe réinitialisé n’est pas une fin de ticket. Faites ouvrir la session, vérifiez le trousseau, iCloud s’il est utilisé, et le déverrouillage FileVault au prochain redémarrage.",
    ],
    quiz: [
      {
        id: "ads-audio-02-1",
        text: "Quel compte peut gérer les autres utilisateurs et les réglages sensibles ?",
        options: [
          "Compte standard",
          "Compte administrateur",
          "Compte Partage uniquement",
          "Compte invité obligatoire",
        ],
        correctIndex: 1,
        explanation: "Seul un administrateur gère les utilisateurs et les réglages système sensibles.",
      },
      {
        id: "ads-audio-02-2",
        text: "Après une réinitialisation de mot de passe hors session, quel effet secondaire est fréquent ?",
        options: [
          "FileVault se désactive tout seul",
          "Un nouveau trousseau de connexion est créé",
          "Le numéro de série change",
          "Safari est désinstallé",
        ],
        correctIndex: 1,
        explanation:
          "Le mot de passe de session et le trousseau de connexion sont liés. Les changer séparément crée un nouveau trousseau.",
      },
      {
        id: "ads-audio-02-3",
        text: "Le jeton sécurisé sert surtout à :",
        options: [
          "Envoyer un e-mail",
          "Autoriser des opérations de chiffrement comme FileVault",
          "Remplacer le Wi‑Fi",
          "Forcer AirDrop",
        ],
        correctIndex: 1,
        explanation:
          "Le jeton sécurisé est lié au chiffrement et à FileVault. Sans lui, certaines actions de sécurité échouent.",
      },
      {
        id: "ads-audio-02-4",
        text: "Pour un dossier que l’utilisateur ne peut pas modifier, le bon réflexe est :",
        options: [
          "Le passer administrateur tout de suite",
          "Analyser le propriétaire et les permissions du dossier",
          "Effacer le disque",
          "Désactiver le pare-feu",
        ],
        correctIndex: 1,
        explanation:
          "On corrige le droit sur le dossier. On n’élève pas le compte entier pour un simple problème de fichier.",
      },
    ],
  },
  {
    slug: "stockage-apps-processus",
    trackNumber: 3,
    title: "Stockage, applications et processus",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Repérer les dossiers par défaut, le comportement des apps, et les processus qui saturent le Mac.",
    summary:
      "Lire l’espace disque, distinguer apps système, adoptées et tierces, puis isoler un processus trop gourmand.",
    narration: [
      "Un ticket « mon Mac est plein » se traite avec méthode. Réglages Système, Général, Stockage montre les catégories : apps, documents, iCloud, système. Time Machine locale, les snapshots et les gros caches de compilation sont des causes fréquentes. Ne supprimez jamais à l’aveugle le dossier Système.",
      "Les dossiers par défaut comptent pour l’examen. Départ contient Bureau, Documents, Téléchargements, Bibliothèque utilisateur. Bibliothèque, Application Support et Caches expliquent beaucoup de profils corrompus. Le dossier Partagé sert aux fichiers communs à tous les comptes locaux. Applications accueille les apps pour tous les utilisateurs ; Applications dans le Départ n’est visible que pour un compte.",
      "Trois familles d’apps : préinstallées par Apple, adoptées depuis l’ancien Mac ou depuis une sauvegarde, et tierces. Une app tierce hors Mac App Store passe par Gatekeeper. Une app gérée peut être imposée, masquée ou non supprimable. Si une app « disparaît » après redémarrage, demandez si un profil ou un service de gestion la contrôle.",
      "Les processus se voient dans Moniteur d’activité. Un processus en tête processeur, mémoire ou énergie n’est pas forcément coupable : le système indexe, photographie Time Machine, ou compile. Forcez la fermeture seulement après avoir noté le nom du processus, l’utilisateur et l’impact. Relancer le Mac reste un outil, pas un diagnostic.",
      "En entreprise, le stockage est aussi une question de conformité. Un disque presque plein casse les mises à jour et FileVault. Avant une mise à niveau, exigez un espace libre confortable. Si iCloud Drive optimise le stockage, des fichiers peuvent n’être que des placeholders : l’utilisateur croit avoir perdu des documents alors qu’ils sont dans le nuage.",
    ],
    quiz: [
      {
        id: "ads-audio-03-1",
        text: "Où macOS classe-t-il l’espace utilisé par type de contenu ?",
        options: [
          "Utilitaire de disque uniquement",
          "Réglages Système, Général, Stockage",
          "Trousseau d’accès",
          "Safari",
        ],
        correctIndex: 1,
        explanation: "La vue Stockage des Réglages Système ventile apps, documents, système et iCloud.",
      },
      {
        id: "ads-audio-03-2",
        text: "Quelle affirmation décrit une app adoptée ?",
        options: [
          "Elle est forcément malveillante",
          "Elle vient souvent d’une migration ou d’une sauvegarde",
          "Elle ne peut pas s’ouvrir",
          "Elle remplace toujours le système",
        ],
        correctIndex: 1,
        explanation:
          "Les apps adoptées arrivent avec l’utilisateur depuis un ancien Mac ou une sauvegarde, contrairement aux apps préinstallées.",
      },
      {
        id: "ads-audio-03-3",
        text: "Le dossier Départ contient surtout :",
        options: [
          "Le firmware du Mac",
          "Les fichiers et réglages de l’utilisateur",
          "La partition de récupération",
          "Les certificats APNs",
        ],
        correctIndex: 1,
        explanation: "Le dossier Départ est l’espace personnel de l’utilisateur : documents, Bureau, Bibliothèque.",
      },
      {
        id: "ads-audio-03-4",
        text: "Avant de forcer la fermeture d’un processus, vous :",
        options: [
          "Effacez le volume",
          "Notez le nom, l’utilisateur et la ressource saturée",
          "Désactivez Gatekeeper",
          "Supprimez le compte",
        ],
        correctIndex: 1,
        explanation:
          "Un diagnostic utile commence par identifier le processus. La fermeture forcée vient ensuite, pas avant.",
      },
    ],
  },
  {
    slug: "diagnostic-systeme",
    trackNumber: 4,
    title: "Outils de diagnostic système",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Utiliser Moniteur d’activité et les informations matérielles pour isoler un incident.",
    summary:
      "Passer de la plainte utilisateur à une preuve : processeur, mémoire, énergie, disque, réseau, puis matériel.",
    narration: [
      "Le support efficace commence par une question simple : le problème est-il logiciel, réseau, compte, ou matériel. Moniteur d’activité est votre tableau de bord. Les onglets Processeur, Mémoire, Énergie, Disque et Réseau racontent cinq histoires différentes. Un Mac lent peut être en swap mémoire, pas en processeur saturé.",
      "Pour un échauffement ou une batterie qui fond, regardez Énergie et les processus en empêchement de veille. Pour un Wi‑Fi qui « marche mais pas vraiment », l’onglet Réseau montre les apps qui inondent la bande. Pour un disque saturé d’écritures, l’onglet Disque désigne souvent une indexation, une sync ou une app de sauvegarde.",
      "Les informations système restent indispensables. Apple, À propos de ce Mac, puis Plus d’infos, donne modèle, puce, mémoire, numéros de série et versions. En examen, on attend que vous sachiez où lire ces faits, pas que vous les inventiez. Un accessoire qui ne s’alimente pas se diagnostique aussi par le bus et le wattage, pas seulement par « ça marche pas ».",
      "Diagnostics Apple intervient quand le matériel est suspect : mémoire, écran, ventilateurs, clavier, batterie. Sur un Mac récent, le chemin passe par les options de démarrage ou un protocole précis selon le modèle. Ne confondez pas Diagnostics Apple avec Recovery, ni avec le mode sans échec. Chacun répond à une question différente.",
      "Documentez avant de conclure. Capturez le nom du processus, un extrait de journal, la version de macOS et le numéro de série. En organisation, ces preuves évitent de renvoyer une machine en atelier pour un simple agent de sync bloqué. Votre valeur de niveau deux, c’est la preuve, pas le redémarrage magique.",
    ],
    quiz: [
      {
        id: "ads-audio-04-1",
        text: "Quel outil montre processeur, mémoire, énergie, disque et réseau en direct ?",
        options: ["Console", "Moniteur d’activité", "Trousseau d’accès", "Aperçu"],
        correctIndex: 1,
        explanation: "Moniteur d’activité est l’outil temps réel pour les ressources du Mac.",
      },
      {
        id: "ads-audio-04-2",
        text: "Un Mac très chaud avec peu de charge processeur visible doit vous faire regarder :",
        options: [
          "Uniquement Safari",
          "L’onglet Énergie et les empêchements de veille",
          "Le fond d’écran",
          "AirDrop",
        ],
        correctIndex: 1,
        explanation:
          "La chaleur et la batterie dépendent souvent de l’énergie et de la veille, pas seulement du pourcentage processeur.",
      },
      {
        id: "ads-audio-04-3",
        text: "Diagnostics Apple sert à :",
        options: [
          "Réinstaller macOS",
          "Tester le matériel",
          "Créer un compte administrateur",
          "Configurer un VPN",
        ],
        correctIndex: 1,
        explanation: "Diagnostics Apple cible le matériel. Recovery et le mode sans échec servent à d’autres hypothèses.",
      },
      {
        id: "ads-audio-04-4",
        text: "Quelle information lisez-vous dans À propos de ce Mac ?",
        options: [
          "Le mot de passe FileVault",
          "Modèle, puce, mémoire et versions",
          "La clé de récupération institutionnelle",
          "Le jeton APNs",
        ],
        correctIndex: 1,
        explanation: "À propos de ce Mac donne l’identité matérielle et logicielle de la machine.",
      },
    ],
  },
  {
    slug: "console-logs",
    trackNumber: 5,
    title: "Console, journaux et Terminal",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Lire la Console et capturer un sysdiagnose pour un incident reproductible.",
    summary:
      "Passer des symptômes aux journaux : filtrer, reproduire, exporter, puis lancer un diagnostic système complet.",
    narration: [
      "Console est l’outil pour voir les messages système, les rapports de crash et l’activité en direct. Ouvrez-la, sélectionnez le Mac, puis reproduisez le problème sous les yeux du journal. Un bon filtre vaut mieux que dix minutes de défilement. Cherchez le nom de l’app, un code d’erreur, ou le mot fail.",
      "Les rapports de diagnostic se trouvent aussi dans Réglages, Confidentialité et sécurité, Analyse et améliorations. Un crash répété d’une app laisse une trace horodatée. En support, vous reliez l’heure du ticket à l’heure du rapport. Sans horodatage, vous devinez.",
      "sysdiagnose capture un instantané profond : journaux, états, configurations. Sur Mac, on le lance depuis le Terminal avec les droits adaptés, ou par le raccourci clavier de diagnostic. Prévenez l’utilisateur : la machine peut ralentir quelques minutes, puis une archive apparaît. C’est le livrable que l’ingénierie ou le fournisseur vous demandera.",
      "Le Terminal n’est pas un jouet. En examen et en production, vous l’utilisez pour des commandes de lecture : version, réseau, disque, processus. Évitez les commandes destructrices si une interface suffit. Si vous changez un réglage en ligne de commande, notez-le dans le ticket. Un collègue doit pouvoir comprendre ce qui a été tenté.",
      "Sur iPhone et iPad, sysdiagnose existe aussi, avec une combinaison de boutons courte. Une capture d’écran part souvent en même temps. Les journaux se retrouvent ensuite dans Analytique. Ne demandez pas à l’utilisateur un « log » vague : guidez le geste, puis récupérez le fichier. Une piste claire et nette commence par une capture propre.",
    ],
    quiz: [
      {
        id: "ads-audio-05-1",
        text: "Quel app Mac affiche journaux en direct et rapports de crash ?",
        options: ["Moniteur d’activité", "Console", "Utilitaire de disque", "Aperçu"],
        correctIndex: 1,
        explanation: "Console est l’app des journaux et des rapports de diagnostic.",
      },
      {
        id: "ads-audio-05-2",
        text: "sysdiagnose sert à :",
        options: [
          "Formater le disque",
          "Capturer un ensemble complet de journaux et d’états",
          "Créer un identifiant Apple",
          "Activer FileVault",
        ],
        correctIndex: 1,
        explanation: "sysdiagnose produit une archive de diagnostic pour un incident reproductible.",
      },
      {
        id: "ads-audio-05-3",
        text: "Pourquoi filtrer dans Console pendant la reproduction ?",
        options: [
          "Pour cacher les erreurs",
          "Pour relier un événement précis au moment du problème",
          "Pour accélérer le Wi‑Fi",
          "Pour désactiver Gatekeeper",
        ],
        correctIndex: 1,
        explanation: "Le filtre et l’horaire transforment un flux illisible en preuve exploitable.",
      },
      {
        id: "ads-audio-05-4",
        text: "Sur iPhone, un sysdiagnose se déclenche surtout :",
        options: [
          "En secouant l’appareil dix secondes",
          "Par une courte combinaison des boutons de volume et du bouton latéral",
          "En ouvrant Fichiers",
          "En désactivant le mode Avion",
        ],
        correctIndex: 1,
        explanation:
          "iOS et iPadOS capturent sysdiagnose par une combinaison courte des boutons, souvent accompagnée d’une capture d’écran.",
      },
    ],
  },
  {
    slug: "mode-recovery",
    trackNumber: 6,
    title: "RecoveryOS, démarrage sécurisé et réinstallation",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Choisir le bon mode de démarrage et utiliser Recovery pour réparer, réinstaller ou sécuriser.",
    summary:
      "Maîtriser Recovery, mode sans échec, options de démarrage et Utilitaire de sécurité de démarrage selon le Mac.",
    narration: [
      "Le premier réflexe n’est pas d’effacer. C’est de choisir le bon mode. Recovery sert à réinstaller macOS, réparer le disque, accéder à Terminal, réinitialiser un mot de passe, et ouvrir l’Utilitaire de sécurité de démarrage. Le mode sans échec charge un ensemble minimal pour isoler une extension ou un agent tiers. Les options de démarrage permettent de choisir le disque.",
      "Sur Apple Silicon, vous maintenez le bouton d’alimentation jusqu’aux options de démarrage. Sur Intel, les combinaisons clavier restent au programme : Recovery, mode sans échec, et selon les modèles d’autres modes. Apprenez les deux familles. Les organisations ont encore des parcs mixtes, et l’examen aussi.",
      "Réinstaller macOS depuis Recovery préserve en principe les données utilisateur si vous ne formatez pas. First Aid dans Utilitaire de disque vérifie le système de fichiers. Si First Aid échoue et que le volume est illisible, là seulement vous parlez d’effacement, après sauvegarde ou acceptation de perte. Confirmez FileVault : un volume chiffré demande un utilisateur autorisé ou une clé de récupération.",
      "L’Utilitaire de sécurité de démarrage ajuste la politique : sécurité maximale, sécurité réduite, ou sécurité permissive selon le modèle et le besoin. En entreprise, on reste au plus haut niveau compatible avec le déploiement. Baisser la sécurité pour « que ça marche » est une dette. Documentez toute exception, puis revenez à la politique nominale.",
      "Mode sans échec : sur Apple Silicon, vous ouvrez les options de démarrage, sélectionnez le disque, maintenez Maj, puis continuez en mode sans échec. Si le problème disparaît en mode sans échec, cherchez login items, extensions, ou logiciels tiers. S’il persiste, l’hypothèse bascule vers compte, système ou matériel. Relancer n’est pas une conclusion, c’est une fourche de diagnostic.",
    ],
    quiz: [
      {
        id: "ads-audio-06-1",
        text: "Sur un Mac Apple Silicon, comment ouvrir les options de démarrage ?",
        options: [
          "Appuyer trois fois sur Esc",
          "Maintenir le bouton d’alimentation",
          "Secouer le Mac",
          "Ouvrir Safari",
        ],
        correctIndex: 1,
        explanation: "Apple Silicon utilise un appui long sur le bouton d’alimentation pour afficher les options de démarrage.",
      },
      {
        id: "ads-audio-06-2",
        text: "Réinstaller macOS depuis Recovery sans formater :",
        options: [
          "Efface toujours les comptes",
          "Préserve en principe les fichiers utilisateur",
          "Désactive Internet à jamais",
          "Supprime FileVault automatiquement",
        ],
        correctIndex: 1,
        explanation: "La réinstallation sans effacement du volume vise à replacer le système en gardant les données.",
      },
      {
        id: "ads-audio-06-3",
        text: "Si un problème disparaît en mode sans échec, vous suspectez surtout :",
        options: [
          "Un écran cassé",
          "Un logiciel ou agent tiers",
          "Un numéro de série invalide",
          "L’absence d’eSIM",
        ],
        correctIndex: 1,
        explanation: "Le mode sans échec isole les extensions et éléments tiers. Si le souci part, l’hypothèse logicielle gagne.",
      },
      {
        id: "ads-audio-06-4",
        text: "L’Utilitaire de sécurité de démarrage sert à :",
        options: [
          "Créer un identifiant Apple",
          "Modifier la politique de sécurité de démarrage",
          "Configurer AirDrop",
          "Installer Chrome",
        ],
        correctIndex: 1,
        explanation:
          "Cet utilitaire, depuis Recovery, ajuste le niveau de sécurité de démarrage du Mac.",
      },
    ],
  },
  {
    slug: "filevault-support",
    trackNumber: 7,
    title: "FileVault en support",
    module: "Support macOS",
    courseSlug: "apple-device-support",
    durationLabel: "5 min",
    officialFocus: "Décrire FileVault, l’activer, déverrouiller avec une clé personnelle, puis faire tourner la clé.",
    summary:
      "Chiffrement du volume de démarrage, utilisateurs autorisés, clé personnelle, dépôt en gestion, rotation après usage.",
    narration: [
      "FileVault chiffre le volume de démarrage. Sans déverrouillage, les données au repos restent illisibles. À l’allumage, un utilisateur autorisé saisit son mot de passe, puis la session peut s’ouvrir. Ce n’est pas un antivirus. C’est une protection du disque en cas de perte, de vol, ou de disque extrait.",
      "L’activation se fait dans Réglages Système, Confidentialité et sécurité, ou via une politique de gestion. Le premier compte avec jeton sécurisé est central. En organisation, la clé de récupération est souvent déposée auprès du service de gestion. Une clé institutionnelle ancienne peut encore exister sur des parcs historiques, mais le modèle moderne, c’est la clé personnelle plus le dépôt.",
      "Si l’utilisateur oublie son mot de passe et qu’aucun autre utilisateur FileVault n’est disponible, la clé de récupération personnelle déverrouille le volume. Après usage de cette clé, faites-la tourner. Une clé déjà utilisée et encore écrite dans un ticket devient un secret usé. Le dépôt doit recevoir la nouvelle clé.",
      "FileVault n’empêche pas un Mac d’être géré, mais il change vos procédures. Recovery demandera une authentification. Une réinstallation ou un First Aid sur volume chiffré nécessite un identifiant autorisé. Si le Mac est verrouillé et que personne n’a la clé, vous n’avez plus de données à sauver : seulement un effacement et une réinstallation.",
      "En ticket, notez : FileVault actif ou non, utilisateurs autorisés, présence d’une clé en dépôt, et si une rotation vient d’avoir lieu. N’envoyez jamais une clé en clair dans un fil public. Le support de niveau un peut activer et expliquer. Le niveau deux gère la récupération, le dépôt et la remise en conformité.",
    ],
    quiz: [
      {
        id: "ads-audio-07-1",
        text: "FileVault protège surtout :",
        options: [
          "Les e-mails en transit uniquement",
          "Les données au repos sur le volume de démarrage",
          "Le réseau Wi‑Fi du bureau",
          "Les impressions AirPrint",
        ],
        correctIndex: 1,
        explanation: "FileVault chiffre le volume de démarrage pour protéger les données si le Mac est perdu ou démonté.",
      },
      {
        id: "ads-audio-07-2",
        text: "Après avoir déverrouillé un volume avec la clé personnelle, vous devez :",
        options: [
          "Supprimer tous les comptes",
          "Faire tourner la clé de récupération",
          "Désactiver le pare-feu",
          "Retirer le SSD",
        ],
        correctIndex: 1,
        explanation:
          "Une clé utilisée n’est plus un secret propre. On la renouvelle et on met à jour le dépôt.",
      },
      {
        id: "ads-audio-07-3",
        text: "En entreprise, où la clé de récupération est-elle souvent conservée ?",
        options: [
          "Sur un post-it écran",
          "Dans le dépôt du service de gestion",
          "Dans Photos",
          "Dans le firmware Intel uniquement",
        ],
        correctIndex: 1,
        explanation: "Le modèle moderne dépose la clé personnelle auprès du service de gestion des appareils.",
      },
      {
        id: "ads-audio-07-4",
        text: "Sans utilisateur autorisé ni clé de récupération, les données FileVault sont :",
        options: [
          "Récupérables par un redémarrage",
          "Inaccessibles, il reste l’effacement",
          "Visibles dans iMessage",
          "Stockées dans le Trousseau iCloud automatiquement",
        ],
        correctIndex: 1,
        explanation: "Sans secret de déverrouillage, FileVault a fait son travail : les données ne se lisent plus.",
      },
    ],
  },
];
