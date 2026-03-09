import { Color, InstancedMesh, Object3D } from "three";
import { useLayoutEffect, useRef } from "react";

interface ActivePiecePreviewProps {
  size: number;
  cells: Array<{ x: number; y: number }>;
  valid: boolean;
  tint: string;
}

export function ActivePiecePreview({ size, cells, valid, tint }: ActivePiecePreviewProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const helper = new Object3D();
    const offset = (size - 1) / 2;
    const color = new Color(valid ? tint : "#ef4444");

    cells.forEach((cell, index) => {
      helper.position.set(cell.x - offset, 0.38, cell.y - offset);
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
      mesh.setColorAt(index, color);
    });

    mesh.count = cells.length;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [cells, size, tint, valid]);

  if (cells.length === 0) {
    return null;
  }

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, size * size]}>
      <boxGeometry args={[0.92, 0.18, 0.92]} />
      <meshStandardMaterial transparent opacity={0.6} roughness={0.4} metalness={0.05} />
    </instancedMesh>
  );
}
