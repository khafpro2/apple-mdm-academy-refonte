import type { ComponentType } from "react";
import { AbmIntuneLesson, AbmIntuneTableOfContents } from "@/components/course/lessons/abm-intune-lesson";
import { AdeIphoneLesson, AdeIphoneTableOfContents } from "@/components/course/lessons/ade-iphone-lesson";
import { AdeMacLesson, AdeMacTableOfContents } from "@/components/course/lessons/ade-mac-lesson";
import {
  abmIntuneCertifications,
  isAbmIntuneLesson,
} from "@/lib/data/lessons/abm-intune-content";
import { isAdeIphoneLesson } from "@/lib/data/lessons/ade-iphone-content";
import { adeMacCertifications, isAdeMacLesson } from "@/lib/data/lessons/ade-mac-content";

export type CustomLessonMeta = {
  subtitle?: string;
  duration: string;
  level: string;
  points: number;
  badges?: { label: string; className: string }[];
  certifications?: string[];
};

export type CustomLessonConfig = {
  meta: CustomLessonMeta;
  Lesson: ComponentType;
  TableOfContents: ComponentType<{ mobile?: boolean }>;
};

const CUSTOM_LESSONS: Record<string, CustomLessonConfig> = {
  "abm-intune": {
    meta: {
      subtitle:
        "Connectez Apple Business Manager à Microsoft Intune pour activer l'enrôlement automatique (ADE) et déployer iPhone, iPad et Mac en mode supervisé.",
      duration: "40 min",
      level: "Intermédiaire",
      points: 40,
      badges: [
        { label: "Apple Business Manager", className: "bg-gray-900 text-white" },
        { label: "Microsoft Intune", className: "bg-indigo-600 text-white" },
      ],
      certifications: abmIntuneCertifications,
    },
    Lesson: AbmIntuneLesson,
    TableOfContents: AbmIntuneTableOfContents,
  },
  "ade-iphone": {
    meta: {
      subtitle:
        "Formez-vous au déploiement zéro-touch des iPhone via Automated Device Enrollment : profil ADE, mode supervisé et validation en conditions réelles.",
      duration: "45 min",
      level: "Intermédiaire",
      points: 45,
      badges: [
        { label: "ADE", className: "bg-sky-600 text-white" },
        { label: "Microsoft Intune", className: "bg-indigo-600 text-white" },
      ],
    },
    Lesson: AdeIphoneLesson,
    TableOfContents: AdeIphoneTableOfContents,
  },
  "ade-mac": {
    meta: {
      subtitle:
        "Déployez des Mac en Zero Touch via Apple Business Manager et Intune : profil ADE macOS, mode supervisé et configuration automatique dès la sortie du carton.",
      duration: "50 min",
      level: "Intermédiaire",
      points: 50,
      badges: [
        { label: "macOS", className: "bg-slate-800 text-white" },
        { label: "Apple Business Manager", className: "bg-gray-900 text-white" },
        { label: "Microsoft Intune", className: "bg-indigo-600 text-white" },
      ],
      certifications: adeMacCertifications,
    },
    Lesson: AdeMacLesson,
    TableOfContents: AdeMacTableOfContents,
  },
};

export function getCustomLesson(
  courseSlug: string,
  lessonSlug: string
): CustomLessonConfig | null {
  if (courseSlug !== "intune-mac") return null;
  return CUSTOM_LESSONS[lessonSlug] ?? null;
}

export function isCustomIntuneLesson(courseSlug: string, lessonSlug: string): boolean {
  return (
    isAbmIntuneLesson(courseSlug, lessonSlug) ||
    isAdeIphoneLesson(courseSlug, lessonSlug) ||
    isAdeMacLesson(courseSlug, lessonSlug)
  );
}
