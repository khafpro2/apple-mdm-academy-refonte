import { createProductionStoryboard } from "@/src/lib/video-storyboard-factory";
import { JAMF_TRAINING_CONTENT } from "@/lib/data/jamf/jamf-training-content";
import { JAMF_TRAINING_TOPICS } from "@/lib/data/jamf/jamf-training-registry";

function topicMeta(id: (typeof JAMF_TRAINING_TOPICS)[number]["id"]) {
  return JAMF_TRAINING_TOPICS.find((t) => t.id === id)!;
}

/** Storyboards complémentaires — sujets Jamf Training sans storyboard production existant */
export const jamfTrainingStoryboards = [
  createProductionStoryboard({
    slug: "jamf-configuration-profiles",
    title: "Configuration Profiles Jamf Pro 11.16",
    module: "Configuration Profiles",
    level: "Intermédiaire",
    objective: "Déployer payloads MDM Wi-Fi et FileVault via profils scoped.",
    courseSlug: "jamf-100",
    labSlug: "jamf-discovery",
    quizSlug: "quiz-jamf-configuration-profiles",
    visualType: "screenshot",
    intro: {
      narration: JAMF_TRAINING_CONTENT["configuration-profiles"].heygenScript.split("\n").slice(0, 3).join(" "),
      visual: "Avatar HeyGen + capture profil Jamf",
      animation: "Fade-in titre Configuration Profiles",
      onScreenText: ["Configuration Profiles", "Payloads MDM"],
    },
    architecture: {
      narration:
        "Jamf Pro → Configuration Profile → payloads Wi-Fi, FileVault, restrictions → scope Smart Group → push APNs → Mac.",
      visual: "Diagramme profil → scope → appareil",
      animation: "Architecture nodes",
      nodes: [
        { id: "jamf", label: "Jamf Pro", icon: "jamf" },
        { id: "profile", label: "Config Profile", icon: "certificate" },
        { id: "mac", label: "Mac géré", icon: "apple-device" },
      ],
      connections: [
        { from: "jamf", to: "profile" },
        { from: "profile", to: "mac" },
      ],
      onScreenText: ["Payloads MDM", "Scope", "Push APNs"],
    },
    demo: {
      narration:
        "Computers → Configuration Profiles → New. Ajoutez Wi-Fi enterprise et FileVault escrow. Scope ADE-SUPERVISED. Vérifiez Réglages → Profils sur Mac pilote.",
      visual: "Capture Jamf profil + Mac Profils installés",
      animation: "Screen Studio zoom payloads",
      durationSeconds: 150,
      requiredScreenshots: [
        "Jamf → Configuration Profiles → New",
        "Payload Wi-Fi enterprise",
        "Payload FileVault escrow",
        "Mac → Profils installés",
      ],
      onScreenText: ["New Profile", "Scope", "Vérification Mac"],
    },
    errors: {
      narration:
        "Conflits Wi-Fi duplicate SSID, FileVault sans escrow IT, profil scoped avant test pilote.",
      visual: "Checklist erreurs",
      animation: "Puces warning",
      checklistItems: ["Conflit payloads Wi-Fi", "FileVault sans escrow", "Scope production sans pilote", "APNs invalide"],
      onScreenText: ["Erreurs fréquentes"],
    },
    recap: {
      narration: "Profils MDM scoped et vérifiés. Lab jamf-discovery, ressource PDF, quiz configuration profiles.",
      visual: "Récap + liens lab/quiz",
      animation: "Transition recap",
      onScreenText: ["Lab jamf-discovery", "Quiz", "Ressource PDF"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-inventory",
    title: "Inventaire Jamf Pro 11.16",
    module: "Inventory",
    level: "Débutant",
    objective: "Exploiter inventaire, Advanced Search et Extension Attributes.",
    courseSlug: topicMeta("inventory").courseSlug,
    labSlug: topicMeta("inventory").labSlug,
    quizSlug: topicMeta("inventory").quizSlug,
    visualType: "screenshot",
    intro: {
      narration: "L'inventaire Jamf Pro est la source de vérité pour scope, conformité et dépannage MDM enterprise.",
      visual: "Avatar + dashboard Computers",
      animation: "Fade-in",
      onScreenText: ["Inventory", "Advanced Search"],
    },
    architecture: {
      narration: "Check-in appareil → inventaire General/Hardware/Software/Security → EA → Smart Groups et Advanced Search.",
      visual: "Flux inventaire",
      animation: "Nodes séquentiels",
      onScreenText: ["Inventaire", "EA", "Smart Groups"],
    },
    demo: {
      narration:
        "Computers → fiche Mac → onglets Security et Software. Advanced Search FileVault OFF. Export pour équipe sécurité.",
      visual: "Capture inventaire + Advanced Search",
      animation: "Zoom onglets",
      durationSeconds: 140,
      requiredScreenshots: ["Jamf → Computer record", "Advanced Search", "Extension Attributes"],
      onScreenText: ["Computer record", "Advanced Search"],
    },
    errors: {
      narration: "Last check-in stale, inventaire vide post-enrollment, EA script en échec silencieux.",
      visual: "Checklist",
      animation: "Warning list",
      checklistItems: ["Stale check-in", "Inventaire incomplet", "EA script failed", "Confondre Search et Smart Group"],
      onScreenText: ["Pièges inventaire"],
    },
    recap: {
      narration: "Inventaire maîtrisé. Lab jamf-discovery. Quiz inventory. Préparation Jamf Fundamentals.",
      visual: "Récap",
      animation: "Recap",
      onScreenText: ["Lab", "Quiz"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-enrollment",
    title: "Enrollment ADE Jamf Pro 11.16",
    module: "Enrollment",
    level: "Intermédiaire",
    objective: "Configurer ADE, PreStage et enrollment zero-touch Mac.",
    courseSlug: topicMeta("enrollment").courseSlug,
    labSlug: topicMeta("enrollment").labSlug,
    quizSlug: topicMeta("enrollment").quizSlug,
    visualType: "architecture",
    intro: {
      narration: "Automated Device Enrollment transforme le déploiement Mac enterprise : ABM, token MDM, PreStage, premier boot configuré.",
      visual: "ABM + Jamf + Mac",
      animation: "Fade-in",
      onScreenText: ["ADE", "PreStage"],
    },
    architecture: {
      narration: "ABM assigne appareils → token serveur Jamf → PreStage scope profils/policies → Setup Assistant Mac supervisé.",
      visual: "Diagramme ABM → Jamf → Mac",
      animation: "Architecture flow",
      nodes: [
        { id: "abm", label: "ABM", icon: "abm" },
        { id: "jamf", label: "Jamf Pro", icon: "jamf" },
        { id: "mac", label: "Mac ADE", icon: "apple-device" },
      ],
      connections: [
        { from: "abm", to: "jamf" },
        { from: "jamf", to: "mac" },
      ],
      onScreenText: ["Token ABM", "PreStage"],
    },
    demo: {
      narration:
        "Settings → ADE : sync token ABM. Computer PreStage : Wi-Fi, FileVault, agent. Test erase Mac lab, enrollment ADE, validation profils.",
      visual: "PreStage + Setup Assistant",
      animation: "Demo screens",
      durationSeconds: 160,
      requiredScreenshots: ["Jamf ADE settings", "Computer PreStage", "Mac Setup Assistant"],
      onScreenText: ["PreStage", "Test ADE"],
    },
    errors: {
      narration: "Token ABM expiré, APNs invalide, PreStage trop lourd, appareil non assigné ABM.",
      visual: "Checklist",
      animation: "Errors",
      checklistItems: ["Token ABM expiré", "APNs invalide", "PreStage lourd", "Appareil non assigné"],
      onScreenText: ["Erreurs ADE"],
    },
    recap: {
      narration: "Enrollment zero-touch opérationnel. Voir jamf-prestage. Lab jamf-discovery. Quiz enrollment.",
      visual: "Récap",
      animation: "Recap",
      onScreenText: ["Lab", "Quiz", "jamf-prestage"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-self-service",
    title: "Jamf Self Service 11.16",
    module: "Self Service",
    level: "Intermédiaire",
    objective: "Catalogue IT Self Service avec policies à la demande.",
    courseSlug: topicMeta("self-service").courseSlug,
    labSlug: topicMeta("self-service").labSlug,
    quizSlug: topicMeta("self-service").quizSlug,
    visualType: "screenshot",
    intro: {
      narration: "Self Service réduit les tickets IT en exposant apps et policies approuvées aux utilisateurs macOS.",
      visual: "Self Service app macOS",
      animation: "Fade-in",
      onScreenText: ["Self Service", "Catalogue IT"],
    },
    architecture: {
      narration: "Settings Self Service branding → policies Self Service tab → app sur Mac → exécution policy utilisateur.",
      visual: "Flux catalogue",
      animation: "Flow",
      onScreenText: ["Branding", "Policies", "Utilisateur"],
    },
    demo: {
      narration:
        "Settings → Self Service → macOS : catégories Productivité. Policy Teams : Self Service tab. Test installation sur Mac utilisateur.",
      visual: "Console Self Service + app Mac",
      animation: "Demo",
      durationSeconds: 145,
      requiredScreenshots: ["Jamf Self Service settings", "Policy Self Service tab", "Mac Self Service app"],
      onScreenText: ["Branding", "Catalogue"],
    },
    errors: {
      narration: "Catalogue surchargé, policies destructives exposées, descriptions techniques incompréhensibles.",
      visual: "Checklist",
      animation: "Warnings",
      checklistItems: ["Catalogue trop large", "Policy destructive", "Descriptions techniques", "App Self Service absente"],
      onScreenText: ["UX Self Service"],
    },
    recap: {
      narration: "Catalogue Self Service pilote validé. Lab jamf-self-service. Quiz Self Service.",
      visual: "Récap",
      animation: "Recap",
      onScreenText: ["Lab", "Quiz"],
    },
  }),

  createProductionStoryboard({
    slug: "jamf-packages",
    title: "Packages Jamf Pro 11.16",
    module: "Packages",
    level: "Intermédiaire",
    objective: "Déployer PKG/DMG via Distribution Point et policy Packages.",
    courseSlug: topicMeta("packages").courseSlug,
    labSlug: topicMeta("packages").labSlug,
    quizSlug: topicMeta("packages").quizSlug,
    visualType: "screenshot",
    intro: {
      narration: "Les packages Jamf Pro distribuent logiciels enterprise via Distribution Points et policies Packages.",
      visual: "Distribution Point + PKG",
      animation: "Fade-in",
      onScreenText: ["Packages", "Distribution Point"],
    },
    architecture: {
      narration: "PKG upload DP → Jamf metadata → policy Packages Install → scope → Mac télécharge et installe.",
      visual: "Architecture package deploy",
      animation: "Nodes",
      onScreenText: ["DP", "Policy", "Mac"],
    },
    demo: {
      narration:
        "Computers → Packages → New upload PKG. Policy Packages Install, scope pilote. Vérifier Policy Logs et app installée.",
      visual: "Jamf Packages + Mac app",
      animation: "Demo",
      durationSeconds: 150,
      requiredScreenshots: ["Jamf Packages New", "Policy Packages payload", "Policy Logs Completed"],
      onScreenText: ["Upload PKG", "Policy Install"],
    },
    errors: {
      narration: "DP inaccessible WAN, PKG non signé, mauvaise action Cache, espace disque insuffisant.",
      visual: "Checklist",
      animation: "Errors",
      checklistItems: ["DP inaccessible", "PKG Gatekeeper", "Cache vs Install", "Espace disque"],
      onScreenText: ["Erreurs package"],
    },
    recap: {
      narration: "Package déployé. Lab jamf-packages. Quiz packages. Jamf 100 et 200.",
      visual: "Récap",
      animation: "Recap",
      onScreenText: ["Lab", "Quiz"],
    },
  }),
];

export const jamfTrainingStoryboardSlugs = new Set(jamfTrainingStoryboards.map((s) => s.slug));
