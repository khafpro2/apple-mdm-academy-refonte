import { siteConfig } from "@/lib/seo/site-config";

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Apple MDM Academy API",
    version: "1.0.0",
    description: "API publique REST pour intégrer progression, cours, labs, examens et certificats.",
    contact: { name: siteConfig.name, url: siteConfig.url },
  },
  servers: [{ url: `${siteConfig.url}/api/v1`, description: "Production" }],
  paths: {
    "/users": {
      get: {
        summary: "Liste des utilisateurs",
        tags: ["Users"],
        responses: { "200": { description: "Liste paginée d'utilisateurs (auth requise en production)" } },
      },
    },
    "/courses": {
      get: {
        summary: "Catalogue des cours",
        tags: ["Courses"],
        responses: { "200": { description: "Liste des cours par parcours" } },
      },
    },
    "/labs": {
      get: {
        summary: "Labs pratiques",
        tags: ["Labs"],
        responses: { "200": { description: "Liste des labs disponibles" } },
      },
    },
    "/exams": {
      get: {
        summary: "Examens blancs",
        tags: ["Exams"],
        responses: { "200": { description: "Liste des examens" } },
      },
    },
    "/certificates": {
      get: {
        summary: "Certificats",
        tags: ["Certificates"],
        responses: { "200": { description: "Certificats obtenus (auth requise)" } },
      },
    },
    "/progress": {
      get: {
        summary: "Progression utilisateur",
        tags: ["Progress"],
        responses: { "200": { description: "Progression par parcours (auth requise)" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
};
