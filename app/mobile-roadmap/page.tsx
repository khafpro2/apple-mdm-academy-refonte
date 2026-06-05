import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Roadmap mobile",
  description: "Architecture future de l'application mobile Expo/React Native pour Apple MDM Academy.",
  path: "/mobile-roadmap",
});

const MODULES = [
  {
    title: "Authentification",
    desc: "Supabase Auth avec OAuth, biométrie (Face ID / Touch ID) et refresh token sécurisé.",
    stack: "Expo SecureStore + Supabase JS",
  },
  {
    title: "Progression",
    desc: "Sync offline-first de la progression parcours, modules complétés et badges.",
    stack: "React Query + AsyncStorage",
  },
  {
    title: "Vidéos",
    desc: "Lecteur natif avec reprise de lecture, téléchargement offline (Pro) et sous-titres.",
    stack: "expo-av + CDN Vercel Blob",
  },
  {
    title: "Examens",
    desc: "Mode examen avec timer, navigation question par question et soumission sync.",
    stack: "Shared quiz engine (monorepo package)",
  },
  {
    title: "Notifications",
    desc: "Rappels révision, nouveaux contenus, résultats examens et streaks.",
    stack: "Expo Notifications + push backend",
  },
];

export default function MobileRoadmapPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Mobile"
          title="Application mobile — architecture future"
          description="Stack recommandée : Expo (React Native) pour iOS et Android — partage de logique avec le web Next.js."
          align="center"
        />
        <Card className="mt-8 bg-gradient-to-br from-indigo-600/10 to-blue-600/10">
          <h3 className="font-bold text-ink">Stack proposée</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
            <li><strong>Framework :</strong> Expo SDK 52+ (React Native)</li>
            <li><strong>Navigation :</strong> Expo Router (file-based, aligné App Router)</li>
            <li><strong>Backend :</strong> API v1 existante + Supabase realtime</li>
            <li><strong>Monorepo :</strong> packages/shared (types, quiz logic, i18n)</li>
            <li><strong>CI/CD :</strong> EAS Build + TestFlight / Play Internal</li>
          </ul>
        </Card>
        <div className="mt-10 space-y-4">
          {MODULES.map((m) => (
            <Card key={m.title}>
              <h3 className="font-bold text-ink">{m.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{m.desc}</p>
              <p className="mt-2 text-xs font-medium text-accent">{m.stack}</p>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink-tertiary">
          <Link href="/roadmap" className="text-accent hover:underline">← Retour à la roadmap V2</Link>
        </p>
      </div>
    </PageShell>
  );
}
