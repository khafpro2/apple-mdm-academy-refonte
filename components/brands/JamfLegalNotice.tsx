/** Mention légale Jamf® — plateforme indépendante */
export function JamfLegalNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-ink-tertiary ${className}`}>
      Jamf® est une marque déposée de Jamf Software, LLC.
      <br className="sm:hidden" />
      {" "}
      Apple MDM Academy est une plateforme indépendante.
    </p>
  );
}
