import fs from "node:fs";
import path from "node:path";
import { BRAND_REGISTRY } from "@/lib/brands/registry";

export type BrandAssetStatus = "ok" | "review";

export type BrandAssetAuditRow = {
  id: string;
  name: string;
  logoPresent: boolean;
  svgValid: boolean;
  externalReferenceFree: boolean;
  componentPresent: boolean;
  pages: string[];
  legalNoticePresent: boolean;
  isPlaceholder: boolean;
  replacementTodo?: string;
  status: BrandAssetStatus;
};

export type BrandAssetsAuditReport = {
  generatedAt: string;
  rows: BrandAssetAuditRow[];
  summary: {
    total: number;
    ok: number;
    review: number;
    placeholders: number;
  };
};

const COMPONENT_FILES: Record<string, string> = {
  JamfLogo: "components/brands/JamfLogo.tsx",
  MicrosoftLogo: "components/brands/MicrosoftLogo.tsx",
  IntuneLogo: "components/brands/IntuneLogo.tsx",
  EntraLogo: "components/brands/EntraLogo.tsx",
  MicrosoftLearnLogo: "components/brands/MicrosoftLearnLogo.tsx",
};

function publicPath(relative: string): string {
  return path.join(process.cwd(), "public", relative.replace(/^\//, ""));
}

function fileExists(relativePublicPath: string): boolean {
  try {
    return fs.existsSync(publicPath(relativePublicPath));
  } catch {
    return false;
  }
}

function readPublicFile(relativePublicPath: string): string | null {
  try {
    return fs.readFileSync(publicPath(relativePublicPath), "utf8");
  } catch {
    return null;
  }
}

function validateLocalSvg(relativePublicPath: string): {
  svgValid: boolean;
  externalReferenceFree: boolean;
} {
  const source = readPublicFile(relativePublicPath);
  if (!source) return { svgValid: false, externalReferenceFree: false };

  const svgValid = /<svg[\s>]/.test(source) && /<\/svg>/.test(source);
  const externalReferenceFree =
    !/<image\b/i.test(source) &&
    !/<script\b/i.test(source) &&
    !/<foreignObject\b/i.test(source) &&
    !/(?:xlink:)?href=["']https?:\/\//i.test(source) &&
    !/url\(["']?https?:\/\//i.test(source);

  return { svgValid, externalReferenceFree };
}

function componentExists(componentName: string): boolean {
  const rel = COMPONENT_FILES[componentName];
  if (!rel) return componentName.includes("LogoIcon");
  return fs.existsSync(path.join(process.cwd(), rel));
}

export function runBrandAssetsAudit(): BrandAssetsAuditReport {
  const rows: BrandAssetAuditRow[] = BRAND_REGISTRY.map((brand) => {
    const logoPresent = fileExists(brand.logoPath);
    const { svgValid, externalReferenceFree } = validateLocalSvg(brand.logoPath);
    const componentPresent = componentExists(brand.componentName);
    const legalNoticePresent = brand.legalNoticeKey === "jamf" || brand.legalNoticeKey === "microsoft";

    const status: BrandAssetStatus =
      logoPresent && svgValid && externalReferenceFree && componentPresent && !brand.isPlaceholder
        ? "ok"
        : "review";

    return {
      id: brand.id,
      name: brand.name,
      logoPresent,
      svgValid,
      externalReferenceFree,
      componentPresent,
      pages: brand.pagePatterns,
      legalNoticePresent,
      isPlaceholder: brand.isPlaceholder,
      replacementTodo: brand.replacementTodo,
      status,
    };
  });

  const ok = rows.filter((r) => r.status === "ok").length;
  const review = rows.filter((r) => r.status === "review").length;
  const placeholders = rows.filter((r) => r.isPlaceholder).length;

  return {
    generatedAt: new Date().toISOString(),
    rows,
    summary: { total: rows.length, ok, review, placeholders },
  };
}
