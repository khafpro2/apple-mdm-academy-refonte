"use client";

import { useCallback } from "react";
import { exportPipelineReportMarkdown } from "@/src/lib/video-pipeline-report";
import type { VideoProductionRecord } from "@/src/lib/video-production";

type Props = {
  records: VideoProductionRecord[];
  presentScreenshotFiles: string[];
};

export function VideoPipelineExportButton({ records, presentScreenshotFiles }: Props) {
  const handleExport = useCallback(() => {
    const md = exportPipelineReportMarkdown(records, {
      presentScreenshotFiles: new Set(presentScreenshotFiles),
    });
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-video-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [records, presentScreenshotFiles]);

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
    >
      Exporter rapport pipeline
    </button>
  );
}
