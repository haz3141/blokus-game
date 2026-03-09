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
    layout: "fullscreen",
    a11y: {
      test: "error"
    }
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

export const RoomStatusStates: Story = {
  render: () => (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <StorySection
          title="Room status states"
          description="Connection state stays explicit without relying on color alone."
        >
          <StoryGrid>
            <StoryFrame>
              <RoomStatus
                connectionState="connected"
                currentPlayerName="Host"
                isHost
                playerCount={2}
                playersJoined={2}
                roomId="cf-live"
                status="active"
              />
            </StoryFrame>
            <StoryFrame>
              <RoomStatus
                connectionState="reconnecting"
                currentPlayerName="Guest"
                playerCount={4}
                playersJoined={3}
                roomId="cf-recover"
                status="lobby"
              />
            </StoryFrame>
            <StoryFrame>
              <RoomStatus
                connectionState="error"
                currentPlayerName="Waiting"
                playerCount={4}
                playersJoined={2}
                roomId="cf-error"
                status="finished"
              />
            </StoryFrame>
          </StoryGrid>
        </StorySection>
      </div>
    </div>
  )
};

export const TurnIndicatorStates: Story = {
  render: () => (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <StorySection
          title="Turn states"
          description="Readiness, invalid previews, and waiting states are readable from desktop side panels."
        >
          <StoryGrid>
            <StoryFrame>
              <TurnIndicator
                callout="Opening move is ready to commit."
                canConfirm
                currentPlayerName="Host"
                isLocalTurn
                localPlayerName="Host"
                remainingPieces={16}
                statusLabel="preview ready"
                statusTone="success"
              />
            </StoryFrame>
            <StoryFrame>
              <TurnIndicator
                callout="The current preview overlaps an occupied square."
                canConfirm={false}
                currentPlayerName="Host"
                isLocalTurn
                localPlayerName="Host"
                remainingPieces={16}
                statusLabel="preview: overlap"
                statusTone="warning"
              />
            </StoryFrame>
            <StoryFrame>
              <TurnIndicator
                callout="You can inspect the board while the active player decides."
                canConfirm={false}
                currentPlayerName="Guest"
                isLocalTurn={false}
                localPlayerName="Host"
                remainingPieces={14}
                statusLabel="waiting"
                statusTone="neutral"
              />
            </StoryFrame>
          </StoryGrid>
        </StorySection>
      </div>
    </div>
  )
};

export const PieceTrayStates: Story = {
  render: () => (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <StorySection
          title="Piece tray states"
          description="Selection, disabled interaction, and empty reserves remain explicit without page-local styling."
        >
          <StoryGrid className="xl:grid-cols-1">
            <StoryFrame>
              <InteractiveTray />
            </StoryFrame>
            <StoryFrame>
              <PieceTray
                actions={<Button variant="outline">Pass turn</Button>}
                description="Disabled state for observers and waiting players."
                disabled
                pieces={trayPieces}
                selectedPieceId="mono"
              />
            </StoryFrame>
            <StoryFrame>
              <PieceTray
                description="Empty state after every reserve piece has been committed."
                pieces={[]}
                selectedPieceId={null}
              />
            </StoryFrame>
          </StoryGrid>
        </StorySection>
      </div>
    </div>
  )
};

export const ResultsStates: Story = {
  render: () => {
    const tiedScores = demoSnapshot.scores.map((score) => ({
      ...score,
      score: 42
    }));

    return (
      <div className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <StorySection
            title="Results states"
            description="Winner, tie, and empty-result fallback all keep the outcome hierarchy consistent."
          >
            <StoryGrid className="xl:grid-cols-1">
              <StoryFrame>
                <ResultsPanel
                  actions={
                    <>
                      <Button>New room</Button>
                      <Button variant="outline">Copy link</Button>
                    </>
                  }
                  description="Standard post-match winner state."
                  scores={demoSnapshot.scores}
                  winnerLabel="Host wins"
                />
              </StoryFrame>
              <StoryFrame>
                <ResultsPanel
                  description="Tied scores still surface the contenders clearly."
                  scores={tiedScores}
                  winnerIds={["host-1", "guest-1"]}
                />
              </StoryFrame>
              <StoryFrame>
                <ResultsPanel
                  description="Fallback when the final score payload is not available yet."
                  scores={[]}
                />
              </StoryFrame>
            </StoryGrid>
          </StorySection>
        </div>
      </div>
    );
  }
};
