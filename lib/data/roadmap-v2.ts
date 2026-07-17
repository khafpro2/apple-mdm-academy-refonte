export type RoadmapItem = {
  title: string;
  description: string;
  status: "planned" | "in_progress" | "done";
  quarter?: string;
  icon?: string;
  tag?: string;
};

export type RoadmapVersion = {
  version: string;
  label: string;
  items: RoadmapItem[];
};

export const currentVersion = "1.0";

export const roadmapVersions: RoadmapVersion[] = [
  {
    version: "1.0",
    label: "Version actuelle — Lancement commercial",
    items: [
      { title: "Landing premium & tarification", description: "Page d'accueil SaaS, plans Free/Pro/Enterprise", status: "done", icon: "🚀" },
      { title: "Parcours certifiants", description: "Apple IT Pro, Jamf 100/200, Intune, Security", status: "done", icon: "📚" },
      { title: "Examens blancs", description: "4 examens blancs, correction détaillée, historique", status: "done", icon: "📝" },
      { title: "Certificats PDF", description: "Génération et vérification de certificats de réussite", status: "done", icon: "🏆" },
      { title: "Dashboard apprenant", description: "Progression, scores, recommandations", status: "done", icon: "📊" },
      { title: "Dashboard entreprise (démo)", description: "Reporting équipes placeholder", status: "done", icon: "🏢" },
      { title: "API v1 & OpenAPI", description: "Endpoints REST documentés", status: "done", icon: "⚡" },
      { title: "Assistant IA Apple MDM", description: "Tuteur pédagogique Claude Haiku", status: "done", icon: "🤖" },
    ],
  },
  {
    version: "2.0",
    label: "V2 — Vidéos, Membre & Paiement",
    items: [
      // ── 5 éléments prioritaires demandés ──
      {
        title: "Vidéos HeyGen",
        description: "Leçons vidéo animées par IA : avatar pédagogique HeyGen pour chaque module. Sous-titres FR/EN, transcripts, mode podcast. Jamf 100/200 en priorité.",
        status: "in_progress",
        quarter: "Q3 2026",
        icon: "🎬",
        tag: "Priorité haute",
      },
      {
        title: "Espace membre & Profil avancé",
        description: "Tableau de bord personnel complet : badges, certificats, historique d'examens, objectifs, niveau de maîtrise par domaine MDM, partage LinkedIn.",
        status: "in_progress",
        quarter: "Q3 2026",
        icon: "👤",
        tag: "Priorité haute",
      },
      {
        title: "Paiement Stripe",
        description: "Plans Pro & Enterprise avec Stripe Checkout. Gestion des abonnements, portail client, facturation automatique, webhooks sécurisés.",
        status: "in_progress",
        quarter: "Q3 2026",
        icon: "💳",
        tag: "Priorité haute",
      },
      {
        title: "Suivi de progression avancé",
        description: "Analytics d'apprentissage : temps par module, courbe de progression, prédiction score examen, points faibles détectés par IA, recommandations personnalisées.",
        status: "in_progress",
        quarter: "Q4 2026",
        icon: "📈",
        tag: "Priorité haute",
      },
      // ── Suite du catalogue ──
      { title: "Jamf 300 Prep", description: "Parcours expert architecture, API, webhooks, patch management avancé", status: "in_progress", quarter: "Q2 2026", icon: "🛠️" },
      { title: "Jamf 400 Prep", description: "Automatisation, CI/CD MDM, migration, projet architecte Jamf", status: "in_progress", quarter: "Q2 2026", icon: "🔧" },
      { title: "App mobile Expo", description: "iOS/Android — progression, examens et notifications push", status: "in_progress", quarter: "Q3 2026", icon: "📱", tag: "Mobile" },
      { title: "Apple Platform Deployment", description: "Parcours complet déploiement Apple — préparation APD officielle", status: "planned", quarter: "Q3 2026", icon: "🍎" },
      { title: "Apple Security Research", description: "Threat modeling, XProtect, sécurité avancée enterprise", status: "planned", quarter: "Q4 2026", icon: "🔒" },
      { title: "Microsoft Defender for Endpoint", description: "Intégration MDE + Apple MDM", status: "planned", quarter: "Q4 2026", icon: "🛡️" },
      { title: "Okta + Apple", description: "SSO, SCIM, fédération d'identité avec Okta", status: "planned", quarter: "Q1 2027", icon: "🔑" },
      { title: "Kandji / Mosyle / Workspace ONE", description: "Hors périmètre V1 — réintégration éventuelle en V2+", status: "planned", quarter: "2027+", icon: "📦", tag: "Hors V1" },
    ],
  },
];
