import type { ComponentType } from "react";
import { AbmIntuneLesson, AbmIntuneTableOfContents } from "@/components/course/lessons/abm-intune-lesson";
import { AdeIphoneLesson, AdeIphoneTableOfContents } from "@/components/course/lessons/ade-iphone-lesson";
import { AdeMacLesson, AdeMacTableOfContents } from "@/components/course/lessons/ade-mac-lesson";
import { ApnsLesson, ApnsTableOfContents } from "@/components/course/lessons/apns-lesson";
import { IosProfilesLesson, IosProfilesTableOfContents } from "@/components/course/lessons/ios-profiles-lesson";
import { MacosProfilesLesson, MacosProfilesTableOfContents } from "@/components/course/lessons/macos-profiles-lesson";
import { MacosSecurityLesson, MacosSecurityTableOfContents } from "@/components/course/lessons/macos-security-lesson";
import { VppAppsLesson, VppAppsTableOfContents } from "@/components/course/lessons/vpp-apps-lesson";
import {
  abmIntuneCertifications,
  isAbmIntuneLesson,
} from "@/lib/data/lessons/abm-intune-content";
import { isAdeIphoneLesson } from "@/lib/data/lessons/ade-iphone-content";
import { adeMacCertifications, isAdeMacLesson } from "@/lib/data/lessons/ade-mac-content";
import { apnsCertifications, isApnsLesson } from "@/lib/data/lessons/apns-content";
import { isIosProfilesLesson, iosProfilesCertifications } from "@/lib/data/lessons/ios-profiles-content";
import { isMacosProfilesLesson, macosProfilesCertifications } from "@/lib/data/lessons/macos-profiles-content";
import { isMacosSecurityLesson, macosSecurityCertifications } from "@/lib/data/lessons/macos-security-content";
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
  "ios-configuration-profiles": {
    meta: {
      subtitle:
        "Concevez et déployez des profils de configuration iOS/iPadOS : Wi-Fi, VPN, certificats, restrictions et sécurité via Intune ou Jamf Pro.",
      duration: "75 min",
      level: "Intermédiaire",
      points: 75,
      badges: [
        { label: "iOS", className: "bg-sky-600 text-white" },
        { label: "iPadOS", className: "bg-blue-600 text-white" },
        { label: "MDM", className: "bg-indigo-600 text-white" },
      ],
      certifications: iosProfilesCertifications,
    },
    Lesson: IosProfilesLesson,
    TableOfContents: IosProfilesTableOfContents,
  },
  "macos-configuration-profiles": {
    meta: {
      subtitle:
        "Maîtrisez les profils macOS : Wi-Fi, VPN, FileVault, PPPC, System Extensions et restrictions — déploiement sécurisé via Intune et Jamf Pro.",
      duration: "90 min",
      level: "Intermédiaire",
      points: 90,
      badges: [
        { label: "macOS", className: "bg-slate-800 text-white" },
        { label: "Jamf", className: "bg-violet-600 text-white" },
        { label: "Intune", className: "bg-indigo-600 text-white" },
      ],
      certifications: macosProfilesCertifications,
    },
    Lesson: MacosProfilesLesson,
    TableOfContents: MacosProfilesTableOfContents,
  },
  "macos-security": {
    meta: {
      subtitle:
        "Maîtrisez la sécurité macOS : FileVault, Gatekeeper, XProtect, SIP, Activation Lock et notarisation — déploiement et dépannage en entreprise.",
      duration: "120 min",
      level: "Intermédiaire → Avancé",
      points: 120,
      badges: [
        { label: "FileVault", className: "bg-purple-700 text-white" },
        { label: "Gatekeeper", className: "bg-blue-600 text-white" },
        { label: "SIP", className: "bg-orange-600 text-white" },
        { label: "XProtect", className: "bg-green-600 text-white" },
        { label: "Activation Lock", className: "bg-red-600 text-white" },
      ],
      certifications: macosSecurityCertifications,
    },
    Lesson: MacosSecurityLesson,
    TableOfContents: MacosSecurityTableOfContents,
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
    isIosProfilesLesson(courseSlug, lessonSlug) ||
    isMacosProfilesLesson(courseSlug, lessonSlug) ||
    isMacosSecurityLesson(courseSlug, lessonSlug) ||
    isAdeIphoneLesson(courseSlug, lessonSlug) ||
    isAdeMacLesson(courseSlug, lessonSlug)
  );
}
