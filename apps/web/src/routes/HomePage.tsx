import { Dice5Icon, DownloadIcon, Link2Icon, ShieldCheckIcon, UsersIcon, WifiIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoomResponseSchema } from "@cornerfall/protocol";

import { AppShell } from "../components/app-shell/index.js";
import { Badge } from "../components/ui/badge.js";
import { Button } from "../components/ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card.js";
import { Input } from "../components/ui/input.js";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group.js";
import { useInstallPrompt } from "../hooks/useInstallPrompt.js";
import { getApiBaseUrl } from "../lib/api.js";
import { loadPlayerName, savePlayerName } from "../lib/storage.js";
import { cn } from "../lib/utils.js";

function parseRoomId(input: string): string | null {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  const directMatch = trimmedInput.match(/^[a-z0-9_-]+$/i);
  if (directMatch) {
    return directMatch[0];
  }

  const roomPathMatch = trimmedInput.match(/\/play\/([a-z0-9_-]+)/i);
  if (roomPathMatch?.[1]) {
    return roomPathMatch[1];
  }

  try {
    const parsedUrl = new URL(trimmedInput);
    const parsedMatch = parsedUrl.pathname.match(/\/play\/([a-z0-9_-]+)/i);
    return parsedMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

export function HomePage() {
  const navigate = useNavigate();
  const { canInstall, promptInstall } = useInstallPrompt();
  const [playerName, setPlayerName] = useState(() => loadPlayerName());
  const [playerCount, setPlayerCount] = useState<2 | 4>(2);
  const [roomLinkInput, setRoomLinkInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  async function createRoom(): Promise<void> {
    if (!playerName.trim()) {
      setCreateErrorMessage("Enter a display name before creating a room.");
      return;
    }

    setSubmitting(true);
    setCreateErrorMessage(null);
    setJoinErrorMessage(null);
    savePlayerName(playerName.trim());

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/rooms`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          playerCount
        })
      });

      if (!response.ok) {
        throw new Error("Unable to create a room.");
      }

      const payload = createRoomResponseSchema.parse(await response.json());
      navigate(payload.roomUrl, {
        state: {
          autoJoinName: playerName.trim()
        }
      });
    } catch (error) {
      setCreateErrorMessage(error instanceof Error ? error.message : "Unable to create a room.");
    } finally {
      setSubmitting(false);
    }
  }

  function joinExistingRoom(): void {
    const roomId = parseRoomId(roomLinkInput);

    setCreateErrorMessage(null);

    if (!roomId) {
      setJoinErrorMessage("Paste a room link or enter a room code.");
      return;
    }

    const trimmedName = playerName.trim();
    if (trimmedName) {
      savePlayerName(trimmedName);
    }

    setJoinErrorMessage(null);
    navigate(`/play/${roomId}`, {
      state: trimmedName ? { autoJoinName: trimmedName } : undefined
    });
  }

  return (
    <AppShell className="min-h-[calc(100vh-2rem)]" width="game">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.9fr)] lg:items-stretch">
        <Card className="border-border/80 bg-[linear-gradient(145deg,rgba(12,20,33,0.96),rgba(16,25,40,0.9))] shadow-lg">
          <CardHeader className="gap-4 border-b border-border/70 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-[rgba(226,171,88,0.22)] bg-[rgba(226,171,88,0.08)] text-[var(--color-warning)]">
                Original corner strategy
              </Badge>
              <Badge variant="outline" className="border-[rgba(93,179,216,0.2)] bg-[rgba(93,179,216,0.1)] text-[var(--color-info)]">
                Desktop-first refresh
              </Badge>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p className="eyebrow">Cornerfall</p>
                <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-foreground md:text-5xl">
                  Tactile room flow for fast tactical matches.
                </h1>
              </div>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                Create a room, share a link instantly, and keep the board front-and-center while the
                room, turn, and scoring context stay clear on desktop and touch-safe on mobile.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 py-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: UsersIcon,
                  label: "Modes",
                  value: "2 or 4 players"
                },
                {
                  icon: Link2Icon,
                  label: "Invite",
                  value: "Copy room URL"
                },
                {
                  icon: ShieldCheckIcon,
                  label: "Authority",
                  value: "Server-validated turns"
                },
                {
                  icon: WifiIcon,
                  label: "Shell",
                  value: "PWA install ready"
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-[rgba(232,220,197,0.04)] p-4"
                >
                  <item.icon className="mb-3 size-5 text-[var(--color-accent)]" />
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,0.72fr)]">
              <div className="rounded-[calc(var(--radius-xl)+0.1rem)] border border-border/70 bg-[rgba(232,220,197,0.05)] p-5">
                <p className="eyebrow">How It Plays</p>
                <div className="mt-3 grid gap-4 text-sm text-muted-foreground">
                  <p>
                    Claim space from your start corner, preview legal placements locally, and commit
                    each turn against the authoritative room state.
                  </p>
                  <p>
                    Reconnects preserve your seat, the installed shell stays available offline, and
                    live play resumes as soon as the network is back.
                  </p>
                </div>
              </div>
              <div className="rounded-[calc(var(--radius-xl)+0.1rem)] border border-border/70 bg-[rgba(93,179,216,0.08)] p-5">
                <p className="eyebrow text-[var(--color-info)]">Best Use</p>
                <div className="mt-3 grid gap-2 text-sm text-foreground">
                  <p className="font-medium">Host from desktop, join from anywhere.</p>
                  <p className="text-muted-foreground">
                    The desktop refresh improves room scanning and turn clarity without sacrificing
                    tap targets on phones.
                  </p>
                </div>
                {canInstall ? (
                  <Button
                    className="mt-4 w-full justify-center"
                    variant="outline"
                    onClick={() => {
                      void promptInstall();
                    }}
                  >
                    <DownloadIcon className="size-4" />
                    Install app
                  </Button>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Install prompts appear when your device and browser support them.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-border/80 bg-card/95 shadow-md">
            <CardHeader className="border-b border-border/70 pb-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-1">
                  <p className="eyebrow">Start a room</p>
                  <CardTitle className="font-serif text-3xl tracking-[-0.03em]">Create a match</CardTitle>
                </div>
                <Dice5Icon className="mt-1 size-5 text-[var(--color-accent)]" />
              </div>
              <CardDescription>
                Choose your table size, store your name locally, and drop directly into the lobby as
                host.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <form
                className="grid gap-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  void createRoom();
                }}
              >
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-soft)]">Display name</span>
                  <Input
                    data-testid="player-name"
                    autoComplete="nickname"
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Your display name"
                  />
                </label>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-soft)]">Players</span>
                  <ToggleGroup
                    type="single"
                    value={String(playerCount)}
                    onValueChange={(value) => {
                      if (value === "2" || value === "4") {
                        setPlayerCount(Number(value) as 2 | 4);
                      }
                    }}
                    variant="outline"
                    className="w-full rounded-2xl border border-border/70 bg-muted/40 p-1"
                  >
                    <ToggleGroupItem
                      value="2"
                      className={cn(
                        "flex-1 justify-center rounded-xl px-4 py-5 text-sm font-semibold",
                        playerCount === 2 && "bg-primary text-primary-foreground"
                      )}
                    >
                      Duel
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="4"
                      className={cn(
                        "flex-1 justify-center rounded-xl px-4 py-5 text-sm font-semibold",
                        playerCount === 4 && "bg-primary text-primary-foreground"
                      )}
                    >
                      Classic
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <Button
                  className="h-11 w-full justify-center text-sm"
                  type="submit"
                  data-testid="create-game"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create game"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  You will land in the room immediately, claim the host seat, and get a shareable
                  link for the rest of the table.
                </p>

                {createErrorMessage ? (
                  <p className="text-sm font-medium text-[var(--color-danger)]">{createErrorMessage}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/95 shadow-md">
            <CardHeader className="border-b border-border/70 pb-5">
              <p className="eyebrow">Join quickly</p>
              <CardTitle className="font-serif text-2xl tracking-[-0.03em]">Paste a room link or code</CardTitle>
              <CardDescription>
                Shared URL, copied room code, or `/play/:roomId` path all route into the existing
                join flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  joinExistingRoom();
                }}
              >
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-soft)]">Room link or code</span>
                  <Input
                    value={roomLinkInput}
                    onChange={(event) => setRoomLinkInput(event.target.value)}
                    placeholder="Paste a room URL or enter the room code"
                  />
                </label>
                <Button className="h-11 w-full justify-center" type="submit" variant="secondary">
                  <Link2Icon className="size-4" />
                  Join room
                </Button>
                <p className="text-xs text-muted-foreground">
                  If you already filled in your name above, the room page will try to auto-join you.
                </p>
                {joinErrorMessage ? (
                  <p className="text-sm font-medium text-[var(--color-danger)]">{joinErrorMessage}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
