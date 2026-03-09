import {
  getPlacedCells,
  type GameState,
  type Placement,
  type PlayerState,
  type TransformKey,
  validateMove
} from "@cornerfall/game-core";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { GameScene } from "../features/game-3d/GameScene.js";
import { getSelectedTransform, useGameUiStore } from "../store/useGameUiStore.js";
import { useRoomConnection } from "../hooks/useRoomConnection.js";

function corePlayerIdForSeat(seatIndex: number): `P${number}` {
  return `P${seatIndex + 1}`;
}

function findLocalPlayer(snapshot: ReturnType<typeof useRoomConnection>["snapshot"], playerId: string | null) {
  return snapshot?.players.find((player) => player.playerId === playerId) ?? null;
}

function getCorePlayer(game: GameState, seatIndex: number): PlayerState | undefined {
  return game.players.find((player) => player.seatIndex === seatIndex);
}

function formatPieceLabel(pieceId: string): string {
  return pieceId.replaceAll("pentomino-", "").replaceAll("tetromino-", "").replaceAll("tromino-", "");
}

export function PlayRoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const {
    connectionState,
    snapshot,
    errorMessage,
    playerId,
    roomNameDraft,
    setRoomNameDraft,
    joinRoom,
    sendMessage
  } = useRoomConnection(roomId ?? "");
  const selectedPieceId = useGameUiStore((state) => state.selectedPieceId);
  const previewOrigin = useGameUiStore((state) => state.previewOrigin);
  const rotationIndex = useGameUiStore((state) => state.rotationIndex);
  const flipped = useGameUiStore((state) => state.flipped);
  const cameraMode = useGameUiStore((state) => state.cameraMode);
  const setSelectedPieceId = useGameUiStore((state) => state.setSelectedPieceId);
  const setPreviewOrigin = useGameUiStore((state) => state.setPreviewOrigin);
  const rotateClockwise = useGameUiStore((state) => state.rotateClockwise);
  const rotateCounterClockwise = useGameUiStore((state) => state.rotateCounterClockwise);
  const toggleFlip = useGameUiStore((state) => state.toggleFlip);
  const resetPlacement = useGameUiStore((state) => state.resetPlacement);
  const setCameraMode = useGameUiStore((state) => state.setCameraMode);
  const [copied, setCopied] = useState(false);
  const autoJoinAttemptedRef = useRef(false);

  const localPlayer = findLocalPlayer(snapshot, playerId);
  const game = (snapshot?.game as GameState | null) ?? null;
  const localCorePlayer = game && localPlayer ? getCorePlayer(game, localPlayer.seatIndex) : undefined;
  const autoJoinName =
    typeof location.state === "object" &&
    location.state &&
    "autoJoinName" in location.state &&
    typeof location.state.autoJoinName === "string"
      ? location.state.autoJoinName
      : null;
  const transform = getSelectedTransform(flipped, rotationIndex);
  const activePlacement: Placement | null =
    selectedPieceId && previewOrigin
      ? {
          pieceId: selectedPieceId as Placement["pieceId"],
          origin: previewOrigin,
          transform: transform as TransformKey
        }
      : null;
  const previewValidation =
    game && localPlayer && activePlacement
      ? validateMove(game, corePlayerIdForSeat(localPlayer.seatIndex), {
          type: "place",
          placement: activePlacement
        })
      : null;
  const previewCells =
    activePlacement && previewValidation?.ok && previewValidation.cells
      ? previewValidation.cells
      : activePlacement
        ? getPlacedCells(activePlacement)
        : [];

  useEffect(() => {
    resetPlacement();
  }, [snapshot?.revision, resetPlacement]);

  useEffect(() => {
    if (
      !autoJoinName ||
      autoJoinAttemptedRef.current ||
      connectionState !== "connected" ||
      localPlayer
    ) {
      return;
    }

    autoJoinAttemptedRef.current = true;
    setRoomNameDraft(autoJoinName);
    joinRoom(autoJoinName);
  }, [autoJoinName, connectionState, joinRoom, localPlayer, setRoomNameDraft]);

  if (!roomId) {
    return null;
  }

  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const isHost = snapshot?.hostPlayerId === localPlayer?.playerId;
  const isJoined = Boolean(localPlayer);
  const isLocalTurn = snapshot?.currentPlayerId === localPlayer?.playerId;
  const isGameActive = snapshot?.status === "active" && game;
  const isGameFinished = snapshot?.status === "finished";
  const currentTurnName =
    snapshot?.players.find((player) => player.playerId === snapshot.currentPlayerId)?.name ?? "Waiting";
  const winnerNames = snapshot?.winnerIds.length
    ? snapshot.winnerIds
        .map((winnerId) => snapshot.players.find((player) => player.playerId === winnerId)?.name ?? winnerId)
        .join(", ")
    : "No winner";
  const canConfirm = Boolean(
    isLocalTurn && connectionState === "connected" && activePlacement && previewValidation?.ok
  );

  return (
    <main className="app-shell">
      <section className="layout-column">
        <header className="topbar">
          <div>
            <p className="eyebrow">Room {roomId}</p>
            <h1>Cornerfall</h1>
          </div>
          <div className="stack-row">
            <span
              className="status-pill"
              data-danger={connectionState === "reconnecting" || connectionState === "error"}
              data-testid="reconnect-banner"
            >
              {connectionState}
            </span>
          </div>
        </header>

        {!isJoined ? (
          <section className="card-panel">
            <h2>Join room</h2>
            <p className="muted-copy">Choose a display name before taking a seat.</p>
            <div className="grid-form">
              <label className="input-stack">
                <span>Name</span>
                <input
                  data-testid="player-name"
                  value={roomNameDraft}
                  onChange={(event) => setRoomNameDraft(event.target.value)}
                  placeholder="Your display name"
                />
              </label>
            </div>
            <div className="stack-row">
              <button className="button-primary" type="button" data-testid="join-room" onClick={() => joinRoom()}>
                Join room
              </button>
            </div>
            {errorMessage ? <p className="danger-note">{errorMessage}</p> : null}
          </section>
        ) : null}

        {!snapshot ? (
          <section className="card-panel">
            <h2>Connecting</h2>
            <p className="muted-copy">Fetching the latest room snapshot.</p>
          </section>
        ) : null}

        {snapshot && !isGameActive && snapshot.status === "lobby" && isJoined ? (
          <section className="lobby-grid">
            <div className="card-panel">
              <div className="toolbar-row">
                <div>
                  <p className="eyebrow">Invite</p>
                  <h2>Lobby</h2>
                </div>
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(shareUrl).then(() => {
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1800);
                    });
                  }}
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              <input className="room-link" data-testid="invite-link" readOnly value={shareUrl} />
              <p className="muted-copy">
                Fill all {snapshot.config.playerCount} seats, then the host can start the game.
              </p>
              <p className="muted-copy">
                Live play requires connectivity. The installed app keeps the shell available offline,
                but room sync resumes when the network returns.
              </p>
              <div className="seat-list">
                {snapshot.players.map((player) => (
                  <div key={player.playerId} className="score-row">
                    <span>{player.name}</span>
                    <small>
                      seat {player.seatIndex + 1} · {player.connected ? "connected" : "away"}
                    </small>
                  </div>
                ))}
              </div>
              {isHost ? (
                <button
                  className="button-primary"
                  type="button"
                  data-testid="start-game"
                  disabled={snapshot.players.length !== snapshot.config.playerCount}
                  onClick={() => sendMessage({ type: "start_game", roomId })}
                >
                  Start game
                </button>
              ) : (
                <p className="muted-copy">Only the host can start the match.</p>
              )}
            </div>

            <aside className="hud-panel">
              <h2>Seats</h2>
              <div className="seat-list">
                {snapshot.seats.map((seat) => (
                  <button
                    key={seat.seatIndex}
                    type="button"
                    className="seat-button"
                    data-active={seat.playerId === localPlayer?.playerId}
                    onClick={() =>
                      sendMessage({
                        type: "select_seat",
                        roomId,
                        seatIndex: seat.seatIndex
                      })
                    }
                  >
                    <span>Seat {seat.seatIndex + 1}</span>
                    <small>{seat.name ?? "Open"}</small>
                  </button>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

        {isGameActive && snapshot ? (
          <section className="play-grid">
            <div className="board-shell">
              <div className="toolbar-row">
                <div>
                  <p className="eyebrow">Current player</p>
                  <h2 data-testid="current-turn">{currentTurnName}</h2>
                </div>
                <span className="status-pill">{snapshot.status}</span>
              </div>
              <GameScene
                size={game.board.size}
                boardCells={game.board.cells}
                previewCells={previewCells}
                previewValid={Boolean(previewValidation?.ok)}
                previewTint="#f59e0b"
                cameraMode={cameraMode}
                onCellSelect={setPreviewOrigin}
              />
            </div>

            <aside className="action-tray">
              <div className="hud-panel">
                <div className="meta-grid">
                  <div>
                    <p className="eyebrow">You</p>
                    <strong>{localPlayer?.name}</strong>
                  </div>
                  <div>
                    <p className="eyebrow">Pieces left</p>
                    <strong>{localCorePlayer?.remainingPieceIds.length ?? 0}</strong>
                  </div>
                </div>
                <div className="camera-toggle">
                  <button className="mini-button" type="button" onClick={() => setCameraMode("angled")}>
                    Angled
                  </button>
                  <button className="mini-button" type="button" onClick={() => setCameraMode("topDown")}>
                    Top-down
                  </button>
                </div>
              </div>

              <div className="tray-panel">
                <h2>Pieces</h2>
                <div className="piece-grid">
                  {(localCorePlayer?.remainingPieceIds ?? []).map((pieceId) => (
                    <button
                      key={pieceId}
                      type="button"
                      className="piece-button"
                      data-active={selectedPieceId === pieceId}
                      data-testid={`piece-tile-${pieceId}`}
                      onClick={() => setSelectedPieceId(pieceId)}
                    >
                      <span>{formatPieceLabel(pieceId)}</span>
                      <small>{pieceId}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="hud-panel">
                <div className="action-buttons">
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={!isLocalTurn}
                    onClick={() => rotateCounterClockwise()}
                  >
                    Rotate left
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={!isLocalTurn}
                    onClick={() => rotateClockwise()}
                  >
                    Rotate right
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={!isLocalTurn}
                    onClick={() => toggleFlip()}
                  >
                    Flip
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={!isLocalTurn}
                    onClick={() => resetPlacement()}
                  >
                    Cancel
                  </button>
                  <button
                    className="button-primary"
                    type="button"
                    data-testid="confirm-move"
                    disabled={!canConfirm}
                    onClick={() => {
                      if (!activePlacement) {
                        return;
                      }

                      sendMessage({
                        type: "submit_action",
                        roomId,
                        action: {
                          type: "place",
                          pieceId: activePlacement.pieceId,
                          origin: activePlacement.origin,
                          transform: activePlacement.transform
                        }
                      });
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="button-ghost"
                    type="button"
                    disabled={!isLocalTurn}
                    onClick={() =>
                      sendMessage({
                        type: "submit_action",
                        roomId,
                        action: { type: "pass" }
                      })
                    }
                  >
                    Pass
                  </button>
                </div>
                {previewValidation && !previewValidation.ok ? (
                  <p className="danger-note">Preview blocked: {previewValidation.code}</p>
                ) : null}
                {!isLocalTurn ? (
                  <p className="muted-copy">You can preview placements now, but only the active player can commit.</p>
                ) : null}
              </div>

              <div className="hud-panel">
                <h2>Scoreboard</h2>
                <div className="score-list">
                  {snapshot.scores.map((score) => (
                    <div key={score.playerId} className="score-row">
                      <span>{score.name}</span>
                      <small>
                        {score.score} pts · {score.remainingCells} cells left
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        ) : null}

        {snapshot && isGameFinished && isJoined ? (
          <section className="lobby-grid">
            <div className="card-panel">
              <p className="eyebrow">Final result</p>
              <h2>{winnerNames}</h2>
              <p className="muted-copy">
                The match has finished. Share the room again if you want to review the board state or
                start a fresh game from the home screen.
              </p>
              <input className="room-link" readOnly value={shareUrl} />
            </div>
            <aside className="hud-panel">
              <h2>Final scores</h2>
              <div className="score-list">
                {snapshot.scores.map((score) => (
                  <div key={score.playerId} className="score-row">
                    <span>{score.name}</span>
                    <small>
                      {score.score} pts · {score.remainingCells} cells left
                    </small>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        ) : null}
      </section>
    </main>
  );
}
