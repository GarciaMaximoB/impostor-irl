import { z } from "zod";
import type { Player } from "@/lib/game/types";

const STORAGE_KEY = "impostor:players";

const playerSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(1, "El nombre del jugador no puede estar vacío.")
        .max(40, "El nombre del jugador no puede superar 40 caracteres."),
    ),
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
    return playersSchema.parse(parsed);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function savePlayers(players: Player[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const serializable = playersSchema.parse(players);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

