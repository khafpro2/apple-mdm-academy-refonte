import { JamfLegalNotice } from "@/components/brands/JamfLegalNotice";

/** Mention légale Microsoft — plateforme indépendante */
export function MicrosoftLegalNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-ink-tertiary ${className}`}>
      Microsoft, Microsoft Intune, Microsoft Entra ID et Microsoft Learn sont des marques de Microsoft
      Corporation. Apple MDM Academy est une plateforme indépendante et n&apos;est pas affiliée à Microsoft.
    </p>
  );
}

/** Mentions légales marques tierces (Jamf + Microsoft) */
export function BrandLegalNotices({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <JamfLegalNotice />
      <MicrosoftLegalNotice />
    </div>
  );
}
