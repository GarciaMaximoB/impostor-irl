"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssignmentControls } from "@/app/(components)/assignment/assignment-controls";
import { AssignmentSummary } from "@/app/(components)/assignment/assignment-summary";
import {
  useGameSessionDispatch,
  useGameSessionState,
} from "@/app/(components)/game-session-provider";
import { assignRoles, AssignRolesError } from "@/lib/game/assign-roles";
import { assignRolesGuard } from "@/lib/game/assign-roles-guard";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import { getCategoryById } from "@/lib/categories/catalog";

export default function AssignmentPage() {
  const router = useRouter();
  const { players, settings, assignment } = useGameSessionState();
  const dispatch = useGameSessionDispatch();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const category = useMemo(
    () => getCategoryById(settings.categoryId),
    [settings.categoryId]
  );

  const guardResult = useMemo(() => {
    if (!category) {
      return {
        success: false as const,
        error: {
          message: "Selecciona una categoría válida antes de continuar.",
        },
      };
    }
    return assignRolesGuard({ players, category });
  }, [category, players]);

  useEffect(() => {
    if (players.length < MINIMUM_PLAYERS) {
      router.replace("/");
    }
  }, [players.length, router]);

  const generateAssignment = useCallback(() => {
    if (!category) {
      setErrorMessage(
        "Selecciona una categoría válida antes de continuar con la asignación."
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const nextAssignment = assignRoles({ players, category });

      dispatch({
        type: "SET_ASSIGNMENT",
        payload: { assignment: nextAssignment, mode: "initial" },
      });

      setInfoMessage("Sorteo listo. La palabra se revelará turno a turno.");
    } catch (error) {
      setInfoMessage(null);
      if (error instanceof AssignRolesError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "No pudimos generar la asignación. Intenta nuevamente."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }, [category, dispatch, players]);

  const assignmentData = assignment.current;
  
  useEffect(() => {
    if (
      guardResult.success &&
      !assignmentData &&
      !isGenerating &&
      players.length >= MINIMUM_PLAYERS
    ) {
      generateAssignment();
    }
  }, [
    assignmentData,
    generateAssignment,
    guardResult.success,
    isGenerating,
    players.length,
  ]);

  const handleStartReveal = useCallback(() => {
    if (!assignmentData) {
      setErrorMessage("Genera la asignación antes de comenzar la revelación.");
      return;
    }
    router.push("/revelacion");
  }, [assignmentData, router]);

  const handleReroll = useCallback(() => {
    if (!category) {
      setErrorMessage(
        "Selecciona una categoría válida antes de continuar con la asignación."
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const nextAssignment = assignRoles({ players, category });

      dispatch({
        type: "SET_ASSIGNMENT",
        payload: { assignment: nextAssignment, mode: "reroll" },
      });

      setInfoMessage(
        "Sorteo actualizado. La palabra se revelará turno a turno."
      );
    } catch (error) {
      setInfoMessage(null);
      if (error instanceof AssignRolesError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "No pudimos generar la asignación. Intenta nuevamente."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  }, [category, dispatch, players]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
              Pantalla 03 · Asignación de roles
            </span>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
              Prepara la revelación sin mostrar la palabra todavía.
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Organiza el orden en que cada jugador verá su rol y confirma que
              todo el grupo está listo. La palabra permanecerá oculta hasta el
              turno de cada persona.
            </p>
            <ActionsRow>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                ← Volver a configuración
              </Link>
              <Link
                href="/players"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Gestionar jugadores
              </Link>
            </ActionsRow>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:px-8">
        <div className="space-y-6">
          {guardResult.success && assignmentData ? (
            <AssignmentSummary
              assignment={assignmentData}
              players={players}
              categoryName={category?.name ?? "Sin categoría"}
              roomName={settings.roomName}
            />
          ) : (
            <BlockingMessage
              title="No pudimos generar la asignación"
              message={
                guardResult.success
                  ? "Genera la asignación para continuar."
                  : guardResult.error.message
              }
            />
          )}
        </div>

        <aside className="space-y-6">
          {errorMessage && (
            <div
              role="alert"
              className="rounded-3xl border border-rose-400 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {errorMessage}
            </div>
          )}

          <AssignmentControls
            canStart={Boolean(assignment.current) && guardResult.success}
            isGenerating={isGenerating}
            onStart={handleStartReveal}
            onReroll={handleReroll}
            infoMessage={infoMessage}
            rerolls={assignment.rerolls}
          />
        </aside>
      </main>
    </div>
  );
}

function ActionsRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function BlockingMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Volver a configuración
        </Link>
        <Link
          href="/players"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Revisar jugadores
        </Link>
      </div>
    </section>
  );
}
