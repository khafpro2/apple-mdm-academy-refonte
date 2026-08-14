import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/layout";
import { SupabaseStatusBanner } from "@/components/layout/supabase-status-banner";
import { FreePlatformBanner } from "@/components/layout/free-platform-banner";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { MarketingHeader } from "@/components/landing/marketing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { CertificationsSection } from "@/components/landing/certifications-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { getVisibleTracks } from "@/lib/data";
import { TrackCard } from "@/components/cards";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type Props = { locale?: Locale };

function AuthButtonsFallback() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-medium text-ink-secondary hover:text-ink"
      >
        Connexion
      </Link>
      <ButtonLink href="/auth/signup" size="sm">
        S&apos;inscrire
      </ButtonLink>
    </div>
  );
}

export function LandingPage({ locale = "fr" }: Props) {
  const dict = getDictionary(locale);
  const visibleTracks = getVisibleTracks();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SupabaseStatusBanner />
      <FreePlatformBanner />
      <MarketingHeader
        authSlot={
          <Suspense fallback={<AuthButtonsFallback />}>
            <AuthButtons />
          </Suspense>
        }
      />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <HeroSection dict={dict} />
        <CertificationsSection />
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading
              label="Parcours"
              title="Tous les parcours disponibles"
              description={`${visibleTracks.length} parcours professionnels — Apple, Jamf et Intune pour les environnements Apple.`}
            />
            <Link href="/parcours" className="shrink-0 text-sm font-semibold text-accent hover:underline">
              Catalogue complet →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        </section>
        <StatsSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection dict={dict} />
        {locale !== "fr" && (
          <div className="border-t border-border-light py-4 text-center text-sm text-ink-tertiary">
            <ButtonLink href="/" variant="ghost" size="sm">
              Version française
            </ButtonLink>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
