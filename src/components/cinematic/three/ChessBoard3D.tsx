import React, { useMemo } from 'react';
import * as THREE from 'three';
import { THREE_MATERIAL_PRESETS } from '../../../utils/themeTokens';

interface ChessBoard3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  highlightSquare?: { file: number; rank: number } | null;
}

const BOARD_DARK_MAT = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.boardDark,
});

const BOARD_LIGHT_MAT = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.boardLight,
});

const BORDER_MAT = new THREE.MeshStandardMaterial({
  ...THREE_MATERIAL_PRESETS.boardBorder,
});

const HIGHLIGHT_MAT = new THREE.MeshStandardMaterial({
  color: '#e8c45a',
  emissive: '#c9a84c',
  emissiveIntensity: 0.6,
  metalness: 0.6,
  roughness: 0.2,
});

export const ChessBoard3D: React.FC<ChessBoard3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  highlightSquare = null,
}) => {
  // Generate 64 squares
  const squares = useMemo(() => {
    const list: {
      file: number;
      rank: number;
      isLight: boolean;
      x: number;
      z: number;
    }[] = [];

    const squareSize = 1.0;
    const offset = (7 * squareSize) / 2;

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (file + rank) % 2 === 1;
        const x = file * squareSize - offset;
        const z = rank * squareSize - offset;
        list.push({ file, rank, isLight, x, z });
      }
    }
    return list;
  }, []);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 64 Board Squares */}
      {squares.map((sq) => {
        const isHighlighted =
          highlightSquare &&
          highlightSquare.file === sq.file &&
          highlightSquare.rank === sq.rank;

        const mat = isHighlighted
          ? HIGHLIGHT_MAT
          : sq.isLight
          ? BOARD_LIGHT_MAT
          : BOARD_DARK_MAT;

        return (
          <mesh
            key={`sq-${sq.file}-${sq.rank}`}
            position={[sq.x, 0.05, sq.z]}
            receiveShadow
            material={mat}
          >
            <boxGeometry args={[0.98, 0.1, 0.98]} />
          </mesh>
        );
      })}

      {/* Raised Outer Border Trim */}
      <mesh position={[0, 0, 0]} receiveShadow material={BORDER_MAT}>
        <boxGeometry args={[8.8, 0.08, 8.8]} />
      </mesh>

      {/* Gold Inset Framing Ridge */}
      <mesh position={[0, 0.04, 0]} receiveShadow material={BORDER_MAT}>
        <boxGeometry args={[8.2, 0.06, 8.2]} />
      </mesh>

      {/* Ground Shadow Plate */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </group>
  );
};
