import type { Player, PlayersReducerAction } from "@/lib/players/types";

export function playersReducer(
  state: Player[],
  action: PlayersReducerAction
): Player[] {
  switch (action.type) {
    case "ADD_PLAYER": {
      const ordered = sortPlayersByOrder(state);
      const nextPlayers = [...ordered, clonePlayer(action.payload.player)];
      return normalizePlayers(nextPlayers);
    }
    case "UPDATE_PLAYER": {
      const ordered = sortPlayersByOrder(state);
      const nextPlayers = ordered.map((player) =>
        player.id === action.payload.id
          ? { ...player, name: action.payload.name }
          : player
      );
      return normalizePlayers(nextPlayers);
    }
    case "REMOVE_PLAYER": {
      const ordered = sortPlayersByOrder(state);
      const nextPlayers = ordered.filter(
        (player) => player.id !== action.payload.id
      );
      return normalizePlayers(nextPlayers);
    }
    case "REORDER_PLAYERS": {
      const sorted = sortPlayersByOrder(state);
      if (
        action.payload.from < 0 ||
        action.payload.from >= sorted.length ||
        action.payload.to < 0 ||
        action.payload.to >= sorted.length
      ) {
        return normalizePlayers(sorted);
      }

      const reordered = arrayMove(
        sorted,
        action.payload.from,
        action.payload.to
      );
      return normalizePlayers(reordered);
    }
    case "RESET_PLAYERS": {
      return normalizePlayers(sortPlayersByOrder(action.payload.players));
    }
    default:
      return normalizePlayers(sortPlayersByOrder(state));
  }
}

export function sortPlayersByOrder(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.order - b.order);
}

export function normalizePlayers(players: Player[]): Player[] {
  return players.map((player, index) => ({
    ...player,
    order: index,
    eliminado: player.eliminado,
  }));
}

function clonePlayer(player: Player): Player {
  return {
    id: player.id,
    name: player.name,
    order: player.order,
    eliminado: player.eliminado,
  };
}

function arrayMove<T>(input: T[], from: number, to: number): T[] {
  const array = [...input];
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
  return array;
}
