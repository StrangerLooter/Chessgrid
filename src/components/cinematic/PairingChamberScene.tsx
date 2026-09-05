import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import type { Player } from '../../types/tournament';
import { soundEffects } from '../../utils/soundEffects';

type PairingState = 'idle' | 'shuffling' | 'revealing' | 'confirmed';

interface PairResult {
  white: Player | null;
  black: Player | null;
}

/* ── Single pairing row ── */
const PairingRow: React.FC<{
  pair: PairResult;
  index: number;
  isVisible: boolean;
  matchNum: number;
}> = ({ pair, index, isVisible, matchNum }) => {
  const [isMounted, setIsMounted] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setIsMounted(true), index * 60);
      return () => clearTimeout(timeout);
    } else {
      setIsMounted(false);
    }
  }, [isVisible, index]);

  if (!pair.white && !pair.black) return null;

  const isBye = !pair.white || !pair.black;

  return (
    <div
      ref={rowRef}
      className="cg-pairing-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 60px 1fr',
        gap: '0.75rem',
        alignItems: 'center',
        opacity: isMounted ? 1 : 0,
        transform: isMounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* White player */}
      <div
        className="cg-pairing-player"
        style={{
          background: 'rgba(10,10,11,0.7)',
          border: '1px solid rgba(245,240,232,0.1)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span style={{ fontSize: '1.2rem', color: 'var(--cg-ivory)', opacity: 0.7 }}>♔</span>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: 'var(--cg-ivory)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {pair.white?.name ?? 'BYE'}
          </p>
          {pair.white && (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                color: 'rgba(200,192,174,0.4)',
                margin: '0.15rem 0 0',
                textTransform: 'uppercase',
              }}
            >
              {pair.white.course}
            </p>
          )}
        </div>
      </div>

      {/* VS badge */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            color: 'rgba(200,192,174,0.3)',
            marginBottom: '0.15rem',
            textTransform: 'uppercase',
          }}
        >
          M{String(matchNum).padStart(2, '0')}
        </div>
        <div
          style={{
            width: '44px',
            height: '44px',
            margin: '0 auto',
            border: `1px solid ${isBye ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-stat)',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
            color: isBye ? 'rgba(200,192,174,0.25)' : 'var(--cg-gold)',
            background: 'rgba(201,168,76,0.04)',
          }}
        >
          {isBye ? '—' : 'VS'}
        </div>
      </div>

      {/* Black player */}
      <div
        className="cg-pairing-player"
        style={{
          background: 'rgba(10,10,11,0.7)',
          border: '1px solid rgba(201,168,76,0.08)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexDirection: 'row-reverse',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span style={{ fontSize: '1.2rem', color: 'rgba(60,40,10,0.9)', filter: 'drop-shadow(0 0 4px rgba(201,168,76,0.3))' }}>♚</span>
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: 'var(--cg-ivory)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {pair.black?.name ?? 'BYE'}
          </p>
          {pair.black && (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                color: 'rgba(200,192,174,0.4)',
                margin: '0.15rem 0 0',
                textTransform: 'uppercase',
              }}
            >
              {pair.black.course}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Orbiting player tokens (pre-shuffle visual) ── */
const OrbitingPieces: React.FC<{ players: Player[]; isAnimating: boolean }> = ({
  players,
  isAnimating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const displayPlayers = players.slice(0, 12);
  const radius = Math.min(140, Math.max(80, displayPlayers.length * 10));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: `${radius * 2 + 80}px`,
        height: `${radius * 2 + 80}px`,
        margin: '0 auto',
      }}
    >
      {/* Central chessboard icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '72px',
          height: '72px',
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'rgba(10,10,11,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          animation: isAnimating ? 'rotateChess 3s linear infinite' : 'none',
        }}
      >
        ♚
      </div>

      {/* Orbiting pieces */}
      {displayPlayers.map((player, i) => {
        const angle = (i / displayPlayers.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const x = radius + Math.cos(rad) * radius;
        const y = radius + Math.sin(rad) * radius;
        const pieceChars = ['♟', '♞', '♜', '♝'];
        const piece = pieceChars[i % 4];

        return (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              animation: isAnimating
                ? `orbit ${3 + (i % 3) * 0.5}s linear infinite`
                : 'none',
              animationDelay: `${i * -0.3}s`,
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                fontSize: '1.1rem',
                color: player.status === 'active' ? 'var(--cg-emerald-bright)' : 'var(--cg-ivory-dim)',
                filter: isAnimating ? 'drop-shadow(0 0 8px rgba(201,168,76,0.6))' : 'none',
                transition: 'filter 0.3s ease',
              }}
            >
              {piece}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.45rem',
                color: 'rgba(200,192,174,0.35)',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}
            >
              {player.name.split(' ')[0]}
            </div>
          </div>
        );
      })}

      {/* Connecting ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          border: '1px solid rgba(201,168,76,0.1)',
          borderRadius: '50%',
          animation: isAnimating ? 'pulseSlow 2s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
};

/* ── Main Pairing Chamber Scene ── */
export const PairingChamberScene: React.FC = () => {
  const { players, shuffleAndPairPlayers, confirmPairings, settings, matches } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [pairingState, setPairingState] = useState<PairingState>('idle');
  const [pairings, setPairings] = useState<PairResult[]>([]);
  const [shuffleLabel, setShuffleLabel] = useState('SHUFFLE PLAYERS');
  const [isRevealed, setIsRevealed] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const shuffleBtnRef = useRef<HTMLButtonElement>(null);
  const labelIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const eligiblePlayers = players.filter(p => p.status === 'active' || p.status === 'registered');
  const hasPairings = matches.length > 0 || pairings.length > 0;

  // Reveal animation when section is active
  useEffect(() => {
    if (waypoint === 'pairing' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (headerRef.current) {
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          gsap.set(headerRef.current.querySelectorAll('[data-animate]'), { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            headerRef.current.querySelectorAll('[data-animate]'),
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
          );
        }
      }
    }
    if (waypoint === 'players' || waypoint === 'hero' || waypoint === 'tournament') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed]);

  // Shuffling label animation
  const startLabelCycle = useCallback(() => {
    const names = eligiblePlayers.map(p => p.name.toUpperCase());
    let idx = 0;
    labelIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % names.length;
      setShuffleLabel(names[idx]);
      soundEffects.playShuffleClick();
    }, 85);
  }, [eligiblePlayers]);

  const stopLabelCycle = useCallback(() => {
    if (labelIntervalRef.current) {
      clearInterval(labelIntervalRef.current);
      labelIntervalRef.current = null;
    }
    setShuffleLabel('SHUFFLE PLAYERS');
  }, []);

  useEffect(() => {
    return () => { if (labelIntervalRef.current) clearInterval(labelIntervalRef.current); };
  }, []);

  const handleShuffle = useCallback(() => {
    if (pairingState === 'shuffling' || eligiblePlayers.length < 2) return;

    setPairingState('shuffling');
    setPairings([]);
    startLabelCycle();

    // Shuffle for dramatic effect (2.5s), then show results
    setTimeout(() => {
      stopLabelCycle();
      setPairingState('revealing');
      const result = shuffleAndPairPlayers(false);
      setPairings(result);
      soundEffects.playPieceMove();
      setShuffleLabel('PAIRINGS LOCKED');
    }, 2500);
  }, [pairingState, eligiblePlayers.length, shuffleAndPairPlayers, startLabelCycle, stopLabelCycle]);

  const handleConfirm = useCallback(() => {
    if (pairings.length === 0) return;
    confirmPairings(pairings);
    soundEffects.playVictoryChime();
    setPairingState('confirmed');
    setShuffleLabel('TOURNAMENT UNDERWAY');
  }, [pairings, confirmPairings]);

  const handleReset = useCallback(() => {
    setPairingState('idle');
    setPairings([]);
    setShuffleLabel('SHUFFLE PLAYERS');
  }, []);

  const matchCount = pairings.filter(p => p.white && p.black).length;
  const roundName = settings.currentRoundIndex === 0
    ? `ROUND OF ${eligiblePlayers.length}`
    : `ROUND ${settings.currentRoundIndex + 1}`;

  return (
    <div
      id="cg-pairing-chamber"
      style={{
        minHeight: '100vh',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem) 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(30,79,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Diagonal grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(-45deg, rgba(201,168,76,0.015) 0px, rgba(201,168,76,0.015) 1px, transparent 1px, transparent 40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Section Header */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div
          data-animate
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))',
            margin: '0 auto 1.5rem',
            opacity: 0,
          }}
        />

        <p data-animate className="cg-label-gold" style={{ marginBottom: '0.75rem', opacity: 0 }}>
          ⇌ &nbsp; PAIRING ENGINE &nbsp; ⇌
        </p>

        <h2 data-animate className="cg-section-title" style={{ margin: '0 0 0.5rem', opacity: 0 }}>
          THE PAIRING CHAMBER
        </h2>

        <div data-animate className="cg-gold-line-full" style={{ maxWidth: '200px', margin: '1rem auto', opacity: 0 }} />

        <p
          data-animate
          className="cg-body"
          style={{ maxWidth: '480px', margin: '1rem auto 0', opacity: 0 }}
        >
          {eligiblePlayers.length >= 2
            ? `${eligiblePlayers.length} players await their fate. Initiate the draw to assign opponents.`
            : 'Register at least 2 active players to begin the draw.'}
        </p>
      </div>

      {/* Main chamber layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: eligiblePlayers.length > 0 ? 'auto 1fr' : '1fr',
          gap: '3rem',
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'start',
        }}
      >
        {/* Left — Orbit visualization */}
        {eligiblePlayers.length > 0 && (
          <div
            style={{
              opacity: isRevealed ? 1 : 0,
              transition: 'opacity 0.6s 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <OrbitingPieces
              players={eligiblePlayers}
              isAnimating={pairingState === 'shuffling'}
            />

            {/* Player count badges */}
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-gold)', lineHeight: 1 }}>
                  {eligiblePlayers.length}
                </div>
                <p className="cg-label" style={{ margin: '0.2rem 0 0', opacity: 0.5 }}>PLAYERS</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-emerald-bright)', lineHeight: 1 }}>
                  {Math.floor(eligiblePlayers.length / 2)}
                </div>
                <p className="cg-label" style={{ margin: '0.2rem 0 0', opacity: 0.5 }}>MATCHES</p>
              </div>
            </div>
          </div>
        )}

        {/* Right — Controls + Results */}
        <div
          style={{
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.6s 0.4s ease',
          }}
        >
          {/* Round label */}
          <p className="cg-label-gold" style={{ marginBottom: '1.5rem' }}>
            {pairingState === 'confirmed' ? '✓ PAIRINGS CONFIRMED' : roundName}
          </p>

          {/* State: already has matches */}
          {hasPairings && pairingState === 'idle' && matches.length > 0 && (
            <div
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(34,166,122,0.06)',
                border: '1px solid rgba(34,166,122,0.2)',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'var(--cg-emerald-bright)',
                  margin: 0,
                  letterSpacing: '0.05em',
                }}
              >
                ✓ &nbsp; {matches.length} match{matches.length !== 1 ? 'es' : ''} already generated for this round.
                Use the Command Center to manage them.
              </p>
            </div>
          )}

          {/* Shuffle button */}
          {pairingState !== 'confirmed' && (
            <button
              ref={shuffleBtnRef}
              onClick={handleShuffle}
              disabled={pairingState === 'shuffling' || eligiblePlayers.length < 2}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '1.1rem 2rem',
                background: pairingState === 'shuffling'
                  ? 'rgba(201,168,76,0.08)'
                  : pairingState === 'revealing'
                  ? 'rgba(34,166,122,0.1)'
                  : 'linear-gradient(135deg, rgba(138,112,53,0.3), rgba(201,168,76,0.15))',
                border: `1px solid ${pairingState === 'revealing' ? 'rgba(34,166,122,0.4)' : 'rgba(201,168,76,0.35)'}`,
                color: pairingState === 'revealing' ? 'var(--cg-emerald-bright)' : 'var(--cg-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: eligiblePlayers.length < 2 ? 'not-allowed' : 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: pairingState === 'shuffling'
                  ? '0 0 30px -8px rgba(201,168,76,0.5)'
                  : '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                marginBottom: '1rem',
                animation: pairingState === 'shuffling' ? 'pulseGold 0.8s ease-in-out infinite' : 'none',
                opacity: eligiblePlayers.length < 2 ? 0.4 : 1,
              }}
            >
              <span
                style={{
                  fontSize: '1rem',
                  display: 'inline-block',
                  animation: pairingState === 'shuffling' ? 'rotateChess 0.5s linear infinite' : 'none',
                }}
              >
                ⇌
              </span>
              {shuffleLabel}
            </button>
          )}

          {/* Confirm pairings button */}
          {pairingState === 'revealing' && pairings.length > 0 && (
            <button
              onClick={handleConfirm}
              aria-label={`Confirm ${matchCount} pairings and create tournament round`}
              className="cg-btn cg-btn-emerald"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
            >
              ✓ &nbsp; CONFIRM {matchCount} PAIRINGS
            </button>
          )}

          {/* Reset button */}
          {(pairingState === 'revealing' || pairingState === 'confirmed') && (
            <button
              onClick={handleReset}
              aria-label="Reset and reshuffle tournament pairings"
              className="cg-btn cg-btn-ghost"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.6rem', padding: '0.5rem 1rem' }}
            >
              ↺ &nbsp; RESHUFFLE
            </button>
          )}

          {/* Confirmed state message */}
          {pairingState === 'confirmed' && (
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(34,166,122,0.06)',
                border: '1px solid rgba(34,166,122,0.25)',
                marginTop: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>♛</div>
              <p className="cg-label-gold" style={{ margin: '0 0 0.25rem' }}>DRAW COMPLETE</p>
              <p className="cg-body" style={{ margin: 0, fontSize: '0.78rem' }}>
                {matchCount} matches created for {roundName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pairings list */}
      {(pairingState === 'revealing' || pairingState === 'confirmed') && pairings.length > 0 && (
        <div
          style={{
            maxWidth: '800px',
            margin: '3rem auto 0',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(201,168,76,0.12)',
            }}
          >
            <p className="cg-label-gold" style={{ margin: 0 }}>
              {roundName} — {matchCount} MATCHES
            </p>
            <p className="cg-label" style={{ margin: 0, opacity: 0.5 }}>
              WHITE · VS · BLACK
            </p>
          </div>

          {/* Pairing rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pairings.map((pair, i) => (
              <PairingRow
                key={i}
                pair={pair}
                index={i}
                isVisible={pairingState === 'revealing' || pairingState === 'confirmed'}
                matchNum={i + 1}
              />
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem 1.5rem',
              background: 'rgba(10,10,11,0.6)',
              border: '1px solid rgba(201,168,76,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <p className="cg-label" style={{ margin: '0 0 0.15rem', opacity: 0.5 }}>DRAW SUMMARY</p>
              <p
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  color: 'var(--cg-ivory)',
                  margin: 0,
                }}
              >
                {roundName} · {matchCount} MATCHES CREATED
              </p>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-stat)',
                fontSize: '2.5rem',
                color: 'var(--cg-gold)',
                opacity: 0.6,
                lineHeight: 1,
              }}
            >
              {matchCount}
            </div>
          </div>
        </div>
      )}

      {/* Bottom separator */}
      <div style={{ marginTop: '4rem', opacity: isRevealed ? 0.25 : 0, transition: 'opacity 0.5s ease' }}>
        <div className="cg-gold-line-full" />
      </div>
    </div>
  );
};

export default PairingChamberScene;
