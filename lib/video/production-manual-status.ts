/** État manuel production vidéo — checklist opérateur (localStorage côté client) */

export type ManualProductionStepId =
  | "scriptExported"
  | "capturesProduced"
  | "narrationGenerated"
  | "editingComplete"
  | "mp4Added"
  | "published";

export type ManualProductionStep = {
  id: ManualProductionStepId;
  label: string;
};

export const MANUAL_PRODUCTION_STEPS: ManualProductionStep[] = [
  { id: "scriptExported", label: "Script exporté" },
  { id: "capturesProduced", label: "Captures produites" },
  { id: "narrationGenerated", label: "Narration HeyGen générée" },
  { id: "editingComplete", label: "Montage terminé" },
  { id: "mp4Added", label: "MP4 ajouté" },
  { id: "published", label: "Vidéo publiée" },
];

export type ManualProductionStatusMap = Record<
  string,
  Partial<Record<ManualProductionStepId, boolean>>
>;

const STORAGE_KEY = "apple-mdm-video-manual-production";

export function loadManualProductionStatus(): ManualProductionStatusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ManualProductionStatusMap) : {};
  } catch {
    return {};
  }
}

export function saveManualProductionStatus(map: ManualProductionStatusMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function toggleManualStep(slug: string, stepId: ManualProductionStepId, value: boolean): void {
  const map = loadManualProductionStatus();
  map[slug] = { ...map[slug], [stepId]: value };
  saveManualProductionStatus(map);
}

export function getManualStepsForVideo(slug: string): Partial<Record<ManualProductionStepId, boolean>> {
  return loadManualProductionStatus()[slug] ?? {};
}
