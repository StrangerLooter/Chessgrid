import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceCanvasProps {
  /** Total number of frames in the sequence (default: 240) */
  totalFrames?: number;
  /** Primary frame URL generator */
  getFrameUrl?: (index: number) => string;
  /** Fallback URL generator if primary format fails */
  getFallbackFrameUrl?: (index: number) => string;
  /** Trigger element selector or ref (default: '#cg-cinematic-container') */
  scrollTriggerSelector?: string;
  /** Optional custom class name */
  className?: string;
}

/**
 * ScrollSequenceCanvas — Ultra-Performance Apple-Grade Scrollytelling Canvas
 *
 * Technical Highlights:
 * 1. Preloading: Loads and decodes all 240 frames concurrently into an internal Image array.
 * 2. High-DPI / Retina: Automatically samples window.devicePixelRatio (clamped to 2x for optimal fillrate).
 * 3. Dynamic Cover Fitting: Custom aspect-ratio preservation math inside Canvas 2D context.
 * 4. Velocity-Adaptive Lerping: Transitions from cinematic fluid damping (0.18) to instant follow (0.85) at high scrub speeds.
 * 5. Adaptive Idle Sleep: Consumes 0% CPU/GPU decode cycles when resting.
 * 6. Zero React Re-render Overhead: Scroll progress bypasses React state and communicates directly to the RAF rendering loop.
 */
export const ScrollSequenceCanvas: React.FC<ScrollSequenceCanvasProps> = ({
  totalFrames = 240,
  getFrameUrl = (index) => `/sequence/frame_${String(index).padStart(3, '0')}.avif`,
  getFallbackFrameUrl = (index) => `/sequence/frame_${String(index).padStart(3, '0')}.webp`,
  scrollTriggerSelector = '#cg-cinematic-container',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preloading state for UI loader
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Core render loop refs (Bypasses React renders during scroll)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastRenderedIndexRef = useRef<number>(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const isLoopRunningRef = useRef<boolean>(false);
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  /**
   * Render single image frame onto canvas with pixel-perfect object-fit: cover
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIndex)));
    const img = imagesRef.current[clampedIndex];

    // If target frame isn't loaded yet, find nearest loaded frame
    let renderableImg: HTMLImageElement | null = (img && img.complete && img.naturalWidth > 0) ? img : null;
    if (!renderableImg) {
      for (let offset = 1; offset < 10; offset++) {
        const prev = imagesRef.current[clampedIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          renderableImg = prev;
          break;
        }
        const next = imagesRef.current[clampedIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          renderableImg = next;
          break;
        }
      }
    }

    if (!renderableImg) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = renderableImg.naturalWidth || renderableImg.width;
    const ih = renderableImg.naturalHeight || renderableImg.height;
    if (!iw || !ih) return;

    // Calculate dynamic cover ratio
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const drawW = iw * ratio;
    const drawH = ih * ratio;
    const drawX = (cw - drawW) * 0.5;
    const drawY = (ch - drawH) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(renderableImg, 0, 0, iw, ih, drawX, drawY, drawW, drawH);
    lastRenderedIndexRef.current = clampedIndex;
  }, [totalFrames]);

  /**
   * High-Performance Velocity-Adaptive RAF Scrub Loop
   */
  const runScrubLoop = useCallback(function scrub() {
    const diff = targetFrameRef.current - currentFrameRef.current;
    const absVelocity = Math.abs(velocityRef.current);

    // Adaptive lerp factor: Ramps up dynamically during fast flick scrolls
    let lerpFactor = 0.18;
    if (absVelocity > 2500) {
      lerpFactor = 0.88; // Near-instant tracking during fast scroll
    } else if (absVelocity > 1000) {
      lerpFactor = 0.55;
    } else if (absVelocity > 400) {
      lerpFactor = 0.32;
    }

    if (Math.abs(diff) > 0.005) {
      currentFrameRef.current += diff * lerpFactor;
      drawFrame(currentFrameRef.current);
      animFrameIdRef.current = requestAnimationFrame(scrub);
      isLoopRunningRef.current = true;
    } else {
      // Settle at target frame and enter idle sleep (0% CPU/GPU)
      currentFrameRef.current = targetFrameRef.current;
      drawFrame(currentFrameRef.current);
      animFrameIdRef.current = null;
      isLoopRunningRef.current = false;
    }
  }, [drawFrame]);

  /**
   * Wake the RAF loop if it is asleep
   */
  const wakeLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      animFrameIdRef.current = requestAnimationFrame(runScrubLoop);
    }
  }, [runScrubLoop]);

  /**
   * Update canvas viewport dimensions with Retina High-DPI support
   */
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    dimensionsRef.current = { width, height, dpr };

    const physicalWidth = Math.round(width * dpr);
    const physicalHeight = Math.round(height * dpr);

    if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Redraw active frame immediately on resize
      drawFrame(currentFrameRef.current);
    }
  }, [drawFrame]);

  // ══════════════════════════════════════════════════════════
  // 1. ASYNC PRELOADER ENGINE
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    let isMounted = true;
    const images: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    imagesRef.current = images;

    let loadedCount = 0;
    let initialFrameDrawn = false;

    const handleLoadProgress = () => {
      if (!isMounted) return;
      loadedCount++;
      const progress = Math.round((loadedCount / totalFrames) * 100);
      setLoadProgress(progress);

      // Draw initial frame as soon as frame 0 or 1 is available
      if (!initialFrameDrawn && images[0]?.complete && images[0]?.naturalWidth > 0) {
        initialFrameDrawn = true;
        updateCanvasDimensions();
        drawFrame(0);
      }

      if (loadedCount >= totalFrames) {
        setIsPreloaded(true);
        updateCanvasDimensions();
        drawFrame(0);
      }
    };

    // Load each frame asynchronously
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const primaryUrl = getFrameUrl(i + 1);
      const fallbackUrl = getFallbackFrameUrl ? getFallbackFrameUrl(i + 1) : null;

      img.src = primaryUrl;

      img.onload = () => {
        // Asynchronous decode to avoid freezing main thread
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().catch(() => {}).finally(() => {
            handleLoadProgress();
          });
        } else {
          handleLoadProgress();
        }
      };

      img.onerror = () => {
        // Fallback to secondary format (e.g. .webp if .avif is missing)
        if (fallbackUrl && img.src !== fallbackUrl) {
          img.src = fallbackUrl;
        } else {
          // Progress count anyway to avoid stalling preloader
          handleLoadProgress();
        }
      };

      images[i] = img;
    }

    // Safety timeout: enable scroller after 6s even on slow connections
    const safetyTimer = setTimeout(() => {
      if (isMounted && loadedCount > 10) {
        setIsPreloaded(true);
        updateCanvasDimensions();
        drawFrame(0);
      } else if (loadedCount === 0) {
        setHasError(true);
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [totalFrames, getFrameUrl, getFallbackFrameUrl, updateCanvasDimensions, drawFrame]);

  // ══════════════════════════════════════════════════════════
  // 2. RESIZE LISTENER & HIGH-DPI SCALING
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    updateCanvasDimensions();

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCanvasDimensions();
      }, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [updateCanvasDimensions]);

  // ══════════════════════════════════════════════════════════
  // 3. SCROLLTRIGGER BINDING
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isPreloaded) return;

    let trigger: ScrollTrigger | null = null;

    const initTimeout = setTimeout(() => {
      trigger = ScrollTrigger.create({
        trigger: scrollTriggerSelector,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          // Direct 1:1 scroll progress mapping
          const targetIndex = self.progress * (totalFrames - 1);
          targetFrameRef.current = Math.min(totalFrames - 1, Math.max(0, targetIndex));
          velocityRef.current = self.getVelocity();
          wakeLoop();
        },
      });
    }, 80);

    return () => {
      clearTimeout(initTimeout);
      trigger?.kill();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
        isLoopRunningRef.current = false;
      }
    };
  }, [isPreloaded, totalFrames, scrollTriggerSelector, wakeLoop]);

  return (
    <div
      ref={containerRef}
      id="cg-cinematic-video-layer"
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#0a0a0b',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* High-Performance 60+ FPS Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'contents',
          opacity: 0.92,
        }}
      />

      {/* Fallback to original MP4 video player if sequence is completely unavailable */}
      {hasError && (
        <video
          src="/Create_one_continuous_cinemati.mp4"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
          }}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* Cinematic Ambient Contrast & Vignette Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10, 10, 11, 0.15) 0%, rgba(10, 10, 11, 0.52) 75%, rgba(10, 10, 11, 0.85) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,11,0.5) 0%, transparent 15%, transparent 85%, rgba(10,10,11,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Luxury Preloader Overlay — Displays until all 240 frames are in memory */}
      {!isPreloaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: '2.5rem',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '9999px',
            background: 'rgba(10, 10, 11, 0.88)',
            border: '1px solid rgba(201, 168, 76, 0.25)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(201, 168, 76, 0.15)',
            backdropFilter: 'blur(16px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            opacity: loadProgress === 100 ? 0 : 1,
            transform: loadProgress === 100 ? 'translateY(10px) scale(0.96)' : 'none',
            pointerEvents: 'none',
          }}
        >
          {/* Animated Spinner Ring */}
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid rgba(201, 168, 76, 0.2)',
              borderTopColor: '#e8c45a',
              animation: 'cg-spin 0.8s linear infinite',
            }}
          />

          {/* Progress label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                color: '#e8c45a',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Cinematic Engine: {loadProgress}%
            </span>
            <div
              style={{
                width: '120px',
                height: '3px',
                borderRadius: '2px',
                background: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${loadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #c9a84c, #e8c45a)',
                  transition: 'width 0.1s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inline Keyframes for Spinner */}
      <style>{`
        @keyframes cg-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScrollSequenceCanvas;
