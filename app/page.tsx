import { LandingPage } from "@/components/landing/landing-page";
import { organizationJsonLd } from "@/lib/seo/course-schema";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Apple MDM Academy — Formation Apple, Jamf Pro & Intune",
  description:
    "Plateforme de formation certifiante pour administrateurs Apple : Jamf 100/200, Apple Certified IT Pro, Microsoft Intune. Quiz, examens blancs, labs pratiques.",
  path: "/",
});

export default function HomePage() {
  const orgLd = organizationJsonLd();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <LandingPage locale="fr" />
    </>
  );
}
