import React, { useMemo } from 'react';
import * as THREE from 'three';
import { THREE_MATERIAL_PRESETS } from '../../../utils/themeTokens';

// Shared singleton materials for GPU draw-call efficiency
export const SHARED_GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.goldMetal,
  emissive: new THREE.Color('#382806'),
  emissiveIntensity: 0.25,
});

export const SHARED_IVORY_MATERIAL = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.ivoryBone,
  emissive: new THREE.Color('#1c1a16'),
  emissiveIntensity: 0.1,
});

export const SHARED_OBSIDIAN_MATERIAL = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.obsidianSlate,
  emissive: new THREE.Color('#0a0b10'),
  emissiveIntensity: 0.15,
});

export const SHARED_EMERALD_MATERIAL = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.activeNode,
  emissive: new THREE.Color('#1a7a5e'),
  emissiveIntensity: 0.7,
});

export interface Piece3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  materialType?: 'gold' | 'ivory' | 'obsidian' | 'emerald';
  customMaterial?: THREE.Material;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

const getMaterial = (
  materialType: 'gold' | 'ivory' | 'obsidian' | 'emerald' = 'gold',
  customMaterial?: THREE.Material
): THREE.Material => {
  if (customMaterial) return customMaterial;
  switch (materialType) {
    case 'ivory':
      return SHARED_IVORY_MATERIAL;
    case 'obsidian':
      return SHARED_OBSIDIAN_MATERIAL;
    case 'emerald':
      return SHARED_EMERALD_MATERIAL;
    case 'gold':
    default:
      return SHARED_GOLD_MATERIAL;
  }
};

/** 3D Procedural King Piece with Crown Cross */
export const King3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'gold',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const points = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.32, 0),
    new THREE.Vector2(0.32, 0.12),
    new THREE.Vector2(0.24, 0.18),
    new THREE.Vector2(0.24, 0.26),
    new THREE.Vector2(0.28, 0.34),
    new THREE.Vector2(0.28, 0.42),
    new THREE.Vector2(0.16, 0.60),
    new THREE.Vector2(0.13, 0.72),
    new THREE.Vector2(0.19, 0.80),
    new THREE.Vector2(0.19, 0.95),
    new THREE.Vector2(0.15, 1.02),
    new THREE.Vector2(0.15, 1.12),
    new THREE.Vector2(0.13, 1.18),
    new THREE.Vector2(0.13, 1.30),
    new THREE.Vector2(0.04, 1.38),
    new THREE.Vector2(0, 1.40),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[points, 32]} />
      </mesh>
      {/* King Crown Cross Top */}
      <mesh position={[0, 1.48, 0]} castShadow={castShadow} material={mat}>
        <boxGeometry args={[0.06, 0.22, 0.06]} />
      </mesh>
      <mesh position={[0, 1.54, 0]} castShadow={castShadow} material={mat}>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
      </mesh>
    </group>
  );
};

/** 3D Procedural Queen Piece */
export const Queen3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'gold',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const points = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.30, 0),
    new THREE.Vector2(0.30, 0.10),
    new THREE.Vector2(0.22, 0.16),
    new THREE.Vector2(0.22, 0.24),
    new THREE.Vector2(0.26, 0.32),
    new THREE.Vector2(0.26, 0.38),
    new THREE.Vector2(0.15, 0.58),
    new THREE.Vector2(0.12, 0.70),
    new THREE.Vector2(0.18, 0.78),
    new THREE.Vector2(0.18, 0.90),
    new THREE.Vector2(0.22, 1.05),
    new THREE.Vector2(0.18, 1.15),
    new THREE.Vector2(0.06, 1.25),
    new THREE.Vector2(0, 1.28),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[points, 32]} />
      </mesh>
      {/* Queen Crown Sphere */}
      <mesh position={[0, 1.34, 0]} castShadow={castShadow} material={mat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
    </group>
  );
};

/** 3D Procedural Rook (Castle) Piece */
export const Rook3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'obsidian',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const points = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.28, 0),
    new THREE.Vector2(0.28, 0.10),
    new THREE.Vector2(0.20, 0.15),
    new THREE.Vector2(0.18, 0.22),
    new THREE.Vector2(0.18, 0.65),
    new THREE.Vector2(0.22, 0.75),
    new THREE.Vector2(0.24, 0.85),
    new THREE.Vector2(0.24, 1.00),
    new THREE.Vector2(0.16, 1.00),
    new THREE.Vector2(0.16, 0.90),
    new THREE.Vector2(0, 0.90),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[points, 32]} />
      </mesh>
    </group>
  );
};

/** 3D Procedural Bishop Piece */
export const Bishop3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'ivory',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const points = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.26, 0),
    new THREE.Vector2(0.26, 0.08),
    new THREE.Vector2(0.18, 0.14),
    new THREE.Vector2(0.14, 0.55),
    new THREE.Vector2(0.18, 0.65),
    new THREE.Vector2(0.20, 0.85),
    new THREE.Vector2(0.14, 1.05),
    new THREE.Vector2(0.04, 1.15),
    new THREE.Vector2(0, 1.18),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[points, 32]} />
      </mesh>
      {/* Bishop Top Finial */}
      <mesh position={[0, 1.23, 0]} castShadow={castShadow} material={mat}>
        <sphereGeometry args={[0.05, 16, 16]} />
      </mesh>
    </group>
  );
};

/** 3D Procedural Knight (Horse) Piece */
export const Knight3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'gold',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const basePoints = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.26, 0),
    new THREE.Vector2(0.26, 0.12),
    new THREE.Vector2(0.18, 0.18),
    new THREE.Vector2(0.18, 0.28),
    new THREE.Vector2(0, 0.28),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base */}
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[basePoints, 24]} />
      </mesh>
      {/* Horse Head Body */}
      <mesh position={[0, 0.55, 0]} castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <cylinderGeometry args={[0.12, 0.18, 0.55, 12]} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.12, 0.70, 0]} rotation={[0, 0, -0.4]} castShadow={castShadow} material={mat}>
        <boxGeometry args={[0.22, 0.16, 0.18]} />
      </mesh>
      {/* Mane Arch */}
      <mesh position={[-0.08, 0.65, 0]} rotation={[0, 0, 0.3]} castShadow={castShadow} material={mat}>
        <boxGeometry args={[0.10, 0.30, 0.14]} />
      </mesh>
    </group>
  );
};

/** 3D Procedural Pawn Piece */
export const Pawn3D: React.FC<Piece3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  materialType = 'ivory',
  customMaterial,
  castShadow = true,
  receiveShadow = true,
}) => {
  const mat = getMaterial(materialType, customMaterial);

  const points = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.24, 0.08),
    new THREE.Vector2(0.16, 0.12),
    new THREE.Vector2(0.14, 0.18),
    new THREE.Vector2(0.09, 0.45),
    new THREE.Vector2(0.14, 0.54),
    new THREE.Vector2(0.14, 0.60),
    new THREE.Vector2(0.06, 0.64),
    new THREE.Vector2(0, 0.66),
  ], []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow} material={mat}>
        <latheGeometry args={[points, 24]} />
      </mesh>
      {/* Pawn Head Sphere */}
      <mesh position={[0, 0.76, 0]} castShadow={castShadow} material={mat}>
        <sphereGeometry args={[0.14, 20, 20]} />
      </mesh>
    </group>
  );
};
