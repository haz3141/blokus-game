import { create } from "zustand";

import type { TransformKey } from "@cornerfall/game-core";

export type CameraMode = "topDown" | "angled";

interface GameUiState {
  selectedPieceId: string | null;
  previewOrigin: { x: number; y: number } | null;
  rotationIndex: 0 | 1 | 2 | 3;
  flipped: boolean;
  cameraMode: CameraMode;
  setSelectedPieceId: (pieceId: string | null) => void;
  setPreviewOrigin: (origin: { x: number; y: number } | null) => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  toggleFlip: () => void;
  setCameraMode: (mode: CameraMode) => void;
  resetPlacement: () => void;
}

export const transformKeys: TransformKey[] = ["r0", "r90", "r180", "r270"];

export const flippedTransformKeys: TransformKey[] = ["fr0", "fr90", "fr180", "fr270"];

export const useGameUiStore = create<GameUiState>((set) => ({
  selectedPieceId: null,
  previewOrigin: null,
  rotationIndex: 0,
  flipped: false,
  cameraMode: "angled",
  setSelectedPieceId: (selectedPieceId) =>
    set({
      selectedPieceId,
      previewOrigin: null
    }),
  setPreviewOrigin: (previewOrigin) => set({ previewOrigin }),
  rotateClockwise: () =>
    set((state) => ({
      rotationIndex: ((state.rotationIndex + 1) % 4) as 0 | 1 | 2 | 3
    })),
  rotateCounterClockwise: () =>
    set((state) => ({
      rotationIndex: ((state.rotationIndex + 3) % 4) as 0 | 1 | 2 | 3
    })),
  toggleFlip: () => set((state) => ({ flipped: !state.flipped })),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  resetPlacement: () =>
    set({
      previewOrigin: null,
      rotationIndex: 0,
      flipped: false
    })
}));

export function getSelectedTransform(flipped: boolean, rotationIndex: number): TransformKey {
  return (flipped ? flippedTransformKeys : transformKeys)[rotationIndex] ?? "r0";
}
