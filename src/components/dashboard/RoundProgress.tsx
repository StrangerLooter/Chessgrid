import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { getRoundNames } from '../../utils/bracketEngine';
import { CheckCircle2, Circle } from 'lucide-react';

export const RoundProgress: React.FC = () => {
  const { matches, settings, stats } = useTournament();

  const roundNames = getRoundNames(settings.totalPlayers);

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
            KNOCKOUT PROGRESSION ARCHITECTURE
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
            The path to the {settings.name} crown
          </p>
        </div>

        <span
          className="text-xs font-bold"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--cg-gold)',
            letterSpacing: '0.05em',
          }}
        >
          {stats.completedMatchesCount} / {settings.totalPlayers - 1} MATCHES CONCLUDED
        </span>
      </div>

      {/* Rounds Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roundNames.map((roundName, index) => {
          const roundMatches = matches.filter(m => m.roundIndex === index);
          const totalInRound = roundMatches.length;
          const completedInRound = roundMatches.filter(m => m.status === 'completed').length;
          const isCurrentActive = roundMatches.some(m => m.status === 'live' || m.status === 'ready');
          const isRoundDone = totalInRound > 0 && completedInRound === totalInRound;

          return (
            <div
              key={roundName}
              className="p-3.5 rounded transition-all"
              style={{
                background: isRoundDone
                  ? 'rgba(34, 166, 122, 0.08)'
                  : isCurrentActive
                  ? 'rgba(201, 168, 76, 0.12)'
                  : 'rgba(10, 10, 11, 0.5)',
                border: isRoundDone
                  ? '1px solid rgba(34, 166, 122, 0.35)'
                  : isCurrentActive
                  ? '1px solid rgba(201, 168, 76, 0.5)'
                  : '1px solid rgba(201, 168, 76, 0.1)',
                boxShadow: isCurrentActive ? '0 0 20px -5px rgba(201, 168, 76, 0.3)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isRoundDone
                      ? 'var(--cg-emerald-bright)'
                      : isCurrentActive
                      ? 'var(--cg-gold-bright)'
                      : 'rgba(200, 192, 174, 0.5)',
                    textTransform: 'uppercase',
                  }}
                >
                  {roundName}
                </span>

                {isRoundDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrentActive ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--cg-gold)' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--cg-gold)' }} />
                  </span>
                ) : (
                  <Circle className="w-3 h-3" style={{ color: 'rgba(200,192,174,0.2)' }} />
                )}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'rgba(200, 192, 174, 0.5)',
                }}
              >
                {totalInRound === 0 ? 'Pending' : `${completedInRound}/${totalInRound} completed`}
              </div>

              {/* Progress track */}
              <div
                className="w-full rounded-full h-1 mt-2.5 overflow-hidden"
                style={{ background: 'rgba(201, 168, 76, 0.1)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${totalInRound > 0 ? (completedInRound / totalInRound) * 100 : 0}%`,
                    background: isRoundDone 
                      ? 'var(--cg-emerald-bright)' 
                      : 'linear-gradient(90deg, var(--cg-gold-dim), var(--cg-gold))',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoundProgress;
