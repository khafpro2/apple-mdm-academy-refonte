import type { MotionAsset } from "@/lib/motion/types";

/** Assets FileVault — chemins vers des fichiers déjà présents dans le dépôt (SVG). */
export const filevaultAssets: MotionAsset[] = [
  {
    id: "asset-filevault-icon",
    title: "Icône FileVault",
    category: "icon",
    status: "ready",
    format: "svg",
    path: "/video-assets/icons/filevault.svg",
    version: "1.0.0",
    sceneIds: ["scene-filevault"],
    accessibility: {
      altText: "Icône FileVault — cadenas de chiffrement disque macOS",
    },
  },
  {
    id: "asset-filevault-diagram",
    title: "Diagramme escrow FileVault",
    category: "diagram",
    status: "ready",
    format: "svg",
    path: "/video-assets/diagrams/filevault-key-escrow.svg",
    version: "1.0.0",
    sceneIds: ["scene-filevault"],
    accessibility: {
      altText: "Diagramme du flux de clé d'escrow FileVault vers le MDM",
    },
  },
  {
    id: "asset-filevault-thumbnail",
    title: "Vignette FileVault",
    category: "thumbnail",
    status: "ready",
    format: "svg",
    path: "/video-assets/thumbnails/filevault.svg",
    version: "1.0.0",
    sceneIds: ["scene-filevault"],
    accessibility: {
      altText: "Vignette de la scène motion FileVault",
    },
  },
  {
    id: "asset-filevault-illustration",
    title: "Illustration récupération FileVault",
    category: "illustration",
    status: "ready",
    format: "svg",
    path: "/illustrations/flows/filevault-recovery.svg",
    version: "1.0.0",
    sceneIds: ["scene-filevault"],
    accessibility: {
      altText: "Schéma FileVault avec clé utilisateur et clé de récupération institutionnelle",
    },
  },
];
