"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { useSound } from "@/lib/audio/use-sound";

interface VictoryScreenProps {
  winner: "impostor" | "non-impostors";
  onNewRound?: () => void;
}

export function VictoryScreen({ winner, onNewRound }: VictoryScreenProps) {
  const isImpostorWin = winner === "impostor";

  // Reproducir sonido de victoria al montar el componente
  useSound("/sounds/victory.mp3", {
    volume: 0.6,
    playOnMount: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center",
        isImpostorWin
          ? "bg-gradient-to-br from-red-600 via-red-700 to-red-800"
          : "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
      )}
    >
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <motion.h1
              className="text-5xl font-bold text-white sm:text-6xl md:text-7xl"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {isImpostorWin ? "¡El impostor ganó!" : "¡Los inocentes ganaron!"}
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-white/90 sm:text-2xl"
            >
              {isImpostorWin
                ? "El impostor logró sobrevivir hasta el final."
                : "El impostor fue descubierto y eliminado."}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            {onNewRound ? (
              <motion.button
                type="button"
                onClick={onNewRound}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-2xl shadow-black/20 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Nueva ronda
              </motion.button>
            ) : null}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/asignacion"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/80 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Volver a configuración
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
