import type { ReactNode } from "react"

import { TriangleAlertIcon } from "lucide-react"

import { StateFrame } from "./StateFrame"

interface ErrorStateProps {
  actions?: ReactNode
  className?: string
  description: ReactNode
  title?: ReactNode
}

export function ErrorState({
  actions,
  className,
  description,
  title = "Something went wrong",
}: ErrorStateProps) {
  return (
    <StateFrame
      actions={actions}
      className={className}
      description={description}
      icon={<TriangleAlertIcon className="size-5" />}
      iconClassName="border-[rgba(241,156,116,0.24)] bg-[rgba(241,156,116,0.12)] text-[var(--color-danger)]"
      title={title}
      tone="strong"
    />
  )
}
