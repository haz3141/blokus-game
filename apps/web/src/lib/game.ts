import {
  PIECES,
  validateMove,
  type CellOffset,
  type GameState,
  type PieceId,
  type Placement,
  type PlayerId,
  type TransformKey
} from "@cornerfall/game-core";

interface ResolvePlacementFromTapOptions {
  game: GameState;
  playerId: PlayerId;
  pieceId: PieceId;
  transform: TransformKey;
  tappedCell: CellOffset;
}

function candidateSortValue(origin: CellOffset): number {
  return Math.abs(origin.x) + Math.abs(origin.y);
}

export function resolvePlacementFromTap({
  game,
  playerId,
  pieceId,
  transform,
  tappedCell
}: ResolvePlacementFromTapOptions): Placement {
  const transformDefinition = PIECES[pieceId].transforms.find((entry) => entry.key === transform);

  if (!transformDefinition) {
    return {
      pieceId,
      origin: tappedCell,
      transform
    };
  }

  const candidateOrigins = Array.from(
    new Map(
      transformDefinition.cells.map((cell) => {
        const origin = {
          x: tappedCell.x - cell.x,
          y: tappedCell.y - cell.y
        };

        return [`${origin.x},${origin.y}`, origin] as const;
      })
    ).values()
  ).sort((left, right) => candidateSortValue(left) - candidateSortValue(right));

  for (const origin of candidateOrigins) {
    const placement: Placement = {
      pieceId,
      origin,
      transform
    };

    const validation = validateMove(game, playerId, {
      type: "place",
      placement
    });

    if (validation.ok) {
      return placement;
    }
  }

  return {
    pieceId,
    origin: candidateOrigins[0] ?? tappedCell,
    transform
  };
}
