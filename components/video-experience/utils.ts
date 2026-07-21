export function formatVideoClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export function resolveAvailabilityLabel(state: string): string {
  switch (state) {
    case "loading":
      return "Chargement";
    case "processing":
      return "En production";
    case "available":
      return "Disponible";
    case "deprecated":
      return "Dépréciée";
    case "missing":
      return "Introuvable";
    default:
      return state;
  }
}

export function canMountMediaPlayer(availability: string, mediaSrc?: string): boolean {
  return availability === "available" && Boolean(mediaSrc);
}
