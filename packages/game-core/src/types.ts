export type PlayerCount = 2 | 4;
export type Variant = "duel" | "classic";
export type GameStatus = "waiting" | "active" | "finished";
export type PlayerId = `P${number}`;
export type PieceId =
  | "mono"
  | "domino"
  | "tromino-i"
  | "tromino-l"
  | "tetromino-o"
  | "tetromino-i"
  | "tetromino-l"
  | "tetromino-t"
  | "tetromino-z"
  | "pentomino-f"
  | "pentomino-i"
  | "pentomino-l"
  | "pentomino-n"
  | "pentomino-p"
  | "pentomino-t"
  | "pentomino-u"
  | "pentomino-v"
  | "pentomino-w"
  | "pentomino-x"
  | "pentomino-y"
  | "pentomino-z";
export type TransformKey =
  | "r0"
  | "r90"
  | "r180"
  | "r270"
  | "fr0"
  | "fr90"
  | "fr180"
  | "fr270";
export type ValidationCode =
  | "OK"
  | "GAME_NOT_ACTIVE"
  | "PLAYER_NOT_FOUND"
  | "NOT_YOUR_TURN"
  | "PIECE_ALREADY_USED"
  | "INVALID_TRANSFORM"
  | "OUT_OF_BOUNDS"
  | "OVERLAP"
  | "FIRST_MOVE_MISSING_START"
  | "MISSING_CORNER_CONTACT"
  | "EDGE_CONTACT"
  | "PASS_NOT_ALLOWED"
  | "INVALID_ACTION";

export interface CellOffset {
  x: number;
  y: number;
}

export interface TransformDefinition {
  key: TransformKey;
  rotation: 0 | 90 | 180 | 270;
  flipped: boolean;
  cells: CellOffset[];
}

export interface PieceDefinition {
  id: PieceId;
  cellCount: number;
  baseCells: CellOffset[];
  transforms: TransformDefinition[];
}

export interface Placement {
  pieceId: PieceId;
  origin: CellOffset;
  transform: TransformKey;
}

export interface PlaceAction {
  type: "place";
  placement: Placement;
}

export interface PassAction {
  type: "pass";
}

export type PlayerAction = PlaceAction | PassAction;

export interface WirePlaceAction {
  type: "place";
  pieceId: PieceId;
  origin: CellOffset;
  transform: TransformKey;
}

export interface WirePassAction {
  type: "pass";
}

export type WireAction = WirePlaceAction | WirePassAction;

export interface ParseError {
  ok: false;
  code: "INVALID_ACTION";
  message: string;
}

export interface TurnRecord {
  turn: number;
  playerId: PlayerId;
  action: WireAction;
  resultingHash: string;
}

export interface PlayerState {
  id: PlayerId;
  seatIndex: number;
  colorKey: string;
  name?: string;
  remainingPieceIds: PieceId[];
  hasPlayed: boolean;
  passedLastTurn: boolean;
  score: number;
  lastPlacedPieceId?: PieceId;
}

export interface BoardState {
  size: number;
  cells: number[];
}

export interface GameConfig {
  playerCount: PlayerCount;
  boardSize?: number;
  variant?: Variant;
  seed?: string;
}

export interface ResolvedGameConfig {
  playerCount: PlayerCount;
  boardSize: number;
  variant: Variant;
  seed?: string;
}

export interface GameState {
  version: 1;
  status: GameStatus;
  config: ResolvedGameConfig;
  turn: number;
  currentPlayerId: PlayerId;
  players: PlayerState[];
  board: BoardState;
  history: TurnRecord[];
  consecutivePasses: number;
  winnerIds: PlayerId[];
}

export interface LegalPlacement {
  playerId: PlayerId;
  placement: Placement;
  cells: CellOffset[];
  isFirstMove: boolean;
  touchesOwnCorner: boolean;
}

export interface TurnOptions {
  canPass: boolean;
  hasLegalPlacement: boolean;
  legalPlacements: LegalPlacement[];
}

export interface ScoreEntry {
  playerId: PlayerId;
  score: number;
  remainingSquares: number;
  usedAllPieces: boolean;
  lastPieceWasMono: boolean;
}

export interface ScoreSummary {
  entries: ScoreEntry[];
  winnerIds: PlayerId[];
  highestScore: number;
}

export interface ValidationSuccess {
  ok: true;
  code: "OK";
  cells?: CellOffset[];
  legalPlacement?: LegalPlacement;
  normalizedAction: PlayerAction;
}

export interface ValidationFailure {
  ok: false;
  code: Exclude<ValidationCode, "OK">;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export interface CanonicalGameState {
  version: 1;
  status: GameStatus;
  config: ResolvedGameConfig;
  turn: number;
  currentPlayerId: PlayerId;
  players: Array<{
    id: PlayerId;
    seatIndex: number;
    colorKey: string;
    remainingPieceIds: PieceId[];
    hasPlayed: boolean;
    passedLastTurn: boolean;
    score: number;
    lastPlacedPieceId?: PieceId;
  }>;
  board: {
    size: number;
    encoding: string;
  };
  history: TurnRecord[];
  consecutivePasses: number;
  winnerIds: PlayerId[];
}

export interface GameEvent {
  type: "action_applied" | "turn_advanced" | "game_finished";
  turn: number;
  playerId?: PlayerId;
  currentPlayerId?: PlayerId;
  winnerIds?: PlayerId[];
}

export interface ApplySuccess {
  ok: true;
  code: "OK";
  state: GameState;
  action: TurnRecord;
  events: GameEvent[];
}

export interface ApplyFailure {
  ok: false;
  code: Exclude<ValidationCode, "OK">;
  state: GameState;
}

export type ApplyResult = ApplySuccess | ApplyFailure;
