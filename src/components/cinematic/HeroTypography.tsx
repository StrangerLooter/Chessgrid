import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';

interface HeroTypographyProps {
  onEnter: () => void;
  onOpenNewTournament?: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ onEnter, onOpenNewTournament }) => {
  const { settings, players, stats, setIsProjectorMode } = useTournament();
  const containerRef = useRef<HTMLDivElement>(null);
  const chessGridRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (chessGridRef.current) gsap.set(chessGridRef.current, { opacity: 1, y: 0, letterSpacing: '0.2em' });
      if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 1, y: 0 });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1 });
      if (tickerRef.current) gsap.set(tickerRef.current, { opacity: 1, y: 0 });
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.4 });
    tl.fromTo(
      chessGridRef.current,
      { opacity: 0, y: 60, letterSpacing: '0.45em' },
      { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 1.3, ease: 'power3.out' }
    )
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      tickerRef.current,
      { opacity: 0, scale: 0.95, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.2'
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={containerRef}
      id="cg-hero-typography"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '0 1.5rem',
        textAlign: 'center',
      }}
    >
      {/* Vertical decorative line */}
      <div
        style={{
          width: '1px',
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))',
          marginBottom: '1rem',
        }}
      />

      {/* Eyebrow */}
      <div className="cg-eyebrow" style={{ marginBottom: '1rem' }}>
        <span className="dot dot-ember" aria-hidden="true" />
        <span>
          GLOBAL TOURNAMENT PLATFORM • {settings.name?.toUpperCase() || 'CHESSGRID ARENA'}
        </span>
      </div>

      {/* CHESSGRID wordmark */}
      <div className="cg-mask-line rv-in" style={{ margin: 0 }}>
        <h1
          ref={chessGridRef}
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            fontWeight: 300,
            letterSpacing: '0.22em',
            color: 'var(--cg-ivory)',
            margin: 0,
            lineHeight: 0.95,
            opacity: 0,
            textShadow: '0 0 80px rgba(201,168,76,0.3)',
          }}
        >
          CHESSGRID
        </h1>
      </div>

      {/* Gold divider */}
      <div
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)',
          margin: '1rem auto',
        }}
      />

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          fontFamily: 'var(--font-cinematic)',
          fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: 'var(--cg-gold-bright)',
          margin: '0 0 0.4rem',
          textTransform: 'uppercase',
          opacity: 0,
        }}
      >
        The Digital Arena for Chess Tournaments
      </p>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.72rem',
          letterSpacing: '0.18em',
          color: 'rgba(200,192,174,0.7)',
          maxWidth: '560px',
          margin: '0 auto 1.5rem',
          textTransform: 'uppercase',
          opacity: 0,
        }}
      >
        Enterprise-grade tournament orchestration, real-time 3D brackets, live digital clocks & broadcast presentation for organizers worldwide.
      </p>

      {/* Live Tournament Ticker HUD */}
      <div
        ref={tickerRef}
        className="mb-6 pointer-events-auto"
        style={{
          opacity: 0,
          background: 'rgba(17, 17, 20, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          borderRadius: '9999px',
          padding: '0.4rem 1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(201, 168, 76, 0.1)',
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--cg-emerald-bright)] animate-ping" />
            <span className="text-[var(--cg-emerald-bright)] font-bold">
              {stats.liveMatchesCount > 0 ? `${stats.liveMatchesCount} BOARDS LIVE` : 'ARENA READY'}
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="text-[var(--cg-ivory)]">
            <strong style={{ color: 'var(--cg-gold)' }}>{players.length}</strong> / {settings.totalPlayers} SEEDS
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="text-[rgba(200,192,174,0.8)]">
            {settings.defaultTimeControl.label}
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="text-[var(--cg-gold-bright)]">
            {Math.log2(settings.totalPlayers)} ROUND KNOCKOUT
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div
        ref={ctaRef}
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
          opacity: 0,
          marginBottom: '2rem',
        }}
      >
        <button
          className="cg-btn cg-btn-primary"
          onClick={onEnter}
          id="cg-enter-tournament-btn"
          aria-label="Enter tournament management command center"
          style={{ minWidth: '180px' }}
        >
          ♟ &nbsp; Command Center
        </button>

        {onOpenNewTournament && (
          <button
            className="cg-btn cg-btn-ghost"
            onClick={onOpenNewTournament}
            aria-label="Create a new tournament"
          >
            ✨ &nbsp; Create Tournament
          </button>
        )}

        <button
          className="cg-btn cg-btn-ghost text-[var(--cg-gold)] border-[rgba(201,168,76,0.3)]"
          onClick={() => setIsProjectorMode(true)}
          aria-label="Launch projector stage mode"
        >
          📺 &nbsp; Projector Mode
        </button>
      </div>

      {/* Bottom Chapter Waypoint Chips */}
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          pointerEvents: 'all',
          padding: '0 1rem',
        }}
      >
        <div className="cg-chapters">
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="num">01</span>
            <div className="tx">
              <b>THE ARENA</b>
              <p>{players.length || settings.totalPlayers} Contenders, 1 Crown</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 2.5, behavior: 'smooth' })}
          >
            <span className="num">02</span>
            <div className="tx">
              <b>CONTENDERS</b>
              <p>Player Roster</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 4, behavior: 'smooth' })}
          >
            <span className="num">03</span>
            <div className="tx">
              <b>PAIRINGS</b>
              <p>Chamber of Fate</p>
            </div>
          </button>
          <button
            className="cg-chip"
            onClick={() => window.scrollTo({ top: window.innerHeight * 5.5, behavior: 'smooth' })}
          >
            <span className="num">04</span>
            <div className="tx">
              <b>BRACKET</b>
              <p>The Path to Glory</p>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroTypography;
