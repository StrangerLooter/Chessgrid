import React, { useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match } from '../../types/tournament';
import { Clock, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
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
    <div
      className="glass-panel rounded-lg p-5 transition-all relative overflow-hidden"
      style={{
        background: 'rgba(17, 17, 20, 0.85)',
        border: '1px solid rgba(201, 168, 76, 0.28)',
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--cg-emerald-bright)]" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--cg-emerald-bright)]" />
          </span>
          <h2
            className="text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}
          >
            Live Combat Boards ({liveMatches.length})
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border border-[rgba(34,166,122,0.3)]">
            Active Digital Clocks
          </span>
        </div>

        <button
          onClick={() => setActiveTab('live')}
          className="text-xs font-semibold flex items-center gap-1 text-[var(--cg-gold)] hover:text-[var(--cg-gold-bright)] transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <span>Full Arbiter Desk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              className="p-4 rounded-lg flex flex-col justify-between transition-all"
              style={{
                background: 'rgba(10, 10, 12, 0.75)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
              }}
            >
              {/* Match Header */}
              <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]">
                    BOARD {match.boardNumber || 1}
                  </span>
                  <span className="font-semibold text-xs text-[var(--cg-ivory)]">
                    {match.roundName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgba(200,192,174,0.65)]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{match.timeControl.label}</span>
                </div>
              </div>

              {/* Clocks & Players */}
              <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                {/* White Player */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      switchActiveClock(match.id);
                    }
                  }}
                  className={`p-2.5 rounded cursor-pointer transition-all flex flex-col justify-between ${
                    isWhiteActive 
                      ? 'bg-[rgba(201,168,76,0.15)] border border-[var(--cg-gold)] shadow-[0_0_12px_rgba(201,168,76,0.25)]' 
                      : 'bg-white/5 border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-[var(--cg-ivory)] font-sans text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shadow-sm shrink-0" />
                      WHITE
                    </span>
                    {isWhiteActive && (
                      <span className="font-mono font-bold text-[9px] px-1.5 py-0.5 rounded bg-[var(--cg-gold)] text-[#0a0a0b] tracking-wider">
                        TURN
                      </span>
                    )}
                  </div>

                  <div className="my-1 min-w-0">
                    <div className="truncate font-semibold text-xs text-[var(--cg-ivory)]">
                      {whitePlayer?.name || 'TBD'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,192,174,0.6)] truncate">
                      {whitePlayer ? `Seed #${whitePlayer.seed}` : 'Waiting for pairing'}
                    </div>
                  </div>

                  <div
                    className={`mt-1 font-stat leading-none tracking-wider text-xl sm:text-2xl ${
                      whiteUnderPressure 
                        ? 'text-red-400 font-bold animate-pulse' 
                        : isWhiteActive 
                        ? 'text-[var(--cg-gold-bright)] font-bold' 
                        : 'text-[var(--cg-ivory)]'
                    }`}
                  >
                    {formatTime(match.whiteTimeRemainingMs)}
                  </div>
                </div>

                {/* Black Player */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      switchActiveClock(match.id);
                    }
                  }}
                  className={`p-2.5 rounded cursor-pointer transition-all flex flex-col justify-between ${
                    isBlackActive 
                      ? 'bg-[rgba(201,168,76,0.15)] border border-[var(--cg-gold)] shadow-[0_0_12px_rgba(201,168,76,0.25)]' 
                      : 'bg-white/5 border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-[var(--cg-gold)] font-sans text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block shadow-sm shrink-0" />
                      BLACK
                    </span>
                    {isBlackActive && (
                      <span className="font-mono font-bold text-[9px] px-1.5 py-0.5 rounded bg-[var(--cg-gold)] text-[#0a0a0b] tracking-wider">
                        TURN
                      </span>
                    )}
                  </div>

                  <div className="my-1 min-w-0">
                    <div className="truncate font-semibold text-xs text-[var(--cg-ivory)]">
                      {blackPlayer?.name || 'TBD'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,192,174,0.6)] truncate">
                      {blackPlayer ? `Seed #${blackPlayer.seed}` : 'Waiting for pairing'}
                    </div>
                  </div>

                  <div
                    className={`mt-1 font-stat leading-none tracking-wider text-xl sm:text-2xl ${
                      blackUnderPressure 
                        ? 'text-red-400 font-bold animate-pulse' 
                        : isBlackActive 
                        ? 'text-[var(--cg-gold-bright)] font-bold' 
                        : 'text-[var(--cg-gold)]'
                    }`}
                  >
                    {formatTime(match.blackTimeRemainingMs)}
                  </div>
                </div>
              </div>

              {/* Arbiter Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => switchActiveClock(match.id)}
                  className="flex-1 py-1.5 px-3 rounded text-xs font-mono font-semibold flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-[var(--cg-ivory)] border border-white/10 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-[var(--cg-gold)]" />
                  <span>SWITCH CLOCK</span>
                </button>
                <button
                  onClick={() => onOpenResultModal(match)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded font-semibold text-xs bg-[var(--cg-gold)] hover:bg-[var(--cg-gold-bright)] text-[#0a0a0b] transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LOG RESULT</span>
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
