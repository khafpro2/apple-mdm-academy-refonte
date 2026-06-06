"use client";

import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { exportStoryboardToMarkdown } from "@/src/lib/video-lessons";
import { getVideoPublishLabel } from "@/src/lib/video-publish-status";
import { exportVideoProductionPack, getVideoAssets, getDiagramForVideo, resolveAssetPaths } from "@/src/lib/video-assets";
import type { VideoScript } from "@/src/lib/video-scripts";
import { HEYGEN_VIDEO_DEFAULTS } from "@/src/lib/video-scripts";
import { VideoStoryboardPanel } from "@/components/videos/VideoStoryboard";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";
import { VideoDiagram } from "@/components/videos/VideoDiagram";
import { OfficialVideoPlayer } from "@/components/videos/OfficialVideoPlayer";
import { PedagogicalAnimation } from "@/components/video/pedagogical-animation";
import { Badge, ButtonLink } from "@/components/ui";
import type { AnimationSlug } from "@/lib/types";
import type { VideoTranscript } from "@/src/lib/video-transcripts";
import type { VideoCourseNotes } from "@/src/lib/video-production";
import { getCertificationHref } from "@/src/lib/video-production";
import { downloadVideoNotesPdf } from "@/lib/video/export-notes-pdf";
import { VideoPreparationMode } from "@/components/videos/VideoPreparationMode";
import { cleanHeyGenScript } from "@/src/lib/video-production-pack";
import {
  loadVideoProgress,
  saveLastContent,
  saveVideoProgress,
  subscribeVideoProgress,
} from "@/lib/video/progress-storage";

const ANIMATION_BY_SLUG: Partial<Record<string, AnimationSlug>> = {
  "abm-intune": "abm-intune",
  "ade-iphone": "ade-enrollment",
  "ade-mac": "ade-enrollment",
  "gatekeeper-xprotect-sip": "filevault",
  apns: "apns-push",
  "apps-books": "apps-books",
  "platform-sso": "platform-sso",
  "jamf-pro-fundamentals": "jamf-policies",
  "macos-security": "filevault",
  filevault: "filevault",
  "jamf-policies": "jamf-policies",
  "jamf-smart-groups": "jamf-policies",
  "jamf-scripts": "jamf-policies",
  "jamf-patch-management": "jamf-policies",
  "jamf-protect": "jamf-policies",
  "apple-business-manager": "abm-intune",
};

type Props = {
  storyboard: VideoStoryboard;
  script?: VideoScript;
  mp4Url?: string;
  transcript?: VideoTranscript;
  courseNotes?: VideoCourseNotes;
  certificationLabel?: string;
  certificationSlug?: string;
  missingCaptureFiles?: string[];
};

export function AnimatedLesson({
  storyboard,
  script,
  mp4Url,
  transcript,
  courseNotes,
  certificationLabel,
  certificationSlug,
  missingCaptureFiles = [],
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);
  const [showScript, setShowScript] = useState(true);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const durationSeconds = script?.durationSeconds ?? storyboard.durationSeconds;
  const heygenScript = script?.script ?? storyboard.narration;

  const savedProgress = useSyncExternalStore(
    subscribeVideoProgress,
    () => loadVideoProgress(storyboard.slug),
    () => null
  );

  const sceneDuration = durationSeconds / storyboard.scenes.length;
  const activeSceneIndex = Math.min(
    storyboard.scenes.length - 1,
    Math.floor(simTime / Math.max(sceneDuration, 1))
  );
  const progressPercent = savedProgress
    ? Math.round((savedProgress.currentSeconds / durationSeconds) * 100)
    : Math.round((simTime / durationSeconds) * 100);

  const animationSlug = ANIMATION_BY_SLUG[storyboard.slug];
  const animProgress = playing ? simTime / durationSeconds : progressPercent / 100;

  const handlePlay = useCallback(() => {
    saveLastContent({
      type: "video",
      slug: storyboard.slug,
      title: storyboard.title,
      href: `/videos/${storyboard.slug}`,
      updatedAt: Date.now(),
    });
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    let elapsed = savedProgress?.currentSeconds ?? simTime;
    intervalRef.current = setInterval(() => {
      elapsed += 1;
      setSimTime(elapsed);
      saveVideoProgress({
        videoSlug: storyboard.slug,
        currentSeconds: elapsed,
        completed: elapsed >= durationSeconds * 0.95,
        updatedAt: Date.now(),
      });
      if (elapsed >= durationSeconds && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setPlaying(false);
      }
    }, 1000);
  }, [durationSeconds, playing, savedProgress, simTime, storyboard.slug, storyboard.title]);

  const copyScript = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanHeyGenScript(heygenScript));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [heygenScript]);

  const exportMarkdown = useCallback(() => {
    const md = exportStoryboardToMarkdown(storyboard);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${storyboard.slug}-storyboard.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [storyboard]);

  const exportProductionPack = useCallback(() => {
    const md = exportVideoProductionPack(storyboard);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${storyboard.slug}-production-pack.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [storyboard]);

  const assetPack = getVideoAssets(storyboard.slug);
  const diagram = getDiagramForVideo(storyboard.slug);
  const assetPaths = assetPack ? resolveAssetPaths(assetPack) : [];
  const hasOfficialMp4 = Boolean(mp4Url);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {assetPack && (
          <VideoThumbnail
            title={storyboard.title}
            module={storyboard.module}
            icon={assetPack.icon}
            background={assetPack.background}
            level={storyboard.level}
            thumbnailPath={assetPack.thumbnailPath}
          />
        )}

        {hasOfficialMp4 && mp4Url ? (
          <OfficialVideoPlayer
            slug={storyboard.slug}
            title={storyboard.title}
            mp4Url={mp4Url}
            poster={assetPack?.thumbnailPath}
            durationSeconds={durationSeconds}
            durationLabel={storyboard.duration}
            courseSlug={storyboard.courseSlug}
            transcript={transcript}
          />
        ) : (
          <VideoPreparationMode
            storyboard={storyboard}
            heygenScript={heygenScript}
            missingCaptureFiles={missingCaptureFiles}
            onExportProductionPack={exportProductionPack}
            onExportStoryboard={exportMarkdown}
          />
        )}

        {!hasOfficialMp4 && (
          <div className="overflow-hidden rounded-2xl border border-dashed border-border-light bg-surface p-4 text-center text-sm text-ink-tertiary">
            Aperçu storyboard animé — lecture simulée
          </div>
        )}

        {!hasOfficialMp4 && (
          <>
            <div className="overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl">
              {animationSlug ? (
                <PedagogicalAnimation slug={animationSlug} playing={playing} progress={animProgress} />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-8 text-ink">
                  <div className="flex flex-wrap justify-center gap-4">
                    {["abm", "intune", "jamf", "apple-device"].map((icon) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={icon} src={`/illustrations/${icon}.svg`} alt="" width={40} height={40} className="opacity-80" />
                    ))}
                  </div>
                  <p className="mt-6 text-center text-sm font-semibold text-ink-secondary">
                    {storyboard.scenes[activeSceneIndex]?.title ?? storyboard.title}
                  </p>
                  <p className="mt-2 max-w-lg text-center text-xs text-ink-tertiary">
                    Vidéo illustrée · narration HeyGen · {HEYGEN_VIDEO_DEFAULTS.format}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4 border-t border-border-light bg-surface-elevated px-5 py-4">
                <button
                  type="button"
                  onClick={handlePlay}
                  className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  {playing ? "Pause" : "Lecture storyboard"}
                </button>
                <span className="text-sm text-ink-secondary">{storyboard.duration}</span>
                <span className="text-sm text-ink-tertiary">
                  Scène {activeSceneIndex + 1}/{storyboard.scenes.length}
                </span>
                {progressPercent > 0 && (
                  <span className="ml-auto text-sm font-medium text-accent">{progressPercent}%</span>
                )}
              </div>
            </div>
          </>
        )}

        <header className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{storyboard.module}</Badge>
            <Badge variant="accent">{storyboard.level}</Badge>
            <Badge>{getVideoPublishLabel(storyboard.status)}</Badge>
            <Badge>{storyboard.visualType}</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink">{storyboard.title}</h1>
          <p className="mt-2 text-sm text-ink-secondary">{storyboard.objective}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/cours/${storyboard.courseSlug}`}>Voir le cours</ButtonLink>
            <ButtonLink href={`/labs/${storyboard.labSlug}`} variant="secondary">
              Faire le lab
            </ButtonLink>
            <ButtonLink href={`/quiz/${storyboard.quizSlug}`} variant="secondary">
              Passer le quiz
            </ButtonLink>
            {certificationSlug && certificationLabel && (
              <ButtonLink href={getCertificationHref(certificationSlug)} variant="secondary">
                {certificationLabel}
              </ButtonLink>
            )}
            {courseNotes && (
              <button
                type="button"
                onClick={() => downloadVideoNotesPdf(courseNotes)}
                className="inline-flex items-center rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
              >
                Télécharger notes PDF
              </button>
            )}
          </div>
        </header>

        {diagram && (
          <VideoDiagram
            nodes={diagram.nodes}
            connections={diagram.connections}
            activeNode={activeSceneIndex}
            title={diagram.title}
            description={diagram.description}
            diagramPath={diagram.path}
          />
        )}

        <VideoStoryboardPanel
          storyboard={storyboard}
          activeSceneIndex={activeSceneIndex}
          playing={playing}
        />

        <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowScript(!showScript)}
              className="font-bold text-ink"
            >
              Script HeyGen {showScript ? "−" : "+"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyScript}
                className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
              >
                {copied ? "Copié ✓" : "Copier script HeyGen"}
              </button>
              <button
                type="button"
                onClick={exportMarkdown}
                className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-surface"
              >
                Télécharger storyboard
              </button>
              <button
                type="button"
                onClick={exportProductionPack}
                className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
              >
                Pack production
              </button>
            </div>
          </div>
          {showScript && (
            <div className="mt-4 rounded-xl bg-surface p-5">
              {heygenScript.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-3 text-sm leading-relaxed text-ink-secondary last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h2 className="font-bold text-ink">Informations</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-ink-tertiary">Statut montage</dt>
              <dd className="font-medium text-ink">{getVideoPublishLabel(storyboard.status)}</dd>
            </div>
            {storyboard.videoUrl && (
              <div>
                <dt className="text-xs text-ink-tertiary">Fichier vidéo</dt>
                <dd className="font-mono text-xs text-accent">{storyboard.videoUrl}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-ink-tertiary">Module</dt>
              <dd className="font-medium text-ink">{storyboard.module}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Durée</dt>
              <dd className="font-medium text-ink">{storyboard.duration}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Scènes</dt>
              <dd className="font-medium text-ink">{storyboard.scenes.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Niveau</dt>
              <dd className="font-medium text-ink">{storyboard.level}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Quiz associé</dt>
              <dd>
                <Link href={`/quiz/${storyboard.quizSlug}`} className="font-medium text-accent hover:underline">
                  {storyboard.quizSlug}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Cours associé</dt>
              <dd>
                <Link href={`/cours/${storyboard.courseSlug}`} className="font-medium text-accent hover:underline">
                  {storyboard.courseSlug}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-tertiary">Lab associé</dt>
              <dd>
                <Link href={`/labs/${storyboard.labSlug}`} className="font-medium text-accent hover:underline">
                  {storyboard.labSlug}
                </Link>
              </dd>
            </div>
            {certificationSlug && (
              <div>
                <dt className="text-xs text-ink-tertiary">Certification</dt>
                <dd>
                  <Link href={getCertificationHref(certificationSlug)} className="font-medium text-accent hover:underline">
                    {certificationLabel ?? certificationSlug}
                  </Link>
                </dd>
              </div>
            )}
            {transcript && (
              <div>
                <dt className="text-xs text-ink-tertiary">Transcript</dt>
                <dd>
                  <Link href={`/transcripts#${storyboard.slug}`} className="font-medium text-accent hover:underline">
                    {transcript.wordCount} mots
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h2 className="font-bold text-ink">Assets utilisés</h2>
          <p className="mt-1 text-xs text-ink-tertiary">{assetPaths.length} fichiers · HeyGen · Canva · CapCut</p>
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-xs text-ink-secondary">
            {assetPaths.map((path) => (
              <li key={path} className="truncate border-b border-border-light py-1 font-mono last:border-0">{path}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <h2 className="font-bold text-ink">Captures production</h2>
          <p className="mt-1 text-xs text-ink-tertiary">{storyboard.allScreenshots.length} écrans à enregistrer</p>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs text-ink-secondary">
            {storyboard.allScreenshots.map((shot) => (
              <li key={shot} className="border-b border-border-light py-1 last:border-0">{shot}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-border-light bg-surface p-5 text-sm">
          <p className="font-semibold text-ink">Prêt pour HeyGen</p>
          <dl className="mt-3 space-y-2 text-ink-secondary">
            <div><dt className="text-xs text-ink-tertiary">Avatar</dt><dd>{storyboard.heygen.avatar}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Voix</dt><dd>{storyboard.heygen.voice}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Langue</dt><dd>{storyboard.heygen.language}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Format</dt><dd>{storyboard.heygen.format}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Style</dt><dd>{storyboard.heygen.style}</dd></div>
          </dl>
        </div>

        <Link href="/resources/guide-captures-video" className="block text-sm font-semibold text-accent hover:underline">
          Guide captures vidéo →
        </Link>
        <Link href="/resources/video-production-guide" className="block text-sm font-semibold text-accent hover:underline">
          Guide production vidéo →
        </Link>
        <Link href="/videos" className="block text-sm font-semibold text-accent hover:underline">
          ← Toutes les vidéos
        </Link>
      </aside>
    </div>
  );
}
