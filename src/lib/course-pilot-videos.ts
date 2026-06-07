import pilotManifest from "@/data/video-pilot-mp4.json";
import { getOfficialVideo } from "@/src/lib/video-production";
import { getVideoStoryboard } from "@/src/lib/video-storyboards";
import { getVideoAssets } from "@/src/lib/video-assets";

export type CoursePilotVideo = {
  slug: string;
  title: string;
  filename: string;
  courseSlug: string;
  labSlug: string;
  resourceSlug: string;
  quizSlug: string;
  duration: string;
  module: string;
  thumbnailPath?: string;
  relatedLessonSlug?: string;
  relatedLessonCourseSlug?: string;
};

const RELATED_LESSON: Record<string, string> = {
  "apple-business-manager": "abm-creation-roles",
  "abm-intune": "abm-intune",
  "ade-iphone": "ade-iphone",
  apns: "apns-certificats",
  "managed-apple-ids": "comptes-locaux-managed",
  "platform-sso": "platform-sso",
  "jamf-pro-fundamentals": "architecture-jamf",
  filevault: "profils-configuration",
};

const CROSS_COURSE_LESSON: Record<string, { courseSlug: string; lessonSlug: string }> = {
  "managed-apple-ids": { courseSlug: "intune-mac", lessonSlug: "managed-apple-ids" },
  filevault: { courseSlug: "intune-mac", lessonSlug: "macos-security" },
  "platform-sso": { courseSlug: "intune-mac", lessonSlug: "platform-sso" },
  "abm-intune": { courseSlug: "intune-mac", lessonSlug: "abm-intune" },
  "ade-iphone": { courseSlug: "intune-mac", lessonSlug: "ade-iphone" },
};

function buildPilotVideos(): CoursePilotVideo[] {
  return pilotManifest.videos.map((video) => {
    const official = getOfficialVideo(video.slug);
    const storyboard = getVideoStoryboard(video.slug);
    const assets = getVideoAssets(video.slug);
    const cross = CROSS_COURSE_LESSON[video.slug];
    const relatedLessonSlug = cross?.lessonSlug ?? RELATED_LESSON[video.slug];
    return {
      ...video,
      quizSlug: official?.quizSlug ?? storyboard?.quizSlug ?? "quiz-abm-certification",
      duration: storyboard?.duration ?? "10 min",
      module: storyboard?.module ?? official?.module ?? "",
      thumbnailPath: assets?.thumbnailPath,
      relatedLessonSlug,
      relatedLessonCourseSlug: cross?.courseSlug ?? video.courseSlug,
    };
  });
}

export const COURSE_PILOT_VIDEOS = buildPilotVideos();

export function getPilotVideosForCourse(courseSlug: string): CoursePilotVideo[] {
  return COURSE_PILOT_VIDEOS.filter((v) => v.courseSlug === courseSlug);
}

export function courseHasPilotVideos(courseSlug: string): boolean {
  return getPilotVideosForCourse(courseSlug).length > 0;
}

export function getPilotCourseSlugs(): string[] {
  return [...new Set(COURSE_PILOT_VIDEOS.map((v) => v.courseSlug))];
}

export function getPilotVideoBySlug(slug: string): CoursePilotVideo | undefined {
  return COURSE_PILOT_VIDEOS.find((v) => v.slug === slug);
}
