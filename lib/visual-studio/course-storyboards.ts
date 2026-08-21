import type { CourseStoryboard, VisualArchitecture } from "./types";
import { createCourseStoryboard, createScene, buildFireflyPrompt } from "./storyboard-generator";

const ADE_ARCHITECTURE: VisualArchitecture = {
  id: "ade-main-architecture",
  title: "Flux Automated Device Enrollment",
  description:
    "De l’achat via un canal autorisé jusqu’à la mise à disposition de l’utilisateur, via Apple Business Manager et le serveur MDM.",
  actors: [
    {
      id: "reseller",
      label: "Apple ou revendeur autorisé",
      type: "cloud-service",
      domain: "apple",
      description: "Canal d’achat qui enregistre l’appareil auprès d’Apple",
    },
    {
      id: "abm",
      label: "Apple Business Manager",
      type: "cloud-service",
      domain: "apple",
      description: "Inventaire organisationnel et attribution MDM",
    },
    {
      id: "jamf",
      label: "Jamf Pro",
      type: "cloud-service",
      domain: "jamf",
      description: "Serveur MDM possible",
    },
    {
      id: "intune",
      label: "Microsoft Intune",
      type: "cloud-service",
      domain: "microsoft",
      description: "Serveur MDM possible",
    },
    {
      id: "activation",
      label: "Services d’activation Apple",
      type: "cloud-service",
      domain: "apple",
      description: "Identification de l’organisation au premier démarrage",
    },
    {
      id: "mac",
      label: "Mac",
      type: "device",
      domain: "apple",
    },
    {
      id: "iphone",
      label: "iPhone",
      type: "device",
      domain: "apple",
    },
    {
      id: "ipad",
      label: "iPad",
      type: "device",
      domain: "apple",
    },
    {
      id: "admin",
      label: "Administrateur IT",
      type: "admin",
      domain: "apple",
    },
    {
      id: "user",
      label: "Utilisateur",
      type: "user",
      domain: "inactive",
    },
    {
      id: "profiles",
      label: "Profils & réglages",
      type: "configuration",
      domain: "compliance",
    },
    {
      id: "certs",
      label: "Certificats",
      type: "certificate",
      domain: "security",
    },
    {
      id: "apps",
      label: "Applications",
      type: "application",
      domain: "apple",
    },
  ],
  edges: [
    { id: "e1", from: "reseller", to: "abm", label: "Enregistrement", variant: "synchronization" },
    { id: "e2", from: "admin", to: "abm", label: "Attribution MDM", variant: "action" },
    { id: "e3", from: "abm", to: "jamf", label: "Serveur MDM", variant: "dependency" },
    { id: "e4", from: "abm", to: "intune", label: "Serveur MDM", variant: "dependency" },
    { id: "e5", from: "mac", to: "activation", label: "Activation", variant: "secure" },
    { id: "e6", from: "activation", to: "abm", label: "Identification org.", variant: "validation" },
    { id: "e7", from: "activation", to: "jamf", label: "Redirection MDM", variant: "secure" },
    { id: "e8", from: "jamf", to: "profiles", label: "Déploiement", variant: "action" },
    { id: "e9", from: "jamf", to: "certs", label: "Certificats", variant: "secure" },
    { id: "e10", from: "jamf", to: "apps", label: "Apps", variant: "action" },
    { id: "e11", from: "profiles", to: "user", label: "Prêt", variant: "validation" },
  ],
  linearFlow: [
    "Achat",
    "Apple Business Manager",
    "Attribution MDM",
    "Activation",
    "Inscription",
    "Configuration",
    "Utilisateur",
  ],
};

const adeEnrollmentStoryboard = createCourseStoryboard({
  courseId: "ade-enrollment",
  moduleId: "apple-business-manager",
  moduleTitle: "Apple Business Manager",
  courseTitle: "Comprendre Automated Device Enrollment",
  learningObjective:
    "Expliquer comment un appareil Apple acheté auprès d’un canal autorisé peut être automatiquement associé à une organisation et dirigé vers un serveur MDM pendant l’assistant de configuration.",
  centralMessage:
    "ADE permet de rattacher automatiquement un appareil Apple à l’organisation et à son serveur MDM lors de l’activation initiale.",
  verificationStatus: "draft-needs-review",
  relatedCourseSlug: "apple-it-professional",
  relatedLessonSlug: "ade-enrollment",
  architecture: ADE_ARCHITECTURE,
  scenes: [
    createScene({
      id: "ade-s1-problem",
      order: 1,
      title: "Le problème",
      purpose: "Poser le défi du déploiement à grande échelle sans configuration manuelle.",
      onScreenText: [
        "Comment préparer 500 Mac sans les configurer manuellement ?",
        "Temps élevé",
        "Risque d’erreur",
      ],
      narration:
        "Imaginez cinq cents Mac qui arrivent demain. Les configurer un par un ralentit l’entreprise et multiplie les erreurs. Automated Device Enrollment existe pour supprimer cette étape manuelle.",
      durationSeconds: 8,
      visualLayout: "problem-split",
      animationInstructions: [
        "Entrée : pile de Mac à gauche, fond clair.",
        "Au centre, étapes manuelles qui se répètent en fondu successif.",
        "À droite, bâtiment entreprise qui attend — indicateur temps et risque en overlay bas.",
        "Pas de logos Apple.",
      ],
      transition: "Fondu vers titre de définition",
      fireflySubject:
        "IT administrator managing a large fleet of Mac laptops stacked on a table, enterprise office waiting for devices, repetitive manual setup steps visualized as simple cards, stressed timeline indicator",
      canvaInstructions: [
        "Frame 16:9, fond #F4F6FA.",
        "Trois zones : technicien / étapes / entreprise.",
        "Badges orange « temps » et rouge « risque » en bas — texte séparé, pas dans l’image générée.",
      ],
      heygenInstructions: [
        "Avatar à gauche en mode picture-in-picture léger ou hors cadre.",
        "Lire la question à voix claire, rythme calme.",
        "Durée cible : 8 secondes.",
      ],
      sceneContent: {
        kind: "problem",
        question: "Comment préparer 500 Mac sans les configurer manuellement ?",
        leftLabel: "Technicien + pile de Mac",
        centerSteps: [
          "Déballer",
          "Créer un compte",
          "Configurer Wi-Fi",
          "Installer apps",
          "Répéter ×500",
        ],
        rightLabel: "Entreprise en attente",
        timeIndicator: "Temps élevé",
        riskIndicator: "Risque d’erreur",
      },
    }),
    createScene({
      id: "ade-s2-definition",
      order: 2,
      title: "La définition",
      purpose: "Définir Automated Device Enrollment en trois fonctions clés.",
      onScreenText: [
        "Automated Device Enrollment",
        "Rattachement automatique à l’organisation",
        "Attribution au serveur MDM",
        "Inscription pendant l’assistant de configuration",
      ],
      narration:
        "Automated Device Enrollment rattache automatiquement l’appareil à l’organisation, l’attribue à un serveur MDM, et lance l’inscription pendant l’assistant de configuration.",
      durationSeconds: 10,
      visualLayout: "definition-cards",
      animationInstructions: [
        "Titre centré, puis trois cartes qui apparaissent de gauche à droite.",
        "Chaque carte : icône géométrique simple + libellé court.",
      ],
      transition: "Zoom léger vers le diagramme composants",
      fireflySubject:
        "three clean rounded information cards floating on pale blue white background, geometric icons for organization, MDM server, and setup assistant, enterprise training aesthetic",
      canvaInstructions: [
        "Titre « Automated Device Enrollment » en navy.",
        "Trois cartes blanches équidistantes avec icônes non-logo.",
      ],
      heygenInstructions: [
        "Énoncer le titre puis les trois fonctions, une pause courte entre chaque.",
        "Durée cible : 10 secondes.",
      ],
      sceneContent: {
        kind: "definition",
        headline: "Automated Device Enrollment",
        functions: [
          "Rattachement automatique à l’organisation",
          "Attribution au serveur MDM",
          "Inscription pendant l’assistant de configuration",
        ],
      },
    }),
    createScene({
      id: "ade-s3-components",
      order: 3,
      title: "Les composants",
      purpose: "Montrer les acteurs du flux ADE dans un diagramme horizontal.",
      onScreenText: [
        "Apple ou revendeur",
        "Apple Business Manager",
        "Jamf Pro",
        "Microsoft Intune",
        "Mac · iPhone · iPad",
        "Utilisateur",
      ],
      narration:
        "Le flux relie le canal d’achat, Apple Business Manager, le serveur MDM — Jamf Pro ou Microsoft Intune — les appareils Apple, et enfin l’utilisateur.",
      durationSeconds: 12,
      visualLayout: "architecture-horizontal",
      diagramId: "ade-main-architecture",
      animationInstructions: [
        "Apparition séquentielle des nœuds de gauche à droite.",
        "Connecteurs action / dépendance allumés au fur et à mesure.",
        "Jamf et Intune présentés comme alternatives MDM.",
      ],
      transition: "Fondu vers étapes d’attribution ABM",
      fireflySubject:
        "horizontal enterprise architecture diagram nodes as rounded cards: reseller, business manager portal, MDM servers, Apple devices, end user, clean connectors, pale background, no logos",
      canvaInstructions: [
        "Utiliser le composant ArchitectureDiagram exporté ou reconstruire en formes simples.",
        "Libellés produits autorisés (Jamf Pro, Microsoft Intune) en texte — pas de faux logos.",
      ],
      heygenInstructions: [
        "Pointer verbalement chaque composant dans l’ordre du diagramme.",
        "Durée cible : 12 secondes.",
      ],
      sceneContent: {
        kind: "architecture",
        diagramId: "ade-main-architecture",
      },
    }),
    createScene({
      id: "ade-s4-abm-assignment",
      order: 4,
      title: "Attribution dans Apple Business Manager",
      purpose: "Montrer les quatre étapes d’attribution d’un appareil au serveur MDM.",
      onScreenText: [
        "1. L’appareil apparaît dans Apple Business Manager",
        "2. L’administrateur sélectionne l’appareil",
        "3. Attribution au serveur MDM",
        "4. État : attribué",
      ],
      narration:
        "Dans Apple Business Manager, l’appareil apparaît dans l’inventaire. L’administrateur le sélectionne, l’attribue au serveur MDM, et l’état passe à attribué.",
      durationSeconds: 12,
      visualLayout: "process-steps",
      animationInstructions: [
        "Quatre étapes numérotées : highlight progressif.",
        "État final « attribué » en vert (validation).",
        "Ne pas reproduire une fausse UI Apple — cartes abstraites uniquement.",
      ],
      transition: "Coupe vers premier démarrage",
      fireflySubject:
        "abstract enterprise admin workflow with four numbered rounded steps assigning a device card to an MDM server card, status changing to assigned, clean infographic, no UI chrome mimicking Apple",
      canvaInstructions: [
        "Stepper horizontal 1→4.",
        "Badge vert « Attribué » sur la dernière étape.",
      ],
      heygenInstructions: [
        "Compter les quatre étapes clairement.",
        "Durée cible : 12 secondes.",
      ],
      sceneContent: {
        kind: "process-steps",
        steps: [
          "L’appareil apparaît dans Apple Business Manager",
          "L’administrateur sélectionne l’appareil",
          "Il attribue l’appareil au serveur MDM",
          "L’état passe à « attribué »",
        ],
      },
    }),
    createScene({
      id: "ade-s5-first-boot",
      order: 5,
      title: "Premier démarrage",
      purpose: "Expliquer le contact avec les services d’activation et la redirection MDM.",
      onScreenText: [
        "Allumage du Mac",
        "Contact services d’activation Apple",
        "Identification de l’organisation",
        "Retour des infos serveur MDM",
        "Début de l’inscription",
      ],
      narration:
        "Au premier démarrage, le Mac contacte les services d’activation Apple. Apple identifie l’organisation, renvoie les informations du serveur MDM, et l’inscription commence.",
      durationSeconds: 15,
      visualLayout: "boot-sequence",
      animationInstructions: [
        "Séquence 5 étapes avec connecteur sécurisé (navy).",
        "Pulse sur le nœud activation, puis flèche vers MDM.",
      ],
      transition: "Fondu vers cascade de configuration",
      fireflySubject:
        "Mac laptop powering on connected by secure line to cloud activation services then to MDM server, sequential five-step enterprise flow, geometric style, no logos",
      canvaInstructions: [
        "Timeline verticale ou en ligne brisée 5 étapes.",
        "Connecteur « flux sécurisé » en navy.",
      ],
      heygenInstructions: [
        "Rythme un cran plus lent — 15 secondes.",
        "Insister sur « avant même que l’utilisateur configure quoi que ce soit ».",
      ],
      sceneContent: {
        kind: "boot-sequence",
        steps: [
          "L’utilisateur allume le Mac",
          "Le Mac contacte les services d’activation Apple",
          "Apple identifie l’organisation",
          "Apple retourne les informations du serveur MDM",
          "L’inscription commence",
        ],
      },
    }),
    createScene({
      id: "ade-s6-auto-config",
      order: 6,
      title: "Configuration automatique",
      purpose: "Montrer les éléments déployés automatiquement après inscription.",
      onScreenText: [
        "Profil Wi-Fi",
        "Certificat",
        "FileVault",
        "Applications",
        "Restrictions",
        "Configuration de compte",
        "Politiques de sécurité",
      ],
      narration:
        "Une fois inscrit, le MDM déploie progressivement le Wi-Fi, les certificats, FileVault, les applications, les restrictions, la configuration de compte et les politiques de sécurité.",
      durationSeconds: 15,
      visualLayout: "config-cascade",
      animationInstructions: [
        "Apparition en cascade (stagger 0.2s) des sept éléments.",
        "Icônes géométriques : configuration, certificat, sécurité, application.",
      ],
      transition: "Wipe vers comparaison bonnes pratiques",
      fireflySubject:
        "cascade of seven rounded configuration tiles descending onto a Mac silhouette: wifi, certificate, encryption, apps, restrictions, account, security policies, clean pale background, no text, no logos",
      canvaInstructions: [
        "Grille 2×4 ou pile animée — libellés en texte Canva, pas dans l’image.",
      ],
      heygenInstructions: [
        "Énumérer les éléments au rythme de l’apparition visuelle.",
        "Durée cible : 15 secondes.",
      ],
      sceneContent: {
        kind: "config-cascade",
        items: [
          "Profil Wi-Fi",
          "Certificat",
          "FileVault",
          "Applications",
          "Restrictions",
          "Configuration de compte",
          "Politiques de sécurité",
        ],
      },
    }),
    createScene({
      id: "ade-s7-best-practice",
      order: 7,
      title: "Bonne pratique",
      purpose: "Contraster inscription manuelle et Automated Device Enrollment.",
      onScreenText: [
        "Inscription manuelle",
        "Automated Device Enrollment",
        "Automatique · reproductible · supervisé · grande échelle",
      ],
      narration:
        "L’inscription manuelle dépend du technicien, risque l’oubli et produit des configurations incohérentes. ADE est automatique, reproductible, supervisé, et adapté au déploiement à grande échelle.",
      durationSeconds: 12,
      visualLayout: "comparison",
      animationInstructions: [
        "Split screen : gauche muted/orange, droite navy/vert.",
        "Items gauches apparaissent puis droite en validation verte.",
      ],
      transition: "Fondu vers récapitulatif",
      fireflySubject:
        "side by side comparison boards, left chaotic manual IT setup, right clean automated enrollment flow, enterprise training infographic, balanced 16:9, no text no logos",
      canvaInstructions: [
        "Deux colonnes égales.",
        "Gauche : bordure orange. Droite : bordure verte.",
        "Ne pas utiliser de coche seule — toujours un libellé textuel.",
      ],
      heygenInstructions: [
        "Contraste vocal clair entre les deux colonnes.",
        "Durée cible : 12 secondes.",
      ],
      sceneContent: {
        kind: "comparison",
        leftTitle: "Inscription manuelle",
        leftItems: [
          "Dépend du technicien",
          "Risque d’oubli",
          "Processus lent",
          "Configuration incohérente",
        ],
        rightTitle: "Automated Device Enrollment",
        rightItems: [
          "Automatique",
          "Reproductible",
          "Supervisé",
          "Adapté au déploiement à grande échelle",
        ],
      },
    }),
    createScene({
      id: "ade-s8-recap",
      order: 8,
      title: "Résumé",
      purpose: "Récapituler le flux complet et poser la question de rétention.",
      onScreenText: [
        "Achat → ABM → Attribution MDM → Activation → Inscription → Configuration → Utilisateur",
        "Quel élément relie l’appareil à l’organisation avant même son premier démarrage ?",
      ],
      narration:
        "Achat, Apple Business Manager, attribution MDM, activation, inscription, configuration, utilisateur. Question : quel élément relie l’appareil à l’organisation avant même son premier démarrage ?",
      durationSeconds: 10,
      visualLayout: "recap-flow",
      diagramId: "ade-main-architecture",
      animationInstructions: [
        "Flux linéaire complet en une passe.",
        "Question finale en bas, pause 2 secondes.",
      ],
      transition: "Fondu sortant / carte fin de module",
      fireflySubject:
        "complete horizontal enterprise device enrollment pipeline as seven connected rounded nodes ending at a user, clean pale blue white background, premium technical infographic, no text no logos",
      canvaInstructions: [
        "Reprendre le linearFlow architecture.",
        "Bannière question en bas avec contraste élevé.",
      ],
      heygenInstructions: [
        "Lire le flux rapidement puis poser la question et laisser un silence.",
        "Durée cible : 10 secondes.",
      ],
      sceneContent: {
        kind: "recap",
        flow: [
          "Achat",
          "Apple Business Manager",
          "Attribution MDM",
          "Activation",
          "Inscription",
          "Configuration",
          "Utilisateur",
        ],
        finalQuestion:
          "Quel élément relie l’appareil à l’organisation avant même son premier démarrage ?",
      },
    }),
  ],
  productionResources: [
    {
      id: "prod-firefly",
      tool: "firefly",
      title: "Adobe Firefly — pack scènes ADE",
      instructions: [
        "Générer une illustration 16:9 par scène ayant un fireflyPrompt.",
        "Interdire texte, logos et fausses interfaces Apple dans l’image.",
        "Importer dans Canva comme calque de fond uniquement.",
      ],
      prompt: buildFireflyPrompt(
        "Apple enterprise device enrollment learning series, consistent character style across eight scenes",
      ),
    },
    {
      id: "prod-canva",
      tool: "canva",
      title: "Canva — montage 16:9",
      instructions: [
        "Template 1920×1080, fond #F4F6FA, cartes blanches coins 16px.",
        "Typographie système / Inter ; titres navy #0B102B.",
        "Ajouter les libellés onScreenText en calques texte éditables.",
        "Exporter MP4 ou séquence PNG pour HeyGen.",
      ],
    },
    {
      id: "prod-heygen",
      tool: "heygen",
      title: "HeyGen — narration FR",
      instructions: [
        "Avatar formateur IT, voix fr-FR professionnelle.",
        "Une scène HeyGen = une scène storyboard ; coller narration + durée.",
        "Format 16:9 ; superposer le frame exporté du Studio en arrière-plan.",
      ],
    },
    {
      id: "prod-freeform",
      tool: "freeform",
      title: "Apple Freeform — tableau pédagogique",
      instructions: [
        "Reproduire la vue FreeformBoard : en-tête → scènes 1–8 → ressources.",
        "Une carte par scène ; connecteurs horizontaux.",
        "Exporter PDF pour revue pédagogique.",
      ],
    },
    {
      id: "prod-playwright",
      tool: "playwright",
      title: "Export PNG Playwright",
      instructions: [
        "npm run dev puis npm run export:storyboards",
        "Captures dans public/visual-studio/exports/",
        "Viewport forcé 1920×1080, zone [data-export-frame]",
      ],
    },
  ],
});

/** Registre des storyboards Studio visuel (source de vérité données). */
export const courseStoryboards: CourseStoryboard[] = [adeEnrollmentStoryboard];

export function getCourseStoryboard(courseId: string): CourseStoryboard | undefined {
  return courseStoryboards.find((s) => s.courseId === courseId);
}

export function listCourseStoryboards(): CourseStoryboard[] {
  return courseStoryboards;
}

export function getScene(courseId: string, sceneId: string) {
  const board = getCourseStoryboard(courseId);
  return board?.scenes.find((s) => s.id === sceneId);
}
