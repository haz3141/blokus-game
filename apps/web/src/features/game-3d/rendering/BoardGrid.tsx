import { InstancedMesh, Object3D } from "three";
import { useLayoutEffect, useRef } from "react";

interface BoardGridProps {
  size: number;
}

export function BoardGrid({ size }: BoardGridProps) {
  const meshRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const helper = new Object3D();
    let index = 0;
    const offset = (size - 1) / 2;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        helper.position.set(x - offset, 0, y - offset);
        helper.updateMatrix();
        mesh.setMatrixAt(index, helper.matrix);
        index += 1;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [size]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, size * size]}>
      <boxGeometry args={[0.96, 0.08, 0.96]} />
      <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.05} />
    </instancedMesh>
  );
}
