import type { ComponentType } from "react";
import { AbmIntuneLesson, AbmIntuneTableOfContents } from "@/components/course/lessons/abm-intune-lesson";
import { AdeIphoneLesson, AdeIphoneTableOfContents } from "@/components/course/lessons/ade-iphone-lesson";
import { AdeMacLesson, AdeMacTableOfContents } from "@/components/course/lessons/ade-mac-lesson";
import { ApnsLesson, ApnsTableOfContents } from "@/components/course/lessons/apns-lesson";
import { VppAppsLesson, VppAppsTableOfContents } from "@/components/course/lessons/vpp-apps-lesson";
import {
  abmIntuneCertifications,
  isAbmIntuneLesson,
} from "@/lib/data/lessons/abm-intune-content";
import { isAdeIphoneLesson } from "@/lib/data/lessons/ade-iphone-content";
import { adeMacCertifications, isAdeMacLesson } from "@/lib/data/lessons/ade-mac-content";
import { apnsCertifications, isApnsLesson } from "@/lib/data/lessons/apns-content";
import { isVppAppsLesson, vppAppsCertifications } from "@/lib/data/lessons/vpp-apps-content";

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
  "apns-certificates": {
    meta: {
      subtitle:
        "Maîtrisez le cycle de vie du certificat APNs : création, renouvellement et dépannage pour garantir la communication MDM avec iPhone, iPad et Mac.",
      duration: "60 min",
      level: "Fondamental",
      points: 60,
      badges: [
        { label: "APNs", className: "bg-orange-600 text-white" },
        { label: "Apple", className: "bg-gray-900 text-white" },
        { label: "MDM", className: "bg-indigo-600 text-white" },
      ],
      certifications: apnsCertifications,
    },
    Lesson: ApnsLesson,
    TableOfContents: ApnsTableOfContents,
  },
  "vpp-apps-books": {
    meta: {
      subtitle:
        "Maîtrisez Apps & Books (VPP) : achat de licences en volume, synchronisation ABM avec Intune et déploiement automatique d'applications sur iPhone, iPad et Mac.",
      duration: "60 min",
      level: "Fondamental",
      points: 60,
      badges: [
        { label: "Apps & Books", className: "bg-blue-600 text-white" },
        { label: "ABM", className: "bg-gray-900 text-white" },
        { label: "Intune", className: "bg-indigo-600 text-white" },
      ],
      certifications: vppAppsCertifications,
    },
    Lesson: VppAppsLesson,
    TableOfContents: VppAppsTableOfContents,
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
    isApnsLesson(courseSlug, lessonSlug) ||
    isVppAppsLesson(courseSlug, lessonSlug) ||
    isAdeIphoneLesson(courseSlug, lessonSlug) ||
    isAdeMacLesson(courseSlug, lessonSlug)
  );
}
