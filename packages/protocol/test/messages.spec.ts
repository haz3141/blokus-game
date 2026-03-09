import { describe, expect, it } from "vitest";

import {
  createRoomRequestSchema,
  parseClientMessage,
  parseServerMessage
} from "../src/index.js";

describe("protocol schemas", () => {
  it("applies defaults for room creation", () => {
    expect(createRoomRequestSchema.parse({})).toEqual({ playerCount: 2 });
  });

  it("accepts a valid join message", () => {
    const parsed = parseClientMessage({
      type: "join_room",
      roomId: "room1234",
      name: "River"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid submit action payloads", () => {
    const parsed = parseClientMessage({
      type: "submit_action",
      roomId: "room1234",
      action: {
        type: "place",
        pieceId: "",
        origin: { x: -1, y: 2 },
        transform: ""
      }
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts canonical room snapshots", () => {
    const parsed = parseServerMessage({
      type: "room_snapshot",
      roomId: "room1234",
      revision: 4,
      serverTime: "2026-03-09T00:00:00.000Z",
      snapshot: {
        roomId: "room1234",
        revision: 4,
        status: "lobby",
        createdAt: "2026-03-09T00:00:00.000Z",
        startedAt: null,
        hostPlayerId: null,
        currentPlayerId: null,
        config: {
          playerCount: 2,
          boardSize: 14,
          variant: "duel"
        },
        seats: [
          {
            seatIndex: 0,
            colorKey: "amber",
            playerId: null,
            name: null,
            connected: false
          },
          {
            seatIndex: 1,
            colorKey: "azure",
            playerId: null,
            name: null,
            connected: false
          }
        ],
        players: [],
        scores: [],
        winnerIds: [],
        game: null
      }
    });

    expect(parsed.success).toBe(true);
  });
});
