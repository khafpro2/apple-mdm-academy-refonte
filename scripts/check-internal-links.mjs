#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const SEARCH_DIRS = ["app", "components", "lib", "src"].map((dir) => path.join(ROOT, dir));
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx"]);
const ROUTE_FILES = new Set(["page.tsx", "page.ts", "route.ts", "route.tsx"]);

function walk(dir, predicate = () => true, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }

  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, predicate, out);
    } else if (predicate(fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function routeFromAppFile(file) {
  const relative = path.relative(APP_DIR, path.dirname(file));
  if (!relative || relative === ".") return "/";
  return `/${relative.replaceAll(path.sep, "/")}`;
}

function segmentMatches(routeSegment, targetSegment) {
  if (routeSegment.startsWith("[") && routeSegment.endsWith("]")) return Boolean(targetSegment);
  return routeSegment === targetSegment;
}

function routeExists(target, routes) {
  const cleanTarget = target.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  if (routes.has(cleanTarget)) return true;

  const targetSegments = cleanTarget.split("/").filter(Boolean);
  for (const route of routes) {
    const routeSegments = route.split("/").filter(Boolean);
    if (routeSegments.length !== targetSegments.length) continue;
    if (routeSegments.every((segment, index) => segmentMatches(segment, targetSegments[index]))) {
      return true;
    }
  }
  return false;
}

function isStaticInternalLink(value) {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("${") &&
    !value.includes("[") &&
    !value.includes("*")
  );
}

const routeFiles = walk(APP_DIR, (file) => ROUTE_FILES.has(path.basename(file)));
const routes = new Set(routeFiles.map(routeFromAppFile));
const sourceFiles = SEARCH_DIRS.flatMap((dir) =>
  walk(dir, (file) => SOURCE_EXTENSIONS.has(path.extname(file)))
);

const linkPatterns = [
  /\bhref\s*=\s*["']([^"']+)["']/g,
  /\bhref\s*=\s*\{\s*["']([^"']+)["']\s*\}/g,
  /\b(?:router\.(?:push|replace)|redirect)\(\s*["']([^"']+)["']\s*\)/g,
];

const rows = [];
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  for (const pattern of linkPatterns) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const target = match[1];
      if (!isStaticInternalLink(target)) continue;
      rows.push({
        source: path.relative(ROOT, file),
        target,
        exists: routeExists(target, routes),
      });
    }
  }
}

const uniqueRows = Array.from(
  new Map(rows.map((row) => [`${row.source}|${row.target}`, row])).values()
).sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target));

for (const row of uniqueRows) {
  console.log(`${row.exists ? "OK" : "MISSING"}\t${row.target}\t${row.source}`);
}

const missing = uniqueRows.filter((row) => !row.exists);
console.error(`\nRoutes scannées: ${routes.size}`);
console.error(`Liens internes statiques: ${uniqueRows.length}`);
console.error(`Liens cassés: ${missing.length}`);
process.exit(missing.length > 0 ? 1 : 0);
