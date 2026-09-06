import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Shuffle, 
  Trophy, 
  Tv, 
  PlusCircle, 
  Printer,
  Clock,
  Crown
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
  const { settings, stats, setActiveTab, setIsProjectorMode } = useTournament();

  return (
    <div
      className="relative overflow-hidden rounded p-6 sm:p-8"
      style={{
        background: 'rgba(17, 17, 20, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(201, 168, 76, 0.22)',
        boxShadow: '0 16px 50px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(201, 168, 76, 0.1)',
      }}
    >
      {/* Subtle ambient light gradient */}
      <div
        className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(26,122,94,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Tournament Details & College Branding */}
        <div className="space-y-3.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="cg-eyebrow">
              <span className="dot dot-ember" aria-hidden="true" />
              <span style={{ color: 'var(--cg-gold)', fontWeight: 700 }}>
                {settings.academicSession} KNOCKOUT TOURNAMENT
              </span>
            </div>

            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(201, 168, 76, 0.08)',
                color: 'var(--cg-ivory)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {settings.totalPlayers} PLAYERS
            </span>

            {stats.championPlayer && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-gold-bright)',
                  border: '1px solid rgba(201, 168, 76, 0.5)',
                  boxShadow: '0 0 15px -3px rgba(201, 168, 76, 0.4)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                CHAMPION CROWNED
              </span>
            )}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--cg-ivory)',
              lineHeight: 1.1,
              margin: '0.25rem 0',
              textShadow: '0 0 40px rgba(201,168,76,0.15)',
            }}
          >
            {settings.name}
          </h1>

          <div
            className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-medium"
            style={{ color: 'rgba(200, 192, 174, 0.7)', fontFamily: 'var(--font-sans)' }}
          >
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.collegeName} • <strong style={{ color: 'var(--cg-ivory)' }}>{settings.departmentName}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{settings.venue}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{formatFullDate(settings.date)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Coordinator: <strong style={{ color: 'var(--cg-gold)' }}>{settings.organizerName}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Action Controls & Arbiter Console */}
        <div className="flex flex-col gap-3 shrink-0 lg:w-72">
          {settings.status === 'setup' ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenRegisterModal}
                className="cg-btn cg-btn-primary w-full"
                style={{ justifyContent: 'center' }}
              >
                <PlusCircle className="w-4 h-4" />
                Register Contender ({stats.totalRegistered}/{stats.totalRequired})
              </button>

              <button
                onClick={onOpenShuffleModal}
                disabled={!stats.isReadyToStart}
                className={`cg-btn w-full ${stats.isReadyToStart ? 'cg-btn-emerald' : ''}`}
                style={{
                  justifyContent: 'center',
                  background: stats.isReadyToStart ? undefined : 'rgba(20, 20, 24, 0.6)',
                  color: stats.isReadyToStart ? undefined : 'rgba(200, 192, 174, 0.3)',
                  border: `1px solid ${stats.isReadyToStart ? 'rgba(34, 166, 122, 0.4)' : 'rgba(201, 168, 76, 0.1)'}`,
                  cursor: stats.isReadyToStart ? 'pointer' : 'not-allowed',
                }}
              >
                <Shuffle className="w-4 h-4" />
                Shuffle & Start Round 1
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('bracket')}
                className="cg-btn cg-btn-primary"
                style={{ justifyContent: 'center' }}
              >
                <Trophy className="w-4 h-4" />
                Bracket
              </button>

              <button
                onClick={() => setActiveTab('live')}
                className="cg-btn cg-btn-ghost"
                style={{ justifyContent: 'center' }}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                Clocks
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProjectorMode(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all"
              style={{
                background: 'rgba(201, 168, 76, 0.08)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                color: 'var(--cg-gold)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.08em',
              }}
            >
              <Tv className="w-3.5 h-3.5" />
              PROJECTOR
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all"
              style={{
                background: 'rgba(10, 10, 11, 0.6)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
                color: 'rgba(200, 192, 174, 0.7)',
                fontFamily: 'var(--font-sans)',
              }}
              title="Print Tournament Report"
            >
              <Printer className="w-3.5 h-3.5" />
              PRINT
            </button>
          </div>

          {onOpenNewTournament && (
            <button
              onClick={onOpenNewTournament}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-semibold transition-all bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold-bright)] hover:bg-[rgba(201,168,76,0.22)]"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>CREATE NEW TOURNAMENT</span>
            </button>
          )}

          {/* Stitch System Status Strip */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[rgba(200,192,174,0.6)]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-emerald-bright)] animate-pulse" />
              <span>DGT SYNC: <strong className="text-[var(--cg-emerald-bright)]">ONLINE</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-gold)]" />
              <span>EVAL: <strong className="text-[var(--cg-gold)]">FIDE GM</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOverview;
