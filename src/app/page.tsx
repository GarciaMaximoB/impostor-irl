"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfigurationForm } from "@/app/(components)/ConfigurationForm";
import {
  useGameSessionDispatch,
  useGameSessionState,
} from "@/app/(components)/game-session-provider";
import { PlayersSummaryCard } from "@/app/(components)/players-summary-card";
import { CATEGORY_CATALOG, getCategoryById } from "@/lib/categories/catalog";
import { assignRolesGuard } from "@/lib/game/assign-roles-guard";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import type { GameSessionSettings } from "@/lib/game/types";
import { loadPlayers } from "@/lib/storage/players";
import { usePersistedSettings } from "@/lib/storage/use-persisted-settings";

function ConfigurationPage() {
  const router = useRouter();
  const { settings, players, status } = useGameSessionState();
  const dispatch = useGameSessionDispatch();
  const [guardError, setGuardError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleRestore = useCallback(
    (restoredSettings: GameSessionSettings) => {
      dispatch({ type: "RESTORE_SETTINGS", payload: restoredSettings });
    },
    [dispatch]
  );

  const { persist } = usePersistedSettings({ onRestore: handleRestore });

  useEffect(() => {
    const restoredPlayers = loadPlayers();
    if (Array.isArray(restoredPlayers) && restoredPlayers.length > 0) {
      dispatch({ type: "SET_PLAYERS", payload: restoredPlayers });
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  const handleSubmit = useCallback(
    (nextSettings: GameSessionSettings) => {
      setIsSubmitting(true);

      const category = getCategoryById(nextSettings.categoryId);
      const result = assignRolesGuard({ players, category });

      if (!result.success) {
        setGuardError(result.error.message);
        setIsSubmitting(false);
        return;
      }

      dispatch({ type: "SET_SETTINGS", payload: nextSettings });
      dispatch({ type: "SET_STATUS", payload: "ready" });
      persist(nextSettings);
      setGuardError(null);
      setIsSubmitting(false);
      router.push("/asignacion");
    },
    [dispatch, persist, players, router]
  );

  const defaultSettings = useMemo(() => settings, [settings]);
  const formKey = useMemo(
    () =>
      `${defaultSettings.categoryId}-${defaultSettings.roomName ?? "empty"}`,
    [defaultSettings.categoryId, defaultSettings.roomName]
  );

  const categoryCount = CATEGORY_CATALOG.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white pb-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-8">
          <span className="inline-flex w-fit items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
            Pantalla 01 · Configuración de partida
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-white">
            Personaliza tu partida y confirma las condiciones antes de asignar
            roles.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Selecciona la categoría de palabras, revisa la disponibilidad de
            jugadores y asegúrate de cumplir las reglas antes de pasar el
            dispositivo.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800">
              <span className="font-semibold text-slate-800 dark:text-white">
                {MINIMUM_PLAYERS}+
              </span>
              Jugadores requeridos
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800">
              <span className="font-semibold text-slate-800 dark:text-white">
                {categoryCount}
              </span>
              Categorías disponibles
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-800">
              Estado:{" "}
              <span className="font-semibold capitalize text-slate-800 dark:text-white">
                {status === "idle" ? "sin configurar" : status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] sm:px-8">
        <ConfigurationForm
          key={formKey}
          categories={CATEGORY_CATALOG}
          defaultValue={defaultSettings}
          busy={isSubmitting}
          errorMessage={guardError ?? undefined}
          onSubmit={handleSubmit}
          onHighContrastToggle={setHighContrast}
        />
        <div className="space-y-6">
          <PlayersSummaryCard players={players} />
          <aside className="rounded-2xl border border-slate-200 bg-white/70 p-5 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Próximos pasos
            </h2>
            <p className="mt-2">
              Cuando la configuración esté lista, avanza a la pantalla de
              asignación de roles. Puedes regresar a editar la configuración en
              cualquier momento antes de revelar la palabra.
            </p>
            <a
              href="/categories"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Administrar categorías
            </a>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return <ConfigurationPage />;
}
