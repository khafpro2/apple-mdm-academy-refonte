import { SUPABASE_SETUP_VARIABLES } from "@/lib/supabase/env-validation";

export function SupabaseSetupGuide() {
  return (
    <section
      className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-left"
      aria-labelledby="supabase-setup-title"
    >
      <h2 id="supabase-setup-title" className="text-lg font-bold text-amber-950">
        Supabase n&apos;est pas configuré correctement.
      </h2>
      <p className="mt-2 text-sm text-amber-900/90">
        Les variables d&apos;environnement contiennent des placeholders ou des valeurs invalides. Remplacez-les par
        les credentials de votre projet Supabase.
      </p>

      <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-amber-950">
        <li>Ouvrir Supabase</li>
        <li>Project Settings</li>
        <li>API</li>
        <li>
          Copier :
          <ul className="mt-1 list-disc pl-5 text-amber-900/90">
            <li>Project URL</li>
            <li>anon public key</li>
          </ul>
        </li>
        <li>Ouvrir Vercel</li>
        <li>Settings</li>
        <li>Environment Variables</li>
      </ol>

      <div className="mt-5 rounded-xl border border-amber-200 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Variables attendues</p>
        <ul className="mt-3 space-y-2 font-mono text-xs text-amber-950">
          {SUPABASE_SETUP_VARIABLES.map((variable) => (
            <li key={variable.name}>
              <span className="font-semibold">{variable.name}=</span>
              {variable.example}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-amber-900/80">
        En local, copiez les mêmes valeurs dans <code className="rounded bg-white/80 px-1">.env.local</code> puis
        redéployez sur Vercel. Diagnostic détaillé réservé aux admins :{" "}
        <code className="rounded bg-white/80 px-1">/admin/supabase-diagnostics</code>
      </p>
    </section>
  );
}
