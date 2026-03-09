import { Color, InstancedMesh, Object3D } from "three";
import { useLayoutEffect, useRef } from "react";

import { colorForOwner } from "../lib/colors.js";

interface PlacedPiecesProps {
  size: number;
  cells: number[];
}

export function PlacedPieces({ size, cells }: PlacedPiecesProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const helper = new Object3D();
    const colors: string[] = [];
    const offset = (size - 1) / 2;

    let instanceIndex = 0;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const owner = cells[y * size + x] ?? -1;
        if (owner < 0) {
          continue;
        }

        helper.position.set(x - offset, 0.18, y - offset);
        helper.updateMatrix();
        mesh.setMatrixAt(instanceIndex, helper.matrix);
        colors[instanceIndex] = colorForOwner(owner);
        instanceIndex += 1;
      }
    }

    mesh.count = instanceIndex;
    mesh.instanceMatrix.needsUpdate = true;
    for (let index = 0; index < instanceIndex; index += 1) {
      mesh.setColorAt(index, new Color(colors[index] ?? "#94a3b8"));
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [cells, size]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, size * size]}>
      <boxGeometry args={[0.94, 0.28, 0.94]} />
      <meshStandardMaterial roughness={0.5} metalness={0.1} />
    </instancedMesh>
  );
}
