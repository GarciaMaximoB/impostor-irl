import type { Category } from "@/lib/categories/types";
import type { AssignmentState, Player } from "@/lib/game/types";

export type AssignRolesErrorCode =
  | "NO_PLAYERS_AVAILABLE"
  | "NO_WORDS_AVAILABLE"
  | "CRYPTO_UNAVAILABLE";

export class AssignRolesError extends Error {
  readonly code: AssignRolesErrorCode;

  constructor(code: AssignRolesErrorCode, message: string) {
    super(message);
    this.name = "AssignRolesError";
    this.code = code;
  }
}

interface AssignRolesInput {
  players: Player[];
  category: Category;
  random?: () => number;
}

interface RandomSource {
  nextInt: (max: number) => number;
}

export function assignRoles({
  players,
  category,
  random,
}: AssignRolesInput): AssignmentState {
  if (!Array.isArray(players) || players.length === 0) {
    throw new AssignRolesError(
      "NO_PLAYERS_AVAILABLE",
      "No hay jugadores disponibles para asignar roles.",
    );
  }

  const sanitizedWords = category.words
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  if (sanitizedWords.length === 0) {
    throw new AssignRolesError(
      "NO_WORDS_AVAILABLE",
      "La categoría seleccionada no tiene palabras disponibles.",
    );
  }

  const randomSource = createRandomSource(random);

  const wordIndex = randomSource.nextInt(sanitizedWords.length);
  const selectedWord = sanitizedWords[wordIndex];

  const impostorIndex = randomSource.nextInt(players.length);
  const impostorId = players[impostorIndex]?.id;

  if (!impostorId) {
    throw new AssignRolesError(
      "NO_PLAYERS_AVAILABLE",
      "No se pudo seleccionar un impostor válido.",
    );
  }

  const revealOrder = shufflePlayers(players, randomSource);

  return {
    word: selectedWord,
    impostorId,
    revealOrder,
    timestamp: Date.now(),
  };
}

function shufflePlayers(
  players: Player[],
  randomSource: RandomSource,
): Player["id"][] {
  const items = players.map((player) => player.id);
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = randomSource.nextInt(index + 1);
    const current = items[index];
    items[index] = items[swapIndex];
    items[swapIndex] = current;
  }

  return items;
}

function createRandomSource(random?: () => number): RandomSource {
  if (typeof random === "function") {
    return {
      nextInt: (max: number) => {
        if (max <= 0) {
          throw new AssignRolesError(
            "NO_WORDS_AVAILABLE",
            "No hay elementos disponibles para seleccionar.",
          );
        }
        const value = random();
        return clampToRange(value, max);
      },
    };
  }

  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    return {
      nextInt: (max: number) => {
        if (max <= 0) {
          throw new AssignRolesError(
            "NO_WORDS_AVAILABLE",
            "No hay elementos disponibles para seleccionar.",
          );
        }
        const buffer = new Uint32Array(1);
        globalThis.crypto.getRandomValues(buffer);
        return Number(buffer[0] % max);
      },
    };
  }

  if (typeof Math.random === "function") {
    return {
      nextInt: (max: number) => {
        if (max <= 0) {
          throw new AssignRolesError(
            "NO_WORDS_AVAILABLE",
            "No hay elementos disponibles para seleccionar.",
          );
        }
        return clampToRange(Math.random(), max);
      },
    };
  }

  throw new AssignRolesError(
    "CRYPTO_UNAVAILABLE",
    "No hay fuente de aleatoriedad disponible para asignar roles.",
  );
}

function clampToRange(value: number, max: number): number {
  const normalized = value % 1;
  const candidate = Math.floor(normalized * max);
  if (candidate < 0) {
    return 0;
  }
  if (candidate >= max) {
    return max - 1;
  }
  return candidate;
}





