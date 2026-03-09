import { createRoomRequestSchema, parseClientMessage, type ClientMessage, type ServerMessage } from "@cornerfall/protocol";

import {
  buildRoomSnapshot,
  createRoomRecord,
  disconnectPlayer,
  joinRoom,
  resumeRoom,
  selectSeat,
  startGame,
  submitRoomAction,
  type RoomRecord
} from "./lib/room-model.js";

export interface Env {
  ROOMS: DurableObjectNamespace;
}

type ConnectionMeta = {
  playerId: string | null;
};

const corsHeaders = (origin?: string | null): HeadersInit => ({
  "Access-Control-Allow-Origin": origin ?? "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  Vary: "Origin"
});

const json = (data: unknown, init?: ResponseInit, origin?: string | null): Response =>
  Response.json(data, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin)
    },
    ...init
  });

const toServerTime = (): string => new Date().toISOString();

const createRoomId = (): string => crypto.randomUUID().replace(/-/g, "").slice(0, 8);

const roomSnapshotMessage = (room: RoomRecord): ServerMessage => ({
  type: "room_snapshot",
  roomId: room.roomId,
  revision: room.revision,
  serverTime: toServerTime(),
  snapshot: buildRoomSnapshot(room)
});

const presenceMessage = (
  room: RoomRecord,
  playerId: string,
  connected: boolean
): ServerMessage => ({
  type: "presence_update",
  revision: room.revision,
  serverTime: toServerTime(),
  presence: {
    roomId: room.roomId,
    playerId,
    connected
  }
});

const welcomeMessage = (
  room: RoomRecord,
  playerId: string,
  sessionToken: string
): ServerMessage => ({
  type: "welcome",
  roomId: room.roomId,
  revision: room.revision,
  serverTime: toServerTime(),
  playerId,
  sessionToken
});

const rejectedMessage = (room: RoomRecord, code: string, message: string): ServerMessage => ({
  type: "action_rejected",
  roomId: room.roomId,
  revision: room.revision,
  serverTime: toServerTime(),
  code,
  message
});

const errorMessage = (room: RoomRecord, code: string, message: string): ServerMessage => ({
  type: "system_error",
  roomId: room.roomId,
  revision: room.revision,
  serverTime: toServerTime(),
  code,
  message
});

const pongMessage = (room: RoomRecord): ServerMessage => ({
  type: "pong",
  roomId: room.roomId,
  revision: room.revision,
  serverTime: toServerTime()
});

export class GameRoom {
  readonly connections = new Map<WebSocket, ConnectionMeta>();
  room: RoomRecord | null = null;
  readonly ready: Promise<void>;

  constructor(
    readonly state: DurableObjectState,
    readonly env: Env
  ) {
    this.ready = this.state.blockConcurrencyWhile(async () => {
      this.room = (await this.state.storage.get<RoomRecord>("room")) ?? null;
    });
  }

  async fetch(request: Request): Promise<Response> {
    await this.ready;
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/create") {
      const payload = createRoomRequestSchema.parse(await request.json());
      this.room = createRoomRecord(url.searchParams.get("roomId") ?? createRoomId(), payload.playerCount);
      await this.persist();
      return json(buildRoomSnapshot(this.mustGetRoom()));
    }

    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      const pair = new WebSocketPair();
      const client = pair[0];
      const server = pair[1];

      server.accept();
      this.connections.set(server, { playerId: null });
      server.addEventListener("message", (event) => {
        const payload = typeof event.data === "string" ? event.data : String(event.data);
        void this.onMessage(server, payload);
      });
      server.addEventListener("close", () => {
        void this.onClose(server);
      });

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    if (request.method === "GET" && url.pathname === "/snapshot") {
      return json(buildRoomSnapshot(this.mustGetRoom()));
    }

    return new Response("Not found", { status: 404 });
  }

  private mustGetRoom(): RoomRecord {
    if (!this.room) {
      throw new Error("Room not initialized");
    }

    return this.room;
  }

  private async persist(): Promise<void> {
    if (this.room) {
      await this.state.storage.put("room", this.room);
    }
  }

  private send(socket: WebSocket, message: ServerMessage): void {
    socket.send(JSON.stringify(message));
  }

  private broadcastSnapshot(): void {
    const room = this.mustGetRoom();
    const message = roomSnapshotMessage(room);

    for (const socket of this.connections.keys()) {
      this.send(socket, message);
    }
  }

  private broadcastPresence(playerId: string, connected: boolean): void {
    const room = this.mustGetRoom();
    const message = presenceMessage(room, playerId, connected);

    for (const socket of this.connections.keys()) {
      this.send(socket, message);
    }
  }

  private sendError(socket: WebSocket, code: string, message: string): void {
    const room = this.room;
    if (!room) {
      socket.send(
        JSON.stringify({
          type: "system_error",
          roomId: "unknown",
          revision: 0,
          serverTime: toServerTime(),
          code,
          message
        } satisfies ServerMessage)
      );
      return;
    }

    this.send(
      socket,
      errorMessage(room, code, message)
    );
  }

  private async onMessage(socket: WebSocket, raw: string): Promise<void> {
    let input: unknown;

    try {
      input = JSON.parse(raw);
    } catch {
      this.sendError(socket, "INVALID_JSON", "Malformed websocket payload");
      return;
    }

    const parsed = parseClientMessage(input);
    if (!parsed.success) {
      this.sendError(socket, "INVALID_MESSAGE", "Message did not match the protocol");
      return;
    }

    await this.handleClientMessage(socket, parsed.data);
  }

  private async handleClientMessage(socket: WebSocket, message: ClientMessage): Promise<void> {
    const room = this.mustGetRoom();
    const connection = this.connections.get(socket);
    if (!connection) {
      return;
    }

    switch (message.type) {
      case "hello": {
        if (message.playerId && message.sessionToken) {
          const result = resumeRoom(room, message.playerId, message.sessionToken);
          if (!result.ok) {
            this.sendError(socket, result.code, "Session resume failed");
            return;
          }

          this.room = result.record;
          connection.playerId = message.playerId;
          await this.persist();
          this.send(
            socket,
            welcomeMessage(this.room, message.playerId, message.sessionToken)
          );
          this.broadcastPresence(message.playerId, true);
          this.broadcastSnapshot();
        } else {
          this.broadcastSnapshot();
        }
        return;
      }
      case "join_room": {
        const result = joinRoom(room, message.name, message.sessionToken);
        if (!result.ok || !result.payload) {
          this.sendError(socket, result.code, "Unable to join room");
          return;
        }

        this.room = result.record;
        connection.playerId = result.payload.playerId;
        await this.persist();
        this.send(
          socket,
          welcomeMessage(this.room, result.payload.playerId, result.payload.sessionToken)
        );
        this.broadcastPresence(result.payload.playerId, true);
        this.broadcastSnapshot();
        return;
      }
      case "select_seat": {
        if (!connection.playerId) {
          this.sendError(socket, "NOT_JOINED", "Join the room first");
          return;
        }

        const result = selectSeat(room, connection.playerId, message.seatIndex);
        if (!result.ok) {
          this.sendError(socket, result.code, "Unable to change seat");
          return;
        }

        this.room = result.record;
        await this.persist();
        this.broadcastSnapshot();
        return;
      }
      case "start_game": {
        if (!connection.playerId) {
          this.sendError(socket, "NOT_JOINED", "Join the room first");
          return;
        }

        const result = startGame(room, connection.playerId);
        if (!result.ok) {
          this.sendError(socket, result.code, "Unable to start game");
          return;
        }

        this.room = result.record;
        await this.persist();
        this.broadcastSnapshot();
        return;
      }
      case "submit_action": {
        if (!connection.playerId) {
          this.sendError(socket, "NOT_JOINED", "Join the room first");
          return;
        }

        const result = submitRoomAction(room, connection.playerId, message.action);
        if (!result.ok) {
          this.send(
            socket,
            rejectedMessage(room, result.code, "Action rejected by authoritative validation")
          );
          return;
        }

        this.room = result.record;
        await this.persist();
        this.broadcastSnapshot();
        return;
      }
      case "ping": {
        this.send(
          socket,
          pongMessage(room)
        );
      }
    }
  }

  private async onClose(socket: WebSocket): Promise<void> {
    const metadata = this.connections.get(socket);
    this.connections.delete(socket);

    if (!metadata?.playerId) {
      return;
    }

    this.room = disconnectPlayer(this.mustGetRoom(), metadata.playerId);
    await this.persist();
    this.broadcastPresence(metadata.playerId, false);
    this.broadcastSnapshot();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request.headers.get("origin"))
      });
    }

    if (url.pathname === "/health") {
      return json({ ok: true, service: "cornerfall-server" }, {}, request.headers.get("origin"));
    }

    if (url.pathname === "/api/rooms" && request.method === "POST") {
      const payload = createRoomRequestSchema.parse(await request.json());
      const roomId = createRoomId();
      const stub = env.ROOMS.get(env.ROOMS.idFromName(roomId));
      await stub.fetch(`https://room/create?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify(payload)
      }).then((response) => response.json());

      return json(
        {
          roomId,
          roomUrl: `/play/${roomId}`,
          websocketUrl: `${url.protocol === "https:" ? "wss" : "ws"}://${url.host}/connect/${roomId}`,
          playerCount: payload.playerCount
        },
        {},
        request.headers.get("origin")
      );
    }

    const connectMatch = url.pathname.match(/^\/connect\/([a-z0-9_-]+)$/i);
    if (connectMatch) {
      const roomId = connectMatch[1]!;
      const stub = env.ROOMS.get(env.ROOMS.idFromName(roomId));
      return stub.fetch("https://room/connect", request);
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(request.headers.get("origin"))
    });
  }
};
