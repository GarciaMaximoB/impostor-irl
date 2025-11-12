"use client";

import { DialogConfirm } from "@/app/(components)/players/dialog-confirm";

interface EliminationConfirmDialogProps {
  open: boolean;
  playerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EliminationConfirmDialog({
  open,
  playerName,
  onConfirm,
  onCancel,
}: EliminationConfirmDialogProps) {
  return (
    <DialogConfirm
      open={open}
      title={`¿Desterrar a ${playerName} del juego?`}
      description="¡Cuidado! Una vez que lo hagas, no habrá vuelta atrás... La magia del juego lo borrará para siempre."
      confirmLabel="Desterrar"
      cancelLabel="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

