import type { Category } from "@/lib/categories/types";
import { MINIMUM_PLAYERS } from "@/lib/game/session";
import type { Player } from "@/lib/game/types";

export type AssignRolesGuardErrorCode =
  | "NOT_ENOUGH_PLAYERS"
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_EMPTY";

export interface AssignRolesGuardError {
  code: AssignRolesGuardErrorCode;
  message: string;
}

export type AssignRolesGuardResult =
  | { success: true }
  | { success: false; error: AssignRolesGuardError };

interface GuardInput {
  players: Player[];
  category: Category | undefined;
}

export function assignRolesGuard({
  players,
  category,
}: GuardInput): AssignRolesGuardResult {
  if (players.length < MINIMUM_PLAYERS) {
    return {
      success: false,
      error: {
        code: "NOT_ENOUGH_PLAYERS",
        message: "Agrega al menos 4 jugadores para comenzar.",
      },
    };
  }

  if (!category) {
    return {
      success: false,
      error: {
        code: "CATEGORY_NOT_FOUND",
        message: "Selecciona una categoría válida antes de continuar.",
      },
    };
  }

  if (category.words.length === 0) {
    return {
      success: false,
      error: {
        code: "CATEGORY_EMPTY",
        message:
          "La categoría seleccionada no tiene palabras activas. Elige otra categoría.",
      },
    };
  }

  return { success: true };
}
