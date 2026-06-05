export type RoadmapItem = {
  title: string;
  description: string;
  status: "planned" | "in_progress" | "done";
  quarter?: string;
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
      { title: "Landing premium & tarification", description: "Page d'accueil SaaS, plans Free/Pro/Enterprise", status: "done" },
      { title: "Parcours certifiants", description: "Apple IT Pro, Jamf 100/200, Intune, Security", status: "done" },
      { title: "Examens blancs & certificats PDF", description: "4 examens, génération certificat", status: "done" },
      { title: "Dashboard entreprise (démo)", description: "Reporting équipes placeholder", status: "done" },
      { title: "API v1 & OpenAPI", description: "Endpoints REST documentés", status: "done" },
    ],
  },
  {
    version: "2.0",
    label: "Version suivante — V2",
    items: [
      { title: "Jamf 300", description: "Architecture enterprise, API avancée, multi-site", status: "planned", quarter: "Q3 2026" },
      { title: "Jamf 400", description: "Expert architecture & intégrations complexes", status: "planned", quarter: "Q4 2026" },
      { title: "Apple Platform Deployment", description: "Parcours complet déploiement Apple", status: "planned", quarter: "Q3 2026" },
      { title: "Apple Security Research", description: "Threat modeling, XProtect, sécurité avancée", status: "planned", quarter: "Q4 2026" },
      { title: "Microsoft Defender for Endpoint", description: "Intégration MDE + Apple", status: "planned", quarter: "Q4 2026" },
      { title: "Okta + Apple", description: "SSO, SCIM, fédération identité", status: "planned", quarter: "Q1 2027" },
      { title: "Kandji", description: "Parcours alternatif MDM Apple", status: "planned", quarter: "Q1 2027" },
      { title: "Mosyle", description: "Formation Mosyle Business", status: "planned", quarter: "Q2 2027" },
      { title: "Workspace ONE", description: "VMware WS1 + Apple", status: "planned", quarter: "Q2 2027" },
      { title: "App mobile Expo", description: "iOS/Android — progression & examens", status: "in_progress", quarter: "Q3 2026" },
      { title: "Apple MDM Assistant IA", description: "Tuteur IA pédagogique complet", status: "in_progress", quarter: "Q3 2026" },
    ],
  },
];
