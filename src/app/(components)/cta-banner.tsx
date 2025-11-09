import Link from "next/link";

export function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-title"
      className="rounded-3xl bg-slate-900 px-6 py-12 text-white shadow-2xl sm:px-10"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2
            id="cta-title"
            className="text-balance text-2xl font-semibold sm:text-3xl"
          >
            ¿Listo para descubrir al impostor?
          </h2>
          <p className="text-pretty text-sm text-slate-200 sm:text-base">
            Prepara la ronda desde tu dispositivo y deja que la app guíe la
            asignación de roles. Todo queda en tu control.
          </p>
        </div>
        <Link
          href="#hero"
          className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-100"
        >
          Configurar partida
        </Link>
      </div>
    </section>
  );
}

