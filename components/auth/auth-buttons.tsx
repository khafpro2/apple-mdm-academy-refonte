import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { checkIsAdmin } from "@/lib/supabase/admin";
import { isDemoSession } from "@/lib/demo/demo-session.server";
import { ButtonLink } from "@/components/ui";

export async function AuthButtons() {
  const user = await getUser();
  const demoSession = !user ? await isDemoSession() : false;

  if (user || demoSession) {
    const name = demoSession
      ? "Apprenant Démo"
      : user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Compte";
    const isAdmin = user ? await checkIsAdmin(user.id, user.email) : false;

    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden text-sm font-medium text-accent hover:underline md:block"
          >
            Admin
          </Link>
        )}
        <Link
          href="/dashboard"
          className="hidden text-sm font-medium text-ink-secondary hover:text-ink sm:block"
        >
          {name}
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-border-light px-4 py-2 text-sm font-medium text-ink-secondary transition hover:bg-surface hover:text-ink"
          >
            Déconnexion
          </button>
        </form>
      </div>
    );
  }

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
