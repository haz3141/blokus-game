import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Panel, type PanelProps } from "./Panel"

interface SidePanelProps extends PanelProps {
  sticky?: boolean
  stickyOffsetClassName?: string
}

export function SidePanel({
  children,
  className,
  sticky = true,
  stickyOffsetClassName,
  ...props
}: SidePanelProps) {
  return (
    <Panel
      className={cn(
        sticky && "lg:sticky",
        sticky && (stickyOffsetClassName ?? "lg:top-4"),
        className
      )}
      {...props}
    >
      {children as ReactNode}
    </Panel>
  )
}
