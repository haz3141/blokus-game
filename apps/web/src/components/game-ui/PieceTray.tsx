import type { CSSProperties, ReactNode } from "react"

import { PIECES, type PieceId } from "@cornerfall/game-core"

import { cn } from "@/lib/utils"

interface PieceTrayProps {
  actions?: ReactNode
  className?: string
  description?: ReactNode
  disabled?: boolean
  emptyMessage?: ReactNode
  heading?: ReactNode
  onSelect?: (pieceId: PieceId) => void
  pieces: readonly PieceId[]
  selectedPieceId: PieceId | null
}

function formatPieceLabel(pieceId: PieceId) {
  return pieceId.replace(/^pentomino-/, "").replace(/^tetromino-/, "").replace(/^tromino-/, "")
}

function PieceGlyph({
  pieceId,
  selected,
}: {
  pieceId: PieceId
  selected: boolean
}) {
  const cells = PIECES[pieceId].baseCells
  const width = Math.max(...cells.map((cell) => cell.x)) + 1
  const height = Math.max(...cells.map((cell) => cell.y)) + 1
  const glyphStyle = {
    gridTemplateColumns: `repeat(${width}, minmax(0, 0.75rem))`,
    gridTemplateRows: `repeat(${height}, minmax(0, 0.75rem))`,
  } satisfies CSSProperties

  return (
    <div className="inline-grid gap-1" style={glyphStyle}>
      {Array.from({ length: width * height }, (_, index) => {
        const x = index % width
        const y = Math.floor(index / width)
        const filled = cells.some((cell) => cell.x === x && cell.y === y)

        return (
          <span
            key={`${pieceId}-${x}-${y}`}
            className={cn(
              "size-3 rounded-[0.3rem] border border-transparent",
              filled && selected && "bg-[var(--color-text-inverse)]",
              filled && !selected && "bg-[var(--color-accent)]",
              !filled && "bg-transparent"
            )}
          />
        )
      })}
    </div>
  )
}

export function PieceTray({
  actions,
  className,
  description,
  disabled = false,
  emptyMessage = "All pieces have been committed for this match.",
  heading = "Reserve",
  onSelect,
  pieces,
  selectedPieceId,
}: PieceTrayProps) {
  return (
    <div className={cn("grid gap-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-info)]">
            Piece tray
          </p>
          <h2 className="font-serif text-2xl leading-none tracking-[-0.03em] text-[var(--color-text)]">
            {heading}
          </h2>
          {description ? (
            <div className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="text-sm text-[var(--color-text-muted)]">{pieces.length} remaining</div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
      {pieces.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-muted)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pieces.map((pieceId) => {
            const selected = selectedPieceId === pieceId

            return (
              <button
                key={pieceId}
                className={cn(
                  "grid gap-3 rounded-[var(--radius-xl)] border px-4 py-4 text-left transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:pointer-events-none disabled:opacity-50",
                  selected
                    ? "shadow-[0_14px_30px_rgba(216,153,68,0.22)]"
                    : "bg-[var(--color-bg-panel-muted)] hover:-translate-y-px hover:border-white/15"
                )}
                aria-label={`${formatPieceLabel(pieceId)}, ${PIECES[pieceId].cellCount} cells`}
                aria-pressed={selected}
                data-piece-id={pieceId}
                data-selected={selected}
                data-testid={`piece-tile-${pieceId}`}
                disabled={disabled}
                onClick={() => onSelect?.(pieceId)}
                style={
                  selected
                    ? {
                        background: "var(--gradient-accent)",
                        borderColor: "transparent",
                        color: "var(--color-text-inverse)",
                      }
                    : {
                        borderColor: "var(--color-border-subtle)",
                      }
                }
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">{formatPieceLabel(pieceId)}</div>
                    <div
                      className={cn(
                        "text-xs uppercase tracking-[0.16em]",
                        selected ? "text-[rgba(17,24,39,0.72)]" : "text-[var(--color-text-muted)]"
                      )}
                    >
                      {PIECES[pieceId].cellCount} cells
                    </div>
                  </div>
                  <PieceGlyph pieceId={pieceId} selected={selected} />
                </div>
                <div
                  className={cn(
                    "text-xs",
                    selected ? "text-[rgba(17,24,39,0.72)]" : "text-[var(--color-text-soft)]"
                  )}
                >
                  {pieceId}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
