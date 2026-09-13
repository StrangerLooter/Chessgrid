import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Shuffle, 
  Trophy, 
  PlusCircle, 
  Clock,
  Plus
} from 'lucide-react';
import { formatFullDate } from '../../utils/formatters';

interface TournamentOverviewProps {
  onOpenShuffleModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenNewTournament?: () => void;
}

export const TournamentOverview: React.FC<TournamentOverviewProps> = ({
  onOpenShuffleModal,
  onOpenRegisterModal,
  onOpenNewTournament,
}) => {
  const { settings, stats, setActiveTab } = useTournament();

  const isSetup = settings.status === 'setup';
  const isCompleted = settings.status === 'completed';

  return (
    <div
      className="glass-panel rounded-lg p-5 sm:p-6 transition-all relative overflow-hidden"
      style={{
        background: 'rgba(15, 15, 18, 0.88)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        
        {/* Left: Tournament Identity & Real Operational Meta */}
        <div className="space-y-2.5 max-w-3xl min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            {isSetup ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase font-mono bg-[rgba(201,168,76,0.12)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]">
                <span className="w-2 h-2 rounded-full bg-[var(--cg-gold)]" />
                ROSTER SETUP ({stats.totalRegistered}/{stats.totalRequired})
              </span>
            ) : isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase font-mono bg-[rgba(201,168,76,0.2)] text-[var(--cg-gold-bright)] border border-[rgba(201,168,76,0.45)]">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                CONCLUDED • CHAMPION CROWNED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase font-mono bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border border-[rgba(34,166,122,0.35)]">
                <span className="w-2 h-2 rounded-full bg-[var(--cg-emerald-bright)] animate-pulse" />
                IN PROGRESS • {stats.currentRoundName.toUpperCase()}
              </span>
            )}

            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[rgba(200,192,174,0.7)] bg-white/5 border border-white/10">
              {settings.totalPlayers} PLAYERS
            </span>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-[rgba(200,192,174,0.7)] bg-white/5 border border-white/10">
              {settings.defaultTimeControl.label}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-semibold text-[var(--cg-ivory)] tracking-wide truncate"
            style={{
              fontFamily: 'var(--font-cinematic)',
              letterSpacing: '0.04em',
              margin: '0.15rem 0',
            }}
          >
            {settings.name}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-normal text-[rgba(200,192,174,0.75)]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{settings.collegeName}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{settings.venue}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{formatFullDate(settings.date)}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <UserCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Arbiter: <strong className="text-[var(--cg-ivory)] font-medium">{settings.organizerName}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: State-Contextual Arbiter Operations */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:w-72">
          {isSetup ? (
            <>
              <button
                onClick={onOpenRegisterModal}
                className="cg-btn cg-btn-primary w-full py-2 text-xs font-semibold justify-center shadow-[0_0_15px_rgba(201,168,76,0.25)]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register Contender ({stats.totalRegistered}/{stats.totalRequired})</span>
              </button>

              <button
                onClick={onOpenShuffleModal}
                disabled={!stats.isReadyToStart}
                className={`cg-btn w-full py-2 text-xs font-semibold justify-center transition-all ${
                  stats.isReadyToStart
                    ? 'cg-btn-emerald shadow-[0_0_15px_rgba(34,166,122,0.3)]'
                    : 'bg-white/5 text-[rgba(200,192,174,0.4)] border border-white/10 cursor-not-allowed'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                <span>{stats.isReadyToStart ? 'Shuffle & Start Round 1' : `Needs ${stats.totalRequired - stats.totalRegistered} More Players`}</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                onClick={() => setActiveTab('live')}
                className="cg-btn cg-btn-primary py-2 text-xs font-semibold justify-center shadow-[0_0_15px_rgba(201,168,76,0.2)]"
              >
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Arbiter Desk</span>
              </button>

              <button
                onClick={() => setActiveTab('bracket')}
                className="cg-btn cg-btn-ghost py-2 text-xs font-semibold justify-center border border-[rgba(201,168,76,0.25)]"
              >
                <Trophy className="w-3.5 h-3.5 text-[var(--cg-gold)]" />
                <span>Bracket</span>
              </button>
            </div>
          )}

          {onOpenNewTournament && (
            <button
              onClick={onOpenNewTournament}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-medium text-[var(--cg-gold)] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] hover:bg-[rgba(201,168,76,0.15)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Tournament Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentOverview;
