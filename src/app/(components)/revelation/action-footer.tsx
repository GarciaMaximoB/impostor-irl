"use client";

import { motion } from "framer-motion";

interface ActionFooterProps {
  onComplete: () => void;
  isLastPlayer: boolean;
}

export function ActionFooter({
  onComplete,
  isLastPlayer,
}: ActionFooterProps) {
  return (
    <div className="flex w-full max-w-md justify-center md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <motion.button
        type="button"
        onClick={onComplete}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
      >
        {isLastPlayer ? "Finalizar" : "Terminé"}
      </motion.button>
    </div>
  );
}

