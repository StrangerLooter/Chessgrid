import React from 'react';
import type { Match, Player } from '../../types/tournament';
import { Check } from 'lucide-react';
import { formatTime, formatResultBadge } from '../../utils/formatters';

interface BracketMatchNodeProps {
  match: Match;
  players: Player[];
  onClick: (match: Match) => void;
}

export const BracketMatchNode: React.FC<BracketMatchNodeProps> = ({ match, players, onClick }) => {
  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isReady = match.status === 'ready';

  const isWhiteWinner = match.winnerPlayerId === match.whitePlayerId && isCompleted;
  const isBlackWinner = match.winnerPlayerId === match.blackPlayerId && isCompleted;

  const resultBadge = formatResultBadge(match.resultType);

  return (
    <div
      onClick={() => onClick(match)}
      className="w-64 rounded cursor-pointer transition-all duration-300 hover:scale-[1.02] text-xs relative select-none"
      style={{
        background: isLive
          ? 'rgba(201, 168, 76, 0.12)'
          : isCompleted
          ? 'rgba(17, 17, 20, 0.85)'
          : isReady
          ? 'rgba(17, 17, 20, 0.75)'
          : 'rgba(10, 10, 11, 0.5)',
        border: isLive
          ? '1px solid var(--cg-gold)'
          : isCompleted
          ? '1px solid rgba(201, 168, 76, 0.25)'
          : isReady
          ? '1px solid rgba(201, 168, 76, 0.35)'
          : '1px dashed rgba(201, 168, 76, 0.15)',
        boxShadow: isLive
          ? '0 0 25px -5px rgba(201, 168, 76, 0.5)'
          : isCompleted
          ? '0 4px 20px rgba(0,0,0,0.5)'
          : 'none',
      }}
    >
      {/* Node Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 rounded-t text-[10px]"
        style={{
          borderBottom: '1px solid rgba(201, 168, 76, 0.15)',
          background: 'rgba(10, 10, 11, 0.8)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--cg-gold)' }}>
          {match.boardNumber && (
            <span>BOARD {match.boardNumber}</span>
          )}
          <span style={{ color: 'rgba(200, 192, 174, 0.5)' }}>• M#{match.matchNumber}</span>
        </div>

        <div>
          {isLive ? (
            <span
              className="flex items-center gap-1 font-bold uppercase animate-pulse"
              style={{ color: 'var(--cg-gold-bright)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              LIVE
            </span>
          ) : isCompleted ? (
            <span
              className="font-bold uppercase tracking-wider"
              style={{ color: 'var(--cg-emerald-bright)' }}
            >
              {resultBadge.label}
            </span>
          ) : isReady ? (
            <span style={{ color: 'var(--cg-gold)' }}>Ready</span>
          ) : (
            <span style={{ color: 'rgba(200, 192, 174, 0.3)' }}>Scheduled</span>
          )}
        </div>
      </div>

      {/* Players Rows */}
      <div className="p-2 space-y-1" style={{ fontFamily: 'var(--font-sans)' }}>
        
        {/* White Player Row */}
        <div
          className="flex items-center justify-between p-1.5 rounded transition-colors"
          style={{
            background: isWhiteWinner ? 'rgba(34, 166, 122, 0.15)' : 'transparent',
            color: isWhiteWinner
              ? 'var(--cg-emerald-bright)'
              : match.loserPlayerId === match.whitePlayerId && isCompleted
              ? 'rgba(200, 192, 174, 0.3)'
              : 'var(--cg-ivory)',
            fontWeight: isWhiteWinner ? 700 : 500,
          }}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shrink-0" />
            <span className="truncate">
              {whitePlayer?.name || (match.previousMatchIds?.whiteFromMatchId ? 'Winner of Prev' : 'TBD')}
            </span>
            {whitePlayer && (
              <span className="text-[10px] opacity-50 shrink-0 font-normal">#{whitePlayer.seed}</span>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {isLive && match.activeClock === 'white' && (
              <span className="text-[10px] font-mono text-amber-300 font-bold">
                {formatTime(match.whiteTimeRemainingMs)}
              </span>
            )}
            {isWhiteWinner && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
        </div>

        {/* Black Player Row */}
        <div
          className="flex items-center justify-between p-1.5 rounded transition-colors"
          style={{
            background: isBlackWinner ? 'rgba(34, 166, 122, 0.15)' : 'transparent',
            color: isBlackWinner
              ? 'var(--cg-emerald-bright)'
              : match.loserPlayerId === match.blackPlayerId && isCompleted
              ? 'rgba(200, 192, 174, 0.3)'
              : 'var(--cg-gold)',
            fontWeight: isBlackWinner ? 700 : 500,
          }}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block shrink-0" />
            <span className="truncate">
              {blackPlayer?.name || (match.previousMatchIds?.blackFromMatchId ? 'Winner of Prev' : 'TBD')}
            </span>
            {blackPlayer && (
              <span className="text-[10px] opacity-50 shrink-0 font-normal">#{blackPlayer.seed}</span>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {isLive && match.activeClock === 'black' && (
              <span className="text-[10px] font-mono text-amber-300 font-bold">
                {formatTime(match.blackTimeRemainingMs)}
              </span>
            )}
            {isBlackWinner && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketMatchNode;
