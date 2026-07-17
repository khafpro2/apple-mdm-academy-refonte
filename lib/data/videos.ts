import type { AcademyVideo, AnimationSlug, HeyGenConfig } from "@/lib/types";
import { getHeyGenVideoResult } from "@/lib/data/heygen-video-results";
import {
  videoScripts,
  HEYGEN_VIDEO_DEFAULTS,
  getVideoScript,
  getVideoScriptSlugs,
  getPopularVideoScripts,
  type VideoScript,
} from "@/src/lib/video-scripts";

const ANIMATION_BY_SLUG: Partial<Record<string, AnimationSlug>> = {
  "abm-intune": "abm-intune",
  "automated-device-enrollment": "ade-enrollment",
  apns: "apns-push",
  "apps-books": "apps-books",
  "platform-sso": "platform-sso",
  "jamf-pro-fundamentals": "jamf-policies",
  "macos-security": "filevault",
  "jamf-policies": "jamf-policies",
  "jamf-smart-groups": "jamf-policies",
  "jamf-packages": "jamf-policies",
  "jamf-scripts": "jamf-policies",
  "jamf-patch-management": "jamf-policies",
  "jamf-scope": "jamf-policies",
  "jamf-self-service": "jamf-policies",
  "jamf-enrollment": "ade-enrollment",
  "jamf-prestage": "ade-enrollment",
};

const TRACK_BY_COURSE: Record<string, string> = {
  "apple-fundamentals": "apple-fundamentals",
  "apple-it-professional": "apple-it-professional",
  "intune-mac": "intune-mac",
  "jamf-100": "jamf-100",
  "jamf-170": "jamf-170",
  "jamf-200": "jamf-200",
  "jamf-300": "jamf-300",
  "jamf-400": "jamf-400",
  "apple-enterprise-expert": "apple-enterprise-expert",
  "apple-enterprise-architect": "apple-enterprise-architect",
  "intune-apple-advanced": "intune-apple-advanced",
  "mdm-comparatif-apple": "mdm-comparatif-apple",
  "parcours-professionnel": "parcours-professionnel",
};

function chaptersFromScript(script: string): AcademyVideo["chapters"] {
  const markers: { marker: string; title: string }[] = [
    { marker: "Objectifs pédagogiques", title: "Objectifs" },
    { marker: "Scénario entreprise", title: "Scénario entreprise" },
    { marker: "Points clés", title: "Points clés" },
    { marker: "Exercice pratique", title: "Lab pratique" },
    { marker: "Résumé", title: "Résumé" },
  ];
  return markers
    .filter((m) => script.includes(m.marker))
    .map((m, i) => ({ id: `ch-${i + 1}`, title: m.title, startSeconds: i * 120 }));
}

function heygenFromScript(v: VideoScript): HeyGenConfig {
  const generated = getHeyGenVideoResult(v.slug);

  return {
    script: v.script,
    language: v.language,
    avatarId: v.heygenAvatar,
    voiceId: HEYGEN_VIDEO_DEFAULTS.voice,
    durationEstimate: v.duration,
    status: generated?.status ?? "draft",
    videoUrl: generated?.videoUrl,
    sessionUrl: generated?.sessionUrl,
  };
}

function toAcademyVideo(v: VideoScript): AcademyVideo {
  return {
    slug: v.slug,
    title: v.title,
    description: v.description ?? v.script.split("\n")[0] ?? "",
    duration: v.duration,
    durationSeconds: v.durationSeconds,
    moduleSlug: v.slug,
    moduleTitle: v.module,
    courseSlug: v.relatedCourseSlug,
    trackSlug: TRACK_BY_COURSE[v.relatedCourseSlug] ?? v.relatedCourseSlug,
    animationSlug: ANIMATION_BY_SLUG[v.slug],
    popular: v.popular,
    tags: [v.module, v.level],
    heygen: heygenFromScript(v),
    chapters: chaptersFromScript(v.script),
    resources: [],
    relatedLabSlug: v.relatedLabSlug,
    level: v.level,
  };
}

export const academyVideos: AcademyVideo[] = videoScripts.map(toAcademyVideo);

export function getVideo(slug: string): AcademyVideo | undefined {
  const script = getVideoScript(slug);
  return script ? toAcademyVideo(script) : undefined;
}

export function getVideosByTrack(trackSlug: string): AcademyVideo[] {
  return academyVideos.filter((v) => v.trackSlug === trackSlug);
}

export function getPopularVideos(): AcademyVideo[] {
  return getPopularVideoScripts().map(toAcademyVideo);
}

export function getVideoSlugs(): string[] {
  return getVideoScriptSlugs();
}

export { videoScripts, getVideoScript, getVideoScriptSlugs, getPopularVideoScripts, getLatestVideoScripts } from "@/src/lib/video-scripts";
