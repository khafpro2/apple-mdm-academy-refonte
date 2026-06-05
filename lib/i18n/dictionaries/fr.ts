export type Dictionary = {
  locale: "fr" | "en";
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  nav: {
    pricing: string;
    signup: string;
  };
};

export const fr: Dictionary = {
  locale: "fr",
  hero: {
    badge: "Formation Apple, Jamf & Intune",
    title: "Devenez expert Apple MDM.",
    subtitle: "La plateforme SaaS de référence pour préparer vos certifications Apple, Jamf et Intune — cours, labs, examens blancs et certificats.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Voir la démo",
  },
  nav: {
    pricing: "Tarifs",
    signup: "S'inscrire",
  },
};
