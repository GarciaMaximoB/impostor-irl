import { describe, expect, it } from "vitest";
import seedrandom from "seedrandom";
import { assignRoles, AssignRolesError } from "@/lib/game/assign-roles";
import type { Category } from "@/lib/categories/types";
import type { Player } from "@/lib/game/types";

const samplePlayers: Player[] = [
  { id: "p1", name: "Ana", order: 0 },
  { id: "p2", name: "Luis", order: 1 },
  { id: "p3", name: "María", order: 2 },
  { id: "p4", name: "Diego", order: 3 },
];

const sampleCategory: Category = {
  id: "objetos",
  name: "Objetos cotidianos",
  description: "Palabras de uso diario",
  locale: "es-AR",
  words: ["Llave", "Mesa", "Cuchara", "Ventana"],
};

describe("assignRoles", () => {
  it("devuelve resultados deterministas para una misma semilla", () => {
    const assignmentA = assignRoles({
      players: samplePlayers,
      category: sampleCategory,
      random: seedrandom("determinista"),
    });

    const assignmentB = assignRoles({
      players: samplePlayers,
      category: sampleCategory,
      random: seedrandom("determinista"),
    });

    expect(assignmentA.word).toBe(assignmentB.word);
    expect(assignmentA.impostorId).toBe(assignmentB.impostorId);
    expect(assignmentA.revealOrder).toEqual(assignmentB.revealOrder);
  });

  it("selecciona exactamente un impostor válido", () => {
    const assignment = assignRoles({
      players: samplePlayers,
      category: sampleCategory,
      random: seedrandom("impostor"),
    });

    const impostorExists = samplePlayers.some(
      (player) => player.id === assignment.impostorId,
    );

    expect(impostorExists).toBe(true);
  });

  it("genera un orden de revelación sin duplicados", () => {
    const assignment = assignRoles({
      players: samplePlayers,
      category: sampleCategory,
      random: seedrandom("orden"),
    });

    const uniqueIds = new Set(assignment.revealOrder);
    expect(uniqueIds.size).toBe(samplePlayers.length);

    const sortedRevealOrder = [...assignment.revealOrder].sort();
    const sortedPlayers = samplePlayers.map((player) => player.id).sort();
    expect(sortedRevealOrder).toEqual(sortedPlayers);
  });

  it("elimina palabras vacías y espacios antes de seleccionar", () => {
    const categoryWithWhitespace: Category = {
      ...sampleCategory,
      words: ["   ", "  palabra  ", "   segunda"],
    };

    const assignment = assignRoles({
      players: samplePlayers,
      category: categoryWithWhitespace,
      random: seedrandom("palabras"),
    });

    expect(assignment.word).toMatch(/palabra|segunda/);
  });

  it("lanza un error si la categoría no tiene palabras disponibles", () => {
    expect(() =>
      assignRoles({
        players: samplePlayers,
        category: { ...sampleCategory, words: ["  ", "   "] },
      }),
    ).toThrowError(AssignRolesError);
  });
});


