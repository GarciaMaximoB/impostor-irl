"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type PrimaryCTAProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryCTA({ className, ...props }: PrimaryCTAProps) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        "inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white",
        className,
      )}
    />
  );
}

