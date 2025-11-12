"use client";

import { motion } from "framer-motion";
import type { Player } from "@/lib/players/types";
import clsx from "clsx";

interface PlayerVoteCardProps {
  player: Player;
  onClick: () => void;
  index?: number;
}

export function PlayerVoteCard({
  player,
  onClick,
  index = 0,
}: PlayerVoteCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "group relative w-full overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 text-left shadow-lg transition-all duration-300 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:hover:border-rose-500",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-transparent to-rose-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 text-2xl font-bold text-rose-600 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:from-rose-200 group-hover:to-rose-300 dark:from-rose-900/30 dark:to-rose-800/30 dark:text-rose-400"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {player.name.charAt(0).toUpperCase()}
        </motion.div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400">
            {player.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Toca para eliminar
          </p>
        </div>

        <motion.div
          className="shrink-0 text-slate-400 transition-transform duration-300 group-hover:text-rose-500 dark:text-slate-500"
          whileHover={{ x: 4 }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}

