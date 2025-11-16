import type { Category } from "@/lib/categories/types";
import famososArgentinos from "@/data/categories/famosos-argentinos.json";
import famososInternacionales from "@/data/categories/famosos-internacionales.json";
import futbolistasArgentinos from "@/data/categories/futbolistas-argentinos-reconocidos.json";
import futbolistasInternacionales from "@/data/categories/futbolistas-internacionales-reconocidos.json";
import objetos from "@/data/categories/objetos.json";
import presidentesArgentinos from "@/data/categories/presidentes-argentinos.json";
import sucesosHistoricos from "@/data/categories/sucesos-historicos.json";
import personajesHistoricos from "@/data/categories/personajes-historicos.json";
import comidas from "@/data/categories/comidas.json";
import profesoresET24 from "@/data/categories/profesores-et24.json";


export const CATEGORY_CATALOG: Category[] = [
  famososArgentinos,
  famososInternacionales,
  futbolistasArgentinos,
  futbolistasInternacionales,
  objetos,
  presidentesArgentinos,
  sucesosHistoricos,
  personajesHistoricos,
  comidas,
  profesoresET24,
];

export function getCategoryById(id: string | undefined): Category | undefined {
  if (!id) {
    return undefined;
  }

  return CATEGORY_CATALOG.find((category) => category.id === id);
}


