import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CinematicVideoBackground — High-Velocity Adaptive Direct-DOM Scrub Engine
 *
 * Performance Architecture:
 * 1. Direct ScrollTrigger Hook: Completely bypasses React re-render cycles during scroll gestures.
 * 2. Dynamic Velocity-Adaptive Lerping:
 *    - Slow scrolling: fluid cinematic lerp (factor 0.28).
 *    - Rapid flick/fast scrolling: accelerates to 0.95 (instant 1:1 cursor tracking with zero drag lag).
 * 3. Hardware Decoder Seek Coalescing:
 *    - Drops intermediate sub-frame seeks when GPU is busy.
 *    - Rate-limits discrete hardware seeks to prevent GPU video decoder queue overflow.
 * 4. Ultra-Fast Scroll Motion Blur:
 *    - Smooth cinematic whip-pan filter applied during ultra-high velocity scrubs.
 * 5. Adaptive Idle Sleep: Zero CPU/GPU decode cycles when resting.
 */
export const CinematicVideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Real-time tracking refs (Zero React State Overhead)
  const targetTimeRef = useRef<number>(0);
  const smoothTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekRef = useRef<number | null>(null);
  const lastSeekTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isBlurActiveRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let trigger: ScrollTrigger | null = null;

    // Direct hardware seek dispatcher with decoder coalescing
    const executeSeek = (targetTime: number, isHighVelocity: boolean) => {
      if (!video || isNaN(targetTime)) return;
      const now = performance.now();

      // If GPU video decoder is currently seeking or was dispatched < 24ms ago, coalesce target
      if (video.seeking || isSeekingRef.current || (now - lastSeekTimeRef.current < 24)) {
        pendingSeekRef.current = targetTime;
        return;
      }

      // Skip negligible changes (< 15ms)
      if (Math.abs(video.currentTime - targetTime) < 0.015) {
        return;
      }

      isSeekingRef.current = true;
      lastSeekTimeRef.current = now;

      try {
        if (isHighVelocity && 'fastSeek' in video && typeof (video as any).fastSeek === 'function') {
          (video as any).fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
      } catch {
        video.currentTime = targetTime;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (pendingSeekRef.current !== null) {
        const nextTarget = pendingSeekRef.current;
        pendingSeekRef.current = null;
        executeSeek(nextTarget, Math.abs(velocityRef.current) > 1500);
      }
    };

    // Velocity-adaptive lerp animation loop
    const scrubLoop = () => {
      if (video && video.readyState >= 2 && video.duration) {
        const diff = targetTimeRef.current - smoothTimeRef.current;
        const absVelocity = Math.abs(velocityRef.current);

        // Dynamic Lerp Factor: Ramps from 0.28 up to 0.95 based on scroll velocity
        let lerpFactor = 0.28;
        if (absVelocity > 2500) {
          lerpFactor = 0.95; // Instant follow at max speed
        } else if (absVelocity > 1000) {
          lerpFactor = 0.65;
        } else if (absVelocity > 400) {
          lerpFactor = 0.45;
        }

        // Apply Motion Blur at high velocity for cinematic fluidity
        if (absVelocity > 1800 && !isBlurActiveRef.current) {
          isBlurActiveRef.current = true;
          video.style.filter = 'blur(1.2px) contrast(1.05)';
        } else if (absVelocity < 600 && isBlurActiveRef.current) {
          isBlurActiveRef.current = false;
          video.style.filter = 'none';
        }

        if (Math.abs(diff) > 0.003) {
          smoothTimeRef.current += diff * lerpFactor;
          executeSeek(smoothTimeRef.current, absVelocity > 1500);
          animFrameRef.current = requestAnimationFrame(scrubLoop);
        } else {
          smoothTimeRef.current = targetTimeRef.current;
          executeSeek(smoothTimeRef.current, false);
          animFrameRef.current = null; // Enter idle sleep
        }
      } else {
        animFrameRef.current = requestAnimationFrame(scrubLoop);
      }
    };

    const wakeScrubLoop = () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(scrubLoop);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration) {
        const currentProgress = trigger ? (trigger as ScrollTrigger).progress : 0;
        const initialTarget = currentProgress * (video.duration - 0.05);
        targetTimeRef.current = initialTarget;
        smoothTimeRef.current = initialTarget;
        video.currentTime = initialTarget;
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Attach high-frequency Direct ScrollTrigger Controller
    const initTrigger = setTimeout(() => {
      trigger = ScrollTrigger.create({
        trigger: '#cg-cinematic-container',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (!video.duration || isNaN(video.duration)) return;
          const safeDuration = Math.max(0, video.duration - 0.05);
          targetTimeRef.current = Math.min(safeDuration, Math.max(0, self.progress * safeDuration));
          velocityRef.current = self.getVelocity();
          wakeScrubLoop();
        },
      });
    }, 80);

    return () => {
      clearTimeout(initTrigger);
      trigger?.kill();
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="cg-cinematic-video-layer"
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
      {/* Hardware-accelerated persistent video with adaptive motion filtering */}
      <video
        ref={videoRef}
        src="/Create_one_continuous_cinemati.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.88,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'contents, filter',
          transition: 'filter 0.2s ease-out',
        }}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
      />

      {/* Cinematic Ambient Contrast & Vignette Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10, 10, 11, 0.18) 0%, rgba(10, 10, 11, 0.55) 75%, rgba(10, 10, 11, 0.85) 100%)',
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
    </div>
  );
};

export default CinematicVideoBackground;
