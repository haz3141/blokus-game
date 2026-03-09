import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StoryFrame, StorySection } from "./story-frame";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Create room"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame className="max-w-3xl">
      <StorySection title="Variants" description="Primary for decisive actions, outline or ghost for lower-emphasis controls.">
        <div className="flex flex-wrap gap-3">
          <Button>Create room</Button>
          <Button variant="secondary">Copy invite</Button>
          <Button variant="outline">Join room</Button>
          <Button variant="ghost">View rules</Button>
          <Button variant="destructive">Leave room</Button>
        </div>
      </StorySection>
    </StoryFrame>
  )
};

export const States: Story = {
  render: () => (
    <StoryFrame className="max-w-3xl">
      <div className="flex flex-wrap gap-3">
        <Button>
          Start match
          <ArrowRightIcon />
        </Button>
        <Button variant="secondary" disabled>
          Waiting for players
        </Button>
        <Button size="icon" aria-label="Copy link">
          <CopyIcon />
        </Button>
      </div>
    </StoryFrame>
  )
};
