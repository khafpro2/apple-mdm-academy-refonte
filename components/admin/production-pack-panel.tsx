"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { VideoProductionPack } from "@/src/lib/video-production-pack";
import { exportProductionPackToMarkdown } from "@/src/lib/video-production-pack";
import { getProductionStatusLabel } from "@/src/lib/video-production";
import { Badge, ProgressBar } from "@/components/ui";
import {
  MANUAL_PRODUCTION_STEPS,
  loadManualProductionStatus,
  toggleManualStep,
  type ManualProductionStepId,
} from "@/lib/video/production-manual-status";

type Props = {
  pack: VideoProductionPack;
};

export function ProductionPackPanel({ pack }: Props) {
  const [copied, setCopied] = useState(false);
  const [manualStatus, setManualStatus] = useState(() => loadManualProductionStatus()[pack.slug] ?? {});

  const refreshManual = useCallback(() => {
    setManualStatus({ ...loadManualProductionStatus()[pack.slug] });
  }, [pack.slug]);

  const copyScript = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pack.heygenScriptClean);
      setCopied(true);
      toggleManualStep(pack.slug, "scriptExported", true);
      refreshManual();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [pack.heygenScriptClean, pack.slug, refreshManual]);

  const exportTxt = useCallback(() => {
    const blob = new Blob([pack.heygenScriptClean], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.slug}-heygen-script.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toggleManualStep(pack.slug, "scriptExported", true);
    refreshManual();
  }, [pack.heygenScriptClean, pack.slug, refreshManual]);

  const exportMarkdown = useCallback(() => {
    const md = exportProductionPackToMarkdown(pack);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.slug}-production-pack.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [pack]);

  const handleManualToggle = (stepId: ManualProductionStepId) => {
    toggleManualStep(pack.slug, stepId, !manualStatus[stepId]);
    refreshManual();
  };

  return (
    <article id={pack.slug} className="scroll-mt-24 rounded-2xl border border-border-light bg-surface-elevated p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-tertiary">
            Priorité {pack.record.priority} · {pack.module}
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink">{pack.title}</h2>
          <p className="mt-2 text-sm text-ink-secondary">{pack.objective}</p>
        </div>
        <div className="text-right">
          <Badge variant={pack.record.status === "published" ? "accent" : "default"}>
            {getProductionStatusLabel(pack.record.status)}
          </Badge>
          <p className="mt-2 text-2xl font-bold text-accent">{pack.record.pipelinePercent}%</p>
        </div>
      </div>

      <ProgressBar value={pack.record.pipelinePercent} className="mt-4" />

      <div className="mt-4 rounded-xl bg-surface p-4 text-sm">
        <p className="font-semibold text-ink">Fichier MP4 final</p>
        <code className="mt-1 block text-accent">/public/videos/{pack.mp4Filename}</code>
        <p className="mt-1 text-xs text-ink-tertiary">URL LMS : {pack.mp4Path}</p>
      </div>

      {!pack.record.canPublish && pack.record.publishBlockers.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-semibold">Publication impossible — éléments manquants</p>
          <ul className="mt-2 list-disc pl-5">
            {pack.record.publishBlockers.map((b) => (
              <li key={b.id}>{b.label}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="mt-6">
        <h3 className="font-bold text-ink">Checklist production manuelle</h3>
        <ul className="mt-3 space-y-2">
          {MANUAL_PRODUCTION_STEPS.map((step) => (
            <li key={step.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(manualStatus[step.id])}
                onChange={() => handleManualToggle(step.id)}
                className="h-4 w-4 rounded border-border-light accent-accent"
              />
              <span className={manualStatus[step.id] ? "text-ink line-through opacity-70" : "text-ink-secondary"}>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
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
              className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
            >
              Exporter script .txt
            </button>
            <button
              type="button"
              onClick={exportMarkdown}
              className="rounded-lg border border-border-light px-3 py-1.5 text-sm font-medium hover:bg-surface"
            >
              Exporter pack Markdown
            </button>
          </div>
        </div>
        <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-surface p-4 text-sm leading-relaxed text-ink-secondary">
          {pack.heygenScriptClean}
        </pre>
      </section>

      <section className="mt-6">
        <h3 className="font-bold text-ink">Scènes ({pack.scenes.length})</h3>
        <div className="mt-3 space-y-3">
          {pack.scenes.map((scene, i) => (
            <div key={scene.id} className="rounded-xl border border-border-light bg-surface p-4 text-sm">
              <p className="font-semibold text-ink">
                Scène {i + 1} — {scene.title}{" "}
                <span className="font-normal text-ink-tertiary">({scene.durationSeconds}s)</span>
              </p>
              <p className="mt-2 text-ink-secondary">{scene.narration}</p>
              <p className="mt-2 text-xs text-ink-tertiary">Visuel : {scene.visual}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-bold text-ink">Checklist Screen Studio</h3>
        <p className="mt-1 text-sm text-ink-tertiary">
          Durée cible : {pack.screenStudio.targetDuration} · Transitions :{" "}
          {pack.screenStudio.recommendedTransitions.join(" · ")}
        </p>
        <p className="mt-1 text-xs text-ink-tertiary">
          Flouter : {pack.screenStudio.generalBlur.join(" · ")}
        </p>
        <div className="mt-3 space-y-3">
          {pack.screenStudio.captures.map((cap) => (
            <div
              key={cap.file}
              className={`rounded-xl border p-4 text-sm ${cap.present ? "border-green-200 bg-green-50" : "border-border-light bg-surface"}`}
            >
              <p className="font-semibold text-ink">
                {cap.order}. {cap.label} {cap.present ? "✓" : "—"}
              </p>
              <p className="mt-1 font-mono text-xs text-ink-tertiary">{cap.publicPath}</p>
              <p className="mt-2 text-xs text-ink-secondary">Zoom : {cap.zoomAreas.join(" · ")}</p>
              <p className="text-xs text-ink-secondary">Flouter : {cap.blurAreas.join(" · ")}</p>
              <p className="text-xs text-ink-secondary">Transition : {cap.transition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-bold text-ink">Assets utilisés ({pack.assets.length})</h3>
        <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto font-mono text-xs text-ink-secondary">
          {pack.assets.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-bold text-ink">Checklist CapCut</h3>
        <ul className="mt-3 space-y-2">
          {pack.capCutChecklist.map((item) => (
            <li key={item.label} className="rounded-xl bg-surface p-3 text-sm">
              <span className="font-semibold text-ink">{item.label}</span>
              <span className="text-ink-secondary"> — {item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-bold text-ink">Checklist montage</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-secondary">
          {pack.montageChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href={`/videos/${pack.slug}`} className="font-semibold text-accent hover:underline">
          Page vidéo →
        </Link>
        {pack.record.resourceSlug && (
          <Link href={`/resources/${pack.record.resourceSlug}`} className="font-semibold text-accent hover:underline">
            Ressource →
          </Link>
        )}
      </div>
    </article>
  );
}
