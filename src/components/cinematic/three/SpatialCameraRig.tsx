import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SpatialCameraRigProps {
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  lerpSpeed?: number;
  enableMouseParallax?: boolean;
  parallaxFactor?: number;
}

export const SpatialCameraRig: React.FC<SpatialCameraRigProps> = ({
  targetPosition = [0, 6, 12],
  targetLookAt = [0, 0, 0],
  lerpSpeed = 0.05,
  enableMouseParallax = true,
  parallaxFactor = 0.4,
}) => {
  const { camera, pointer } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(...targetLookAt));

  useFrame(() => {
    // Target position with optional pointer parallax offset
    const targetX = targetPosition[0] + (enableMouseParallax ? pointer.x * parallaxFactor : 0);
    const targetY = targetPosition[1] + (enableMouseParallax ? pointer.y * (parallaxFactor * 0.5) : 0);
    const targetZ = targetPosition[2];

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, lerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, lerpSpeed);

    // Smooth LookAt lerping
    const destLookAt = new THREE.Vector3(...targetLookAt);
    currentLookAt.current.lerp(destLookAt, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
