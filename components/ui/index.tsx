import type { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-border bg-white text-ink hover:bg-surface",
  ghost: "text-accent hover:bg-accent/5",
  dark: "bg-ink text-white hover:bg-ink/90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-12 px-8 py-4 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const isLoading = props["aria-busy"] === true || props["aria-busy"] === "true";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-50
        focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function ButtonLink({ href, variant = "primary", size = "md", className = "", children, onClick }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "accent" | "dark" | "success" | "warning" | "error";
  className?: string;
}) {
  const styles: Record<string, string> = {
    default: "bg-surface text-ink-secondary border border-border-light",
    accent: "bg-accent/10 text-accent",
    dark: "bg-ink text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={`rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function ProgressBar({
  value,
  className = "",
  color = "default",
  label,
}: {
  value: number;
  className?: string;
  color?: "default" | "accent" | "success" | "warning";
  label?: string;
}) {
  const safe = Math.min(100, Math.max(0, value));
  const barColors: Record<string, string> = {
    default: "bg-ink",
    accent: "bg-accent",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };
  return (
    <div
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${safe}%`}
      className={`h-2 overflow-hidden rounded-full bg-border-light ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColors[color]}`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      {label && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-tertiary">{label}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && (
        <p className={`mt-4 text-lg text-ink-secondary ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-tertiary">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
