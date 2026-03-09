import type { ReactNode } from "react"

import type { ColorKey, RoomSnapshot } from "@cornerfall/protocol"

import { cn } from "@/lib/utils"

import { getColorTintStyle, getColorVariable } from "./color-utils"
import { StatusBadge } from "./StatusBadge"

type PlayerBadgeEntity =
  | RoomSnapshot["players"][number]
  | RoomSnapshot["scores"][number]
  | RoomSnapshot["seats"][number]

interface PlayerBadgeBaseProps {
  className?: string
  connected?: boolean
  detail?: ReactNode
  isHost?: boolean
  isLocal?: boolean
  rightSlot?: ReactNode
}

type PlayerBadgeProps =
  | (PlayerBadgeBaseProps & {
      colorKey: ColorKey
      name: string
      player?: never
    })
  | (PlayerBadgeBaseProps & {
      colorKey?: never
      name?: never
      player: PlayerBadgeEntity
    })

function hasPlayer(
  props: PlayerBadgeProps
): props is PlayerBadgeBaseProps & { player: PlayerBadgeEntity } {
  return "player" in props
}

function hasConnectionState(
  player: PlayerBadgeEntity
): player is RoomSnapshot["players"][number] | RoomSnapshot["seats"][number] {
  return "connected" in player
}

export function PlayerBadge({
  className,
  connected,
  detail,
  isHost,
  isLocal,
  rightSlot,
  ...props
}: PlayerBadgeProps) {
  const player = hasPlayer(props) ? props.player : null
  let resolvedColorKey: ColorKey
  let resolvedName: string

  if (hasPlayer(props)) {
    resolvedColorKey = props.player.colorKey
    resolvedName = props.player.name ?? "Open seat"
  } else {
    const identity = props as PlayerBadgeBaseProps & { colorKey: ColorKey; name: string }
    resolvedColorKey = identity.colorKey
    resolvedName = identity.name
  }

  const resolvedConnected =
    connected ?? (player && hasConnectionState(player) ? player.connected : undefined)

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border px-4 py-3",
        className
      )}
      style={getColorTintStyle(resolvedColorKey)}
    >
      <div className="min-w-0 flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1 size-3 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: getColorVariable(resolvedColorKey) }}
        />
        <div className="min-w-0 space-y-1">
          <div className="truncate text-sm font-semibold text-[var(--color-text)]">{resolvedName}</div>
          {detail ? <div className="truncate text-xs text-[var(--color-text-muted)]">{detail}</div> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {typeof resolvedConnected === "boolean" ? (
          <StatusBadge dot size="sm" tone={resolvedConnected ? "success" : "warning"}>
            {resolvedConnected ? "online" : "away"}
          </StatusBadge>
        ) : null}
        {isHost ? <StatusBadge size="sm">host</StatusBadge> : null}
        {isLocal ? <StatusBadge size="sm" tone="info">you</StatusBadge> : null}
        {rightSlot}
      </div>
    </div>
  )
}
