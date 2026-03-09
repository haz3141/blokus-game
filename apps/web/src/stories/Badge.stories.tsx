import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/ui/badge";
import { StoryFrame } from "./story-frame";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Connected"
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <StoryFrame className="flex flex-wrap gap-3">
      <Badge>Active turn</Badge>
      <Badge variant="secondary">Waiting</Badge>
      <Badge variant="outline">Open seat</Badge>
      <Badge variant="destructive">Connection issue</Badge>
    </StoryFrame>
  )
};
