import type { NextConfig } from "next";

const config: NextConfig = {
  // ── Images ─────────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },

  // ── Performance ────────────────────────────────────────────────────────────
  compress: true,

  // ── Fix bundle size — exclure public/ du tracing des routes admin ──────────
  // La route admin/brand-assets utilise fs.existsSync sur public/ ce qui
  // fait gonfler le bundle à >300MB. On exclut les assets publics du tracing.
  outputFileTracingExcludes: {
    "/admin/brand-assets": ["./public/**/*", "./publique/**/*"],
    "/admin/analytics": ["./public/**/*", "./publique/**/*"],
    "/admin/content-audit": ["./public/**/*", "./publique/**/*"],
    "/admin/certification-audit": ["./public/**/*", "./publique/**/*"],
    "/admin/media-readiness": ["./public/**/*", "./publique/**/*"],
    "/admin/jamf-content-status": ["./public/**/*", "./publique/**/*"],
    "/admin": ["./public/**/*", "./publique/**/*"],
  },

  // ── Logging (production) ───────────────────────────────────────────────────
  logging: {
    fetches: { fullUrl: false },
  },

  // ── Redirects SEO ─────────────────────────────────────────────────────────
  async redirects() {
    return [
      // /tarifs → /pricing (app/tarifs/page.tsx) : ne pas ajouter l'inverse ici (boucle)
      { source: "/home", destination: "/", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
    ];
  },

  // ── Security & Performance headers ────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default config;
