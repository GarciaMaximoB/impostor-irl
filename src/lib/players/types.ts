export interface Player {
  id: string;
  name: string;
  order: number;
}

export interface PlayerDraft {
  id?: string;
  name: string;
}

export interface PlayersMetaErrors {
  duplicates: string[];
  minimumRequired: boolean;
}

export interface UsePlayersMeta {
  total: number;
  hasMinimumPlayers: boolean;
  duplicateNames: string[];
  isDirty: boolean;
  errors: PlayersMetaErrors;
  markAsSaved: (baseline?: Player[]) => void;
}

export type PlayersReducerAction =
  | { type: "ADD_PLAYER"; payload: { player: Player } }
  | { type: "UPDATE_PLAYER"; payload: { id: string; name: string } }
  | { type: "REMOVE_PLAYER"; payload: { id: string } }
  | { type: "REORDER_PLAYERS"; payload: { from: number; to: number } }
  | { type: "RESET_PLAYERS"; payload: { players: Player[] } };
