import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/site-config";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1d1d1f 0%, #2d2d30 50%, #0071e3 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🍏</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.9, maxWidth: 800, lineHeight: 1.4 }}>
          Formation Apple MDM, Jamf Pro & Microsoft Intune
        </div>
        <div style={{ fontSize: 20, marginTop: 40, opacity: 0.7 }}>
          Cours · Labs · Examens blancs · Certificats
        </div>
      </div>
    ),
    { ...size }
  );
}
