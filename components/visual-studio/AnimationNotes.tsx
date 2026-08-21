import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";

type AnimationNotesProps = {
  instructions: string[];
  transition?: string;
  className?: string;
};

export function AnimationNotes({ instructions, transition, className = "" }: AnimationNotesProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{ backgroundColor: visualStudioColors.background, borderColor: visualStudioColors.border }}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: visualStudioColors.muted }}>
        Éléments d’animation
      </h4>
      <ul className="mt-2 space-y-1.5">
        {instructions.map((item) => (
          <li key={item} className="flex gap-2 text-sm" style={{ color: visualStudioColors.text }}>
            <span aria-hidden="true" style={{ color: visualStudioColors.purple }}>
              ▸
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {transition ? (
        <p className="mt-3 text-xs" style={{ color: visualStudioColors.muted }}>
          <span className="font-semibold" style={{ color: visualStudioColors.text }}>
            Transition :
          </span>{" "}
          {transition}
        </p>
      ) : null}
    </div>
  );
}
