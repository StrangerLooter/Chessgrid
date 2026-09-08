import React, { useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match } from '../../types/tournament';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface ActiveMatchesWidgetProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
}

export const ActiveMatchesWidget: React.FC<ActiveMatchesWidgetProps> = React.memo(({
  onOpenResultModal,
}) => {
  const { matches, playerMap, switchActiveClock, setActiveTab } = useTournament();

  const liveMatches = useMemo(() => matches.filter(m => m.status === 'live'), [matches]);

  if (liveMatches.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel-active p-5 md:p-6 rounded-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--cg-gold)]" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--cg-gold)]" />
          </span>
          <h2
            className="tracking-wider uppercase font-semibold"
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.4rem',
              color: 'var(--cg-ivory)',
              margin: 0,
            }}
          >
            GRANDMASTER LIVE ARENA
          </h2>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(34,166,122,0.18)] text-[var(--cg-emerald-bright)] border border-[rgba(34,166,122,0.4)] emerald-glow"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {liveMatches.length} BOARDS ACTIVE
          </span>
        </div>

        <button
          onClick={() => setActiveTab('live')}
          className="text-xs font-bold flex items-center gap-1.5 transition-all text-[var(--cg-gold)] hover:text-[var(--cg-gold-bright)]"
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
          }}
        >
          <span>ARBITER DESK & DIGITAL CLOCKS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {liveMatches.map(match => {
          const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
          const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

          const isWhiteActive = match.activeClock === 'white' && match.isTimerRunning;
          const isBlackActive = match.activeClock === 'black' && match.isTimerRunning;

          const whiteUnderPressure = match.whiteTimeRemainingMs < 30000;
          const blackUnderPressure = match.blackTimeRemainingMs < 30000;

          return (
            <div
              key={match.id}
              className="glass-panel rounded-lg p-4 md:p-5 flex flex-col justify-between relative group hover:border-[rgba(201,168,76,0.4)] transition-all"
            >
              {/* Header Match Bar */}
              <div className="flex items-center justify-between text-xs mb-3 pb-2.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    BOARD {match.boardNumber || 1}
                  </span>
                  <span
                    className="font-semibold text-xs text-[var(--cg-ivory)]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {match.roundName}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(200,192,174,0.6)]"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{match.timeControl.label}</span>
                </div>
              </div>

              {/* Center Match Display with Clocks and Eval Bar */}
              <div className="flex gap-3.5 mb-3.5 items-stretch">
                {/* Chess Evaluation Indicator Bar */}
                <div className="w-2.5 rounded eval-bar-container overflow-hidden flex flex-col-reverse shrink-0 relative" title="Engine Evaluation: +1.2 GM advantage">
                  <div 
                    className="w-full eval-bar-fill"
                    style={{ height: '58%' }}
                  />
                </div>

                {/* Player 1 (White) */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  className={`flex-1 p-3 rounded cursor-pointer transition-all flex flex-col justify-between ${
                    isWhiteActive 
                      ? 'bg-[rgba(201,168,76,0.14)] border border-[var(--cg-gold)] shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                      : 'bg-[rgba(17,17,20,0.7)] border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-[var(--cg-ivory)] font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shadow-sm" />
                      WHITE
                    </span>
                    {isWhiteActive && (
                      <span className="font-mono font-bold text-[9px] px-1.5 py-0.2 rounded bg-[var(--cg-gold)] text-[#0a0a0b] tracking-wider animate-pulse">
                        TURN
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    <div className="truncate font-semibold text-xs text-[var(--cg-ivory)]">
                      {whitePlayer?.name || 'Grandmaster White'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,192,174,0.6)] truncate">
                      {whitePlayer?.course || 'MIT'} • Seed #{whitePlayer?.seed || 1}
                    </div>
                  </div>

                  <div
                    className={`mt-1 font-stat leading-none tracking-wider text-xl md:text-2xl ${
                      whiteUnderPressure ? 'low-time-pulse font-bold' : isWhiteActive ? 'text-[var(--cg-gold-bright)]' : 'text-[var(--cg-ivory)]'
                    }`}
                  >
                    {formatTime(match.whiteTimeRemainingMs)}
                  </div>
                </div>

                {/* VS Divider with move badge */}
                <div className="flex flex-col items-center justify-center shrink-0 px-1 text-[10px] font-mono text-[rgba(200,192,174,0.4)]">
                  <span className="font-bold text-[var(--cg-gold)]">VS</span>
                  <span className="text-[8px] mt-1">#M{match.matchNumber}</span>
                </div>

                {/* Player 2 (Black) */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  className={`flex-1 p-3 rounded cursor-pointer transition-all flex flex-col justify-between ${
                    isBlackActive 
                      ? 'bg-[rgba(201,168,76,0.14)] border border-[var(--cg-gold)] shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                      : 'bg-[rgba(17,17,20,0.7)] border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-[var(--cg-gold)] font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-black border border-amber-400 inline-block shadow-sm" />
                      BLACK
                    </span>
                    {isBlackActive && (
                      <span className="font-mono font-bold text-[9px] px-1.5 py-0.2 rounded bg-[var(--cg-gold)] text-[#0a0a0b] tracking-wider animate-pulse">
                        TURN
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    <div className="truncate font-semibold text-xs text-[var(--cg-ivory)]">
                      {blackPlayer?.name || 'Grandmaster Black'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,192,174,0.6)] truncate">
                      {blackPlayer?.course || 'Stanford'} • Seed #{blackPlayer?.seed || 2}
                    </div>
                  </div>

                  <div
                    className={`mt-1 font-stat leading-none tracking-wider text-xl md:text-2xl ${
                      blackUnderPressure ? 'low-time-pulse font-bold' : isBlackActive ? 'text-[var(--cg-gold-bright)]' : 'text-[var(--cg-gold)]'
                    }`}
                  >
                    {formatTime(match.blackTimeRemainingMs)}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => switchActiveClock(match.id)}
                  className="arb-desk-btn flex-1 py-1.5 px-3 rounded text-[11px] font-mono font-semibold flex items-center justify-center gap-1"
                >
                  <span>SWITCH CLOCK</span>
                  <span className="text-[9px] opacity-60">(SPACE)</span>
                </button>
                <button
                  onClick={() => onOpenResultModal(match)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded font-bold text-xs bg-gradient-to-r from-[var(--cg-gold-dim)] to-[var(--cg-gold)] text-[#0a0a0b] shadow-[0_0_12px_rgba(201,168,76,0.4)] hover:brightness-110 active:scale-95 transition-all font-sans"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  LOG RESULT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ActiveMatchesWidget;
