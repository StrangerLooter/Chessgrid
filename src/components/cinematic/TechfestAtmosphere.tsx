import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

/**
 * TechfestAtmosphere — Interactive WebGL/Canvas Cybernetic Particle & Aura System
 * Inspired by IIT Bombay Techfest & Awwwards Site-of-the-Year Interactive Graphics
 *
 * Features:
 * 1. Interactive Mouse Repulsion & Dynamic Parallax Field
 * 2. Constellation Proximity Link Networking (Dynamic Lines)
 * 3. Radial Ambient Mouse Torch / Cybernetic Aura
 * 4. 60+ FPS Hardware-Accelerated Canvas with Idle Energy Preservation
 */
export const TechfestAtmosphere: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; isActive: boolean }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isActive: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Palette: Metallic Gold, Luminous Gold, Tactical Emerald, Cold White
    const palette = [
      'rgba(232, 196, 90, ', // Gold bright
      'rgba(201, 168, 76, ', // Gold metallic
      'rgba(34, 166, 122, ', // Tactical emerald
      'rgba(245, 240, 232, ', // Ivory white
    ];

    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 45 : 95;
    const particles: Particle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-distribute particles if screen changes significantly
      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          const px = Math.random() * width;
          const py = Math.random() * height;
          const colorPrefix = palette[Math.floor(Math.random() * palette.length)];
          const baseAlpha = 0.25 + Math.random() * 0.55;

          particles.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35 - 0.15, // Gentle upwards cosmic drift
            size: Math.random() * 2.2 + 0.8,
            alpha: baseAlpha,
            baseAlpha,
            color: colorPrefix,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse coordinates for interactive magnetic aura & particle displacement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const connectionDistance = 110;
    const mouseRadius = 140;

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate lerping
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // 1. Draw interactive dynamic mouse torch / Cyber Aura
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        const auraGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        auraGradient.addColorStop(0, 'rgba(201, 168, 76, 0.09)');
        auraGradient.addColorStop(0.4, 'rgba(232, 196, 90, 0.035)');
        auraGradient.addColorStop(1, 'rgba(10, 10, 11, 0)');
        ctx.fillStyle = auraGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Update and draw particles
      const count = particles.length;
      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Cosmic drift
        p.x += p.vx * delta * 60;
        p.y += p.vy * delta * 60;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Pulse brightness
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.18;

        // Interactive mouse repulsion
        if (mouse.isActive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * 2.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.alpha = Math.min(1, p.alpha + force * 0.25);
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.1, Math.min(1, p.alpha))})`;
        ctx.fill();

        // 3. Constellation networking — draw subtle glowing proximity vectors
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cDist < connectionDistance) {
            const lineAlpha = (1 - cDist / connectionDistance) * 0.16 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default TechfestAtmosphere;
