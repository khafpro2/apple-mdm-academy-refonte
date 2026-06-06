/** Tableau comparatif MDM Apple Enterprise — Phase 14 */

export type MdmComparisonRow = {
  vendor: string;
  strengths: string;
  limits: string;
  useCases: string;
  costPlaceholder: string;
  deployDifficulty: "Faible" | "Moyenne" | "Élevée";
  targetAudience: string;
};

export const MDM_COMPARISON_TABLE: MdmComparisonRow[] = [
  {
    vendor: "Jamf Pro",
    strengths: "Profondeur Apple, API mature, écosystème MSP/enterprise, Self Service, patch management",
    limits: "Coût licence élevé, courbe d'apprentissage, Apple-only",
    useCases: "Grandes orgs Apple-first, automation avancée, intégrations SIEM",
    costPlaceholder: "€€€ / device / mois (placeholder)",
    deployDifficulty: "Élevée",
    targetAudience: "Enterprise Apple-native, équipes MDM expérimentées",
  },
  {
    vendor: "Microsoft Intune",
    strengths: "Stack Microsoft, Conditional Access Entra ID, compliance unifiée multi-OS",
    limits: "UX Apple moins native, certaines fonctions macOS arrivent après Jamf/Kandji",
    useCases: "Organisations Microsoft-first gérant aussi Mac/iOS",
    costPlaceholder: "€€ / device / mois (placeholder)",
    deployDifficulty: "Moyenne",
    targetAudience: "IT Microsoft 365, Zero Trust Entra ID",
  },
  {
    vendor: "Kandji",
    strengths: "Blueprints, Liftoff, UX moderne, Apple-only focus, EDR intégré",
    limits: "Pas de gestion Android/Windows native, pricing premium",
    useCases: "Scale-ups Apple-native, onboarding zero-touch Mac",
    costPlaceholder: "€€€ / device / mois (placeholder)",
    deployDifficulty: "Moyenne",
    targetAudience: "PME/ETI tech, équipes lean IT Apple",
  },
  {
    vendor: "Mosyle",
    strengths: "Pricing compétitif, simplicité, éducation, Mosyle Auth/Fuse",
    limits: "Moins d'API avancées que Jamf, profondeur enterprise variable",
    useCases: "Éducation, PME, flottes iPad/Mac budget maîtrisé",
    costPlaceholder: "€ / device / mois (placeholder)",
    deployDifficulty: "Faible",
    targetAudience: "Écoles, PME, débutants MDM Apple",
  },
  {
    vendor: "Addigy",
    strengths: "Multi-tenant MSP, GoLive temps réel, Smart Software, visibilité live",
    limits: "Moins connu grand enterprise, dépendance modèle MSP",
    useCases: "MSP multi-clients, support Mac à distance, onboarding rapide",
    costPlaceholder: "€€ / device / mois (placeholder)",
    deployDifficulty: "Moyenne",
    targetAudience: "MSP, consultants Apple, IT externalisé",
  },
  {
    vendor: "Workspace ONE UEM",
    strengths: "Multi-OS VMware/Broadcom, UEM unifié, intégration stack VMware",
    limits: "Apple moins spécialisé, complexité plateforme UEM",
    useCases: "Entreprises multi-OS avec investissement VMware existant",
    costPlaceholder: "€€€ / device / mois (placeholder)",
    deployDifficulty: "Élevée",
    targetAudience: "Grand enterprise multi-plateforme, équipes UEM",
  },
];
