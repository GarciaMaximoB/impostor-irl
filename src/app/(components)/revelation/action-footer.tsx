"use client";

import { motion } from "framer-motion";

interface ActionFooterProps {
  onComplete: () => void;
  onShowAgain: () => void;
  isLastPlayer: boolean;
}

export function ActionFooter({
  onComplete,
  onShowAgain,
  isLastPlayer,
}: ActionFooterProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <motion.button
        type="button"
        onClick={onShowAgain}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
      >
        Mostrar de nuevo
      </motion.button>
      <motion.button
        type="button"
        onClick={onComplete}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
      >
        {isLastPlayer ? "Finalizar" : "Terminé"}
      </motion.button>
    </div>
  );
}

