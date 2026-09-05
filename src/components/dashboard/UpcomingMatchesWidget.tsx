import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { Play, ArrowRight } from 'lucide-react';

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
      className="p-5 rounded"
      style={{
        background: 'rgba(17, 17, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 168, 76, 0.18)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
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
            UPCOMING MATCHES QUEUE
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              color: 'rgba(200, 192, 174, 0.55)',
              margin: '0.15rem 0 0',
              letterSpacing: '0.04em',
            }}
          >
            Scheduled fixtures ready for board allocation
          </p>
        </div>
        <button
          onClick={() => setActiveTab('matches')}
          className="text-xs font-semibold flex items-center gap-1.5 transition-all"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--cg-gold)',
            letterSpacing: '0.05em',
          }}
        >
          <span>VIEW ALL</span>
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
              className="p-4 rounded transition-all flex flex-col justify-between"
              style={{
                background: 'rgba(10, 10, 11, 0.65)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <div className="flex items-center justify-between text-xs mb-3">
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--cg-ivory)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  {match.roundName} {match.boardNumber ? `• Board ${match.boardNumber}` : ''}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{
                    background: isReady ? 'rgba(201, 168, 76, 0.15)' : 'rgba(201, 168, 76, 0.05)',
                    color: isReady ? 'var(--cg-gold)' : 'rgba(200, 192, 174, 0.4)',
                    border: `1px solid ${isReady ? 'rgba(201, 168, 76, 0.3)' : 'rgba(201, 168, 76, 0.1)'}`,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {isReady ? 'READY' : 'PENDING'}
                </span>
              </div>

              {/* Player Matchup */}
              <div
                className="p-3 rounded mb-3"
                style={{ background: 'rgba(17, 17, 20, 0.5)', border: '1px solid rgba(201, 168, 76, 0.08)' }}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block shrink-0" />
                    <span className="font-bold truncate max-w-[140px]" style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}>
                      {whitePlayer?.name || 'TBD'}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}>
                    {whitePlayer?.course || '-'}
                  </span>
                </div>

                <div className="text-center my-1">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.2 rounded"
                    style={{ background: 'rgba(201, 168, 76, 0.1)', color: 'var(--cg-gold)' }}
                  >
                    VS
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block shrink-0" />
                    <span className="font-bold truncate max-w-[140px]" style={{ color: 'var(--cg-gold)', fontFamily: 'var(--font-sans)' }}>
                      {blackPlayer?.name || 'TBD'}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}>
                    {blackPlayer?.course || '-'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isReady ? (
                <button
                  onClick={() => startMatch(match.id, match.boardNumber || 1)}
                  className="cg-btn cg-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem' }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start Match on Board {match.boardNumber || 1}
                </button>
              ) : (
                <button
                  onClick={() => onOpenMatchModal(match)}
                  className="cg-btn cg-btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem' }}
                >
                  View Bracket Slot
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
