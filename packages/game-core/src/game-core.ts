import { DEFAULT_BOARD_SIZE, PIECES, PIECE_ORDER, PLAYER_COLORS } from "./constants";
import type {
  ApplyResult,
  CanonicalGameState,
  CellOffset,
  GameConfig,
  GameEvent,
  GameState,
  LegalPlacement,
  ParseError,
  Placement,
  PlayerAction,
  PlayerId,
  PlayerState,
  ResolvedGameConfig,
  ScoreEntry,
  ScoreSummary,
  TurnOptions,
  ValidationCode,
  ValidationResult,
  WireAction
} from "./types";

const CORNER_OFFSETS: CellOffset[] = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 }
];

const EDGE_OFFSETS: CellOffset[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 }
];

const cloneCell = (cell: CellOffset): CellOffset => ({ x: cell.x, y: cell.y });

const sameCell = (left: CellOffset, right: CellOffset): boolean =>
  left.x === right.x && left.y === right.y;

const getBoardIndex = (boardSize: number, x: number, y: number): number => y * boardSize + x;

const readCell = (state: GameState, x: number, y: number): number =>
  x < 0 || y < 0 || x >= state.board.size || y >= state.board.size
    ? -2
    : state.board.cells[getBoardIndex(state.board.size, x, y)] ?? -2;

const getPlayer = (state: GameState, playerId: PlayerId): PlayerState | undefined =>
  state.players.find((player) => player.id === playerId);

const requirePlayer = (state: GameState, playerId: PlayerId): PlayerState => {
  const player = getPlayer(state, playerId);

  if (!player) {
    throw new Error(`Missing player ${playerId}`);
  }

  return player;
};

const createResolvedConfig = (config: GameConfig): ResolvedGameConfig => ({
  playerCount: config.playerCount,
  boardSize:
    config.boardSize ?? (config.playerCount === 2 ? DEFAULT_BOARD_SIZE[2] : DEFAULT_BOARD_SIZE[4]),
  variant: config.variant ?? (config.playerCount === 2 ? "duel" : "classic"),
  ...(config.seed ? { seed: config.seed } : {})
});

const createPlayerId = (seatIndex: number): PlayerId => `P${seatIndex + 1}`;

const getTransformCells = (placement: Placement): CellOffset[] => {
  const transform = PIECES[placement.pieceId].transforms.find(
    (entry) => entry.key === placement.transform
  );

  return transform ? transform.cells.map(cloneCell) : [];
};

export const getPlacedCells = (placement: Placement): CellOffset[] =>
  getTransformCells(placement).map((cell) => ({
    x: placement.origin.x + cell.x,
    y: placement.origin.y + cell.y
  }));

export const getStartCorner = (state: GameState, seatIndex: number): CellOffset => {
  const max = state.board.size - 1;

  if (state.config.playerCount === 2) {
    return seatIndex === 0 ? { x: 0, y: 0 } : { x: max, y: max };
  }

  switch (seatIndex) {
    case 0:
      return { x: 0, y: 0 };
    case 1:
      return { x: max, y: 0 };
    case 2:
      return { x: max, y: max };
    default:
      return { x: 0, y: max };
  }
};

const placementIncludes = (cells: CellOffset[], target: CellOffset): boolean =>
  cells.some((cell) => sameCell(cell, target));

const hasCornerContact = (state: GameState, cells: CellOffset[], seatIndex: number): boolean =>
  cells.some((cell) =>
    CORNER_OFFSETS.some(
      (offset) => readCell(state, cell.x + offset.x, cell.y + offset.y) === seatIndex
    )
  );

const hasEdgeContact = (state: GameState, cells: CellOffset[], seatIndex: number): boolean =>
  cells.some((cell) =>
    EDGE_OFFSETS.some(
      (offset) => readCell(state, cell.x + offset.x, cell.y + offset.y) === seatIndex
    )
  );

const createFailure = (code: Exclude<ValidationCode, "OK">): ValidationResult => ({
  ok: false,
  code
});

const validatePlacementForPlayer = (
  state: GameState,
  player: PlayerState,
  placement: Placement
): ValidationResult => {
  if (!player.remainingPieceIds.includes(placement.pieceId)) {
    return createFailure("PIECE_ALREADY_USED");
  }

  const transform = PIECES[placement.pieceId].transforms.find(
    (entry) => entry.key === placement.transform
  );

  if (!transform) {
    return createFailure("INVALID_TRANSFORM");
  }

  const placedCells = getPlacedCells(placement);

  for (const cell of placedCells) {
    if (
      cell.x < 0 ||
      cell.y < 0 ||
      cell.x >= state.board.size ||
      cell.y >= state.board.size
    ) {
      return createFailure("OUT_OF_BOUNDS");
    }

    if (readCell(state, cell.x, cell.y) !== -1) {
      return createFailure("OVERLAP");
    }
  }

  if (hasEdgeContact(state, placedCells, player.seatIndex)) {
    return createFailure("EDGE_CONTACT");
  }

  const touchesOwnCorner = hasCornerContact(state, placedCells, player.seatIndex);
  const isFirstMove = !player.hasPlayed;

  if (isFirstMove) {
    const startCorner = getStartCorner(state, player.seatIndex);

    if (!placementIncludes(placedCells, startCorner)) {
      return createFailure("FIRST_MOVE_MISSING_START");
    }
  } else if (!touchesOwnCorner) {
    return createFailure("MISSING_CORNER_CONTACT");
  }

  return {
    ok: true,
    code: "OK",
    cells: placedCells,
    legalPlacement: {
      playerId: player.id,
      placement,
      cells: placedCells,
      isFirstMove,
      touchesOwnCorner
    },
    normalizedAction: {
      type: "place",
      placement
    }
  };
};

export const createInitialGame = (config: GameConfig): GameState => {
  const resolvedConfig = createResolvedConfig(config);
  const players: PlayerState[] = Array.from({ length: resolvedConfig.playerCount }, (_, seatIndex) => ({
    id: createPlayerId(seatIndex),
    seatIndex,
    colorKey: PLAYER_COLORS[seatIndex] ?? "amber",
    remainingPieceIds: [...PIECE_ORDER],
    hasPlayed: false,
    passedLastTurn: false,
    score: 0
  }));
  const firstPlayer = players[0];

  if (!firstPlayer) {
    throw new Error("At least one player is required");
  }

  return {
    version: 1,
    status: "active",
    config: resolvedConfig,
    turn: 1,
    currentPlayerId: firstPlayer.id,
    players,
    board: {
      size: resolvedConfig.boardSize,
      cells: Array.from({ length: resolvedConfig.boardSize * resolvedConfig.boardSize }, () => -1)
    },
    history: [],
    consecutivePasses: 0,
    winnerIds: []
  };
};

export const getLegalPlacements = (
  state: GameState,
  playerId: PlayerId,
  pieceId?: Placement["pieceId"]
): LegalPlacement[] => {
  const player = getPlayer(state, playerId);

  if (!player || state.status !== "active") {
    return [];
  }

  const pieceIds = pieceId ? player.remainingPieceIds.filter((id) => id === pieceId) : player.remainingPieceIds;
  const placements: LegalPlacement[] = [];

  for (const candidatePieceId of pieceIds) {
    const piece = PIECES[candidatePieceId];

    for (const transform of piece.transforms) {
      const width = Math.max(...transform.cells.map((cell) => cell.x)) + 1;
      const height = Math.max(...transform.cells.map((cell) => cell.y)) + 1;
      const maxOriginX = state.board.size - width;
      const maxOriginY = state.board.size - height;

      for (let y = 0; y <= maxOriginY; y += 1) {
        for (let x = 0; x <= maxOriginX; x += 1) {
          const placement: Placement = {
            pieceId: candidatePieceId,
            origin: { x, y },
            transform: transform.key
          };
          const validation = validatePlacementForPlayer(state, player, placement);

          if (validation.ok && validation.legalPlacement) {
            placements.push(validation.legalPlacement);
          }
        }
      }
    }
  }

  return placements;
};

export const deriveTurnOptions = (state: GameState, playerId: PlayerId): TurnOptions => {
  const legalPlacements = getLegalPlacements(state, playerId);
  return {
    canPass: legalPlacements.length === 0,
    hasLegalPlacement: legalPlacements.length > 0,
    legalPlacements
  };
};

export const validateMove = (
  state: GameState,
  playerId: PlayerId,
  action: PlayerAction
): ValidationResult => {
  if (state.status !== "active") {
    return createFailure("GAME_NOT_ACTIVE");
  }

  const player = getPlayer(state, playerId);

  if (!player) {
    return createFailure("PLAYER_NOT_FOUND");
  }

  if (state.currentPlayerId !== playerId) {
    return createFailure("NOT_YOUR_TURN");
  }

  if (action.type === "pass") {
    return deriveTurnOptions(state, playerId).canPass
      ? {
          ok: true,
          code: "OK",
          normalizedAction: { type: "pass" }
        }
      : createFailure("PASS_NOT_ALLOWED");
  }

  return validatePlacementForPlayer(state, player, action.placement);
};

const advanceTurn = (state: GameState): PlayerId => {
  const currentIndex = state.players.findIndex((player) => player.id === state.currentPlayerId);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % state.players.length;
  return state.players[nextIndex]?.id ?? state.currentPlayerId;
};

const computeScoreEntry = (player: PlayerState): ScoreEntry => {
  const remainingSquares = player.remainingPieceIds.reduce(
    (sum, pieceId) => sum + PIECES[pieceId].cellCount,
    0
  );
  const usedAllPieces = player.remainingPieceIds.length === 0;
  const lastPieceWasMono = player.lastPlacedPieceId === "mono";
  const score = -remainingSquares + (usedAllPieces ? 15 : 0) + (usedAllPieces && lastPieceWasMono ? 5 : 0);

  return {
    playerId: player.id,
    score,
    remainingSquares,
    usedAllPieces,
    lastPieceWasMono
  };
};

export const computeScores = (state: GameState): ScoreSummary => {
  const entries = state.players
    .map((player) => computeScoreEntry(player))
    .sort((left, right) => right.score - left.score || left.playerId.localeCompare(right.playerId));
  const highestScore = entries[0]?.score ?? 0;

  return {
    entries,
    winnerIds: entries.filter((entry) => entry.score === highestScore).map((entry) => entry.playerId),
    highestScore
  };
};

export const isGameOver = (state: GameState): boolean =>
  state.status === "finished" ||
  state.consecutivePasses >= state.players.length ||
  state.players.every((player) => deriveTurnOptions(state, player.id).canPass);

const encodeBoard = (board: GameState["board"]): string =>
  board.cells.map((value) => (value < 0 ? "0" : String(value + 1))).join("");

export const serializeGameState = (state: GameState): CanonicalGameState => ({
  version: state.version,
  status: state.status,
  config: {
    playerCount: state.config.playerCount,
    boardSize: state.config.boardSize,
    variant: state.config.variant,
    ...(state.config.seed ? { seed: state.config.seed } : {})
  },
  turn: state.turn,
  currentPlayerId: state.currentPlayerId,
  players: state.players
    .map((player) => ({
      id: player.id,
      seatIndex: player.seatIndex,
      colorKey: player.colorKey,
      remainingPieceIds: [...player.remainingPieceIds],
      hasPlayed: player.hasPlayed,
      passedLastTurn: player.passedLastTurn,
      score: player.score,
      ...(player.lastPlacedPieceId ? { lastPlacedPieceId: player.lastPlacedPieceId } : {})
    }))
    .sort((left, right) => left.seatIndex - right.seatIndex),
  board: {
    size: state.board.size,
    encoding: encodeBoard(state.board)
  },
  history: state.history.map((entry) => ({
    turn: entry.turn,
    playerId: entry.playerId,
    action: entry.action.type === "pass" ? { type: "pass" } : { ...entry.action },
    resultingHash: entry.resultingHash
  })),
  consecutivePasses: state.consecutivePasses,
  winnerIds: [...state.winnerIds]
});

export const hashGameState = (state: GameState): string => {
  const source = JSON.stringify(serializeGameState(state));
  let hash = 0xcbf29ce484222325n;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= BigInt(source.charCodeAt(index));
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }

  return hash.toString(16).padStart(16, "0");
};

export const encodeAction = (action: PlayerAction): WireAction =>
  action.type === "pass"
    ? { type: "pass" }
    : {
        type: "place",
        pieceId: action.placement.pieceId,
        origin: cloneCell(action.placement.origin),
        transform: action.placement.transform
      };

export const decodeAction = (input: unknown): WireAction | ParseError => {
  if (typeof input !== "object" || input === null) {
    return { ok: false, code: "INVALID_ACTION", message: "Action must be an object" };
  }

  const candidate = input as Record<string, unknown>;

  if (candidate.type === "pass") {
    return { type: "pass" };
  }

  if (candidate.type !== "place") {
    return { ok: false, code: "INVALID_ACTION", message: "Unsupported action type" };
  }

  const pieceId = candidate.pieceId;
  const origin = candidate.origin;
  const transform = candidate.transform;

  if (!(typeof pieceId === "string" && pieceId in PIECES)) {
    return { ok: false, code: "INVALID_ACTION", message: "Unknown piece id" };
  }

  if (
    typeof origin !== "object" ||
    origin === null ||
    typeof (origin as CellOffset).x !== "number" ||
    typeof (origin as CellOffset).y !== "number"
  ) {
    return { ok: false, code: "INVALID_ACTION", message: "Invalid action origin" };
  }

  if (
    typeof transform !== "string" ||
    !PIECES[pieceId as keyof typeof PIECES].transforms.some((entry) => entry.key === transform)
  ) {
    return { ok: false, code: "INVALID_ACTION", message: "Invalid action transform" };
  }

  return {
    type: "place",
    pieceId: pieceId as keyof typeof PIECES,
    origin: cloneCell(origin as CellOffset),
    transform: transform as Placement["transform"]
  };
};

const withUpdatedScores = (state: GameState): GameState => {
  const scoreByPlayerId = new Map(
    computeScores(state).entries.map((entry) => [entry.playerId, entry.score])
  );

  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      remainingPieceIds: [...player.remainingPieceIds],
      score: scoreByPlayerId.get(player.id) ?? player.score
    }))
  };
};

export const applyAction = (
  state: GameState,
  playerId: PlayerId,
  action: PlayerAction
): ApplyResult => {
  const validation = validateMove(state, playerId, action);

  if (!validation.ok) {
    return {
      ok: false,
      code: validation.code,
      state
    };
  }

  const nextPlayerState = state.players.map((player) => ({
    ...player,
    remainingPieceIds: [...player.remainingPieceIds],
    passedLastTurn: false
  }));
  const activePlayer = requirePlayer({ ...state, players: nextPlayerState }, playerId);
  const nextBoard = {
    size: state.board.size,
    cells: [...state.board.cells]
  };

  if (action.type === "pass") {
    activePlayer.passedLastTurn = true;
  } else {
    for (const cell of validation.cells ?? []) {
      nextBoard.cells[getBoardIndex(nextBoard.size, cell.x, cell.y)] = activePlayer.seatIndex;
    }

    activePlayer.remainingPieceIds = activePlayer.remainingPieceIds.filter(
      (pieceId) => pieceId !== action.placement.pieceId
    );
    activePlayer.hasPlayed = true;
    activePlayer.lastPlacedPieceId = action.placement.pieceId;
  }

  const nextStateBase = withUpdatedScores({
    ...state,
    turn: state.turn + 1,
    currentPlayerId: advanceTurn(state),
    players: nextPlayerState,
    board: nextBoard,
    consecutivePasses: action.type === "pass" ? state.consecutivePasses + 1 : 0,
    winnerIds: [],
    history: state.history
  });
  const actionRecord = {
    turn: state.turn,
    playerId,
    action: encodeAction(action),
    resultingHash: hashGameState(nextStateBase)
  };
  let nextState: GameState = {
    ...nextStateBase,
    history: [...state.history, actionRecord]
  };
  const events: GameEvent[] = [
    {
      type: "action_applied",
      turn: state.turn,
      playerId
    }
  ];

  if (isGameOver(nextState)) {
    const scores = computeScores(nextState);
    nextState = {
      ...nextState,
      status: "finished",
      winnerIds: scores.winnerIds,
      players: nextState.players.map((player) => ({
        ...player,
        remainingPieceIds: [...player.remainingPieceIds],
        score: scores.entries.find((entry) => entry.playerId === player.id)?.score ?? player.score
      }))
    };
    events.push({
      type: "game_finished",
      turn: nextState.turn,
      winnerIds: scores.winnerIds
    });
  } else {
    events.push({
      type: "turn_advanced",
      turn: nextState.turn,
      currentPlayerId: nextState.currentPlayerId
    });
  }

  return {
    ok: true,
    code: "OK",
    state: nextState,
    action: actionRecord,
    events
  };
};
