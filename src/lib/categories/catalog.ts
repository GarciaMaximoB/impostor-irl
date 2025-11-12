import type { Category } from "@/lib/categories/types";
import famososArgentinos from "@/data/categories/famosos-argentinos.json";
import famososInternacionales from "@/data/categories/famosos-internacionales.json";
import futbolistasArgentinos from "@/data/categories/futbolistas-argentinos-reconocidos.json";
import futbolistasInternacionales from "@/data/categories/futbolistas-internacionales-reconocidos.json";
import objetos from "@/data/categories/objetos.json";

export const CATEGORY_CATALOG: Category[] = [
  famososArgentinos,
  famososInternacionales,
  futbolistasArgentinos,
  futbolistasInternacionales,
  objetos,
];

export function getCategoryById(id: string | undefined): Category | undefined {
  if (!id) {
    return undefined;
  }

  return CATEGORY_CATALOG.find((category) => category.id === id);
}


