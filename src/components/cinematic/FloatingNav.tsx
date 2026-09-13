import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Trophy, 
  Menu, 
  X, 
  Plus, 
  Compass, 
  Gamepad2, 
  Info, 
  Volume2, 
  VolumeX,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface FloatingNavProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
  onNavigateAbout?: () => void;
  onNavigatePlay?: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ 
  onCommandCenter, 
  onOpenNewTournament,
  onNavigateAbout, 
  onNavigatePlay 
}) => {
  const { isMuted, toggleMute } = useTournament();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlayClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigatePlay) {
      onNavigatePlay();
    } else {
      window.history.pushState({}, '', '/play');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleAboutClick = () => {
    setIsMobileMenuOpen(false);
    if (onNavigateAbout) {
      onNavigateAbout();
    } else {
      window.history.pushState({}, '', '/about');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 pointer-events-none">
      
      {/* ── Main Sleek Glass Dock ── */}
      <div 
        className="w-full max-w-5xl rounded-2xl glass-panel p-2.5 sm:px-4 sm:py-2 flex items-center justify-between gap-3 pointer-events-auto shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[rgba(201,168,76,0.25)] transition-all"
        style={{
          background: 'rgba(12, 12, 15, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Left: Brand Crest & Title */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cg-gold)] rounded-lg cursor-pointer"
          aria-label="ChessGrid Home"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] shadow-sm">
            <Trophy className="w-4 h-4 text-[var(--cg-gold)]" />
          </div>
          <div>
            <span
              className="text-base font-bold tracking-widest text-[var(--cg-ivory)] block leading-none"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              CHESSGRID
            </span>
            <span className="text-[9px] font-mono uppercase text-[rgba(200,192,174,0.6)] tracking-wider block">
              TOURNAMENTS
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-[rgba(200,192,174,0.75)]">
          <button
            onClick={() => scrollToSection('cg-section-features')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('cg-section-workflow')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('cg-section-product-areas')}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Product Areas
          </button>
          <button
            onClick={handlePlayClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/10 transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Play Chess</span>
          </button>
          <button
            onClick={handleAboutClick}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right: Desktop Action Buttons + Mute Toggle */}
        <div className="hidden sm:flex items-center gap-2">
          {onOpenNewTournament && (
            <button
              onClick={onOpenNewTournament}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--cg-gold)] bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] hover:bg-[rgba(201,168,76,0.2)] transition-colors cursor-pointer"
              title="Create a New Tournament"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Tournament</span>
            </button>
          )}

          <button
            onClick={onCommandCenter}
            className="cg-btn cg-btn-primary py-1.5 px-3.5 text-xs font-bold uppercase tracking-wider justify-center shadow-[0_0_15px_rgba(201,168,76,0.25)]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onCommandCenter}
            className="cg-btn cg-btn-primary py-1 px-2.5 text-[11px] font-bold"
          >
            <span>Command</span>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[var(--cg-gold)] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-x-4 top-20 z-50 rounded-2xl glass-panel p-4 border border-[rgba(201,168,76,0.3)] shadow-2xl flex flex-col gap-3 pointer-events-auto animate-in fade-in slide-in-from-top-3"
          style={{
            background: 'rgba(15, 15, 18, 0.96)',
            backdropFilter: 'blur(25px)',
          }}
        >
          <div className="flex flex-col gap-1 text-sm font-semibold text-[var(--cg-ivory)]">
            <button
              onClick={() => scrollToSection('cg-section-features')}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
            >
              <span>Features</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => scrollToSection('cg-section-workflow')}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
            >
              <span>How It Works</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => scrollToSection('cg-section-product-areas')}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
            >
              <span>Product Areas</span>
              <Trophy className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={handlePlayClick}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 text-emerald-300 flex items-center justify-between"
            >
              <span>Play Chess vs Computer</span>
              <Gamepad2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleAboutClick}
              className="text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between"
            >
              <span>About ChessGrid</span>
              <Info className="w-4 h-4 text-red-400" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onCommandCenter();
              }}
              className="cg-btn cg-btn-primary w-full py-2 text-xs font-bold justify-center"
            >
              <Compass className="w-4 h-4" />
              <span>Open Command Center</span>
            </button>

            {onOpenNewTournament && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNewTournament();
                }}
                className="cg-btn cg-btn-ghost w-full py-2 text-xs font-semibold justify-center border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Tournament</span>
              </button>
            )}

            <div className="flex items-center justify-between pt-1 px-1 text-xs text-[rgba(200,192,174,0.6)]">
              <span>Sound Effects</span>
              <button
                onClick={toggleMute}
                className="p-1 px-2.5 rounded bg-white/5 border border-white/10 text-xs font-mono"
              >
                {isMuted ? 'Muted' : 'Unmuted'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FloatingNav;
