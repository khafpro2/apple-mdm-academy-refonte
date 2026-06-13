import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { ButtonLink } from "@/components/ui";
import { AcademyLogo } from "@/components/layout/academy-logo";
import { BrandLegalNotices } from "@/components/brands/BrandLegalNotices";

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
  { href: "/videos", label: "Vidéos" },
  { href: "/resources", label: "Ressources" },
  { href: "/labs", label: "Labs pratiques" },
  { href: "/examens", label: "Examens" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-elevated" role="contentinfo">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <AcademyLogo />
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
              Formation professionnelle Apple, Jamf Pro et Microsoft Intune en français.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Formation</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-secondary hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Plateforme</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/pricing" className="text-sm text-ink-secondary hover:text-ink">Tarifs</Link></li>
              <li><Link href="/enterprise" className="text-sm text-ink-secondary hover:text-ink">Entreprise</Link></li>
              <li><Link href="/training-center" className="text-sm text-ink-secondary hover:text-ink">Centre de formation</Link></li>
              <li><Link href="/support" className="text-sm text-ink-secondary hover:text-ink">Centre d&apos;aide</Link></li>
              <li><Link href="/status" className="text-sm text-ink-secondary hover:text-ink">Statut</Link></li>
              <li><Link href="/auth/login" className="text-sm text-ink-secondary hover:text-ink">Connexion</Link></li>
              <li><Link href="/api-docs" className="text-sm text-ink-secondary hover:text-ink">API</Link></li>
            </ul>
          </div>
        </div>
        <BrandLegalNotices className="mt-6 space-y-2 border-t border-border-light pt-4 text-center md:text-left" />
        <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-ink-tertiary md:flex-row">
          <p>© 2026 Apple MDM Academy. Tous droits réservés.</p>
          <nav aria-label="Liens légaux" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-ink">Confidentialité</Link>
            <Link href="/terms" className="hover:text-ink">CGU</Link>
            <Link href="/legal" className="hover:text-ink">Mentions légales</Link>
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
      footer={<Footer />}
    >
      {children}
    </AppShell>
  );
}
