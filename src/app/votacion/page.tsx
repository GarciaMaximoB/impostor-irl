"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useGameSessionState,
  useGameSessionDispatch,
} from "@/app/(components)/game-session-provider";
import { getActivePlayers, checkWinCondition } from "@/lib/game/game-logic";
import { assignRoles, AssignRolesError } from "@/lib/game/assign-roles";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import { getCategoryById } from "@/lib/categories/catalog";
import { PlayerVoteCard } from "@/app/(components)/voting/player-vote-card";
import { EliminationConfirmDialog } from "@/app/(components)/voting/elimination-confirm-dialog";
import { VictoryScreen } from "@/app/(components)/voting/victory-screen";
import { NotImpostorScreen } from "@/app/(components)/voting/not-impostor-screen";
import type { Player } from "@/lib/players/types";

type VotingScreenState =
  | { type: "voting" }
  | { type: "victory"; winner: "impostor" | "non-impostors" }
  | { type: "not-impostor"; playerName: string };

export default function VotingPage() {
  const router = useRouter();
  const { players, assignment, settings } = useGameSessionState();
  const dispatch = useGameSessionDispatch();

  const [screenState, setScreenState] = useState<VotingScreenState>({
    type: "voting",
  });
  const [pendingElimination, setPendingElimination] =
    useState<Player | null>(null);

  const activePlayers = useMemo(() => getActivePlayers(players), [players]);

  useEffect(() => {
    if (!assignment.current) {
      router.replace("/asignacion");
      return;
    }
    dispatch({ type: "SET_STATUS", payload: "voting" });
    // Resetear el estado de la pantalla cuando se vuelve a la votación
    setScreenState({ type: "voting" });
  }, [assignment.current, router, dispatch]);

  const handlePlayerClick = useCallback(
    (player: Player) => {
      setPendingElimination(player);
    },
    [],
  );

  const handleConfirmElimination = useCallback(() => {
    if (!pendingElimination || !assignment.current) {
      setPendingElimination(null);
      return;
    }

    const playerId = pendingElimination.id;
    const impostorId = assignment.current.impostorId;

    // Eliminar al jugador
    dispatch({ type: "ELIMINATE_PLAYER", payload: { playerId } });

    // Verificar si es el impostor
    const isImpostor = playerId === impostorId;

    // Obtener jugadores actualizados después de la eliminación
    const updatedPlayers = players.map((player) =>
      player.id === playerId ? { ...player, eliminado: true } : player,
    );

    // Verificar condición de victoria
    const winCondition = checkWinCondition(updatedPlayers, impostorId);

    if (winCondition === "non-impostors-win") {
      setScreenState({ type: "victory", winner: "non-impostors" });
    } else if (winCondition === "impostor-wins") {
      setScreenState({ type: "victory", winner: "impostor" });
    } else if (isImpostor) {
      // Si eliminaron al impostor pero aún no se cumple la condición de victoria
      // (no debería pasar, pero por seguridad)
      setScreenState({ type: "victory", winner: "non-impostors" });
    } else {
      // No era el impostor
      setScreenState({ type: "not-impostor", playerName: pendingElimination.name });
    }

    setPendingElimination(null);
  }, [pendingElimination, assignment.current, players, dispatch]);

  const handleCancelElimination = useCallback(() => {
    setPendingElimination(null);
  }, []);

  const handleContinuePlaying = useCallback(() => {
    router.push("/a-jugar");
  }, [router]);

  const handleNewRound = useCallback(() => {
    // Obtener la categoría actual
    const category = getCategoryById(settings.categoryId);
    if (!category) {
      // Si no hay categoría, redirigir a asignación para que el usuario la seleccione
      router.push("/asignacion");
      return;
    }

    // Verificar que haya suficientes jugadores (todos participarán en la nueva ronda)
    if (players.length < MINIMUM_PLAYERS) {
      // Si no hay suficientes jugadores, redirigir a asignación
      router.push("/asignacion");
      return;
    }

    try {
      // Resetear eliminaciones primero (todos los jugadores participarán en la nueva ronda)
      dispatch({ type: "RESET_ELIMINATIONS" });

      // Hacer el re-roll automáticamente con todos los jugadores
      const nextAssignment = assignRoles({
        players,
        category,
      });

      // Actualizar la asignación en el estado
      dispatch({
        type: "SET_ASSIGNMENT",
        payload: { assignment: nextAssignment, mode: "reroll" },
      });

      // Redirigir directamente a la revelación
      router.push("/revelacion");
    } catch (error) {
      // Si hay un error, redirigir a asignación para que el usuario pueda intentar manualmente
      if (error instanceof AssignRolesError) {
        console.error("Error al generar nueva asignación:", error.message);
      }
      router.push("/asignacion");
    }
  }, [dispatch, router, players, settings.categoryId]);

  if (!assignment.current) {
    return null;
  }

  // Mostrar pantalla de victoria
  if (screenState.type === "victory") {
    return (
      <VictoryScreen
        winner={screenState.winner}
        onNewRound={handleNewRound}
      />
    );
  }

  // Mostrar pantalla "no era impostor"
  if (screenState.type === "not-impostor") {
    return (
      <NotImpostorScreen
        playerName={screenState.playerName}
        onContinue={handleContinuePlaying}
      />
    );
  }

  // Pantalla de votación
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
              Votación
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
              Elige a quién eliminar
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Selecciona al jugador que crees que es el impostor.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Link
                href="/a-jugar"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
              >
                ← Volver
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 md:px-8">
        {activePlayers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-slate-600 dark:text-slate-300">
              No hay jugadores activos para votar.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activePlayers.map((player, index) => (
              <PlayerVoteCard
                key={player.id}
                player={player}
                onClick={() => handlePlayerClick(player)}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <EliminationConfirmDialog
        open={Boolean(pendingElimination)}
        playerName={pendingElimination?.name ?? ""}
        onConfirm={handleConfirmElimination}
        onCancel={handleCancelElimination}
      />
    </div>
  );
}

