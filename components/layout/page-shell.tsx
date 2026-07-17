import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SupabaseStatusBanner } from "@/components/layout/supabase-status-banner";
import { FreePlatformBanner } from "@/components/layout/free-platform-banner";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { ButtonLink } from "@/components/ui";
import { BrandLegalNotices } from "@/components/brands/BrandLegalNotices";
import { AcademyLogo } from "@/components/layout/academy-logo";

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

const footerLinks = [
  { href: "/parcours", label: "Parcours" },
  { href: "/cours", label: "Cours" },
  { href: "/examens", label: "Examens" },
  { href: "/labs", label: "Labs pratiques" },
  { href: "/videos", label: "Vidéos" },
  { href: "/resources", label: "Ressources" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-elevated" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <AcademyLogo variant="full" size="sm" className="inline-flex" />
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
              Formation indépendante Apple MDM, Jamf Pro et Microsoft Intune en français.
              Non affiliée à Apple Inc., Jamf ou Microsoft.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Formation</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Plateforme</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/certifications" className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/support" className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link href="/status" className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Statut
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="inline-flex min-h-10 items-center text-sm text-ink-secondary hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <BrandLegalNotices className="mt-6 space-y-2 border-t border-border-light pt-4 text-center md:text-left" />
        <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-ink-tertiary md:flex-row">
          <p>© 2026 Apple MDM Academy. Tous droits réservés.</p>
          <nav aria-label="Liens légaux" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Confidentialité</Link>
            <Link href="/terms" className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">CGU</Link>
            <Link href="/legal" className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Mentions légales</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/** @deprecated Utiliser AppShell via PageShell */
export function Nav() {
  return null;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      authSlot={
        <Suspense fallback={<AuthButtonsFallback />}>
          <AuthButtons />
        </Suspense>
      }
      banners={
        <>
          <SupabaseStatusBanner />
          <FreePlatformBanner />
        </>
      }
      footer={<Footer />}
    >
      {children}
    </AppShell>
  );
}
