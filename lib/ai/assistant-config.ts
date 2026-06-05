export type AssistantCapability = {
  id: string;
  title: string;
  description: string;
  status: "ready" | "planned";
};

export const assistantCapabilities: AssistantCapability[] = [
  { id: "qa", title: "Répondre aux questions", description: "Questions sur MDM, ABM, Jamf, Intune et sécurité Apple.", status: "ready" },
  { id: "explain", title: "Expliquer les concepts", description: "Explications pédagogiques adaptées au niveau de l'apprenant.", status: "ready" },
  { id: "revise", title: "Proposer des révisions", description: "Plans de révision basés sur les domaines faibles des examens.", status: "planned" },
  { id: "labs", title: "Recommander des labs", description: "Suggestions de labs pratiques selon la progression.", status: "planned" },
];

export const assistantArchitecture = {
  name: "Apple MDM Assistant",
  version: "0.1.0",
  stack: {
    frontend: "Next.js / React — /assistant",
    backend: "Route API /api/assistant (à implémenter)",
    llm: "Vercel AI SDK + provider configurable (OpenAI, Anthropic, etc.)",
    context: "RAG sur cours, labs, ressources et FAQ",
    memory: "Session utilisateur + historique Supabase",
  },
  endpoints: [
    { method: "POST", path: "/api/assistant/chat", description: "Conversation streaming" },
    { method: "GET", path: "/api/assistant/suggestions", description: "Suggestions contextuelles" },
  ],
};

export const demoResponses = [
  "L'Automated Device Enrollment (ADE) permet d'inscrire automatiquement les appareils au MDM lors de l'activation. Il nécessite Apple Business Manager et un serveur de tokens MDM.",
  "Pour Jamf Pro, un Smart Group dynamique utilise des critères d'inventaire (OS, apps, extensions) pour cibler des policies sans maintenance manuelle.",
  "Platform SSO sur macOS permet l'authentification fédérée avec Intune et votre IdP — je vous recommande le lab « Platform SSO Intune » après le module compliance.",
];
