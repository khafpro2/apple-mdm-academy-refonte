import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Apple MDM Academy — Formation Apple, Jamf & Intune",
    template: "%s | Apple MDM Academy",
  },
  description:
    "Plateforme professionnelle de formation Apple MDM, Jamf Pro et Microsoft Intune en français. Cours, labs, quiz et examens blancs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
