"use client";

import { useEffect, useId, useRef } from "react";
import clsx from "clsx";

interface DialogConfirmProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DialogConfirm({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: DialogConfirmProps) {
  const dialogId = useId();
  const descriptionId = `${dialogId}-description`;
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    confirmButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 backdrop-blur-sm"
      role="presentation"
      aria-hidden={false}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={dialogId}
        aria-describedby={descriptionId}
        className={clsx(
          "w-full max-w-sm rounded-3xl border border-slate-700/50 bg-white p-6 shadow-2xl shadow-slate-950/40 transition dark:border-slate-700 dark:bg-slate-900",
        )}
      >
        <h2
          id={dialogId}
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-sm text-slate-600 dark:text-slate-300"
        >
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:outline-white sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/40 transition hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:bg-rose-500 dark:hover:bg-rose-400 sm:w-auto"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}



