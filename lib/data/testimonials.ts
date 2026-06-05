export type TestimonialCategory = "learner" | "apple-admin" | "jamf-consultant" | "it-manager";

export type Testimonial = {
  id: string;
  category: TestimonialCategory;
  rating: number;
  comment: string;
  author: string;
  role: string;
  company: string;
};

/** Données fictives — remplaçables par avis clients réels */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    category: "learner",
    rating: 5,
    comment: "Les labs Jamf m'ont permis de passer ma certification Jamf 100 du premier coup. Progression claire et examens blancs très proches du réel.",
    author: "Sophie Martin",
    role: "Technicien support Mac",
    company: "NeoTech Solutions",
  },
  {
    id: "t2",
    category: "apple-admin",
    rating: 5,
    comment: "Enfin une formation ABM + ADE en français avec des captures réelles. Notre équipe a déployé 200 Mac en zero-touch en 3 semaines.",
    author: "Thomas Leroy",
    role: "Administrateur Apple",
    company: "Groupe Horizon",
  },
  {
    id: "t3",
    category: "jamf-consultant",
    rating: 5,
    comment: "Je recommande Apple MDM Academy à mes clients MSP. Le parcours Jamf 200 et les scénarios API sont au niveau des formations payantes US.",
    author: "Marc Dubois",
    role: "Consultant Jamf certifié",
    company: "MDM Partners",
  },
  {
    id: "t4",
    category: "it-manager",
    rating: 4,
    comment: "Le dashboard entreprise nous donne une visibilité immédiate sur la montée en compétences. Reporting RH exportable en CSV très apprécié.",
    author: "Claire Bernard",
    role: "Responsable IT",
    company: "InnovaCorp",
  },
  {
    id: "t5",
    category: "learner",
    rating: 5,
    comment: "Platform SSO et Intune Apple expliqués simplement. Les vidéos courtes et les quiz m'ont aidé à consolider avant l'examen blanc.",
    author: "Alexandre Petit",
    role: "Ingénieur systèmes",
    company: "CloudFirst",
  },
  {
    id: "t6",
    category: "it-manager",
    rating: 5,
    comment: "Nous avons formé 15 administrateurs Intune. Taux de réussite aux examens internes : 93 %. ROI visible en moins de 2 mois.",
    author: "Nadia El Amrani",
    role: "DSI adjointe",
    company: "EuroMedia",
  },
];

export const testimonialCategoryLabels: Record<TestimonialCategory, string> = {
  learner: "Apprenants",
  "apple-admin": "Administrateurs Apple",
  "jamf-consultant": "Consultants Jamf",
  "it-manager": "Responsables IT",
};
