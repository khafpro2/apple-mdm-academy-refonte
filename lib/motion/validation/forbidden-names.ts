/**
 * Noms de fichiers / stems interdits (trop génériques ou non versionnés).
 */
export const FORBIDDEN_ASSET_NAME_STEMS = [
  "final",
  "final-v2",
  "new",
  "latest",
  "test",
  "image1",
  "asset1",
] as const;

const FORBIDDEN_SET = new Set<string>(FORBIDDEN_ASSET_NAME_STEMS);

/** Extraire le stem (nom sans extension) d'un chemin ou d'un nom de fichier. */
export function fileStem(pathOrName: string): string {
  const base = pathOrName.split("/").pop() ?? pathOrName;
  const dot = base.lastIndexOf(".");
  return (dot > 0 ? base.slice(0, dot) : base).toLowerCase();
}

export function hasForbiddenAssetName(pathOrName: string): boolean {
  return FORBIDDEN_SET.has(fileStem(pathOrName));
}

/** Détecte des motifs de fichiers temporaires. */
export function isTemporaryFileName(pathOrName: string): boolean {
  const base = (pathOrName.split("/").pop() ?? pathOrName).toLowerCase();
  return (
    base.startsWith(".") ||
    base.endsWith(".tmp") ||
    base.endsWith(".temp") ||
    base.endsWith("~") ||
    base.includes(".bak") ||
    base.startsWith("~$") ||
    base === "thumbs.db" ||
    base === ".ds_store"
  );
}
