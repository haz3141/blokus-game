---
name: cloudflare-room-worker
description: Use this skill when implementing or reviewing the Cloudflare Worker, Durable Object room state, session resume, room lifecycle, or websocket protocol behavior for multiplayer gameplay.
---

# Cloudflare Room Worker

Use this skill for `apps/server` and `packages/protocol` changes that affect authoritative multiplayer flow.

## Architecture Rules

- One Durable Object owns one room.
- The server is the only authority allowed to apply moves.
- Broadcast canonical snapshots with monotonic revisions instead of client-derived patches.
- Reconnect by room-scoped opaque session token, not by accounts.

## Room Workflow

1. Create room over HTTP and return the shareable room URL immediately.
2. Join or resume over WebSocket with `hello` and room-scoped session data.
3. Start the game only from the host when the minimum player count is met.
4. Validate every submitted action against current canonical state.
5. Broadcast one updated snapshot on accepted mutations and a typed rejection on invalid ones.

## Protocol Rules

- Keep message shapes in `packages/protocol`.
- Use discriminated unions and runtime validation at the network boundary.
- Include `roomId`, `revision`, and canonical room state in every authoritative snapshot.

## Test Checklist

- create room
- join room and assign seats
- reject invalid or stale actions
- accept valid moves and increment revision
- refresh/reconnect with the same session token
- reject mid-game fresh joins for MVP
