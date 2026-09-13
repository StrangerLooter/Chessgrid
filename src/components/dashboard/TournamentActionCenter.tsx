import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Users, 
  Shuffle, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  PlusCircle, 
  Upload, 
  ArrowRight,
  GitFork
} from 'lucide-react';

interface TournamentActionCenterProps {
  onOpenRegisterModal: () => void;
  onOpenBulkImportModal: () => void;
  onOpenShuffleModal: () => void;
}

export const TournamentActionCenter: React.FC<TournamentActionCenterProps> = ({
  onOpenRegisterModal,
  onOpenBulkImportModal,
  onOpenShuffleModal,
}) => {
  const { settings, stats, setActiveTab } = useTournament();

  const isSetup = settings.status === 'setup';
  const isCompleted = settings.status === 'completed';
  const hasLiveMatches = stats.liveMatchesCount > 0;
  const hasUpcomingMatches = stats.upcomingMatchesCount > 0;

  // If in progress and there are live or upcoming matches, the active match widget handles the display
  if (!isSetup && !isCompleted && (hasLiveMatches || hasUpcomingMatches)) {
    return null;
  }

  // 1. SETUP STATE: Arbiter Onboarding Checklist
  if (isSetup) {
    const slotsRemaining = stats.totalRequired - stats.totalRegistered;
    const registrationPercent = Math.min(100, Math.round((stats.totalRegistered / stats.totalRequired) * 100));

    return (
      <div
        className="glass-panel rounded-lg p-5 transition-all"
        style={{
          background: 'rgba(17, 17, 20, 0.85)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
        }}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h2
              className="text-base font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
              style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}
            >
              Arbiter Launchpad & Tournament Checklist
            </h2>
            <p className="text-xs text-[rgba(200,192,174,0.7)] mt-0.5">
              Complete the operational requirements below to commence Round 1.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]">
            Step {stats.isReadyToStart ? '2 of 2' : '1 of 2'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Contender Enrollment */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  1. Contender Roster
                </span>
                {stats.isReadyToStart ? (
                  <span className="text-[10px] font-mono text-[var(--cg-emerald-bright)] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    COMPLETE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[rgba(200,192,174,0.6)]">
                    {slotsRemaining} slots needed
                  </span>
                )}
              </div>

              <div className="text-sm font-semibold text-[var(--cg-ivory)] mb-1">
                {stats.totalRegistered} of {stats.totalRequired} Players Registered
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-[var(--cg-gold)] h-full transition-all duration-300"
                  style={{ width: `${registrationPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-[rgba(200,192,174,0.6)]">
                {stats.isReadyToStart 
                  ? 'All contender slots are filled and verified. Ready for pairing.' 
                  : 'Register players individually or bulk import from CSV/text.'}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
              <button
                onClick={onOpenRegisterModal}
                className="cg-btn cg-btn-primary flex-1 py-1.5 text-xs font-semibold justify-center"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Player</span>
              </button>
              <button
                onClick={onOpenBulkImportModal}
                className="cg-btn cg-btn-ghost flex-1 py-1.5 text-xs font-semibold justify-center border border-white/10"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--cg-gold)]" />
                <span>Bulk CSV</span>
              </button>
            </div>
          </div>

          {/* Step 2: Bracket Pairing & Seeding */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)] flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5" />
                  2. Round 1 Pairings
                </span>
                <span className={`text-[10px] font-mono uppercase ${stats.isReadyToStart ? 'text-emerald-400' : 'text-amber-400/70'}`}>
                  {stats.isReadyToStart ? 'READY TO LAUNCH' : 'LOCKED'}
                </span>
              </div>

              <div className="text-sm font-semibold text-[var(--cg-ivory)] mb-1">
                Deterministic Knockout Bracket
              </div>

              <p className="text-[11px] text-[rgba(200,192,174,0.6)] my-2">
                {stats.isReadyToStart 
                  ? `Generate seeds for ${stats.totalRequired} players across ${settings.maxBoards} physical boards with ${settings.defaultTimeControl.label} clocks.`
                  : `Bracket pairing unlocks automatically once all ${stats.totalRequired} contenders are registered.`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={onOpenShuffleModal}
                disabled={!stats.isReadyToStart}
                className={`w-full py-2 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  stats.isReadyToStart 
                    ? 'bg-[var(--cg-gold)] hover:bg-[var(--cg-gold-bright)] text-[#0a0a0b] shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                    : 'bg-white/5 text-[rgba(200,192,174,0.3)] border border-white/5 cursor-not-allowed'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{stats.isReadyToStart ? 'Shuffle & Pair Round 1' : `Register ${slotsRemaining} Players to Pair`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPLETED STATE: Tournament Champion Showcase
  if (isCompleted) {
    return (
      <div
        className="glass-panel rounded-lg p-5 text-center transition-all relative overflow-hidden"
        style={{
          background: 'rgba(17, 17, 20, 0.85)',
          border: '1px solid rgba(201, 168, 76, 0.35)',
          boxShadow: '0 0 25px rgba(201, 168, 76, 0.15)',
        }}
      >
        <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.5)] flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-amber-300" />
        </div>

        <h2
          className="text-xl font-bold text-[var(--cg-ivory)] uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-cinematic)' }}
        >
          Tournament Concluded
        </h2>

        {stats.championPlayer && (
          <div className="my-3">
            <span className="text-xs text-[var(--cg-gold)] uppercase tracking-wider font-semibold">Grand Champion</span>
            <div className="text-2xl font-bold text-[var(--cg-gold-bright)] mt-0.5">
              {stats.championPlayer.name}
            </div>
            <div className="text-xs text-[rgba(200,192,174,0.7)] font-mono mt-0.5">
              {stats.championPlayer.course} • Seed #{stats.championPlayer.seed}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => setActiveTab('bracket')}
            className="cg-btn cg-btn-primary text-xs font-semibold py-1.5 px-4"
          >
            <GitFork className="w-3.5 h-3.5 rotate-90" />
            <span>View Final Bracket</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className="cg-btn cg-btn-ghost text-xs font-semibold py-1.5 px-4 border border-white/10"
          >
            <span>Match Records</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. IN_PROGRESS with no live matches (Between Rounds or All Ready)
  return (
    <div
      className="glass-panel rounded-lg p-5 text-center transition-all"
      style={{
        background: 'rgba(17, 17, 20, 0.75)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
      }}
    >
      <Clock className="w-8 h-8 text-[var(--cg-gold)] mx-auto mb-2 opacity-80" />
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--cg-ivory)]">
        All Active Board Matches Concluded
      </h3>
      <p className="text-xs text-[rgba(200,192,174,0.7)] max-w-md mx-auto my-2">
        There are currently no active digital clocks running. Check the knockout bracket to review results or prepare the next round fixtures.
      </p>
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => setActiveTab('bracket')}
          className="cg-btn cg-btn-primary text-xs py-1.5 px-3.5"
        >
          <span>View Bracket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default TournamentActionCenter;
