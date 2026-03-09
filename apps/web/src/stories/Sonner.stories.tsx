import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "Primitives/Sonner",
  component: Toaster,
  tags: ["autodocs"]
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ToastStates: Story = {
  render: () => (
    <div className="flex gap-3">
      <Toaster />
      <Button onClick={() => toast.success("Room link copied.", { description: "Share it with the next player." })}>
        Success toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Reconnect failed.", {
            description: "The client will keep retrying until the room is reachable."
          })
        }
      >
        Error toast
      </Button>
    </div>
  )
};
