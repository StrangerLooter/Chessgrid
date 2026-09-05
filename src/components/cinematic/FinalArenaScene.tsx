import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import type { Match } from '../../types/tournament';

export const FinalArenaScene: React.FC = () => {
  const { matches, players } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPlayerName = (id: string | null): string => {
    if (!id) return 'TBD';
    return players.find(p => p.id === id)?.name ?? 'TBD';
  };

  // Find the final match (last round)
  const finalMatch = useMemo((): Match | null => {
    if (matches.length === 0) return null;
    const maxRound = Math.max(...matches.map(m => m.roundIndex));
    return matches.find(m => m.roundIndex === maxRound) ?? null;
  }, [matches]);

  // Reveal animation
  useEffect(() => {
    if (waypoint === 'final' && waypointProgress > 0.15 && !isRevealed) {
      setIsRevealed(true);
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll('[data-animate]'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
        );
      }
    }
    if (waypoint === 'match' || waypoint === 'bracket') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed]);

  const whiteName = finalMatch ? getPlayerName(finalMatch.whitePlayerId) : 'Player A';
  const blackName = finalMatch ? getPlayerName(finalMatch.blackPlayerId) : 'Player B';

  return (
    <div
      id="cg-final-arena"
      ref={containerRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem, 8vh, 7rem) 2rem',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Dark dramatic background — focused spotlights */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 35%), radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 35%), radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.04) 0%, transparent 30%)',
          pointerEvents: 'none',
        }}
      />

      {/* Vertical decorative line */}
      <div
        data-animate
        style={{
          width: '1px',
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--cg-gold))',
          marginBottom: '2rem',
          opacity: 0,
        }}
      />

      {/* Label */}
      <p
        data-animate
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.4em',
          color: 'var(--cg-gold)',
          margin: '0 0 1rem',
          textTransform: 'uppercase',
          opacity: 0,
        }}
      >
        ♛ &nbsp; THE DECISIVE BATTLE &nbsp; ♛
      </p>

      {/* THE FINAL */}
      <h2
        data-animate
        style={{
          fontFamily: 'var(--font-cinematic)',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: 'var(--cg-ivory)',
          margin: '0 0 1.5rem',
          lineHeight: 0.95,
          textShadow: '0 0 60px rgba(201,168,76,0.2)',
          opacity: 0,
        }}
      >
        THE FINAL
      </h2>

      {/* Gold divider */}
      <div
        data-animate
        style={{
          width: '140px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)',
          marginBottom: '2.5rem',
          opacity: 0,
        }}
      />

      {/* Two players face-off */}
      <div
        data-animate
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          alignItems: 'center',
          maxWidth: '700px',
          width: '100%',
          marginBottom: '2.5rem',
          opacity: 0,
        }}
      >
        {/* White finalist */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '3.5rem',
              color: 'var(--cg-ivory)',
              filter: 'drop-shadow(0 0 20px rgba(245,240,232,0.3))',
              marginBottom: '0.75rem',
              animation: isRevealed ? 'floatSlow 6s ease-in-out infinite' : 'none',
            }}
          >
            ♔
          </div>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--cg-ivory)',
              margin: '0 0 0.25rem',
            }}
          >
            {whiteName}
          </p>
          <p className="cg-label" style={{ margin: 0, opacity: 0.4 }}>WHITE</p>
        </div>

        {/* VS */}
        <div>
          <div
            style={{
              width: '64px',
              height: '64px',
              border: '1px solid rgba(201,168,76,0.35)',
              background: 'rgba(201,168,76,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-stat)',
              fontSize: '1rem',
              letterSpacing: '0.1em',
              color: 'var(--cg-gold)',
              boxShadow: '0 0 25px -8px rgba(201,168,76,0.4)',
            }}
          >
            VS
          </div>
        </div>

        {/* Black finalist */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '3.5rem',
              color: 'var(--cg-gold)',
              filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))',
              marginBottom: '0.75rem',
              animation: isRevealed ? 'floatSlow 6s ease-in-out infinite 1s' : 'none',
            }}
          >
            ♚
          </div>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--cg-ivory)',
              margin: '0 0 0.25rem',
            }}
          >
            {blackName}
          </p>
          <p className="cg-label" style={{ margin: 0, opacity: 0.4 }}>BLACK</p>
        </div>
      </div>

      {/* Match info */}
      {finalMatch && (
        <div
          data-animate
          className="cg-glass-gold"
          style={{
            padding: '1rem 2rem',
            display: 'inline-flex',
            gap: '2rem',
            opacity: 0,
          }}
        >
          {[
            { label: 'STATUS', value: finalMatch.status.toUpperCase() },
            { label: 'TIME CONTROL', value: finalMatch.timeControl.label },
            { label: 'ROUND', value: finalMatch.roundName.toUpperCase() },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p className="cg-label" style={{ margin: '0 0 0.15rem', opacity: 0.5, fontSize: '0.45rem' }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--cg-ivory)', margin: 0, letterSpacing: '0.08em' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {!finalMatch && (
        <p data-animate className="cg-body" style={{ opacity: 0, color: 'rgba(200,192,174,0.35)', maxWidth: '400px' }}>
          The final match will appear here once the tournament reaches its climax.
        </p>
      )}

      {/* Bottom decorative element */}
      <div
        data-animate
        style={{
          marginTop: '3rem',
          width: '1px',
          height: '60px',
          background: 'linear-gradient(to bottom, var(--cg-gold), transparent)',
          opacity: 0,
        }}
      />
    </div>
  );
};

export default FinalArenaScene;
