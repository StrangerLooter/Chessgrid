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
      className={`w-64 rounded cursor-pointer transition-all duration-300 hover:scale-[1.02] text-xs relative select-none ${
        isLive 
          ? 'glass-panel-active border-[var(--cg-gold)] gold-glow' 
          : isCompleted 
          ? 'glass-panel border-[rgba(201,168,76,0.25)] hover:border-[rgba(201,168,76,0.45)]' 
          : isReady 
          ? 'glass-panel border-[rgba(201,168,76,0.3)] hover:border-[rgba(201,168,76,0.5)]' 
          : 'glass-panel opacity-60 border-dashed border-white/10'
      }`}
    >
      {/* Node Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 rounded-t text-[10px] border-b border-white/10 bg-[#0a0a0b]/80"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        <div className="flex items-center gap-1.5 font-bold text-[var(--cg-gold)]">
          {match.boardNumber && (
            <span>B#{match.boardNumber}</span>
          )}
          <span className="text-[rgba(200,192,174,0.5)]">• M#{match.matchNumber}</span>
        </div>

        <div>
          {isLive ? (
            <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[var(--cg-emerald-bright)] text-[9px] px-1.5 py-0.2 rounded bg-[rgba(34,166,122,0.15)] border border-[rgba(34,166,122,0.4)] emerald-glow animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-emerald-bright)] inline-block" />
              LIVE
            </span>
          ) : isCompleted ? (
            <span
              className="font-bold uppercase tracking-wider text-[10px] text-[var(--cg-emerald-bright)]"
            >
              {resultBadge.label}
            </span>
          ) : isReady ? (
            <span className="text-[var(--cg-gold)] font-semibold text-[10px]">READY</span>
          ) : (
            <span className="text-[rgba(200,192,174,0.35)] text-[10px]">SCHEDULED</span>
          )}
        </div>
      </div>

      {/* Players Rows */}
      <div className="p-2.5 space-y-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
        
        {/* White Player Row */}
        <div
          className={`flex items-center justify-between p-1.5 rounded transition-colors ${
            isWhiteWinner 
              ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] font-bold border border-[rgba(34,166,122,0.3)]' 
              : match.loserPlayerId === match.whitePlayerId && isCompleted
              ? 'text-[rgba(200,192,174,0.3)] opacity-70'
              : 'text-[var(--cg-ivory)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shrink-0 shadow-sm" />
            <span className="truncate text-xs">
              {whitePlayer?.name || (match.previousMatchIds?.whiteFromMatchId ? 'Winner of M#' + match.previousMatchIds.whiteFromMatchId.slice(-2) : 'TBD')}
            </span>
            {whitePlayer && (
              <span className="text-[9px] font-mono opacity-60 shrink-0">#{whitePlayer.seed}</span>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {isLive && match.activeClock === 'white' && (
              <span className="text-[10px] font-mono text-[var(--cg-gold)] font-bold">
                {formatTime(match.whiteTimeRemainingMs)}
              </span>
            )}
            {isWhiteWinner && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            {isCompleted && match.winnerPlayerId && (
              <span className="text-[11px] font-mono font-bold">
                {isWhiteWinner ? (match.resultType === 'draw' ? '½' : '1') : (match.resultType === 'draw' ? '½' : '0')}
              </span>
            )}
          </div>
        </div>

        {/* Black Player Row */}
        <div
          className={`flex items-center justify-between p-1.5 rounded transition-colors ${
            isBlackWinner 
              ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] font-bold border border-[rgba(34,166,122,0.3)]' 
              : match.loserPlayerId === match.blackPlayerId && isCompleted
              ? 'text-[rgba(200,192,174,0.3)] opacity-70'
              : 'text-[var(--cg-gold)] font-medium'
          }`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-black border border-amber-400 inline-block shrink-0 shadow-sm" />
            <span className="truncate text-xs">
              {blackPlayer?.name || (match.previousMatchIds?.blackFromMatchId ? 'Winner of M#' + match.previousMatchIds.blackFromMatchId.slice(-2) : 'TBD')}
            </span>
            {blackPlayer && (
              <span className="text-[9px] font-mono opacity-60 shrink-0">#{blackPlayer.seed}</span>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5">
            {isLive && match.activeClock === 'black' && (
              <span className="text-[10px] font-mono text-[var(--cg-gold)] font-bold">
                {formatTime(match.blackTimeRemainingMs)}
              </span>
            )}
            {isBlackWinner && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            {isCompleted && match.winnerPlayerId && (
              <span className="text-[11px] font-mono font-bold">
                {isBlackWinner ? (match.resultType === 'draw' ? '½' : '1') : (match.resultType === 'draw' ? '½' : '0')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketMatchNode;
