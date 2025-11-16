import type { Player } from "@/lib/players/types";

/**
 * Filtra los jugadores activos (no eliminados) de una lista de jugadores.
 * @param players - Lista completa de jugadores
 * @returns Lista de jugadores activos (sin el flag eliminado o con eliminado: false)
 */
export function getActivePlayers(players: Player[]): Player[] {
  return players.filter((player) => !player.eliminado);
}

/**
 * Determina si hay una condición de victoria en el juego.
 * @param players - Lista completa de jugadores
 * @param impostorId - ID del jugador impostor
 * @returns "impostor-wins" si el impostor gana, "non-impostors-win" si los no impostores ganan, o null si no hay ganador aún
 */
export function checkWinCondition(
  players: Player[],
  impostorId: string,
): "impostor-wins" | "non-impostors-win" | null {
  const activePlayers = getActivePlayers(players);

  // Verificar si el impostor fue eliminado
  const impostorEliminado = activePlayers.every(
    (player) => player.id !== impostorId,
  );

  if (impostorEliminado) {
    return "non-impostors-win";
  }

  // Verificar si quedan solo 2 jugadores: 1 impostor y 1 no impostor
  if (activePlayers.length === 2) {
    const impostorActivo = activePlayers.some(
      (player) => player.id === impostorId,
    );
    if (impostorActivo) {
      return "impostor-wins";
    }
  }

  return null;
}

/**
 * Verifica si el juego puede continuar (hay suficientes jugadores activos).
 * @param players - Lista completa de jugadores
 * @returns true si hay al menos 2 jugadores activos, false en caso contrario
 */
export function canContinueGame(players: Player[]): boolean {
  const activePlayers = getActivePlayers(players);
  return activePlayers.length >= 2;
}



