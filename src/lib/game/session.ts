import type {
  GameSessionAction,
  GameSessionSettings,
  GameSessionState,
  GameSessionStatus,
  Player,
} from "./types";

export const MINIMUM_PLAYERS = 4;

export const initialGameSessionState: GameSessionState = Object.freeze({
  settings: {
    categoryId: "",
  },
  players: [],
  status: "idle" as GameSessionStatus,
});

export function gameSessionReducer(
  state: GameSessionState,
  action: GameSessionAction,
): GameSessionState {
  switch (action.type) {
    case "SET_SETTINGS":
      return {
        ...state,
        settings: { ...action.payload },
      };
    case "RESTORE_SETTINGS":
      return {
        ...state,
        settings: { ...action.payload },
        status: state.status === "idle" ? "idle" : state.status,
      };
    case "RESET_SETTINGS":
      return {
        ...state,
        settings: { ...initialGameSessionState.settings },
        status: "idle",
      };
    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };
    case "SET_PLAYERS":
      return {
        ...state,
        players: action.payload.map(clonePlayer),
      };
    default:
      return state;
  }
}

function clonePlayer(player: Player): Player {
  return {
    ...player,
  };
}

export function sanitizeSettings(
  settings: GameSessionSettings,
): GameSessionSettings {
  const trimmedRoomName = settings.roomName?.trim();

  return {
    categoryId: settings.categoryId,
    roomName: trimmedRoomName ? trimmedRoomName : undefined,
  };
}

