"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import clsx from "clsx";

interface NameValidationResult {
  success: true;
  value: string;
}

interface NameValidationError {
  success: false;
  error: string;
}

type ValidateName = (
  input: string
) => NameValidationResult | NameValidationError;

interface PlayerFormProps {
  onSubmit: (name: string) => void;
  validateName: ValidateName;
  disabled?: boolean;
}

export function PlayerForm({
  onSubmit,
  validateName,
  disabled = false,
}: PlayerFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);

  const isSubmitDisabled = useMemo(() => {
    return disabled || Boolean(error) || name.trim().length === 0;
  }, [disabled, error, name]);

  const runValidation = useCallback(
    (value: string, markTouched = false) => {
      if (markTouched) {
        setTouched(true);
      }

      const result = validateName(value);
      if (!result.success) {
        setError(result.error);
        return null;
      }

      setError(null);
      return result.value;
    },
    [validateName]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setName(nextValue);

    if (touched) {
      runValidation(nextValue);
    }
  };

  const handleBlur = () => {
    runValidation(name, true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitized = runValidation(name, true);
    if (!sanitized) {
      return;
    }

    onSubmit(sanitized);
    setName("");
    setTouched(false);
    setError(null);
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
    >
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Agregar jugador
      </label>
      <div className="mt-2 flex flex-col gap-3 md:flex-row">
        <input
          id={inputId}
          name="playerName"
          type="text"
          placeholder="Nombre del jugador"
          autoComplete="off"
          value={name}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={24}
          className={clsx(
            "w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700",
            error &&
              "border-rose-500 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:focus:border-rose-400"
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white md:w-auto"
        >
          Agregar
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Nombres únicos entre 1 y 24 caracteres. Se sanitizan espacios y
        caracteres especiales no permitidos.
      </p>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-rose-600 dark:text-rose-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}
