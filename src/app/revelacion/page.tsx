"use client";

import Link from "next/link";

export default function RevelationPlaceholderPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 via-white to-white px-4 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <span className="inline-flex items-center rounded-full bg-slate-900/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200">
          Pantalla 04 · En construcción
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Próximamente: revelación por jugador
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Estamos trabajando en la experiencia de revelación individual. Mientras
          tanto, puedes volver al resumen de asignación para rehacer el sorteo o
          ajustar la configuración.
        </p>
        <Link
          href="/asignacion"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:shadow-white/30 dark:hover:bg-slate-100 dark:focus-visible:outline-white"
        >
          Volver a asignación de roles
        </Link>
      </div>
    </div>
  );
}


