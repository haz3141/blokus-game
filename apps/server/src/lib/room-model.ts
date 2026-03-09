import {
  DEFAULT_BOARD_SIZE,
  PLAYER_COLORS,
  applyAction,
  computeScores,
  createInitialGame,
  decodeAction,
  type GameState,
  type PlayerAction
} from "@cornerfall/game-core";
import type { ColorKey, RoomConfig, RoomSnapshot, WireAction } from "@cornerfall/protocol";

export interface RoomPlayer {
  playerId: string;
  sessionToken: string;
  name: string;
  seatIndex: number;
  colorKey: ColorKey;
  connected: boolean;
  lastSeenAt: string;
}

export interface RoomRecord {
  roomId: string;
  revision: number;
  status: "lobby" | "active" | "finished";
  createdAt: string;
  startedAt: string | null;
  hostPlayerId: string | null;
  config: RoomConfig;
  players: RoomPlayer[];
  game: GameState | null;
  winnerIds: string[];
}

export interface RoomMutationResult<T> {
  ok: boolean;
  code: string;
  record: RoomRecord;
  payload?: T;
}

const nowIso = (): string => new Date().toISOString();
const colorForSeat = (seatIndex: number): ColorKey => PLAYER_COLORS[seatIndex] ?? "amber";
const corePlayerIdForSeat = (seatIndex: number): `P${number}` => `P${seatIndex + 1}`;

const roomPlayerForCoreTurn = (record: RoomRecord): string | null => {
  if (!record.game) {
    return null;
  }

  const seatIndex = Number(record.game.currentPlayerId.replace("P", "")) - 1;
  return record.players.find((player) => player.seatIndex === seatIndex)?.playerId ?? null;
};

const roomPlayerIdForCoreWinner = (record: RoomRecord, coreWinnerId: string): string | null => {
  const seatIndex = Number(coreWinnerId.replace("P", "")) - 1;
  return record.players.find((player) => player.seatIndex === seatIndex)?.playerId ?? null;
};

export const createRoomRecord = (roomId: string, playerCount: 2 | 4): RoomRecord => ({
  roomId,
  revision: 0,
  status: "lobby",
  createdAt: nowIso(),
  startedAt: null,
  hostPlayerId: null,
  config: {
    playerCount,
    boardSize: DEFAULT_BOARD_SIZE[playerCount],
    variant: playerCount === 2 ? "duel" : "classic"
  },
  players: [],
  game: null,
  winnerIds: []
});

const nextRevision = (record: RoomRecord): RoomRecord => ({
  ...record,
  revision: record.revision + 1
});

const cloneRecord = (record: RoomRecord): RoomRecord => ({
  ...record,
  players: record.players.map((player) => ({ ...player })),
  game: record.game ? structuredClone(record.game) : null,
  winnerIds: [...record.winnerIds]
});

const firstOpenSeat = (record: RoomRecord): number | null => {
  for (let seatIndex = 0; seatIndex < record.config.playerCount; seatIndex += 1) {
    if (!record.players.some((player) => player.seatIndex === seatIndex)) {
      return seatIndex;
    }
  }

  return null;
};

export const buildRoomSnapshot = (record: RoomRecord): RoomSnapshot => {
  const scores = record.game ? computeScores(record.game) : null;

  return {
    roomId: record.roomId,
    revision: record.revision,
    status: record.status,
    createdAt: record.createdAt,
    startedAt: record.startedAt,
    hostPlayerId: record.hostPlayerId,
    currentPlayerId: roomPlayerForCoreTurn(record),
    config: record.config,
    seats: Array.from({ length: record.config.playerCount }, (_, seatIndex) => {
      const player = record.players.find((entry) => entry.seatIndex === seatIndex);
      return {
        seatIndex,
        colorKey: colorForSeat(seatIndex),
        playerId: player?.playerId ?? null,
        name: player?.name ?? null,
        connected: player?.connected ?? false
      };
    }),
    players: record.players.map((player) => ({
      playerId: player.playerId,
      name: player.name,
      seatIndex: player.seatIndex,
      colorKey: player.colorKey,
      connected: player.connected
    })),
    scores: record.players.map((player) => {
      const coreEntry = scores?.entries.find(
        (entry) => entry.playerId === corePlayerIdForSeat(player.seatIndex)
      );

      return {
        playerId: player.playerId,
        name: player.name,
        colorKey: player.colorKey,
        score: coreEntry?.score ?? 0,
        remainingCells: coreEntry?.remainingSquares ?? 0,
        hasPassed: record.game?.players.find((entry) => entry.seatIndex === player.seatIndex)?.passedLastTurn ?? false
      };
    }),
    winnerIds: record.winnerIds,
    game: record.game ? structuredClone(record.game) : null
  };
};

export const joinRoom = (
  record: RoomRecord,
  name: string,
  sessionToken?: string
): RoomMutationResult<{ playerId: string; sessionToken: string }> => {
  const next = cloneRecord(record);
  const matched = sessionToken ? next.players.find((player) => player.sessionToken === sessionToken) : undefined;

  if (matched) {
    matched.connected = true;
    matched.lastSeenAt = nowIso();
    matched.name = name || matched.name;
    return {
      ok: true,
      code: "OK",
      record: nextRevision(next),
      payload: {
        playerId: matched.playerId,
        sessionToken: matched.sessionToken
      }
    };
  }

  if (next.status !== "lobby") {
    return { ok: false, code: "ROOM_ALREADY_STARTED", record };
  }

  const seatIndex = firstOpenSeat(next);
  if (seatIndex === null) {
    return { ok: false, code: "ROOM_FULL", record };
  }

  const playerId = `player_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  const token = crypto.randomUUID().replace(/-/g, "");
  next.players.push({
    playerId,
    sessionToken: token,
    name,
    seatIndex,
    colorKey: colorForSeat(seatIndex),
    connected: true,
    lastSeenAt: nowIso()
  });

  if (!next.hostPlayerId) {
    next.hostPlayerId = playerId;
  }

  return {
    ok: true,
    code: "OK",
    record: nextRevision(next),
    payload: {
      playerId,
      sessionToken: token
    }
  };
};

export const resumeRoom = (
  record: RoomRecord,
  playerId: string,
  sessionToken: string
): RoomMutationResult<{ playerId: string }> => {
  const next = cloneRecord(record);
  const player = next.players.find(
    (entry) => entry.playerId === playerId && entry.sessionToken === sessionToken
  );

  if (!player) {
    return { ok: false, code: "SESSION_NOT_FOUND", record };
  }

  player.connected = true;
  player.lastSeenAt = nowIso();

  return {
    ok: true,
    code: "OK",
    record: nextRevision(next),
    payload: { playerId }
  };
};

export const disconnectPlayer = (record: RoomRecord, playerId: string): RoomRecord => {
  const next = cloneRecord(record);
  const player = next.players.find((entry) => entry.playerId === playerId);

  if (!player) {
    return record;
  }

  player.connected = false;
  player.lastSeenAt = nowIso();
  return nextRevision(next);
};

export const selectSeat = (
  record: RoomRecord,
  playerId: string,
  seatIndex: number
): RoomMutationResult<undefined> => {
  if (record.status !== "lobby") {
    return { ok: false, code: "GAME_ALREADY_STARTED", record };
  }

  if (seatIndex < 0 || seatIndex >= record.config.playerCount) {
    return { ok: false, code: "INVALID_SEAT", record };
  }

  const next = cloneRecord(record);
  const player = next.players.find((entry) => entry.playerId === playerId);
  if (!player) {
    return { ok: false, code: "PLAYER_NOT_FOUND", record };
  }

  const occupied = next.players.find((entry) => entry.seatIndex === seatIndex && entry.playerId !== playerId);
  if (occupied) {
    return { ok: false, code: "SEAT_TAKEN", record };
  }

  player.seatIndex = seatIndex;
  player.colorKey = colorForSeat(seatIndex);

  return { ok: true, code: "OK", record: nextRevision(next) };
};

export const startGame = (record: RoomRecord, playerId: string): RoomMutationResult<undefined> => {
  if (record.status !== "lobby") {
    return { ok: false, code: "GAME_ALREADY_STARTED", record };
  }

  if (record.hostPlayerId !== playerId) {
    return { ok: false, code: "HOST_ONLY", record };
  }

  if (record.players.length !== record.config.playerCount) {
    return { ok: false, code: "ROOM_NOT_READY", record };
  }

  const next = cloneRecord(record);
  next.players.sort((left, right) => left.seatIndex - right.seatIndex);
  next.game = createInitialGame({
    playerCount: next.config.playerCount,
    boardSize: next.config.boardSize,
    variant: next.config.variant
  });
  next.status = "active";
  next.startedAt = nowIso();
  next.winnerIds = [];

  return { ok: true, code: "OK", record: nextRevision(next) };
};

export const submitRoomAction = (
  record: RoomRecord,
  playerId: string,
  action: WireAction
): RoomMutationResult<undefined> => {
  if (record.status !== "active" || !record.game) {
    return { ok: false, code: "GAME_NOT_ACTIVE", record };
  }

  const player = record.players.find((entry) => entry.playerId === playerId);
  if (!player) {
    return { ok: false, code: "PLAYER_NOT_FOUND", record };
  }

  const decoded = decodeAction(action);
  if ("ok" in decoded) {
    return { ok: false, code: decoded.code, record };
  }

  const playerAction: PlayerAction =
    decoded.type === "pass"
      ? { type: "pass" }
      : {
          type: "place",
          placement: {
            pieceId: decoded.pieceId,
            origin: decoded.origin,
            transform: decoded.transform
          }
        };

  const result = applyAction(record.game, corePlayerIdForSeat(player.seatIndex), playerAction);
  if (!result.ok) {
    return { ok: false, code: result.code, record };
  }

  const next = cloneRecord(record);
  next.game = result.state;
  if (result.state.status === "finished") {
    next.status = "finished";
    next.winnerIds = result.state.winnerIds
      .map((winnerId) => roomPlayerIdForCoreWinner(next, winnerId))
      .filter((winnerId): winnerId is string => Boolean(winnerId));
  }

  return { ok: true, code: "OK", record: nextRevision(next) };
};
