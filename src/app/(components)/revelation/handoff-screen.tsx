"use client";

import { motion } from "framer-motion";

interface HandoffScreenProps {
  playerName: string;
  onReady: () => void;
}

export function HandoffScreen({ playerName, onReady }: HandoffScreenProps) {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400"
        >
          Preparar turno
        </motion.p>
        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
        >
          Pasa el dispositivo a {playerName}
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-base text-slate-600 dark:text-slate-300"
        >
          Cuando {playerName} diga que está listo, presiona el botón para mostrar su rol.
        </motion.p>
      </motion.div>
      <motion.button
        type="button"
        onClick={onReady}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
      >
        Estoy listo
      </motion.button>
    </div>
  );
}

