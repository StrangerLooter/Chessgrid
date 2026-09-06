import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from '../../context/ScrollContext';

export const CinematicVideoBackground: React.FC = () => {
  const { progress } = useScroll(); // 0 to 100
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // High-precision scrub timeline refs
  const targetTimeRef = useRef<number>(0);
  const smoothTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Update target time on scroll progress change
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    
    // Clamp target time strictly within safe playable boundaries
    const safeDuration = Math.max(0, video.duration - 0.05);
    const calculatedTarget = (progress / 100) * safeDuration;
    targetTimeRef.current = Math.min(safeDuration, Math.max(0, calculatedTarget));
  }, [progress, isVideoReady]);

  // Zero-lag seeking coordinator
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const performSeek = (targetTime: number) => {
      if (!video || isNaN(targetTime)) return;

      // If browser decoder is currently seeking, queue the latest target time
      if (video.seeking || isSeekingRef.current) {
        pendingSeekRef.current = targetTime;
        return;
      }

      // Skip negligible sub-frame seeks to avoid saturating GPU decoder
      if (Math.abs(video.currentTime - targetTime) < 0.025) {
        return;
      }

      isSeekingRef.current = true;
      try {
        if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
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
        performSeek(nextTarget);
      }
    };

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      if (video.duration) {
        targetTimeRef.current = (progress / 100) * (video.duration - 0.05);
        smoothTimeRef.current = targetTimeRef.current;
        video.currentTime = targetTimeRef.current;
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Ultra-smooth lerp loop to drive camera seamlessly
    const scrubLoop = () => {
      if (video && video.readyState >= 2) {
        // High-responsiveness lerp (0.18 for instant, snappy follow without jitter)
        const diff = targetTimeRef.current - smoothTimeRef.current;
        if (Math.abs(diff) > 0.005) {
          smoothTimeRef.current += diff * 0.18;
          performSeek(smoothTimeRef.current);
        }
      }
      animFrameRef.current = requestAnimationFrame(scrubLoop);
    };

    animFrameRef.current = requestAnimationFrame(scrubLoop);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [progress]);

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
      {/* Hardware-accelerated persistent video */}
      <video
        ref={videoRef}
        src="/Create_one_continuous_cinemati.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.88,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'contents',
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
