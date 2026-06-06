"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Badge, ProgressBar } from "@/components/ui";
import {
  getProductionStatusLabel,
  type VideoProductionRecord,
} from "@/src/lib/video-production";
import { exportPipelineReportMarkdown } from "@/src/lib/video-pipeline-report";

type Props = {
  records: VideoProductionRecord[];
  mp4Map: Record<string, boolean>;
  presentScreenshotFiles: string[];
};

function CellBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
        ok ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {ok ? "✓" : "○"} {label}
    </span>
  );
}

export function VideoLibraryAdminTable({ records, mp4Map, presentScreenshotFiles }: Props) {
  const presentSet = useMemo(() => new Set(presentScreenshotFiles), [presentScreenshotFiles]);

  const exportOne = useCallback(
    (record: VideoProductionRecord) => {
      const md = exportPipelineReportMarkdown([record], { presentScreenshotFiles: presentSet });
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${record.slug}-rapport.md`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [presentSet]
  );

  const exportAll = useCallback(() => {
    const md = exportPipelineReportMarkdown(records, { presentScreenshotFiles: presentSet });
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video-library-rapport.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [records, presentSet]);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={exportAll}
          className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/10"
        >
          Exporter rapport complet
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-light bg-surface-elevated">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="border-b border-border-light text-left text-xs text-ink-tertiary">
              <th className="p-4">Vidéo</th>
              <th className="p-4">Statut</th>
              <th className="p-4">MP4</th>
              <th className="p-4">Transcript</th>
              <th className="p-4">Ressource</th>
              <th className="p-4">Cours / Lab</th>
              <th className="p-4">Production</th>
              <th className="p-4">Qualité</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.slug} className="border-b border-border-light last:border-0">
                <td className="p-4">
                  <Link href={`/videos/${r.slug}`} className="font-semibold text-ink hover:text-accent">
                    {r.title}
                  </Link>
                  <p className="text-xs text-ink-tertiary">{r.module}</p>
                </td>
                <td className="p-4">
                  <Badge variant={r.status === "published" ? "accent" : "default"}>
                    {getProductionStatusLabel(r.status)}
                  </Badge>
                </td>
                <td className="p-4">
                  <CellBadge ok={mp4Map[r.slug] ?? false} label="MP4" />
                </td>
                <td className="p-4">
                  <CellBadge ok={r.hasTranscript} label="TR" />
                </td>
                <td className="p-4">
                  <CellBadge ok={Boolean(r.resourceSlug)} label={r.resourceSlug ?? "—"} />
                </td>
                <td className="p-4 text-xs text-ink-secondary">
                  <div>{r.courseSlug ?? "—"}</div>
                  <div className="text-ink-tertiary">{r.labSlug ?? "—"}</div>
                </td>
                <td className="p-4">
                  <ProgressBar value={r.pipelinePercent} className="w-24" />
                  <p className="mt-1 text-xs text-ink-tertiary">{r.pipelinePercent}%</p>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    <CellBadge ok={r.quality.storyboard} label="SB" />
                    <CellBadge ok={r.quality.quiz} label="QZ" />
                    <CellBadge ok={r.quality.lab} label="LB" />
                    <CellBadge ok={r.quality.resource} label="RS" />
                    <CellBadge ok={r.score.captures} label="CP" />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => exportOne(r)}
                      className="text-left font-semibold text-accent hover:underline"
                    >
                      Rapport
                    </button>
                    <Link href={`/transcripts#${r.slug}`} className="text-accent hover:underline">
                      Transcript
                    </Link>
                    <Link href="/admin/video-pipeline" className="text-accent hover:underline">
                      Pipeline
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
