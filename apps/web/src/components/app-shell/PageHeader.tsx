import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  actions?: ReactNode
  actionsClassName?: string
  contentClassName?: string
  description?: ReactNode
  eyebrow?: ReactNode
  meta?: ReactNode
  title: ReactNode
}

export function PageHeader({
  actions,
  actionsClassName,
  className,
  contentClassName,
  description,
  eyebrow,
  meta,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-2xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel)] px-5 py-4 shadow-[var(--shadow-1)] md:flex-row md:items-start md:justify-between",
        className
      )}
      {...props}
    >
      <div className={cn("min-w-0 space-y-2", contentClassName)}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-info)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-serif text-3xl leading-none tracking-[-0.03em] text-[var(--color-text)] md:text-4xl">
          {title}
        </h1>
        {description ? (
          <div className="max-w-3xl text-sm text-[var(--color-text-muted)] md:text-base">
            {description}
          </div>
        ) : null}
        {meta ? <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-soft)]">{meta}</div> : null}
      </div>
      {actions ? (
        <div className={cn("flex flex-wrap items-center gap-3", actionsClassName)}>{actions}</div>
      ) : null}
    </header>
  )
}
