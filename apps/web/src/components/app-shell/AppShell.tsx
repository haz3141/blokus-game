import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

const gapClasses = {
  compact: "gap-3",
  default: "gap-4",
  relaxed: "gap-6",
} as const

const widthClasses = {
  content: "max-w-[var(--container-lg)]",
  wide: "max-w-[var(--container-xl)]",
  game: "max-w-[var(--container-game)]",
  full: "max-w-none",
} as const

interface AppShellProps extends ComponentProps<"main"> {
  centered?: boolean
  children: ReactNode
  contentClassName?: string
  gap?: keyof typeof gapClasses
  width?: keyof typeof widthClasses
}

export function AppShell({
  centered = false,
  children,
  className,
  contentClassName,
  gap = "default",
  width = "game",
  ...props
}: AppShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen px-4 py-4 md:px-5 md:py-5",
        centered && "grid place-items-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto grid w-full",
          gapClasses[gap],
          widthClasses[width],
          contentClassName
        )}
      >
        {children}
      </div>
    </main>
  )
}
