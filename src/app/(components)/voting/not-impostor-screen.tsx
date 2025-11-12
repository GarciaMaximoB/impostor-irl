"use client";

import { motion } from "framer-motion";
import { useSound } from "@/lib/audio/use-sound";

interface NotImpostorScreenProps {
  playerName: string;
  onContinue: () => void;
}

export function NotImpostorScreen({
  playerName,
  onContinue,
}: NotImpostorScreenProps) {
  // Reproducir sonido de pérdida al montar el componente
  useSound("/sounds/lose.mp3", {
    volume: 0.6,
    playOnMount: true,
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-600 via-red-600 to-red-800 px-4 py-8 text-center"
    >
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            >
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              {playerName} no era el impostor
            </h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-white/90 sm:text-2xl"
            >
              Deben seguir intentando encontrar al impostor.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <motion.button
              type="button"
              onClick={onContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-2xl shadow-black/20 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Seguir jugando
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}

