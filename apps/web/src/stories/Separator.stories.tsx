import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@/components/ui/separator";
import { StoryFrame } from "./story-frame";

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  tags: ["autodocs"]
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <StoryFrame className="grid w-[24rem] gap-4">
      <div className="grid gap-1">
        <h3 className="font-serif text-xl">Room status</h3>
        <p className="text-sm text-muted-foreground">Use separators to break dense metadata into readable groups.</p>
      </div>
      <Separator />
      <div className="grid gap-1 text-sm text-muted-foreground">
        <p>Host: Ready</p>
        <p>Guests: 1 / 3</p>
      </div>
    </StoryFrame>
  )
};
