import Link from "next/link";

const links = [
  { href: "/parcours", label: "Parcours" },
  { href: "/labs", label: "Labs" },
  { href: "/examens", label: "Examens" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between rounded-full border border-zinc-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
      <Link href="/" className="text-lg font-semibold">
        🍏 Apple MDM Academy
      </Link>
      <div className="hidden gap-6 text-sm text-zinc-600 md:flex">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <Link href="/parcours" className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
        Commencer
      </Link>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row lg:px-8">
        <p>© 2026 Apple MDM Academy — Formation Apple, Jamf & Intune</p>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-zinc-900">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
