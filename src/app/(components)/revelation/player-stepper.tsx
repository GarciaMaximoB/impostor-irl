"use client";

import { motion } from "framer-motion";

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
      <motion.div
        key={`player-${currentIndex}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400"
      >
        <span className="font-medium">
          Jugador {currentIndex + 1} de {totalPlayers}
        </span>
        <span className="text-xs">
          {Math.round(progress)}% completado
        </span>
      </motion.div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-slate-900 dark:bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

