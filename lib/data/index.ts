export { tracks, getTrack, getTrackBySlug, getVisibleTracks, isTrackVisible } from "@/lib/data/tracks";
export { V1_REMOVED_TRACK_SLUGS, isV1RemovedTrack } from "@/lib/data/v1-scope";
export { courses, getCourse, getCoursesByTrack, getLesson } from "@/lib/data/courses";
export { applePedagogyLevels, getApplePedagogyLevel } from "@/lib/data/apple-curriculum";
export { withCourseCompatibility, courseCompatibilityDefaults } from "@/lib/data/course-compatibility";
export { platformVersions, formatPlatformLabel, getPlatformVersion } from "@/lib/platform-versions";
export { compatibilityMatrix, getCompatibilityFeature } from "@/lib/compatibility/matrix";
export { illustrationRegistry, getIllustration, getIllustrationsForCourse } from "@/lib/assets/illustration-registry";
export { quizzes, getQuiz, getQuizzesByTrack, getExams, getQuizList, getExamPool } from "@/lib/data/quizzes";
export { labs, getLab, getLabsByTrack, getLabSlugs } from "@/lib/labs";
export { pricingPlans, badges, userProgress, certificates, leaderboard } from "@/lib/data/pricing";
export { proModules, getProModule, getProModuleBySlug } from "@/lib/data/pro-modules/index";
export { certificationPaths, getCertificationPath } from "@/lib/data/pro-modules/paths";
export { academyVideos, getVideo, getVideosByTrack, getPopularVideos, getVideoSlugs } from "@/lib/data/videos";
export {
  videoScripts,
  getVideoScript,
  getVideoScriptSlugs,
  getPopularVideoScripts,
  getLatestVideoScripts,
  getJamfVideoScripts,
  getJamfVideoScriptsByTrack,
  getFundamentalVideoScripts,
  HEYGEN_VIDEO_DEFAULTS,
  HEYGEN_JAMF_STYLE,
  toHeyGenPayload,
} from "@/src/lib/video-scripts";
export {
  academyResources,
  getResource,
  getResourceSlugs,
  getVisibleResources,
  getPopularResources,
  getResourcesByBadge,
  getResourcesByCourse,
  resourceToPlainText,
  getCategoryLabel,
  RESOURCE_CATEGORIES,
  RESOURCE_LEVELS,
  RESOURCE_BADGES,
} from "@/src/lib/resources";
