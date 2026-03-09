export interface StoredRoomSession {
  playerId: string;
  sessionToken: string;
}

const NAME_KEY = "cornerfall:player-name";

function roomKey(roomId: string): string {
  return `cornerfall:room:${roomId}`;
}

export function loadPlayerName(): string {
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function savePlayerName(name: string): void {
  window.localStorage.setItem(NAME_KEY, name.trim());
}

export function loadRoomSession(roomId: string): StoredRoomSession | null {
  const raw = window.localStorage.getItem(roomKey(roomId));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredRoomSession;
  } catch {
    return null;
  }
}

export function saveRoomSession(roomId: string, session: StoredRoomSession): void {
  window.localStorage.setItem(roomKey(roomId), JSON.stringify(session));
}
