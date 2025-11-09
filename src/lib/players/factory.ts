import type { Player } from "@/lib/players/types";

export function createPlayer(name: string, order: number): Player {
  return {
    id: generateId(),
    name,
    order,
  };
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `player-${Math.random().toString(36).slice(2, 10)}`;
}
