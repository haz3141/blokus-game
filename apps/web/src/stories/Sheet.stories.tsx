import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const meta = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"]
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MobileActions: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open side panel</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[22rem]">
        <SheetHeader>
          <SheetTitle>Turn actions</SheetTitle>
          <SheetDescription>
            Reserve sheets for compact viewports when the desktop side panel collapses.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid gap-3">
          <Button>Confirm placement</Button>
          <Button variant="outline">Rotate piece</Button>
          <Button variant="ghost">Pass turn</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
};
