import type { LessonContent } from "@/lib/types";
import { proModules, type ProModule } from "@/lib/data/pro-modules/index";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";
import {
  getJamf116TopicBlocks,
  getJamf116DocVersion,
  resolveJamf116Topic,
} from "@/lib/data/jamf/jamf-pro-11-16-content";
import {
  getIntuneLearnTopicBlocks,
  getIntuneLearnDocVersion,
  resolveIntuneLearnTopic,
} from "@/lib/data/intune/microsoft-learn-content";

function findModuleForLesson(lessonSlug: string): ProModule | undefined {
  return proModules.find((m) => m.lessons.some((l) => l.slug === lessonSlug));
}

type ProLessonTopic = {
  overview: string[];
  concepts: string[];
  steps: string[];
  checks: string[];
  pitfalls: string[];
};

function buildProLessonTopic(proModule: ProModule, lessonTitle: string, lessonSlug: string, domain: string): ProLessonTopic {
  const lower = `${lessonSlug} ${lessonTitle}`.toLowerCase();

  if (lower.includes("abm") || lower.includes("ade") || lower.includes("apns") || lower.includes("intune")) {
    return {
      overview: [
        `${lessonTitle} relie l'écosystème Apple Business Manager à Microsoft Intune pour automatiser l'enrôlement et la gestion des appareils Apple.`,
        "Le point critique est la chaîne de confiance : compte Apple propriétaire, certificats, tokens, synchronisation et profil d'enrôlement doivent être cohérents.",
      ],
      concepts: [
        "ABM contient les appareils, les achats d'apps et les serveurs MDM autorisés.",
        "Intune consomme les tokens ABM/ADE et APNs pour enrôler, notifier et configurer les appareils.",
        "Un renouvellement mal fait peut rompre les nouveaux enrollments même si les appareils déjà gérés restent visibles.",
      ],
      steps: [
        "Vérifier les comptes propriétaires ABM, APNs et administrateurs Intune.",
        "Contrôler l'expiration des tokens et forcer une synchronisation.",
        "Tester avec un appareil pilote effacé ou neuf.",
        "Lire les statuts Intune et les journaux Entra si l'accès est conditionné.",
      ],
      checks: [
        "L'appareil apparaît dans ABM puis dans Intune avec le bon profil.",
        "Une commande MDM simple arrive sur l'appareil.",
        "Les erreurs d'enrôlement sont documentées avec horodatage et capture.",
      ],
      pitfalls: [
        "Renouveler APNs avec un autre Apple Account.",
        "Assigner l'appareil au mauvais serveur MDM dans ABM.",
      ],
    };
  }

  if (lower.includes("smart") || lower.includes("sg-")) {
    return {
      overview: [
        `${lessonTitle} sert à cibler dynamiquement les Mac selon leur inventaire, leur état de sécurité ou leur cycle de vie.`,
        "Les Smart Groups sont puissants parce qu'ils deviennent des scopes de policies, profils, patchs et rapports.",
      ],
      concepts: [
        "Un critère Smart Group doit être mesurable, stable et facile à expliquer.",
        "Les opérateurs, parenthèses logiques et exclusions évitent les déploiements trop larges.",
        "Les Smart Groups critiques doivent être testés avec Preview avant utilisation en production.",
      ],
      steps: [
        "Définir l'intention du groupe et le risque si le groupe est trop large.",
        "Construire les critères à partir de l'inventaire ou d'Extension Attributes.",
        "Prévisualiser les membres et comparer avec l'attendu.",
        "Utiliser le groupe dans un scope pilote avant production.",
      ],
      checks: [
        "Le nombre de membres correspond à l'hypothèse.",
        "Les exclusions protègent les appareils VIP, lab et production sensible.",
        "Le groupe est nommé et documenté.",
      ],
      pitfalls: [
        "Utiliser un critère trop vague comme nom d'ordinateur contient une chaîne générale.",
        "Oublier qu'un changement d'inventaire peut déplacer automatiquement un Mac dans le scope.",
      ],
    };
  }

  if (lower.includes("policy")) {
    return {
      overview: [
        `${lessonTitle} couvre l'exécution contrôlée des actions Jamf Pro sur les Mac.`,
        "Une policy de qualité est prévisible : trigger clair, fréquence adaptée, scope limité, logs lisibles et rollback connu.",
      ],
      concepts: [
        "Les triggers Recurring Check-in, Enrollment Complete, Login, Startup, Self Service et custom events répondent à des usages distincts.",
        "La fréquence empêche les relances involontaires ou, au contraire, permet une remédiation récurrente.",
        "Le scope et les exclusions forment la barrière de sécurité principale.",
      ],
      steps: [
        "Créer une policy sans impact destructif sur un groupe pilote.",
        "Choisir trigger et fréquence selon le scénario.",
        "Ajouter package, script ou commande avec logs exploitables.",
        "Analyser les résultats policy logs avant extension.",
      ],
      checks: [
        "La policy s'exécute une seule fois ou de manière récurrente selon l'objectif.",
        "Les échecs affichent une cause actionnable.",
        "Le scope ne contient pas d'appareils hors périmètre.",
      ],
      pitfalls: [
        "Déployer une policy Enrollment Complete trop lourde qui ralentit le premier démarrage.",
        "Oublier les exclusions lors d'une remédiation massive.",
      ],
    };
  }

  if (lower.includes("script")) {
    return {
      overview: [
        `${lessonTitle} transforme Jamf Pro en plateforme d'automatisation macOS.`,
        "Les scripts doivent être idempotents, journalisés et paramétrables, car ils s'exécutent souvent avec des privilèges élevés.",
      ],
      concepts: [
        "Les paramètres Jamf permettent de réutiliser un script sur plusieurs policies.",
        "Un code retour non nul doit signaler un échec réel et compréhensible.",
        "La sécurité impose de protéger secrets, chemins, entrées utilisateur et commandes destructives.",
      ],
      steps: [
        "Écrire un script court avec commentaires utiles et mode dry-run si possible.",
        "Tester localement sur un Mac de lab.",
        "Publier dans Jamf avec paramètres documentés.",
        "Contrôler logs, code retour et comportement en relance.",
      ],
      checks: [
        "Le script peut être relancé sans casser l'état du Mac.",
        "Les logs expliquent ce qui a été fait.",
        "Aucun secret n'est codé en dur.",
      ],
      pitfalls: [
        "Supposer que l'environnement shell Jamf est identique au Terminal utilisateur.",
        "Écrire un script qui réussit silencieusement alors qu'il n'a rien appliqué.",
      ],
    };
  }

  if (lower.includes("patch") || lower.includes("chrome")) {
    return {
      overview: [
        `${lessonTitle} organise la réduction du risque applicatif par mises à jour mesurées.`,
        "Le patch management doit équilibrer urgence sécurité, compatibilité métier et expérience utilisateur.",
      ],
      concepts: [
        "Un titre patch suit les versions installées et la version cible.",
        "Les Smart Groups de conformité pilotent les remédiations.",
        "Les apps critiques demandent des vagues, délais et messages utilisateur adaptés.",
      ],
      steps: [
        "Choisir une application et définir la version cible.",
        "Mesurer le parc installé et les versions obsolètes.",
        "Créer une remédiation pilote avec retour utilisateur.",
        "Construire un rapport de conformité avant généralisation.",
      ],
      checks: [
        "Le taux de conformité augmente après la policy.",
        "Les utilisateurs disposent d'un délai clair si l'app doit être fermée.",
        "Les échecs sont regroupés par cause.",
      ],
      pitfalls: [
        "Forcer une mise à jour qui interrompt une app critique en pleine journée.",
        "Mesurer seulement l'installation, sans vérifier la version réellement lancée.",
      ],
    };
  }

  if (lower.includes("protect") || lower.includes("cis") || lower.includes("nist")) {
    return {
      overview: [
        `${lessonTitle} place la sécurité endpoint Apple dans une logique de détection, conformité et réponse.`,
        "Jamf Protect complète le MDM en donnant de la visibilité sur comportements, malware, posture et signaux de risque.",
      ],
      concepts: [
        "Les analytics détectent des comportements ou indicateurs spécifiques à macOS.",
        "Les plans de protection doivent être assignés par groupe et testés pour limiter le bruit.",
        "Les alertes ont de la valeur si elles sont reliées à un processus SOC ou ITSM.",
      ],
      steps: [
        "Déployer le plan sur un groupe pilote.",
        "Analyser les alertes générées et ajuster le bruit.",
        "Relier les événements à SIEM ou workflow de réponse.",
        "Documenter les règles custom et leur propriétaire.",
      ],
      checks: [
        "Les endpoints remontent un état actif.",
        "Les alertes critiques atteignent le bon canal.",
        "La conformité CIS/NIST est mesurable.",
      ],
      pitfalls: [
        "Activer trop de règles sans capacité de triage.",
        "Traiter Jamf Protect comme un simple antivirus sans workflow de réponse.",
      ],
    };
  }

  if (lower.includes("filevault") || lower.includes("gatekeeper") || lower.includes("xprotect") || lower.includes("zero")) {
    return {
      overview: [
        `${lessonTitle} couvre une brique de sécurité macOS essentielle pour protéger l'appareil et ses données.`,
        "La sécurité Apple repose sur plusieurs couches : matériel, démarrage, chiffrement, contrôle d'exécution, MDM et identité.",
      ],
      concepts: [
        "FileVault protège les données au repos avec escrow de clé côté MDM.",
        "Gatekeeper, notarisation, XProtect et SIP réduisent les risques d'exécution ou modification non autorisée.",
        "Zero Trust combine état appareil, identité, conformité et accès conditionnel.",
      ],
      steps: [
        "Identifier l'exigence sécurité et la version macOS cible.",
        "Configurer le profil ou la policy en pilote.",
        "Vérifier l'état local et la remontée MDM.",
        "Prévoir procédure support, exception et audit.",
      ],
      checks: [
        "Le contrôle est actif sur l'appareil pilote.",
        "La console MDM remonte l'état attendu.",
        "Le support sait récupérer ou expliquer l'impact utilisateur.",
      ],
      pitfalls: [
        "Activer une protection sans procédure d'exception.",
        "Confondre conformité déclarée et protection réellement appliquée.",
      ],
    };
  }

  return {
    overview: [
      `${lessonTitle} est une compétence opérationnelle du module ${proModule.number} — ${proModule.title}.`,
      `Elle doit être comprise dans le contexte ${domain}, avec une validation sur appareil pilote et une documentation prête pour le support.`,
    ],
    concepts: [
      "Chaque configuration doit avoir un objectif, un scope, un propriétaire et une méthode de rollback.",
      "Les changements MDM doivent être observables côté console et côté appareil.",
      "La progression du module se valide par la pratique, le lab et le quiz associé.",
    ],
    steps: [
      "Lire l'objectif de la leçon et préparer le lab.",
      "Configurer le scénario sur un groupe pilote.",
      "Observer les résultats, logs et états d'inventaire.",
      "Documenter la procédure avant le quiz.",
    ],
    checks: [
      "Le comportement attendu est visible sur un appareil pilote.",
      "Les captures et logs prouvent la réussite.",
      "Les erreurs fréquentes sont connues avant production.",
    ],
    pitfalls: [
      "Passer directement à la production.",
      "Ne pas relier la configuration au lab et au quiz du module.",
    ],
  };
}

function buildContent(proModule: ProModule, lessonTitle: string, lessonSlug: string): LessonContent {
  const domain = proModule.number <= 11 ? "Microsoft Intune" : proModule.number >= 18 ? "Apple Security" : "Jamf Pro";
  const intuneTopic = proModule.number === 11 ? resolveIntuneLearnTopic(lessonSlug) : null;
  const intuneLearn = intuneTopic ? getIntuneLearnTopicBlocks(intuneTopic) : null;
  const jamfTopic = proModule.number >= 12 && proModule.number <= 17 ? resolveJamf116Topic(lessonSlug, proModule.slug) : null;
  const jamf116 = jamfTopic ? getJamf116TopicBlocks(jamfTopic) : null;
  const topic = intuneLearn
    ? {
        overview: intuneLearn.overview,
        concepts: [...intuneLearn.architecture.map((a) => `[Architecture] ${a}`), ...intuneLearn.concepts],
        steps: intuneLearn.steps,
        checks: intuneLearn.checks,
        pitfalls: intuneLearn.pitfalls,
        summary: intuneLearn.summary,
        docRef: intuneLearn.docRef,
      }
    : jamf116
      ? {
          overview: jamf116.overview,
          concepts: [...jamf116.architecture.map((a) => `[Architecture] ${a}`), ...jamf116.concepts],
          steps: jamf116.steps,
          checks: jamf116.checks,
          pitfalls: jamf116.pitfalls,
          summary: jamf116.summary,
          docRef: jamf116.docRef,
        }
      : { ...buildProLessonTopic(proModule, lessonTitle, lessonSlug, domain), summary: [] as string[], docRef: undefined as string | undefined };

  const docVersion =
    proModule.number === 11 ? getIntuneLearnDocVersion() : proModule.number <= 17 ? `Jamf Pro ${getJamf116DocVersion()}` : domain;
  const consoleName =
    proModule.number === 11 ? "Microsoft Intune admin center" : proModule.number <= 17 ? "Jamf Pro 11.16" : domain;

  return {
    objectives: [
      `Maîtriser « ${lessonTitle} » aligné ${docVersion}.`,
      `Appliquer les procédures ${domain} documentées dans ${consoleName}.`,
      `Préparer le quiz « ${proModule.quizSlug} » et le lab « ${proModule.labSlug} ».`,
      `Obtenir le badge ${proModule.badgeName} après validation (score ≥ 80 %).`,
    ],
    prerequisites: [
      proModule.number > 11 ? `Avoir complété le module ${proModule.number - 1} ou posséder l'expérience équivalente.` : "Compte Intune Administrator et accès Apple Business Manager.",
      "Environnement de lab ou tenant de test disponible.",
      "Connexion internet stable.",
    ],
    theory: [
      {
        title: "Contexte",
        body: [
          `${lessonTitle} — module ${proModule.number}/18 · ${docVersion}.`,
          ...topic.overview,
          topic.docRef ? `Référence : ${topic.docRef}` : `Référence module : ${proModule.description}`,
        ],
      },
      {
        title: proModule.number === 11 ? "Architecture Intune Apple" : "Architecture Jamf Pro 11.16",
        body: intuneLearn?.architecture ?? jamf116?.architecture ?? topic.concepts.slice(0, 3),
      },
      {
        title: "Concepts clés",
        body: intuneLearn ? intuneLearn.concepts : jamf116 ? jamf116.concepts : topic.concepts,
      },
      {
        title: "Validation attendue",
        body: [
          ...topic.checks,
          "Progression enregistrée via Supabase (leçons, quiz, labs).",
          `Quiz associé : ${proModule.quizSlug} · Lab : ${proModule.labSlug} · Badge : ${proModule.badgeName}.`,
        ],
      },
    ],
    steps: topic.steps.map((description, index) => ({
      title: ["Préparer", "Configurer", "Valider", "Documenter", "Finaliser"][index] ?? `Étape ${index + 1}`,
      description,
    })),
    screenshots: getScreenshotsForLesson(lessonSlug.replace(/^m\d+-/, "").replace(/^m\d\d-/, ""), {
      courseSlug: "parcours-professionnel",
      lesson: { slug: lessonSlug, title: lessonTitle, duration: "30 min" },
      domain,
    }),
    bestPractices: [
      ...topic.checks.map((check) => `Contrôle qualité : ${check}`),
      "Documentez chaque configuration dans un runbook interne.",
      "Testez sur un groupe pilote avant déploiement global.",
      "Maintenez un calendrier de renouvellement certificats et tokens.",
      `Alignez les décisions avec le parcours certification (modules ${proModule.number}).`,
    ].slice(0, 7),
    troubleshooting: [
      ...topic.pitfalls.map((pitfall) => ({
        problem: pitfall,
        solution:
          "Revenez à un appareil de lab, réduisez le scope, relisez les logs Jamf/Intune et documentez la correction avant de relancer.",
      })),
      {
        problem: "Le profil ou la policy ne s'applique pas.",
        solution: "Vérifiez le scope, le check-in MDM, le certificat APNs et les conflits de profils.",
      },
      {
        problem: "Erreur de synchronisation ABM/ADE.",
        solution: "Renouvelez le token serveur, forcez une sync et vérifiez l'assignation des appareils.",
      },
      {
        problem: "Quiz ou badge non débloqué.",
        solution: "Assurez-vous d'être connecté, d'avoir score ≥ 80 % et d'avoir complété le lab associé.",
      },
    ].slice(0, 5),
    summary: topic.summary.length > 0 ? topic.summary : undefined,
    finalQuizSlug: proModule.quizSlug,
  };
}

export function isProModuleLesson(lessonSlug: string): boolean {
  return proModules.some((m) => m.lessons.some((l) => l.slug === lessonSlug));
}

export function getProModuleLessonContent(lessonSlug: string): LessonContent | null {
  const proModule = findModuleForLesson(lessonSlug);
  if (!proModule) return null;
  const lesson = proModule.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  return buildContent(proModule, lesson.title, lessonSlug);
}

export function getProModuleForLesson(lessonSlug: string): ProModule | undefined {
  return findModuleForLesson(lessonSlug);
}
