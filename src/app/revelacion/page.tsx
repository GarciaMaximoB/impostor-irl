"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const assignmentData = assignment.current;
  const isImpostor = useMemo(() => {
    if (!assignmentData || !revelation.currentPlayerId) {
      return false;
    }
    return assignmentData.impostorId === revelation.currentPlayerId;
  }, [assignmentData, revelation.currentPlayerId]);

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
    if (!assignmentData) {
      router.replace("/asignacion");
      return;
    }

    if (revelation.state.currentIndex >= revelation.totalPlayers) {
      router.push("/a-jugar");
      return;
    }
  }, [
    assignmentData,
    revelation.state.currentIndex,
    revelation.totalPlayers,
    router,
  ]);

  useEffect(() => {
    if (!currentPlayer) {
      return;
    }
    const phaseMessage =
      phase === "handoff"
        ? `Turno de ${currentPlayer.name}. Pasa el dispositivo.`
        : `Mostrando rol de ${currentPlayer.name}.`;
    // Usar setTimeout para evitar setState síncrono en efecto
    const timer = setTimeout(() => {
      setAnnouncement(phaseMessage);
      // Limpiar timer anterior si existe
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
      clearTimerRef.current = setTimeout(() => {
        setAnnouncement(null);
        clearTimerRef.current = null;
      }, 2000);
    }, 0);
    return () => {
      clearTimeout(timer);
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
    };
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-white to-white px-4 py-8 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute left-4 top-4 z-10 md:left-8 md:top-8"
      >
        <Link
          href="/asignacion"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          className="inline-flex items-center rounded-full border border-slate-300 bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
        >
          ← Volver a resumen
        </Link>
      </motion.header>

      <main className="flex w-full max-w-5xl flex-col items-center gap-8 lg:max-w-6xl lg:gap-12 xl:max-w-7xl">
        <motion.div
          key={`stepper-${revelation.state.currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <PlayerStepper
            currentIndex={revelation.state.currentIndex}
            totalPlayers={revelation.totalPlayers}
            progress={revelation.progress}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "handoff" ? (
            <motion.div
              key="handoff"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <HandoffScreen
                playerName={currentPlayer.name}
                onReady={handleStartReveal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <RoleCard
                player={currentPlayer}
                word={assignmentData?.word ?? ""}
                isImpostor={isImpostor}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "reveal" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ActionFooter
                onComplete={handleCompleteReveal}
                isLastPlayer={revelation.isLastPlayer}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.div>
  );
}
