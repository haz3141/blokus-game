import { describe, expect, it } from "vitest";

import { createInitialGame, validateMove } from "@cornerfall/game-core";

import { resolvePlacementFromTap } from "./game.js";

describe("resolvePlacementFromTap", () => {
  it("snaps a tapped cell onto a legal opening placement for the selected transform", () => {
    const game = createInitialGame({ playerCount: 2 });

    const placement = resolvePlacementFromTap({
      game,
      playerId: "P1",
      pieceId: "domino",
      transform: "r0",
      tappedCell: { x: 1, y: 0 }
    });

    expect(placement.origin).toEqual({ x: 0, y: 0 });
    expect(
      validateMove(game, "P1", {
        type: "place",
        placement
      }).ok
    ).toBe(true);
  });

  it("falls back deterministically when no legal placement is available for the tap", () => {
    const game = createInitialGame({ playerCount: 2 });

    const placement = resolvePlacementFromTap({
      game,
      playerId: "P1",
      pieceId: "pentomino-f",
      transform: "r0",
      tappedCell: { x: 0, y: 0 }
    });

    expect(placement.origin).toEqual({ x: -1, y: 0 });
  });
});
