import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from '../../context/ScrollContext';
import { GLBChessSet } from './three/GLBChessSet';

/* ────────────────────────────────────────────────────────
   Accessibility & Performance Hooks
   ──────────────────────────────────────────────────────── */
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

const useIsMobile = () => {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
};

/* ────────────────────────────────────────────────────────
   Chess piece materials
   ──────────────────────────────────────────────────────── */

/** Radiant gold metallic material */
const GOLD_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#d4af37',
  metalness: 0.85,
  roughness: 0.18,
  emissive: '#2a1e08',
  emissiveIntensity: 0.15,
});

/** Luminous ivory porcelain material */
const IVORY_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#f0ece1',
  metalness: 0.15,
  roughness: 0.32,
  emissive: '#1c1812',
  emissiveIntensity: 0.1,
});

/** Deep obsidian slate piece material */
const DARK_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#121318',
  metalness: 0.6,
  roughness: 0.22,
  emissive: '#090a0f',
  emissiveIntensity: 0.12,
});

/* ────────────────────────────────────────────────────────
   Chess piece geometries (procedural lathe)
   ──────────────────────────────────────────────────────── */

/** King chess piece using lathe profile */
const KingPiece: React.FC<{
  position: [number, number, number];
  scale?: number;
  material?: THREE.Material;
  reducedMotion?: boolean;
}> = ({ position, scale = 1, material = IVORY_MATERIAL, reducedMotion = false }) => {
  const meshRef = useRef<THREE.Group>(null);

  const kingPoints = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.3, 0),
    new THREE.Vector2(0.3, 0.12),
    new THREE.Vector2(0.22, 0.18),
    new THREE.Vector2(0.22, 0.25),
    new THREE.Vector2(0.28, 0.32),
    new THREE.Vector2(0.28, 0.38),
    new THREE.Vector2(0.15, 0.55),
    new THREE.Vector2(0.12, 0.65),
    new THREE.Vector2(0.18, 0.72),
    new THREE.Vector2(0.18, 0.85),
    new THREE.Vector2(0.14, 0.9),
    new THREE.Vector2(0.14, 1.0),
    new THREE.Vector2(0.12, 1.05),
    new THREE.Vector2(0.12, 1.15),
    new THREE.Vector2(0.04, 1.22),
    new THREE.Vector2(0.04, 1.35),
    new THREE.Vector2(0.1, 1.42),
    new THREE.Vector2(0.1, 1.55),
    new THREE.Vector2(0.04, 1.6),
    new THREE.Vector2(0, 1.6),
  ], []);

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={[scale, scale, scale]}>
      <mesh material={material} castShadow receiveShadow>
        <latheGeometry args={[kingPoints, 32]} />
      </mesh>
      {/* Crown cross bar horizontal */}
      <mesh position={[0, 1.48, 0]} material={material} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.06]} />
      </mesh>
      {/* Crown cross bar vertical */}
      <mesh position={[0, 1.52, 0]} material={material} castShadow>
        <boxGeometry args={[0.06, 0.14, 0.06]} />
      </mesh>
    </group>
  );
};

/** Pawn piece using lathe profile */
const PawnPiece: React.FC<{
  position: [number, number, number];
  material?: THREE.Material;
  scale?: number;
}> = ({ position, material = IVORY_MATERIAL, scale = 1 }) => {
  const pawnPoints = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.22, 0),
    new THREE.Vector2(0.22, 0.08),
    new THREE.Vector2(0.15, 0.15),
    new THREE.Vector2(0.1, 0.35),
    new THREE.Vector2(0.08, 0.6),
    new THREE.Vector2(0.14, 0.7),
    new THREE.Vector2(0.18, 0.82),
    new THREE.Vector2(0.18, 0.92),
    new THREE.Vector2(0.14, 0.98),
    new THREE.Vector2(0, 1.0),
  ], []);

  return (
    <mesh position={position} scale={[scale, scale, scale]} material={material} castShadow receiveShadow>
      <latheGeometry args={[pawnPoints, 24]} />
    </mesh>
  );
};

/** Rook piece */
const RookPiece: React.FC<{
  position: [number, number, number];
  material?: THREE.Material;
  scale?: number;
}> = ({ position, material = DARK_MATERIAL, scale = 1 }) => {
  const rookPoints = useMemo(() => [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.26, 0),
    new THREE.Vector2(0.26, 0.1),
    new THREE.Vector2(0.18, 0.18),
    new THREE.Vector2(0.15, 0.6),
    new THREE.Vector2(0.18, 0.75),
    new THREE.Vector2(0.22, 0.8),
    new THREE.Vector2(0.22, 0.95),
    new THREE.Vector2(0, 0.95),
  ], []);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh material={material} castShadow receiveShadow>
        <latheGeometry args={[rookPoints, 24]} />
      </mesh>
      {/* Battlements */}
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} position={[x, 1.0, 0]} material={material} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.24]} />
        </mesh>
      ))}
    </group>
  );
};

/* ────────────────────────────────────────────────────────
   Chessboard
   ──────────────────────────────────────────────────────── */
const ChessBoard: React.FC = () => {
  const LIGHT_MAT = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8e2d5', // Warm ivory bone
    metalness: 0.22,
    roughness: 0.28,
  }), []);

  const DARK_MAT = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#13141a', // Obsidian slate
    metalness: 0.55,
    roughness: 0.22,
  }), []);

  const BORDER_MAT = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#181410', // Dark walnut bronze
    metalness: 0.7,
    roughness: 0.32,
  }), []);

  const GOLD_TRIM_MAT = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c9a84c', // Gold trim border
    metalness: 0.9,
    roughness: 0.18,
    emissive: '#1a1405',
    emissiveIntensity: 0.2,
  }), []);

  const squares = useMemo(() => {
    const items: React.ReactNode[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isLight = (r + c) % 2 === 0;
        items.push(
          <mesh
            key={`${r}-${c}`}
            position={[c - 3.5, 0, r - 3.5]}
            receiveShadow
            material={isLight ? LIGHT_MAT : DARK_MAT}
          >
            <boxGeometry args={[1, 0.08, 1]} />
          </mesh>
        );
      }
    }
    return items;
  }, [LIGHT_MAT, DARK_MAT]);

  return (
    <group>
      {/* Outer base border */}
      <mesh position={[0, -0.06, 0]} receiveShadow material={BORDER_MAT}>
        <boxGeometry args={[9.4, 0.15, 9.4]} />
      </mesh>
      {/* Gold metallic edge inlay */}
      <mesh position={[0, -0.02, 0]} material={GOLD_TRIM_MAT}>
        <boxGeometry args={[8.85, 0.085, 8.85]} />
      </mesh>
      {squares}
    </group>
  );
};

/* ────────────────────────────────────────────────────────
   Particle System
   ──────────────────────────────────────────────────────── */
const Particles: React.FC<{ count?: number; reducedMotion?: boolean }> = ({ count = 180, reducedMotion = false }) => {
  const meshRef = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sz[i] = Math.random() * 2 + 0.5;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c9a84c"
        size={0.04}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

/* ────────────────────────────────────────────────────────
   Rising Ember Sparks System
   ──────────────────────────────────────────────────────── */
const EmberSparks: React.FC<{ count?: number; reducedMotion?: boolean }> = ({ count = 90, reducedMotion = false }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = -4 + Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      speeds[i] = 0.5 + Math.random() * 0.9;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { pos, speeds, phases };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += data.speeds[i] * delta * 0.7;
      array[i * 3] += Math.sin(t * 1.4 + data.phases[i]) * 0.006;
      if (array[i * 3 + 1] > 7) {
        array[i * 3 + 1] = -4;
        array[i * 3] = (Math.random() - 0.5) * 18;
        array[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff5a3c"
        size={0.06}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

/* ────────────────────────────────────────────────────────
   Camera Rig — controlled by scroll progress
   ──────────────────────────────────────────────────────── */
const CameraRig: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const { camera } = useThree();
  const { progress } = useScroll();

  const getTargetCamera = (pct: number) => {
    if (pct < 15) {
      // Hero: low, wide, cinematic
      const t = pct / 15;
      return {
        x: 0,
        y: 4 - t * 2,
        z: 14 - t * 3,
        lookY: 1.5 - t * 0.5,
      };
    } else if (pct < 30) {
      // Tournament intro: diving toward board
      const t = (pct - 15) / 15;
      return {
        x: t * 2,
        y: 2 - t * 1.5,
        z: 11 - t * 4,
        lookY: 1 - t * 0.8,
      };
    } else if (pct < 45) {
      // Players: orbiting the hall
      const t = (pct - 30) / 15;
      return {
        x: Math.sin(t * Math.PI * 0.5) * 8,
        y: 3 + t,
        z: 7 + t * 3,
        lookY: 0,
      };
    } else {
      // Further sections: pull back + rise
      const t = (pct - 45) / 55;
      return {
        x: 0,
        y: 5 + t * 5,
        z: 12 + t * 8,
        lookY: 0,
      };
    }
  };

  useFrame(() => {
    const target = getTargetCamera(progress);
    const lerpFactor = reducedMotion ? 0.08 : 0.04;
    camera.position.x += (target.x - camera.position.x) * lerpFactor;
    camera.position.y += (target.y - camera.position.y) * lerpFactor;
    camera.position.z += (target.z - camera.position.z) * lerpFactor;
    camera.lookAt(0, target.lookY, 0);
  });

  return null;
};

/* ────────────────────────────────────────────────────────
   Floating Board Group (the hero focal point)
   ──────────────────────────────────────────────────────── */
const FloatingBoardGroup: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion = false }) => {
  const { progress } = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.y = (progress / 100) * Math.PI * 0.3;
      groupRef.current.position.y = 0;
    } else {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04 + (progress / 100) * Math.PI * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  const content = (
    <group ref={groupRef} rotation={[0.12, 0.3, 0]}>
      <Suspense
        fallback={
          <>
            <ChessBoard />
            <KingPiece position={[0, 0.08, 0]} scale={1.2} material={GOLD_MATERIAL} reducedMotion={reducedMotion} />
            <PawnPiece position={[-3, 0.08, -3]} material={IVORY_MATERIAL} scale={0.85} />
            <PawnPiece position={[3, 0.08, -3]} material={IVORY_MATERIAL} scale={0.85} />
            <PawnPiece position={[-2, 0.08, 2.5]} material={DARK_MATERIAL} scale={0.85} />
            <PawnPiece position={[2.5, 0.08, 2]} material={DARK_MATERIAL} scale={0.85} />
            <RookPiece position={[-3.5, 0.08, 3.5]} material={DARK_MATERIAL} scale={0.9} />
            <RookPiece position={[3.5, 0.08, -3.5]} material={IVORY_MATERIAL} scale={0.9} />
          </>
        }
      >
        <GLBChessSet scale={1.05} />
      </Suspense>
    </group>
  );

  if (reducedMotion) {
    return content;
  }

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.3}>
      {content}
    </Float>
  );
};

/* ────────────────────────────────────────────────────────
   Main Hero Scene Component
   ──────────────────────────────────────────────────────── */
export const HeroScene: React.FC<{ isDev?: boolean }> = ({ isDev = false }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.05 });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="3D Interactive Chessboard Scene"
      style={{ width: '100%', height: '100%', background: '#0a0a0b' }}
    >
      <Canvas
        id="cg-hero-canvas"
        frameloop={isInView ? 'always' : 'never'}
        shadows={!isMobile}
        camera={{ position: [0, 4, 14], fov: 45, near: 0.1, far: 200 }}
        style={{ background: '#0a0a0b' }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? 'default' : 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        {/* Explicit dark background color */}
        <color attach="background" args={['#0a0a0b']} />

        {/* Atmosphere dark fog */}
        <fogExp2 attach="fog" args={['#0a0a0b', 0.015]} />

        {/* Ambient base lighting */}
        <ambientLight intensity={0.45} color="#d6c7a8" />

        {/* Main key directional light with soft shadows */}
        <directionalLight
          position={[6, 14, 8]}
          intensity={1.9}
          color="#fff6e5"
          castShadow={!isMobile}
          shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
          shadow-camera-far={60}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0001}
        />

        {/* Warm golden fill from below */}
        <pointLight position={[0, -4, 2]} color="#c9a84c" intensity={1.1} distance={18} />

        {/* Cool electric blue rim light */}
        <pointLight position={[-8, 6, -5]} color="#2255ee" intensity={1.2} distance={25} />

        {/* Emerald tactical accent */}
        <pointLight position={[8, 3, -6]} color="#1a7a5e" intensity={0.8} distance={20} />

        {/* Crimson-ember contour kicker */}
        <pointLight position={[0, 2, -8]} color="#ff5a3c" intensity={0.65} distance={18} />

        {/* Deep starry space backdrop */}
        <Stars
          radius={80}
          depth={50}
          count={isMobile ? 300 : 1200}
          factor={3}
          saturation={0.1}
          fade
          speed={prefersReducedMotion ? 0 : 0.3}
        />

        {/* Ambient gold floating dust */}
        <Particles count={isMobile ? 50 : 150} reducedMotion={prefersReducedMotion} />

        {/* Rising ember sparks field */}
        <EmberSparks count={isMobile ? 30 : 80} reducedMotion={prefersReducedMotion} />

        {/* Floating 3D chessboard with pieces */}
        <FloatingBoardGroup reducedMotion={prefersReducedMotion} />

        {/* Camera follows scroll */}
        <CameraRig reducedMotion={prefersReducedMotion} />

        {/* Dev orbit controls */}
        {isDev && <OrbitControls enableDamping dampingFactor={0.05} />}
      </Canvas>
    </div>
  );
};

export default HeroScene;
