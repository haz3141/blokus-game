import { describe, expect, it } from "vitest";

import {
  buildRoomSnapshot,
  createRoomRecord,
  joinRoom,
  resumeRoom,
  selectSeat,
  startGame,
  submitRoomAction
} from "../src/lib/room-model.js";

describe("room-model", () => {
  it("creates a four-player room on the large board", () => {
    const room = createRoomRecord("room1234", 4);

    expect(room.config.boardSize).toBe(20);
    expect(room.config.playerCount).toBe(4);
  });

  it("joins and resumes a player session", () => {
    const room = createRoomRecord("room1234", 2);
    const joined = joinRoom(room, "Host");

    expect(joined.ok).toBe(true);
    if (!joined.ok || !joined.payload) {
      return;
    }

    const resumed = resumeRoom(joined.record, joined.payload.playerId, joined.payload.sessionToken);
    expect(resumed.ok).toBe(true);
  });

  it("starts once all seats are filled and surfaces the room-turn player", () => {
    let room = createRoomRecord("room1234", 2);
    const host = joinRoom(room, "Host");
    if (!host.ok || !host.payload) {
      throw new Error("Host should join successfully");
    }

    room = host.record;
    const guest = joinRoom(room, "Guest");
    if (!guest.ok || !guest.payload) {
      throw new Error("Guest should join successfully");
    }

    room = guest.record;
    const started = startGame(room, host.payload.playerId);

    expect(started.ok).toBe(true);
    if (!started.ok) {
      return;
    }

    const snapshot = buildRoomSnapshot(started.record);
    expect(snapshot.currentPlayerId).toBe(host.payload.playerId);
  });

  it("accepts a legal opening move through the room model", () => {
    let room = createRoomRecord("room1234", 2);
    const host = joinRoom(room, "Host");
    const guest = joinRoom(host.record, "Guest");

    if (!host.ok || !host.payload || !guest.ok || !guest.payload) {
      throw new Error("Room should fill successfully");
    }

    const started = startGame(guest.record, host.payload.playerId);
    if (!started.ok) {
      throw new Error("Room should start successfully");
    }

    const move = submitRoomAction(started.record, host.payload.playerId, {
      type: "place",
      pieceId: "mono",
      origin: { x: 0, y: 0 },
      transform: "r0"
    });

    expect(move.ok).toBe(true);
    if (!move.ok) {
      return;
    }

    const snapshot = buildRoomSnapshot(move.record);
    expect(snapshot.currentPlayerId).toBe(guest.payload.playerId);
  });

  it("lets players swap to an open seat in the lobby", () => {
    const room = createRoomRecord("room1234", 4);
    const host = joinRoom(room, "Host");

    if (!host.ok || !host.payload) {
      throw new Error("Host should join successfully");
    }

    const moved = selectSeat(host.record, host.payload.playerId, 3);
    expect(moved.ok).toBe(true);
  });
});
