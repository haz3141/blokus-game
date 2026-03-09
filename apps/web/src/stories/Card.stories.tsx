import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"]
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LobbyPanel: Story = {
  render: () => (
    <Card className="w-[24rem] border border-border/70 bg-card/95">
      <CardHeader>
        <CardTitle>Lobby status</CardTitle>
        <CardDescription>Two of four seats are filled and the host is ready to start.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
          <span>Connected players</span>
          <strong className="text-foreground">2 / 4</strong>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
          <span>Invite link</span>
          <strong className="text-foreground">Ready</strong>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start when full</Button>
      </CardFooter>
    </Card>
  )
};
