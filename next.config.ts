import type { NextConfig } from "next";

const config: NextConfig = {
  // Optimisation des images
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
  // Compression
  compress: true,
  // Headers de performance et sécurité
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache long pour les assets statiques Next.js
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache pour les images publiques
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  // Redirects SEO
  async redirects() {
    return [
      { source: "/pricing", destination: "/tarifs", permanent: false },
      { source: "/home", destination: "/", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
    ];
  },
  // Expérimental
  experimental: {
    optimizePackageImports: [
      "@/components/ui",
      "@/components/cards",
      "@/components/layout",
    ],
  },
};

export default config;
