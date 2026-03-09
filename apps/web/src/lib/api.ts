export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? window.location.origin;
}

export function buildWebSocketUrl(roomId: string): string {
  const apiBase = getApiBaseUrl();
  const url = new URL(`/connect/${roomId}`, apiBase);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}
