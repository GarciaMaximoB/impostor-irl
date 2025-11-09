"use client";

import type { Player } from "@/lib/players/types";
import { PlayerRow } from "@/app/(components)/players/player-row";

interface NameValidationResult {
  success: true;
  value: string;
}
interface NameValidationError {
  success: false;
  error: string;
}

type ValidateName = (
  input: string,
  currentId: string
) => NameValidationResult | NameValidationError;

interface PlayerListProps {
  players: Player[];
  validateName: ValidateName;
  onUpdateName: (playerId: string, name: string) => void;
  onRemove: (player: Player) => void;
  onMoveUp: (player: Player) => void;
  onMoveDown: (player: Player) => void;
}

export function PlayerList({
  players,
  validateName,
  onUpdateName,
  onRemove,
  onMoveUp,
  onMoveDown,
}: PlayerListProps) {
  if (players.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
        Agrega al menos cuatro jugadores únicos para poder iniciar la partida.
      </section>
    );
  }

  return (
    <ul className="space-y-3" aria-live="polite">
      {players.map((player, index) => (
        <PlayerRow
          key={`${player.id}-${player.name}`}
          player={player}
          index={index}
          total={players.length}
          validateName={validateName}
          onUpdateName={onUpdateName}
          onRemove={onRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </ul>
  );
}
