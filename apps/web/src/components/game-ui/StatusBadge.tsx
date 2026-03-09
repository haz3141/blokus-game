import type { ComponentProps, CSSProperties, ReactNode } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "danger" | "info" | "neutral" | "success" | "warning"

const toneStyles: Record<StatusTone, CSSProperties> = {
  neutral: {
    backgroundColor: "rgba(232, 220, 197, 0.08)",
    borderColor: "var(--color-border-subtle)",
    color: "var(--color-text-muted)",
  },
  info: {
    backgroundColor: "rgba(93, 179, 216, 0.14)",
    borderColor: "rgba(93, 179, 216, 0.24)",
    color: "var(--color-info)",
  },
  success: {
    backgroundColor: "rgba(115, 181, 148, 0.14)",
    borderColor: "rgba(115, 181, 148, 0.24)",
    color: "var(--color-success)",
  },
  warning: {
    backgroundColor: "rgba(221, 178, 95, 0.14)",
    borderColor: "rgba(221, 178, 95, 0.24)",
    color: "var(--color-warning)",
  },
  danger: {
    backgroundColor: "rgba(241, 156, 116, 0.14)",
    borderColor: "rgba(241, 156, 116, 0.24)",
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
