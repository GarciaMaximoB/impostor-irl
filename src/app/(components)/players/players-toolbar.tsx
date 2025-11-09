"use client";

import clsx from "clsx";
import { MINIMUM_PLAYERS } from "@/lib/game/session";

interface PlayersToolbarProps {
  total: number;
  duplicateNames: string[];
  hasMinimumPlayers: boolean;
  onClear: () => void;
  disableClear?: boolean;
}

export function PlayersToolbar({
  total,
  duplicateNames,
  hasMinimumPlayers,
  onClear,
  disableClear = false,
}: PlayersToolbarProps) {
  const duplicateCount = duplicateNames.length;
  const hasIssues = !hasMinimumPlayers || duplicateCount > 0;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Lista de jugadores
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total} {total === 1 ? "jugador" : "jugadores"} en la lista.
        </p>
        <p
          className={clsx(
            "mt-1 text-xs font-medium uppercase tracking-wide",
            hasIssues
              ? "text-amber-600 dark:text-amber-400"
              : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {hasIssues
            ? issuesLabel({
                hasMinimumPlayers,
                duplicateCount,
              })
            : "Listo para guardar"}
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        disabled={disableClear || total === 0}
        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
      >
        Limpiar lista
      </button>
    </div>
  );
}

function issuesLabel({
  hasMinimumPlayers,
  duplicateCount,
}: {
  hasMinimumPlayers: boolean;
  duplicateCount: number;
}): string {
  if (!hasMinimumPlayers) {
    return `Agrega al menos ${MINIMUM_PLAYERS} jugadores.`;
  }
  if (duplicateCount > 0) {
    return duplicateCount === 1
      ? "Resuelve 1 nombre duplicado."
      : `Resuelve ${duplicateCount} nombres duplicados.`;
  }
  return "Revisa la lista antes de continuar.";
}


