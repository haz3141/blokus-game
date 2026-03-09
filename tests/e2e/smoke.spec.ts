import { test, expect, devices } from "@playwright/test";

import {
  confirmMove,
  createRoomFromLanding,
  expectGameHud,
  expectInviteLink,
  expectLobbyReady,
  expectReconnectedState,
  maybeJoinRoom,
  selectFirstPiece,
  startGame,
  suggestedTestIds,
  tabUntilFocused,
  waitForLandingReady,
  waitForRoomUrl,
  tapBoardCell
} from "./support/ui";

test.describe("Cornerfall multiplayer smoke", () => {
  test("host can create a room, invite a second player, make an opening move, and reconnect", async ({
    browser,
    page
  }) => {
    const roomUrl = await test.step("host creates a room", async () => createRoomFromLanding(page, "Host"));
    await expectInviteLink(page, roomUrl);
    await expectLobbyReady(page);

    const guestContext = await browser.newContext({
      ...devices["Pixel 7"]
    });
    const guestPage = await guestContext.newPage();

    await test.step("guest joins from the shared room URL", async () => {
      await guestPage.goto(roomUrl);
      await maybeJoinRoom(guestPage, "Guest");
      await expectLobbyReady(guestPage);
    });

    await test.step("host starts the game", async () => {
      await startGame(page);
      await expectGameHud(page);
      await expectGameHud(guestPage);
    });

    await test.step("host commits an opening move", async () => {
      await selectFirstPiece(page);
      await tapBoardCell(page, 0, 0);
      await confirmMove(page);
      await expectGameHud(page);
      await expectGameHud(guestPage);
    });

    await test.step("host refreshes and reconnects to the same room", async () => {
      await page.reload();
      await expect(page).toHaveURL(roomUrl);
      await expectReconnectedState(page);
    });

    await guestContext.close();
  });

  test("desktop keyboard path reaches create, start, and confirm controls", async ({
    browser,
    page
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only keyboard smoke");

    await page.goto("/");
    await waitForLandingReady(page);
    await page.getByTestId(suggestedTestIds.playerName).focus();
    await page.keyboard.type("Keyboard Host");

    const createButton = page.getByTestId(suggestedTestIds.createGame);
    await tabUntilFocused(page, createButton);
    await page.keyboard.press("Enter");

    const roomUrl = await waitForRoomUrl(page);
    await expectLobbyReady(page);

    const guestContext = await browser.newContext({
      ...devices["Pixel 7"]
    });
    const guestPage = await guestContext.newPage();

    await guestPage.goto(roomUrl);
    await maybeJoinRoom(guestPage, "Keyboard Guest");
    await expectLobbyReady(guestPage);

    const startButton = page.getByTestId(suggestedTestIds.startGame);
    await expect(startButton).toBeEnabled();
    await page.getByTestId(suggestedTestIds.inviteLink).focus();
    await tabUntilFocused(page, startButton, 8);
    await page.keyboard.press("Enter");

    await expectGameHud(page);
    await selectFirstPiece(page);
    await tapBoardCell(page, 0, 0);

    const confirmButton = page.getByTestId(suggestedTestIds.confirmMove);
    await confirmButton.focus();
    await page.keyboard.press("Enter");

    await expectGameHud(page);
    await guestContext.close();
  });
});
