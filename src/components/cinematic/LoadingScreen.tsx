import React, { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  'INITIALIZING TOURNAMENT...',
  'LOADING ARENA...',
  'PLACING PIECES...',
  'ESTABLISHING BOARD...',
  'ENTERING THE REALM...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState(LOADING_STEPS[0]);
  const [isExiting, setIsExiting] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 3200; // ms total load time

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      // Update step text
      const stepIdx = Math.min(
        Math.floor((pct / 100) * LOADING_STEPS.length),
        LOADING_STEPS.length - 1
      );
      setStepText(LOADING_STEPS[stepIdx]);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Slight pause at 100%, then exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  const barFill = Math.floor(progress / 100 * 16);
  const barEmpty = 16 - barFill;
  const barStr = '█'.repeat(barFill) + '░'.repeat(barEmpty);

  return (
    <div
      id="cg-loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--cg-obsidian)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Scan line effect */}
      <div className="cg-scan-line" />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Corner decorators */}
      {[
        { top: '2rem', left: '2rem', borderTop: '1px solid', borderLeft: '1px solid' },
        { top: '2rem', right: '2rem', borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: '2rem', left: '2rem', borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: '2rem', right: '2rem', borderBottom: '1px solid', borderRight: '1px solid' },
      ].map((style, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderColor: 'rgba(201,168,76,0.3)',
            ...style,
          }}
        />
      ))}

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          textAlign: 'center',
          padding: '0 2rem',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* Chess piece icon */}
        <div
          className="animate-float"
          style={{
            fontSize: '3rem',
            lineHeight: 1,
            opacity: 0.7,
            filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))',
          }}
        >
          ♛
        </div>

        {/* CHESSGRID wordmark */}
        <div>
          <h1
            className="animate-glow-text animate-flicker"
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              fontWeight: 300,
              letterSpacing: '0.35em',
              color: 'var(--cg-ivory)',
              margin: 0,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            CHESSGRID
          </h1>
          <div
            className="cg-gold-line-full"
            style={{ marginTop: '0.75rem', opacity: 0.5 }}
          />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.35em',
              color: 'var(--cg-gold)',
              margin: '0.6rem 0 0',
              textTransform: 'uppercase',
            }}
          >
            THE DIGITAL ARENA FOR CHESS TOURNAMENTS
          </p>
        </div>

        {/* Status text */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            color: 'var(--cg-ivory-dim)',
            margin: 0,
            minHeight: '1.2em',
          }}
        >
          {stepText}
        </p>

        {/* Progress bar container */}
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mono progress indicator */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--cg-gold)',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{barStr}</span>
            <span style={{ color: 'var(--cg-ivory-dim)' }}>{Math.round(progress)}%</span>
          </div>

          {/* Visual bar */}
          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'rgba(201,168,76,0.12)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--cg-gold-dim), var(--cg-gold), var(--cg-gold-bright))',
                borderRadius: '2px',
                transition: 'width 0.1s linear',
                boxShadow: '0 0 12px rgba(201,168,76,0.6)',
              }}
            />
          </div>
        </div>

        {/* Stats tagline */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {[
            { num: '64', label: 'PLAYERS' },
            { num: '32', label: 'MATCHES' },
            { num: '1', label: 'CHAMPION' },
          ].map(({ num, label }, i) => (
            <div key={i} style={{ textAlign: 'center', opacity: progress > 30 ? 1 : 0, transition: `opacity 0.6s ease ${i * 0.15}s` }}>
              <div
                style={{
                  fontFamily: 'var(--font-stat)',
                  fontSize: '1.75rem',
                  color: 'var(--cg-gold)',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.2em',
                  color: 'var(--cg-ivory-dim)',
                  marginTop: '0.25rem',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
