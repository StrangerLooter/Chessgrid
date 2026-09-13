import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Users, Clock, Trophy, Grid3X3, ArrowUpRight } from 'lucide-react';

interface StatsGridProps {
  onOpenShuffleModal?: () => void;
}

export const StatsGrid: React.FC<StatsGridProps> = () => {
  const { stats, settings, setActiveTab } = useTournament();

  const cards = [
    {
      id: 'players',
      label: 'Contenders Roster',
      value: `${stats.totalRegistered} / ${stats.totalRequired}`,
      subtitle: stats.isReadyToStart 
        ? 'Pool Complete & Verified' 
        : `${stats.totalRequired - stats.totalRegistered} open slots`,
      badge: stats.isReadyToStart ? 'READY' : 'ENROLLING',
      badgeClass: stats.isReadyToStart 
        ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.4)]' 
        : 'bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border-[rgba(201,168,76,0.35)]',
      valueColor: 'text-[var(--cg-ivory)]',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      onClick: () => setActiveTab('players'),
      ariaLabel: `Contenders roster: ${stats.totalRegistered} of ${stats.totalRequired} registered. Click to view roster.`,
    },
    {
      id: 'active-boards',
      label: 'Live Boards & Clocks',
      value: `${stats.liveMatchesCount}`,
      subtitle: stats.liveMatchesCount > 0 
        ? `${stats.liveMatchesCount * 2} active digital clocks` 
        : 'All boards idle / standby',
      badge: stats.liveMatchesCount > 0 ? 'SYNCHRONIZED' : 'STANDBY',
      badgeClass: stats.liveMatchesCount > 0 
        ? 'bg-[rgba(34,166,122,0.2)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.5)]' 
        : 'bg-white/5 text-[rgba(200,192,174,0.5)] border-white/10',
      valueColor: stats.liveMatchesCount > 0 ? 'text-[var(--cg-gold-bright)]' : 'text-[var(--cg-ivory)]',
      icon: <Clock className="w-4 h-4 text-emerald-400" />,
      hasPulseDot: stats.liveMatchesCount > 0,
      onClick: () => setActiveTab('live'),
      ariaLabel: `Live boards: ${stats.liveMatchesCount} active. Click to open live clocks.`,
    },
    {
      id: 'round-status',
      label: 'Stage & Progression',
      value: stats.currentRoundName || 'Round 1',
      subtitle: `${stats.completedMatchesCount} / ${stats.totalRequired - 1} matches concluded (${stats.progressPercent}%)`,
      badge: settings.status === 'completed' 
        ? 'CONCLUDED' 
        : settings.status === 'in_progress' 
        ? 'KNOCKOUT' 
        : 'SETUP',
      badgeClass: 'bg-[rgba(201,168,76,0.12)] text-[var(--cg-gold-bright)] border-[rgba(201,168,76,0.25)]',
      valueColor: 'text-[var(--cg-ivory)]',
      icon: <Trophy className="w-4 h-4 text-amber-300" />,
      onClick: () => setActiveTab('bracket'),
      ariaLabel: `Tournament stage: ${stats.currentRoundName}. ${stats.completedMatchesCount} completed. Click to view bracket.`,
    },
    {
      id: 'available-boards',
      label: 'Available Tables',
      value: `${stats.availableBoardsCount}`,
      subtitle: `${settings.maxBoards} total arena tables configured`,
      badge: stats.availableBoardsCount > 0 ? 'READY' : 'ALL OCCUPIED',
      badgeClass: stats.availableBoardsCount > 0
        ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.35)]'
        : 'bg-white/5 text-[rgba(200,192,174,0.5)] border-white/10',
      valueColor: 'text-[var(--cg-ivory)]',
      icon: <Grid3X3 className="w-4 h-4 text-indigo-400" />,
      onClick: () => setActiveTab('boards'),
      ariaLabel: `Available tables: ${stats.availableBoardsCount} of ${settings.maxBoards} ready. Click to manage boards.`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={card.onClick}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              card.onClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={card.ariaLabel}
          className="glass-panel p-4 rounded-lg cursor-pointer group hover:-translate-y-0.5 hover:border-[rgba(201,168,76,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cg-gold)] transition-all relative overflow-hidden flex flex-col justify-between"
          style={{
            minHeight: '110px',
            background: 'rgba(17, 17, 20, 0.75)',
            border: '1px solid rgba(201, 168, 76, 0.16)',
          }}
        >
          {/* Subtle Top Accent Line on hover */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--cg-gold), transparent)' }}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {card.icon}
                <span
                  className="text-[11px] font-bold tracking-wider uppercase truncate text-[rgba(200,192,174,0.7)]"
                  style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.08em' }}
                >
                  {card.label}
                </span>
              </div>

              {card.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border flex items-center gap-1 shrink-0 ${card.badgeClass}`}
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
              className={`truncate font-semibold tracking-tight ${card.valueColor}`}
              style={{
                fontFamily: 'var(--font-stat)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                lineHeight: 1.05,
              }}
            >
              {card.value}
            </div>
          </div>

          <div
            className="mt-2.5 pt-2 flex items-center justify-between text-[11px] text-[rgba(200,192,174,0.6)] border-t border-white/5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <span className="truncate">{card.subtitle}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--cg-gold)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
