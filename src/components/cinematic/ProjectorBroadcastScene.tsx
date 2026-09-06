import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import { 
  Tv, 
  Maximize2, 
  Radio, 
  Eye, 
  Flame
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

export const ProjectorBroadcastScene: React.FC = () => {
  const { matches, players, announcements, settings, setIsProjectorMode } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Live and ready matches
  const activeMatches = useMemo(() => {
    const live = matches.filter(m => m.status === 'live');
    if (live.length > 0) return live;
    return matches.slice(0, 4);
  }, [matches]);

  const getPlayer = (id: string | null) => {
    if (!id) return null;
    return players.find(p => p.id === id);
  };

  useEffect(() => {
    if (waypoint === 'projector' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out' }
        );
      }
    }
  }, [waypoint, waypointProgress, isRevealed]);

  // Rotate featured board every few seconds
  useEffect(() => {
    if (activeMatches.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBoardIndex((prev) => (prev + 1) % activeMatches.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeMatches.length]);

  const featuredMatch = activeMatches[activeBoardIndex] || activeMatches[0];
  const whitePlayer = featuredMatch ? getPlayer(featuredMatch.whitePlayerId) : null;
  const blackPlayer = featuredMatch ? getPlayer(featuredMatch.blackPlayerId) : null;

  return (
    <section
      id="cg-section-projector-broadcast"
      ref={containerRef}
      aria-label="Tournament TV & Stage Broadcast Wall"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '6rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(34,85,238,0.06) 0%, rgba(10,10,11,0.98) 75%)',
        borderTop: '1px solid rgba(34,85,238,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic stage spotlight beams */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '300px',
          height: '600px',
          background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '20%',
          width: '300px',
          height: '600px',
          background: 'linear-gradient(180deg, rgba(34,85,238,0.08) 0%, transparent 100%)',
          transform: 'rotate(25deg)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-reveal>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(34,85,238,0.08)',
              border: '1px solid rgba(34,85,238,0.3)',
              marginBottom: '1rem',
            }}
          >
            <Tv className="w-3.5 h-3.5" style={{ color: '#5577ee' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: '#5577ee',
                textTransform: 'uppercase',
              }}
            >
              CHAPTER 07 — STAGE BROADCAST & PROJECTOR WALL
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--cg-ivory)',
              lineHeight: 1.15,
              margin: '0 0 1rem',
            }}
          >
            The Live Auditorium Spectacle
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'var(--cg-ivory-dim)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Designed for arena LED jumbotrons, stage beamers, and collegiate auditoriums. Broadcast multi-board grandmaster clashes with zero latency.
          </p>
        </div>

        {/* Live Broadcast Simulated Giant Jumbotron Screen */}
        <div
          data-reveal
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(16,18,24,0.95) 0%, rgba(10,10,12,0.98) 100%)',
            border: '2px solid rgba(201,168,76,0.35)',
            borderRadius: '16px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 50px -10px rgba(34,85,238,0.2)',
            overflow: 'hidden',
            marginBottom: '3rem',
          }}
        >
          {/* Top Jumbotron Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.75rem',
              background: 'rgba(5,5,8,0.8)',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  borderRadius: '4px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    display: 'inline-block',
                    animation: 'pulseSlow 1s infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#ef4444',
                  }}
                >
                  LIVE BROADCAST
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--cg-ivory)',
                }}
              >
                {settings.name} • {settings.collegeName || 'State Championship'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--cg-emerald-bright)',
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>428 SPECTATORS</span>
              </div>

              <button
                onClick={() => {
                  soundEffects.playVictoryChime();
                  setIsProjectorMode(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1rem',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '6px',
                  color: 'var(--cg-gold-bright)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>FULLSCREEN WALL MODE</span>
              </button>
            </div>
          </div>

          {/* Featured Arena Board Stage */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              padding: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: Huge VS Clash Board */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--cg-gold)',
                    letterSpacing: '0.15em',
                  }}
                >
                  BOARD {featuredMatch?.boardNumber || 1} • {featuredMatch?.status.toUpperCase() || 'MATCH IN PROGRESS'}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-cinematic)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                    color: 'var(--cg-ivory)',
                    margin: '0.25rem 0 0',
                    lineHeight: 1.2,
                  }}
                >
                  {whitePlayer?.name || 'Grandmaster White'} <span style={{ color: 'var(--cg-gold)', fontSize: '1.4rem' }}>VS</span> {blackPlayer?.name || 'Grandmaster Black'}
                </h3>
              </div>

              {/* Player Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    background: 'rgba(245,240,232,0.04)',
                    border: '1px solid rgba(245,240,232,0.15)',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--cg-ivory)' }}>♔</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cg-ivory-dim)', letterSpacing: '0.1em' }}>WHITE PIECES</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--cg-ivory)' }}>
                    {whitePlayer?.name || 'Contender 1'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cg-gold)', marginTop: '0.2rem' }}>
                    SCORE: {whitePlayer?.score || 0} • {whitePlayer?.course || 'Computer Science'}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(10,10,12,0.6)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.2rem', color: '#888' }}>♚</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cg-gold)', letterSpacing: '0.1em' }}>BLACK PIECES</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--cg-ivory)' }}>
                    {blackPlayer?.name || 'Contender 2'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cg-gold)', marginTop: '0.2rem' }}>
                    SCORE: {blackPlayer?.score || 0} • {blackPlayer?.course || 'Mathematics'}
                  </div>
                </div>
              </div>

              {/* Move Telemetry Stream */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Flame className="w-4 h-4" style={{ color: '#f59e0b' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cg-ivory-dim)' }}>
                    LATEST MOVE: <strong style={{ color: 'var(--cg-gold-bright)' }}>24. Nxf7+ (Knight Sacrifice)</strong>
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--cg-emerald-bright)',
                    padding: '0.2rem 0.5rem',
                    background: 'rgba(34,166,122,0.1)',
                    borderRadius: '4px',
                  }}
                >
                  +3.4 EVAL
                </span>
              </div>
            </div>

            {/* Right: Multi-Board Synchronized Arena Matrix */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--cg-gold)',
                    letterSpacing: '0.1em',
                  }}
                >
                  SIMULTANEOUS ACTIVE BOARDS ({activeMatches.length})
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(200,192,174,0.4)' }}>
                  CLICK TO FOCUS
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {activeMatches.map((m, idx) => {
                  const w = getPlayer(m.whitePlayerId);
                  const b = getPlayer(m.blackPlayerId);
                  const isFocused = idx === activeBoardIndex;

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveBoardIndex(idx);
                        soundEffects.playPieceMove();
                      }}
                      style={{
                        background: isFocused ? 'rgba(201,168,76,0.12)' : 'rgba(8,8,10,0.6)',
                        border: `1px solid ${isFocused ? 'var(--cg-gold)' : 'rgba(201,168,76,0.15)'}`,
                        borderRadius: '8px',
                        padding: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cg-gold)' }}>
                          B0{m.boardNumber || idx + 1}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: m.status === 'live' ? '#ef4444' : '#22c55e' }}>
                          ● {m.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--cg-ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {w?.name || 'TBD'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'rgba(200,192,174,0.4)', margin: '0.1rem 0' }}>
                        vs
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--cg-ivory)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b?.name || 'TBD'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Announcements & Arbiter Ticker Bar */}
          <div
            style={{
              padding: '0.75rem 1.75rem',
              background: 'rgba(5,5,8,0.9)',
              borderTop: '1px solid rgba(201,168,76,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              overflow: 'hidden',
            }}
          >
            <Radio className="w-4 h-4" style={{ color: 'var(--cg-gold)', flexShrink: 0 }} />
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--cg-ivory-dim)',
                whiteSpace: 'nowrap',
              }}
            >
              {announcements.length > 0
                ? announcements[0].content
                : 'OFFICIAL ANNOUNCEMENT: Round 2 clock start in 5 minutes. All arbiters report to control desks.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectorBroadcastScene;
