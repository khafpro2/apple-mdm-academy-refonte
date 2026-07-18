import { JamfLegalNotice } from "@/components/brands/JamfLegalNotice";

/** Mention légale Apple — plateforme indépendante */
export function AppleLegalNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-ink-tertiary ${className}`}>
      Apple, Apple Business Manager, macOS, iOS, iPadOS et tvOS sont des marques d&apos;Apple Inc.
      Apple MDM Academy est une plateforme indépendante et n&apos;est pas affiliée à Apple Inc.
    </p>
  );
}

/** Mention légale Microsoft — plateforme indépendante */
export function MicrosoftLegalNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-ink-tertiary ${className}`}>
      Microsoft, Microsoft Intune, Microsoft Entra ID et Microsoft Learn sont des marques de Microsoft
      Corporation. Apple MDM Academy est une plateforme indépendante et n&apos;est pas affiliée à Microsoft.
    </p>
  );
}

/** Mentions légales marques tierces (Apple + Jamf + Microsoft) */
export function BrandLegalNotices({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <AppleLegalNotice />
      <JamfLegalNotice />
      <MicrosoftLegalNotice />
    </div>
  );
}
