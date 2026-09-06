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
  X,
  Plus
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ChampionModal } from '../common/ChampionModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenNewTournament?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  isSidebarOpen,
  onOpenNewTournament,
}) => {
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
                className="w-10 h-10 rounded flex items-center justify-center font-bold bg-[rgba(201,168,76,0.18)] border border-[rgba(201,168,76,0.4)] shadow-[0_0_15px_rgba(201,168,76,0.25)]"
              >
                <Trophy className="w-5 h-5 text-[var(--cg-gold)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--cg-ivory)',
                      lineHeight: 1,
                    }}
                  >
                    CHESSGRID™
                  </span>
                  <span
                    className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest font-mono bg-[rgba(201,168,76,0.12)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]"
                  >
                    GRANDMASTER CONSOLE
                  </span>
                </div>
                <span
                  className="text-xs truncate max-w-[200px] sm:max-w-xs font-mono text-[rgba(200,192,174,0.6)] text-[11px]"
                >
                  {settings.name} • {settings.collegeName || 'Global Masters Arena'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Live Round Status & Champion Callout */}
          <div className="hidden md:flex items-center gap-3">
            {stats.championPlayer ? (
              <button
                onClick={() => setShowChampionModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all hover:scale-105 bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.5)] text-[var(--cg-gold-bright)] gold-glow font-sans tracking-wider"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>CHAMPION: {stats.championPlayer.name.toUpperCase()}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>
            ) : (
              <div
                className="flex items-center gap-2.5 px-3.5 py-1 rounded text-xs glass-panel font-sans"
              >
                <span className="relative flex h-2 w-2">
                  {stats.liveMatchesCount > 0 && (
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--cg-gold)]"
                    />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${stats.liveMatchesCount > 0 ? 'bg-[var(--cg-gold)]' : 'bg-white/30'}`}
                  />
                </span>
                <span className="text-[var(--cg-ivory)] font-semibold tracking-wider text-[11px]">
                  {stats.currentRoundName.toUpperCase()}
                </span>
                {stats.liveMatchesCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded font-bold text-[10px] font-mono bg-[rgba(34,166,122,0.18)] text-[var(--cg-emerald-bright)] border border-[rgba(34,166,122,0.4)] emerald-glow"
                  >
                    {stats.liveMatchesCount} BOARDS LIVE
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenNewTournament && (
              <button
                onClick={onOpenNewTournament}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all bg-[rgba(201,168,76,0.18)] border border-[rgba(201,168,76,0.45)] text-[var(--cg-gold-bright)] hover:bg-[rgba(201,168,76,0.28)]"
                title="Create a New Custom Tournament"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">NEW TOURNAMENT</span>
              </button>
            )}

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
        message="Would you like to reload the Masters Demo Championship or wipe all data to start fresh?"
        confirmLabel="Reload Masters Demo"
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
