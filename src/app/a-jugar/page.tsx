"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  useGameSessionState,
  useGameSessionDispatch,
} from "@/app/(components)/game-session-provider";

export default function InGamePage() {
  const router = useRouter();
  const { assignment } = useGameSessionState();
  const dispatch = useGameSessionDispatch();

  useEffect(() => {
    if (!assignment.current) {
      router.replace("/asignacion");
      return;
    }
    dispatch({ type: "SET_STATUS", payload: "in-game" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.current, router, dispatch]);

  const handleStartVoting = useCallback(() => {
    router.push("/votacion");
  }, [router]);

  if (!assignment.current) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-white to-white px-4 py-8 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <header className="mb-8 w-full max-w-2xl">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <Link
            href="/asignacion"
            className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
          >
            ← Volver
          </Link>
        </motion.div>
      </header>

      <main className="flex w-full max-w-4xl flex-col items-center gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <motion.h1
              className="text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl dark:text-white"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              ¡A jugar!
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-slate-600 md:text-xl lg:text-2xl dark:text-slate-300"
            >
              Discutan entre ustedes y descubran quién es el impostor.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <motion.button
              type="button"
              onClick={handleStartVoting}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl shadow-rose-500/30 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                A votar
                <motion.svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
