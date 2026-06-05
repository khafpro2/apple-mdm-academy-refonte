/** Progression labs — localStorage par slug (+ sync Supabase via server action) */

export type LabStatus = "not_started" | "in_progress" | "completed";

export type LabProgressRecord = {
  slug: string;
  /** IDs prérequis cochés (prereq-0, prereq-1, …) */
  checkedPrerequisiteIds: string[];
  validatedStepIds: string[];
  percent: number;
  started: boolean;
  completed: boolean;
  updatedAt: string;
  completedAt?: string;
};

export const LAB_PROGRESS_KEY_PREFIX = "apple-mdm-academy-lab-progress-";
const LEGACY_STORAGE_KEY = "mdm-academy-lab-progress";

export function getLabStorageKey(slug: string): string {
  return `${LAB_PROGRESS_KEY_PREFIX}${slug}`;
}

export function getPrerequisiteId(index: number): string {
  return `prereq-${index}`;
}

function defaultRecord(slug: string): LabProgressRecord {
  return {
    slug,
    checkedPrerequisiteIds: [],
    validatedStepIds: [],
    percent: 0,
    started: false,
    completed: false,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeRecord(raw: Partial<LabProgressRecord> & { slug: string }, totalSteps = 0): LabProgressRecord {
  const validatedStepIds = raw.validatedStepIds ?? [];
  const completed = raw.completed ?? (totalSteps > 0 && validatedStepIds.length >= totalSteps);
  const percent =
    typeof raw.percent === "number"
      ? completed
        ? 100
        : raw.percent
      : totalSteps > 0
        ? Math.round((validatedStepIds.length / totalSteps) * 100)
        : 0;

  return {
    slug: raw.slug,
    checkedPrerequisiteIds: raw.checkedPrerequisiteIds ?? [],
    validatedStepIds,
    percent: completed ? 100 : percent,
    started: raw.started ?? false,
    completed,
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    completedAt: raw.completedAt,
  };
}

function readLegacyRecord(slug: string): LabProgressRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, Partial<LabProgressRecord> & { slug?: string }>;
    const legacy = all[slug];
    if (!legacy) return null;
    return normalizeRecord({ ...legacy, slug });
  } catch {
    return null;
  }
}

function writeRecord(slug: string, record: LabProgressRecord): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getLabStorageKey(slug), JSON.stringify(record));
}

function migrateLegacyRecord(slug: string, record: LabProgressRecord): void {
  writeRecord(slug, record);
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;
    const all = JSON.parse(raw) as Record<string, unknown>;
    delete all[slug];
    if (Object.keys(all).length === 0) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(all));
    }
  } catch {
    /* ignore */
  }
}

export function getLabProgress(slug: string, totalSteps = 0): LabProgressRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getLabStorageKey(slug));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LabProgressRecord>;
      return normalizeRecord({ ...parsed, slug }, totalSteps);
    }
  } catch {
    /* fall through */
  }

  const legacy = readLegacyRecord(slug);
  if (legacy) {
    migrateLegacyRecord(slug, normalizeRecord(legacy, totalSteps));
    return normalizeRecord(legacy, totalSteps);
  }

  return null;
}

export function getAllLabProgress(slugs: string[]): Record<string, LabProgressRecord> {
  const out: Record<string, LabProgressRecord> = {};
  for (const slug of slugs) {
    const record = getLabProgress(slug);
    if (record) out[slug] = record;
  }
  return out;
}

export function getLabStatus(slug: string, totalSteps: number): LabStatus {
  const p = getLabProgress(slug, totalSteps);
  if (!p || !p.started) return "not_started";
  if (p.completed || p.validatedStepIds.length >= totalSteps) return "completed";
  return "in_progress";
}

export function getLabPercent(slug: string, totalSteps: number): number {
  const p = getLabProgress(slug, totalSteps);
  if (!p || totalSteps === 0) return 0;
  if (p.completed) return 100;
  return p.percent;
}

function computePercent(validatedStepIds: string[], totalSteps: number, completed: boolean): number {
  if (completed || totalSteps === 0) return completed ? 100 : 0;
  return Math.round((validatedStepIds.length / totalSteps) * 100);
}

export function saveLabProgressLocal(
  slug: string,
  patch: Partial<Omit<LabProgressRecord, "slug">>,
  totalSteps = 0
): LabProgressRecord {
  const existing = getLabProgress(slug, totalSteps) ?? defaultRecord(slug);

  const validatedStepIds = patch.validatedStepIds ?? existing.validatedStepIds;
  const completed =
    patch.completed ??
    (totalSteps > 0 ? validatedStepIds.length >= totalSteps : existing.completed);

  const next: LabProgressRecord = normalizeRecord(
    {
      ...existing,
      ...patch,
      slug,
      validatedStepIds,
      completed,
      percent: computePercent(validatedStepIds, totalSteps, completed),
      updatedAt: new Date().toISOString(),
      completedAt:
        completed && !existing.completedAt
          ? new Date().toISOString()
          : patch.completedAt ?? existing.completedAt,
    },
    totalSteps
  );

  writeRecord(slug, next);
  return next;
}

export function togglePrerequisiteChecked(
  slug: string,
  prereqId: string,
  totalSteps: number
): LabProgressRecord {
  const existing = getLabProgress(slug, totalSteps) ?? defaultRecord(slug);
  const ids = new Set(existing.checkedPrerequisiteIds);
  if (ids.has(prereqId)) ids.delete(prereqId);
  else ids.add(prereqId);

  return saveLabProgressLocal(
    slug,
    {
      checkedPrerequisiteIds: [...ids],
      started: existing.started || ids.size > 0,
    },
    totalSteps
  );
}

export function markStepValidated(slug: string, stepId: string, totalSteps: number): LabProgressRecord {
  const p = getLabProgress(slug, totalSteps) ?? defaultRecord(slug);
  const ids = new Set(p.validatedStepIds);
  ids.add(stepId);
  const validatedStepIds = [...ids];
  const completed = validatedStepIds.length >= totalSteps;

  return saveLabProgressLocal(
    slug,
    {
      started: true,
      validatedStepIds,
      completed,
    },
    totalSteps
  );
}

export function startLabLocal(slug: string, totalSteps = 0): LabProgressRecord {
  return saveLabProgressLocal(slug, { started: true }, totalSteps);
}

export function resetLabLocal(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getLabStorageKey(slug));
}

/** @deprecated Utiliser getLabStorageKey(slug) */
export const labProgressStorageKey = LEGACY_STORAGE_KEY;

export function subscribeLabProgressStore(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    const key = event.key;
    if (
      key === null ||
      key === LEGACY_STORAGE_KEY ||
      key.startsWith(LAB_PROGRESS_KEY_PREFIX)
    ) {
      onStoreChange();
    }
  };
  const onCustom = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener("lab-progress-updated", onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("lab-progress-updated", onCustom);
  };
}

export function getLabProgressSnapshot(slug: string, totalSteps = 0): string {
  const record = getLabProgress(slug, totalSteps);
  return record ? JSON.stringify(record) : "";
}

export function getLabProgressServerSnapshot(): string {
  return "";
}

export function parseLabProgressSnapshot(snapshot: string): LabProgressRecord | null {
  if (!snapshot) return null;
  try {
    return normalizeRecord(JSON.parse(snapshot) as LabProgressRecord);
  } catch {
    return null;
  }
}

/** Préparation sync Supabase — même forme que lesson_progress (course_slug: labs) */
export type LabProgressSyncPayload = {
  labSlug: string;
  trackSlug: string;
  checkedPrerequisiteIds: string[];
  validatedStepIds: string[];
  percent: number;
  completed: boolean;
};

export function toSyncPayload(
  labSlug: string,
  trackSlug: string,
  record: LabProgressRecord,
  totalSteps: number
): LabProgressSyncPayload {
  return {
    labSlug,
    trackSlug,
    checkedPrerequisiteIds: record.checkedPrerequisiteIds,
    validatedStepIds: record.validatedStepIds,
    percent: getLabPercent(labSlug, totalSteps),
    completed: record.completed,
  };
}
