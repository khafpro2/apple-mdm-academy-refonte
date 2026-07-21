"use client";

export function VideoCompletion({
  completed,
  percent,
  onComplete,
  className = "",
}: {
  completed: boolean;
  percent: number;
  onComplete?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}
      role="status"
      aria-live="polite"
    >
      <h2 className="font-bold text-ink">Complétion</h2>
      {completed ? (
        <p className="mt-2 text-sm text-green-800">Vidéo marquée comme terminée.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-secondary">Progression actuelle : {percent}%</p>
          {onComplete && (
            <button
              type="button"
              onClick={onComplete}
              className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Marquer comme terminée
            </button>
          )}
        </>
      )}
    </div>
  );
}
