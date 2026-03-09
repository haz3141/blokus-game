import type { ComponentProps, ReactNode } from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const toneClasses = {
  default:
    "bg-[var(--color-bg-panel)] ring-[color:var(--color-border-subtle)] shadow-[var(--shadow-1)]",
  strong:
    "bg-[var(--color-bg-panel-strong)] ring-[color:var(--color-border-strong)] shadow-[var(--shadow-2)]",
  elevated:
    "bg-[var(--color-bg-panel-elevated)] ring-[color:var(--color-border-subtle)] shadow-[var(--shadow-floating)]",
  muted:
    "bg-[var(--color-bg-panel-muted)] ring-[color:var(--color-border-subtle)] shadow-[var(--shadow-1)]",
} as const

export interface PanelProps extends ComponentProps<"section"> {
  actions?: ReactNode
  children: ReactNode
  contentClassName?: string
  description?: ReactNode
  footer?: ReactNode
  footerClassName?: string
  headerClassName?: string
  heading?: ReactNode
  tone?: keyof typeof toneClasses
}

export function Panel({
  actions,
  children,
  className,
  contentClassName,
  description,
  footer,
  footerClassName,
  headerClassName,
  heading,
  tone = "default",
  ...props
}: PanelProps) {
  return (
    <Card
      className={cn(
        "rounded-[var(--radius-2xl)] border-0 py-0 text-[var(--color-text)] backdrop-blur-xl",
        toneClasses[tone],
        className
      )}
    >
      <section {...props}>
        {heading || description || actions ? (
          <CardHeader className={cn("px-5 pt-5", headerClassName)}>
            <div className="space-y-1">
              {heading ? (
                <CardTitle className="font-serif text-2xl leading-none tracking-[-0.03em] text-[var(--color-text)]">
                  {heading}
                </CardTitle>
              ) : null}
              {description ? (
                <CardDescription className="text-sm text-[var(--color-text-muted)]">
                  {description}
                </CardDescription>
              ) : null}
            </div>
            {actions ? <CardAction>{actions}</CardAction> : null}
          </CardHeader>
        ) : null}
        <CardContent
          className={cn(
            "grid gap-4 px-5 pb-5",
            !(heading || description || actions) && "pt-5",
            contentClassName
          )}
        >
          {children}
        </CardContent>
        {footer ? (
          <div
            className={cn(
              "border-t border-[var(--color-border-subtle)] px-5 py-4",
              footerClassName
            )}
          >
            {footer}
          </div>
        ) : null}
      </section>
    </Card>
  )
}
