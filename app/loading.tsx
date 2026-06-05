export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-light border-t-accent" aria-hidden="true" />
      <p className="text-sm text-ink-secondary">Chargement…</p>
    </div>
  );
}
