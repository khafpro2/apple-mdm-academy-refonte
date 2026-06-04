import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apple MDM Academy — Apple, Jamf & Intune",
  description: "Formation Apple MDM, Jamf Pro, Intune, Apple Device Support et Apple IT Professional en français.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
