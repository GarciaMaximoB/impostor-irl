import type { AssignmentState, Player } from "@/lib/game/types";

interface AssignmentSummaryProps {
  assignment: AssignmentState;
  players: Player[];
  categoryName: string;
  roomName?: string;
}

export function AssignmentSummary({
  assignment,
  players,
  categoryName,
  roomName,
}: AssignmentSummaryProps) {
  const playersById = new Map(players.map((player) => [player.id, player]));

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <header className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
          Resumen de la asignación
        </span>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Orden y preparativos de revelación
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Confirma la configuración de la ronda. La palabra y el impostor siguen
          protegidos hasta la pantalla de revelado.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/40">
        <dl className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500 dark:text-slate-400">
              Categoría seleccionada
            </dt>
            <dd className="mt-1 text-base text-slate-800 dark:text-slate-100">
              {categoryName}
            </dd>
          </div>
          {roomName && (
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Sala
              </dt>
              <dd className="mt-1 text-base text-slate-800 dark:text-slate-100">
                {roomName}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          La palabra secreta está lista, pero nadie la verá hasta su turno.
          Mantén la pantalla cubierta cuando pases el dispositivo.
        </div>
      </div>

      <aside className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800 shadow-sm dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-200">
        Cada jugador verá su rol de manera privada. Sigue el orden indicado y
        evita revelar pistas fuera de su turno.
      </aside>

      <section>
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Orden de revelación
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {players.length} jugadores
          </span>
        </header>
        <ol className="mt-4 space-y-3" aria-live="polite">
          {assignment.revealOrder.map((playerId, index) => {
            const player = playersById.get(playerId);
            return (
              <li
                key={playerId}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-base text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-900">
                    {index + 1}
                  </span>
                  <span>{player?.name ?? "Jugador desconocido"}</span>
                </div>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  #{player?.order !== undefined ? player.order + 1 : "?"}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </section>
  );
}
