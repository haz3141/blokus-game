import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@/components/ui/skeleton";
import { StoryFrame } from "./story-frame";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  tags: ["autodocs"]
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LobbyLoading: Story = {
  render: () => (
    <StoryFrame className="grid w-[24rem] gap-4">
      <Skeleton className="h-5 w-28 rounded-full" />
      <Skeleton className="h-10 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </StoryFrame>
  )
};
