import type { ReactNode } from "react"

import type { RoomSnapshot } from "@cornerfall/protocol"

import { ArrowUpRightIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { StatusBadge, type StatusTone } from "./StatusBadge"

interface TurnIndicatorProps {
  callout?: ReactNode
  canConfirm?: boolean
  className?: string
  currentPlayer?: RoomSnapshot["players"][number] | null
  currentPlayerName?: string
  currentPlayerTestId?: string
  isLocalTurn?: boolean
  localPlayerName?: string | null
  remainingPieces?: number
  statusLabel?: ReactNode
  statusTone?: StatusTone
}

export function TurnIndicator({
  callout,
  canConfirm,
  className,
  currentPlayer,
  currentPlayerName,
  currentPlayerTestId,
  isLocalTurn,
  localPlayerName,
  remainingPieces,
  statusLabel,
  statusTone = "neutral",
}: TurnIndicatorProps) {
  const resolvedCurrentPlayerName = currentPlayer?.name ?? currentPlayerName ?? "Waiting"
  const readinessLabel = !isLocalTurn
    ? "Preview placements while you wait for the active player."
    : canConfirm
      ? "A legal move is ready to commit."
      : "Select a piece and place it on the board."
  const remainingLabel =
    typeof remainingPieces === "number"
      ? remainingPieces === 0
        ? "No pieces left"
        : `${remainingPieces} in reserve`
      : "Waiting for reserve"

  return (
    <div
      className={cn(
        "grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-strong)] px-4 py-4",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-info)]">
            Current turn
          </p>
          <h2
            className="font-serif text-3xl leading-none tracking-[-0.03em] text-[var(--color-text)]"
            data-testid={currentPlayerTestId}
          >
            {resolvedCurrentPlayerName}
          </h2>
          {localPlayerName ? (
            <p className="text-sm text-[var(--color-text-muted)]">Signed in as {localPlayerName}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusLabel ? <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge> : null}
          <StatusBadge tone={isLocalTurn ? "success" : "neutral"}>
            {isLocalTurn ? "your move" : "waiting"}
          </StatusBadge>
        </div>
      </div>

      <Separator className="bg-white/8" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-3 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            Readiness
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
            <ArrowUpRightIcon className="size-4 text-[var(--color-accent)]" />
            {readinessLabel}
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-3 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            Pieces left
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--color-text)]">{remainingPieces ?? "?"}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            {remainingLabel}
          </div>
        </div>
      </div>

      {callout ? <div className="text-sm text-[var(--color-text-muted)]">{callout}</div> : null}
    </div>
  )
}
