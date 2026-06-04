import { Nav, Footer } from "@/components/nav";
import { TrackCard, PageHeader } from "@/components/cards";
import { tracks } from "@/lib/data";

export default function ParcoursPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <PageHeader
            label="Parcours certifiants"
            title="Tous les parcours"
            description="Cours structurés, quiz, labs et examens blancs pour chaque certification Apple, Jamf et Intune."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
