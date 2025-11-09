import { describe, expect, it } from "vitest";
import { assignRolesGuard } from "@/lib/game/assign-roles-guard";
import type { Player } from "@/lib/game/types";
import type { Category } from "@/lib/categories/types";

const samplePlayers: Player[] = [
  { id: "1", name: "Ana", order: 0 },
  { id: "2", name: "Luis", order: 1 },
  { id: "3", name: "María", order: 2 },
  { id: "4", name: "Diego", order: 3 },
];

const sampleCategory: Category = {
  id: "objetos",
  name: "Objetos cotidianos",
  description: "Palabras de uso diario",
  locale: "es-AR",
  words: ["Llave", "Mesa", "Cuchara"],
};

describe("assignRolesGuard", () => {
  it("falla si no hay suficientes jugadores", () => {
    const result = assignRolesGuard({
      players: samplePlayers.slice(0, 2),
      category: sampleCategory,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("NOT_ENOUGH_PLAYERS");
    }
  });

  it("falla si la categoría no existe", () => {
    const result = assignRolesGuard({
      players: samplePlayers,
      category: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("CATEGORY_NOT_FOUND");
    }
  });

  it("falla si la categoría no tiene palabras activas", () => {
    const result = assignRolesGuard({
      players: samplePlayers,
      category: { ...sampleCategory, words: [] },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("CATEGORY_EMPTY");
    }
  });

  it("aprueba cuando se cumplen todas las condiciones", () => {
    const result = assignRolesGuard({
      players: samplePlayers,
      category: sampleCategory,
    });

    expect(result).toEqual({ success: true });
  });
});
