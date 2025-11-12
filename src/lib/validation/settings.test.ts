import { describe, expect, it } from "vitest";
import { settingsSchema } from "@/lib/validation/settings";

describe("settingsSchema", () => {
  it("permite una sala opcional y recorta espacios", () => {
    const result = settingsSchema.parse({
      roomName: "   Noche de juegos   ",
      categoryId: "famosos-argentinos",
    });

    expect(result.roomName).toBe("Noche de juegos");
  });

  it("convierte la sala vacía en undefined", () => {
    const result = settingsSchema.parse({
      roomName: "",
      categoryId: "objetos",
    });

    expect(result.roomName).toBeUndefined();
  });

  it("lanza error si la categoría está vacía", () => {
    expect(() =>
      settingsSchema.parse({
        roomName: "Partida 1",
        categoryId: "",
      }),
    ).toThrowError(/Selecciona una categoría/);
  });

  it("lanza error cuando el nombre supera los 40 caracteres", () => {
    const longName = "a".repeat(41);

    expect(() =>
      settingsSchema.parse({
        roomName: longName,
        categoryId: "objetos",
      }),
    ).toThrowError(/40 caracteres o menos/);
  });
});


