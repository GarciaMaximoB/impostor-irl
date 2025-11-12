"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayersToolbar } from "@/app/(components)/players/players-toolbar";
import { PlayerForm } from "@/app/(components)/players/player-form";
import { PlayerList } from "@/app/(components)/players/player-list";
import { DialogConfirm } from "@/app/(components)/players/dialog-confirm";
import { PlayersSummaryCard } from "@/app/(components)/players-summary-card";
import {
  useGameSessionDispatch,
  useGameSessionState,
} from "@/app/(components)/game-session-provider";
import { usePlayers } from "@/lib/players/use-players";
import { playerNameSchema } from "@/lib/players/validation";
import type { Player } from "@/lib/players/types";
import { createPlayer } from "@/lib/players/factory";
import { loadPlayers, savePlayers } from "@/lib/storage/players";
import { MINIMUM_PLAYERS } from "@/lib/game/session";

type NameValidationResult =
  | { success: true; value: string }
  | { success: false; error: string };

export default function PlayersPage() {
  const router = useRouter();
  const { players: sessionPlayers } = useGameSessionState();
  const sessionDispatch = useGameSessionDispatch();

  const [seedPlayers, setSeedPlayers] = useState<Player[] | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Player | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [blockingError, setBlockingError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (seedPlayers !== null) {
      return;
    }
    const stored = loadPlayers();
    if (Array.isArray(stored) && stored.length > 0) {
      setSeedPlayers(stored);
      return;
    }
    setSeedPlayers(sessionPlayers);
  }, [seedPlayers, sessionPlayers]);

  const initialPlayers = useMemo(
    () => seedPlayers ?? sessionPlayers,
    [seedPlayers, sessionPlayers],
  );

  const [players, dispatchPlayers, meta] = usePlayers({
    initialPlayers,
  });

  const { hasMinimumPlayers, duplicateNames, markAsSaved } = meta;

  const validateName = useCallback(
    (input: string, currentId?: string): NameValidationResult => {
      const parsed = playerNameSchema.safeParse(input);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return {
          success: false,
          error: issue?.message ?? "Nombre inválido.",
        };
      }
      const sanitized = parsed.data;
      const normalized = sanitized.toLowerCase();
      const duplicate = players.find(
        (player) =>
          player.id !== currentId && player.name.toLowerCase() === normalized,
      );
      if (duplicate) {
        return {
          success: false,
          error: "Ese nombre ya está en uso. Usa un nombre único.",
        };
      }
      return { success: true, value: sanitized };
    },
    [players],
  );

  const handleAddPlayer = useCallback(
    (name: string) => {
      const newPlayer = createPlayer(name, players.length);
      dispatchPlayers({
        type: "ADD_PLAYER",
        payload: { player: newPlayer },
      });
      setStatusMessage(`Se agregó a ${name}.`);
    },
    [dispatchPlayers, players.length],
  );

  const handleUpdatePlayer = useCallback(
    (playerId: string, name: string) => {
      dispatchPlayers({
        type: "UPDATE_PLAYER",
        payload: { id: playerId, name },
      });
      setStatusMessage(`Se actualizó a ${name}.`);
    },
    [dispatchPlayers],
  );

  const handleRequestRemoval = useCallback((player: Player) => {
    setPendingRemoval(player);
  }, []);

  const handleConfirmRemoval = useCallback(() => {
    if (!pendingRemoval) {
      return;
    }
    dispatchPlayers({
      type: "REMOVE_PLAYER",
      payload: { id: pendingRemoval.id },
    });
    setStatusMessage(`Se eliminó a ${pendingRemoval.name}.`);
    setPendingRemoval(null);
  }, [dispatchPlayers, pendingRemoval]);

  const handleCancelRemoval = useCallback(() => {
    setPendingRemoval(null);
  }, []);

  const handleMoveUp = useCallback(
    (player: Player) => {
      const currentIndex = players.findIndex((item) => item.id === player.id);
      if (currentIndex <= 0) {
        return;
      }
      dispatchPlayers({
        type: "REORDER_PLAYERS",
        payload: { from: currentIndex, to: currentIndex - 1 },
      });
      setStatusMessage(
        `${player.name} ahora está en la posición ${currentIndex}.`,
      );
    },
    [dispatchPlayers, players],
  );

  const handleMoveDown = useCallback(
    (player: Player) => {
      const currentIndex = players.findIndex((item) => item.id === player.id);
      if (currentIndex === -1 || currentIndex >= players.length - 1) {
        return;
      }
      dispatchPlayers({
        type: "REORDER_PLAYERS",
        payload: { from: currentIndex, to: currentIndex + 1 },
      });
      setStatusMessage(
        `${player.name} ahora está en la posición ${currentIndex + 2}.`,
      );
    },
    [dispatchPlayers, players],
  );

  const handleRequestClear = useCallback(() => {
    setConfirmClear(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    dispatchPlayers({
      type: "RESET_PLAYERS",
      payload: { players: [] },
    });
    setConfirmClear(false);
    setStatusMessage("Se limpió la lista de jugadores.");
  }, [dispatchPlayers]);

  const handleCancelClear = useCallback(() => {
    setConfirmClear(false);
  }, []);

  const handleSaveAndReturn = useCallback(async () => {
    setBlockingError(null);

    if (!hasMinimumPlayers) {
      setBlockingError(
        `Agrega al menos ${MINIMUM_PLAYERS} jugadores únicos antes de guardar.`,
      );
      return;
    }

    if (duplicateNames.length > 0) {
      setBlockingError("Resuelve los nombres duplicados antes de continuar.");
      return;
    }

    try {
      setIsSaving(true);
      savePlayers(players);
      sessionDispatch({ type: "SET_PLAYERS", payload: players });
      markAsSaved(players);
      router.push("/");
    } catch {
      setBlockingError(
        "No pudimos guardar la lista de jugadores. Intenta de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    duplicateNames,
    hasMinimumPlayers,
    markAsSaved,
    players,
    router,
    sessionDispatch,
  ]);

  const duplicatesSummary = useMemo(() => {
    if (duplicateNames.length === 0) {
      return null;
    }
    const namesList = duplicateNames.join(", ");
    return duplicateNames.length === 1
      ? `Nombre duplicado detectado: ${namesList}.`
      : `Nombres duplicados detectados: ${namesList}.`;
  }, [duplicateNames]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:px-8">
          <span className="inline-flex w-fit items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
            Pantalla 02 · Gestión de jugadores
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
            Administra la lista de jugadores antes de iniciar la partida.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Agrega, edita y reordena jugadores asegurando nombres únicos y un
            mínimo de {MINIMUM_PLAYERS} participantes. Guarda los cambios para
            regresar a la configuración de partida.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              ← Volver a configuración
            </Link>
            <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1.5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-700">
              {players.length} jugadores actuales
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:px-8">
        <section className="space-y-5">
          <PlayersToolbar
            total={players.length}
            duplicateNames={duplicateNames}
            hasMinimumPlayers={hasMinimumPlayers}
            onClear={handleRequestClear}
            disableClear={isSaving}
          />

          <PlayerForm
            onSubmit={handleAddPlayer}
            validateName={(value) => validateName(value)}
            disabled={isSaving}
          />

          {blockingError && (
            <div
              className="rounded-3xl border border-rose-400 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300"
              role="alert"
            >
              {blockingError}
            </div>
          )}

          {duplicatesSummary && (
            <div
              className="rounded-3xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm dark:border-amber-500 dark:bg-amber-500/10 dark:text-amber-300"
              role="alert"
            >
              {duplicatesSummary}
            </div>
          )}

          <PlayerList
            players={players}
            validateName={(value, currentId) => validateName(value, currentId)}
            onUpdateName={handleUpdatePlayer}
            onRemove={handleRequestRemoval}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        </section>

        <aside className="space-y-5">
          <PlayersSummaryCard players={players} />
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Guardar cambios
            </h2>
            <p className="mt-2">
              Verifica que haya al menos {MINIMUM_PLAYERS} jugadores únicos antes
              de guardar. Los cambios se sincronizan con la configuración de
              partida y quedan disponibles al volver.
            </p>
            <button
              type="button"
              onClick={handleSaveAndReturn}
              disabled={isSaving}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
            >
              {isSaving ? "Guardando..." : "Guardar y volver"}
            </button>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Esta acción sobrescribe la lista guardada en el dispositivo.
            </p>
          </section>
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-white via-white/95 to-white/60 px-4 py-4 shadow-[0_-20px_60px_-20px_rgba(15,23,42,0.25)] dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/70 md:hidden">
        <button
          type="button"
          onClick={handleSaveAndReturn}
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
        >
          {isSaving ? "Guardando..." : "Guardar y volver"}
        </button>
      </div>

      <div
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {statusMessage}
      </div>

      <DialogConfirm
        open={Boolean(pendingRemoval)}
        title={
          pendingRemoval
            ? `¿Desterrar a ${pendingRemoval.name} del juego?`
            : "¿Desterrar jugador?"
        }
        description="¡Cuidado! Una vez que lo hagas, no habrá vuelta atrás... La magia del juego lo borrará para siempre."
        confirmLabel="Desterrar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
      />

      <DialogConfirm
        open={confirmClear}
        title="¿Limpiar la lista?"
        description="Eliminarás a todos los jugadores agregados hasta el momento."
        confirmLabel="Limpiar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />
    </div>
  );
}


