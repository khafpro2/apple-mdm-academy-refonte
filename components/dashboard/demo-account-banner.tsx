import { Badge } from "@/components/ui";

export function DemoAccountBanner() {
  return (
    <div className="mb-8 flex flex-wrap items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-950">
      <Badge className="shrink-0 border-amber-300 bg-amber-100 text-amber-950">Mode démonstration</Badge>
      <div>
        <p className="font-semibold">Compte lecture seule</p>
        <p className="mt-1 text-amber-900/90">
          Progression, badges et activités sont préremplis pour tester le dashboard sans paiement ni compte admin.
          Les quiz, labs et modifications ne sont pas enregistrés.
        </p>
      </div>
    </div>
  );
}

export function DemoModeBadge() {
  return (
    <Badge className="border-amber-300 bg-amber-100 text-amber-950">Mode démonstration</Badge>
  );
}
