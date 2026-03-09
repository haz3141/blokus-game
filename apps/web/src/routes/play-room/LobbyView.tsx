import type { RoomSnapshot } from "@cornerfall/protocol"

import { CopyIcon, PlayIcon } from "lucide-react"

import { Panel, SidePanel } from "@/components/app-shell"
import { PlayerBadge, RoomStatus } from "@/components/game-ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { ConnectionState } from "@/hooks/useRoomConnection"

import { getColorVariable } from "@/components/game-ui/color-utils"

interface LobbyViewProps {
  connectionState: ConnectionState
  currentPlayerName: string
  isHost: boolean
  localPlayerId: string | null
  onCopyLink: () => void
  onSelectSeat: (seatIndex: number) => void
  onStartGame: () => void
  roomId: string
  shareUrl: string
  snapshot: RoomSnapshot
}

export function LobbyView({
  connectionState,
  currentPlayerName,
  isHost,
  localPlayerId,
  onCopyLink,
  onSelectSeat,
  onStartGame,
  roomId,
  shareUrl,
  snapshot,
}: LobbyViewProps) {
  const canStart = snapshot.players.length === snapshot.config.playerCount

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.92fr)]">
      <Panel
        actions={
          <Button onClick={onCopyLink} variant="outline">
            <CopyIcon className="size-4" />
            Copy link
          </Button>
        }
        description={`Fill all ${snapshot.config.playerCount} seats, then the host can start the match.`}
        heading="Lobby"
      >
        <RoomStatus
          connectionState={connectionState}
          currentPlayerName={currentPlayerName}
          isHost={isHost}
          playerCount={snapshot.config.playerCount}
          playersJoined={snapshot.players.length}
          roomId={roomId}
          status={snapshot.status}
        />

        <div className="grid gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-strong)] p-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-info)]">
              Invite
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Share the room URL. The installed shell stays available offline, but live sync resumes
              only when connectivity returns.
            </p>
          </div>
          <Input data-testid="invite-link" readOnly value={shareUrl} />
        </div>

        <div className="grid gap-3">
          {snapshot.players.map((player) => (
            <PlayerBadge
              key={player.playerId}
              colorKey={player.colorKey}
              connected={player.connected}
              detail={`Seat ${player.seatIndex + 1}`}
              isHost={snapshot.hostPlayerId === player.playerId}
              isLocal={player.playerId === localPlayerId}
              name={player.name}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {isHost ? (
            <Button data-testid="start-game" disabled={!canStart} onClick={onStartGame} size="lg">
              <PlayIcon className="size-4" />
              Start game
            </Button>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">
              Only the host can start the match once every seat is filled.
            </p>
          )}
        </div>
      </Panel>

      <SidePanel
        description="Seat selection stays explicit so the roster and ownership state are easy to scan on desktop."
        heading="Seats"
        tone="muted"
      >
        <div className="grid gap-3">
          {snapshot.seats.map((seat) => {
            const isLocalSeat = seat.playerId === localPlayerId

            return (
              <button
                key={seat.seatIndex}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-left transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
                  isLocalSeat
                    ? "shadow-[0_12px_24px_rgba(226,171,88,0.16)]"
                    : "bg-[var(--color-bg-panel-strong)]"
                )}
                data-active={isLocalSeat}
                onClick={() => onSelectSeat(seat.seatIndex)}
                style={{
                  borderColor: isLocalSeat
                    ? "rgba(226, 171, 88, 0.34)"
                    : "var(--color-border-subtle)",
                  backgroundColor: isLocalSeat ? "rgba(226, 171, 88, 0.1)" : "var(--color-bg-panel-strong)",
                }}
                type="button"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 size-3 rounded-full border border-black/10"
                    style={{ backgroundColor: getColorVariable(seat.colorKey) }}
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[var(--color-text)]">
                      Seat {seat.seatIndex + 1}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">{seat.name ?? "Open"}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                  {seat.connected ? "ready" : seat.playerId ? "away" : "open"}
                </div>
              </button>
            )
          })}
        </div>
      </SidePanel>
    </section>
  )
}
