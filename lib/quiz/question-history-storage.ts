/**
 * Historique local des questions déjà servies, par quiz/examen.
 *
 * Objectif : éviter qu'un « nouveau quiz »/« recommencer » ne reproduise le
 * tirage précédent. On mémorise, par clé (slug de quiz ou route d'examen) :
 *  - les identifiants stables des questions vues lors des dernières tentatives
 *    (pour déprioriser leur réapparition tant que la banque n'est pas épuisée) ;
 *  - la séquence exacte (ordonnée) de la toute dernière tentative (pour
 *    détecter un tirage strictement identique et forcer une nouvelle
 *    génération).
 *
 * Stockage : localStorage, avec les mêmes garanties que le reste du module
 * exam/ (no-op côté serveur, tolérant au quota, invalidation par comparaison
 * de la chaîne brute).
 */

const PREFIX = "apple-mdm-question-history-";
/** Nombre de tentatives conservées pour le calcul des IDs "récemment vus". */
const HISTORY_DEPTH = 3;

type QuestionHistoryRecord = {
  /** Une entrée par tentative récente, la plus récente en tête. */
  attempts: string[][];
};

const cache = new Map<string, { raw: string | null; value: QuestionHistoryRecord }>();

function key(historyKey: string): string {
  return `${PREFIX}${historyKey}`;
}

function readRecord(historyKey: string): QuestionHistoryRecord {
  const empty: QuestionHistoryRecord = { attempts: [] };
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(key(historyKey));
    const cached = cache.get(historyKey);
    if (cached?.raw === raw) return cached.value;

    let value = empty;
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<QuestionHistoryRecord>;
      if (Array.isArray(parsed.attempts)) value = { attempts: parsed.attempts };
    }
    cache.set(historyKey, { raw, value });
    return value;
  } catch {
    return empty;
  }
}

function writeRecord(historyKey: string, record: QuestionHistoryRecord): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(record);
    localStorage.setItem(key(historyKey), raw);
    cache.set(historyKey, { raw, value: record });
  } catch {
    /* quota dépassé — pas bloquant, l'historique repart simplement à vide */
  }
}

/** Identifiants stables (hors variantes/session) vus dans les dernières tentatives. */
export function getRecentlyUsedIds(historyKey: string, depth: number = HISTORY_DEPTH): Set<string> {
  const { attempts } = readRecord(historyKey);
  const recent = attempts.slice(0, depth);
  return new Set(recent.flat());
}

/** Séquence ordonnée exacte de la dernière tentative, ou null si aucune. */
export function getLastAttemptSequence(historyKey: string): string[] | null {
  const { attempts } = readRecord(historyKey);
  return attempts[0] ?? null;
}

/** Vrai si `sequence` reproduit exactement (mêmes IDs, même ordre) la dernière tentative. */
export function isSameAsLastAttempt(historyKey: string, sequence: string[]): boolean {
  const last = getLastAttemptSequence(historyKey);
  if (!last || last.length !== sequence.length) return false;
  return last.every((id, i) => id === sequence[i]);
}

/** Enregistre une nouvelle tentative (identifiants stables, dans l'ordre affiché). */
export function recordQuestionAttempt(historyKey: string, stableIds: string[]): void {
  if (stableIds.length === 0) return;
  const { attempts } = readRecord(historyKey);
  const next = [stableIds, ...attempts].slice(0, HISTORY_DEPTH);
  writeRecord(historyKey, { attempts: next });
}

/**
 * Retire le seul suffixe de variante de padding (`-v3`, `-variant2`) pour
 * comparer des questions équivalentes entre tirages. Les ID composites de
 * session d'examen (`exam-<seed>-<index>-<id>`) ne sont PAS reconstruits ici
 * par regex — trop fragile puisque `<seed>` peut lui-même contenir des
 * tirets. Pour ces cas, `selectExamQuestions` renvoie directement les ID
 * stables utilisés pendant la sélection (voir `ExamSelectionReport.selectedStableIds`) ;
 * cette fonction ne sert que pour les banques déjà "plates" (quiz standards).
 */
export function stableQuestionId(id: string): string {
  return id.replace(/-(variant|v)\d+$/i, "");
}
