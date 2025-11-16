import { settingsSchema } from "@/lib/validation/settings";
import type { GameSessionSettings } from "@/lib/game/types";

const STORAGE_KEY = "impostor:lastSettings";

export function loadLastSettings():
  | GameSessionSettings
  | null
  | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return settingsSchema.parse(parsed);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLastSettings(settings: GameSessionSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  const serializableSettings = settingsSchema.parse(settings);
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(serializableSettings),
  );
}




