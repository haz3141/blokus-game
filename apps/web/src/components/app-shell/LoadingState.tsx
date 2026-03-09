import type { ReactNode } from "react"

import { LoaderCircleIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { StateFrame } from "./StateFrame"

interface LoadingStateProps {
  className?: string
  description?: ReactNode
  skeletonCount?: number
  title?: ReactNode
}

export function LoadingState({
  className,
  description = "Fetching the latest room state.",
  skeletonCount = 2,
  title = "Loading",
}: LoadingStateProps) {
  return (
    <StateFrame
      className={className}
      description={description}
      icon={<LoaderCircleIcon className="size-5 animate-spin" />}
      title={title}
    >
      <div className="grid gap-3">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton
            key={`loading-skeleton-${index}`}
            className={cn(
              "rounded-[var(--radius-lg)] bg-white/8",
              index === 0 ? "h-10" : "h-28 bg-white/6"
            )}
          />
        ))}
      </div>
    </StateFrame>
  )
}
