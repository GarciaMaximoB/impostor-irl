interface Feature {
  title: string;
  description: string;
  emphasis: string;
}

const FEATURES: Feature[] = [
  {
    title: "Configuración guiada",
    emphasis: "Configura en segundos",
    description:
      "Selecciona categoría, valida jugadores y guarda la sesión para reutilizarla en la siguiente ronda.",
  },
  {
    title: "Reparto seguro",
    emphasis: "Rol privado por jugador",
    description:
      "El flujo obliga a confirmar cada pantalla antes de pasar el dispositivo, manteniendo el secreto a salvo.",
  },
  {
    title: "Control total local",
    emphasis: "Datos sin conexión",
    description:
      "Las palabras viven en tu dispositivo, listas para personalizar sin depender de cuentas ni servidores.",
  },
];

export function FeatureHighlights() {
  return (
    <section
      aria-labelledby="feature-title"
      className="space-y-8 rounded-3xl border border-slate-200/80 bg-white px-6 py-12 shadow-lg shadow-slate-900/5 backdrop-blur sm:px-10"
    >
      <div className="space-y-3">
        <h2
          id="feature-title"
          className="text-balance text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          Pensado para dirigir la partida sin distracciones
        </h2>
        <p className="text-pretty text-sm text-slate-600 sm:text-base">
          Reduce la fricción inicial con un flujo que valida reglas clave,
          protege la información confidencial y respeta la dinámica presencial
          del juego.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-6 shadow-inner shadow-white"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                {feature.emphasis}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}


