import type {
  AssignmentHistoryEntry,
  AssignmentState,
  GameSessionAction,
  GameSessionAssignment,
  GameSessionSettings,
  GameSessionState,
  GameSessionStatus,
  Player,
} from "./types";

export const MINIMUM_PLAYERS = 3;

const emptyAssignmentState: GameSessionAssignment = {
  current: null,
  history: [],
  rerolls: 0,
};

export const initialGameSessionState: GameSessionState = Object.freeze({
  settings: {
    categoryId: "",
  },
  players: [],
  status: "idle" as GameSessionStatus,
  assignment: emptyAssignmentState,
});

export function gameSessionReducer(
  state: GameSessionState,
  action: GameSessionAction
): GameSessionState {
  switch (action.type) {
    case "SET_SETTINGS":
      return {
        ...state,
        settings: { ...action.payload },
        assignment: createEmptyAssignmentState(),
      };
    case "RESTORE_SETTINGS":
      return {
        ...state,
        settings: { ...action.payload },
        status: state.status === "idle" ? "idle" : state.status,
        assignment: state.assignment.current
          ? state.assignment
          : createEmptyAssignmentState(),
      };
    case "RESET_SETTINGS":
      return {
        ...state,
        settings: { ...initialGameSessionState.settings },
        status: "idle",
        assignment: createEmptyAssignmentState(),
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
        assignment: createEmptyAssignmentState(),
      };
    case "SET_ASSIGNMENT": {
      const { assignment, mode } = action.payload;
      const history =
        mode === "initial"
          ? [
              createHistoryEntry({
                assignment,
                attempt: 0,
              }),
            ]
          : [
              ...state.assignment.history,
              createHistoryEntry({
                assignment,
                attempt: state.assignment.history.length,
              }),
            ];

      const rerolls = Math.max(0, history.length - 1);

      return {
        ...state,
        status: "assigning",
        assignment: {
          current: cloneAssignment(assignment),
          history,
          rerolls,
        },
      };
    }
    case "RESET_ASSIGNMENT":
      return {
        ...state,
        assignment: createEmptyAssignmentState(),
        status: state.status === "assigning" ? "ready" : state.status,
      };
    case "ELIMINATE_PLAYER": {
      const { playerId } = action.payload;
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === playerId ? { ...player, eliminado: true } : player
        ),
      };
    }
    case "RESET_ELIMINATIONS":
      return {
        ...state,
        players: state.players.map((player) => ({
          ...player,
          eliminado: false,
        })),
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

function createEmptyAssignmentState(): GameSessionAssignment {
  return {
    current: null,
    history: [],
    rerolls: 0,
  };
}

function cloneAssignment(assignment: AssignmentState): AssignmentState {
  return {
    word: assignment.word,
    impostorId: assignment.impostorId,
    revealOrder: [...assignment.revealOrder],
    timestamp: assignment.timestamp,
  };
}

function createHistoryEntry({
  assignment,
  attempt,
}: {
  assignment: AssignmentState;
  attempt: number;
}): AssignmentHistoryEntry {
  return {
    ...cloneAssignment(assignment),
    attempt,
  };
}

export function sanitizeSettings(
  settings: GameSessionSettings
): GameSessionSettings {
  const trimmedRoomName = settings.roomName?.trim();

  return {
    categoryId: settings.categoryId,
    roomName: trimmedRoomName ? trimmedRoomName : undefined,
  };
}
