"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getLabPercent,
  getLabProgressServerSnapshot,
  getLabProgressSnapshot,
  getLabStatus,
  parseLabProgressSnapshot,
  subscribeLabProgressStore,
  type LabProgressRecord,
  type LabStatus,
} from "@/lib/labs/progress";

export function useLabProgressRecord(slug: string, totalSteps = 0): LabProgressRecord | null {
  const getSnapshot = useCallback(
    () => getLabProgressSnapshot(slug, totalSteps),
    [slug, totalSteps]
  );

  const snapshot = useSyncExternalStore(
    subscribeLabProgressStore,
    getSnapshot,
    getLabProgressServerSnapshot
  );

  return parseLabProgressSnapshot(snapshot);
}

export function useLabProgressSummary(
  slug: string,
  totalSteps: number
): { status: LabStatus; percent: number } {
  const progress = useLabProgressRecord(slug, totalSteps);

  const status = progress
    ? getLabStatus(slug, totalSteps)
    : ("not_started" as LabStatus);
  const percent = progress ? getLabPercent(slug, totalSteps) : 0;

  return { status, percent };
}
