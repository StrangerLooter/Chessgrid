import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import type { Match } from '../../types/tournament';
import { soundEffects } from '../../utils/soundEffects';

/* ── Format milliseconds to mm:ss ── */
const formatTime = (ms: number): string => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/* ── Premium Chess Clock ── */
const CinematicClock: React.FC<{
  whiteTime: number;
  blackTime: number;
  activeClock: 'white' | 'black' | null;
  isRunning: boolean;
  whiteName: string;
  blackName: string;
}> = ({ whiteTime, blackTime, activeClock, isRunning, whiteName, blackName }) => {
  const whiteActive = activeClock === 'white' && isRunning;
  const blackActive = activeClock === 'black' && isRunning;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`Match timer. White (${whiteName}): ${formatTime(whiteTime)}. Black (${blackName}): ${formatTime(blackTime)}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1.5rem',
        alignItems: 'center',
        maxWidth: '700px',
        margin: '0 auto',
      }}
    >
      {/* White clock */}
      <div
        className={whiteActive ? 'cg-glow' : ''}
        style={{
          textAlign: 'center',
          padding: '1.5rem 1rem',
          background: whiteActive ? 'rgba(201,168,76,0.06)' : 'rgba(10,10,11,0.6)',
          border: `1px solid ${whiteActive ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)'}`,
          transition: 'all 0.4s ease',
          boxShadow: whiteActive ? '0 0 30px -8px rgba(201,168,76,0.3)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Active pulse overlay */}
        {whiteActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(201,168,76,0.03)',
              animation: 'pulseSlow 1.5s ease-in-out infinite',
            }}
          />
        )}
        <div style={{ position: 'relative' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.5rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: whiteActive ? 'var(--cg-gold)' : 'rgba(200,192,174,0.4)',
              margin: '0 0 0.3rem',
              textTransform: 'uppercase',
            }}
          >
            ♔ {whiteName}
          </p>
          <div
            style={{
              fontFamily: 'var(--font-stat)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: whiteActive ? 'var(--cg-ivory)' : 'rgba(200,192,174,0.5)',
              lineHeight: 1,
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease',
            }}
          >
            {formatTime(whiteTime)}
          </div>
          {whiteActive && (
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--cg-ivory)',
                margin: '0.5rem auto 0',
                animation: 'pulseSlow 0.8s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* VS badge */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            border: '1px solid rgba(201,168,76,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-stat)',
            fontSize: '0.85rem',
            color: 'var(--cg-gold)',
            background: 'rgba(201,168,76,0.04)',
            letterSpacing: '0.05em',
          }}
        >
          VS
        </div>
      </div>

      {/* Black clock */}
      <div
        className={blackActive ? 'cg-glow' : ''}
        style={{
          textAlign: 'center',
          padding: '1.5rem 1rem',
          background: blackActive ? 'rgba(201,168,76,0.06)' : 'rgba(10,10,11,0.6)',
          border: `1px solid ${blackActive ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)'}`,
          transition: 'all 0.4s ease',
          boxShadow: blackActive ? '0 0 30px -8px rgba(201,168,76,0.3)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {blackActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(201,168,76,0.03)',
              animation: 'pulseSlow 1.5s ease-in-out infinite',
            }}
          />
        )}
        <div style={{ position: 'relative' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.5rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: blackActive ? 'var(--cg-gold)' : 'rgba(200,192,174,0.4)',
              margin: '0 0 0.3rem',
              textTransform: 'uppercase',
            }}
          >
            ♚ {blackName}
          </p>
          <div
            style={{
              fontFamily: 'var(--font-stat)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: blackActive ? 'var(--cg-gold)' : 'rgba(200,192,174,0.5)',
              lineHeight: 1,
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease',
            }}
          >
            {formatTime(blackTime)}
          </div>
          {blackActive && (
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--cg-gold)',
                margin: '0.5rem auto 0',
                animation: 'pulseSlow 0.8s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Match Controls ── */
const MatchControls: React.FC<{
  match: Match;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSwitchClock: () => void;
  onDeclareWhite: () => void;
  onDeclareBlack: () => void;
  onDraw: () => void;
}> = ({ match, onStart, onPause, onResume, onSwitchClock, onDeclareWhite, onDeclareBlack, onDraw }) => {
  const isLive = match.status === 'live';
  const isReady = match.status === 'ready' || match.status === 'upcoming';
  const isCompleted = match.status === 'completed';
  const isPaused = isLive && !match.isTimerRunning;

  const btnStyle = (color: string, borderColor: string): React.CSSProperties => ({
    background: `${color}08`,
    border: `1px solid ${borderColor}`,
    color: borderColor,
    padding: '0.55rem 1.2rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    flex: 1,
    minWidth: '100px',
    textAlign: 'center' as const,
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '700px',
        margin: '1.5rem auto 0',
      }}
    >
      {isReady && (
        <button
          onClick={onStart}
          aria-label="Start match timer"
          style={btnStyle('var(--cg-emerald)', 'rgba(34,166,122,0.5)')}
        >
          ▶ START
        </button>
      )}
      {isLive && match.isTimerRunning && (
        <button
          onClick={onPause}
          aria-label="Pause match timer"
          style={btnStyle('var(--cg-gold)', 'rgba(201,168,76,0.4)')}
        >
          ⏸ PAUSE
        </button>
      )}
      {isPaused && (
        <button
          onClick={onResume}
          aria-label="Resume match timer"
          style={btnStyle('var(--cg-emerald)', 'rgba(34,166,122,0.5)')}
        >
          ▶ RESUME
        </button>
      )}
      {isLive && (
        <button
          onClick={onSwitchClock}
          aria-label="Switch active chess clock"
          style={btnStyle('var(--cg-ivory)', 'rgba(245,240,232,0.25)')}
        >
          ⇌ SWITCH CLOCK
        </button>
      )}
      {isLive && !isCompleted && (
        <>
          <button
            onClick={onDeclareWhite}
            aria-label="Declare White player as winner"
            style={btnStyle('var(--cg-ivory)', 'rgba(245,240,232,0.2)')}
          >
            ♔ WHITE WINS
          </button>
          <button
            onClick={onDeclareBlack}
            aria-label="Declare Black player as winner"
            style={btnStyle('var(--cg-gold)', 'rgba(201,168,76,0.3)')}
          >
            ♚ BLACK WINS
          </button>
          <button
            onClick={onDraw}
            aria-label="Declare match as draw"
            style={btnStyle('var(--cg-ivory)', 'rgba(200,192,174,0.15)')}
          >
            ½ DRAW
          </button>
        </>
      )}
      {isCompleted && (
        <div
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid rgba(34,166,122,0.25)',
            background: 'rgba(34,166,122,0.06)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--cg-emerald-bright)',
            textTransform: 'uppercase',
          }}
        >
          ✓ MATCH COMPLETED
        </div>
      )}
    </div>
  );
};

/* ── Match selector card ── */
const MatchSelectorCard: React.FC<{
  match: Match;
  getPlayerName: (id: string | null) => string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ match, getPlayerName, isSelected, onClick }) => {
  const sColors: Record<string, string> = {
    live: 'var(--cg-gold)',
    completed: 'var(--cg-emerald-bright)',
    ready: '#5577ee',
    upcoming: 'rgba(200,192,174,0.3)',
    cancelled: 'rgba(100,100,100,0.3)',
  };
  const c = sColors[match.status] ?? 'rgba(200,192,174,0.3)';

  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(201,168,76,0.1)' : 'rgba(10,10,11,0.6)',
        border: `1px solid ${isSelected ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.06)'}`,
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        width: '100%',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: c,
          flexShrink: 0,
          boxShadow: match.status === 'live' ? '0 0 6px rgba(201,168,76,0.5)' : 'none',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.7rem',
            fontWeight: 500,
            color: isSelected ? 'var(--cg-ivory)' : 'rgba(200,192,174,0.6)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getPlayerName(match.whitePlayerId)} vs {getPlayerName(match.blackPlayerId)}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: 'rgba(200,192,174,0.3)',
            margin: '0.1rem 0 0',
            letterSpacing: '0.08em',
          }}
        >
          {match.roundName} · M{String(match.matchNumber).padStart(2, '0')}
        </p>
      </div>
    </button>
  );
};

/* ── Main Match Arena Scene ── */
export const MatchArenaScene: React.FC = () => {
  const {
    matches, players,
    startMatch, pauseMatch, resumeMatch,
    switchActiveClock, recordResult,
  } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const getPlayerName = useCallback((id: string | null): string => {
    if (!id) return 'TBD';
    return players.find(p => p.id === id)?.name ?? 'TBD';
  }, [players]);

  // Auto-select first live or ready match
  useEffect(() => {
    if (!selectedMatchId || !matches.find(m => m.id === selectedMatchId)) {
      const live = matches.find(m => m.status === 'live');
      const ready = matches.find(m => m.status === 'ready');
      const upcoming = matches.find(m => m.status === 'upcoming');
      setSelectedMatchId((live || ready || upcoming || matches[0])?.id ?? null);
    }
  }, [matches, selectedMatchId]);

  const selectedMatch = useMemo(
    () => matches.find(m => m.id === selectedMatchId) ?? null,
    [matches, selectedMatchId]
  );

  // Playable matches for the selector
  const playableMatches = useMemo(
    () => matches.filter(m => m.whitePlayerId && m.blackPlayerId),
    [matches]
  );

  // Reveal animation
  useEffect(() => {
    if (waypoint === 'match' && waypointProgress > 0.1 && !isRevealed) {
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
    if (waypoint === 'bracket' || waypoint === 'pairing' || waypoint === 'players') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed]);

  return (
    <div
      id="cg-match-arena"
      style={{
        minHeight: '100vh',
        padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 4vw, 4rem) 5rem',
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
            'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(30,79,255,0.03) 0%, transparent 50%)',
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
          ♞ &nbsp; THE BATTLEFIELD &nbsp; ♞
        </p>

        <h2 data-animate className="cg-section-title" style={{ margin: '0 0 0.5rem', opacity: 0 }}>
          THE MATCH ARENA
        </h2>

        <div data-animate className="cg-gold-line-full" style={{ maxWidth: '200px', margin: '1rem auto', opacity: 0 }} />
      </div>

      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{ fontSize: '4rem', opacity: 0.15, marginBottom: '1rem' }}>♞</div>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.2rem',
              letterSpacing: '0.08em',
              color: 'rgba(200,192,174,0.35)',
              margin: '0 0 0.5rem',
            }}
          >
            No matches to display
          </p>
          <p className="cg-body" style={{ opacity: 0.4, maxWidth: '400px', margin: '0 auto' }}>
            Generate pairings first to create matches.
          </p>
        </div>
      ) : (
        <div
          className="cg-match-arena-grid"
          style={{
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.6s 0.2s ease',
          }}
        >
          {/* Left — match selector */}
          <div
            className="cg-match-selector-list cg-touch-scroll"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              maxHeight: '70vh',
              overflowY: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            <p className="cg-label" style={{ margin: '0 0 0.5rem', opacity: 0.5 }}>SELECT MATCH</p>
            {playableMatches.map(m => (
              <MatchSelectorCard
                key={m.id}
                match={m}
                getPlayerName={getPlayerName}
                isSelected={selectedMatchId === m.id}
                onClick={() => setSelectedMatchId(m.id)}
              />
            ))}
          </div>

          {/* Right — arena */}
          <div>
            {selectedMatch ? (
              <div>
                {/* Match header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <p className="cg-label" style={{ margin: '0 0 0.25rem', opacity: 0.4 }}>
                    {selectedMatch.roundName} · MATCH {String(selectedMatch.matchNumber).padStart(2, '0')}
                    {selectedMatch.boardNumber ? ` · BOARD ${selectedMatch.boardNumber}` : ''}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                      fontWeight: 300,
                      letterSpacing: '0.08em',
                      color: 'var(--cg-ivory)',
                      margin: '0 0 0.25rem',
                    }}
                  >
                    {getPlayerName(selectedMatch.whitePlayerId)} vs {getPlayerName(selectedMatch.blackPlayerId)}
                  </h3>
                  <div className="cg-gold-line-full" style={{ maxWidth: '140px', margin: '0.5rem auto' }} />

                  {/* Winner display */}
                  {selectedMatch.winnerPlayerId && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 1.5rem',
                        border: '1px solid rgba(201,168,76,0.3)',
                        background: 'rgba(201,168,76,0.06)',
                        display: 'inline-block',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          color: 'var(--cg-gold)',
                          textTransform: 'uppercase',
                        }}
                      >
                        ★ WINNER: {getPlayerName(selectedMatch.winnerPlayerId)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chess Clock */}
                <CinematicClock
                  whiteTime={selectedMatch.whiteTimeRemainingMs}
                  blackTime={selectedMatch.blackTimeRemainingMs}
                  activeClock={selectedMatch.activeClock}
                  isRunning={selectedMatch.isTimerRunning}
                  whiteName={getPlayerName(selectedMatch.whitePlayerId)}
                  blackName={getPlayerName(selectedMatch.blackPlayerId)}
                />

                {/* Match Controls */}
                <MatchControls
                  match={selectedMatch}
                  onStart={() => {
                    soundEffects.playPieceMove();
                    startMatch(selectedMatch.id);
                  }}
                  onPause={() => pauseMatch(selectedMatch.id)}
                  onResume={() => {
                    soundEffects.playPieceMove();
                    resumeMatch(selectedMatch.id);
                  }}
                  onSwitchClock={() => {
                    soundEffects.playClockClick();
                    switchActiveClock(selectedMatch.id);
                  }}
                  onDeclareWhite={() => {
                    soundEffects.playVictoryChime();
                    recordResult(selectedMatch.id, 'white_win');
                  }}
                  onDeclareBlack={() => {
                    soundEffects.playVictoryChime();
                    recordResult(selectedMatch.id, 'black_win');
                  }}
                  onDraw={() => {
                    soundEffects.playPieceMove();
                    recordResult(selectedMatch.id, 'draw');
                  }}
                />

                {/* Match info footer */}
                <div
                  style={{
                    marginTop: '2rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(10,10,11,0.5)',
                    border: '1px solid rgba(201,168,76,0.06)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {[
                    { label: 'STATUS', value: selectedMatch.status.toUpperCase() },
                    { label: 'TIME CONTROL', value: selectedMatch.timeControl.label },
                    { label: 'ROUND', value: selectedMatch.roundName },
                    { label: 'RESULT', value: selectedMatch.resultType?.replace('_', ' ').toUpperCase() ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="cg-label" style={{ margin: '0 0 0.15rem', opacity: 0.4, fontSize: '0.45rem' }}>{label}</p>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: 'var(--cg-ivory)',
                          margin: 0,
                          textTransform: 'capitalize',
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.3 }}>
                <p className="cg-body">Select a match from the list</p>
              </div>
            )}
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

export default MatchArenaScene;
