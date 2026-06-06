"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { cleanHeyGenScript } from "@/src/lib/video-production-pack";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";
import { VideoStoryboardPanel } from "@/components/videos/VideoStoryboard";
import { Badge } from "@/components/ui";

type Props = {
  storyboard: VideoStoryboard;
  heygenScript: string;
  missingCaptureFiles: string[];
  onExportProductionPack: () => void;
  onExportStoryboard: () => void;
};

export function VideoPreparationMode({
  storyboard,
  heygenScript,
  missingCaptureFiles,
  onExportProductionPack,
  onExportStoryboard,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(true);
  const cleanScript = cleanHeyGenScript(heygenScript);
  const requiredCaptures = getScreenshotsForVideo(storyboard.slug);

  const copyScript = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [cleanScript]);

  const exportTxt = useCallback(() => {
    const blob = new Blob([cleanScript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${storyboard.slug}-heygen-script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cleanScript, storyboard.slug]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Mode préparation</Badge>
          <Badge variant="accent">MP4 en production</Badge>
        </div>
        <h2 className="mt-3 text-lg font-bold text-ink">Vidéo en cours de production</h2>
        <p className="mt-2 text-sm text-ink-secondary">
          Le fichier MP4 n&apos;est pas encore disponible. Utilisez le storyboard, le script HeyGen et les checklists
          ci-dessous pour produire la vidéo finale.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/video-pipeline/production-packs"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Production pack complet
          </Link>
          <Link
            href="/resources/heygen-screen-studio-workflow"
            className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Guide HeyGen + Screen Studio
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-ink">Script HeyGen</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyScript}
              className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium hover:bg-surface"
            >
              {copied ? "Copié ✓" : "Copier script HeyGen"}
            </button>
            <button
              type="button"
              onClick={exportTxt}
              className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-sm font-medium text-accent"
            >
              Exporter script .txt
            </button>
            <button
              type="button"
              onClick={onExportProductionPack}
              className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium hover:bg-surface"
            >
              Exporter pack Markdown
            </button>
            <button
              type="button"
              onClick={onExportStoryboard}
              className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium hover:bg-surface"
            >
              Storyboard .md
            </button>
          </div>
        </div>
        {showScript && (
          <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm leading-relaxed text-ink-secondary">
            {cleanScript}
          </pre>
        )}
        <button
          type="button"
          onClick={() => setShowScript(!showScript)}
          className="mt-2 text-xs font-semibold text-accent hover:underline"
        >
          {showScript ? "Masquer le script" : "Afficher le script"}
        </button>
      </section>

      <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
        <h3 className="font-bold text-ink">
          Captures nécessaires ({requiredCaptures.length - missingCaptureFiles.length}/{requiredCaptures.length} OK)
        </h3>
        {missingCaptureFiles.length === 0 ? (
          <p className="mt-2 text-sm text-green-700">Toutes les captures cataloguées sont présentes.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
            {requiredCaptures.map((shot) => {
              const ok = !missingCaptureFiles.includes(shot.file);
              return (
                <li key={shot.file} className="flex items-start gap-2">
                  <span className={ok ? "text-green-600" : "text-amber-600"}>{ok ? "✓" : "○"}</span>
                  <span>
                    <span className="font-mono text-xs">{shot.file}</span> — {shot.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <VideoStoryboardPanel storyboard={storyboard} activeSceneIndex={0} playing={false} />
    </div>
  );
}
