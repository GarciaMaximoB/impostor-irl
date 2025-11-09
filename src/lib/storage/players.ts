import { z } from "zod";
import { normalizePlayers } from "@/lib/players/reducer";
import type { Player } from "@/lib/players/types";
import { playerNameSchema } from "@/lib/players/validation";

const STORAGE_KEY = "impostor:players";

const playerSchema = z.object({
  id: z.string().min(1),
  name: playerNameSchema,
  order: z.number().int().min(0),
});

const playersSchema = z.array(playerSchema);

export function loadPlayers(): Player[] | null | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizePlayers(playersSchema.parse(parsed));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function savePlayers(players: Player[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const serializable = playersSchema.parse(normalizePlayers(players));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}
