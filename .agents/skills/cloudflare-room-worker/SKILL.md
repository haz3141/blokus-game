---
name: cloudflare-room-worker
description: Use when implementing or reviewing a Cloudflare Worker plus Durable Object room backend with WebSockets, reconnection, authoritative state, room lifecycle, and snapshot broadcasting.
---

# Cloudflare Room Worker

Use this skill for room-based multiplayer backends built on Cloudflare Workers and Durable Objects.

## Workflow

1. Define the room actor state:
   - room metadata
   - players and session tokens
   - canonical game state
   - revision counter
2. Keep one Durable Object per room.
3. Validate every inbound message at the protocol boundary.
4. Apply game actions only inside the Durable Object against canonical state.
5. Broadcast canonical snapshots after accepted mutations.

## Backend Rules

- Reconnect with opaque room-scoped session tokens, not accounts.
- Reject stale or invalid actions with machine-readable codes.
- Prefer monotonic revision numbers over timing assumptions.
- Treat full snapshots as the MVP default unless payload size becomes a real problem.
- Late spectators are optional and should not complicate the core room lifecycle.

## Verification

- Test create, join, seat assignment, host start, valid move, invalid move, reconnect, and revision ordering.
- Prefer local Worker runtime tests and deterministic room fixtures.
- Wait on revision changes in integration tests instead of sleeping.
