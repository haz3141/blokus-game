import { expect, type Locator, type Page } from "@playwright/test";

const ROOM_ID_RE = /\/play\/([a-z0-9_-]+)/i;

export const suggestedTestIds = {
  createGame: "create-game",
  playerName: "player-name",
  joinRoom: "join-room",
  inviteLink: "invite-link",
  startGame: "start-game",
  currentTurn: "current-turn",
  reconnectBanner: "reconnect-banner",
  confirmMove: "confirm-move",
  pieceTilePrefix: "piece-tile-",
  boardCell: (x: number, y: number) => `board-cell-${x}-${y}`
};

export async function clickFirstVisible(page: Page, selectors: string[]): Promise<void> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return;
    }
  }

  throw new Error(`No visible action found for selectors: ${selectors.join(", ")}`);
}

export async function fillFirstVisible(page: Page, selectors: string[], value: string): Promise<void> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.fill(value);
      return;
    }
  }

  throw new Error(`No visible input found for selectors: ${selectors.join(", ")}`);
}

export async function waitForRoomUrl(page: Page): Promise<string> {
  await expect(page).toHaveURL(ROOM_ID_RE);
  const roomUrl = page.url();
  const roomMatch = roomUrl.match(ROOM_ID_RE);

  if (!roomMatch) {
    throw new Error(`Expected /play/:roomId URL, received ${roomUrl}`);
  }

  return roomUrl;
}

export async function maybeEnterName(page: Page, name: string): Promise<void> {
  const nameInput = await findVisibleLocator(page, [
    `[data-testid="${suggestedTestIds.playerName}"]`,
    'input[name="playerName"]',
    'input[autocomplete="nickname"]',
    'input[placeholder*="name" i]',
    'input[aria-label*="name" i]'
  ]);

  if (nameInput) {
    await nameInput.fill(name);
  }
}

export async function maybeJoinRoom(page: Page, name: string): Promise<void> {
  await maybeEnterName(page, name);

  const joinTrigger = await findVisibleLocator(page, [
    `[data-testid="${suggestedTestIds.joinRoom}"]`,
    'button:has-text("Join room")',
    'button:has-text("Join Room")',
    'button:has-text("Join game")',
    'button:has-text("Join Game")',
    'button:has-text("Continue")'
  ]);

  if (joinTrigger) {
    await joinTrigger.click();
  }
}

export async function createRoomFromLanding(page: Page, playerName: string): Promise<string> {
  await page.goto("/");
  await maybeEnterName(page, playerName);
  await clickFirstVisible(page, [
    `[data-testid="${suggestedTestIds.createGame}"]`,
    'button:has-text("Create game")',
    'button:has-text("Create Game")',
    'a:has-text("Create game")',
    'a:has-text("Create Game")'
  ]);

  return waitForRoomUrl(page);
}

export async function expectInviteLink(page: Page, roomUrl: string): Promise<void> {
  const inviteLocator = await findVisibleLocator(page, [
    `[data-testid="${suggestedTestIds.inviteLink}"]`,
    'input[readonly][name="inviteLink"]',
    'input[aria-label*="invite" i]',
    'input[aria-label*="share" i]'
  ]);

  if (!inviteLocator) {
    return;
  }

  await expect(inviteLocator).toBeVisible();

  const inviteValue = (await inviteLocator.inputValue().catch(() => "")).trim();
  if (inviteValue) {
    await expect(inviteLocator).toHaveValue(roomUrl);
  }
}

export async function expectLobbyReady(page: Page): Promise<void> {
  await waitForAnyVisible(page, [
    `[data-testid="${suggestedTestIds.startGame}"]`,
    'button:has-text("Start game")',
    'button:has-text("Start Game")',
    'text=/waiting for players/i',
    'text=/lobby/i'
  ]);
}

export async function startGame(page: Page): Promise<void> {
  await clickFirstVisible(page, [
    `[data-testid="${suggestedTestIds.startGame}"]`,
    'button:has-text("Start game")',
    'button:has-text("Start Game")'
  ]);
}

export async function expectGameHud(page: Page): Promise<void> {
  await waitForAnyVisible(page, [
    `[data-testid="${suggestedTestIds.currentTurn}"]`,
    'text=/current player/i',
    'text=/your turn/i',
    'text=/score/i'
  ]);
}

export async function selectFirstPiece(page: Page): Promise<void> {
  const pieceLocator = await findVisibleLocator(page, [
    `[data-testid^="${suggestedTestIds.pieceTilePrefix}"]`,
    '[data-piece-id]',
    '[aria-label*="piece" i]',
    'button:has-text("Monomino")',
    'button:has-text("Single")'
  ]);

  if (!pieceLocator) {
    throw new Error("No selectable piece tile was found.");
  }

  await pieceLocator.click();
}

export async function tapBoardCell(page: Page, x: number, y: number): Promise<void> {
  await clickFirstVisible(page, [
    `[data-testid="${suggestedTestIds.boardCell(x, y)}"]`,
    `[data-cell="${x},${y}"]`,
    `[aria-label="Board cell ${x},${y}"]`
  ]);
}

export async function confirmMove(page: Page): Promise<void> {
  await clickFirstVisible(page, [
    `[data-testid="${suggestedTestIds.confirmMove}"]`,
    'button:has-text("Confirm")',
    'button:has-text("Confirm move")',
    'button:has-text("Place piece")'
  ]);
}

export async function expectReconnectedState(page: Page): Promise<void> {
  await expectGameHud(page);
  const reconnectLocator = await findVisibleLocator(page, [
    `[data-testid="${suggestedTestIds.reconnectBanner}"]`,
    'text=/reconnecting/i',
    'text=/reconnected/i'
  ]);

  if (reconnectLocator) {
    await reconnectLocator.waitFor({ state: "hidden", timeout: 10_000 }).catch(() => undefined);
  }
}

async function findVisibleLocator(page: Page, selectors: string[]): Promise<Locator | null> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }

  return null;
}

async function waitForAnyVisible(page: Page, selectors: string[]): Promise<void> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await expect(locator).toBeVisible();
      return;
    }
  }

  await expect.poll(async () => {
    for (const selector of selectors) {
      if (await page.locator(selector).first().isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  }).toBe(true);
}
