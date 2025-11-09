import { z } from "zod";

export const playerNameSchema = z
  .string()
  .transform((value) => value.replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .trim()
      .min(1, "El nombre del jugador no puede estar vacío.")
      .max(24, "El nombre del jugador no puede superar los 24 caracteres.")
      .refine(
        (value) => !/[<>&]/.test(value),
        "El nombre del jugador no puede contener <, > o &.",
      ),
  );

export function sanitizePlayerName(name: string): string {
  return playerNameSchema.parse(name);
}


