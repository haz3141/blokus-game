import type { ComponentProps, CSSProperties, ReactNode } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "danger" | "info" | "neutral" | "success" | "warning"

const toneStyles: Record<StatusTone, CSSProperties> = {
  neutral: {
    backgroundColor: "color-mix(in srgb, var(--color-text-muted) 12%, transparent)",
    borderColor: "var(--color-border-subtle)",
    color: "var(--color-text-muted)",
  },
  info: {
    backgroundColor: "color-mix(in srgb, var(--color-info) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-info) 24%, var(--color-border-subtle))",
    color: "var(--color-info)",
  },
  success: {
    backgroundColor: "color-mix(in srgb, var(--color-success) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-success) 24%, var(--color-border-subtle))",
    color: "var(--color-success)",
  },
  warning: {
    backgroundColor: "color-mix(in srgb, var(--color-warning) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-warning) 24%, var(--color-border-subtle))",
    color: "var(--color-warning)",
  },
  danger: {
    backgroundColor: "color-mix(in srgb, var(--color-danger) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--color-danger) 24%, var(--color-border-subtle))",
    color: "var(--color-danger)",
  },
}

const badgeVariants = cva(
  "h-auto rounded-full border font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      size: {
        default: "px-2.5 py-1 text-[0.7rem]",
        sm: "px-2 py-0.5 text-[0.65rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
  dot?: boolean
  icon?: ReactNode
  tone?: StatusTone
}

export function StatusBadge({
  children,
  className,
  dot = false,
  icon,
  size,
  tone = "neutral",
  ...props
}: StatusBadgeProps & Omit<ComponentProps<typeof Badge>, "children" | "className" | "style" | "variant">) {
  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5",
        badgeVariants({ size }),
        className
      )}
      style={toneStyles[tone]}
      variant="outline"
      {...props}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {dot ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </Badge>
  )
}
