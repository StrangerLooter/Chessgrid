import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { Play, ArrowRight, Clock } from 'lucide-react';

interface UpcomingMatchesWidgetProps {
  onOpenMatchModal: (match: Match) => void;
}

export const UpcomingMatchesWidget: React.FC<UpcomingMatchesWidgetProps> = ({
  onOpenMatchModal,
}) => {
  const { matches, players, startMatch, setActiveTab } = useTournament();

  const upcomingMatches = matches
    .filter(m => m.status === 'ready' || m.status === 'upcoming')
    .slice(0, 4);

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  if (upcomingMatches.length === 0) {
    return null;
  }

  return (
    <div
      className="glass-panel rounded-lg p-5 transition-all"
      style={{
        background: 'rgba(17, 17, 20, 0.75)',
        border: '1px solid rgba(201, 168, 76, 0.18)',
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--cg-gold)]" />
          <h2
            className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}
          >
            Matches On Deck ({upcomingMatches.length})
          </h2>
          <span className="text-[11px] text-[rgba(200,192,174,0.6)]">
            Ready for board allocation
          </span>
        </div>

        <button
          onClick={() => setActiveTab('matches')}
          className="text-xs font-semibold flex items-center gap-1 text-[var(--cg-gold)] hover:text-[var(--cg-gold-bright)] transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <span>All Fixtures</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {upcomingMatches.map(match => {
          const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
          const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;
          const isReady = !!(whitePlayer && blackPlayer);

          return (
            <div
              key={match.id}
              className="p-3.5 rounded-lg flex flex-col justify-between transition-all"
              style={{
                background: 'rgba(10, 10, 12, 0.65)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-semibold text-xs text-[var(--cg-ivory)]">
                  {match.roundName} {match.boardNumber ? `• Board ${match.boardNumber}` : ''}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isReady 
                      ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border border-[rgba(34,166,122,0.3)]' 
                      : 'bg-white/5 text-[rgba(200,192,174,0.5)] border border-white/10'
                  }`}
                >
                  {isReady ? 'READY' : 'PENDING'}
                </span>
              </div>

              {/* Player Matchup */}
              <div className="p-2.5 rounded mb-3 bg-white/5 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shrink-0" />
                    <span className="font-medium truncate text-[var(--cg-ivory)]">
                      {whitePlayer?.name || 'TBD'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[rgba(200,192,174,0.6)] font-mono shrink-0 ml-2">
                    {whitePlayer ? `Seed #${whitePlayer.seed}` : '-'}
                  </span>
                </div>

                <div className="text-center text-[9px] font-mono text-[var(--cg-gold)] opacity-70">
                  VS
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block shrink-0" />
                    <span className="font-medium truncate text-[var(--cg-gold)]">
                      {blackPlayer?.name || 'TBD'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[rgba(200,192,174,0.6)] font-mono shrink-0 ml-2">
                    {blackPlayer ? `Seed #${blackPlayer.seed}` : '-'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isReady ? (
                <button
                  onClick={() => startMatch(match.id, match.boardNumber || 1)}
                  className="cg-btn cg-btn-primary w-full py-1.5 text-xs font-semibold justify-center"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start on Board {match.boardNumber || 1}</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenMatchModal(match)}
                  className="cg-btn cg-btn-ghost w-full py-1.5 text-xs font-semibold justify-center border border-white/10"
                >
                  <span>View Bracket Slot</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMatchesWidget;
