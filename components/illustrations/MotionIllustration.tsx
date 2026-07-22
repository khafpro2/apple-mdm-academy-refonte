"use client";

import type { IllustrationRegistryEntry } from "@/lib/motion/illustrations";
import type { MotionAssetRegistryEntry } from "@/lib/motion/assets";
import { Illustration } from "@/components/illustrations/Illustration";
import { IllustrationProductionPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

export type MotionIllustrationProps = {
  illustration?: IllustrationRegistryEntry | null;
  motion?: MotionAssetRegistryEntry | null;
  className?: string;
  playing?: boolean;
};

/** Pont entre registres motion et composant Illustration */
export function MotionIllustration({
  illustration,
  motion,
  className = "",
}: MotionIllustrationProps) {
  if (illustration) {
    return <Illustration asset={illustration} className={className} />;
  }

  if (motion) {
    const format =
      motion.kind === "lottie"
        ? "lottie"
        : motion.kind === "video-loop"
          ? motion.src.endsWith(".webm")
            ? "webm"
            : "mp4"
          : "svg";

    return (
      <Illustration
        src={motion.src}
        format={format}
        alt={motion.title ?? motion.slug}
        title={motion.title}
        className={className}
        lazy={!motion.autoplay}
        priority={Boolean(motion.autoplay)}
      />
    );
  }

  return <IllustrationProductionPlaceholder className={className} />;
}
