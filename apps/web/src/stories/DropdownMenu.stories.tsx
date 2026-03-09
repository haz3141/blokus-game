import type { Meta, StoryObj } from "@storybook/react-vite";
import { EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const meta = {
  title: "Primitives/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"]
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RoomActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Room actions">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Room actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy invite link</DropdownMenuItem>
        <DropdownMenuItem>Review results</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive">Leave room</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};
