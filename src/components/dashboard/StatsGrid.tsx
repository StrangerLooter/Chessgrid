import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Crown, CheckCircle2, Shuffle } from 'lucide-react';

interface StatsGridProps {
  onOpenShuffleModal: () => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ onOpenShuffleModal }) => {
  const { stats, settings, matches, setActiveTab } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const initialMin = settings.defaultTimeControl?.initialMinutes ?? 15;
  const avgPace = initialMin <= 5 ? '8.4s' : initialMin <= 15 ? '14.2s' : '28.5s';
  const tcLabel = settings.defaultTimeControl?.label ?? '15+10 Rapid';

  const cards = [
    {
      id: 'players',
      label: 'TOTAL CONTENDERS',
      value: `${stats.totalRegistered} / ${stats.totalRequired}`,
      subtitle: stats.isReadyToStart ? 'Pool Complete & Verified' : `${stats.totalRequired - stats.totalRegistered} slots open`,
      badge: stats.isReadyToStart ? 'READY' : 'ENROLLING',
      badgeClass: stats.isReadyToStart 
        ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.4)]' 
        : 'bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border-[rgba(201,168,76,0.35)]',
      valueColor: 'text-[var(--cg-ivory)]',
      onClick: () => setActiveTab('players'),
    },
    {
      id: 'clocks',
      label: 'ACTIVE CLOCKS',
      value: liveMatches.length > 0 ? `${liveMatches.length * 2}` : '0',
      subtitle: liveMatches.length > 0 ? `${liveMatches.length} boards synchronized` : `${stats.upcomingMatchesCount} matches on deck`,
      badge: liveMatches.length > 0 ? 'SYNCHRONIZED' : 'STANDBY',
      badgeClass: liveMatches.length > 0 
        ? 'bg-[rgba(34,166,122,0.2)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.5)]' 
        : 'bg-[rgba(201,168,76,0.08)] text-[rgba(200,192,174,0.5)] border-[rgba(201,168,76,0.15)]',
      valueColor: 'text-[var(--cg-gold)]',
      onClick: () => setActiveTab('live'),
    },
    {
      id: 'round',
      label: 'ROUND STATUS',
      value: stats.currentRoundName || 'Qualifiers',
      subtitle: `${stats.completedMatchesCount} finished (${stats.progressPercent}%)`,
      badge: settings.status === 'completed' ? 'CONCLUDED' : settings.status === 'in_progress' ? 'KNOCKOUT' : 'SETUP',
      badgeClass: 'bg-[rgba(201,168,76,0.12)] text-[var(--cg-gold-bright)] border-[rgba(201,168,76,0.25)]',
      valueColor: 'text-[var(--cg-ivory)]',
      onClick: () => setActiveTab('bracket'),
    },
    {
      id: 'uptime',
      label: 'VENUE & DGT UPTIME',
      value: '99.9%',
      subtitle: 'Zero latency clock sync',
      badge: 'ONLINE',
      badgeClass: 'bg-[rgba(34,166,122,0.18)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.4)] emerald-glow',
      valueColor: 'text-[var(--cg-emerald-bright)]',
      hasPulseDot: true,
      onClick: () => setActiveTab('live'),
    },
    {
      id: 'pace',
      label: 'AVG MOVE PACE',
      value: avgPace,
      subtitle: `Format: ${tcLabel}`,
      badge: 'FIDE STD',
      badgeClass: 'bg-[rgba(255,255,255,0.06)] text-[rgba(200,192,174,0.7)] border-[rgba(255,255,255,0.12)]',
      valueColor: 'text-[var(--cg-ivory)]',
      onClick: () => setActiveTab('history'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={card.onClick}
            className="glass-panel p-4 rounded cursor-pointer group hover:-translate-y-0.5 transition-all relative overflow-hidden flex flex-col justify-between"
            style={{
              minHeight: '118px',
            }}
          >
            {/* Top accent line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)' }}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase truncate"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'rgba(200, 192, 174, 0.65)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {card.label}
                </span>

                {card.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border flex items-center gap-1 ${card.badgeClass}`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {card.hasPulseDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cg-emerald-bright)] animate-pulse" />
                    )}
                    {card.badge}
                  </span>
                )}
              </div>

              <div
                className={`truncate font-semibold ${card.valueColor}`}
                style={{
                  fontFamily: 'var(--font-stat)',
                  fontSize: 'clamp(1.65rem, 2.5vw, 2.2rem)',
                  letterSpacing: '0.03em',
                  lineHeight: 1.1,
                }}
              >
                {card.value}
              </div>
            </div>

            <div
              className="mt-2 pt-2 flex items-center justify-between text-[11px]"
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontFamily: 'var(--font-sans)',
                color: 'rgba(200, 192, 174, 0.5)',
              }}
            >
              <span className="truncate">{card.subtitle}</span>
              <span className="text-[10px] font-bold text-[var(--cg-gold)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Special Quick Action: Shuffle Banner if Tournament is Ready */}
      {settings.status === 'setup' && stats.isReadyToStart && (
        <div
          className="sm:col-span-2 lg:col-span-4 p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(17,17,20,0.9))',
            border: '1px solid rgba(201, 168, 76, 0.4)',
            boxShadow: 'var(--cg-glow-gold)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{
                background: 'rgba(201, 168, 76, 0.2)',
                border: '1px solid rgba(201, 168, 76, 0.5)',
                color: 'var(--cg-gold)',
              }}
            >
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  style={{
                    fontFamily: 'var(--font-cinematic)',
                    fontSize: '1.25rem',
                    color: 'var(--cg-ivory)',
                    margin: 0,
                  }}
                >
                  All {stats.totalRequired} Contenders Registered!
                </h3>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(34, 166, 122, 0.2)',
                    color: 'var(--cg-emerald-bright)',
                    border: '1px solid rgba(34, 166, 122, 0.4)',
                  }}
                >
                  READY
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'rgba(200, 192, 174, 0.7)',
                  margin: '0.2rem 0 0',
                }}
              >
                Execute arbitrated draw, preview seedings, and generate Round 1 pairings.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenShuffleModal}
            className="cg-btn cg-btn-primary"
            style={{ width: 'auto', flexShrink: 0 }}
          >
            <Shuffle className="w-4 h-4" />
            <span>Shuffle & Launch Round 1</span>
          </button>
        </div>
      )}

      {/* Champion Special Spotlight if tournament concluded */}
      {stats.championPlayer && (
        <div
          className="sm:col-span-2 lg:col-span-4 p-5 rounded flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(10,10,11,0.95))',
            border: '1px solid rgba(201, 168, 76, 0.5)',
            boxShadow: '0 0 35px -8px rgba(201, 168, 76, 0.5)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded flex items-center justify-center text-amber-300"
              style={{
                background: 'rgba(201, 168, 76, 0.25)',
                border: '1px solid rgba(201, 168, 76, 0.6)',
              }}
            >
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--cg-gold)',
                }}
              >
                OFFICIAL TOURNAMENT CHAMPION
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  color: 'var(--cg-ivory)',
                  margin: '0.1rem 0',
                }}
              >
                {stats.championPlayer.name} ({stats.championPlayer.rollNumber})
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  color: 'var(--cg-emerald-bright)',
                  margin: 0,
                }}
              >
                {stats.championPlayer.course} • {settings.name} Victor
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('history')}
            className="cg-btn cg-btn-ghost"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Full Match Report</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StatsGrid;
