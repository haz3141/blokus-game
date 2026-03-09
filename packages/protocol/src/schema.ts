import { z } from "zod";

export const playerCountSchema = z.union([z.literal(2), z.literal(4)]);
export const roomVariantSchema = z.enum(["duel", "classic"]);
export const roomStatusSchema = z.enum(["lobby", "active", "finished"]);
export const colorKeySchema = z.enum(["amber", "azure", "emerald", "rose"]);

export const identifierSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9_-]+$/i);

export const isoTimestampSchema = z.string().datetime({ offset: true });

export const coordinateSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0)
});

export const placementSchema = z.object({
  pieceId: z.string().min(1).max(32),
  origin: coordinateSchema,
  transform: z.string().min(1).max(32)
});

export const wireActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("place"),
    pieceId: z.string().min(1).max(32),
    origin: coordinateSchema,
    transform: z.string().min(1).max(32)
  }),
  z.object({
    type: z.literal("pass")
  })
]);

export const roomConfigSchema = z.object({
  playerCount: playerCountSchema,
  boardSize: z.number().int().positive(),
  variant: roomVariantSchema
});

export const createRoomRequestSchema = z.object({
  playerCount: playerCountSchema.default(2)
});

export const createRoomResponseSchema = z.object({
  roomId: identifierSchema,
  roomUrl: z.string().min(1),
  websocketUrl: z.string().min(1),
  playerCount: playerCountSchema
});

export const seatAssignmentSchema = z.object({
  seatIndex: z.number().int().min(0).max(3),
  colorKey: colorKeySchema,
  playerId: identifierSchema.nullable(),
  name: z.string().min(1).max(24).nullable(),
  connected: z.boolean()
});

export const playerSummarySchema = z.object({
  playerId: identifierSchema,
  name: z.string().min(1).max(24),
  seatIndex: z.number().int().min(0).max(3),
  colorKey: colorKeySchema,
  connected: z.boolean()
});

export const scoreEntrySchema = z.object({
  playerId: identifierSchema,
  name: z.string().min(1).max(24),
  colorKey: colorKeySchema,
  score: z.number().int(),
  remainingCells: z.number().int().min(0),
  hasPassed: z.boolean()
});

export const roomSnapshotSchema = z.object({
  roomId: identifierSchema,
  revision: z.number().int().min(0),
  status: roomStatusSchema,
  createdAt: isoTimestampSchema,
  startedAt: isoTimestampSchema.nullable(),
  hostPlayerId: identifierSchema.nullable(),
  currentPlayerId: identifierSchema.nullable(),
  config: roomConfigSchema,
  seats: z.array(seatAssignmentSchema),
  players: z.array(playerSummarySchema),
  scores: z.array(scoreEntrySchema),
  winnerIds: z.array(identifierSchema),
  game: z.unknown().nullable()
});

export const actionRejectionCodeSchema = z.string().min(1).max(64);
export const presenceUpdateSchema = z.object({
  roomId: identifierSchema,
  playerId: identifierSchema,
  connected: z.boolean()
});

export type ColorKey = z.infer<typeof colorKeySchema>;
export type CreateRoomRequest = z.infer<typeof createRoomRequestSchema>;
export type CreateRoomResponse = z.infer<typeof createRoomResponseSchema>;
export type RoomConfig = z.infer<typeof roomConfigSchema>;
export type RoomSnapshot = z.infer<typeof roomSnapshotSchema>;
export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type WireAction = z.infer<typeof wireActionSchema>;
