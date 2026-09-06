import React from 'react';
import { 
  GitFork, 
  Clock, 
  Trophy, 
  Shuffle, 
  Tv, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface LandingFeaturesGridProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
}

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  highlight: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'bracket',
    icon: <GitFork className="w-6 h-6 rotate-90 text-[var(--cg-gold)]" />,
    tag: 'DYNAMIC PROGRESSION',
    title: 'Deterministic Knockout Bracket',
    description: 'Binary tree single-elimination generator with automatic winner propagation, walkover detection, and seed balancing from 2 up to 128 contenders.',
    badge: 'POWERS OF 2',
    badgeColor: 'rgba(201, 168, 76, 0.15)',
    highlight: 'Auto-routes contenders to downstream round matches with zero arbiter friction.',
  },
  {
    id: 'clocks',
    icon: <Clock className="w-6 h-6 text-emerald-400" />,
    tag: 'FIDE COMPLIANT',
    title: 'Digital Arbiter Clocks & Boards',
    description: 'Millisecond-precision digital timers supporting Bullet, Blitz, Rapid, and Classical increments with automatic flag-fall audio buzzers and arbiter overrides.',
    badge: '100ms TICK ENGINE',
    badgeColor: 'rgba(34, 166, 122, 0.15)',
    highlight: 'Real-time countdown synchronization across active board tables.',
  },
  {
    id: 'podium',
    icon: <Trophy className="w-6 h-6 text-amber-300" />,
    tag: 'CHAMPIONSHIP GLORY',
    title: 'Hall of Honor & Golden Podium',
    description: '3-tier cinematic golden podium recognizing Gold, Silver, and Bronze medalists alongside round-by-round departure cards for eliminated contenders.',
    badge: 'VICTORY RECOGNITION',
    badgeColor: 'rgba(201, 168, 76, 0.2)',
    highlight: 'Dynamic victory chimes and golden confetti celebrations upon tournament conclusion.',
  },
  {
    id: 'pairings',
    icon: <Shuffle className="w-6 h-6 text-amber-400" />,
    tag: 'FATE ENGINE',
    title: 'Pairing Chamber & Seeding',
    description: 'Cryptographically weighted seed matching and manual pairing overrides with instant player ID validation to prevent match conflicts.',
    badge: 'SWISS & KNOCKOUT',
    badgeColor: 'rgba(201, 168, 76, 0.12)',
    highlight: 'One-click automatic shuffle with seeded bracket distribution.',
  },
  {
    id: 'projector',
    icon: <Tv className="w-6 h-6 text-emerald-300" />,
    tag: 'ARENA BROADCAST',
    title: 'Stage Projector Broadcast HUD',
    description: 'High-contrast, distraction-free stage display mode formatted specifically for large venue screens, auditorium projectors, and live stream overlays.',
    badge: 'FULLSCREEN STREAM',
    badgeColor: 'rgba(34, 166, 122, 0.18)',
    highlight: 'Live match status, board assignments, and round countdown at 4K resolution.',
  },
  {
    id: 'reports',
    icon: <FileText className="w-6 h-6 text-indigo-400" />,
    tag: 'OFFICIAL AUDIT',
    title: 'Printable Certificates & CSV',
    description: 'Instant print-ready tournament standings, match sheets, official championship certificates, and full CSV roster import / export.',
    badge: 'OFFICIAL RECORDS',
    badgeColor: 'rgba(99, 102, 241, 0.15)',
    highlight: 'Comprehensive immutable audit logs for every round result.',
  },
];

export const LandingFeaturesGrid: React.FC<LandingFeaturesGridProps> = ({
  onCommandCenter,
  onOpenNewTournament,
}) => {
  return (
    <section
      id="cg-section-features"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      style={{ zIndex: 20 }}
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, rgba(34, 166, 122, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold)]">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>ENTERPRISE TOURNAMENT SUITE</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: 'var(--cg-ivory)',
            lineHeight: 1.1,
          }}
        >
          ENGINEERED FOR GRANDMASTERS & ARBITERS
        </h2>

        <p
          className="text-sm sm:text-base text-[rgba(200,192,174,0.7)]"
          style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}
        >
          From global arena stage screens to real-time precision clock control, ChessGrid provides the ultimate tournament infrastructure.
        </p>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {FEATURES.map(feat => (
          <div
            key={feat.id}
            onMouseEnter={() => soundEffects.playPieceMove()}
            className="group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 24, 0.85) 0%, rgba(12, 12, 14, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201, 168, 76, 0.18)',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
            }}
          >
            {/* Top Row: Icon + Badge */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                  style={{
                    background: 'rgba(201, 168, 76, 0.1)',
                    border: '1px solid rgba(201, 168, 76, 0.25)',
                  }}
                >
                  {feat.icon}
                </div>

                <span
                  className="px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider"
                  style={{
                    background: feat.badgeColor,
                    color: 'var(--cg-gold-bright)',
                    border: '1px solid rgba(201, 168, 76, 0.25)',
                  }}
                >
                  {feat.badge}
                </span>
              </div>

              {/* Tag & Title */}
              <div className="text-[10px] font-mono tracking-widest text-[rgba(200,192,174,0.5)] uppercase mb-1">
                {feat.tag}
              </div>

              <h3
                className="text-xl font-bold mb-3 transition-colors group-hover:text-[var(--cg-gold-bright)]"
                style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
              >
                {feat.title}
              </h3>

              {/* Description */}
              <p
                className="text-xs text-[rgba(200,192,174,0.7)] leading-relaxed mb-4"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {feat.description}
              </p>
            </div>

            {/* Bottom Highlight Strip */}
            <div
              className="pt-3.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-[var(--cg-gold)] font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{feat.highlight}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Launch Banner */}
      <div
        className="mt-16 p-8 sm:p-10 rounded-3xl relative overflow-hidden text-center flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(17, 17, 20, 0.95) 100%)',
          border: '1px solid rgba(201, 168, 76, 0.35)',
          boxShadow: '0 20px 50px -15px rgba(0,0,0,0.8), 0 0 30px rgba(201, 168, 76, 0.1)',
        }}
      >
        <div className="text-left space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--cg-gold-bright)] uppercase tracking-wider font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>GLOBAL CHESS TOURNAMENT PLATFORM</span>
          </div>
          <h3
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
          >
            Ready to Direct Your Tournament?
          </h3>
          <p className="text-xs sm:text-sm text-[rgba(200,192,174,0.7)]" style={{ fontFamily: 'var(--font-sans)' }}>
            Initialize a fresh tournament bracket, register contenders, and run live chess timers in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onOpenNewTournament && (
            <button
              onClick={() => {
                soundEffects.playVictoryChime();
                onOpenNewTournament();
              }}
              className="cg-btn cg-btn-ghost px-5 py-3"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Tournament</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playPieceMove();
              onCommandCenter();
            }}
            className="cg-btn cg-btn-primary px-7 py-3"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingFeaturesGrid;
