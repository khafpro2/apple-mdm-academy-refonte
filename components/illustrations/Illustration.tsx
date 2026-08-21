"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { IllustrationRegistryEntry } from "@/lib/motion/illustrations";
import { IllustrationProductionPlaceholder } from "@/components/video/placeholders/MediaPlaceholder";

/* eslint-disable @next/next/no-img-element -- formats dynamiques (SVG/PNG/WebP) hors pipeline next/image */

export type IllustrationProps = {
  /** Référence registre ou props directes */
  asset?: IllustrationRegistryEntry | null;
  src?: string;
  format?: IllustrationRegistryEntry["format"];
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
};

function resolveFormat(
  asset?: IllustrationRegistryEntry | null,
  format?: IllustrationRegistryEntry["format"],
  src?: string
): IllustrationRegistryEntry["format"] | undefined {
  if (format) return format;
  if (asset?.format) return asset.format;
  if (!src) return undefined;
  if (src.endsWith(".svg")) return "svg";
  if (src.endsWith(".webp")) return "webp";
  if (src.endsWith(".png")) return "png";
  if (src.endsWith(".json")) return "lottie";
  if (src.endsWith(".mp4")) return "mp4";
  if (src.endsWith(".webm")) return "webm";
  return undefined;
}

/** Affiche SVG, PNG, WebP, Lottie, MP4 ou WebM selon le format — sans modifier l'API */
export function Illustration({
  asset,
  src: srcProp,
  format: formatProp,
  alt: altProp,
  title,
  width,
  height,
  className = "",
  priority = false,
  lazy = true,
}: IllustrationProps) {
  const src = srcProp ?? asset?.src;
  const format = resolveFormat(asset, formatProp, src);
  const alt = altProp ?? asset?.alt ?? asset?.title ?? title ?? "Illustration pédagogique";

  const loadingProps = useMemo(
    () => ({
      loading: (lazy && !priority ? "lazy" : "eager") as "lazy" | "eager",
      decoding: "async" as const,
      fetchPriority: priority ? ("high" as const) : undefined,
    }),
    [lazy, priority]
  );

  if (!src || !format) {
    return <IllustrationProductionPlaceholder className={className} />;
  }

  const dimensions = {
    width: width ?? asset?.width,
    height: height ?? asset?.height,
  };

  switch (format) {
    case "svg":
      return (
        <img
          src={src}
          alt={alt}
          className={`max-w-full ${className}`}
          {...loadingProps}
          {...(dimensions.width ? { width: dimensions.width } : {})}
          {...(dimensions.height ? { height: dimensions.height } : {})}
        />
      );

    case "png":
    case "webp":
      return (
        <img
          src={src}
          alt={alt}
          className={`max-w-full rounded-xl ${className}`}
          {...loadingProps}
          {...(dimensions.width ? { width: dimensions.width } : {})}
          {...(dimensions.height ? { height: dimensions.height } : {})}
        />
      );

    case "lottie":
      return (
        <LottieIllustration
          src={src}
          alt={alt}
          loop={asset?.loop ?? true}
          autoplay={asset?.autoplay ?? true}
          className={className}
        />
      );

    case "mp4":
    case "webm":
      return (
        <video
          src={src}
          className={`max-w-full rounded-xl ${className}`}
          poster={asset?.posterUrl}
          loop={asset?.loop ?? true}
          autoPlay={asset?.autoplay ?? false}
          muted
          playsInline
          preload={lazy ? "metadata" : "auto"}
          aria-label={alt}
        />
      );

    default:
      return <IllustrationProductionPlaceholder className={className} />;
  }
}

/* eslint-enable @next/next/no-img-element */

/** Chargement différé Lottie — évite le bundle si absent */
const LottieIllustration = dynamic(
  () => import("@/components/illustrations/LottieIllustration").then((m) => m.LottieIllustration),
  {
    loading: () => (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-xl bg-surface"
        aria-busy="true"
        aria-label="Chargement de l'animation"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    ),
    ssr: false,
  }
);
