"use client";

import { memo } from "react";
import type { Player } from "@/lib/game/types";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import clsx from "clsx";

interface PlayersSummaryCardProps {
  players: Player[];
}

export const PlayersSummaryCard = memo(function PlayersSummaryCard({
  players,
}: PlayersSummaryCardProps) {
  const totalPlayers = players.length;
  const duplicateNames = findDuplicateNames(players);
  const hasWarnings = duplicateNames.length > 0;

  return (
    <section
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-900/70",
      )}
      aria-labelledby="players-summary-heading"
    >
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2
            id="players-summary-heading"
            className="text-base font-semibold text-slate-900 dark:text-white"
          >
            Jugadores confirmados
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Se requieren al menos {MINIMUM_PLAYERS} jugadores únicos para iniciar el juego.
          </p>
        </div>
        <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-slate-900 px-2 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
          {totalPlayers}
        </span>
      </header>

      <ul className="mt-4 space-y-2" aria-describedby="players-summary-heading">
        {players.slice(0, 6).map((player) => (
          <li
            key={player.id}
            className="flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
          >
            <span className="truncate">{player.name}</span>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Jugador
            </span>
          </li>
        ))}
        {players.length > 6 && (
          <li className="text-sm text-slate-500 dark:text-slate-400">
            y {players.length - 6} jugadores más...
          </li>
        )}
        {players.length === 0 && (
          <li className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400 dark:border-slate-700">
            Agrega jugadores desde la pantalla de gestión para comenzar.
          </li>
        )}
      </ul>

      <footer className="mt-4">
        {hasWarnings ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-400 bg-amber-100/60 px-4 py-3 text-sm text-amber-900 dark:border-amber-500 dark:bg-amber-400/10 dark:text-amber-300"
          >
            <p className="font-medium">
              {warningMessage(totalPlayers, duplicateNames.length > 0)}
            </p>
            {duplicateNames.length > 0 && (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-xs">
                {duplicateNames.map((name) => (
                  <li key={name}>Hay más de un jugador llamado "{name}".</li>
                ))}
              </ul>
            )}
          </div>
        ) : totalPlayers < MINIMUM_PLAYERS ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Agrega más jugadores para llegar a {MINIMUM_PLAYERS} y poder iniciar el juego.
          </p>
        ) : (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Todo listo: tienes suficientes jugadores únicos para iniciar.
          </p>
        )}
      </footer>
    </section>
  );
});

function findDuplicateNames(players: Player[]): string[] {
  const sanitizedNames = players.map((player) =>
    player.name.trim().toLowerCase(),
  );
  const duplicates = new Set<string>();
  const seen = new Set<string>();

  sanitizedNames.forEach((name, index) => {
    if (name.length === 0) {
      return;
    }

    if (seen.has(name)) {
      duplicates.add(players[index].name);
      return;
    }

    seen.add(name);
  });

  return Array.from(duplicates);
}

function warningMessage(totalPlayers: number, hasDuplicates: boolean): string {
  if (hasDuplicates) {
    return "Cada jugador debe tener un nombre único.";
  }

  return "Revisa la lista de jugadores antes de continuar.";
}


