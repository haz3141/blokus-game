import type { ReactNode } from "react"

import type { RoomSnapshot } from "@cornerfall/protocol"

import { TrophyIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { getColorTintStyle } from "./color-utils"
import { PlayerBadge } from "./PlayerBadge"

interface ResultsPanelProps {
  actions?: ReactNode
  className?: string
  description?: ReactNode
  helperText?: ReactNode
  scores?: readonly RoomSnapshot["scores"][number][]
  snapshot?: Pick<RoomSnapshot, "scores" | "winnerIds">
  winnerIds?: readonly RoomSnapshot["winnerIds"][number][]
  winnerLabel?: string
}

export function ResultsPanel({
  actions,
  className,
  description,
  helperText,
  scores,
  snapshot,
  winnerIds,
  winnerLabel,
}: ResultsPanelProps) {
  const resolvedScores = snapshot?.scores ?? scores ?? []
  const resolvedWinnerIds = new Set(snapshot?.winnerIds ?? winnerIds ?? [])
  const highestScore = Math.max(...resolvedScores.map((score) => score.score), Number.NEGATIVE_INFINITY)
  const derivedWinnerIds = new Set(
    resolvedScores
      .filter((score) => score.score === highestScore)
      .map((score) => score.playerId)
  )
  const winningIds = resolvedWinnerIds.size > 0 ? resolvedWinnerIds : derivedWinnerIds
  const derivedWinnerLabel = resolvedScores
    .filter((score) => winningIds.has(score.playerId))
    .map((score) => score.name)
    .join(", ")
  const resolvedWinnerLabel = winnerLabel ?? (derivedWinnerLabel || "No winner")

  return (
    <section
      className={cn(
        "grid gap-5 rounded-[var(--radius-2xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel)] px-5 py-5 shadow-[var(--shadow-2)]",
        className
      )}
    >
      <div className="grid gap-4 rounded-[var(--radius-xl)] border border-[rgba(226,171,88,0.24)] bg-[rgba(226,171,88,0.08)] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-text-inverse)]">
            <TrophyIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              Final result
            </p>
            <h2 className="font-serif text-3xl leading-none tracking-[-0.03em] text-[var(--color-text)]">
              {resolvedWinnerLabel}
            </h2>
          </div>
        </div>
        {description || helperText ? (
          <div className="text-sm text-[var(--color-text-muted)]">{description ?? helperText}</div>
        ) : null}
      </div>

      <div className="grid gap-3">
        {resolvedScores.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
            Final scores are not available yet.
          </div>
        ) : (
          resolvedScores.map((score) => (
            <div
              key={score.playerId}
              className="rounded-[var(--radius-xl)] border px-1 py-1"
              style={getColorTintStyle(score.colorKey)}
            >
              <PlayerBadge
                className="border-transparent bg-transparent px-3 py-3"
                detail={`${score.remainingCells} cells left`}
                isLocal={false}
                player={score}
                rightSlot={
                  <div className="text-right">
                    <div className="text-xl font-semibold text-[var(--color-text)]">{score.score}</div>
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      {winningIds.has(score.playerId) ? "winner" : score.hasPassed ? "passed" : "final"}
                    </div>
                  </div>
                }
              />
            </div>
          ))
        )}
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  )
}
