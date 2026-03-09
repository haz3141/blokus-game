import type { ReactNode } from "react"

import { Panel } from "@/components/app-shell/Panel"
import { cn } from "@/lib/utils"

interface LobbyCardProps {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function LobbyCard({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: LobbyCardProps) {
  return (
    <Panel className={cn("grid gap-5", className)} tone="default">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <div className="grid gap-2">
            <h2 className="font-serif text-3xl leading-none tracking-[-0.03em]">{title}</h2>
            {description ? <p className="text-sm text-[var(--color-text-muted)]">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </Panel>
  )
}
