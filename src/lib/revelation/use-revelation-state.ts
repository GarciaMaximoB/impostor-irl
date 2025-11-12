import { useCallback, useEffect, useMemo, useState } from "react";
import type { AssignmentState, Player } from "@/lib/game/types";

export type RevelationPhase = "handoff" | "reveal";

export interface RevelationState {
  currentIndex: number;
  revealedPlayers: Set<Player["id"]>;
  phase: RevelationPhase;
}

export interface UseRevelationStateReturn {
  state: RevelationState;
  currentPlayerId: Player["id"] | null;
  isLastPlayer: boolean;
  totalPlayers: number;
  progress: number;
  startReveal: () => void;
  showAgain: () => void;
  completeReveal: () => void;
  reset: () => void;
}

export function useRevelationState(
  assignment: AssignmentState | null,
): UseRevelationStateReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedPlayers, setRevealedPlayers] = useState<Set<Player["id"]>>(
    new Set(),
  );
  const [phase, setPhase] = useState<RevelationPhase>("handoff");

  const currentPlayerId = useMemo(() => {
    if (!assignment || currentIndex >= assignment.revealOrder.length) {
      return null;
    }
    return assignment.revealOrder[currentIndex] ?? null;
  }, [assignment, currentIndex]);

  const totalPlayers = useMemo(
    () => assignment?.revealOrder.length ?? 0,
    [assignment],
  );

  const isLastPlayer = useMemo(
    () => currentIndex >= totalPlayers - 1,
    [currentIndex, totalPlayers],
  );

  const progress = useMemo(() => {
    if (totalPlayers === 0) {
      return 0;
    }
    return ((currentIndex + 1) / totalPlayers) * 100;
  }, [currentIndex, totalPlayers]);

  const startReveal = useCallback(() => {
    setPhase("reveal");
  }, []);

  const showAgain = useCallback(() => {
    if (phase !== "reveal") {
      setPhase("reveal");
    }
  }, [phase]);

  const completeReveal = useCallback(() => {
    if (currentPlayerId) {
      setRevealedPlayers((prev) => {
        const next = new Set(prev);
        next.add(currentPlayerId);
        return next;
      });
    }
    setCurrentIndex((prev) => prev + 1);
    setPhase("handoff");
  }, [currentPlayerId]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setRevealedPlayers(new Set());
    setPhase("handoff");
  }, []);

  useEffect(() => {
    reset();
  }, [assignment?.timestamp, reset]);

  return {
    state: {
      currentIndex,
      revealedPlayers,
      phase,
    },
    currentPlayerId,
    isLastPlayer,
    totalPlayers,
    progress,
    startReveal,
    showAgain,
    completeReveal,
    reset,
  };
}

