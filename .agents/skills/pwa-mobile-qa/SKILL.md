---
name: pwa-mobile-qa
description: Use this skill when implementing or reviewing mobile-first layout, installability, offline shell behavior, reconnect UX, and touch ergonomics for the web app.
---

# PWA Mobile QA

Use this skill for `apps/web` changes that affect mobile usability or PWA behavior.

## QA Priorities

1. Core flow must work on a narrow mobile viewport first.
2. Tap targets must be forgiving and readable.
3. Installability must be explicit and non-blocking.
4. Offline behavior must be honest: shell routes can work, live multiplayer cannot.
5. Reconnect states must preserve context without hiding stale state.

## Checklist

- landing page works on mobile width
- join flow works without keyboard traps
- action tray stays reachable above mobile browser chrome
- share/copy interactions are visible and easy to tap
- manifest includes standalone mode and icons
- service worker does not pretend live room state is offline-capable
- reconnect overlay is visible but does not wipe the board immediately
- contrast and focus states remain acceptable
