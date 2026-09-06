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
    <div className="glass-panel-active p-5 sm:p-6 rounded-lg space-y-5 relative overflow-hidden">
      {/* Timer Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold-bright)] border border-[rgba(201,168,76,0.35)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            BOARD {match.boardNumber || 1}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.35rem',
              fontWeight: 400,
              color: 'var(--cg-ivory)',
            }}
          >
            {match.roundName} (Match #{match.matchNumber})
          </span>
        </div>

        <div
          className="text-xs px-3 py-1 rounded font-mono font-semibold bg-[#0a0a0b]/80 text-[rgba(200,192,174,0.8)] border border-[rgba(201,168,76,0.2)]"
        >
          {match.timeControl.label} (+{match.timeControl.incrementSeconds}s FISCHER)
        </div>
      </div>

      {/* Dual Clocks Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* White Clock Card */}
        <div
          onClick={() => {
            if (match.status === 'live') switchActiveClock(match.id);
          }}
          className={`p-5 rounded-lg text-center transition-all cursor-pointer relative overflow-hidden select-none ${
            isWhiteActive 
              ? 'bg-[rgba(201,168,76,0.16)] border-2 border-[var(--cg-gold)] gold-glow' 
              : 'glass-panel hover:border-[rgba(201,168,76,0.3)]'
          }`}
        >
          {isWhiteFlag && (
            <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white font-bold z-10 animate-bounce">
              <AlertCircle className="w-8 h-8 mb-1" />
              <span className="text-sm">FLAG FALL (TIME EXPIRED)</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className="font-bold flex items-center gap-1.5 text-[var(--cg-ivory)] font-sans tracking-wider"
            >
              <span className="w-3 h-3 rounded-full bg-white border border-amber-300 inline-block shadow-sm" />
              WHITE
            </span>
            {isWhiteActive && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[var(--cg-gold)] text-[#0a0a0b] animate-pulse"
              >
                ACTIVE TURN
              </span>
            )}
          </div>

          <div
            className="text-lg font-bold truncate text-[var(--cg-ivory)] font-sans"
          >
            {whitePlayer?.name || 'Grandmaster White'}
          </div>
          <div
            className="text-xs mt-0.5 truncate text-[rgba(200,192,174,0.6)] font-sans"
          >
            {whitePlayer?.course || 'MIT'} • Seed #{whitePlayer?.seed || 1}
          </div>

          {/* Large Clock Digit */}
          <div
            className={`my-3 tracking-tight font-stat text-5xl sm:text-6xl ${
              match.whiteTimeRemainingMs < 30000 
                ? 'low-time-pulse font-bold' 
                : isWhiteActive 
                ? 'text-[var(--cg-gold-bright)]' 
                : 'text-[var(--cg-ivory)]'
            }`}
            style={{
              lineHeight: 1,
              textShadow: isWhiteActive ? '0 0 25px rgba(201,168,76,0.35)' : 'none',
            }}
          >
            {formatTime(match.whiteTimeRemainingMs)}
          </div>

          <div
            className="text-[11px] font-medium text-[rgba(200,192,174,0.45)] font-sans"
          >
            Click card or press <kbd className="text-[var(--cg-gold)] font-mono font-bold">Spacebar</kbd> to toggle turn
          </div>
        </div>

        {/* Black Clock Card */}
        <div
          onClick={() => {
            if (match.status === 'live') switchActiveClock(match.id);
          }}
          className={`p-5 rounded-lg text-center transition-all cursor-pointer relative overflow-hidden select-none ${
            isBlackActive 
              ? 'bg-[rgba(201,168,76,0.16)] border-2 border-[var(--cg-gold)] gold-glow' 
              : 'glass-panel hover:border-[rgba(201,168,76,0.3)]'
          }`}
        >
          {isBlackFlag && (
            <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white font-bold z-10 animate-bounce">
              <AlertCircle className="w-8 h-8 mb-1" />
              <span className="text-sm">FLAG FALL (TIME EXPIRED)</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs mb-2">
            <span
              className="font-bold flex items-center gap-1.5 text-[var(--cg-gold)] font-sans tracking-wider"
            >
              <span className="w-3 h-3 rounded-full bg-black border border-amber-400 inline-block shadow-sm" />
              BLACK
            </span>
            {isBlackActive && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[var(--cg-gold)] text-[#0a0a0b] animate-pulse"
              >
                ACTIVE TURN
              </span>
            )}
          </div>

          <div
            className="text-lg font-bold truncate text-[var(--cg-ivory)] font-sans"
          >
            {blackPlayer?.name || 'Grandmaster Black'}
          </div>
          <div
            className="text-xs mt-0.5 truncate text-[rgba(200,192,174,0.6)] font-sans"
          >
            {blackPlayer?.course || 'Stanford'} • Seed #{blackPlayer?.seed || 2}
          </div>

          {/* Large Clock Digit */}
          <div
            className={`my-3 tracking-tight font-stat text-5xl sm:text-6xl ${
              match.blackTimeRemainingMs < 30000 
                ? 'low-time-pulse font-bold' 
                : isBlackActive 
                ? 'text-[var(--cg-gold-bright)]' 
                : 'text-[var(--cg-gold)]'
            }`}
            style={{
              lineHeight: 1,
              textShadow: isBlackActive ? '0 0 25px rgba(201,168,76,0.35)' : 'none',
            }}
          >
            {formatTime(match.blackTimeRemainingMs)}
          </div>

          <div
            className="text-[11px] font-medium text-[rgba(200,192,174,0.45)] font-sans"
          >
            Click card or press <kbd className="text-[var(--cg-gold)] font-mono font-bold">Spacebar</kbd> to toggle turn
          </div>
        </div>
      </div>

      {/* Timer Controls Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10"
      >
        {/* Left: Time adjust penalties/bonuses */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => adjustPlayerClock(match.id, 'white', 60)}
            className="arb-desk-btn px-2.5 py-1 rounded text-[11px] font-mono font-semibold"
            title="Add 1 min to White"
          >
            +1m W
          </button>
          <button
            onClick={() => adjustPlayerClock(match.id, 'white', -30)}
            className="arb-desk-btn px-2.5 py-1 rounded text-[11px] font-mono font-semibold"
            title="Deduct 30s from White"
          >
            -30s W
          </button>
          <button
            onClick={() => adjustPlayerClock(match.id, 'black', 60)}
            className="arb-desk-btn px-2.5 py-1 rounded text-[11px] font-mono font-semibold text-[var(--cg-gold)]"
            title="Add 1 min to Black"
          >
            +1m B
          </button>
          <button
            onClick={() => adjustPlayerClock(match.id, 'black', -30)}
            className="arb-desk-btn px-2.5 py-1 rounded text-[11px] font-mono font-semibold text-[var(--cg-gold)]"
            title="Deduct 30s from Black"
          >
            -30s B
          </button>
          <button
            onClick={() => resetMatchClock(match.id)}
            className="arb-desk-btn p-1.5 rounded text-slate-400 hover:text-white"
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
