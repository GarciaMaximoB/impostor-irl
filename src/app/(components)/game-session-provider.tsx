"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  gameSessionReducer,
  initialGameSessionState,
} from "@/lib/game/session";
import type { GameSessionAction, GameSessionState } from "@/lib/game/types";

const GameSessionStateContext = createContext<GameSessionState | undefined>(
  undefined,
);
const GameSessionDispatchContext = createContext<
  Dispatch<GameSessionAction> | undefined
>(undefined);

interface GameSessionProviderProps {
  children: ReactNode;
}

export function GameSessionProvider({ children }: GameSessionProviderProps) {
  const [state, dispatch] = useReducer(
    gameSessionReducer,
    initialGameSessionState,
  );

  const memoizedState = useMemo(() => state, [state]);

  return (
    <GameSessionStateContext.Provider value={memoizedState}>
      <GameSessionDispatchContext.Provider value={dispatch}>
        {children}
      </GameSessionDispatchContext.Provider>
    </GameSessionStateContext.Provider>
  );
}

export function useGameSessionState(): GameSessionState {
  const context = useContext(GameSessionStateContext);

  if (!context) {
    throw new Error(
      "useGameSessionState debe utilizarse dentro de GameSessionProvider.",
    );
  }

  return context;
}

export function useGameSessionDispatch(): Dispatch<GameSessionAction> {
  const context = useContext(GameSessionDispatchContext);

  if (!context) {
    throw new Error(
      "useGameSessionDispatch debe utilizarse dentro de GameSessionProvider.",
    );
  }

  return context;
}





