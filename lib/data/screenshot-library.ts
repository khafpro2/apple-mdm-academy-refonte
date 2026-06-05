import type { LessonScreenshot, ScreenshotCategory } from "@/lib/types";
import {
  GLOBAL_SCREENSHOT_STYLE,
  SCREENSHOT_SPECS,
  buildScreenshotPrompt,
} from "@/lib/data/screenshot-style";
import {
  SCREENSHOT_PROMPTS,
  SCREENSHOT_PROMPTS_BY_ID,
  type ScreenshotPromptEntry,
} from "@/lib/data/screenshot-prompts";

export type ScreenshotLibraryEntry = ScreenshotPromptEntry;

export { GLOBAL_SCREENSHOT_STYLE, SCREENSHOT_SPECS, buildScreenshotPrompt };

/** Bibliothèque pédagogique — 90 captures · 1920×1080 · 16:9 · style Apple Training / Microsoft Learn */
export const SCREENSHOT_LIBRARY: ScreenshotLibraryEntry[] = SCREENSHOT_PROMPTS;

export const SCREENSHOT_LIBRARY_BY_ID = SCREENSHOT_PROMPTS_BY_ID;

export function screenshotSrc(entry: ScreenshotLibraryEntry): string {
  return `/images/courses/${entry.category}/${entry.filename}`;
}

export function toLessonScreenshot(entry: ScreenshotLibraryEntry): LessonScreenshot {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    src: screenshotSrc(entry),
    caption: entry.caption,
    scenePrompt: entry.scenePrompt,
    generationPrompt: entry.generationPrompt,
  };
}

export function getScreenshotsByIds(ids: string[]): LessonScreenshot[] {
  return ids
    .map((id) => SCREENSHOT_LIBRARY_BY_ID[id])
    .filter(Boolean)
    .map(toLessonScreenshot);
}

export function getScreenshotsByCategory(category: ScreenshotCategory): LessonScreenshot[] {
  return SCREENSHOT_LIBRARY.filter((e) => e.category === category).map(toLessonScreenshot);
}

export function getFullGenerationPrompt(id: string): string | undefined {
  return SCREENSHOT_LIBRARY_BY_ID[id]?.generationPrompt;
}

export type ScreenshotGenerationManifest = {
  globalStyle: string;
  specs: typeof SCREENSHOT_SPECS;
  screenshots: Array<{
    id: string;
    category: ScreenshotCategory;
    filename: string;
    title: string;
    src: string;
    scenePrompt: string;
    generationPrompt: string;
  }>;
};

export function getScreenshotGenerationManifest(): ScreenshotGenerationManifest {
  return {
    globalStyle: GLOBAL_SCREENSHOT_STYLE,
    specs: SCREENSHOT_SPECS,
    screenshots: SCREENSHOT_LIBRARY.map((entry) => ({
      id: entry.id,
      category: entry.category,
      filename: entry.filename,
      title: entry.title,
      src: screenshotSrc(entry),
      scenePrompt: entry.scenePrompt,
      generationPrompt: entry.generationPrompt,
    })),
  };
}

export const SCREENSHOT_LIBRARY_COUNT = SCREENSHOT_LIBRARY.length;
