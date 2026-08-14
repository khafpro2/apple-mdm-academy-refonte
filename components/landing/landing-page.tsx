import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/layout";
import { SupabaseStatusBanner } from "@/components/layout/supabase-status-banner";
import { FreePlatformBanner } from "@/components/layout/free-platform-banner";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { MarketingHeader } from "@/components/landing/marketing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { AppleSection } from "@/components/landing/apple-section";
import { JamfSection } from "@/components/landing/jamf-section";
import { IntuneSection } from "@/components/landing/intune-section";
import { CertificationsSection } from "@/components/landing/certifications-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { ButtonLink } from "@/components/ui";
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

function QuizExamensBand() {
  return (
    <section className="border-t border-border-light bg-surface-elevated">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Quiz &amp; Examens blancs</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-secondary">
          Entraînez-vous avec des quiz dynamiques et des examens blancs chronométrés, alignés sur les certifications
          Apple, Jamf et Microsoft.
        </p>
        <ButtonLink href="/quiz" variant="secondary" size="lg" className="mt-6">
          Voir les quiz
        </ButtonLink>
      </div>
    </section>
  );
}

function LabsBand() {
  return (
    <section className="border-t border-border-light bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16 text-center lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Labs pratiques</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-secondary">
          Manipulez de vrais scénarios MDM en environnement guidé, sans risque pour votre flotte.
        </p>
        <ButtonLink href="/labs" variant="secondary" size="lg" className="mt-6">
          Explorer les Labs
        </ButtonLink>
      </div>
    </section>
  );
}

export function LandingPage({ locale = "fr" }: Props) {
  const dict = getDictionary(locale);

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
        <HeroSection />
        <AppleSection />
        <JamfSection />
        <IntuneSection />
        <StatsSection />
        <CertificationsSection />
        <QuizExamensBand />
        <LabsBand />
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
