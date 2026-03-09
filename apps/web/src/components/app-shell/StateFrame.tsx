import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Panel, type PanelProps } from "./Panel"

interface StateFrameProps {
  actions?: ReactNode | undefined
  children?: ReactNode
  className?: string | undefined
  description?: ReactNode | undefined
  icon: ReactNode
  iconClassName?: string | undefined
  title: ReactNode
  tone?: PanelProps["tone"] | undefined
}

export function StateFrame({
  actions,
  children,
  className,
  description,
  icon,
  iconClassName,
  title,
  tone = "muted",
}: StateFrameProps) {
  return (
    <Panel className={className} contentClassName="gap-5" tone={tone}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="font-serif text-2xl leading-none tracking-[-0.03em] text-[var(--color-text)]">
            {title}
          </h2>
          {description ? (
            <div className="text-sm text-[var(--color-text-muted)]">{description}</div>
          ) : null}
        </div>
      </div>

      {children}

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </Panel>
  )
}
