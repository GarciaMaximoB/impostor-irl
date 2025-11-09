import type { Player } from "@/lib/players/types";

export type { Player };

export type GameSessionStatus = "idle" | "ready" | "assigning" | "completed";

export interface GameSessionSettings {
  roomName?: string;
  categoryId: string;
}

export interface GameSessionState {
  settings: GameSessionSettings;
  players: Player[];
  status: GameSessionStatus;
}

export type GameSessionAction =
  | { type: "SET_SETTINGS"; payload: GameSessionSettings }
  | { type: "RESTORE_SETTINGS"; payload: GameSessionSettings }
  | { type: "RESET_SETTINGS" }
  | { type: "SET_STATUS"; payload: GameSessionStatus }
  | { type: "SET_PLAYERS"; payload: Player[] };
