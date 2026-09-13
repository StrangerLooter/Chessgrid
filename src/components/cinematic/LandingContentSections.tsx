import React from 'react';
import { 
  Users, 
  GitFork, 
  Clock, 
  Trophy, 
  History, 
  Gamepad2, 
  ArrowRight, 
  Plus, 
  Compass, 
  CheckCircle2,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface LandingContentSectionsProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
  onNavigatePlay?: () => void;
}

export const LandingContentSections: React.FC<LandingContentSectionsProps> = ({
  onCommandCenter,
  onOpenNewTournament,
  onNavigatePlay,
}) => {
  const { setActiveTab } = useTournament();

  const handleOpenTab = (tab: any) => {
    setActiveTab(tab);
    onCommandCenter();
  };

  const handlePlayClick = () => {
    if (onNavigatePlay) {
      onNavigatePlay();
    } else {
      window.history.pushState({}, '', '/play');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Section A: 4 Core Features
  const features = [
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: 'Manage Players',
      description: 'Register, edit, and organize tournament participants with seed ratings, academic details, and rapid bulk CSV import.',
      badge: 'ROSTER ENGINE',
    },
    {
      icon: <GitFork className="w-6 h-6 text-[var(--cg-gold)] rotate-90" />,
      title: 'Generate Knockout Brackets',
      description: 'Create and manage single-elimination tournament pairings with automated binary-tree advancement and walkover handling.',
      badge: 'BRACKET AUTOMATION',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'Control Live Matches',
      description: 'Track physical board allocation, millisecond digital timers, synchronized clock controls, and rapid result entry.',
      badge: 'LIVE ARBITER DESK',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-300" />,
      title: 'Track Tournament Progress',
      description: 'Follow winners, eliminated contenders, round progression, immutable audit history, and crown the grand champion.',
      badge: 'HALL OF HONOR',
    },
  ];

  // Section B: 6-Step Workflow
  const steps = [
    { number: '01', title: 'Register Players', desc: 'Add contenders individually or bulk import from CSV/text.' },
    { number: '02', title: 'Generate Bracket', desc: 'Create seeded or randomized single-elimination pairings.' },
    { number: '03', title: 'Assign Matches & Boards', desc: 'Deploy fixtures onto physical tables with time controls.' },
    { number: '04', title: 'Track Live Games', desc: 'Monitor active timers, flag falls, and board statuses.' },
    { number: '05', title: 'Record Match Results', desc: 'Log wins, draws, and playoffs with full undo rollback.' },
    { number: '06', title: 'Crown the Champion', desc: 'Conclude the finals and showcase the winner on the podium.' },
  ];

  // Section C: Product Areas
  const productAreas = [
    {
      id: 'dashboard',
      title: 'Command Center',
      desc: 'High-density operational dashboard for real-time tournament oversight.',
      icon: <LayoutDashboard className="w-5 h-5 text-[var(--cg-gold)]" />,
      action: () => handleOpenTab('dashboard'),
    },
    {
      id: 'players',
      title: 'Players Roster',
      desc: 'Comprehensive player table, seed management, and registration cards.',
      icon: <Users className="w-5 h-5 text-amber-400" />,
      action: () => handleOpenTab('players'),
    },
    {
      id: 'bracket',
      title: 'Knockout Bracket',
      desc: 'Interactive visual bracket tree with deterministic winner routing.',
      icon: <GitFork className="w-5 h-5 text-[var(--cg-gold)] rotate-90" />,
      action: () => handleOpenTab('bracket'),
    },
    {
      id: 'live',
      title: 'Live Matches & Clocks',
      desc: 'Multi-board digital chess clocks with arbiter controls.',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      action: () => handleOpenTab('live'),
    },
    {
      id: 'history',
      title: 'Tournament History',
      desc: 'Chronological match logs, printable reports, and result audit trail.',
      icon: <History className="w-5 h-5 text-indigo-400" />,
      action: () => handleOpenTab('history'),
    },
    {
      id: 'play',
      title: 'Play Chess Hub',
      desc: 'Play chess vs Stockfish or local 2-player with voice move controls.',
      icon: <Gamepad2 className="w-5 h-5 text-emerald-300" />,
      action: handlePlayClick,
    },
  ];

  return (
    <div className="relative z-20 space-y-28 sm:space-y-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ══════════════════════════════════════════════════════════
          SECTION A — WHAT CHESSGRID PROVIDES
          ══════════════════════════════════════════════════════════ */}
      <section id="cg-section-features" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold)]">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>ENTERPRISE TOURNAMENT PLATFORM</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            Everything Needed to Run a Collegiate Championship
          </h2>
          <p className="text-sm sm:text-base text-[rgba(200,192,174,0.8)] font-sans leading-relaxed">
            From player check-in to the final coronation, ChessGrid equips arbiters with deterministic tools built for high-stakes competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-xl border border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.45)] transition-all flex flex-col justify-between space-y-4"
              style={{
                background: 'rgba(15, 15, 18, 0.82)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)]">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--cg-gold)] bg-[rgba(201,168,76,0.08)] px-2 py-0.5 rounded border border-[rgba(201,168,76,0.2)]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--cg-ivory)] mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[rgba(200,192,174,0.75)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION B — HOW IT WORKS (6-STEP WORKFLOW)
          ══════════════════════════════════════════════════════════ */}
      <section id="cg-section-workflow" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[rgba(34,166,122,0.12)] border border-[rgba(34,166,122,0.3)] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OPERATIONAL WORKFLOW</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            How A Tournament Progresses
          </h2>
          <p className="text-sm sm:text-base text-[rgba(200,192,174,0.8)] font-sans leading-relaxed">
            A simple, deterministic 6-step lifecycle designed for arbiters, volunteers, and event directors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border border-[rgba(201,168,76,0.16)] flex flex-col justify-between"
              style={{
                background: 'rgba(15, 15, 18, 0.78)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div>
                <span className="text-2xl font-stat font-bold text-[var(--cg-gold)] block mb-1">
                  {step.number}
                </span>
                <h4 className="text-base font-bold text-[var(--cg-ivory)] mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-[rgba(200,192,174,0.7)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION C — PRODUCT AREAS PREVIEW
          ══════════════════════════════════════════════════════════ */}
      <section id="cg-section-product-areas" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold)]">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>MODULE DIRECTORY</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            Explore ChessGrid Modules
          </h2>
          <p className="text-sm sm:text-base text-[rgba(200,192,174,0.8)] font-sans leading-relaxed">
            Jump directly to any tournament console component or launch a practice game.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productAreas.map(area => (
            <div
              key={area.id}
              onClick={area.action}
              className="glass-panel p-5 rounded-xl border border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.45)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
              style={{
                background: 'rgba(15, 15, 18, 0.82)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-[var(--cg-gold)] transition-colors">
                    {area.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--cg-gold)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-base font-bold text-[var(--cg-ivory)] mb-1">
                  {area.title}
                </h4>
                <p className="text-xs text-[rgba(200,192,174,0.7)] leading-relaxed">
                  {area.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-xs font-semibold text-[var(--cg-gold)]">
                <span>Open Module</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION D — FINAL CTA
          ══════════════════════════════════════════════════════════ */}
      <section className="glass-panel p-8 sm:p-12 rounded-2xl border border-[rgba(201,168,76,0.3)] text-center space-y-6 max-w-4xl mx-auto shadow-[0_15px_50px_rgba(0,0,0,0.85)]"
        style={{
          background: 'rgba(15, 15, 18, 0.92)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="w-12 h-12 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.4)] flex items-center justify-center mx-auto text-[var(--cg-gold)]">
          <Trophy className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 
            className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            Ready to Organize Your Next Chess Tournament?
          </h2>
          <p className="text-xs sm:text-sm text-[rgba(200,192,174,0.8)] max-w-xl mx-auto leading-relaxed">
            Initialize an official knockout bracket, configure digital clocks, register competitors, and broadcast live results with zero setup complexity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCommandCenter}
            className="cg-btn cg-btn-primary w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase justify-center shadow-[0_0_25px_rgba(201,168,76,0.35)]"
          >
            <Compass className="w-4 h-4" />
            <span>OPEN COMMAND CENTER</span>
          </button>

          {onOpenNewTournament && (
            <button
              onClick={onOpenNewTournament}
              className="cg-btn cg-btn-ghost w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase justify-center border border-[rgba(201,168,76,0.4)] text-[var(--cg-gold)]"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE TOURNAMENT</span>
            </button>
          )}
        </div>
      </section>

    </div>
  );
};

export default LandingContentSections;
