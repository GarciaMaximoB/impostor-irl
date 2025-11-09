import { z } from "zod";

const ROOM_NAME_REGEX = /^[\p{L}\p{N}\s'-]+$/u;

const roomNameSchema = z
  .string()
  .max(40, "El nombre de la sala debe tener 40 caracteres o menos.")
  .regex(
    ROOM_NAME_REGEX,
    "El nombre de la sala solo puede incluir letras, números, espacios, apóstrofes y guiones.",
  );

export const settingsSchema = z
  .object({
    roomName: z
      .union([roomNameSchema, z.literal("").transform(() => undefined)])
      .optional(),
    categoryId: z
      .string({ required_error: "Selecciona una categoría para continuar." })
      .min(1, "Selecciona una categoría para continuar."),
  })
  .transform((value) => ({
    ...value,
    roomName: sanitizeRoomName(value.roomName),
  }));

function sanitizeRoomName(
  roomName: string | undefined,
): string | undefined {
  if (!roomName) {
    return undefined;
  }

  const normalized = roomName.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : undefined;
}

export type SettingsFormInput = z.infer<typeof settingsSchema>;

