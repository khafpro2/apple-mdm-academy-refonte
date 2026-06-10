export default function ExamensLoading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 px-6">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      <p className="text-sm text-ink-secondary">Chargement de l'examen…</p>
    </div>
  );
}
