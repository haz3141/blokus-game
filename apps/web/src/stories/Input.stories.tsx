import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@/components/ui/input";
import { StoryFrame } from "./story-frame";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Player name"
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <StoryFrame className="grid max-w-xl gap-4">
      <Input placeholder="Room code" />
      <Input aria-invalid defaultValue="Seat already taken" />
      <Input defaultValue="Cornerfall-host" disabled />
    </StoryFrame>
  )
};
