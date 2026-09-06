import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from '../../context/ScrollContext';

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
   Particle System (Ambient Golden Dust)
   ──────────────────────────────────────────────────────── */
const Particles: React.FC<{ count?: number; reducedMotion?: boolean }> = ({ count = 120, reducedMotion = false }) => {
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
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
};

/* ────────────────────────────────────────────────────────
   Rising Ember Sparks System
   ──────────────────────────────────────────────────────── */
const EmberSparks: React.FC<{ count?: number; reducedMotion?: boolean }> = ({ count = 60, reducedMotion = false }) => {
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
      const t = pct / 15;
      return {
        x: 0,
        y: 4 - t * 2,
        z: 14 - t * 3,
        lookY: 1.5 - t * 0.5,
      };
    } else if (pct < 30) {
      const t = (pct - 15) / 15;
      return {
        x: t * 2,
        y: 2 - t * 1.5,
        z: 11 - t * 4,
        lookY: 1 - t * 0.8,
      };
    } else if (pct < 45) {
      const t = (pct - 30) / 15;
      return {
        x: Math.sin(t * Math.PI * 0.5) * 8,
        y: 3 + t,
        z: 7 + t * 3,
        lookY: 0,
      };
    } else {
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
      className="relative w-full h-full overflow-hidden bg-[#0a0a0b]"
      style={{ width: '100%', height: '100%' }}
    >
      {/* ── Fantasy Chess Kingdom Epic Artwork Backdrop ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 pointer-events-none"
        style={{ 
          backgroundImage: "url('/hero-arena-bg.jpg')",
          filter: 'brightness(0.85) contrast(1.05)',
        }} 
      />

      {/* Atmospheric Vignette & Dark Gradient Overlays (matching reference) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(10,8,7,0.65) 0%, transparent 28%, transparent 72%, rgba(10,8,7,0.65) 100%),
            linear-gradient(to bottom, rgba(10,8,7,0.3) 0%, transparent 35%, rgba(10,8,7,0.7) 100%),
            radial-gradient(ellipse at 50% 45%, transparent 0%, rgba(10,8,7,0.4) 65%, rgba(10,8,7,0.85) 100%)
          `,
        }}
      />

      <Canvas
        id="cg-hero-canvas"
        frameloop={isInView ? 'always' : 'never'}
        shadows={!isMobile}
        camera={{ position: [0, 4, 14], fov: 45, near: 0.1, far: 200 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'default' : 'high-performance',
        }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        {/* Ambient base lighting */}
        <ambientLight intensity={0.6} color="#d6c7a8" />

        {/* Main key directional light */}
        <directionalLight
          position={[6, 14, 8]}
          intensity={1.8}
          color="#fff6e5"
        />

        {/* Warm golden fill */}
        <pointLight position={[0, -4, 2]} color="#c9a84c" intensity={1.2} distance={18} />

        {/* Cool electric blue rim light */}
        <pointLight position={[-8, 6, -5]} color="#2255ee" intensity={1.0} distance={25} />

        {/* Crimson-ember contour kicker */}
        <pointLight position={[0, 2, -8]} color="#ff5a3c" intensity={0.8} distance={18} />

        {/* Deep starry space backdrop */}
        <Stars
          radius={80}
          depth={50}
          count={isMobile ? 200 : 800}
          factor={2.5}
          saturation={0.1}
          fade
          speed={prefersReducedMotion ? 0 : 0.2}
        />

        {/* Ambient gold floating dust */}
        <Particles count={isMobile ? 40 : 120} reducedMotion={prefersReducedMotion} />

        {/* Rising ember sparks field */}
        <EmberSparks count={isMobile ? 25 : 60} reducedMotion={prefersReducedMotion} />

        {/* Camera follows scroll */}
        <CameraRig reducedMotion={prefersReducedMotion} />

        {/* Dev orbit controls */}
        {isDev && <OrbitControls enableDamping dampingFactor={0.05} />}
      </Canvas>
    </div>
  );
};

export default HeroScene;
