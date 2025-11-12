interface AssignmentControlsProps {
  canStart: boolean;
  isGenerating: boolean;
  onStart: () => void;
  infoMessage?: string | null;
}

export function AssignmentControls({
  canStart,
  isGenerating,
  onStart,
  infoMessage,
}: AssignmentControlsProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Control de la ronda
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cuando todo esté listo, inicia la secuencia de revelación para que
          cada jugador vea su rol de forma privada.
        </p>
      </header>

      {infoMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-500/10 dark:text-emerald-200">
          {infoMessage}
        </div>
      )}

      <button
        type="button"
        onClick={onStart}
        disabled={!canStart || isGenerating}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
      >
        {isGenerating ? "Preparando..." : "Comenzar revelación"}
      </button>
    </section>
  );
}

