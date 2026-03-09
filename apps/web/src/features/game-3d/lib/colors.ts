export const playerMeshColors = ["#f59e0b", "#38bdf8", "#34d399", "#fb7185"];

export function colorForOwner(owner: number): string {
  return playerMeshColors[owner] ?? "#64748b";
}
