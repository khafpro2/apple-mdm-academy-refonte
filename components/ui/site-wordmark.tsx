/**
 * SiteWordmark — Logo texte Apple MDM Academy
 * Affiche "MDM" en gras suivi de "ACADEMY" en accent (bleu),
 * sur deux lignes, avec l'icône Apple à gauche.
 * 
 * Utilisé dans la sidebar (état expanded) et les pages de la landing.
 */

type SiteWordmarkProps = {
  className?: string;
};

export function SiteWordmark({ className = "" }: SiteWordmarkProps) {
  return (
    <span
      className={`flex flex-col leading-none select-none ${className}`}
      aria-label="Apple MDM Academy"
    >
      <span className="text-sm font-black tracking-tight text-ink">MDM</span>
      <span className="text-[11px] font-bold tracking-widest text-accent uppercase">ACADEMY</span>
    </span>
  );
}
