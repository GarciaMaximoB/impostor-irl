import type { Player } from "@/lib/game/types";

interface RoleCardProps {
  player: Player;
  word: string;
  isImpostor: boolean;
}

export function RoleCard({ player, word, isImpostor }: RoleCardProps) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 sm:text-3xl">
          {player.name}
        </h2>
      </div>

      <div
        className={`
          relative overflow-hidden rounded-3xl border-2 p-8 shadow-2xl transition-all
          ${
            isImpostor
              ? "border-rose-500 bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 dark:border-rose-400 dark:from-rose-950/30 dark:via-rose-900/20 dark:to-rose-950/30"
              : "border-emerald-500 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:border-emerald-400 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-emerald-950/30"
          }
        `}
      >
        {isImpostor ? (
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full bg-rose-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg dark:bg-rose-500">
              Impostor
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
              Tu rol es: <strong>IMPOSTOR</strong>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No conozcas la palabra secreta. Deberás descubrirla durante el
              juego.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg dark:bg-emerald-500">
              Palabra secreta
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              {word}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Esta es tu palabra. No la reveles a otros jugadores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

