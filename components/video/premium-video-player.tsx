"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { AcademyVideo } from "@/lib/types";
import { PedagogicalAnimation } from "@/components/video/pedagogical-animation";
import {
  loadVideoNotes,
  loadVideoProgress,
  saveLastContent,
  saveVideoNotes,
  saveVideoProgress,
  type VideoNote,
} from "@/lib/video/progress-storage";
import { Badge, ButtonLink } from "@/components/ui";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  video: AcademyVideo;
};

export function PremiumVideoPlayer({ video }: Props) {
  const savedProgress = useSyncExternalStore(
    () => () => {},
    () => loadVideoProgress(video.slug),
    () => null
  );
  const storedNotes = useSyncExternalStore(
    () => () => {},
    () => loadVideoNotes(video.slug),
    () => [] as VideoNote[]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1);
  const [localNotes, setLocalNotes] = useState<VideoNote[] | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showChapters, setShowChapters] = useState(true);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTime = playbackTime ?? savedProgress?.currentSeconds ?? 0;
  const notes = localNotes ?? storedNotes;

  const hasRealVideo = Boolean(video.playbackUrl || video.heygen.videoUrl);
  const playbackSrc = video.playbackUrl ?? video.heygen.videoUrl;

  useEffect(() => {
    saveLastContent({
      type: "video",
      slug: video.slug,
      title: video.title,
      href: `/videos/${video.slug}`,
      updatedAt: Date.now(),
    });
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = savedProgress.currentSeconds;
    }
  }, [video.slug, video.title, savedProgress]);

  const persistProgress = useCallback(
    (seconds: number, completed = false) => {
      saveVideoProgress({
        videoSlug: video.slug,
        currentSeconds: seconds,
        completed,
        updatedAt: Date.now(),
      });
    },
    [video.slug]
  );

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    stopSimulation();
    simIntervalRef.current = setInterval(() => {
      setPlaybackTime((t) => {
        const base = t ?? savedProgress?.currentSeconds ?? 0;
        const next = Math.min(base + speed, video.durationSeconds);
        persistProgress(next, next >= video.durationSeconds * 0.95);
        if (next >= video.durationSeconds) {
          stopSimulation();
          setPlaying(false);
        }
        return next;
      });
    }, 1000);
  }, [speed, video.durationSeconds, persistProgress, stopSimulation, savedProgress?.currentSeconds]);

  useEffect(() => () => stopSimulation(), [stopSimulation]);

  const togglePlay = () => {
    if (hasRealVideo && videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
      setPlaying(!playing);
      return;
    }
    if (playing) {
      stopSimulation();
      setPlaying(false);
    } else {
      setPlaying(true);
      startSimulation();
    }
  };

  const seek = (seconds: number) => {
    setPlaybackTime(seconds);
    if (videoRef.current) videoRef.current.currentTime = seconds;
    persistProgress(seconds);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void el.requestFullscreen();
    }
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const note: VideoNote = {
      id: crypto.randomUUID(),
      videoSlug: video.slug,
      timestampSeconds: currentTime,
      text: noteText.trim(),
      createdAt: Date.now(),
    };
    const updated = [...notes, note];
    setLocalNotes(updated);
    saveVideoNotes(video.slug, updated);
    setNoteText("");
  };

  const progressPercent = (currentTime / video.durationSeconds) * 100;
  const animProgress = currentTime / video.durationSeconds;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div ref={containerRef} className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl border border-border-light bg-black shadow-xl">
          {hasRealVideo ? (
            <video
              ref={videoRef}
              src={playbackSrc}
              className="aspect-video w-full"
              onTimeUpdate={(e) => {
                const t = e.currentTarget.currentTime;
                setPlaybackTime(t);
                persistProgress(t, t >= video.durationSeconds * 0.95);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : video.animationSlug ? (
            <div className="aspect-video bg-ink">
              <PedagogicalAnimation slug={video.animationSlug} playing={playing} progress={animProgress} />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-ink text-white/60">
              Vidéo HeyGen en préparation
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <input
              type="range"
              min={0}
              max={video.durationSeconds}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full accent-accent"
              aria-label="Progression"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink hover:bg-white/90"
              >
                {playing ? "Pause" : "Lecture"}
              </button>
              <span className="text-xs text-white/80">
                {formatTime(currentTime)} / {video.duration}
              </span>
              <select
                value={speed}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSpeed(v);
                  if (videoRef.current) videoRef.current.playbackRate = v;
                }}
                className="rounded-lg border-0 bg-white/20 px-2 py-1 text-xs text-white"
                aria-label="Vitesse de lecture"
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s} className="text-ink">
                    {s}x
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="ml-auto rounded-lg bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/30"
              >
                Plein écran
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border-light bg-surface-elevated p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">{video.title}</h1>
              <p className="mt-2 text-sm text-ink-secondary">{video.description}</p>
            </div>
            <Badge variant="accent">{video.moduleTitle}</Badge>
          </div>
          <div className="mt-4 h-2 rounded-full bg-border-light">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink-tertiary">Progression · {Math.round(progressPercent)}%</p>
        </div>

        {video.resources.length > 0 && (
          <section className="rounded-2xl border border-border-light bg-surface-elevated p-5">
            <h2 className="font-bold text-ink">Ressources téléchargeables</h2>
            <ul className="mt-4 space-y-3">
              {video.resources.map((r) => (
                <li key={r.slug} className="flex items-center justify-between gap-4 rounded-xl bg-surface p-3">
                  <div>
                    <p className="font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-ink-tertiary">
                      {r.type.toUpperCase()} · {r.description}
                      {r.fileSize ? ` · ${r.fileSize}` : ""}
                    </p>
                  </div>
                  <a
                    href={r.href}
                    download
                    className="shrink-0 rounded-full border border-border-light px-4 py-1.5 text-sm font-semibold text-accent hover:bg-accent/5"
                  >
                    Télécharger
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {video.quizSlug && progressPercent >= 80 && (
          <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <h2 className="font-bold text-ink">Quiz après la vidéo</h2>
            <p className="mt-2 text-sm text-ink-secondary">
              Validez vos acquis avec le quiz du module associé.
            </p>
            <ButtonLink href={`/quiz/${video.quizSlug}`} className="mt-4">
              Lancer le quiz →
            </ButtonLink>
          </section>
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border-light bg-surface-elevated p-4">
          <button
            type="button"
            onClick={() => setShowChapters(!showChapters)}
            className="flex w-full items-center justify-between font-bold text-ink"
          >
            Chapitres
            <span className="text-ink-tertiary">{showChapters ? "−" : "+"}</span>
          </button>
          {showChapters && (
            <ul className="mt-3 space-y-2">
              {video.chapters.map((ch) => (
                <li key={ch.id}>
                  <button
                    type="button"
                    onClick={() => seek(ch.startSeconds)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      currentTime >= ch.startSeconds ? "bg-accent/10 font-medium text-accent" : "text-ink-secondary hover:bg-surface"
                    }`}
                  >
                    {formatTime(ch.startSeconds)} · {ch.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border-light bg-surface-elevated p-4">
          <h3 className="font-bold text-ink">Notes personnelles</h3>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={`Note à ${formatTime(currentTime)}…`}
              className="flex-1 rounded-lg border border-border-light px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addNote()}
            />
            <button
              type="button"
              onClick={addNote}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
            >
              +
            </button>
          </div>
          <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {notes.length === 0 ? (
              <li className="text-xs text-ink-tertiary">Aucune note</li>
            ) : (
              notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-surface p-2 text-sm">
                  <button type="button" onClick={() => seek(n.timestampSeconds)} className="text-xs font-semibold text-accent">
                    {formatTime(n.timestampSeconds)}
                  </button>
                  <p className="mt-1 text-ink-secondary">{n.text}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-border-light bg-surface p-4 text-sm">
          <p className="font-semibold text-ink">HeyGen (préparation)</p>
          <dl className="mt-3 space-y-2 text-ink-secondary">
            <div><dt className="text-xs text-ink-tertiary">Statut</dt><dd className="capitalize">{video.heygen.status}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Langue</dt><dd>{video.heygen.language}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Avatar</dt><dd>{video.heygen.avatarId ?? "—"}</dd></div>
            <div><dt className="text-xs text-ink-tertiary">Voix</dt><dd>{video.heygen.voiceId ?? "—"}</dd></div>
          </dl>
        </div>

        <Link href={`/cours/${video.courseSlug}`} className="block text-sm font-semibold text-accent hover:underline">
          ← Retour au module
        </Link>
      </aside>
    </div>
  );
}
