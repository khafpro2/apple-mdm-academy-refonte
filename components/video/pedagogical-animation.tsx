"use client";

import type { AnimationSlug } from "@/lib/types";

type Props = {
  slug: AnimationSlug;
  playing?: boolean;
  progress?: number;
};

function FlowBox({ label, color }: { label: string; color: string }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold shadow-sm transition-all duration-700 ${color}`}
    >
      {label}
    </div>
  );
}

function Arrow({ active }: { active?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center text-2xl transition-opacity duration-700 ${active ? "opacity-100 animate-pulse" : "opacity-30"}`}
      aria-hidden="true"
    >
      →
    </div>
  );
}

function AbmIntuneAnimation({ progress }: { progress: number }) {
  const step = progress < 0.25 ? 0 : progress < 0.5 ? 1 : progress < 0.75 ? 2 : 3;
  return (
    <div className="flex flex-col items-center gap-3 p-6 md:flex-row md:gap-4">
      <FlowBox label="Apple Business Manager" color={step >= 0 ? "border-blue-400 bg-blue-50 text-blue-900 scale-105" : "border-border-light bg-white text-ink-secondary"} />
      <Arrow active={step >= 1} />
      <FlowBox label="Token .p7m" color={step >= 1 ? "border-amber-400 bg-amber-50 text-amber-900 scale-105" : "border-border-light bg-white text-ink-secondary"} />
      <Arrow active={step >= 2} />
      <FlowBox label="Microsoft Intune" color={step >= 2 ? "border-indigo-400 bg-indigo-50 text-indigo-900 scale-105" : "border-border-light bg-white text-ink-secondary"} />
      <Arrow active={step >= 3} />
      <FlowBox label="Appareils ADE" color={step >= 3 ? "border-green-400 bg-green-50 text-green-900 scale-105" : "border-border-light bg-white text-ink-secondary"} />
    </div>
  );
}

function AdeAnimation({ progress }: { progress: number }) {
  const step = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
  return (
    <div className="grid gap-4 p-6 md:grid-cols-3">
      {[
        { label: "Achat / ABM", desc: "Appareil assigné au MDM", active: step >= 0 },
        { label: "Setup Assistant", desc: "Remote Management", active: step >= 1 },
        { label: "Supervision", desc: "Profils silencieux", active: step >= 2 },
      ].map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border p-5 transition-all duration-700 ${s.active ? "border-accent bg-accent/5 shadow-md scale-[1.02]" : "border-border-light bg-white opacity-60"}`}
        >
          <p className="font-bold text-ink">{s.label}</p>
          <p className="mt-2 text-sm text-ink-secondary">{s.desc}</p>
          {s.active && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border-light">
              <div className="h-full animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-accent" style={{ width: "100%" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ApnsAnimation({ progress }: { progress: number }) {
  const pulse = progress > 0.2;
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex w-full max-w-lg items-center justify-between">
        <FlowBox label="Serveur MDM" color={pulse ? "border-purple-400 bg-purple-50 text-purple-900" : "border-border-light bg-white"} />
        <div className="relative mx-4 flex-1">
          <div className={`h-1 rounded-full bg-border-light ${pulse ? "overflow-hidden" : ""}`}>
            {pulse && <div className="h-full w-1/3 animate-[slide_2s_ease-in-out_infinite] rounded-full bg-purple-500" />}
          </div>
          <p className="mt-2 text-center text-xs font-medium text-ink-tertiary">Push APNs</p>
        </div>
        <FlowBox label="iPhone / Mac" color={progress > 0.5 ? "border-green-400 bg-green-50 text-green-900 scale-105" : "border-border-light bg-white"} />
      </div>
      <p className="text-sm text-ink-secondary">Certificat APNs requis pour chaque serveur MDM</p>
    </div>
  );
}

function AppsBooksAnimation({ progress }: { progress: number }) {
  const apps = ["Teams", "Outlook", "Safari", "App métier"];
  return (
    <div className="p-6">
      <div className="mb-4 flex justify-center gap-2">
        <FlowBox label="ABM Apps & Books" color="border-blue-400 bg-blue-50 text-blue-900" />
        <Arrow active={progress > 0.2} />
        <FlowBox label="Token VPP" color={progress > 0.2 ? "border-amber-400 bg-amber-50 text-amber-900" : "border-border-light bg-white"} />
        <Arrow active={progress > 0.5} />
        <FlowBox label="Intune / Jamf" color={progress > 0.5 ? "border-indigo-400 bg-indigo-50 text-indigo-900" : "border-border-light bg-white"} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {apps.map((app, i) => (
          <div
            key={app}
            className={`rounded-xl border p-4 text-center text-sm font-medium transition-all duration-500 ${progress > (i + 1) * 0.2 ? "border-green-400 bg-green-50 text-green-900" : "border-border-light bg-surface text-ink-secondary"}`}
          >
            {app}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlatformSsoAnimation({ progress }: { progress: number }) {
  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <FlowBox label="Entra ID" color={progress > 0 ? "border-blue-500 bg-blue-50 text-blue-900" : "border-border-light bg-white"} />
        <Arrow active={progress > 0.2} />
        <FlowBox label="Extension PSSO" color={progress > 0.2 ? "border-violet-400 bg-violet-50 text-violet-900" : "border-border-light bg-white"} />
        <Arrow active={progress > 0.5} />
        <FlowBox label="macOS Login" color={progress > 0.5 ? "border-gray-700 bg-gray-100 text-gray-900" : "border-border-light bg-white"} />
        <Arrow active={progress > 0.7} />
        <FlowBox label="Apps SSO" color={progress > 0.7 ? "border-green-400 bg-green-50 text-green-900" : "border-border-light bg-white"} />
      </div>
      <div className="mx-auto max-w-md rounded-2xl border border-border-light bg-black p-4 font-mono text-xs text-green-400">
        <p className={progress > 0.3 ? "opacity-100" : "opacity-30"}>$ profiles install -path psso.mobileconfig</p>
        <p className={`mt-1 ${progress > 0.6 ? "opacity-100" : "opacity-30"}`}>Platform SSO registered ✓</p>
      </div>
    </div>
  );
}

function JamfPoliciesAnimation({ progress }: { progress: number }) {
  const triggers = ["Enrollment Complete", "Recurring Check-in", "Self Service"];
  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {triggers.map((t, i) => (
          <div
            key={t}
            className={`rounded-2xl border p-4 transition-all duration-500 ${progress > i * 0.3 ? "border-accent bg-accent/5 shadow-sm" : "border-border-light bg-white opacity-50"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">Trigger</p>
            <p className="mt-1 font-bold text-ink">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <FlowBox label="Smart Group" color={progress > 0.4 ? "border-blue-400 bg-blue-50" : "border-border-light bg-white"} />
        <Arrow active={progress > 0.6} />
        <FlowBox label="Deploy App" color={progress > 0.6 ? "border-green-400 bg-green-50 text-green-900" : "border-border-light bg-white"} />
      </div>
    </div>
  );
}

function FileVaultAnimation({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="relative h-32 w-32 rounded-3xl border-4 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl">
        <div
          className="absolute inset-0 flex items-center justify-center text-4xl transition-opacity duration-700"
          style={{ opacity: progress > 0.3 ? 1 : 0.3 }}
        >
          🔒
        </div>
        {progress > 0.5 && (
          <div className="absolute -right-2 -top-2 animate-bounce rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
            Escrow ✓
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <FlowBox label="Profil MDM" color={progress > 0.2 ? "border-indigo-400 bg-indigo-50" : "border-border-light bg-white"} />
        <FlowBox label="Clé recovery → MDM" color={progress > 0.5 ? "border-green-400 bg-green-50 text-green-900" : "border-border-light bg-white"} />
      </div>
    </div>
  );
}

const ANIMATIONS: Record<AnimationSlug, React.ComponentType<{ progress: number }>> = {
  "abm-intune": AbmIntuneAnimation,
  "ade-enrollment": AdeAnimation,
  "apns-push": ApnsAnimation,
  "apps-books": AppsBooksAnimation,
  "platform-sso": PlatformSsoAnimation,
  "jamf-policies": JamfPoliciesAnimation,
  filevault: FileVaultAnimation,
};

export function PedagogicalAnimation({ slug, playing = false, progress = 0 }: Props) {
  const Component = ANIMATIONS[slug];
  const effectiveProgress = playing ? progress : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-light bg-gradient-to-br from-surface-elevated to-surface">
      <div className="border-b border-border-light bg-ink px-4 py-2 text-xs font-medium text-white/80">
        Animation pédagogique · style Apple Training Premium
      </div>
      <Component progress={effectiveProgress} />
    </div>
  );
}
