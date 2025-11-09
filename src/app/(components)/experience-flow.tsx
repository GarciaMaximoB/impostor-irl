interface FlowStep {
  title: string;
  description: string;
  cta: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    title: "Configura la sala",
    description:
      "Añade jugadores únicos, define la categoría y asegura que cada palabra está disponible antes de comenzar.",
    cta: "Validación automática de duplicados y mínimo de 4 jugadores.",
  },
  {
    title: "Asigna palabra e impostor",
    description:
      "Genera la palabra con `crypto.getRandomValues` y designa un único impostor por ronda para garantizar imparcialidad.",
    cta: "Todo ocurre en memoria hasta finalizar la asignación.",
  },
  {
    title: "Revela y juega",
    description:
      "Cada jugador confirma haber visto su rol antes de pasar al siguiente. Después, la pantalla “¡A jugar!” te deja repetir la ronda.",
    cta: "Acceso directo a la siguiente ronda sin perder configuraciones.",
  },
];

export function ExperienceFlow() {
  return (
    <section
      id="flujo"
      aria-labelledby="flow-title"
      className="space-y-10 rounded-3xl bg-slate-900 px-6 py-12 text-white shadow-2xl sm:px-10"
    >
      <header className="space-y-3">
        <h2
          id="flow-title"
          className="text-balance text-2xl font-semibold sm:text-3xl"
        >
          Flujo guiado de asignación de roles
        </h2>
        <p className="text-pretty text-sm text-slate-200 sm:text-base">
          La experiencia está optimizada para pasar el dispositivo entre
          jugadores, manteniendo el suspenso intacto mientras la app controla
          cada paso por ti.
        </p>
      </header>
      <ol className="grid gap-6 sm:grid-cols-3">
        {FLOW_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-6 backdrop-blur"
          >
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300 font-semibold text-slate-900"
              aria-hidden
            >
              {index + 1}
            </span>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-slate-200">{step.description}</p>
            </div>
            <p className="mt-auto text-xs font-medium uppercase tracking-wide text-emerald-200">
              {step.cta}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

