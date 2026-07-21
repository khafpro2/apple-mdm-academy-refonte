import type { MotionScene } from "@/lib/motion/types";

/**
 * Scène de référence FileVault — métadonnées structurées uniquement.
 * La documentation narrative Claude reste dans docs/motion-design/ (hors source de vérité runtime).
 *
 * Statut `brief-ready` : médias motion (mp4/webm/vtt/transcript) pas encore livrés.
 * Les assets SVG existants sous /video-assets/ sont référencés via le registre d'assets.
 */
export const filevaultScene: MotionScene = {
  id: "scene-filevault",
  slug: "filevault",
  title: "Sécuriser macOS avec FileVault",
  durationSeconds: 420,
  status: "brief-ready",
  version: "1.0.0",
  module: "FileVault",
  level: "Avancé",
  labSlug: "macos-security",
  quizSlug: "examen-apple-it-pro",
  courseIds: ["apple-it-professional", "apple-fundamentals"],
  objectives: [
    "Activer FileVault via MDM avec escrow des clés de récupération",
    "Vérifier l'état FileVault sur un Mac pilote",
    "Récupérer une clé d'escrow depuis la console MDM",
  ],
  narration: {
    primaryMessage:
      "FileVault chiffre le volume de démarrage ; sans escrow MDM, un Mac oublié devient irrécupérable.",
    voiceoverScript:
      "Un Mac portable perdu sans chiffrement disque expose toutes les données corporate. FileVault est la baseline sécurité macOS exigée par la plupart des frameworks.",
    locale: "fr-FR",
  },
  accessibility: {
    altText: "Schéma FileVault : MDM force le chiffrement et envoie la clé d'escrow à la console admin",
    longDescription:
      "Animation pédagogique montrant le flux MDM → FileVault → clé d'escrow → console administrateur.",
  },
  assetIds: [
    "asset-filevault-icon",
    "asset-filevault-diagram",
    "asset-filevault-thumbnail",
    "asset-filevault-illustration",
  ],
  media: {
    status: "planned",
    posterPath: "/video-assets/thumbnails/filevault.svg",
    mp4Path: "/media/motion/filevault/filevault.mp4",
    webmPath: "/media/motion/filevault/filevault.webm",
    vttPath: "/media/motion/filevault/filevault.fr-FR.vtt",
    transcriptPath: "/media/motion/filevault/filevault.fr-FR.transcript.md",
    durationSeconds: 420,
  },
  notes:
    "Scène de référence du pipeline motion. Médias dédiés sous /media/motion/filevault/ à produire ; assets SVG existants réutilisés depuis /video-assets/.",
};
