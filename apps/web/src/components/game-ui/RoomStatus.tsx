import type { RoomSnapshot } from "@cornerfall/protocol"

import type { ConnectionState } from "@/hooks/useRoomConnection"

import { cn } from "@/lib/utils"

import { StatusBadge } from "./StatusBadge"

function connectionTone(connectionState: ConnectionState) {
  switch (connectionState) {
    case "connected":
      return "success"
    case "reconnecting":
      return "warning"
    case "closed":
      return "warning"
    case "error":
      return "danger"
    default:
      return "neutral"
  }
}

type RoomStatusSnapshot = Pick<
  RoomSnapshot,
  "config" | "currentPlayerId" | "hostPlayerId" | "players" | "roomId" | "status"
>

interface RoomStatusBaseProps {
  className?: string
  connectionState: ConnectionState
  connectionTestId?: string
}

type RoomStatusProps =
  | (RoomStatusBaseProps & {
      snapshot: RoomStatusSnapshot
      currentPlayerName?: string
      isHost?: never
      playerCount?: never
      playersJoined?: never
      roomId?: never
      status?: never
    })
  | (RoomStatusBaseProps & {
      snapshot?: never
      currentPlayerName?: string
      isHost?: boolean
      playerCount: number
      playersJoined: number
      roomId: string
      status: "active" | "finished" | "lobby"
    })

function getStatusTone(status: "active" | "finished" | "lobby") {
  switch (status) {
    case "active":
      return "info"
    case "finished":
      return "success"
    default:
      return "neutral"
  }
}

function resolveRoomStatus(props: RoomStatusProps) {
  if ("snapshot" in props && props.snapshot) {
    return {
      currentPlayerName:
        props.currentPlayerName ??
        props.snapshot.players.find((player) => player.playerId === props.snapshot.currentPlayerId)?.name,
      isHost: Boolean(
        props.snapshot.hostPlayerId &&
          props.snapshot.players.some((player) => player.playerId === props.snapshot.hostPlayerId)
      ),
      playerCount: props.snapshot.config.playerCount,
      playersJoined: props.snapshot.players.length,
      roomId: props.snapshot.roomId,
      status: props.snapshot.status,
    }
  }

  return {
    currentPlayerName: props.currentPlayerName,
    isHost: props.isHost,
    playerCount: props.playerCount,
    playersJoined: props.playersJoined,
    roomId: props.roomId,
    status: props.status,
  }
}

export function RoomStatus(props: RoomStatusProps) {
  const { className, connectionState, connectionTestId } = props
  const {
    currentPlayerName,
    isHost,
    playerCount,
    playersJoined,
    roomId,
    status,
  } = resolveRoomStatus(props)
  const showConnectionBanner = Boolean(connectionTestId && connectionState !== "connected")

  return (
    <div
      className={cn(
        "grid gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-strong)] px-4 py-4",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-info)]">
            Room
          </p>
          <div className="font-serif text-2xl leading-none tracking-[-0.03em] text-[var(--color-text)]">
            {roomId}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={connectionTone(connectionState)}>
            <span {...(showConnectionBanner ? { "data-testid": connectionTestId } : {})}>
              {connectionState}
            </span>
          </StatusBadge>
          <StatusBadge tone={getStatusTone(status)}>{status}</StatusBadge>
          {isHost ? <StatusBadge size="sm" tone="info">host</StatusBadge> : null}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-3 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            Seats
          </div>
          <div className="mt-2 text-sm text-[var(--color-text)]">
            {playersJoined} of {playerCount} filled
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-3 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            Current player
          </div>
          <div className="mt-2 text-sm text-[var(--color-text)]">{currentPlayerName ?? "Waiting for players"}</div>
        </div>
      </div>
    </div>
  )
}
