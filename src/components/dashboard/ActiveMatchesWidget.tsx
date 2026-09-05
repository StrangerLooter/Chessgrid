import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface ActiveMatchesWidgetProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
}

export const ActiveMatchesWidget: React.FC<ActiveMatchesWidgetProps> = ({
  onOpenResultModal,
}) => {
  const { matches, players, switchActiveClock, setActiveTab } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  if (liveMatches.length === 0) {
    return null;
  }

  return (
    <div
      className="p-5 rounded"
      style={{
        background: 'rgba(17, 17, 20, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 168, 76, 0.25)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--cg-gold)' }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'var(--cg-gold)' }} />
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.35rem',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--cg-ivory)',
              margin: 0,
            }}
          >
            ACTIVE MATCHES ON BOARD
          </h2>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              color: 'var(--cg-gold-bright)',
              border: '1px solid rgba(201, 168, 76, 0.35)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {liveMatches.length} LIVE
          </span>
        </div>

        <button
          onClick={() => setActiveTab('live')}
          className="text-xs font-semibold flex items-center gap-1.5 transition-all"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--cg-gold)',
            letterSpacing: '0.05em',
          }}
        >
          <span>OPEN DIGITAL CLOCKS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveMatches.map(match => {
          const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
          const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

          const isWhiteActive = match.activeClock === 'white' && match.isTimerRunning;
          const isBlackActive = match.activeClock === 'black' && match.isTimerRunning;

          return (
            <div
              key={match.id}
              className="p-4 rounded transition-all flex flex-col justify-between"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.18)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      background: 'rgba(201, 168, 76, 0.15)',
                      color: 'var(--cg-gold)',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    BOARD {match.boardNumber || 1}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--cg-ivory)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {match.roundName}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1 text-[11px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(200, 192, 174, 0.5)' }}
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{match.timeControl.label}</span>
                </div>
              </div>

              {/* Clocks Pod */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                
                {/* White Clock */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  className="p-2.5 rounded text-center transition-all cursor-pointer select-none"
                  style={{
                    background: isWhiteActive ? 'rgba(201, 168, 76, 0.12)' : 'rgba(17, 17, 20, 0.6)',
                    border: isWhiteActive ? '1px solid var(--cg-gold)' : '1px solid rgba(201, 168, 76, 0.12)',
                    boxShadow: isWhiteActive ? '0 0 20px -4px rgba(201, 168, 76, 0.4)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1" style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}>
                      <span className="w-2 h-2 rounded-full bg-white border border-amber-300 inline-block" />
                      White
                    </span>
                    {isWhiteActive && (
                      <span
                        className="font-bold text-[9px] px-1 py-0.2 rounded"
                        style={{ background: 'var(--cg-gold)', color: '#0a0a0b' }}
                      >
                        TURN
                      </span>
                    )}
                  </div>
                  <div
                    className="truncate font-medium text-xs"
                    style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}
                  >
                    {whitePlayer?.name || 'White'}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-stat)',
                      fontSize: '1.75rem',
                      color: match.whiteTimeRemainingMs < 30000 ? 'var(--cg-red-bright)' : 'var(--cg-ivory)',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {formatTime(match.whiteTimeRemainingMs)}
                  </div>
                </div>

                {/* Black Clock */}
                <div
                  onClick={() => switchActiveClock(match.id)}
                  className="p-2.5 rounded text-center transition-all cursor-pointer select-none"
                  style={{
                    background: isBlackActive ? 'rgba(201, 168, 76, 0.12)' : 'rgba(17, 17, 20, 0.6)',
                    border: isBlackActive ? '1px solid var(--cg-gold)' : '1px solid rgba(201, 168, 76, 0.12)',
                    boxShadow: isBlackActive ? '0 0 20px -4px rgba(201, 168, 76, 0.4)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold flex items-center gap-1" style={{ color: 'var(--cg-gold)', fontFamily: 'var(--font-sans)' }}>
                      <span className="w-2 h-2 rounded-full bg-slate-950 border border-amber-400 inline-block" />
                      Black
                    </span>
                    {isBlackActive && (
                      <span
                        className="font-bold text-[9px] px-1 py-0.2 rounded"
                        style={{ background: 'var(--cg-gold)', color: '#0a0a0b' }}
                      >
                        TURN
                      </span>
                    )}
                  </div>
                  <div
                    className="truncate font-medium text-xs"
                    style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}
                  >
                    {blackPlayer?.name || 'Black'}
                  </div>
                  <div
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-stat)',
                      fontSize: '1.75rem',
                      color: match.blackTimeRemainingMs < 30000 ? 'var(--cg-red-bright)' : 'var(--cg-gold)',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {formatTime(match.blackTimeRemainingMs)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => switchActiveClock(match.id)}
                  className="flex-1 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    background: 'rgba(201, 168, 76, 0.08)',
                    border: '1px solid rgba(201, 168, 76, 0.25)',
                    color: 'var(--cg-ivory)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  SWITCH CLOCK (SPACE)
                </button>
                <button
                  onClick={() => onOpenResultModal(match)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--cg-gold-dim), var(--cg-gold))',
                    color: 'var(--cg-obsidian)',
                    boxShadow: '0 0 15px -3px rgba(201, 168, 76, 0.5)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  RESULT
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveMatchesWidget;
