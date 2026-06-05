import { ButtonLink } from "@/components/ui";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border-light bg-surface-elevated px-6 py-12 text-center">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">{description}</p>
      {actionHref && actionLabel && (
        <ButtonLink href={actionHref} className="mt-6" variant="secondary">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
