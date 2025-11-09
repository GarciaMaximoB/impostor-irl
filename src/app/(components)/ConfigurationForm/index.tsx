"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import clsx from "clsx";
import type { Category } from "@/lib/categories/types";
import type { GameSessionSettings } from "@/lib/game/types";
import { settingsSchema } from "@/lib/validation/settings";

interface ConfigurationFormProps {
  categories: Category[];
  defaultValue?: GameSessionSettings;
  busy?: boolean;
  onSubmit: (settings: GameSessionSettings) => void;
  errorMessage?: string;
  onHighContrastToggle?: (enabled: boolean) => void;
}

type FieldErrors = Partial<Record<keyof GameSessionSettings, string>>;

export function ConfigurationForm({
  categories,
  defaultValue,
  busy = false,
  onSubmit,
  errorMessage,
  onHighContrastToggle,
}: ConfigurationFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [roomName, setRoomName] = useState(defaultValue?.roomName ?? "");
  const [categoryId, setCategoryId] = useState(defaultValue?.categoryId ?? "");
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);

  const formId = useId();
  const roomInputId = `${formId}-room`;
  const categorySelectId = `${formId}-category`;
  const highContrastToggleId = `${formId}-contrast`;

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const candidate = {
      roomName: (formData.get("roomName") as string | null) ?? undefined,
      categoryId: (formData.get("categoryId") as string | null) ?? "",
    };

    const parsed = settingsSchema.safeParse(candidate);

    if (!parsed.success) {
      const nextFieldErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === "roomName" || path === "categoryId") {
          nextFieldErrors[path] = issue.message;
        }
      });
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    onSubmit(parsed.data);
  };

  const handleHighContrastToggle = () => {
    setHighContrastEnabled((current) => {
      const nextValue = !current;
      onHighContrastToggle?.(nextValue);
      return nextValue;
    });
  };

  return (
    <form
      id={formId}
      className="space-y-6"
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={errorMessage ? `${formId}-error-summary` : undefined}
    >
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <header>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Configuración general
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personaliza la partida antes de comenzar la asignación de roles.
          </p>
        </header>

        <div className="space-y-4">
          <div>
            <label
              htmlFor={roomInputId}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nombre de la sala (opcional)
            </label>
            <input
              id={roomInputId}
              name="roomName"
              type="text"
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              maxLength={40}
              autoComplete="off"
              className={clsx(
                "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700",
                fieldErrors.roomName &&
                  "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
              )}
              aria-invalid={Boolean(fieldErrors.roomName)}
              aria-describedby={
                fieldErrors.roomName ? `${roomInputId}-error` : undefined
              }
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Máximo 40 caracteres. Usa nombres descriptivos como “Reunión
              viernes”.
            </p>
            {fieldErrors.roomName && (
              <p
                id={`${roomInputId}-error`}
                className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                role="alert"
              >
                {fieldErrors.roomName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={categorySelectId}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Categoría de palabras
            </label>
            <select
              id={categorySelectId}
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={clsx(
                "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700",
                fieldErrors.categoryId &&
                  "border-rose-500 focus:border-rose-500 focus:ring-rose-200"
              )}
              aria-invalid={Boolean(fieldErrors.categoryId)}
              aria-describedby={
                fieldErrors.categoryId ? `${categorySelectId}-error` : undefined
              }
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && (
              <p
                id={`${categorySelectId}-error`}
                className="mt-2 text-sm text-rose-600 dark:text-rose-400"
                role="alert"
              >
                {fieldErrors.categoryId}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Modo alto contraste
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ajusta la paleta para mejorar la visibilidad en entornos
              luminosos.
            </p>
          </div>
          <button
            id={highContrastToggleId}
            type="button"
            onClick={handleHighContrastToggle}
            className={clsx(
              "relative inline-flex h-10 w-16 items-center rounded-full border border-transparent px-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
              highContrastEnabled
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            )}
            aria-pressed={highContrastEnabled}
            aria-label="Activar modo alto contraste"
          >
            <span
              className={clsx(
                "inline-flex h-8 w-8 translate-x-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow transition dark:bg-slate-900 dark:text-white",
                highContrastEnabled && "translate-x-8"
              )}
            >
              {highContrastEnabled ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      </section>

      {errorMessage && (
        <div
          id={`${formId}-error-summary`}
          role="alert"
          className="rounded-2xl border border-rose-400 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="/players"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Gestionar jugadores
        </a>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white sm:w-auto"
        >
          {busy ? "Validando..." : "Iniciar asignación"}
        </button>
      </div>
    </form>
  );
}
