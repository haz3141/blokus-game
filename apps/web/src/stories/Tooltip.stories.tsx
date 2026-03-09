import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"]
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="About turns">
          <InfoIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        Only the active player can commit a placement.
      </TooltipContent>
    </Tooltip>
  )
};
