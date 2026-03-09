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
  tapBoardCell
} from "./support/ui";

test.describe("Cornerfall mobile smoke", () => {
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
});
