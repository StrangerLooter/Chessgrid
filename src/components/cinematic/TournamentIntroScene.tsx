import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';

export const TournamentIntroScene: React.FC = () => {
  const { settings, players, matches } = useTournament();
  const { waypointProgress, waypoint } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const totalPlayers = players.length || settings.totalPlayers;
  const totalMatches = matches.length || Math.floor(totalPlayers / 2);

  // Trigger entrance animation when this section becomes visible
  useEffect(() => {
    if (waypoint === 'tournament' && waypointProgress > 0.1 && !hasAnimated.current) {
      hasAnimated.current = true;
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(el.querySelectorAll('[data-animate]'), { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          el.querySelectorAll('[data-animate]'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }
    }
    // Reset when scrolling back past this section
    if (waypoint === 'hero' && waypointProgress < 0.5) {
      hasAnimated.current = false;
    }
  }, [waypoint, waypointProgress]);

  const opacity = waypoint === 'hero'
    ? Math.max(0, waypointProgress * 3 - 2) // fade in at end of hero
    : waypoint === 'tournament'
    ? 1
    : waypoint === 'players'
    ? Math.max(0, 1 - waypointProgress * 3)
    : 0;

  const translateY = waypoint === 'hero'
    ? `${(1 - waypointProgress) * 30}px`
    : '0px';

  return (
    <div
      ref={containerRef}
      id="cg-tournament-intro"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        opacity,
        transform: `translateY(${translateY})`,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        padding: '0 1.5rem',
        textAlign: 'center',
      }}
    >
      {/* Round indicator */}
      <p
        data-animate
        className="cg-label-gold"
        style={{ marginBottom: '1rem', opacity: 0 }}
      >
        ◆ &nbsp; {settings.name || 'ChessGrid 2026'} &nbsp; ◆
      </p>

      {/* Giant statistics */}
      <div
        data-animate
        style={{
          display: 'flex',
          gap: 'clamp(2rem, 6vw, 5rem)',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
          opacity: 0,
        }}
      >
        {[
          { num: totalPlayers.toString(), label: 'PLAYERS' },
          { num: totalMatches.toString(), label: 'MATCHES' },
          { num: '1', label: 'CHAMPION' },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div className="cg-stat-number" style={{ lineHeight: 1 }}>{num}</div>
            <div
              style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--cg-gold-dim), transparent)',
                margin: '0.4rem 0',
              }}
            />
            <p className="cg-label" style={{ margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tournament metadata glass card */}
      <div
        data-animate
        className="cg-glass-gold cg-intro-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          opacity: 0,
          borderRadius: '2px',
        }}
      >
        {[
          { label: 'TOURNAMENT', value: settings.name || 'ChessGrid 2026' },
          { label: 'ROUND', value: `Round ${(settings.currentRoundIndex || 0) + 1}` },
          { label: 'DATE', value: settings.date || '2026' },
          { label: 'STATUS', value: (settings.status || 'setup').toUpperCase() },
          { label: 'VENUE', value: settings.venue || 'TBD' },
          { label: 'ORGANIZER', value: settings.organizerName || 'ChessGrid' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'left' }}>
            <p className="cg-label" style={{ margin: '0 0 0.2rem', opacity: 0.6 }}>{label}</p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--cg-ivory)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Continue prompt */}
      <div
        data-animate
        className="animate-scroll"
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0,
        }}
      >
        <p className="cg-label" style={{ opacity: 0.4, margin: 0 }}>CONTINUE</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '1.5px',
                height: '5px',
                background: 'var(--cg-gold)',
                borderRadius: '1px',
                margin: '0 auto',
                opacity: 1 - i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentIntroScene;
