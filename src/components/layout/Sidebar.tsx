import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { NavTab } from '../../types/tournament';
import { 
  LayoutDashboard, 
  Users, 
  GitFork, 
  Swords, 
  Clock, 
  Grid3X3, 
  UserMinus, 
  History, 
  Settings2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, stats } = useTournament();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'players',
      label: 'Players Roster',
      icon: <Users className="w-4 h-4" />,
      badge: `${stats.totalRegistered}/${stats.totalRequired}`,
      badgeColor: stats.isReadyToStart 
        ? 'bg-[rgba(34,166,122,0.15)] text-[var(--cg-emerald-bright)] border-[rgba(34,166,122,0.3)]' 
        : 'bg-[rgba(201,168,76,0.08)] text-[var(--cg-gold)] border-[rgba(201,168,76,0.2)]',
    },
    {
      id: 'bracket',
      label: 'Knockout Bracket',
      icon: <GitFork className="w-4 h-4 rotate-90" />,
    },
    {
      id: 'matches',
      label: 'Match Center',
      icon: <Swords className="w-4 h-4" />,
    },
    {
      id: 'live',
      label: 'Live Clocks & Boards',
      icon: <Clock className="w-4 h-4" />,
      badge: stats.liveMatchesCount > 0 ? `${stats.liveMatchesCount} LIVE` : undefined,
      badgeColor: 'bg-[rgba(201,168,76,0.2)] text-[var(--cg-gold-bright)] border-[rgba(201,168,76,0.4)] animate-pulse',
    },
    {
      id: 'boards',
      label: 'Boards & Tables',
      icon: <Grid3X3 className="w-4 h-4" />,
    },
    {
      id: 'eliminated',
      label: 'Eliminated Roster',
      icon: <UserMinus className="w-4 h-4" />,
      badge: stats.eliminatedCount > 0 ? stats.eliminatedCount : undefined,
      badgeColor: 'bg-[rgba(192,57,43,0.15)] text-[var(--cg-red-bright)] border-[rgba(192,57,43,0.3)]',
    },
    {
      id: 'history',
      label: 'Match History',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings & Rules',
      icon: <Settings2 className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(10, 10, 11, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(201, 168, 76, 0.15)',
          boxShadow: '4px 0 25px rgba(0,0,0,0.5)',
        }}
      >
        <div className="space-y-5 overflow-y-auto">
          
          {/* Tournament Progress Mini Card */}
          <div
            className="p-3.5 rounded"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.18)',
              boxShadow: 'inset 0 1px 0 rgba(201, 168, 76, 0.08)',
            }}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(200, 192, 174, 0.7)',
                }}
              >
                TOURNAMENT PROGRESS
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-stat)',
                  fontSize: '1.1rem',
                  color: 'var(--cg-gold)',
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                }}
              >
                {stats.progressPercent}%
              </span>
            </div>
            <div
              className="w-full rounded-full h-1.5 overflow-hidden"
              style={{ background: 'rgba(201, 168, 76, 0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.progressPercent}%`,
                  background: 'linear-gradient(90deg, var(--cg-gold-dim), var(--cg-gold), var(--cg-gold-bright))',
                  boxShadow: '0 0 10px rgba(201, 168, 76, 0.5)',
                }}
              />
            </div>
            <div
              className="flex items-center justify-between mt-2"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                color: 'rgba(200, 192, 174, 0.5)',
                letterSpacing: '0.05em',
              }}
            >
              <span>{stats.completedMatchesCount} COMPLETE</span>
              <span className="capitalize text-amber-200/70">{stats.currentRoundName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded transition-all group text-left"
                  style={{
                    background: isActive ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(201, 168, 76, 0.35)' : '1px solid transparent',
                    borderLeft: isActive ? '3px solid var(--cg-gold)' : '3px solid transparent',
                    color: isActive ? 'var(--cg-ivory)' : 'rgba(200, 192, 174, 0.6)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.06em',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                      e.currentTarget.style.color = 'var(--cg-ivory)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(200, 192, 174, 0.6)';
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span style={{ color: isActive ? 'var(--cg-gold)' : 'inherit', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--cg-gold)' }} />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Arbiter / Developer Attribution badge */}
        <div
          className="p-3 rounded text-center mt-4"
          style={{
            background: 'rgba(17, 17, 20, 0.6)',
            border: '1px solid rgba(201, 168, 76, 0.1)',
          }}
        >
          <div
            className="flex items-center justify-center gap-1.5 text-[10px]"
            style={{
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--cg-gold)',
            }}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>IEHE ARBITRATION</span>
          </div>
          <div
            className="text-[10px] font-medium mt-0.5"
            style={{ color: 'rgba(200, 192, 174, 0.5)' }}
          >
            Dev: Ram Vishwakarma
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
