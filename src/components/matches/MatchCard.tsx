import React from 'react';
import type { Match, Player } from '../../types/tournament';
import { Play, Pause, Award } from 'lucide-react';
import { formatTime, formatResultBadge } from '../../utils/formatters';

interface MatchCardProps {
  match: Match;
  players: Player[];
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
  onStartMatch?: (matchId: string) => void;
  onPauseMatch?: (matchId: string) => void;
  onResumeMatch?: (matchId: string) => void;
  onSwitchClock?: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  players,
  onOpenMatchModal,
  onOpenResultModal,
  onStartMatch,
  onPauseMatch,
  onResumeMatch,
}) => {
  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isReady = match.status === 'ready';

  const badge = formatResultBadge(match.resultType);

  return (
    <div
      className="p-4 sm:p-5 rounded transition-all duration-300 flex flex-col justify-between"
      style={{
        background: isLive
          ? 'rgba(201, 168, 76, 0.1)'
          : isCompleted
          ? 'rgba(17, 17, 20, 0.75)'
          : isReady
          ? 'rgba(17, 17, 20, 0.85)'
          : 'rgba(10, 10, 11, 0.55)',
        border: isLive
          ? '1px solid var(--cg-gold)'
          : isCompleted
          ? '1px solid rgba(201, 168, 76, 0.2)'
          : isReady
          ? '1px solid rgba(201, 168, 76, 0.35)'
          : '1px solid rgba(201, 168, 76, 0.1)',
        boxShadow: isLive ? '0 0 25px -6px rgba(201, 168, 76, 0.4)' : '0 6px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              color: 'var(--cg-ivory)',
              fontSize: '0.8rem',
            }}
          >
            {match.roundName}
          </span>
          <span className="font-mono text-[11px]" style={{ color: 'var(--cg-gold)' }}>
            #{match.matchNumber}
          </span>
          {match.boardNumber && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                background: 'rgba(201, 168, 76, 0.12)',
                color: 'var(--cg-gold)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              BOARD {match.boardNumber}
            </span>
          )}
        </div>

        <div>
          {isLive ? (
            <span
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse"
              style={{
                background: 'rgba(201, 168, 76, 0.2)',
                color: 'var(--cg-gold-bright)',
                border: '1px solid rgba(201, 168, 76, 0.5)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              LIVE
            </span>
          ) : isCompleted ? (
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {badge.label}
            </span>
          ) : isReady ? (
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-bold"
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                color: 'var(--cg-gold)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              READY
            </span>
          ) : (
            <span
              className="px-2.5 py-0.5 rounded text-[10px]"
              style={{
                background: 'rgba(201, 168, 76, 0.05)',
                color: 'rgba(200, 192, 174, 0.4)',
                border: '1px solid rgba(201, 168, 76, 0.1)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              UPCOMING
            </span>
          )}
        </div>
      </div>

      {/* Players Matchup Pod */}
      <div className="space-y-1.5 mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
        
        {/* White */}
        <div
          className="flex items-center justify-between p-2 rounded transition-colors"
          style={{
            background: match.winnerPlayerId === match.whitePlayerId && isCompleted
              ? 'rgba(34, 166, 122, 0.15)'
              : 'rgba(10, 10, 11, 0.6)',
            color: match.winnerPlayerId === match.whitePlayerId && isCompleted
              ? 'var(--cg-emerald-bright)'
              : match.loserPlayerId === match.whitePlayerId && isCompleted
              ? 'rgba(200, 192, 174, 0.3)'
              : 'var(--cg-ivory)',
            fontWeight: match.winnerPlayerId === match.whitePlayerId && isCompleted ? 700 : 500,
          }}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shrink-0" />
            <span className="text-xs truncate">
              {whitePlayer?.name || 'TBD (Winner of Prev)'}
            </span>
            {whitePlayer && <span className="text-[10px] opacity-50">({whitePlayer.rollNumber})</span>}
          </div>

          <div className="font-mono text-xs font-bold shrink-0">
            {isLive ? formatTime(match.whiteTimeRemainingMs) : (match.winnerPlayerId === match.whitePlayerId ? '1' : match.loserPlayerId === match.whitePlayerId ? '0' : '-')}
          </div>
        </div>

        {/* Black */}
        <div
          className="flex items-center justify-between p-2 rounded transition-colors"
          style={{
            background: match.winnerPlayerId === match.blackPlayerId && isCompleted
              ? 'rgba(34, 166, 122, 0.15)'
              : 'rgba(10, 10, 11, 0.6)',
            color: match.winnerPlayerId === match.blackPlayerId && isCompleted
              ? 'var(--cg-emerald-bright)'
              : match.loserPlayerId === match.blackPlayerId && isCompleted
              ? 'rgba(200, 192, 174, 0.3)'
              : 'var(--cg-gold)',
            fontWeight: match.winnerPlayerId === match.blackPlayerId && isCompleted ? 700 : 500,
          }}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block shrink-0" />
            <span className="text-xs truncate">
              {blackPlayer?.name || 'TBD (Winner of Prev)'}
            </span>
            {blackPlayer && <span className="text-[10px] opacity-50">({blackPlayer.rollNumber})</span>}
          </div>

          <div className="font-mono text-xs font-bold shrink-0">
            {isLive ? formatTime(match.blackTimeRemainingMs) : (match.winnerPlayerId === match.blackPlayerId ? '1' : match.loserPlayerId === match.blackPlayerId ? '0' : '-')}
          </div>
        </div>
      </div>

      {/* Result note / Tie-break details if present */}
      {match.resultDetails && (
        <div
          className="text-[11px] mb-3 italic truncate"
          style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}
        >
          Note: {match.resultDetails}
        </div>
      )}

      {/* Footer Action Bar */}
      <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(201, 168, 76, 0.12)' }}>
        {isLive ? (
          <>
            {match.isTimerRunning ? (
              <button
                onClick={() => onPauseMatch && onPauseMatch(match.id)}
                className="flex-1 cg-btn cg-btn-ghost"
                style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
              >
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                Pause
              </button>
            ) : (
              <button
                onClick={() => onResumeMatch && onResumeMatch(match.id)}
                className="flex-1 cg-btn cg-btn-emerald"
                style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume
              </button>
            )}

            <button
              onClick={() => onOpenResultModal(match)}
              className="flex-1 cg-btn cg-btn-primary"
              style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
            >
              <Award className="w-3.5 h-3.5" />
              Result
            </button>
          </>
        ) : isReady ? (
          <>
            <button
              onClick={() => onStartMatch && onStartMatch(match.id)}
              className="flex-1 cg-btn cg-btn-primary"
              style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start
            </button>
            <button
              onClick={() => onOpenResultModal(match)}
              className="flex-1 cg-btn cg-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
            >
              Score
            </button>
          </>
        ) : (
          <button
            onClick={() => onOpenMatchModal(match)}
            className="w-full cg-btn cg-btn-ghost"
            style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
          >
            {isCompleted ? 'View Result' : 'Match Details'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
