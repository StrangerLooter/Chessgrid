import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Trophy, 
  Tv, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Printer, 
  RefreshCw,
  Crown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ChampionModal } from '../common/ChampionModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { 
    settings, 
    stats, 
    isDark, 
    toggleTheme, 
    isMuted, 
    toggleMute, 
    setIsProjectorMode,
    loadDemoTournament
  } = useTournament();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showChampionModal, setShowChampionModal] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full transition-colors no-print"
        style={{
          background: 'rgba(10, 10, 11, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 168, 76, 0.18)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu + Regal Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded text-slate-400 hover:text-white transition-colors"
              style={{
                background: 'rgba(201, 168, 76, 0.06)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
              }}
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(10,10,11,0.9))',
                  border: '1px solid rgba(201, 168, 76, 0.4)',
                  boxShadow: '0 0 15px -3px rgba(201, 168, 76, 0.3)',
                }}
              >
                <Trophy className="w-5 h-5" style={{ color: 'var(--cg-gold)' }} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      color: 'var(--cg-ivory)',
                      lineHeight: 1,
                    }}
                  >
                    CHESSGRID™
                  </span>
                  <span
                    className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      background: 'rgba(201, 168, 76, 0.12)',
                      color: 'var(--cg-gold)',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                    }}
                  >
                    Command Center
                  </span>
                </div>
                <span
                  className="text-xs truncate max-w-[200px] sm:max-w-xs"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'rgba(200, 192, 174, 0.55)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  {settings.name} • {settings.departmentName}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Round Status & Champion Callout */}
          <div className="hidden md:flex items-center gap-3">
            {stats.championPlayer ? (
              <button
                onClick={() => setShowChampionModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(232,196,90,0.1))',
                  border: '1px solid rgba(201, 168, 76, 0.5)',
                  color: 'var(--cg-gold-bright)',
                  boxShadow: '0 0 20px -5px rgba(201, 168, 76, 0.4)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.08em',
                }}
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>CHAMPION: {stats.championPlayer.name.toUpperCase()}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>
            ) : (
              <div
                className="flex items-center gap-2.5 px-3.5 py-1 rounded text-xs"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span className="relative flex h-2 w-2">
                  {stats.liveMatchesCount > 0 && (
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: 'var(--cg-gold)' }}
                    />
                  )}
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: stats.liveMatchesCount > 0 ? 'var(--cg-gold)' : 'rgba(200,192,174,0.3)' }}
                  />
                </span>
                <span style={{ color: 'var(--cg-ivory)', fontWeight: 600, letterSpacing: '0.06em' }}>
                  {stats.currentRoundName.toUpperCase()}
                </span>
                {stats.liveMatchesCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded font-bold text-[10px]"
                    style={{
                      background: 'rgba(34, 166, 122, 0.15)',
                      color: 'var(--cg-emerald-bright)',
                      border: '1px solid rgba(34, 166, 122, 0.3)',
                    }}
                  >
                    {stats.liveMatchesCount} LIVE
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Projector / Public Display Mode */}
            <button
              onClick={() => setIsProjectorMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all"
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                border: '1px solid rgba(201, 168, 76, 0.35)',
                color: 'var(--cg-gold)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.08em',
              }}
              title="Enter Large Screen Public Display / Projector Mode"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PROJECTOR</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="p-2 rounded text-slate-400 hover:text-white transition-colors"
              style={{
                background: 'rgba(10, 10, 11, 0.5)',
                border: '1px solid rgba(201, 168, 76, 0.12)',
              }}
              title="Print Tournament Report"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-2 rounded transition-colors"
              style={{
                background: 'rgba(10, 10, 11, 0.5)',
                border: '1px solid rgba(201, 168, 76, 0.12)',
                color: isMuted ? 'var(--cg-red-bright)' : 'var(--cg-emerald-bright)',
              }}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded text-slate-400 hover:text-amber-400 transition-colors"
              style={{
                background: 'rgba(10, 10, 11, 0.5)',
                border: '1px solid rgba(201, 168, 76, 0.12)',
              }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </button>

            {/* Reload Demo */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded text-slate-400 hover:text-amber-400 transition-colors"
              style={{
                background: 'rgba(10, 10, 11, 0.5)',
                border: '1px solid rgba(201, 168, 76, 0.12)',
              }}
              title="Reset Tournament / Load Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset or Reload Tournament?"
        message="Would you like to reload the IEHE Demo Tournament or wipe all data to start fresh?"
        confirmLabel="Reload IEHE Demo"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={loadDemoTournament}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Champion Modal */}
      <ChampionModal
        isOpen={showChampionModal}
        onClose={() => setShowChampionModal(false)}
      />
    </>
  );
};

export default Navbar;
