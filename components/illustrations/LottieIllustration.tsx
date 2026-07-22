"use client";

/**
 * Lecteur Lottie minimal — sans dépendance externe tant qu'aucun asset n'est publié.
 * Affiche un conteneur prêt à recevoir lottie-web ou @lottiefiles/react-lottie-player.
 */

type LottieIllustrationProps = {
  src: string;
  alt: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
};

export function LottieIllustration({
  src,
  alt,
  loop = true,
  autoplay = true,
  className = "",
}: LottieIllustrationProps) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-surface ${className}`}
      role="img"
      aria-label={alt}
      data-lottie-src={src}
      data-lottie-loop={loop ? "true" : "false"}
      data-lottie-autoplay={autoplay ? "true" : "false"}
    >
      <div className="flex h-full items-center justify-center text-sm text-ink-tertiary">
        Animation Lottie · {src.split("/").pop()}
      </div>
    </div>
  );
}
