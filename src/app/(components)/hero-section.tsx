import Link from "next/link";

interface HeroSectionProps {
  categoryCount: number;
  minimumPlayers: number;
}

export function HeroSection({
  categoryCount,
  minimumPlayers,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1f173f] via-[#271f5b] to-[#0d0b1f] px-4 py-12 text-white shadow-2xl md:px-8 md:py-16 lg:px-10 lg:py-20"
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute right-[-20%] top-[-10%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,154,158,0.55),rgba(36,25,85,0))]" />
        <div className="absolute bottom-[-25%] left-[-10%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_bottom,rgba(94,231,223,0.5),rgba(36,25,85,0))]" />
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-wide backdrop-blur">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-300"
              aria-hidden
            />
            Sin cuentas, sin fricción
          </div>
          <div className="space-y-4">
            <h1
              id="hero-title"
              className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl"
            >
              El Impostor
              <span className="block text-base font-normal text-emerald-200 md:text-lg lg:text-xl">
                Asigna roles y palabra secreta en menos de un minuto.
              </span>
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-slate-100 md:text-base lg:text-lg">
              Diseñado para partidas presenciales: configura la sala, reparte la
              palabra y designa al impostor con una interfaz mobile-first
              pensada para pasar el dispositivo entre jugadores.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-sm font-medium md:flex-row">
          <Link
            href="#flujo"
            className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-6 py-3 text-slate-900 transition hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-100"
          >
            Ver cómo funciona
          </Link>
          <Link
            href="#categorias"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white transition hover:border-white/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Explorar categorías
          </Link>
        </div>
        <dl className="grid gap-4 md:gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur">
            <dt className="text-xs uppercase tracking-widest text-white/70">
              Jugadores mínimos
            </dt>
            <dd className="mt-2 text-3xl font-semibold">{minimumPlayers}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur">
            <dt className="text-xs uppercase tracking-widest text-white/70">
              Categorías iniciales
            </dt>
            <dd className="mt-2 text-3xl font-semibold">{categoryCount}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur">
            <dt className="text-xs uppercase tracking-widest text-white/70">
              Flujo guiado
            </dt>
            <dd className="mt-2 text-3xl font-semibold">Paso a paso</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
