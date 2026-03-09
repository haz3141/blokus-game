---
name: pwa-mobile-qa
description: Use when checking a mobile-first PWA for installability, offline shell behavior, touch usability, reconnect states, accessibility basics, and production readiness.
---

# PWA Mobile QA

Use this skill to review mobile-first web apps that must install cleanly and stay usable on phone browsers.

## Checklist

- Manifest includes name, theme color, background color, icons, and standalone display.
- Service worker caches app-shell assets only when live data must stay network-backed.
- Live multiplayer or websocket routes display a clear online-required state when offline.
- Primary actions have large tap targets and visible labels.
- Orientation changes and narrow viewports do not hide required controls.
- Install prompt behavior is intentional and non-spammy.
- Contrast, focus states, and reduced-motion behavior are acceptable.

## Testing Guidance

- Use at least one mobile viewport in Playwright.
- Cover initial load, installability basics, offline shell behavior, reconnect banners, and a core happy-path flow.
- Prefer semantic selectors and stable test IDs over brittle visual locators.
