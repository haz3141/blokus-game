import type { CSSProperties } from "react"

import type { ColorKey } from "@cornerfall/protocol"

const colorVariableMap: Record<ColorKey, string> = {
  amber: "var(--player-1)",
  azure: "var(--player-2)",
  emerald: "var(--player-3)",
  rose: "var(--player-4)",
}

const textVariableMap: Record<ColorKey, string> = {
  amber: "var(--player-1-contrast)",
  azure: "var(--player-2-contrast)",
  emerald: "var(--player-3-contrast)",
  rose: "var(--player-4-contrast)",
}

export function getColorVariable(colorKey: ColorKey) {
  return colorVariableMap[colorKey]
}

export function getColorBadgeStyle(colorKey: ColorKey): CSSProperties {
  return {
    backgroundColor: colorVariableMap[colorKey],
    color: textVariableMap[colorKey],
  }
}

export function getColorTintStyle(colorKey: ColorKey): CSSProperties {
  return {
    borderColor: `color-mix(in srgb, ${colorVariableMap[colorKey]} 26%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${colorVariableMap[colorKey]} 14%, var(--color-bg-panel-strong))`,
  }
}
