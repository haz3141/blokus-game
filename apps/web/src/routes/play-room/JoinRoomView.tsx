import type { ConnectionState } from "@/hooks/useRoomConnection"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel } from "@/components/app-shell"
import { StatusBadge } from "@/components/game-ui"

interface JoinRoomViewProps {
  connectionState: ConnectionState
  errorMessage: string | null
  onJoin: () => void
  roomNameDraft: string
  setRoomNameDraft: (name: string) => void
}

export function JoinRoomView({
  connectionState,
  errorMessage,
  onJoin,
  roomNameDraft,
  setRoomNameDraft,
}: JoinRoomViewProps) {
  return (
    <Panel
      actions={<StatusBadge tone={connectionState === "connected" ? "success" : "neutral"}>{connectionState}</StatusBadge>}
      description="Choose a display name before taking a seat. Returning players will reconnect automatically when possible."
      heading="Join room"
      tone="strong"
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onJoin()
        }}
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[var(--color-text-soft)]">Display name</span>
          <Input
            data-testid="player-name"
            placeholder="Your display name"
            value={roomNameDraft}
            onChange={(event) => setRoomNameDraft(event.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button data-testid="join-room" size="lg" type="submit">
            Join room
          </Button>
        </div>
        {errorMessage ? <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p> : null}
      </form>
    </Panel>
  )
}
