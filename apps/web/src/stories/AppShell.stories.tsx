import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, PlayIcon } from "lucide-react";

import {
  AppShell,
  PageHeader,
  Panel,
  SidePanel
} from "@/components/app-shell";
import { StatusBadge } from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { StoryFrame, StorySection } from "./story-frame";

const meta = {
  title: "Shell/App Shell",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      test: "error"
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <AppShell width="game">
      <PageHeader
        actions={
          <>
            <StatusBadge tone="success">connected</StatusBadge>
            <Button variant="outline">
              <CopyIcon className="size-4" />
              Copy invite
            </Button>
          </>
        }
        description="The shell keeps the room header compact and readable while giving the board and command area clear separation on larger screens."
        eyebrow="Room cf-demo"
        title="Live board"
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(21rem,0.9fr)]">
        <Panel
          description="Board space stays dominant on desktop without hiding supporting context."
          heading="Board surface"
          tone="strong"
        >
          <StoryFrame className="min-h-[24rem] border-dashed bg-[linear-gradient(180deg,rgba(9,16,27,0.72),rgba(20,31,49,0.42))]">
            <div className="grid h-full place-items-center rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(226,171,88,0.18),transparent_44%),rgba(9,16,27,0.76)] px-6 text-center">
              <div className="grid gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-info)]">
                  Primary canvas
                </p>
                <p className="font-serif text-3xl text-foreground">Board-first composition</p>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Large play surface in the main column, compact metadata and actions in the side
                  rail, and enough density to avoid wasting desktop width.
                </p>
              </div>
            </div>
          </StoryFrame>
        </Panel>

        <SidePanel
          description="Supporting panels are stacked tightly, with one dominant action per section."
          heading="Command rail"
          tone="muted"
        >
          <StorySection
            title="Turn state"
            description="Status stays explicit and visible without competing with the board."
          >
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="success">your move</StatusBadge>
              <StatusBadge tone="info">active</StatusBadge>
            </div>
          </StorySection>

          <StorySection
            title="Primary action"
            description="High-emphasis controls remain grouped instead of scattered across the route."
          >
            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                <PlayIcon className="size-4" />
                Confirm move
              </Button>
              <Button size="lg" variant="outline">
                Pass turn
              </Button>
            </div>
          </StorySection>
        </SidePanel>
      </section>
    </AppShell>
  )
};
