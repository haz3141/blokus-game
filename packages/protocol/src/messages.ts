import { z } from "zod";

import {
  actionRejectionCodeSchema,
  identifierSchema,
  presenceUpdateSchema,
  roomSnapshotSchema,
  wireActionSchema
} from "./schema.js";

const roomScopedSchema = z.object({
  roomId: identifierSchema
});

export const helloMessageSchema = roomScopedSchema.extend({
  type: z.literal("hello"),
  playerId: identifierSchema.optional(),
  sessionToken: z.string().min(8).max(128).optional(),
  lastRevision: z.int().min(0).optional()
});

export const joinRoomMessageSchema = roomScopedSchema.extend({
  type: z.literal("join_room"),
  name: z.string().trim().min(1).max(24),
  sessionToken: z.string().min(8).max(128).optional()
});

export const selectSeatMessageSchema = roomScopedSchema.extend({
  type: z.literal("select_seat"),
  seatIndex: z.int().min(0).max(3)
});

export const startGameMessageSchema = roomScopedSchema.extend({
  type: z.literal("start_game")
});

export const submitActionMessageSchema = roomScopedSchema.extend({
  type: z.literal("submit_action"),
  action: wireActionSchema
});

export const pingMessageSchema = roomScopedSchema.extend({
  type: z.literal("ping"),
  clientTime: z.int().optional()
});

export const clientMessageSchema = z.discriminatedUnion("type", [
  helloMessageSchema,
  joinRoomMessageSchema,
  selectSeatMessageSchema,
  startGameMessageSchema,
  submitActionMessageSchema,
  pingMessageSchema
]);

export const welcomeMessageSchema = z.object({
  type: z.literal("welcome"),
  roomId: identifierSchema,
  playerId: identifierSchema,
  sessionToken: z.string().min(8).max(128),
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true })
});

export const roomSnapshotMessageSchema = z.object({
  type: z.literal("room_snapshot"),
  roomId: identifierSchema,
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true }),
  snapshot: roomSnapshotSchema
});

export const actionRejectedMessageSchema = z.object({
  type: z.literal("action_rejected"),
  roomId: identifierSchema,
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true }),
  code: actionRejectionCodeSchema,
  message: z.string().min(1).max(200)
});

export const systemErrorMessageSchema = z.object({
  type: z.literal("system_error"),
  roomId: identifierSchema,
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true }),
  code: actionRejectionCodeSchema,
  message: z.string().min(1).max(200)
});

export const pongMessageSchema = z.object({
  type: z.literal("pong"),
  roomId: identifierSchema,
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true })
});

export const presenceUpdateMessageSchema = z.object({
  type: z.literal("presence_update"),
  revision: z.int().min(0),
  serverTime: z.string().datetime({ offset: true }),
  presence: presenceUpdateSchema
});

export const serverMessageSchema = z.discriminatedUnion("type", [
  welcomeMessageSchema,
  roomSnapshotMessageSchema,
  actionRejectedMessageSchema,
  presenceUpdateMessageSchema,
  systemErrorMessageSchema,
  pongMessageSchema
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;

export function parseClientMessage(input: unknown): ReturnType<typeof clientMessageSchema.safeParse> {
  return clientMessageSchema.safeParse(input);
}

export function parseServerMessage(input: unknown): ReturnType<typeof serverMessageSchema.safeParse> {
  return serverMessageSchema.safeParse(input);
}
