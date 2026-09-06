import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import { 
  Activity, 
  Cpu, 
  BarChart3, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface MoveEvaluation {
  moveNumber: number;
  whiteMove: string;
  blackMove: string;
  eval: number; // Positive = white advantage, negative = black advantage
  type: 'brilliant' | 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  annotation: string;
}

const SAMPLE_ANALYSIS: MoveEvaluation[] = [
  { moveNumber: 1, whiteMove: 'e4', blackMove: 'c5', eval: 0.2, type: 'best', annotation: 'Sicilian Defense — Open variation favored by aggressive tacticians.' },
  { moveNumber: 2, whiteMove: 'Nf3', blackMove: 'd6', eval: 0.3, type: 'best', annotation: 'Standard knight development controlling d4.' },
  { moveNumber: 3, whiteMove: 'd4', blackMove: 'cxd4', eval: 0.3, type: 'good', annotation: 'Open Sicilian liquidation.' },
  { moveNumber: 4, whiteMove: 'Nxd4', blackMove: 'Nf6', eval: 0.4, type: 'best', annotation: 'Attacking the e4 pawn immediately.' },
  { moveNumber: 5, whiteMove: 'Nc3', blackMove: 'a6', eval: 0.4, type: 'best', annotation: 'Najdorf Variation — Grandmaster favorite.' },
  { moveNumber: 14, whiteMove: 'Bxf7+!', blackMove: 'Kxf7', eval: 2.8, type: 'brilliant', annotation: 'Tactical clearance sacrifice breaking black king safety!' },
  { moveNumber: 15, whiteMove: 'Qh5+', blackMove: 'g6', eval: 4.6, type: 'best', annotation: 'Decisive queen penetration forcing severe positional concessions.' },
];

export const AnalysisStatsScene: React.FC = () => {
  const { players, matches } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [selectedMoveIdx, setSelectedMoveIdx] = useState(5); // Default to move 14
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Compute live tournament statistics
  const stats = useMemo(() => {
    const totalPlayers = players.length;
    const totalMatches = matches.length;
    const completedMatches = matches.filter(m => m.status === 'completed').length;
    const liveMatches = matches.filter(m => m.status === 'live').length;
    const upcomingMatches = matches.filter(m => m.status === 'upcoming' || m.status === 'ready').length;
    const eliminatedPlayers = players.filter(p => p.status === 'eliminated').length;
    const remainingPlayers = players.filter(p => p.status === 'active' || p.status === 'champion').length;

    // Approximate total moves across all matches
    const totalMoves = matches.reduce((acc, m) => acc + (m.status === 'completed' ? 38 : 14), 0);
    const avgGameTime = '18m 45s';
    const longestGame = '42m 10s (Round 1, Board 2)';
    const fastestWin = '7m 12s (Checkmate via Scholar\'s Trap variant)';

    return {
      totalPlayers,
      totalMatches,
      completedMatches,
      liveMatches,
      upcomingMatches,
      eliminatedPlayers,
      remainingPlayers,
      totalMoves,
      avgGameTime,
      longestGame,
      fastestWin,
    };
  }, [players, matches]);

  useEffect(() => {
    if (waypoint === 'analysis' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out' }
        );
      }
    }
  }, [waypoint, waypointProgress, isRevealed]);

  const currentMove = SAMPLE_ANALYSIS[selectedMoveIdx] || SAMPLE_ANALYSIS[0];
  const evalScore = currentMove.eval;
  const evalPct = Math.min(95, Math.max(5, 50 + evalScore * 8)); // 50% is equal, >50% white advantage

  return (
    <section
      id="cg-section-analysis-stats"
      ref={containerRef}
      aria-label="Tactical Intelligence & Tournament Telemetry"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '6rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 25%, rgba(201,168,76,0.06) 0%, rgba(10,10,11,0.98) 75%)',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-reveal>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              marginBottom: '1rem',
            }}
          >
            <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--cg-gold)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'var(--cg-gold)',
                textTransform: 'uppercase',
              }}
            >
              CHAPTER 08 — TACTICAL ANALYSIS & TOURNAMENT TELEMETRY
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
            Deep Grandmaster Intelligence
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
            Real-time evaluation bars, move classification, opening encyclopedia lookups, and tournament-wide statistical telemetry.
          </p>
        </div>

        {/* 2-Column Split: Stockfish Intelligence Deck & Live Tournament Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Left Column: Interactive Move Analysis & Stockfish Bar */}
          <div
            data-reveal
            style={{
              background: 'rgba(15,15,18,0.85)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cg-gold)',
                  }}
                >
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.3rem', color: 'var(--cg-ivory)', margin: 0 }}>
                    Stockfish 17 Neural Engine
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(200,192,174,0.5)', letterSpacing: '0.1em' }}>
                    DEPTH 32 PLY • 48.2 MNODES/S
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                  background: 'rgba(34,166,122,0.12)',
                  border: '1px solid rgba(34,166,122,0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--cg-emerald-bright)',
                  fontWeight: 700,
                }}
              >
                ACCURACY: 94.8%
              </div>
            </div>

            {/* Visual Stockfish Evaluation Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cg-ivory)' }}>
                  WHITE ADVANTAGE ({evalScore > 0 ? `+${evalScore.toFixed(1)}` : evalScore.toFixed(1)})
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cg-gold)' }}>
                  {evalScore > 2 ? 'WINNING ADVANTAGE' : 'EQUAL POSITION'}
                </span>
              </div>

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: '16px',
                  background: '#18181f',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${evalPct}%`,
                    background: 'linear-gradient(90deg, #22a67a 0%, var(--cg-gold) 100%)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Move List Replay Strip */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--cg-gold)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cg-gold)', letterSpacing: '0.1em' }}>
                  GAME REVIEW TIMELINE
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {SAMPLE_ANALYSIS.map((m, idx) => {
                  const isSelected = idx === selectedMoveIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMoveIdx(idx);
                        soundEffects.playPieceMove();
                      }}
                      style={{
                        flexShrink: 0,
                        padding: '0.6rem 0.85rem',
                        background: isSelected ? 'rgba(201,168,76,0.18)' : 'rgba(8,8,10,0.7)',
                        border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201,168,76,0.15)'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.4)' }}>
                        MOVE {m.moveNumber}
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)' }}>
                        {m.whiteMove} {m.blackMove}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.55rem',
                          color: m.type === 'brilliant' ? 'var(--cg-emerald-bright)' : 'var(--cg-gold)',
                          marginTop: '0.2rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {m.type === 'brilliant' ? '★ BRILLIANT' : m.type.toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Move Tactical Annotation */}
            <div
              style={{
                padding: '1rem',
                background: 'rgba(8,8,10,0.9)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Sparkles className="w-4 h-4" style={{ color: 'var(--cg-gold)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--cg-ivory)' }}>
                  Tactical Insight: Move {currentMove.moveNumber}. {currentMove.whiteMove}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--cg-ivory-dim)', margin: 0, lineHeight: 1.5 }}>
                {currentMove.annotation}
              </p>
            </div>
          </div>

          {/* Right Column: Live Tournament Telemetry Grid */}
          <div
            data-reveal
            style={{
              background: 'rgba(15,15,18,0.85)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 16px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cg-gold)',
                }}
              >
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.3rem', color: 'var(--cg-ivory)', margin: 0 }}>
                  Championship Telemetry
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(200,192,174,0.5)', letterSpacing: '0.1em' }}>
                  REAL-TIME STATISTICAL INDEX
                </span>
              </div>
            </div>

            {/* 6-Cell Telemetry Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-gold-bright)', lineHeight: 1 }}>
                  {stats.totalPlayers}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  TOTAL PLAYERS
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-ivory)', lineHeight: 1 }}>
                  {stats.totalMatches}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  TOTAL MATCHES
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-emerald-bright)', lineHeight: 1 }}>
                  {stats.completedMatches}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  COMPLETED
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: '#ef4444', lineHeight: 1 }}>
                  {stats.liveMatches}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  LIVE ARENA
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: 'var(--cg-gold)', lineHeight: 1 }}>
                  {stats.remainingPlayers}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  SURVIVING
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(8,8,10,0.7)',
                  border: '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-stat)', fontSize: '1.8rem', color: '#888', lineHeight: 1 }}>
                  {stats.eliminatedPlayers}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(200,192,174,0.5)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
                  ELIMINATED
                </div>
              </div>
            </div>

            {/* Match Pace & Duration Records */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(8,8,10,0.6)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--cg-ivory-dim)' }}>
                  Average Match Duration
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cg-gold-bright)', fontWeight: 700 }}>
                  {stats.avgGameTime}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(8,8,10,0.6)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--cg-ivory-dim)' }}>
                  Longest Tournament Match
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cg-gold-bright)', fontWeight: 700 }}>
                  {stats.longestGame}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(8,8,10,0.6)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--cg-ivory-dim)' }}>
                  Fastest Decisive Checkmate
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--cg-emerald-bright)', fontWeight: 700 }}>
                  {stats.fastestWin}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisStatsScene;
