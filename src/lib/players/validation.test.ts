import { describe, expect, it } from "vitest";
import { playerNameSchema } from "@/lib/players/validation";

describe("playerNameSchema", () => {
  it("sanitiza espacios redundantes y recorta extremos", () => {
    const result = playerNameSchema.parse("  Ana   María  ");
    expect(result).toBe("Ana María");
  });

  it("rechaza nombres vacíos", () => {
    expect(() => playerNameSchema.parse("   ")).toThrow(
      /El nombre del jugador no puede estar vacío/,
    );
  });

  it("rechaza nombres demasiado largos", () => {
    const longName = "a".repeat(25);
    expect(() => playerNameSchema.parse(longName)).toThrow(
      /no puede superar los 24 caracteres/,
    );
  });

  it("rechaza caracteres no permitidos", () => {
    expect(() => playerNameSchema.parse("Luis & Ana")).toThrow(
      /no puede contener/,
    );
  });
});



