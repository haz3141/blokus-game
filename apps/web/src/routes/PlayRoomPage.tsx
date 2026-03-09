import {
  getStartCorner,
  getPlacedCells,
  type GameState,
  type Placement,
  type PlayerState,
  type TransformKey,
  validateMove,
} from "@cornerfall/game-core"
import { lazy, Suspense, useEffect, useRef } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "sonner"

import { AppShell, ErrorState, LoadingState, PageHeader } from "@/components/app-shell"
import { RoomStatus, StatusBadge } from "@/components/game-ui"
import { useRoomConnection } from "@/hooks/useRoomConnection"
import { resolvePlacementFromTap } from "@/lib/game"
import { getSelectedTransform, useGameUiStore } from "@/store/useGameUiStore"

import { JoinRoomView, LobbyView, ResultsView } from "./play-room"

const GameView = lazy(async () => {
  const module = await import("./play-room/GameView.js")
  return { default: module.GameView }
})

function corePlayerIdForSeat(seatIndex: number): `P${number}` {
  return `P${seatIndex + 1}`
}

function findLocalPlayer(snapshot: ReturnType<typeof useRoomConnection>["snapshot"], playerId: string | null) {
  return snapshot?.players.find((player) => player.playerId === playerId) ?? null
}

function getCorePlayer(game: GameState, seatIndex: number): PlayerState | undefined {
  return game.players.find((player) => player.seatIndex === seatIndex)
}

function getHeaderCopy(status: "active" | "finished" | "lobby" | null) {
  switch (status) {
    case "active":
      return {
        title: "Live board",
        description:
          "The board remains primary while turn context, piece inventory, and action readiness stay visible beside it.",
      }
    case "finished":
      return {
        title: "Final board",
        description:
          "Review the outcome, share the room again, or head home for a fresh table without changing the authoritative room model.",
      }
    case "lobby":
      return {
        title: "Room lobby",
        description:
          "Seat assignment, invite actions, and host controls are grouped for faster desktop scanning while the join flow stays mobile-safe.",
      }
    default:
      return {
        title: "Connecting",
        description:
          "Rebuilding the latest room snapshot and reconnecting to the authoritative room service.",
      }
  }
}

function getConnectionTone(connectionState: ReturnType<typeof useRoomConnection>["connectionState"]) {
  switch (connectionState) {
    case "connected":
      return "success"
    case "reconnecting":
      return "warning"
    case "error":
      return "danger"
    default:
      return "neutral"
  }
}

export function PlayRoomPage() {
  const { roomId } = useParams()
  const location = useLocation()
  const {
    connectionState,
    snapshot,
    errorMessage,
    playerId,
    roomNameDraft,
    setRoomNameDraft,
    joinRoom,
    sendMessage,
  } = useRoomConnection(roomId ?? "")
  const selectedPieceId = useGameUiStore((state) => state.selectedPieceId)
  const previewOrigin = useGameUiStore((state) => state.previewOrigin)
  const rotationIndex = useGameUiStore((state) => state.rotationIndex)
  const flipped = useGameUiStore((state) => state.flipped)
  const cameraMode = useGameUiStore((state) => state.cameraMode)
  const setSelectedPieceId = useGameUiStore((state) => state.setSelectedPieceId)
  const setPreviewOrigin = useGameUiStore((state) => state.setPreviewOrigin)
  const rotateClockwise = useGameUiStore((state) => state.rotateClockwise)
  const rotateCounterClockwise = useGameUiStore((state) => state.rotateCounterClockwise)
  const toggleFlip = useGameUiStore((state) => state.toggleFlip)
  const resetPlacement = useGameUiStore((state) => state.resetPlacement)
  const setCameraMode = useGameUiStore((state) => state.setCameraMode)
  const autoJoinAttemptedRef = useRef(false)

  const localPlayer = findLocalPlayer(snapshot, playerId)
  const game = (snapshot?.game as GameState | null) ?? null
  const localCorePlayer = game && localPlayer ? getCorePlayer(game, localPlayer.seatIndex) : undefined
  const autoJoinName =
    typeof location.state === "object" &&
    location.state &&
    "autoJoinName" in location.state &&
    typeof location.state.autoJoinName === "string"
      ? location.state.autoJoinName
      : null
  const transform = getSelectedTransform(flipped, rotationIndex)
  const previewCell = previewOrigin
  const activePlacement: Placement | null =
    selectedPieceId && previewCell
      ? game && localPlayer
        ? resolvePlacementFromTap({
            game,
            playerId: corePlayerIdForSeat(localPlayer.seatIndex),
            pieceId: selectedPieceId as Placement["pieceId"],
            transform: transform as TransformKey,
            tappedCell: previewCell,
          })
        : {
            pieceId: selectedPieceId as Placement["pieceId"],
            origin: previewCell,
            transform: transform as TransformKey,
          }
      : null
  const previewValidation =
    game && localPlayer && activePlacement
      ? validateMove(game, corePlayerIdForSeat(localPlayer.seatIndex), {
          type: "place",
          placement: activePlacement,
        })
      : null
  const previewCells =
    activePlacement && previewValidation?.ok && previewValidation.cells
      ? previewValidation.cells
      : activePlacement
        ? getPlacedCells(activePlacement)
        : []

  useEffect(() => {
    resetPlacement()
  }, [snapshot?.revision, resetPlacement])

  useEffect(() => {
    if (!autoJoinName || autoJoinAttemptedRef.current || connectionState !== "connected" || localPlayer) {
      return
    }

    autoJoinAttemptedRef.current = true
    setRoomNameDraft(autoJoinName)
    joinRoom(autoJoinName)
  }, [autoJoinName, connectionState, joinRoom, localPlayer, setRoomNameDraft])

  if (!roomId) {
    return (
      <AppShell centered width="content">
        <ErrorState
          actions={
            <a
              className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--gradient-accent)] px-4 font-medium text-[var(--color-text-inverse)]"
              href="/"
            >
              Back home
            </a>
          }
          description="The room identifier is missing from the URL."
          title="Room not found"
        />
      </AppShell>
    )
  }

  const shareUrl = typeof window === "undefined" ? "" : window.location.href
  const isHost = snapshot?.hostPlayerId === localPlayer?.playerId
  const isJoined = Boolean(localPlayer)
  const isLocalTurn = snapshot?.currentPlayerId === localPlayer?.playerId
  const isGameActive = snapshot?.status === "active" && Boolean(game)
  const isGameFinished = snapshot?.status === "finished"
  const currentTurnName =
    snapshot?.players.find((player) => player.playerId === snapshot.currentPlayerId)?.name ?? "Waiting"
  const startCorner =
    game && localPlayer && localCorePlayer && !localCorePlayer.hasPlayed
      ? getStartCorner(game, localPlayer.seatIndex)
      : null
  const winnerNames = snapshot?.winnerIds.length
    ? snapshot.winnerIds
        .map((winnerId) => snapshot.players.find((player) => player.playerId === winnerId)?.name ?? winnerId)
        .join(", ")
    : "No winner"
  const canConfirm = Boolean(
    isLocalTurn && connectionState === "connected" && activePlacement && previewValidation?.ok
  )
  const headerCopy = getHeaderCopy(snapshot?.status ?? null)

  const copyShareUrl = () => {
    if (!shareUrl || typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Clipboard access is not available in this browser.")
      return
    }

    void navigator.clipboard.writeText(shareUrl).then(
      () => toast.success("Room link copied."),
      () => toast.error("Unable to copy the room link.")
    )
  }

  return (
    <AppShell>
      <PageHeader
        actions={
          snapshot ? (
            <div className="w-full max-w-md">
              <RoomStatus
                connectionState={connectionState}
                connectionTestId="reconnect-banner"
                currentPlayerName={currentTurnName}
                isHost={isHost}
                playerCount={snapshot.config.playerCount}
                playersJoined={snapshot.players.length}
                roomId={roomId}
                status={snapshot.status}
              />
            </div>
          ) : (
            <StatusBadge data-testid="reconnect-banner" tone={getConnectionTone(connectionState)}>
              {connectionState}
            </StatusBadge>
          )
        }
        description={headerCopy.description}
        eyebrow={`Room ${roomId}`}
        title={headerCopy.title}
      />

      {!isJoined ? (
        <JoinRoomView
          connectionState={connectionState}
          errorMessage={errorMessage}
          onJoin={() => joinRoom()}
          roomNameDraft={roomNameDraft}
          setRoomNameDraft={setRoomNameDraft}
        />
      ) : null}

      {isJoined && errorMessage ? (
        <ErrorState
          className="max-w-[var(--container-xl)]"
          description={errorMessage}
          title="Room update"
        />
      ) : null}

      {!snapshot && isJoined ? (
        <LoadingState
          description={
            connectionState === "reconnecting"
              ? "Trying to recover the latest room snapshot after the connection dropped."
              : "Fetching the latest room snapshot."
          }
          title="Connecting"
        />
      ) : null}

      {snapshot && !isGameActive && snapshot.status === "lobby" && isJoined ? (
        <LobbyView
          connectionState={connectionState}
          currentPlayerName={currentTurnName}
          isHost={isHost}
          localPlayerId={localPlayer?.playerId ?? null}
          onCopyLink={copyShareUrl}
          onSelectSeat={(seatIndex) =>
            sendMessage({
              type: "select_seat",
              roomId,
              seatIndex,
            })
          }
          onStartGame={() => sendMessage({ type: "start_game", roomId })}
          roomId={roomId}
          shareUrl={shareUrl}
          snapshot={snapshot}
        />
      ) : null}

      {game && isGameActive && snapshot ? (
        <Suspense
          fallback={
            <LoadingState
              description="Preparing the board scene and command rail for the active match."
              title="Loading live board"
            />
          }
        >
          <GameView
            cameraMode={cameraMode}
            canConfirm={canConfirm}
            connectionState={connectionState}
            currentTurnName={currentTurnName}
            game={game}
            isHost={isHost}
            isLocalTurn={isLocalTurn}
            localCorePlayer={localCorePlayer}
            localPlayer={localPlayer}
            onCellSelect={setPreviewOrigin}
            onConfirmMove={() => {
              if (!activePlacement) {
                return
              }

              sendMessage({
                type: "submit_action",
                roomId,
                action: {
                  type: "place",
                  pieceId: activePlacement.pieceId,
                  origin: activePlacement.origin,
                  transform: activePlacement.transform,
                },
              })
            }}
            onPass={() =>
              sendMessage({
                type: "submit_action",
                roomId,
                action: { type: "pass" },
              })
            }
            onResetPlacement={resetPlacement}
            onRotateClockwise={rotateClockwise}
            onRotateCounterClockwise={rotateCounterClockwise}
            onSelectPiece={(pieceId) => setSelectedPieceId(pieceId)}
            onSetCameraMode={setCameraMode}
            onToggleFlip={toggleFlip}
            previewCells={previewCells}
            previewValidation={previewValidation}
            selectedPieceId={selectedPieceId as PlayerState["remainingPieceIds"][number] | null}
            snapshot={snapshot}
            startCorner={startCorner}
          />
        </Suspense>
      ) : null}

      {snapshot && isGameFinished && isJoined ? (
        <ResultsView
          onCopyLink={copyShareUrl}
          shareUrl={shareUrl}
          snapshot={snapshot}
          winnerNames={winnerNames}
        />
      ) : null}
    </AppShell>
  )
}
