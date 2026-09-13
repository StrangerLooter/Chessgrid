import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { getRoundNames } from '../../utils/bracketEngine';
import { CheckCircle2, ChevronRight, GitFork } from 'lucide-react';

export const RoundProgress: React.FC = () => {
  const { matches, settings, stats, setActiveTab } = useTournament();

  const roundNames = getRoundNames(settings.totalPlayers);

  return (
    <div
      className="glass-panel rounded-lg p-3.5 sm:p-4 transition-all"
      style={{
        background: 'rgba(17, 17, 20, 0.7)',
        border: '1px solid rgba(201, 168, 76, 0.16)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[var(--cg-gold)] rotate-90" />
          <h2
            className="text-xs font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}
          >
            Tournament Knockout Stages
          </h2>
          <span className="text-[11px] font-mono text-[rgba(200,192,174,0.6)]">
            ({stats.completedMatchesCount}/{settings.totalPlayers - 1} matches complete)
          </span>
        </div>

        <button
          onClick={() => setActiveTab('bracket')}
          className="text-xs font-medium text-[var(--cg-gold)] hover:text-[var(--cg-gold-bright)] flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>View Interactive Bracket</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* High-density horizontal round stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {roundNames.map((roundName, index) => {
          const roundMatches = matches.filter(m => m.roundIndex === index);
          const totalInRound = roundMatches.length;
          const completedInRound = roundMatches.filter(m => m.status === 'completed').length;
          const isCurrentActive = roundMatches.some(m => m.status === 'live' || m.status === 'ready');
          const isRoundDone = totalInRound > 0 && completedInRound === totalInRound;

          return (
            <div
              key={roundName}
              onClick={() => setActiveTab('bracket')}
              className={`p-2.5 rounded text-xs flex items-center justify-between cursor-pointer transition-all ${
                isRoundDone
                  ? 'bg-[rgba(34,166,122,0.1)] border border-[rgba(34,166,122,0.3)] text-[var(--cg-emerald-bright)]'
                  : isCurrentActive
                  ? 'bg-[rgba(201,168,76,0.14)] border border-[rgba(201,168,76,0.4)] text-[var(--cg-gold-bright)]'
                  : 'bg-white/5 border border-white/5 text-[rgba(200,192,174,0.5)] hover:border-white/15'
              }`}
            >
              <div className="truncate min-w-0 mr-2">
                <div className="font-semibold truncate text-[11px] uppercase tracking-wide">
                  {roundName}
                </div>
                <div className="text-[10px] font-mono text-[rgba(200,192,174,0.6)]">
                  {totalInRound > 0 ? `${completedInRound}/${totalInRound} Done` : 'Pending'}
                </div>
              </div>

              <div className="shrink-0">
                {isRoundDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrentActive ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--cg-gold)]" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--cg-gold)]" />
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/20 inline-block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoundProgress;
