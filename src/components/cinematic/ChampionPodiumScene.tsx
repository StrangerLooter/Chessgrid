import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import { soundEffects } from '../../utils/soundEffects';

export const ChampionPodiumScene: React.FC = () => {
  const { players, matches, settings } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find champion
  const champion = useMemo(() => players.find(p => p.status === 'champion'), [players]);

  // Find final opponent
  const finalMatch = useMemo(() => {
    if (matches.length === 0) return null;
    const maxRound = Math.max(...matches.map(m => m.roundIndex));
    return matches.find(m => m.roundIndex === maxRound && m.status === 'completed') ?? null;
  }, [matches]);

  const getPlayerName = useCallback((id: string | null): string => {
    if (!id) return 'TBD';
    return players.find(p => p.id === id)?.name ?? 'Unknown';
  }, [players]);

  const finalOpponent = useMemo(() => {
    if (!finalMatch || !champion) return null;
    const opponentId = finalMatch.whitePlayerId === champion.id
      ? finalMatch.blackPlayerId
      : finalMatch.whitePlayerId;
    return opponentId ? getPlayerName(opponentId) : null;
  }, [finalMatch, champion, getPlayerName]);

  // Reveal animation
  useEffect(() => {
    if (waypoint === 'champion' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll('[data-animate]'),
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
        );
      }
      if (champion) {
        soundEffects.playVictoryChime();
        try {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#c9a84c', '#e8c45a', '#f5f0e8', '#22a67a'],
          });
        } catch {
          // Ignore
        }
      }
    }
    if (waypoint === 'final' || waypoint === 'match') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed, champion]);

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      id="cg-champion-podium"
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
      {/* Radiant background — golden atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(201,168,76,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />

      {/* Particle-like dots */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(201,168,76,0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          pointerEvents: 'none',
          opacity: isRevealed ? 0.5 : 0,
          transition: 'opacity 2s ease',
        }}
      />

      {champion ? (
        <>
          {/* Crown piece — rising animation */}
          <div
            data-animate
            style={{
              fontSize: 'clamp(4rem, 12vw, 7rem)',
              color: 'var(--cg-gold)',
              filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.6))',
              marginBottom: '1.5rem',
              opacity: 0,
              animation: isRevealed ? 'floatSlow 5s ease-in-out infinite' : 'none',
            }}
          >
            ♛
          </div>

          {/* CHESSGRID CHAMPION */}
          <p
            data-animate
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.45em',
              color: 'var(--cg-gold)',
              margin: '0 0 0.75rem',
              textTransform: 'uppercase',
              opacity: 0,
            }}
          >
            CHESSGRID CHAMPION
          </p>

          {/* Champion name */}
          <h2
            data-animate
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: 'var(--cg-ivory)',
              margin: '0 0 0.5rem',
              lineHeight: 0.95,
              textShadow: '0 0 60px rgba(201,168,76,0.25)',
              opacity: 0,
            }}
          >
            {champion.name.toUpperCase()}
          </h2>

          {/* Gold divider */}
          <div
            data-animate
            style={{
              width: '200px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)',
              margin: '1rem auto 1.5rem',
              opacity: 0,
            }}
          />

          {/* Tournament Winner subtitle */}
          <p
            data-animate
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              letterSpacing: '0.08em',
              color: 'var(--cg-ivory-dim)',
              margin: '0 0 2.5rem',
              opacity: 0,
            }}
          >
            Tournament Winner {new Date().getFullYear()}
          </p>

          {/* Champion stats */}
          <div
            data-animate
            style={{
              display: 'flex',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
              opacity: 0,
            }}
          >
            {[
              { num: champion.wins.toString(), label: 'VICTORIES' },
              { num: champion.matchesPlayed.toString(), label: 'MATCHES PLAYED' },
              { num: champion.draws.toString(), label: 'DRAWS' },
              ...(finalOpponent ? [{ num: finalOpponent, label: 'FINAL OPPONENT' }] : []),
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: label === 'FINAL OPPONENT' ? 'var(--font-cinematic)' : 'var(--font-stat)',
                    fontSize: label === 'FINAL OPPONENT' ? '1.2rem' : '2.5rem',
                    color: 'var(--cg-gold)',
                    lineHeight: 1,
                    letterSpacing: label === 'FINAL OPPONENT' ? '0.06em' : '0.05em',
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: 'rgba(201,168,76,0.15)',
                    margin: '0.35rem 0',
                  }}
                />
                <p className="cg-label" style={{ margin: 0, opacity: 0.5 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Champion details card */}
          <div
            data-animate
            className="cg-glass-gold"
            style={{
              padding: '1.25rem 2rem',
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem 2rem',
              marginBottom: '2.5rem',
              opacity: 0,
            }}
          >
            {[
              { label: 'TOURNAMENT', value: settings.name || 'ChessGrid 2026' },
              { label: 'SEED', value: `#${champion.seed}` },
              { label: 'STATUS', value: 'CHAMPION' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p className="cg-label" style={{ margin: '0 0 0.15rem', opacity: 0.5, fontSize: '0.45rem' }}>{label}</p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--cg-ivory)',
                    margin: 0,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px',
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div
            data-animate
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              opacity: 0,
            }}
          >
            <button
              onClick={handleScrollToTop}
              className="cg-btn cg-btn-ghost"
              style={{ pointerEvents: 'all' }}
            >
              ⌂ VIEW TOURNAMENT
            </button>
            <button
              onClick={handleScrollToTop}
              className="cg-btn cg-btn-primary"
              style={{ pointerEvents: 'all' }}
            >
              ♛ START NEW TOURNAMENT
            </button>
          </div>
        </>
      ) : (
        <>
          {/* No champion yet */}
          <div
            data-animate
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              color: 'rgba(201,168,76,0.2)',
              marginBottom: '1.5rem',
              opacity: 0,
            }}
          >
            ♛
          </div>

          <h2
            data-animate
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: 'rgba(200,192,174,0.35)',
              margin: '0 0 0.75rem',
              opacity: 0,
            }}
          >
            AWAITING THE CHAMPION
          </h2>

          <div
            data-animate
            style={{
              width: '120px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
              margin: '0.75rem auto 1.5rem',
              opacity: 0,
            }}
          />

          <p
            data-animate
            className="cg-body"
            style={{ opacity: 0, color: 'rgba(200,192,174,0.35)', maxWidth: '420px' }}
          >
            The tournament must reach its conclusion before a champion can be crowned.
            Complete all rounds to see the champion celebrated here.
          </p>
        </>
      )}

      {/* Footer credits */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: isRevealed ? 0.3 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.5rem',
            letterSpacing: '0.3em',
            color: 'var(--cg-ivory-dim)',
            margin: '0 0 0.25rem',
            textTransform: 'uppercase',
          }}
        >
          CHESSGRID™ · {new Date().getFullYear()}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.45rem',
            letterSpacing: '0.2em',
            color: 'rgba(200,192,174,0.2)',
            margin: 0,
          }}
        >
          INTER-COLLEGE KNOCKOUT CHESS CHAMPIONSHIP
        </p>
      </div>
    </div>
  );
};

export default ChampionPodiumScene;
