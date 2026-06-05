import { LandingPage } from "@/components/landing/landing-page";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Home",
  description: "Apple MDM SaaS training platform — Apple, Jamf and Intune certifications.",
  path: "/en",
});

export default function EnglishHomePage() {
  return <LandingPage locale="en" />;
}
