import { Canvas } from "@react-three/fiber";

import { BoardGrid } from "./rendering/BoardGrid.js";
import { CameraRig } from "./rendering/CameraRig.js";
import { ActivePiecePreview } from "./rendering/ActivePiecePreview.js";
import { PlacedPieces } from "./rendering/PlacedPieces.js";
import type { CameraMode } from "../../store/useGameUiStore.js";

interface GameSceneProps {
  size: number;
  boardCells: number[];
  previewCells: Array<{ x: number; y: number }>;
  previewValid: boolean;
  previewTint: string;
  cameraMode: CameraMode;
  onCellSelect: (origin: { x: number; y: number }) => void;
}

export function GameScene({
  size,
  boardCells,
  previewCells,
  previewValid,
  previewTint,
  cameraMode,
  onCellSelect
}: GameSceneProps) {
  return (
    <div className="board-scene-frame">
      <Canvas className="board-canvas" shadows camera={{ fov: 36, position: [7, 11, 11] }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.95} />
        <directionalLight position={[8, 12, 6]} intensity={1.2} />
        <CameraRig mode={cameraMode} size={size} />
        <BoardGrid size={size} />
        <PlacedPieces size={size} cells={boardCells} />
        <ActivePiecePreview
          size={size}
          cells={previewCells}
          valid={previewValid}
          tint={previewTint}
        />
      </Canvas>
      <div
        className="board-overlay"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}
      >
        {Array.from({ length: size * size }, (_, index) => {
          const x = index % size;
          const y = Math.floor(index / size);

          return (
            <button
              key={`${x}-${y}`}
              type="button"
              data-testid={`board-cell-${x}-${y}`}
              aria-label={`Board cell ${x},${y}`}
              onClick={() => onCellSelect({ x, y })}
            />
          );
        })}
      </div>
    </div>
  );
}
