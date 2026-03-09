import { useEffect, useRef, useState } from "react";

import { parseServerMessage, type RoomSnapshot } from "@cornerfall/protocol";

import { buildWebSocketUrl } from "../lib/api.js";
import { loadPlayerName, loadRoomSession, savePlayerName, saveRoomSession } from "../lib/storage.js";

export type ConnectionState = "connecting" | "connected" | "reconnecting" | "closed" | "error";

interface UseRoomConnectionResult {
  connectionState: ConnectionState;
  snapshot: RoomSnapshot | null;
  errorMessage: string | null;
  playerId: string | null;
  roomNameDraft: string;
  setRoomNameDraft: (name: string) => void;
  joinRoom: (name?: string) => void;
  sendMessage: (payload: unknown) => void;
}

export function useRoomConnection(roomId: string): UseRoomConnectionResult {
  const initialSession = loadRoomSession(roomId);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const sessionRef = useRef(initialSession);
  const snapshotRef = useRef<RoomSnapshot | null>(null);
  const roomNameRef = useRef(loadPlayerName());
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roomNameDraft, setRoomNameDraft] = useState(() => loadPlayerName());
  const [playerId, setPlayerId] = useState<string | null>(initialSession?.playerId ?? null);

  useEffect(() => {
    roomNameRef.current = roomNameDraft;
  }, [roomNameDraft]);

  useEffect(() => {
    let cancelled = false;

    function connect(nextState: ConnectionState): void {
      if (cancelled) {
        return;
      }

      const socket = new WebSocket(buildWebSocketUrl(roomId));
      socketRef.current = socket;
      setConnectionState(nextState);

      socket.addEventListener("open", () => {
        setConnectionState("connected");
        setErrorMessage(null);
        socket.send(
          JSON.stringify({
            type: "hello",
            roomId,
            playerId: sessionRef.current?.playerId,
            sessionToken: sessionRef.current?.sessionToken,
            lastRevision: snapshotRef.current?.revision
          })
        );
      });

      socket.addEventListener("message", (event) => {
        const parsed = parseServerMessage(JSON.parse(event.data));

        if (!parsed.success) {
          setErrorMessage("Received an unexpected server message.");
          return;
        }

        const message = parsed.data;

        switch (message.type) {
          case "welcome":
            setPlayerId(message.playerId);
            if (roomNameRef.current.trim()) {
              savePlayerName(roomNameRef.current.trim());
            }
            sessionRef.current = {
              playerId: message.playerId,
              sessionToken: message.sessionToken
            };
            saveRoomSession(roomId, sessionRef.current);
            break;
          case "room_snapshot":
            snapshotRef.current = message.snapshot;
            setSnapshot(message.snapshot);
            break;
          case "presence_update":
            break;
          case "action_rejected":
            setErrorMessage(`Move rejected: ${message.code}`);
            break;
          case "system_error":
            setErrorMessage(message.message);
            break;
          case "pong":
            break;
        }
      });

      socket.addEventListener("close", () => {
        if (cancelled) {
          return;
        }

        setConnectionState("reconnecting");
        reconnectTimeoutRef.current = window.setTimeout(() => connect("reconnecting"), 1200);
      });

      socket.addEventListener("error", () => {
        setConnectionState("error");
      });
    }

    connect("connecting");

    return () => {
      cancelled = true;
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      socketRef.current?.close();
    };
  }, [roomId]);

  return {
    connectionState,
    snapshot,
    errorMessage,
    playerId,
    roomNameDraft,
    setRoomNameDraft,
    joinRoom: (name) => {
      const trimmedName = (name ?? roomNameDraft).trim();
      if (!trimmedName || socketRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      savePlayerName(trimmedName);
      socketRef.current.send(
        JSON.stringify({
          type: "join_room",
          roomId,
          name: trimmedName,
          sessionToken: sessionRef.current?.sessionToken
        })
      );
    },
    sendMessage: (payload) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload));
      }
    }
  };
}
