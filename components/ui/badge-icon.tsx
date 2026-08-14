import type { BadgeIconName } from "@/lib/navigation/badge-icon-names";

const DEFAULT_ALT: Record<BadgeIconName, string> = {
  building: "Entreprise",
  device: "Appareil",
  bell: "Notification",
  box: "Déploiement",
  "id-card": "Identifiant",
  key: "Sécurité / SSO",
  cloud: "Cloud",
  "graduation-cap": "Formation",
  target: "Objectif",
  gear: "Configuration",
  scroll: "Script",
  "shield-check": "Sécurité validée",
  refresh: "Mise à jour",
  "apple-mark": "Apple",
  trophy: "Réussite",
  rocket: "Avancé",
  crane: "Architecture",
  plug: "Intégration",
  landmark: "Architecte",
  "clipboard-check": "Conformité",
  "check-circle": "Validé",
  flask: "Lab",
  bolt: "Performance",
  star: "Expert",
  flame: "Série",
};

type BadgeIconProps = {
  name: BadgeIconName;
  size?: number;
  className?: string;
  alt?: string;
};

function Svg({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const icons: Record<BadgeIconName, (size: number) => React.ReactNode> = {
  building: (size) => (
    <Svg size={size}>
      <rect x="5" y="3" width="10" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <rect x="15" y="9" width="6" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1M18 13h1M18 17h1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  device: (size) => (
    <Svg size={size}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11 18.5h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  bell: (size) => (
    <Svg size={size}>
      <path
        d="M12 3.5c-2.5 0-4.5 2-4.5 4.5v3l-1.5 3.5h12l-1.5-3.5V8c0-2.5-2-4.5-4.5-4.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M10 17.5a2 2 0 004 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  box: (size) => (
    <Svg size={size}>
      <path d="M3.5 8l8.5-4 8.5 4-8.5 4-8.5-4z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M3.5 8v8l8.5 4 8.5-4V8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 12v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  "id-card": (size) => (
    <Svg size={size}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8.5" cy="11" r="1.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 15.5c.5-1.5 2-2.2 3-2.2s2.5.7 3 2.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.5 10h4M14.5 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  key: (size) => (
    <Svg size={size}>
      <circle cx="8" cy="8" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11 11l8.5 8.5M16.5 15l2.25 2.25M14 17.5l1.75 1.75" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  cloud: (size) => (
    <Svg size={size}>
      <path
        d="M7 17.5a4 4 0 01-.5-7.97A5 5 0 0116.4 8.1 4.25 4.25 0 0116.5 17.5H7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  "graduation-cap": (size) => (
    <Svg size={size}>
      <path d="M12 4l9.5 4.5L12 13 2.5 8.5 12 4z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M6.5 10.7v4.3c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M21 9v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  target: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </Svg>
  ),
  gear: (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4M17.8 17.8l-1.4-1.4M7.6 7.6L6.2 6.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  ),
  scroll: (size) => (
    <Svg size={size}>
      <path d="M6 4h9a2.5 2.5 0 012.5 2.5V18a2.5 2.5 0 01-2.5 2.5H8.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M6 4a2 2 0 00-2 2v12a2.5 2.5 0 002.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 9h5M9 12.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  "shield-check": (size) => (
    <Svg size={size}>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  refresh: (size) => (
    <Svg size={size}>
      <path d="M4.5 12a7.5 7.5 0 0112.6-5.5M19.5 12a7.5 7.5 0 01-12.6 5.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M17 3.5V7h-3.5M7 20.5V17h3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  "apple-mark": (size) => (
    <Svg size={size}>
      <path
        d="M15.3 4.3c0 1-.4 1.9-1 2.6-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.8-1.2z"
        fill="currentColor"
      />
      <path
        d="M18.8 17.2c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.3 0-1.7-.9-3.5-.9-1.8 0-2.2.9-3.5.9-1.5 0-2.6-1.5-3.5-2.9-2.4-3.7-2.7-8-1.2-10.3.9-1.3 2.4-2.2 3.9-2.2 1.7 0 2.6.9 3.5.9.9 0 2.2-.9 3.9-.9.9 0 3 .3 4.3 2.5-1.4.9-2.4 2.3-2.4 4.2 0 2.2 1.4 3.1 2.4 3.9-.4 0 0 .1-.1.1z"
        fill="currentColor"
      />
    </Svg>
  ),
  trophy: (size) => (
    <Svg size={size}>
      <path d="M7 4h10v4.5a5 5 0 01-10 0V4z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M7 5.5H4.5A1.5 1.5 0 003 7v.5a3 3 0 003 3M17 5.5h2.5A1.5 1.5 0 0121 7v.5a3 3 0 01-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13.5v3M9 20.5h6M9.5 20.5c0-2 1-3 2.5-3s2.5 1 2.5 3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  rocket: (size) => (
    <Svg size={size}>
      <path
        d="M12 3.5c2.7 1.3 4.5 4.4 4.5 8 0 2-1 4-1 4H8.5s-1-2-1-4c0-3.6 1.8-6.7 4.5-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 15.5L6 19M15.5 15.5L18 19M9.5 19h5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  crane: (size) => (
    <Svg size={size}>
      <path d="M5 20.5V6l11 5.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 11.5v4.5M2.5 20.5h19" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M13 11.2v-1.7a2 2 0 114 0v.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  plug: (size) => (
    <Svg size={size}>
      <path d="M9 3.5v4M15 3.5v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M6.5 7.5h11v3a5.5 5.5 0 01-11 0v-3z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M12 16v2.5M12 18.5c-2 0-3.5 1-3.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  landmark: (size) => (
    <Svg size={size}>
      <path d="M3 9.5L12 4l9 5.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M4.5 9.5v9M9 9.5v9M15 9.5v9M19.5 9.5v9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 18.5h18M3 21h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  "clipboard-check": (size) => (
    <Svg size={size}>
      <rect x="5" y="4.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 4.5V3.5a1 1 0 011-1h4a1 1 0 011 1v1" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M9 13l2 2 4-4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  "check-circle": (size) => (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8.5 12.3l2.4 2.4L15.8 9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  flask: (size) => (
    <Svg size={size}>
      <path d="M10 3h4M10.5 3v6l-5 9a2 2 0 001.8 3h9.4a2 2 0 001.8-3l-5-9V3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.2 15h7.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  ),
  bolt: (size) => (
    <Svg size={size}>
      <path d="M13 3L5.5 13.5H11L10 21l8-11h-5.5L13 3z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  star: (size) => (
    <Svg size={size}>
      <path
        d="M12 3.5l2.55 5.4 5.95.75-4.4 4.15 1.15 5.9L12 16.9l-5.25 2.8 1.15-5.9-4.4-4.15 5.95-.75L12 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  flame: (size) => (
    <Svg size={size}>
      <path
        d="M12 21c-3.6 0-6.5-2.5-6.5-6 0-2.6 1.6-4 2.3-6 .9 1 1.3 1.8 1.3 1.8-.3-2.7.6-5.3 2.9-7.3-.4 2 .1 3.6 1.3 4.8 1.6 1.6 2.7 3 2.7 5.2 0 .8-.2 1.5-.5 2.1.6-.3 1.1-.8 1.4-1.4.6 1 1 2 1 3.3 0 3.2-2.9 5.5-5.9 5.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </Svg>
  ),
};

/** Icône SVG cohérente pour les badges de progression (remplace les emojis) */
export function BadgeIcon({ name, size = 24, className = "", alt }: BadgeIconProps) {
  const label = alt ?? DEFAULT_ALT[name];
  const render = icons[name];
  if (!render) {
    return (
      <span
        role="img"
        aria-label={label}
        className={`inline-flex h-[1em] w-[1em] items-center justify-center rounded bg-surface text-[10px] font-bold text-ink-tertiary ${className}`}
      >
        ?
      </span>
    );
  }
  return (
    <span role="img" aria-label={label} className={`inline-flex items-center justify-center ${className}`}>
      {render(size)}
    </span>
  );
}

export type { BadgeIconName };
export { BADGE_ICON_NAMES } from "@/lib/navigation/badge-icon-names";
