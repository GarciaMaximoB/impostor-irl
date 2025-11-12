interface PlayerStepperProps {
  currentIndex: number;
  totalPlayers: number;
  progress: number;
}

export function PlayerStepper({
  currentIndex,
  totalPlayers,
  progress,
}: PlayerStepperProps) {
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <span className="font-medium">
          Jugador {currentIndex + 1} de {totalPlayers}
        </span>
        <span className="text-xs">
          {Math.round(progress)}% completado
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-300 ease-out dark:bg-white"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso: ${Math.round(progress)}%`}
        />
      </div>
    </div>
  );
}

