import { useState } from "react"

import type { GameState, PlayerState, ValidationResult } from "@cornerfall/game-core"
import type { RoomSnapshot } from "@cornerfall/protocol"
import type { CameraMode } from "@/store/useGameUiStore"

import { ConfirmActionDialog, PieceTray, PlayerBadge, RoomStatus, StatusBadge, TurnIndicator } from "@/components/game-ui"
import { Panel, SidePanel } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GameScene } from "@/features/game-3d/GameScene"
import type { ConnectionState } from "@/hooks/useRoomConnection"
import { previewColors } from "@/lib/design/tokens"

interface GameViewProps {
  cameraMode: CameraMode
  canConfirm: boolean
  connectionState: ConnectionState
  currentTurnName: string
  game: GameState
  isHost: boolean
  isLocalTurn: boolean
  localCorePlayer: PlayerState | undefined
  localPlayer: RoomSnapshot["players"][number] | null
  onCellSelect: (origin: { x: number; y: number }) => void
  onConfirmMove: () => void
  onPass: () => void
  onResetPlacement: () => void
  onRotateClockwise: () => void
  onRotateCounterClockwise: () => void
  onSelectPiece: (pieceId: PlayerState["remainingPieceIds"][number]) => void
  onSetCameraMode: (mode: CameraMode) => void
  onToggleFlip: () => void
  previewCells: Array<{ x: number; y: number }>
  previewValidation: ValidationResult | null
  selectedPieceId: PlayerState["remainingPieceIds"][number] | null
  snapshot: RoomSnapshot
  startCorner: { x: number; y: number } | null
}

export function GameView({
  cameraMode,
  canConfirm,
  connectionState,
  currentTurnName,
  game,
  isHost,
  isLocalTurn,
  localCorePlayer,
  localPlayer,
  onCellSelect,
  onConfirmMove,
  onPass,
  onResetPlacement,
  onRotateClockwise,
  onRotateCounterClockwise,
  onSelectPiece,
  onSetCameraMode,
  onToggleFlip,
  previewCells,
  previewValidation,
  selectedPieceId,
  snapshot,
  startCorner,
}: GameViewProps) {
  const [isPassDialogOpen, setIsPassDialogOpen] = useState(false)
  const previewTint = previewValidation?.ok ? previewColors.valid : previewColors.invalid

  const statusTone =
    previewValidation && !previewValidation.ok
      ? "warning"
      : isLocalTurn
        ? "success"
        : "neutral"
  const statusLabel =
    previewValidation && !previewValidation.ok
      ? `Preview: ${previewValidation.code}`
      : snapshot.status
  const callout = startCorner
    ? `Opening move: tap your start corner at ${startCorner.x},${startCorner.y}. The preview snaps to any legal alignment for the selected transform.`
    : !isLocalTurn
      ? "You can preview placements now, but only the active player can commit the move."
      : "Use the tray, rotation controls, and board preview to line up your next placement."

  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(23rem,0.95fr)]">
        <Panel tone="strong">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-info)]">
                  Current player
                </p>
                <h2 className="font-serif text-3xl leading-none tracking-[-0.03em] text-[var(--color-text)]" data-testid="current-turn">
                  {currentTurnName}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={isLocalTurn ? "success" : "neutral"}>
                  {isLocalTurn ? "your move" : "waiting"}
                </StatusBadge>
                <StatusBadge tone="info">{snapshot.status}</StatusBadge>
              </div>
            </div>
            <div className="board-shell">
              <GameScene
                boardCells={game.board.cells}
                cameraMode={cameraMode}
                onCellSelect={onCellSelect}
                previewCells={previewCells}
                previewTint={previewTint}
                previewValid={Boolean(previewValidation?.ok)}
                size={game.board.size}
              />
            </div>
          </div>
        </Panel>

        <div className="grid gap-4">
          <SidePanel heading="Command desk" tone="muted">
            <RoomStatus
              connectionState={connectionState}
              currentPlayerName={currentTurnName}
              isHost={isHost}
              playerCount={snapshot.config.playerCount}
              playersJoined={snapshot.players.length}
              roomId={snapshot.roomId}
              status={snapshot.status}
            />

            <TurnIndicator
              callout={callout}
              canConfirm={canConfirm}
              currentPlayerName={currentTurnName}
              isLocalTurn={isLocalTurn}
              localPlayerName={localPlayer?.name ?? null}
              remainingPieces={localCorePlayer?.remainingPieceIds.length ?? 0}
              statusLabel={statusLabel}
              statusTone={statusTone}
            />

            <div className="grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-strong)] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                    Camera
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Keep the board readable while adjusting your tactical view.
                  </p>
                </div>
                <ToggleGroup
                  aria-label="Camera mode"
                  className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] p-1"
                  type="single"
                  value={cameraMode}
                  variant="outline"
                  onValueChange={(value) => {
                    if (value === "angled" || value === "topDown") {
                      onSetCameraMode(value)
                    }
                  }}
                >
                  <ToggleGroupItem value="angled">Angled</ToggleGroupItem>
                  <ToggleGroupItem value="topDown">Top-down</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button disabled={!isLocalTurn} onClick={onRotateCounterClockwise} variant="outline">
                  Rotate left
                </Button>
                <Button disabled={!isLocalTurn} onClick={onRotateClockwise} variant="outline">
                  Rotate right
                </Button>
                <Button disabled={!isLocalTurn} onClick={onToggleFlip} variant="outline">
                  Flip
                </Button>
                <Button disabled={!isLocalTurn} onClick={onResetPlacement} variant="ghost">
                  Cancel
                </Button>
              </div>

            </div>
          </SidePanel>

          <Panel tone="muted">
            <PieceTray
              actions={
                <>
                  <Button data-testid="confirm-move" disabled={!canConfirm} onClick={onConfirmMove}>
                    Confirm move
                  </Button>
                  <Button disabled={!isLocalTurn} onClick={() => setIsPassDialogOpen(true)} variant="outline">
                    Pass turn
                  </Button>
                </>
              }
              disabled={!isLocalTurn}
              pieces={localCorePlayer?.remainingPieceIds ?? []}
              selectedPieceId={selectedPieceId}
              onSelect={onSelectPiece}
            />
          </Panel>

          <Panel description="Scores remain visible without pulling focus away from the board." heading="Scoreboard">
            <div className="grid gap-3">
              {snapshot.scores.map((score) => (
                <PlayerBadge
                  key={score.playerId}
                  colorKey={score.colorKey}
                  connected={Boolean(
                    snapshot.players.find((player) => player.playerId === score.playerId)?.connected
                  )}
                  detail={`${score.remainingCells} cells left`}
                  isHost={snapshot.hostPlayerId === score.playerId}
                  isLocal={score.playerId === localPlayer?.playerId}
                  name={score.name}
                  rightSlot={
                    <div className="text-right">
                      <div className="text-xl font-semibold text-[var(--color-text)]">{score.score}</div>
                      <div className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                        {score.hasPassed ? "passed" : "active"}
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <ConfirmActionDialog
        confirmLabel="Pass turn"
        description="Passing is final for this turn. Use it only if you cannot or do not want to place a legal piece."
        open={isPassDialogOpen}
        title="Pass this turn?"
        onConfirm={() => {
          setIsPassDialogOpen(false)
          onPass()
        }}
        onOpenChange={setIsPassDialogOpen}
      />
    </>
  )
}
