import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Users, Swords, Clock, UserMinus, Crown, CheckCircle2, Shuffle } from 'lucide-react';
import type { NavTab } from '../../types/tournament';

interface StatsGridProps {
  onOpenShuffleModal: () => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ onOpenShuffleModal }) => {
  const { stats, settings, setActiveTab } = useTournament();

  const cards: {
    id: string;
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    accentGlow: string;
    badge?: string;
    badgeColor?: string;
    targetTab?: NavTab;
    onClick?: () => void;
  }[] = [
    {
      id: 'players',
      title: 'Contender Pool',
      value: `${stats.totalRegistered} / ${stats.totalRequired}`,
      subtitle: stats.isReadyToStart ? 'Pool Complete & Verified' : `${stats.totalRequired - stats.totalRegistered} slots remaining`,
      icon: <Users className="w-4 h-4" />,
      color: 'var(--cg-gold)',
      accentGlow: 'rgba(201, 168, 76, 0.25)',
      badge: stats.isReadyToStart ? 'READY' : 'REGISTERING',
      badgeColor: stats.isReadyToStart 
        ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.4)]' 
        : 'bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold)] border-[rgba(201,168,76,0.35)]',
      targetTab: 'players',
    },
    {
      id: 'live',
      title: 'Live Battlefield',
      value: stats.liveMatchesCount,
      subtitle: `${stats.upcomingMatchesCount} matches on deck`,
      icon: <Clock className="w-4 h-4" />,
      color: 'var(--cg-emerald-bright)',
      accentGlow: 'rgba(34, 166, 122, 0.25)',
      badge: stats.liveMatchesCount > 0 ? 'LIVE NOW' : 'STANDBY',
      badgeColor: stats.liveMatchesCount > 0 
        ? 'bg-[rgba(34,166,122,0.2)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.5)] animate-pulse' 
        : 'bg-[rgba(201,168,76,0.06)] text-[rgba(200,192,174,0.4)] border-[rgba(201,168,76,0.1)]',
      targetTab: 'live',
    },
    {
      id: 'completed',
      title: 'Concluded Matches',
      value: stats.completedMatchesCount,
      subtitle: `Stage: ${stats.currentRoundName}`,
      icon: <Swords className="w-4 h-4" />,
      color: 'var(--cg-gold-bright)',
      accentGlow: 'rgba(232, 196, 90, 0.2)',
      badge: `${stats.progressPercent}%`,
      badgeColor: 'bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold-bright)] border-[rgba(201,168,76,0.3)]',
      targetTab: 'history',
    },
    {
      id: 'eliminated',
      title: 'Fallen Warriors',
      value: stats.eliminatedCount,
      subtitle: `${stats.totalRegistered - stats.eliminatedCount} contenders active`,
      icon: <UserMinus className="w-4 h-4" />,
      color: 'var(--cg-red-bright)',
      accentGlow: 'rgba(192, 57, 43, 0.2)',
      badge: `${stats.totalRegistered - stats.eliminatedCount} ACTIVE`,
      badgeColor: 'bg-[rgba(192,57,43,0.12)] text-[var(--cg-red-bright)] border-[rgba(192,57,43,0.3)]',
      targetTab: 'eliminated',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => {
            if (card.onClick) card.onClick();
            else if (card.targetTab) setActiveTab(card.targetTab);
          }}
          className="p-5 rounded transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
          style={{
            background: 'rgba(17, 17, 20, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(201, 168, 76, 0.18)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
          }}
        >
          {/* Top highlight bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }}
          />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div
                className="w-9 h-9 rounded flex items-center justify-center"
                style={{
                  background: 'rgba(201, 168, 76, 0.08)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  color: card.color,
                }}
              >
                {card.icon}
              </div>

              {card.badge && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${card.badgeColor}`}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {card.badge}
                </span>
              )}
            </div>

            <div
              className="text-xs uppercase tracking-widest font-semibold"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'rgba(200, 192, 174, 0.6)',
                fontSize: '0.65rem',
              }}
            >
              {card.title}
            </div>

            <div
              className="mt-1 leading-none"
              style={{
                fontFamily: 'var(--font-stat)',
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                color: 'var(--cg-ivory)',
                letterSpacing: '0.04em',
              }}
            >
              {card.value}
            </div>
          </div>

          <div
            className="text-xs mt-3 pt-2.5 flex items-center justify-between"
            style={{
              borderTop: '1px solid rgba(201, 168, 76, 0.1)',
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.5)',
              fontSize: '0.7rem',
            }}
          >
            <span className="truncate">{card.subtitle}</span>
            <span
              className="font-bold text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--cg-gold)' }}
            >
              VIEW →
            </span>
          </div>
        </div>
      ))}

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
