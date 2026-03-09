import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layers3Icon, LayoutPanelTopIcon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StoryFrame, StoryGrid, StorySection, TokenSwatch } from "./story-frame";

const meta = {
  title: "Docs/Design System",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cornerfall uses a dark tabletop system: quiet slate surfaces, warm amber emphasis, and compact desktop density without sacrificing mobile clarity."
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8">
        <StoryFrame className="overflow-hidden bg-[linear-gradient(135deg,rgba(226,171,88,0.12),transparent_34%),linear-gradient(180deg,rgba(14,23,38,0.98),rgba(8,17,29,0.96))]">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div className="grid gap-4">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em]">
                Tabletop Studio
              </Badge>
              <div className="grid gap-3">
                <h1 className="max-w-3xl font-serif text-4xl leading-none tracking-tight text-foreground md:text-5xl">
                  Game-first surfaces with clearer hierarchy and denser desktop rhythm.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                  The system separates board space from meta controls, uses player color only where it improves game-state legibility, and keeps text readable on long play sessions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">Primary action</Button>
                <Button size="lg" variant="outline">
                  Secondary action
                </Button>
              </div>
            </div>
            <Card className="self-start border border-border/70 bg-background/55">
              <CardHeader>
                <CardTitle>Design rules</CardTitle>
                <CardDescription>
                  Use the board as the visual anchor and keep room/turn metadata in compact side panels.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
                  <Layers3Icon className="size-4 text-primary" />
                  Layer surfaces by importance, not by arbitrary card count.
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
                  <LayoutPanelTopIcon className="size-4 text-primary" />
                  Keep headers concise and expose one dominant action per state.
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
                  <SparklesIcon className="size-4 text-primary" />
                  Motion stays short and functional, with reduced-motion safety.
                </div>
              </CardContent>
            </Card>
          </div>
        </StoryFrame>

        <StorySection
          title="Core Tokens"
          description="Foundation tokens live in CSS variables and theme the shadcn primitives plus any app-level game UI."
        >
          <StoryGrid>
            <TokenSwatch label="Accent / Primary" value="var(--color-accent)" />
            <TokenSwatch label="Panel Surface" value="var(--color-bg-panel)" />
            <TokenSwatch label="Panel Strong" value="var(--color-bg-panel-strong)" />
            <TokenSwatch label="Focus Ring" value="var(--color-focus-ring)" />
            <TokenSwatch label="Player 1" value="var(--player-1)" />
            <TokenSwatch label="Player 2" value="var(--player-2)" />
          </StoryGrid>
        </StorySection>

        <StorySection
          title="Typography and Rhythm"
          description="Display typography is reserved for titles and results; the body stack keeps room and turn information compact."
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
            <StoryFrame className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Section label</p>
              <h2 className="font-serif text-4xl leading-none tracking-tight">Cornerfall Result Summary</h2>
              <p className="max-w-2xl text-base text-muted-foreground">
                Use display type for page titles, key outcomes, and landmark panel headers. Body copy stays smaller and quieter to keep the board and action state in focus.
              </p>
            </StoryFrame>
            <StoryFrame className="grid gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-sm">
                `--text-sm` for supporting copy and metadata.
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-base">
                `--text-base` for primary body text and button labels.
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-lg">
                `--text-lg` for emphasized supporting text.
              </div>
            </StoryFrame>
          </div>
        </StorySection>
      </div>
    </div>
  );
}

export const Overview: Story = {
  render: () => <DesignSystemShowcase />
};
