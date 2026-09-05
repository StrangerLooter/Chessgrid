import React, { useEffect } from 'react';
import type { Match, Player } from '../../types/tournament';
import { useTournament } from '../../context/TournamentContext';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface ChessTimerProps {
  match: Match;
  onOpenResultModal: (match: Match) => void;
}

export const ChessTimer: React.FC<ChessTimerProps> = ({ match, onOpenResultModal }) => {
  const { 
    players, 
    pauseMatch, 
    resumeMatch, 
    switchActiveClock, 
    resetMatchClock, 
    adjustPlayerClock 
  } = useTournament();

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

  const isWhiteActive = match.activeClock === 'white' && match.isTimerRunning;
  const isBlackActive = match.activeClock === 'black' && match.isTimerRunning;

  const isWhiteFlag = match.whiteTimeRemainingMs <= 0;
  const isBlackFlag = match.blackTimeRemainingMs <= 0;

  // Spacebar keyboard listener to switch active clock turn
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && match.status === 'live') {
        e.preventDefault();
        switchActiveClock(match.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [match.id, match.status, switchActiveClock]);

  return (
    <div
      className="p-5 sm:p-6 rounded space-y-5"
      style={{
        background: 'rgba(17, 17, 20, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(201, 168, 76, 0.25)',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(201, 168, 76, 0.1)',
      }}
    >
      {/* Timer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              color: 'var(--cg-gold-bright)',
              border: '1px solid rgba(201, 168, 76, 0.35)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            BOARD {match.boardNumber || 1}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.25rem',
              fontWeight: 400,
              color: 'var(--cg-ivory)',
            }}
          >
            {match.roundName} (Match #{match.matchNumber})
          </span>
        </div>

        <div
          className="text-xs px-2.5 py-1 rounded font-semibold"
          style={{
            background: 'rgba(10, 10, 11, 0.8)',
            color: 'rgba(200, 192, 174, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {match.timeControl.label} (+{match.timeControl.incrementSeconds}s/move)
        </div>
      </div>

      {/* Dual Clocks Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* White Clock Card */}
        <div
          onClick={() => {
            if (match.status === 'live') switchActiveClock(match.id);
          }}
          className="p-5 rounded text-center transition-all cursor-pointer relative overflow-hidden select-none"
          style={{
            background: isWhiteActive ? 'rgba(201, 168, 76, 0.15)' : 'rgba(10, 10, 11, 0.7)',
            border: isWhiteActive ? '1px solid var(--cg-gold)' : '1px solid rgba(201, 168, 76, 0.15)',
            boxShadow: isWhiteActive ? '0 0 30px -6px rgba(201, 168, 76, 0.5)' : 'none',
          }}
        >
          {isWhiteFlag && (
            <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white font-bold z-10 animate-bounce">
              <AlertCircle className="w-8 h-8 mb-1" />
              <span className="text-sm">FLAG FALL (TIME OUT)</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className="font-bold flex items-center gap-1.5"
              style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}
            >
              <span className="w-3 h-3 rounded-full bg-white border border-amber-300 inline-block" />
              WHITE
            </span>
            {isWhiteActive && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold animate-pulse"
                style={{ background: 'var(--cg-gold)', color: '#0a0a0b', fontFamily: 'var(--font-sans)' }}
              >
                ACTIVE TURN
              </span>
            )}
          </div>

          <div
            className="text-base font-bold truncate"
            style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}
          >
            {whitePlayer?.name || 'White Player'}
          </div>
          <div
            className="text-xs mt-0.5 truncate"
            style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}
          >
            {whitePlayer?.course || '-'}
          </div>

          {/* Large Clock Digit in Bebas Neue / JetBrains Mono */}
          <div
            className="my-3 tracking-tight"
            style={{
              fontFamily: 'var(--font-stat)',
              fontSize: 'clamp(3.5rem, 8vw, 5rem)',
              lineHeight: 1,
              color: match.whiteTimeRemainingMs < 30000 ? 'var(--cg-red-bright)' : 'var(--cg-ivory)',
              textShadow: isWhiteActive ? '0 0 30px rgba(201,168,76,0.3)' : 'none',
            }}
          >
            {formatTime(match.whiteTimeRemainingMs)}
          </div>

          <div
            className="text-[11px] font-medium"
            style={{ color: 'rgba(200, 192, 174, 0.4)', fontFamily: 'var(--font-sans)' }}
          >
            Click card or press <kbd style={{ color: 'var(--cg-gold)' }}>Spacebar</kbd> to toggle clock
          </div>
        </div>

        {/* Black Clock Card */}
        <div
          onClick={() => {
            if (match.status === 'live') switchActiveClock(match.id);
          }}
          className="p-5 rounded text-center transition-all cursor-pointer relative overflow-hidden select-none"
          style={{
            background: isBlackActive ? 'rgba(201, 168, 76, 0.15)' : 'rgba(10, 10, 11, 0.7)',
            border: isBlackActive ? '1px solid var(--cg-gold)' : '1px solid rgba(201, 168, 76, 0.15)',
            boxShadow: isBlackActive ? '0 0 30px -6px rgba(201, 168, 76, 0.5)' : 'none',
          }}
        >
          {isBlackFlag && (
            <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white font-bold z-10 animate-bounce">
              <AlertCircle className="w-8 h-8 mb-1" />
              <span className="text-sm">FLAG FALL (TIME OUT)</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className="font-bold flex items-center gap-1.5"
              style={{ color: 'var(--cg-gold)', fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}
            >
              <span className="w-3 h-3 rounded-full bg-slate-950 border border-amber-400 inline-block" />
              BLACK
            </span>
            {isBlackActive && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold animate-pulse"
                style={{ background: 'var(--cg-gold)', color: '#0a0a0b', fontFamily: 'var(--font-sans)' }}
              >
                ACTIVE TURN
              </span>
            )}
          </div>

          <div
            className="text-base font-bold truncate"
            style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}
          >
            {blackPlayer?.name || 'Black Player'}
          </div>
          <div
            className="text-xs mt-0.5 truncate"
            style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}
          >
            {blackPlayer?.course || '-'}
          </div>

          {/* Large Clock Digit */}
          <div
            className="my-3 tracking-tight"
            style={{
              fontFamily: 'var(--font-stat)',
              fontSize: 'clamp(3.5rem, 8vw, 5rem)',
              lineHeight: 1,
              color: match.blackTimeRemainingMs < 30000 ? 'var(--cg-red-bright)' : 'var(--cg-gold)',
              textShadow: isBlackActive ? '0 0 30px rgba(201,168,76,0.3)' : 'none',
            }}
          >
            {formatTime(match.blackTimeRemainingMs)}
          </div>

          <div
            className="text-[11px] font-medium"
            style={{ color: 'rgba(200, 192, 174, 0.4)', fontFamily: 'var(--font-sans)' }}
          >
            Click card or press <kbd style={{ color: 'var(--cg-gold)' }}>Spacebar</kbd> to toggle clock
          </div>
        </div>
      </div>

      {/* Timer Controls Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pt-3"
        style={{ borderTop: '1px solid rgba(201, 168, 76, 0.15)' }}
      >
        {/* Left: Time adjust penalties/bonuses */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustPlayerClock(match.id, 'white', 60)}
            className="px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
            style={{
              background: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
            title="Add 1 min to White"
          >
            +1m White
          </button>
          <button
            onClick={() => adjustPlayerClock(match.id, 'black', 60)}
            className="px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
            style={{
              background: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-gold)',
              fontFamily: 'var(--font-sans)',
            }}
            title="Add 1 min to Black"
          >
            +1m Black
          </button>
          <button
            onClick={() => resetMatchClock(match.id)}
            className="p-1.5 rounded transition-colors text-slate-400 hover:text-white"
            style={{
              background: 'rgba(10, 10, 11, 0.6)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
            title="Reset timer to start time"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Play/Pause and Result */}
        <div className="flex items-center gap-2">
          {match.isTimerRunning ? (
            <button
              onClick={() => pauseMatch(match.id)}
              className="cg-btn cg-btn-ghost"
              style={{ padding: '0.5rem 1.2rem' }}
            >
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              PAUSE CLOCK
            </button>
          ) : (
            <button
              onClick={() => resumeMatch(match.id)}
              className="cg-btn cg-btn-emerald"
              style={{ padding: '0.5rem 1.2rem' }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              RESUME CLOCK
            </button>
          )}

          <button
            onClick={() => onOpenResultModal(match)}
            className="cg-btn cg-btn-primary"
            style={{ padding: '0.5rem 1.4rem' }}
          >
            RECORD RESULT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChessTimer;
