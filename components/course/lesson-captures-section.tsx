import { ContentSection } from "@/components/course/course-ui";
import { LessonScreenshotsSection } from "@/components/course/screenshot-card";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";

export function LessonCapturesSection({ lessonSlug }: { lessonSlug: string }) {
  const screenshots = getScreenshotsForLesson(lessonSlug);
  if (screenshots.length === 0) return null;

  return (
    <ContentSection id="captures" title="Captures d'écran">
      <LessonScreenshotsSection screenshots={screenshots} />
    </ContentSection>
  );
}

export const CAPTURES_TOC_LINK = { href: "#captures", label: "Captures" } as const;
