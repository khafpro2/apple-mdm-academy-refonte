import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apple MDM Academy",
    short_name: "MDM Academy",
    description: "Formation indépendante Apple MDM, Jamf Pro et Microsoft Intune en français.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#101827",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logos/mdm-academy.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
