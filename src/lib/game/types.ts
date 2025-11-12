import type { Player } from "@/lib/players/types";

export type { Player };

export type GameSessionStatus =
  | "idle"
  | "ready"
  | "assigning"
  | "completed"
  | "in-game"
  | "voting";

export interface GameSessionSettings {
  roomName?: string;
  categoryId: string;
}

export interface AssignmentState {
  word: string;
  impostorId: Player["id"];
  revealOrder: Player["id"][];
  timestamp: number;
}

export interface AssignmentHistoryEntry extends AssignmentState {
  attempt: number;
}

export interface GameSessionAssignment {
  current: AssignmentState | null;
  history: AssignmentHistoryEntry[];
  rerolls: number;
}

export interface GameSessionState {
  settings: GameSessionSettings;
  players: Player[];
  status: GameSessionStatus;
  assignment: GameSessionAssignment;
}

export type GameSessionAction =
  | { type: "SET_SETTINGS"; payload: GameSessionSettings }
  | { type: "RESTORE_SETTINGS"; payload: GameSessionSettings }
  | { type: "RESET_SETTINGS" }
  | { type: "SET_STATUS"; payload: GameSessionStatus }
  | { type: "SET_PLAYERS"; payload: Player[] }
  | {
      type: "SET_ASSIGNMENT";
      payload: { assignment: AssignmentState; mode: "initial" | "reroll" };
    }
  | { type: "RESET_ASSIGNMENT" }
  | { type: "ELIMINATE_PLAYER"; payload: { playerId: Player["id"] } }
  | { type: "RESET_ELIMINATIONS" };
