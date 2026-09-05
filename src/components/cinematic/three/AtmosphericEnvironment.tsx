import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THREE_LIGHTING_RIG, CHESS_THEME_COLORS } from '../../../utils/themeTokens';

interface AtmosphericEnvironmentProps {
  particleCount?: number;
  enableFog?: boolean;
  fogDensity?: number;
}

export const AtmosphericEnvironment: React.FC<AtmosphericEnvironmentProps> = ({
  particleCount = 70,
  enableFog = true,
  fogDensity = THREE_LIGHTING_RIG.fog.density,
}) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particle coordinate buffer
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = -2 + Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      spd[i] = 0.3 + Math.random() * 0.8;
    }
    return [pos, spd];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      array[i * 3 + 1] += speeds[i] * delta * 0.6;
      if (array[i * 3 + 1] > 12) {
        array[i * 3 + 1] = -2;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <>
      {/* Background Color Clear */}
      <color attach="background" args={[CHESS_THEME_COLORS.obsidian]} />

      {/* Atmospheric Exponential Depth Fog */}
      {enableFog && (
        <fogExp2 attach="fog" args={[CHESS_THEME_COLORS.obsidian, fogDensity]} />
      )}

      {/* Ambient Lighting */}
      <ambientLight
        color={THREE_LIGHTING_RIG.ambient.color}
        intensity={THREE_LIGHTING_RIG.ambient.intensity}
      />

      {/* Primary Key Light with Soft Shadow Casting */}
      <directionalLight
        position={THREE_LIGHTING_RIG.keyLight.position}
        color={THREE_LIGHTING_RIG.keyLight.color}
        intensity={THREE_LIGHTING_RIG.keyLight.intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />

      {/* Warm Metallic Gold Under-Fill Light */}
      <directionalLight
        position={THREE_LIGHTING_RIG.goldFill.position}
        color={THREE_LIGHTING_RIG.goldFill.color}
        intensity={THREE_LIGHTING_RIG.goldFill.intensity}
      />

      {/* Electric Blue Rim Light */}
      <pointLight
        position={THREE_LIGHTING_RIG.rimLight.position}
        color={THREE_LIGHTING_RIG.rimLight.color}
        intensity={THREE_LIGHTING_RIG.rimLight.intensity}
        distance={25}
        decay={2}
      />

      {/* Emerald Tactical Accent Light */}
      <pointLight
        position={THREE_LIGHTING_RIG.emeraldTactical.position}
        color={THREE_LIGHTING_RIG.emeraldTactical.color}
        intensity={THREE_LIGHTING_RIG.emeraldTactical.intensity}
        distance={20}
        decay={2}
      />

      {/* Floating Gold / Ivory Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={CHESS_THEME_COLORS.goldBright}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
};
