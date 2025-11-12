"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGameSessionState } from "@/app/(components)/game-session-provider";
import { useRevelationState } from "@/lib/revelation/use-revelation-state";
import { RoleCard } from "@/app/(components)/revelation/role-card";
import { PlayerStepper } from "@/app/(components)/revelation/player-stepper";
import { ActionFooter } from "@/app/(components)/revelation/action-footer";
import { DialogConfirm } from "@/app/(components)/players/dialog-confirm";
import { HandoffScreen } from "@/app/(components)/revelation/handoff-screen";

export default function RevelationPage() {
  const router = useRouter();
  const { players, assignment } = useGameSessionState();

  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const revelation = useRevelationState(assignment.current);
  const { phase } = revelation.state;

  const playersById = useMemo(
    () => new Map(players.map((player) => [player.id, player])),
    [players],
  );

  const currentPlayer = useMemo(() => {
    if (!revelation.currentPlayerId) {
      return null;
    }
    return playersById.get(revelation.currentPlayerId) ?? null;
  }, [revelation.currentPlayerId, playersById]);

  const isImpostor = useMemo(() => {
    if (!assignment.current || !revelation.currentPlayerId) {
      return false;
    }
    return assignment.current.impostorId === revelation.currentPlayerId;
  }, [assignment.current, revelation.currentPlayerId]);

  const handleStartReveal = useCallback(() => {
    if (!currentPlayer) {
      return;
    }
    revelation.startReveal();
  }, [currentPlayer, revelation]);

  const handleCompleteReveal = useCallback(() => {
    revelation.completeReveal();
  }, [revelation]);

  const handleCancelBack = useCallback(() => {
    setShowBackConfirm(false);
  }, []);

  useEffect(() => {
    if (!assignment.current) {
      router.replace("/asignacion");
      return;
    }

    if (revelation.state.currentIndex >= revelation.totalPlayers) {
      router.push("/a-jugar");
      return;
    }
  }, [
    assignment.current,
    revelation.state.currentIndex,
    revelation.totalPlayers,
    router,
  ]);

  useEffect(() => {
    if (currentPlayer) {
      const phaseMessage =
        phase === "handoff"
          ? `Turno de ${currentPlayer.name}. Pasa el dispositivo.`
          : `Mostrando rol de ${currentPlayer.name}.`;
      setAnnouncement(phaseMessage);
      const timer = setTimeout(() => {
        setAnnouncement(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, phase]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !showBackConfirm) {
        event.preventDefault();
        if (phase === "handoff") {
          handleStartReveal();
        } else if (phase === "reveal") {
          handleCompleteReveal();
        }
      }
      if (event.key === "Escape") {
        if (showBackConfirm) {
          event.preventDefault();
          handleCancelBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleStartReveal,
    handleCompleteReveal,
    phase,
    showBackConfirm,
    handleCancelBack,
  ]);

  const handleBack = useCallback(() => {
    setShowBackConfirm(true);
  }, []);

  const handleConfirmBack = useCallback(() => {
    revelation.reset();
    router.push("/asignacion");
  }, [revelation, router]);

  if (!assignment.current) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            No hay asignación disponible
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Vuelve a la pantalla de asignación para generar una nueva ronda.
          </p>
          <Link
            href="/asignacion"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
          >
            Volver a asignación
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    const missingPlayerId = revelation.currentPlayerId;
    const isValidOrder = assignment.current.revealOrder.every((id) =>
      playersById.has(id),
    );

    if (!isValidOrder || missingPlayerId) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md space-y-4 text-center">
            <div
              role="alert"
              className="rounded-2xl border border-rose-400 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <p className="font-semibold">Error en el orden de revelación</p>
              <p className="mt-1">
                El orden de revelación contiene jugadores que no existen. Vuelve
                a generar la asignación.
              </p>
            </div>
            <Link
              href="/asignacion"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
            >
              Volver a asignación
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Cargando revelación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-white to-white px-4 py-8 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <header className="mb-8 w-full max-w-2xl">
        <div className="flex items-center justify-between">
          <Link
            href="/asignacion"
            onClick={(e) => {
              e.preventDefault();
              handleBack();
            }}
            className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
          >
            ← Volver a resumen
          </Link>
        </div>
      </header>

      <main className="flex w-full max-w-4xl flex-col items-center gap-8">
        <PlayerStepper
          currentIndex={revelation.state.currentIndex}
          totalPlayers={revelation.totalPlayers}
          progress={revelation.progress}
        />

        {phase === "handoff" ? (
          <HandoffScreen
            playerName={currentPlayer.name}
            onReady={handleStartReveal}
          />
        ) : (
          <RoleCard
            player={currentPlayer}
            word={assignment.current.word}
            isImpostor={isImpostor}
          />
        )}

        {phase === "reveal" ? (
          <ActionFooter
            onComplete={handleCompleteReveal}
            onShowAgain={revelation.showAgain}
            isLastPlayer={revelation.isLastPlayer}
          />
        ) : null}
      </main>

      <DialogConfirm
        open={showBackConfirm}
        title="Volver al resumen"
        description="¿Estás seguro? Se perderá el progreso de la revelación actual."
        confirmLabel="Sí, volver"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />
    </div>
  );
}
