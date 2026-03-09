import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { PieceId } from "@cornerfall/game-core";
import type { RoomSnapshot } from "@cornerfall/protocol";

import {
  PieceTray,
  PlayerBadge,
  ResultsPanel,
  RoomStatus,
  TurnIndicator
} from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { StoryFrame, StoryGrid, StorySection } from "./story-frame";

const demoSnapshot: RoomSnapshot = {
  roomId: "cf-demo",
  revision: 18,
  status: "active",
  createdAt: "2026-03-09T00:00:00.000Z",
  startedAt: "2026-03-09T00:05:00.000Z",
  hostPlayerId: "host-1",
  currentPlayerId: "host-1",
  config: {
    playerCount: 2,
    boardSize: 20,
    variant: "duel"
  },
  seats: [
    {
      seatIndex: 0,
      colorKey: "amber",
      playerId: "host-1",
      name: "Host",
      connected: true
    },
    {
      seatIndex: 1,
      colorKey: "azure",
      playerId: "guest-1",
      name: "Guest",
      connected: true
    }
  ],
  players: [
    {
      playerId: "host-1",
      name: "Host",
      seatIndex: 0,
      colorKey: "amber",
      connected: true
    },
    {
      playerId: "guest-1",
      name: "Guest",
      seatIndex: 1,
      colorKey: "azure",
      connected: true
    }
  ],
  scores: [
    {
      playerId: "host-1",
      name: "Host",
      colorKey: "amber",
      score: 42,
      remainingCells: 11,
      hasPassed: false
    },
    {
      playerId: "guest-1",
      name: "Guest",
      colorKey: "azure",
      score: 37,
      remainingCells: 14,
      hasPassed: true
    }
  ],
  winnerIds: ["host-1"],
  game: null
};

const trayPieces: PieceId[] = [
  "mono",
  "domino",
  "tromino-l",
  "tetromino-t",
  "pentomino-f",
  "pentomino-x"
];

const meta = {
  title: "Game UI/Overview",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractiveTray() {
  const [selectedPieceId, setSelectedPieceId] = useState<PieceId | null>("tetromino-t");

  return (
    <PieceTray
      pieces={trayPieces}
      selectedPieceId={selectedPieceId}
      onSelect={(pieceId) => setSelectedPieceId(pieceId)}
    />
  );
}

export const ActiveRoom: Story = {
  render: () => (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <StoryGrid className="xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <StoryFrame className="grid gap-4">
            <RoomStatus
              connectionState="connected"
              currentPlayerName="Host"
              isHost
              playerCount={demoSnapshot.config.playerCount}
              playersJoined={demoSnapshot.players.length}
              roomId={demoSnapshot.roomId}
              status={demoSnapshot.status}
            />
            <TurnIndicator
              callout="Opening move is ready. Confirm only after the preview covers the correct corner contact."
              canConfirm
              currentPlayerName="Host"
              isLocalTurn
              localPlayerName="Host"
              remainingPieces={16}
              statusLabel="preview ready"
              statusTone="success"
            />
          </StoryFrame>

          <StoryFrame className="grid gap-4">
            <StorySection
              title="Roster treatment"
              description="Identity uses player color sparingly, while connection and ownership remain explicit."
            >
              <div className="grid gap-3">
                <PlayerBadge
                  colorKey="amber"
                  connected
                  detail="Seat 1"
                  isHost
                  isLocal
                  name="Host"
                />
                <PlayerBadge
                  colorKey="azure"
                  connected={false}
                  detail="Seat 2"
                  name="Guest"
                />
              </div>
            </StorySection>
          </StoryFrame>
        </StoryGrid>

        <StoryFrame>
          <InteractiveTray />
        </StoryFrame>
      </div>
    </div>
  )
};

export const ResultsState: Story = {
  render: () => (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <ResultsPanel
          actions={
            <>
              <Button>New room</Button>
              <Button variant="outline">Copy link</Button>
            </>
          }
          description="Winner, scores, and follow-up actions are grouped into one clear post-game hierarchy."
          scores={demoSnapshot.scores}
          winnerLabel="Host wins"
        />
      </div>
    </div>
  )
};
