import type { CourseStoryboard, SceneContent, StoryboardScene } from "@/lib/visual-studio/types";
import { visualStudioColors } from "@/lib/visual-studio/visual-tokens";
import { ArchitectureDiagram } from "@/components/visual-studio/ArchitectureDiagram";

type SceneVisualProps = {
  scene: StoryboardScene;
  architecture: CourseStoryboard["architecture"];
};

/** Rendu pédagogique du contenu d’une scène dans le cadre 16:9. */
export function SceneVisual({ scene, architecture }: SceneVisualProps) {
  return <SceneContentView content={scene.sceneContent} architecture={architecture} />;
}

function SceneContentView({
  content,
  architecture,
}: {
  content: SceneContent;
  architecture: CourseStoryboard["architecture"];
}) {
  switch (content.kind) {
    case "problem":
      return (
        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
          <Zone title={content.leftLabel} tone="navy" />
          <div className="flex flex-col justify-center gap-1.5 rounded-xl border border-dashed p-3" style={{ borderColor: visualStudioColors.border }}>
            <p className="mb-1 text-center text-xs font-semibold sm:text-sm" style={{ color: visualStudioColors.navy }}>
              {content.question}
            </p>
            {content.centerSteps.map((step) => (
              <span
                key={step}
                className="rounded-lg px-2 py-1 text-center text-[10px] sm:text-xs"
                style={{ backgroundColor: visualStudioColors.background, color: visualStudioColors.muted }}
              >
                {step}
              </span>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-2">
            <Zone title={content.rightLabel} tone="muted" />
            <div className="flex flex-wrap gap-2 justify-center">
              <Pill label={content.timeIndicator} color={visualStudioColors.orange} />
              <Pill label={content.riskIndicator} color={visualStudioColors.red} />
            </div>
          </div>
        </div>
      );
    case "definition":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-center text-base font-semibold sm:text-xl md:text-2xl" style={{ color: visualStudioColors.navy }}>
            {content.headline}
          </p>
          <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {content.functions.map((fn, i) => (
              <div
                key={fn}
                className="rounded-xl border p-3 text-center animate-[fadeIn_0.5s_ease-out_both]"
                style={{
                  borderColor: visualStudioColors.border,
                  backgroundColor: visualStudioColors.surface,
                  animationDelay: `${i * 120}ms`,
                }}
              >
                <span className="text-[10px] font-bold tabular-nums" style={{ color: visualStudioColors.purple }}>
                  {i + 1}
                </span>
                <p className="mt-1 text-xs font-medium sm:text-sm" style={{ color: visualStudioColors.text }}>
                  {fn}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    case "architecture":
      return (
        <div className="h-full overflow-auto">
          <ArchitectureDiagram
            architecture={architecture}
            highlightIds={["reseller", "abm", "jamf", "intune", "mac", "iphone", "ipad", "user"]}
            compact
          />
        </div>
      );
    case "process-steps":
    case "boot-sequence":
      return (
        <ol className="flex h-full flex-col justify-center gap-2 sm:gap-3">
          {content.steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: content.kind === "boot-sequence" ? visualStudioColors.navy : visualStudioColors.blue }}
              >
                {i + 1}
              </span>
              <span className="pt-1 text-xs sm:text-sm" style={{ color: visualStudioColors.text }}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      );
    case "config-cascade":
      return (
        <ul className="grid h-full grid-cols-2 content-center gap-2 sm:grid-cols-3 md:grid-cols-4">
          {content.items.map((item, i) => (
            <li
              key={item}
              className="rounded-xl border px-2 py-3 text-center text-[11px] font-medium sm:text-xs"
              style={{
                borderColor: visualStudioColors.border,
                backgroundColor: visualStudioColors.surface,
                color: visualStudioColors.text,
                animation: `fadeIn 0.4s ease-out ${i * 80}ms both`,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "comparison":
      return (
        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2">
          <CompareColumn title={content.leftTitle} items={content.leftItems} tone="warning" />
          <CompareColumn title={content.rightTitle} items={content.rightItems} tone="success" />
        </div>
      );
    case "recap":
      return (
        <div className="flex h-full flex-col justify-center gap-4">
          <ol className="flex flex-wrap items-center justify-center gap-1">
            {content.flow.map((step, i) => (
              <li key={step} className="flex items-center gap-1">
                <span
                  className="rounded-lg border px-2 py-1.5 text-[10px] font-medium sm:text-xs"
                  style={{
                    backgroundColor: visualStudioColors.surface,
                    borderColor: visualStudioColors.border,
                    color: visualStudioColors.text,
                  }}
                >
                  {step}
                </span>
                {i < content.flow.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="text-sm font-semibold"
                    style={{ color: visualStudioColors.blue }}
                  >
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p
            className="mx-auto max-w-xl rounded-xl border px-4 py-3 text-center text-xs font-medium sm:text-sm"
            style={{
              borderColor: visualStudioColors.purple,
              backgroundColor: "#F5F3FF",
              color: visualStudioColors.navy,
            }}
          >
            {content.finalQuestion}
          </p>
        </div>
      );
    default: {
      const _exhaustive: never = content;
      return _exhaustive;
    }
  }
}

function Zone({ title, tone }: { title: string; tone: "navy" | "muted" }) {
  return (
    <div
      className="flex min-h-[80px] items-center justify-center rounded-xl border p-3 text-center text-xs font-medium sm:text-sm"
      style={{
        borderColor: visualStudioColors.border,
        backgroundColor: tone === "navy" ? "#EEF0F8" : visualStudioColors.background,
        color: tone === "navy" ? visualStudioColors.navy : visualStudioColors.muted,
      }}
    >
      {title}
    </div>
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
      style={{ borderColor: color, color, backgroundColor: `${color}14` }}
    >
      {label}
    </span>
  );
}

function CompareColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "warning" | "success";
}) {
  const border = tone === "warning" ? visualStudioColors.orange : visualStudioColors.green;
  const bg = tone === "warning" ? "#FFFBEB" : "#ECFDF5";
  return (
    <div className="rounded-xl border p-3 sm:p-4" style={{ borderColor: border, backgroundColor: bg }}>
      <h5 className="text-xs font-bold sm:text-sm" style={{ color: visualStudioColors.text }}>
        {title}
      </h5>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[11px] sm:text-xs" style={{ color: visualStudioColors.text }}>
            <span aria-hidden="true" style={{ color: border }}>
              {tone === "success" ? "✓" : "–"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
