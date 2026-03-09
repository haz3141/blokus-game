import type {
  CellOffset,
  PieceDefinition,
  PieceId,
  PlayerCount,
  TransformDefinition,
  TransformKey
} from "./types";

const RAW_PIECES: Record<PieceId, CellOffset[]> = {
  mono: [{ x: 0, y: 0 }],
  domino: [
    { x: 0, y: 0 },
    { x: 1, y: 0 }
  ],
  "tromino-i": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ],
  "tromino-l": [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ],
  "tetromino-o": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 }
  ],
  "tetromino-i": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ],
  "tetromino-l": [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 }
  ],
  "tetromino-t": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 }
  ],
  "tetromino-z": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 }
  ],
  "pentomino-f": [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ],
  "pentomino-i": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 }
  ],
  "pentomino-l": [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 1, y: 3 }
  ],
  "pentomino-n": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 }
  ],
  "pentomino-p": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 2 }
  ],
  "pentomino-t": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 }
  ],
  "pentomino-u": [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 }
  ],
  "pentomino-v": [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ],
  "pentomino-w": [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ],
  "pentomino-x": [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 2 }
  ],
  "pentomino-y": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 1, y: 1 }
  ],
  "pentomino-z": [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 }
  ]
};

const TRANSFORMS: Array<{
  key: TransformKey;
  rotation: 0 | 90 | 180 | 270;
  flipped: boolean;
}> = [
  { key: "r0", rotation: 0, flipped: false },
  { key: "r90", rotation: 90, flipped: false },
  { key: "r180", rotation: 180, flipped: false },
  { key: "r270", rotation: 270, flipped: false },
  { key: "fr0", rotation: 0, flipped: true },
  { key: "fr90", rotation: 90, flipped: true },
  { key: "fr180", rotation: 180, flipped: true },
  { key: "fr270", rotation: 270, flipped: true }
];

const normalizeCells = (cells: CellOffset[]): CellOffset[] => {
  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));

  return cells
    .map((cell) => ({
      x: cell.x - minX,
      y: cell.y - minY
    }))
    .sort((left, right) => left.y - right.y || left.x - right.x);
};

const rotateCell = (cell: CellOffset, rotation: 0 | 90 | 180 | 270): CellOffset => {
  switch (rotation) {
    case 90:
      return { x: -cell.y, y: cell.x };
    case 180:
      return { x: -cell.x, y: -cell.y };
    case 270:
      return { x: cell.y, y: -cell.x };
    default:
      return cell;
  }
};

const transformCells = (
  cells: CellOffset[],
  rotation: 0 | 90 | 180 | 270,
  flipped: boolean
): CellOffset[] =>
  normalizeCells(
    cells.map((cell) => {
      const reflected = flipped ? { x: -cell.x, y: cell.y } : cell;
      return rotateCell(reflected, rotation);
    })
  );

const dedupeTransforms = (baseCells: CellOffset[]): TransformDefinition[] => {
  const seen = new Set<string>();
  const results: TransformDefinition[] = [];

  for (const transform of TRANSFORMS) {
    const cells = transformCells(baseCells, transform.rotation, transform.flipped);
    const signature = cells.map((cell) => `${cell.x},${cell.y}`).join("|");

    if (seen.has(signature)) {
      continue;
    }

    seen.add(signature);
    results.push({
      ...transform,
      cells
    });
  }

  return results;
};

export const PIECE_ORDER = Object.keys(RAW_PIECES) as PieceId[];

export const PIECES: Record<PieceId, PieceDefinition> = PIECE_ORDER.reduce(
  (catalog, pieceId) => {
    const baseCells = normalizeCells(RAW_PIECES[pieceId]);
    catalog[pieceId] = {
      id: pieceId,
      cellCount: baseCells.length,
      baseCells,
      transforms: dedupeTransforms(baseCells)
    };
    return catalog;
  },
  {} as Record<PieceId, PieceDefinition>
);

export const PLAYER_COLORS = ["amber", "azure", "emerald", "rose"] as const;

export const DEFAULT_BOARD_SIZE: Record<PlayerCount, number> = {
  2: 14,
  4: 20
};
