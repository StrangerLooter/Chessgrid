import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match } from '../../types/tournament';
import { ChessTimer } from './ChessTimer';
import { Clock, PlayCircle, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface LiveMatchesViewProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
}

export const LiveMatchesView: React.FC<LiveMatchesViewProps> = ({
  onOpenResultModal,
}) => {
  const { matches, stats, setActiveTab, startMatch } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const readyMatches = matches.filter(m => m.status === 'ready');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Active Counters */}
      <div
        className="p-6 rounded flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          background: 'rgba(17, 17, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(201, 168, 76, 0.22)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5" style={{ color: 'var(--cg-gold)' }} />
            <h2
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: '1.5rem',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: 'var(--cg-ivory)',
                margin: 0,
              }}
            >
              LIVE COMBAT CONTROL ROOM
            </h2>
          </div>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.6)',
            }}
          >
            Real-time digital clocks, turn switching, time adjustments, and match arbitration
          </p>
        </div>

        {/* Live Counters Pill Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.35)',
              color: 'var(--cg-gold-bright)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--cg-gold)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--cg-gold)' }} />
            </span>
            <span>{stats.liveMatchesCount} LIVE MATCHES</span>
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold"
            style={{
              background: 'rgba(30, 79, 255, 0.1)',
              border: '1px solid rgba(30, 79, 255, 0.3)',
              color: '#6688ff',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{stats.upcomingMatchesCount} UPCOMING</span>
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold"
            style={{
              background: 'rgba(34, 166, 122, 0.12)',
              border: '1px solid rgba(34, 166, 122, 0.3)',
              color: 'var(--cg-emerald-bright)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.completedMatchesCount} COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Live Clocks Grid */}
      {liveMatches.length === 0 ? (
        <div
          className="p-12 text-center rounded space-y-3"
          style={{
            background: 'rgba(17, 17, 20, 0.5)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div
            className="w-12 h-12 rounded flex items-center justify-center mx-auto"
            style={{
              background: 'rgba(201, 168, 76, 0.1)',
              color: 'var(--cg-gold)',
            }}
          >
            <PlayCircle className="w-6 h-6" />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.4rem',
              color: 'var(--cg-ivory)',
              margin: 0,
            }}
          >
            No Live Matches Running
          </h3>
          <p
            className="text-xs max-w-md mx-auto"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.5)',
            }}
          >
            All current boards are free or matches are concluded. Select a ready match below to initialize the digital chess clock.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {liveMatches.map(match => (
            <ChessTimer
              key={match.id}
              match={match}
              onOpenResultModal={onOpenResultModal}
            />
          ))}
        </div>
      )}

      {/* Ready to Start Queue */}
      {readyMatches.length > 0 && (
        <div
          className="p-6 rounded space-y-4"
          style={{
            background: 'rgba(17, 17, 20, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(201, 168, 76, 0.18)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '1.25rem',
                  color: 'var(--cg-ivory)',
                  margin: 0,
                }}
              >
                Matches Ready to Launch
              </h3>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{
                  background: 'rgba(201, 168, 76, 0.15)',
                  color: 'var(--cg-gold)',
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {readyMatches.length} WAITING
              </span>
            </div>

            <button
              onClick={() => setActiveTab('boards')}
              className="text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--cg-gold)',
                letterSpacing: '0.05em',
              }}
            >
              <span>MANAGE BOARDS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {readyMatches.map(match => (
              <div
                key={match.id}
                className="p-4 rounded flex items-center justify-between"
                style={{
                  background: 'rgba(10, 10, 11, 0.65)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--cg-ivory)',
                    }}
                  >
                    {match.roundName} #{match.matchNumber}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(200, 192, 174, 0.5)',
                    }}
                  >
                    Board {match.boardNumber || 1} • {match.timeControl.label}
                  </div>
                </div>

                <button
                  onClick={() => startMatch(match.id, match.boardNumber || 1)}
                  className="cg-btn cg-btn-primary"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.65rem' }}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatchesView;
