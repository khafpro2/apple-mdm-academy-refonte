import type { LogoName } from "@/components/ui/logo-icon";

export const SIDEBAR_STORAGE_KEY = "apple-mdm-sidebar-collapsed";

export const SIDEBAR_WIDTH_OPEN = 280;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: LogoName;
  children?: SidebarNavItem[];
};

export const sidebarMainNav: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Cours", href: "/cours", icon: "resource" },
  {
    label: "Parcours",
    href: "/parcours",
    icon: "apple",
    children: [
      { label: "Apple Business Manager", href: "/parcours/apple-it-professional", icon: "apple" },
      { label: "Microsoft Intune Apple", href: "/parcours/intune-mac", icon: "intune" },
      { label: "Jamf 100", href: "/parcours/jamf-100", icon: "jamf" },
      { label: "Jamf 200", href: "/parcours/jamf-200", icon: "jamf" },
      { label: "Apple Security", href: "/certifications/apple-certified-it-professional", icon: "shield" },
      { label: "Apple Enterprise", href: "/parcours/apple-enterprise-expert", icon: "apple" },
      { label: "Apple Enterprise Architect", href: "/parcours/apple-enterprise-architect", icon: "apple" },
    ],
  },
  {
    label: "Certifications",
    href: "/certifications",
    icon: "certificate",
    children: [
      {
        label: "Apple IT Professional",
        href: "/certifications/apple-certified-it-professional",
        icon: "apple",
      },
      { label: "Jamf 100", href: "/examens/jamf-100", icon: "jamf" },
      { label: "Jamf 200", href: "/examens/jamf-200", icon: "jamf" },
      { label: "Intune Apple", href: "/examens/intune-apple", icon: "intune" },
    ],
  },
  { label: "Labs pratiques", href: "/labs", icon: "lab" },
  { label: "Quiz", href: "/quiz", icon: "certificate" },
  { label: "Examens", href: "/examens", icon: "shield" },
  { label: "Vidéos", href: "/videos", icon: "video" },
  { label: "Ressources", href: "/resources", icon: "resource" },
];
