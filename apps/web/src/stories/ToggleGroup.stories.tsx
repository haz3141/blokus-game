import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid2x2Icon, Layers3Icon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const meta = {
  title: "Primitives/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"]
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlayerCountSelector: Story = {
  args: {
    type: "single"
  },
  render: () => (
    <ToggleGroup type="single" defaultValue="2" variant="outline" className="rounded-full bg-muted/40 p-1">
      <ToggleGroupItem value="2" className="rounded-full px-4">
        2 players
      </ToggleGroupItem>
      <ToggleGroupItem value="4" className="rounded-full px-4">
        4 players
      </ToggleGroupItem>
    </ToggleGroup>
  )
};

export const CameraModeSelector: Story = {
  args: {
    type: "single"
  },
  render: () => (
    <ToggleGroup type="single" defaultValue="angled" variant="default" className="rounded-full">
      <ToggleGroupItem value="angled" aria-label="Angled camera">
        <Layers3Icon />
      </ToggleGroupItem>
      <ToggleGroupItem value="top" aria-label="Top-down camera">
        <Grid2x2Icon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
};
