import { useCallback, useEffect } from "react";
import type { GameSessionSettings } from "@/lib/game/types";
import { loadLastSettings, saveLastSettings } from "@/lib/storage/settings";

export function usePersistedSettings({
  onRestore,
}: {
  onRestore: (settings: GameSessionSettings) => void;
}) {
  useEffect(() => {
    const restored = loadLastSettings();

    if (restored) {
      onRestore(restored);
    }
  }, [onRestore]);

  const persist = useCallback((settings: GameSessionSettings) => {
    saveLastSettings(settings);
  }, []);

  return {
    persist,
  };
}

