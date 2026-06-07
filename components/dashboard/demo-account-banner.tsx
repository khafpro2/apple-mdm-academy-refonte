export function DemoAccountBanner() {
  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Mode démonstration</p>
      <p className="mt-1 text-amber-900/90">
        Compte lecture seule — progression, badges et activités sont préremplis pour la démo. Les quiz, labs et
        modifications ne sont pas enregistrés.
      </p>
    </div>
  );
}
