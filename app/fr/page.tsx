import { LandingPage } from "@/components/landing/landing-page";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Accueil",
  description: "Plateforme SaaS de formation Apple MDM — certifications Apple, Jamf et Intune.",
  path: "/fr",
});

export default function FrenchHomePage() {
  return <LandingPage locale="fr" />;
}
