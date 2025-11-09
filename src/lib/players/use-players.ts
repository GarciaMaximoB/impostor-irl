import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
} from "react";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import {
  normalizePlayers,
  playersReducer,
  sortPlayersByOrder,
} from "@/lib/players/reducer";
import type {
  Player,
  PlayersReducerAction,
  UsePlayersMeta,
} from "@/lib/players/types";

interface UsePlayersOptions {
  initialPlayers?: Player[];
}

export function usePlayers(
  options: UsePlayersOptions = {},
): [Player[], Dispatch<PlayersReducerAction>, UsePlayersMeta] {
  const { initialPlayers = [] } = options;

  const initialState = useMemo<InternalState>(() => {
    const normalized = normalizePlayers(initialPlayers);
    return {
      players: normalized,
      baseline: normalized,
    };
  }, [initialPlayers]);

  const [state, internalDispatch] = useReducer(internalReducer, initialState);
  const { players, baseline } = state;

  useEffect(() => {
    const normalized = normalizePlayers(initialPlayers);
    if (!arePlayersEqual(normalized, baseline)) {
      internalDispatch({ type: "HYDRATE", payload: normalized });
    }
  }, [baseline, initialPlayers, internalDispatch]);

  const dispatch = useCallback<Dispatch<PlayersReducerAction>>(
    (action) => {
      internalDispatch({ type: "APPLY", payload: action });
    },
    [internalDispatch],
  );

  const duplicateNames = useMemo(() => findDuplicateNames(players), [players]);
  const hasMinimumPlayers = players.length >= MINIMUM_PLAYERS;

  const markAsSaved = useCallback(
    (nextBaseline?: Player[]) => {
      internalDispatch({
        type: "COMMIT_BASELINE",
        payload: normalizePlayers(nextBaseline ?? players),
      });
    },
    [internalDispatch, players],
  );

  const meta = useMemo<UsePlayersMeta>(() => {
    const normalizedPlayers = sortPlayersByOrder(players);
    const normalizedBaseline = sortPlayersByOrder(baseline);

    return {
      total: players.length,
      duplicateNames,
      hasMinimumPlayers,
      isDirty: !arePlayersEqual(normalizedPlayers, normalizedBaseline),
      errors: {
        duplicates: duplicateNames,
        minimumRequired: !hasMinimumPlayers,
      },
      markAsSaved,
    };
  }, [baseline, duplicateNames, hasMinimumPlayers, markAsSaved, players]);

  return [players, dispatch, meta];
}

interface InternalState {
  players: Player[];
  baseline: Player[];
}

type InternalAction =
  | { type: "APPLY"; payload: PlayersReducerAction }
  | { type: "HYDRATE"; payload: Player[] }
  | { type: "COMMIT_BASELINE"; payload: Player[] };

function internalReducer(state: InternalState, action: InternalAction): InternalState {
  switch (action.type) {
    case "APPLY":
      return {
        players: playersReducer(state.players, action.payload),
        baseline: state.baseline,
      };
    case "HYDRATE": {
      const normalized = normalizePlayers(action.payload);
      return {
        players: normalized,
        baseline: normalized,
      };
    }
    case "COMMIT_BASELINE": {
      const normalized = normalizePlayers(action.payload);
      return {
        players: normalized,
        baseline: normalized,
      };
    }
    default:
      return state;
  }
}

function arePlayersEqual(left: Player[], right: Player[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((player, index) => {
    const other = right[index];
    return (
      player.id === other.id &&
      player.name === other.name &&
      player.order === other.order
    );
  });
}

function findDuplicateNames(players: Player[]): string[] {
  const sanitizedNames = players.map((player) => player.name.toLowerCase());
  const duplicates = new Set<string>();
  const seen = new Map<string, string>();

  sanitizedNames.forEach((name, index) => {
    if (!name) {
      return;
    }
    if (seen.has(name)) {
      duplicates.add(seen.get(name) ?? players[index].name);
      duplicates.add(players[index].name);
      return;
    }
    seen.set(name, players[index].name);
  });

  return Array.from(duplicates);
}


