import { playerMeshColors } from "../../../lib/design/tokens.js";

export function colorForOwner(owner: number): string {
  return playerMeshColors[owner] ?? "#64748b";
}
