import type { Category } from "@/lib/categories/types";

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section
      id="categorias"
      aria-labelledby="categories-title"
      className="space-y-10 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-100 px-6 py-12 shadow-lg sm:px-10"
    >
      <header className="space-y-3">
        <h2
          id="categories-title"
          className="text-balance text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          Categorías listas para jugar
        </h2>
        <p className="text-pretty text-sm text-slate-600 sm:text-base">
          Explora palabras pensadas para distintos niveles de dificultad. Puedes
          combinarlas en la categoría Random o personalizarlas más adelante.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                {category.locale.toUpperCase()}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {category.description}
              </p>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {category.words.length} palabras disponibles
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}




