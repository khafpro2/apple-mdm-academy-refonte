/**
 * Audit des métadonnées de versions des cours.
 * Usage : npm run audit:versions
 * Ne modifie aucun fichier.
 */

import { courses } from "../lib/data/courses";
import { withCourseCompatibility } from "../lib/data/course-compatibility";
import { platformVersions, type ApplePlatform } from "../lib/platform-versions";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

type Severity = "error" | "warning" | "info";

type Finding = {
  courseId: string;
  file: string;
  platform?: string;
  problem: string;
  severity: Severity;
  recommendation: string;
};

const VALID_STATUSES = new Set(["current", "compatible", "changed", "legacy", "needs-review"]);
const VALID_PLATFORMS = new Set(["macOS", "iOS", "iPadOS"]);

const findings: Finding[] = [];

function add(finding: Finding) {
  findings.push(finding);
}

for (const raw of courses) {
  const course = withCourseCompatibility(raw);
  const file = "lib/data/courses.ts (+ course-compatibility.ts)";

  if (!course.platforms?.length) {
    add({
      courseId: course.slug,
      file,
      problem: "Cours sans plateforme",
      severity: course.trackSlug.startsWith("apple-") ? "warning" : "info",
      recommendation: "Ajouter platforms: ['macOS'|'iOS'|'iPadOS'] si le contenu dépend d’un OS.",
    });
  } else {
    for (const p of course.platforms) {
      if (!VALID_PLATFORMS.has(p)) {
        add({
          courseId: course.slug,
          file,
          platform: p,
          problem: "Plateforme inconnue",
          severity: "error",
          recommendation: "Utiliser uniquement macOS, iOS ou iPadOS.",
        });
      }
    }
  }

  if (!course.primaryVersion && course.platforms?.length) {
    add({
      courseId: course.slug,
      file,
      problem: "Cours sans version principale",
      severity: "warning",
      recommendation: "Définir primaryVersion (ex. '26').",
    });
  }

  if (!course.lastVerifiedAt && course.platforms?.length) {
    add({
      courseId: course.slug,
      file,
      problem: "Cours sans date de vérification",
      severity: "warning",
      recommendation: "Définir lastVerifiedAt (YYYY-MM-DD).",
    });
  }

  if (course.versionStatus === "needs-review") {
    add({
      courseId: course.slug,
      file,
      problem: "Cours marqué needs-review",
      severity: "warning",
      recommendation: "Revérifier le contenu contre la doc officielle, puis mettre à jour versionStatus.",
    });
  }

  if (course.versionStatus && !VALID_STATUSES.has(course.versionStatus)) {
    add({
      courseId: course.slug,
      file,
      problem: `Statut de version invalide: ${course.versionStatus}`,
      severity: "error",
      recommendation: "Utiliser current | compatible | changed | legacy | needs-review.",
    });
  }

  if (course.platforms?.length && !course.officialSources?.length) {
    add({
      courseId: course.slug,
      file,
      problem: "Cours sans source officielle",
      severity: "warning",
      recommendation: "Ajouter officialSources avec publisher, url et checkedAt.",
    });
  }

  if (course.primaryVersion && course.minimumVersion) {
    const primary = Number(course.primaryVersion);
    const minimum = Number(course.minimumVersion);
    if (!Number.isNaN(primary) && !Number.isNaN(minimum) && minimum > primary) {
      add({
        courseId: course.slug,
        file,
        problem: "Version minimale supérieure à la version principale",
        severity: "error",
        recommendation: "Corriger minimumVersion / primaryVersion.",
      });
    }
  }

  if (course.primaryVersion) {
    for (const platform of (course.platforms ?? []) as ApplePlatform[]) {
      const current = platformVersions[platform]?.current;
      if (current && course.primaryVersion !== current && course.versionStatus === "current") {
        add({
          courseId: course.slug,
          file,
          platform,
          problem: `primaryVersion ${course.primaryVersion} ≠ version courante ${current} alors que status=current`,
          severity: "warning",
          recommendation: "Aligner primaryVersion ou passer versionStatus à compatible / needs-review.",
        });
      }
    }
  }
}

/** Détection grossière de versions en dur hors source de vérité */
function walkTsFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "alternative-mdm-tracks") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsFiles(full, acc);
    else if (/\.(tsx?|jsx?)$/.test(name)) acc.push(full);
  }
  return acc;
}

const hardcodePattern = /macOS\s+1[0-9]|iOS\s+1[0-9]|iPadOS\s+1[0-9]|Mac OS/i;
for (const file of walkTsFiles("components").concat(walkTsFiles("app")).slice(0, 400)) {
  if (file.includes("platform-versions") || file.includes("course-compatibility")) continue;
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (hardcodePattern.test(text) && !text.includes("platformVersions") && !text.includes("formatPlatformLabel")) {
    add({
      courseId: "(composant)",
      file,
      problem: "Possible numéro de version ou libellé OS écrit en dur",
      severity: "info",
      recommendation: "Préférer lib/platform-versions.ts pour les libellés de version.",
    });
  }
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warning");
const infos = findings.filter((f) => f.severity === "info");

console.log("=== Audit versions Apple MDM Academy ===\n");
console.log(`Cours analysés : ${courses.length}`);
console.log(`Findings : ${findings.length} (errors=${errors.length}, warnings=${warnings.length}, info=${infos.length})\n`);

for (const f of findings) {
  console.log(`[${f.severity.toUpperCase()}] ${f.courseId}`);
  console.log(`  fichier     : ${f.file}`);
  if (f.platform) console.log(`  plateforme  : ${f.platform}`);
  console.log(`  problème    : ${f.problem}`);
  console.log(`  correction  : ${f.recommendation}`);
  console.log("");
}

if (errors.length > 0) {
  process.exitCode = 1;
}
