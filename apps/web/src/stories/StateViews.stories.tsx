import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  EmptyState,
  ErrorState,
  LoadingState
} from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StoryGrid } from "./story-frame";

const meta = {
  title: "Shell/States",
  tags: ["autodocs"]
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <StoryGrid className="xl:grid-cols-3">
      <EmptyState
        actions={<Button variant="outline">Copy room link</Button>}
        description="Invite another player to fill the table and unlock the host start action."
        title="Waiting for players"
      />
      <LoadingState
        description="Rebuilding the latest room snapshot and reconnecting to the authoritative room service."
        title="Connecting"
      />
      <ErrorState
        actions={<Button>Back home</Button>}
        description="The room connection could not be restored. Retry from the landing flow or re-open the invite link."
        title="Unable to sync room"
      />
    </StoryGrid>
  )
};
