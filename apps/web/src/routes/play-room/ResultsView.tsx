import type { RoomSnapshot } from "@cornerfall/protocol"

import { CopyIcon, HouseIcon, RotateCcwIcon } from "lucide-react"

import { Panel } from "@/components/app-shell"
import { ResultsPanel } from "@/components/game-ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ResultsViewProps {
  onCopyLink: () => void
  shareUrl: string
  snapshot: RoomSnapshot
  winnerNames: string
}

export function ResultsView({
  onCopyLink,
  shareUrl,
  snapshot,
  winnerNames,
}: ResultsViewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.92fr)]">
      <ResultsPanel
        actions={
          <>
            <Button asChild size="lg">
              <a href="/">
                <RotateCcwIcon className="size-4" />
                New room
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/">
                <HouseIcon className="size-4" />
                Back home
              </a>
            </Button>
          </>
        }
        description="Share the room again if you want to review the final board or host a fresh match from the landing flow."
        scores={snapshot.scores}
        winnerLabel={winnerNames}
      />

      <Panel
        actions={
          <Button onClick={onCopyLink} variant="outline">
            <CopyIcon className="size-4" />
            Copy link
          </Button>
        }
        description="The room remains useful for post-match review and reconnect validation."
        heading="Share and review"
        tone="muted"
      >
        <Input readOnly value={shareUrl} />
        <div className="grid gap-2 text-sm text-[var(--color-text-muted)]">
          <p>The winner and score summary stay visible without hiding the share affordance.</p>
          <p>The home flow remains the path for starting a new match so gameplay authority does not change.</p>
        </div>
      </Panel>
    </section>
  )
}
