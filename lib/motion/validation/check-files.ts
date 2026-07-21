import { existsSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import type { MotionAsset, MotionScene } from "@/lib/motion/types";
import { sceneRequiresPublishedMedia } from "@/lib/motion/publication";
import { isMotionSceneStatus } from "@/lib/motion/statuses";
import { issue, type ValidationIssue, type ValidationResult } from "@/lib/motion/validation/types";

export type FileCheckOptions = {
  /** Racine du projet (process.cwd() par défaut). */
  projectRoot?: string;
  /** Dossier public (public/ par défaut). */
  publicDir?: string;
};

export type FileCheckFinding = ValidationIssue & {
  absolutePath?: string;
  sizeBytes?: number;
};

export type FileCheckReport = {
  valid: boolean;
  errors: FileCheckFinding[];
  warnings: FileCheckFinding[];
  missingPaths: string[];
  presentPaths: string[];
  duplicateContentKeys: string[];
};

function publicPathToFs(publicUrlPath: string, publicRoot: string): string {
  const cleaned = publicUrlPath.replace(/^\/+/, "");
  return join(publicRoot, cleaned);
}

function collectDeclaredPaths(scenes: MotionScene[], assets: MotionAsset[]): string[] {
  const paths: string[] = [];
  for (const asset of assets) {
    if (asset.path) paths.push(asset.path);
  }
  for (const scene of scenes) {
    const m = scene.media;
    if (!m) continue;
    if (m.posterPath) paths.push(m.posterPath);
    if (m.mp4Path) paths.push(m.mp4Path);
    if (m.webmPath) paths.push(m.webmPath);
    if (m.vttPath) paths.push(m.vttPath);
    if (m.transcriptPath) paths.push(m.transcriptPath);
  }
  return paths;
}

/**
 * Détecte des collisions de casse sur un même dossier (sensible pour Linux vs macOS).
 */
function findCaseCollisions(absolutePaths: string[]): string[] {
  const byDir = new Map<string, Map<string, string>>();
  const collisions: string[] = [];

  for (const abs of absolutePaths) {
    if (!existsSync(abs)) continue;
    const dir = dirname(abs);
    const base = abs.slice(dir.length + 1);
    const key = base.toLowerCase();
    if (!byDir.has(dir)) byDir.set(dir, new Map());
    const map = byDir.get(dir)!;
    const existing = map.get(key);
    if (existing && existing !== base) {
      collisions.push(`${dir}${sep}${existing} ↔ ${base}`);
    } else {
      map.set(key, base);
    }
  }

  // Also scan sibling files in each directory for on-disk case duplicates
  for (const [dir, map] of byDir) {
    if (!existsSync(dir)) continue;
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    const seen = new Map<string, string>();
    for (const name of entries) {
      const lower = name.toLowerCase();
      const prev = seen.get(lower);
      if (prev && prev !== name) {
        collisions.push(`${dir}${sep}${prev} ↔ ${name}`);
      } else {
        seen.set(lower, name);
      }
      // mark known declared files
      void map;
    }
  }

  return [...new Set(collisions)];
}

/**
 * Clé de doublon basique : taille + basename lower-case (heuristique légère).
 * Les vrais hash SHA sont hors scope pour garder l'audit rapide.
 */
function duplicateKey(abs: string, size: number): string {
  const base = abs.split(sep).pop()?.toLowerCase() ?? abs;
  return `${base}::${size}`;
}

/**
 * Vérifie la présence physique des fichiers référencés.
 * À exécuter côté Node / build / script — jamais dans le navigateur.
 */
export function checkMotionFiles(
  scenes: MotionScene[],
  assets: MotionAsset[],
  options: FileCheckOptions = {}
): FileCheckReport {
  const projectRoot = options.projectRoot ?? process.cwd();
  const publicRoot = options.publicDir ?? join(projectRoot, "public");

  const errors: FileCheckFinding[] = [];
  const warnings: FileCheckFinding[] = [];
  const missingPaths: string[] = [];
  const presentPaths: string[] = [];
  const absPresent: string[] = [];
  const sizeByKey = new Map<string, string[]>();

  const checkPath = (
    publicPath: string,
    opts: {
      subjectId: string;
      field: string;
      required: boolean;
      expectedExts?: string[];
      minBytes?: number;
    }
  ) => {
    const abs = publicPathToFs(publicPath, publicRoot);
    const exists = existsSync(abs);

    if (!exists) {
      missingPaths.push(publicPath);
      if (opts.required) {
        errors.push(
          issue("error", "file-missing", `Fichier manquant: ${publicPath}`, {
            subjectId: opts.subjectId,
            path: opts.field,
          })
        );
      } else {
        warnings.push(
          issue("warning", "file-missing-optional", `Fichier absent (non bloquant): ${publicPath}`, {
            subjectId: opts.subjectId,
            path: opts.field,
          })
        );
      }
      return;
    }

    presentPaths.push(publicPath);
    absPresent.push(abs);

    let size = 0;
    try {
      size = statSync(abs).size;
    } catch {
      warnings.push(
        issue("warning", "file-stat-failed", `Impossible de lire la taille: ${publicPath}`, {
          subjectId: opts.subjectId,
          path: opts.field,
        })
      );
    }

    if (opts.minBytes != null && size < opts.minBytes) {
      warnings.push(
        issue(
          "warning",
          "file-too-small",
          `Fichier suspicieusement petit (${size} o < ${opts.minBytes}): ${publicPath}`,
          { subjectId: opts.subjectId, path: opts.field }
        )
      );
    }

    if (opts.expectedExts?.length) {
      const lower = publicPath.toLowerCase();
      if (!opts.expectedExts.some((ext) => lower.endsWith(ext))) {
        errors.push(
          issue(
            "error",
            "file-extension-invalid",
            `Extension incorrecte pour ${publicPath} (attendu: ${opts.expectedExts.join(", ")})`,
            { subjectId: opts.subjectId, path: opts.field }
          )
        );
      }
    }

    // Case-sensitive path: realpath basename vs declared basename
    try {
      const real = realpathSync(abs);
      const declaredBase = abs.split(sep).pop() ?? "";
      const realBase = real.split(sep).pop() ?? "";
      if (declaredBase !== realBase && declaredBase.toLowerCase() === realBase.toLowerCase()) {
        errors.push(
          issue(
            "error",
            "file-case-mismatch",
            `Casse incohérente: déclaré « ${declaredBase} », disque « ${realBase} »`,
            { subjectId: opts.subjectId, path: opts.field }
          )
        );
      }
    } catch {
      // ignore
    }

    const key = duplicateKey(abs, size);
    const list = sizeByKey.get(key) ?? [];
    list.push(publicPath);
    sizeByKey.set(key, list);

    void relative(projectRoot, abs);
  };

  for (const asset of assets) {
    if (!asset.path) continue;
    const required = asset.status === "ready";
    checkPath(asset.path, {
      subjectId: asset.id,
      field: "path",
      required,
      expectedExts: undefined,
    });
  }

  for (const scene of scenes) {
    const media = scene.media;
    if (!media) continue;

    const publishedRequired =
      isMotionSceneStatus(scene.status) && sceneRequiresPublishedMedia(scene.status);

    if (media.posterPath) {
      checkPath(media.posterPath, {
        subjectId: scene.id,
        field: "media.posterPath",
        required: publishedRequired,
        expectedExts: [".svg", ".png", ".webp", ".jpg", ".jpeg"],
      });
    } else if (publishedRequired) {
      errors.push(
        issue("error", "poster-missing", "Poster requis pour une scène published/approved.", {
          subjectId: scene.id,
          path: "media.posterPath",
        })
      );
    }

    const hasVideoDecl = Boolean(media.mp4Path || media.webmPath);
    if (publishedRequired && !hasVideoDecl) {
      errors.push(
        issue("error", "video-declaration-missing", "MP4 ou WebM requis (déclaration).", {
          subjectId: scene.id,
          path: "media",
        })
      );
    }

    if (media.mp4Path) {
      checkPath(media.mp4Path, {
        subjectId: scene.id,
        field: "media.mp4Path",
        required: publishedRequired,
        expectedExts: [".mp4"],
        minBytes: publishedRequired ? 1024 : undefined,
      });
    }

    if (media.webmPath) {
      checkPath(media.webmPath, {
        subjectId: scene.id,
        field: "media.webmPath",
        required: false,
        expectedExts: [".webm"],
      });
    }

    if (publishedRequired && !media.mp4Path && !media.webmPath) {
      // already handled
    } else if (publishedRequired && media.mp4Path && media.webmPath) {
      // ok
    }

    // At least one of mp4/webm must exist on disk when published
    if (publishedRequired) {
      const mp4Ok = media.mp4Path ? existsSync(publicPathToFs(media.mp4Path, publicRoot)) : false;
      const webmOk = media.webmPath ? existsSync(publicPathToFs(media.webmPath, publicRoot)) : false;
      if (!mp4Ok && !webmOk) {
        // individual missing errors already added; ensure code for summary
        if (!errors.some((e) => e.subjectId === scene.id && e.code === "file-missing" && (e.path === "media.mp4Path" || e.path === "media.webmPath"))) {
          errors.push(
            issue("error", "video-file-missing", "Aucun fichier MP4/WebM présent pour une scène publiée.", {
              subjectId: scene.id,
              path: "media",
            })
          );
        }
      }
    }

    if (media.vttPath) {
      checkPath(media.vttPath, {
        subjectId: scene.id,
        field: "media.vttPath",
        required: publishedRequired,
        expectedExts: [".vtt"],
      });
    } else if (publishedRequired) {
      errors.push(
        issue("error", "vtt-missing", "Sous-titres VTT absents pour une scène published/approved.", {
          subjectId: scene.id,
          path: "media.vttPath",
        })
      );
    }

    if (media.transcriptPath) {
      checkPath(media.transcriptPath, {
        subjectId: scene.id,
        field: "media.transcriptPath",
        required: publishedRequired,
        expectedExts: [".md", ".txt"],
      });
    } else if (publishedRequired) {
      errors.push(
        issue("error", "transcript-missing", "Transcript absent pour une scène published/approved.", {
          subjectId: scene.id,
          path: "media.transcriptPath",
        })
      );
    }
  }

  for (const collision of findCaseCollisions(absPresent)) {
    errors.push(
      issue("error", "file-case-collision", `Collision de casse détectée: ${collision}`, {
        path: collision,
      })
    );
  }

  const duplicateContentKeys: string[] = [];
  for (const [key, paths] of sizeByKey) {
    const unique = [...new Set(paths)];
    if (unique.length > 1) {
      duplicateContentKeys.push(key);
      warnings.push(
        issue(
          "warning",
          "file-possible-duplicate",
          `Doublon possible (même nom+taille): ${unique.join(" | ")}`,
          { path: unique[0] }
        )
      );
    }
  }

  // Detect duplicate public path declarations
  const declared = collectDeclaredPaths(scenes, assets);
  const seen = new Map<string, number>();
  for (const p of declared) {
    seen.set(p, (seen.get(p) ?? 0) + 1);
  }
  for (const [p, count] of seen) {
    if (count > 1) {
      warnings.push(
        issue("warning", "path-declared-multiple-times", `Chemin déclaré ${count} fois: ${p}`, {
          path: p,
        })
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingPaths: [...new Set(missingPaths)],
    presentPaths: [...new Set(presentPaths)],
    duplicateContentKeys,
  };
}

export function fileCheckToValidationResult(report: FileCheckReport): ValidationResult {
  return {
    valid: report.valid,
    errors: report.errors,
    warnings: report.warnings,
  };
}
