import { describe, expect, it } from "vitest";
import { playersReducer } from "@/lib/players/reducer";
import type { Player } from "@/lib/players/types";

function reduce(
  initial: Player[],
  action:
    | { type: "ADD_PLAYER"; payload: { player: Player } }
    | { type: "UPDATE_PLAYER"; payload: { id: string; name: string } }
    | { type: "REMOVE_PLAYER"; payload: { id: string } }
    | { type: "REORDER_PLAYERS"; payload: { from: number; to: number } }
    | { type: "RESET_PLAYERS"; payload: { players: Player[] } },
): Player[] {
  return playersReducer(initial, action);
}

describe("playersReducer", () => {
  it("agrega jugadores manteniendo orden secuencial", () => {
    const firstPlayer: Player = { id: "1", name: "Ana", order: 0 };
    const secondPlayer: Player = { id: "2", name: "Luis", order: 1 };

    const stateAfterFirst = reduce([], {
      type: "ADD_PLAYER",
      payload: { player: firstPlayer },
    });
    const stateAfterSecond = reduce(stateAfterFirst, {
      type: "ADD_PLAYER",
      payload: { player: secondPlayer },
    });

    expect(stateAfterSecond).toEqual([
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis", order: 1 },
    ]);
  });

  it("actualiza nombres sin alterar el orden", () => {
    const initialState: Player[] = [
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis", order: 1 },
    ];

    const updated = reduce(initialState, {
      type: "UPDATE_PLAYER",
      payload: { id: "2", name: "Luis Alberto" },
    });

    expect(updated).toEqual([
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis Alberto", order: 1 },
    ]);
  });

  it("elimina jugadores y recalcula el orden", () => {
    const initialState: Player[] = [
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis", order: 1 },
      { id: "3", name: "María", order: 2 },
    ];

    const updated = reduce(initialState, {
      type: "REMOVE_PLAYER",
      payload: { id: "2" },
    });

    expect(updated).toEqual([
      { id: "1", name: "Ana", order: 0 },
      { id: "3", name: "María", order: 1 },
    ]);
  });

  it("reordena jugadores actualizando sus órdenes", () => {
    const initialState: Player[] = [
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis", order: 1 },
      { id: "3", name: "María", order: 2 },
    ];

    const reordered = reduce(initialState, {
      type: "REORDER_PLAYERS",
      payload: { from: 2, to: 0 },
    });

    expect(reordered).toEqual([
      { id: "3", name: "María", order: 0 },
      { id: "1", name: "Ana", order: 1 },
      { id: "2", name: "Luis", order: 2 },
    ]);
  });

  it("restablece jugadores utilizando RESET_PLAYERS", () => {
    const initialState: Player[] = [
      { id: "1", name: "Ana", order: 0 },
      { id: "2", name: "Luis", order: 1 },
    ];

    const reset = reduce(initialState, {
      type: "RESET_PLAYERS",
      payload: {
        players: [
          { id: "3", name: "María", order: 0 },
          { id: "4", name: "Diego", order: 1 },
        ],
      },
    });

    expect(reset).toEqual([
      { id: "3", name: "María", order: 0 },
      { id: "4", name: "Diego", order: 1 },
    ]);
  });
});



