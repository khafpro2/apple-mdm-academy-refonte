import { MicrosoftLearnLogo } from "@/components/brands/MicrosoftLearnLogo";
import { MICROSOFT_LEARN_URL } from "@/lib/brands/microsoft-learn";

type MicrosoftLearnReferenceProps = {
  href?: string;
  description?: string;
  className?: string;
};

/** Bloc de référence Microsoft Learn — lien externe, contenu pédagogique original sur la plateforme */
export function MicrosoftLearnReference({
  href = MICROSOFT_LEARN_URL,
  description = "Documentation officielle Microsoft pour approfondir les procédures et bonnes pratiques.",
  className = "",
}: MicrosoftLearnReferenceProps) {
  return (
    <aside
      className={`rounded-2xl border border-blue-200 bg-blue-50/80 p-5 ${className}`}
      aria-labelledby="microsoft-learn-ref-title"
    >
      <div className="flex flex-wrap items-center gap-3">
        <MicrosoftLearnLogo size={28} alt="Microsoft Learn" />
        <h2 id="microsoft-learn-ref-title" className="text-base font-bold text-ink">
          Référence officielle Microsoft Learn
        </h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{description}</p>
      <p className="mt-2 text-xs text-ink-tertiary">
        Apple MDM Academy propose du contenu pédagogique original en français. Microsoft Learn sert de source
        de référence — nous ne sommes pas affiliés à Microsoft.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0078D4] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0078D4]"
      >
        Consulter sur Microsoft Learn
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
