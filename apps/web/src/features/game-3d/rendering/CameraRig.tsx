import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";

import type { CameraMode } from "../../../store/useGameUiStore.js";

interface CameraRigProps {
  mode: CameraMode;
  size: number;
}

export function CameraRig({ mode, size }: CameraRigProps) {
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (mode === "topDown") {
      camera.position.set(0, size + 8, 0.01);
    } else {
      camera.position.set(size * 0.42, size * 0.7, size * 0.7);
    }

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, mode, size]);

  return null;
}
