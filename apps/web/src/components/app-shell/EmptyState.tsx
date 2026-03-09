import type { ReactNode } from "react"

import { InboxIcon } from "lucide-react"

import { StateFrame } from "./StateFrame"

interface EmptyStateProps {
  actions?: ReactNode
  className?: string
  description: ReactNode
  icon?: ReactNode
  title: ReactNode
}

export function EmptyState({
  actions,
  className,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <StateFrame
      actions={actions}
      className={className}
      description={description}
      icon={icon ?? <InboxIcon className="size-6" />}
      iconClassName="size-14"
      title={title}
    />
  )
}
