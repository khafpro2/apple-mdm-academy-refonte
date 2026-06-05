import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { ButtonLink } from "@/components/ui";

const navLinks = [
  { href: "/parcours", label: "Parcours" },
  { href: "/videos", label: "Vidéos" },
  { href: "/resources", label: "Ressources" },
  { href: "/labs", label: "Labs pratiques" },
  { href: "/quiz", label: "Quiz & examens" },
  { href: "/dashboard", label: "Mon dashboard" },
  { href: "/pricing", label: "Tarifs" },
];

function AuthButtonsFallback() {
  return (
    <div className="flex items-center gap-2">
      <ButtonLink href="/auth/signup" size="sm">S&apos;inscrire</ButtonLink>
    </div>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <span className="text-xl" aria-hidden="true">🍏</span>
          <span className="hidden sm:inline">Apple MDM Academy</span>
          <span className="sm:hidden">MDM Academy</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden text-sm font-medium text-ink-secondary hover:text-ink md:block">
            Contact
          </Link>
          <Suspense fallback={<AuthButtonsFallback />}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-elevated">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold text-ink">
              <span aria-hidden="true">🍏</span>
              Apple MDM Academy
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
              Formation professionnelle Apple, Jamf Pro et Microsoft Intune en français.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Formation</p>
            <ul className="mt-3 space-y-2">
              {navLinks.slice(0, 4).map((link) => (
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
              <li><Link href="/tarifs" className="text-sm text-ink-secondary hover:text-ink">Tarifs</Link></li>
              <li><Link href="/contact" className="text-sm text-ink-secondary hover:text-ink">Contact</Link></li>
              <li><Link href="/auth/login" className="text-sm text-ink-secondary hover:text-ink">Connexion</Link></li>
              <li><Link href="/dashboard" className="text-sm text-ink-secondary hover:text-ink">Mon dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border-light pt-4 text-xs text-ink-tertiary md:flex-row">
          <p>© 2026 Apple MDM Academy. Tous droits réservés.</p>
          <p>Supabase · Vercel</p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
