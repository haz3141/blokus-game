import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoomResponseSchema } from "@cornerfall/protocol";

import { useInstallPrompt } from "../hooks/useInstallPrompt.js";
import { getApiBaseUrl } from "../lib/api.js";
import { loadPlayerName, savePlayerName } from "../lib/storage.js";

export function HomePage() {
  const navigate = useNavigate();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [playerName, setPlayerName] = useState(() => loadPlayerName());
  const [playerCount, setPlayerCount] = useState<2 | 4>(2);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function createRoom(): Promise<void> {
    if (!playerName.trim()) {
      setErrorMessage("Enter a display name before creating a room.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    savePlayerName(playerName.trim());

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/rooms`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          playerCount
        })
      });

      if (!response.ok) {
        throw new Error("Unable to create a room.");
      }

      const payload = createRoomResponseSchema.parse(await response.json());
      navigate(payload.roomUrl, {
        state: {
          autoJoinName: playerName.trim()
        }
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create a room.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-shell center-shell">
      <section className="layout-column">
        <div className="card-panel hero">
          <p className="eyebrow">Original Corner Strategy</p>
          <h1>Cornerfall</h1>
          <p className="hero-copy">
            Claim space from the corners, share a room link instantly, and play a touch-first
            polyomino duel or full table from any modern phone browser.
          </p>
          <div className="grid-form">
            <label className="input-stack">
              <span>Name</span>
              <input
                data-testid="player-name"
                autoComplete="nickname"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Your display name"
              />
            </label>
            <div className="radio-stack">
              <span>Players</span>
              <div className="segmented" role="group" aria-label="Player count">
                {[2, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    data-active={playerCount === count}
                    onClick={() => setPlayerCount(count as 2 | 4)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="stack-row">
            <button
              className="button-primary"
              type="button"
              data-testid="create-game"
              disabled={submitting}
              onClick={() => void createRoom()}
            >
              {submitting ? "Creating…" : "Create game"}
            </button>
            {canInstall ? (
              <button
                className="button-secondary"
                type="button"
                onClick={() => {
                  void promptInstall();
                }}
              >
                Install app
              </button>
            ) : null}
          </div>
          <p className="muted-copy">
            Install the PWA for faster return visits. Live multiplayer rooms still require an active
            network connection.
          </p>
          {errorMessage ? <p className="danger-note">{errorMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
