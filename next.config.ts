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

  // ── Logging (production) ───────────────────────────────────────────────────
  logging: {
    fetches: { fullUrl: false },
  },

  // ── Redirects SEO ─────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: "/pricing", destination: "/tarifs", permanent: false },
      { source: "/home",    destination: "/",       permanent: true  },
      { source: "/blog",    destination: "/resources", permanent: true },
    ];
  },

  // ── Security & Performance headers ────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",            value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",          value: "camera=(), microphone=(), geolocation=()" },
          // Strict-Transport-Security (HSTS) — uniquement si domaine personnalisé configuré
          // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Cache long pour les images publiques
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Pas de cache sur les routes API
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default config;
