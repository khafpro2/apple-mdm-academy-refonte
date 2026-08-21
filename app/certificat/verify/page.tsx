import { PageShell } from "@/components/layout";
import { Breadcrumb, Badge } from "@/components/ui";
import { lookupPublicCertificate } from "@/lib/certificates/public-lookup";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Vérification de certificat",
  description: "Vérifiez l'authenticité d'un certificat Apple MDM Academy — score, date d'obtention et titulaire.",
  path: "/certificat/verify",
});

export default async function VerifyCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const data = id ? await lookupPublicCertificate(id) : null;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-6 py-16">
        <Breadcrumb items={[{ label: "Vérification certificat" }]} />

        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm text-center">
          {!id && (
            <>
              <h1 className="text-xl font-bold text-ink">Vérifier un certificat</h1>
              <p className="mt-3 text-sm text-ink-secondary">
                Scannez le QR code sur le certificat PDF ou ajoutez{" "}
                <code className="rounded bg-surface px-1">?id=</code> à l&apos;URL.
              </p>
            </>
          )}

          {id && !data && (
            <>
              <p className="text-4xl">❌</p>
              <h1 className="mt-4 text-xl font-bold text-ink">Certificat non valide</h1>
              <p className="mt-2 text-sm text-ink-secondary">Identifiant introuvable ou examen non réussi.</p>
            </>
          )}

          {data && (
            <>
              <p className="text-4xl">✅</p>
              <h1 className="mt-4 text-xl font-bold text-ink">Certificat authentique</h1>
              <p className="mt-4 text-lg font-semibold text-ink">{data.holderName}</p>
              <p className="mt-1 text-sm text-ink-secondary">{data.examTitle}</p>
              <Badge variant="accent" className="mt-4">{data.score}%</Badge>
              <p className="mt-4 text-xs text-ink-tertiary">
                Délivré le{" "}
                {new Date(data.completedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2 font-mono text-[10px] text-ink-tertiary">ID {data.resultId}</p>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
