import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBChessSetProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const GLB_PATH = '/models/handmade_wooden_chess_set_-_detailed_low-poly.glb';

export const GLBChessSet: React.FC<GLBChessSetProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(GLB_PATH);

  // Clone scene so multiple instances or hot-reloading don't conflict
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Compute bounding box to normalize scale and center
    const bbox = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    // If model is very large or off-center, adjust offset
    clone.position.x -= center.x;
    clone.position.y -= bbox.min.y; // Sit on base
    clone.position.z -= center.z;

    // Enhance materials and shadows
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.45);
          mat.envMapIntensity = 1.2;
        }
      }
    });

    return { clone, size };
  }, [scene]);

  // Determine scale factor so it fits nicely in the scene (around ~8 units width)
  const targetScale = useMemo(() => {
    const maxDim = Math.max(clonedScene.size.x, clonedScene.size.z, clonedScene.size.y);
    if (maxDim > 0) {
      // Normalize to standard ~8 units width
      return (8.0 / maxDim) * scale;
    }
    return scale;
  }, [clonedScene.size, scale]);

  return (
    <group position={position} rotation={rotation}>
      <primitive object={clonedScene.clone} scale={targetScale} />
    </group>
  );
};

// Preload the GLB model for smooth loading
useGLTF.preload(GLB_PATH);

export default GLBChessSet;
