"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import clsx from "clsx";
import type { Player } from "@/lib/players/types";

interface NameValidationResult {
  success: true;
  value: string;
}

interface NameValidationError {
  success: false;
  error: string;
}

type ValidateName = (
  input: string,
  currentId: string,
) => NameValidationResult | NameValidationError;

interface PlayerRowProps {
  player: Player;
  index: number;
  total: number;
  validateName: ValidateName;
  onUpdateName: (playerId: string, name: string) => void;
  onRemove: (player: Player) => void;
  onMoveUp: (player: Player) => void;
  onMoveDown: (player: Player) => void;
}

export function PlayerRow({
  player,
  index,
  total,
  validateName,
  onUpdateName,
  onRemove,
  onMoveUp,
  onMoveDown,
}: PlayerRowProps) {
  const [value, setValue] = useState(player.name);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputId = useId();

  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  const statusLabel = useMemo(
    () => `Jugador en posición ${index + 1} de ${total}`,
    [index, total],
  );

  const runValidation = useCallback(
    (name: string, markTouched = false) => {
      if (markTouched) {
        setTouched(true);
      }
      const result = validateName(name, player.id);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      setError(null);
      return result.value;
    },
    [player.id, validateName],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (touched) {
      runValidation(event.target.value);
    }
  };

  const handleBlur = () => {
    runValidation(value, true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized = runValidation(value, true);
    if (!sanitized || sanitized === player.name) {
      return;
    }
    onUpdateName(player.id, sanitized);
    setValue(sanitized);
    setTouched(false);
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLButtonElement).click();
    }
  };

  return (
    <li className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <span className="sr-only">{statusLabel}</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        noValidate
      >
        <div className="flex-1">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Jugador #{index + 1}
          </label>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={24}
            className={clsx(
              "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700",
              error &&
                "border-rose-500 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:focus:border-rose-400",
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          {error && (
            <p
              id={`${inputId}-error`}
              className="mt-2 text-xs text-rose-600 dark:text-rose-400"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMoveUp(player)}
            onKeyDown={handleKeyDown}
            disabled={!canMoveUp}
            aria-label={`Mover a ${player.name} hacia arriba`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(player)}
            onKeyDown={handleKeyDown}
            disabled={!canMoveDown}
            aria-label={`Mover a ${player.name} hacia abajo`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:outline-white"
          >
            ↓
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/20 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => onRemove(player)}
            className="inline-flex items-center justify-center rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-600 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:border-rose-500/60 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            Eliminar
          </button>
        </div>
      </form>
    </li>
  );
}


