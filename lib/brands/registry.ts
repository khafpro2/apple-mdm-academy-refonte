import { JAMF_BRAND } from "@/lib/brands/jamf";
import { ENTRA_BRAND, ENTRA_LABEL } from "@/lib/brands/entra";
import { INTUNE_BRAND, INTUNE_LABEL } from "@/lib/brands/intune";
import { MICROSOFT_BRAND, MICROSOFT_LABEL } from "@/lib/brands/microsoft";
import {
  MICROSOFT_LEARN_BRAND,
  MICROSOFT_LEARN_LABEL,
} from "@/lib/brands/microsoft-learn";

export type BrandRegistryEntry = {
  id: string;
  name: string;
  logoPath: string;
  componentName: string;
  legalNoticeKey: "jamf" | "microsoft" | null;
  pagePatterns: string[];
  isPlaceholder: boolean;
};

export const BRAND_REGISTRY: BrandRegistryEntry[] = [
  {
    id: "apple",
    name: "Apple",
    logoPath: "/logos/apple.svg",
    componentName: "LogoIcon (apple)",
    legalNoticeKey: null,
    pagePatterns: ["/parcours/apple", "/certifications/apple"],
    isPlaceholder: false,
  },
  {
    id: "jamf",
    name: "Jamf",
    logoPath: JAMF_BRAND.logo,
    componentName: "JamfLogo",
    legalNoticeKey: "jamf",
    pagePatterns: ["/parcours/jamf", "/examens/jamf", "/admin/jamf-content-status", "/videos"],
    isPlaceholder: false,
  },
  {
    id: "microsoft",
    name: MICROSOFT_LABEL,
    logoPath: MICROSOFT_BRAND.logo,
    componentName: "MicrosoftLogo",
    legalNoticeKey: "microsoft",
    pagePatterns: ["/cours/azure-for-apple-admins", "/parcours/azure-for-apple-admins"],
    isPlaceholder: true,
  },
  {
    id: "intune",
    name: INTUNE_LABEL,
    logoPath: INTUNE_BRAND.logo,
    componentName: "IntuneLogo",
    legalNoticeKey: "microsoft",
    pagePatterns: [
      "/parcours/intune-mac",
      "/cours/intune-mac",
      "/examens/intune-apple",
      "/resources/intune-apns-guide",
      "/resources/intune-platform-sso-guide",
      "/resources/intune-defender-guide",
      "/videos",
    ],
    isPlaceholder: true,
  },
  {
    id: "entra",
    name: ENTRA_LABEL,
    logoPath: ENTRA_BRAND.logo,
    componentName: "EntraLogo",
    legalNoticeKey: "microsoft",
    pagePatterns: [
      "/cours/platform-sso",
      "/cours/azure-for-apple-admins",
      "/parcours/azure-for-apple-admins",
    ],
    isPlaceholder: true,
  },
  {
    id: "microsoft-learn",
    name: MICROSOFT_LEARN_LABEL,
    logoPath: MICROSOFT_LEARN_BRAND.logo,
    componentName: "MicrosoftLearnLogo",
    legalNoticeKey: "microsoft",
    pagePatterns: [
      "/resources/intune-apns-guide",
      "/resources/intune-ade-guide",
      "/resources/intune-platform-sso-guide",
      "/resources/intune-defender-guide",
      "/cours/intune-mac",
    ],
    isPlaceholder: true,
  },
];
