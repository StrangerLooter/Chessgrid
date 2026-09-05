import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import { getRoundNames } from '../../utils/bracketEngine';
import type { Match } from '../../types/tournament';

/* ── Status visual tokens ── */
const MATCH_STATUS_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  completed: { bg: 'rgba(34,166,122,0.06)', border: 'rgba(34,166,122,0.3)', text: '#22a67a', glow: '0 0 12px -4px rgba(34,166,122,0.5)' },
  live:      { bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.45)', text: '#c9a84c', glow: '0 0 16px -4px rgba(201,168,76,0.6)' },
  ready:     { bg: 'rgba(30,79,255,0.06)',   border: 'rgba(30,79,255,0.3)',   text: '#5577ee', glow: '0 0 10px -4px rgba(30,79,255,0.4)' },
  upcoming:  { bg: 'rgba(10,10,11,0.6)',     border: 'rgba(201,168,76,0.1)',   text: 'rgba(200,192,174,0.4)', glow: 'none' },
  cancelled: { bg: 'rgba(10,10,11,0.4)',     border: 'rgba(100,100,100,0.15)', text: 'rgba(150,150,150,0.4)', glow: 'none' },
};

/* ── Match node component ── */
const BracketNode: React.FC<{
  match: Match;
  getPlayerName: (id: string | null) => string;
  index: number;
  isRevealed: boolean;
}> = ({ match, getPlayerName, index, isRevealed }) => {
  const [isHovered, setIsHovered] = useState(false);
  const s = MATCH_STATUS_COLORS[match.status] ?? MATCH_STATUS_COLORS.upcoming;
  const delay = index * 0.04;

  const whiteName = getPlayerName(match.whitePlayerId);
  const blackName = getPlayerName(match.blackPlayerId);
  const winnerName = match.winnerPlayerId ? getPlayerName(match.winnerPlayerId) : null;

  return (
    <div
      id={`cg-bracket-node-${match.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Match ${match.matchNumber}: ${whiteName} vs ${blackName}. Status: ${match.status}${winnerName ? `. Winner: ${winnerName}` : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Scroll toward match arena
          const el = document.getElementById('cg-match-arena');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      style={{
        background: isHovered ? s.bg : 'rgba(10,10,11,0.7)',
        border: `1px solid ${isHovered ? s.border : 'rgba(201,168,76,0.08)'}`,
        padding: '0.6rem 0.75rem',
        minWidth: '160px',
        maxWidth: '200px',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        transition: `all 0.3s ease, opacity 0.5s ${delay}s ease, transform 0.5s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? isHovered ? 'scale(1.04) translateY(-2px)' : 'scale(1)'
          : 'translateY(16px) scale(0.95)',
        boxShadow: isHovered ? s.glow : '0 2px 10px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
    >
      {/* Match number + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.1em',
            color: 'rgba(200,192,174,0.3)',
          }}
        >
          M{String(match.matchNumber).padStart(2, '0')}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.45rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: s.text,
          }}
        >
          {match.status === 'live' ? '● LIVE' : match.status.toUpperCase()}
        </span>
      </div>

      {/* White player */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0',
          borderBottom: '1px solid rgba(201,168,76,0.06)',
          opacity: match.winnerPlayerId === match.blackPlayerId && match.winnerPlayerId ? 0.35 : 1,
        }}
      >
        <span style={{ fontSize: '0.65rem', color: 'var(--cg-ivory)', opacity: 0.5 }}>♔</span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: match.winnerPlayerId === match.whitePlayerId ? 700 : 400,
            color: match.winnerPlayerId === match.whitePlayerId ? 'var(--cg-gold)' : 'var(--cg-ivory)',
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {whiteName}
        </span>
        {match.winnerPlayerId === match.whitePlayerId && (
          <span style={{ fontSize: '0.55rem', color: 'var(--cg-gold)' }}>★</span>
        )}
      </div>

      {/* Black player */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0',
          opacity: match.winnerPlayerId === match.whitePlayerId && match.winnerPlayerId ? 0.35 : 1,
        }}
      >
        <span style={{ fontSize: '0.65rem', color: 'rgba(80,60,20,0.8)' }}>♚</span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: match.winnerPlayerId === match.blackPlayerId ? 700 : 400,
            color: match.winnerPlayerId === match.blackPlayerId ? 'var(--cg-gold)' : 'var(--cg-ivory)',
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {blackName}
        </span>
        {match.winnerPlayerId === match.blackPlayerId && (
          <span style={{ fontSize: '0.55rem', color: 'var(--cg-gold)' }}>★</span>
        )}
      </div>

      {/* Board number if assigned */}
      {match.boardNumber && (
        <div
          style={{
            marginTop: '0.3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: 'rgba(200,192,174,0.25)',
            letterSpacing: '0.1em',
          }}
        >
          BOARD {match.boardNumber}
        </div>
      )}

      {/* Live pulse */}
      {match.status === 'live' && (
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--cg-gold)',
            animation: 'pulseSlow 1.5s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};

/* ── Round column ── */
const RoundColumn: React.FC<{
  roundIndex: number;
  roundName: string;
  matches: Match[];
  getPlayerName: (id: string | null) => string;
  totalRounds: number;
  isRevealed: boolean;
}> = ({ roundIndex, roundName, matches, getPlayerName, totalRounds, isRevealed }) => {
  const isFinal = roundIndex === totalRounds - 1;
  const isSemi = roundName.includes('Semifinal');

  // Cinematic round labels
  const displayName = isFinal ? 'THE FINAL' : isSemi ? 'SEMIFINALS' : roundName.toUpperCase();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isFinal ? '2rem' : isSemi ? '3rem' : '1rem',
        minWidth: '180px',
        position: 'relative',
      }}
    >
      {/* Round label */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <p
          style={{
            fontFamily: isFinal ? 'var(--font-cinematic)' : 'var(--font-sans)',
            fontSize: isFinal ? '1.2rem' : '0.6rem',
            fontWeight: isFinal ? 400 : 700,
            letterSpacing: isFinal ? '0.15em' : '0.2em',
            color: isFinal ? 'var(--cg-gold)' : 'rgba(200,192,174,0.4)',
            textTransform: 'uppercase',
            margin: '0 0 0.25rem',
          }}
        >
          {displayName}
        </p>
        <div
          style={{
            width: isFinal ? '60px' : '30px',
            height: '1px',
            background: isFinal
              ? 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)'
              : 'rgba(201,168,76,0.15)',
            margin: '0 auto',
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: 'rgba(200,192,174,0.25)',
            margin: '0.25rem 0 0',
            letterSpacing: '0.1em',
          }}
        >
          {matches.length} MATCH{matches.length !== 1 ? 'ES' : ''}
        </p>
      </div>

      {/* Match nodes */}
      {matches.map((m, i) => (
        <BracketNode
          key={m.id}
          match={m}
          getPlayerName={getPlayerName}
          index={roundIndex * 4 + i}
          isRevealed={isRevealed}
        />
      ))}
    </div>
  );
};

/* ── Connector lines between rounds (SVG) ── */
const BracketConnectors: React.FC<{
  roundMatchCounts: number[];
  isRevealed: boolean;
}> = ({ roundMatchCounts, isRevealed }) => {
  // We draw simple horizontal + vertical lines between round columns
  // This is a simplified visual connector — not pixel-perfect bracket lines
  if (roundMatchCounts.length < 2) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isRevealed ? 0.25 : 0,
        transition: 'opacity 1s ease',
      }}
    >
      {/* Grid lines pattern — simulates bracket connection structure */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(201,168,76,0.06) 0px, rgba(201,168,76,0.06) 1px, transparent 1px, transparent 80px)',
          opacity: 0.5,
        }}
      />
    </div>
  );
};

/* ── Main Bracket Structure Scene ── */
export const BracketStructureScene: React.FC = () => {
  const { matches, players, settings } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [isRevealed, setIsRevealed] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const roundNames = useMemo(() => getRoundNames(settings.totalPlayers), [settings.totalPlayers]);

  // Group matches by round
  const matchesByRound = useMemo(() => {
    const grouped: Record<number, Match[]> = {};
    matches.forEach(m => {
      if (!grouped[m.roundIndex]) grouped[m.roundIndex] = [];
      grouped[m.roundIndex].push(m);
    });
    return grouped;
  }, [matches]);

  const getPlayerName = (id: string | null): string => {
    if (!id) return 'TBD';
    const p = players.find(pl => pl.id === id);
    return p ? p.name : 'TBD';
  };

  // Stats
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const liveMatches = matches.filter(m => m.status === 'live').length;

  // Reveal animation
  useEffect(() => {
    if (waypoint === 'bracket' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (headerRef.current) {
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          gsap.set(headerRef.current.querySelectorAll('[data-animate]'), { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            headerRef.current.querySelectorAll('[data-animate]'),
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
          );
        }
      }
    }
    if (waypoint === 'players' || waypoint === 'hero' || waypoint === 'tournament' || waypoint === 'pairing') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed]);

  const roundMatchCounts = roundNames.map((_, i) => (matchesByRound[i] || []).length);

  return (
    <div
      id="cg-bracket-structure"
      style={{
        minHeight: '100vh',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1rem, 3vw, 3rem) 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(30,79,255,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Section header */}
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
          ♜ &nbsp; TOURNAMENT STRUCTURE &nbsp; ♜
        </p>

        <h2 data-animate className="cg-section-title" style={{ margin: '0 0 0.5rem', opacity: 0 }}>
          THE BRACKET
        </h2>

        <div data-animate className="cg-gold-line-full" style={{ maxWidth: '200px', margin: '1rem auto', opacity: 0 }} />

        {/* Stats */}
        <div
          data-animate
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '1.25rem',
            flexWrap: 'wrap',
            opacity: 0,
          }}
        >
          {[
            { num: roundNames.length, label: 'ROUNDS' },
            { num: matches.length, label: 'TOTAL MATCHES' },
            { num: completedMatches, label: 'COMPLETED' },
            ...(liveMatches > 0 ? [{ num: liveMatches, label: '● LIVE' }] : []),
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-stat)',
                  fontSize: '2rem',
                  color: label.includes('LIVE') ? 'var(--cg-gold)' : 'var(--cg-ivory)',
                  lineHeight: 1,
                }}
              >
                {num}
              </div>
              <p className="cg-label" style={{ margin: '0.2rem 0 0', opacity: 0.5 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bracket visualization */}
      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ fontSize: '4rem', opacity: 0.15, marginBottom: '1rem' }}>♜</div>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.2rem',
              letterSpacing: '0.08em',
              color: 'rgba(200,192,174,0.35)',
              margin: '0 0 0.5rem',
            }}
          >
            No bracket generated yet
          </p>
          <p className="cg-body" style={{ opacity: 0.4, maxWidth: '400px', margin: '0 auto' }}>
            Return to the Pairing Chamber to generate match pairings, or use the Command Center.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Connectors */}
          <BracketConnectors roundMatchCounts={roundMatchCounts} isRevealed={isRevealed} />

          {/* Horizontal scrollable bracket */}
          <div
            className="cg-touch-scroll"
            style={{
              display: 'flex',
              gap: 'clamp(1rem, 3vw, 3rem)',
              overflowX: 'auto',
              paddingBottom: '2rem',
              position: 'relative',
              zIndex: 1,
              alignItems: 'flex-start',
            }}
          >
            {roundNames.map((name, rIdx) => {
              const roundMatches = matchesByRound[rIdx] ?? [];
              if (roundMatches.length === 0 && rIdx > 0) {
                // Show empty round placeholder
                return (
                  <div
                    key={rIdx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '140px',
                      opacity: isRevealed ? 0.3 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        color: 'rgba(200,192,174,0.25)',
                        textTransform: 'uppercase',
                        margin: '0 0 0.5rem',
                      }}
                    >
                      {name.toUpperCase()}
                    </p>
                    <div
                      style={{
                        width: '100%',
                        height: '80px',
                        border: '1px dashed rgba(201,168,76,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.55rem',
                        color: 'rgba(200,192,174,0.2)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      AWAITING
                    </div>
                  </div>
                );
              }
              return (
                <RoundColumn
                  key={rIdx}
                  roundIndex={rIdx}
                  roundName={name}
                  matches={roundMatches}
                  getPlayerName={getPlayerName}
                  totalRounds={roundNames.length}
                  isRevealed={isRevealed}
                />
              );
            })}

            {/* Champion trophy at the end */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100px',
                opacity: isRevealed ? 0.7 : 0,
                transition: 'opacity 0.8s 0.5s ease',
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  color: 'var(--cg-gold)',
                  filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.4))',
                  marginBottom: '0.5rem',
                }}
              >
                ♛
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  color: 'var(--cg-gold)',
                  margin: 0,
                }}
              >
                CHAMPION
              </p>
            </div>
          </div>

          {/* Scroll hint for horizontal overflow */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              opacity: isRevealed ? 0.3 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <p className="cg-label" style={{ margin: 0, fontSize: '0.45rem' }}>
              ← SCROLL HORIZONTALLY TO VIEW ALL ROUNDS →
            </p>
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

export default BracketStructureScene;
