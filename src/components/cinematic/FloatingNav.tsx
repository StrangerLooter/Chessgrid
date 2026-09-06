import React, { useState } from 'react';
import { useScroll, type CinematicWaypoint } from '../../context/ScrollContext';
import { WAYPOINT_RANGES } from '../../context/ScrollContext';
import { useTournament } from '../../context/TournamentContext';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface FloatingNavProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
}

const NAV_LINKS: { waypoint: CinematicWaypoint; label: string }[] = [
  { waypoint: 'tournament', label: 'TOURNAMENTS' },
  { waypoint: 'players',    label: 'PLAYERS' },
  { waypoint: 'match',      label: 'FEATURES' },
  { waypoint: 'projector',  label: 'COMMUNITY' },
  { waypoint: 'analysis',   label: 'ABOUT' },
];

const scrollToWaypoint = (waypoint: CinematicWaypoint) => {
  const [start] = WAYPOINT_RANGES[waypoint];
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = (start / 100) * totalHeight;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
};

export const FloatingNav: React.FC<FloatingNavProps> = ({ onCommandCenter, onOpenNewTournament }) => {
  const { waypoint } = useScroll();
  const { isMuted, toggleMute } = useTournament();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 pointer-events-none">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* ── Left: Brand Logo (Knight Icon + CHESSGRID™) ── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group focus:outline-none transition-transform hover:scale-105"
        >
          {/* Detailed Knight Chess Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative">
            <svg
              viewBox="0 0 48 48"
              className="w-full h-full text-white/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              fill="currentColor"
            >
              {/* Knight Head & Mane Profile */}
              <path d="M22 6C17 6 12 10 11 15C10 20 12 25 10 28C8 31 6 34 6 37C6 39 8 41 11 41H37C39 41 41 39 41 37C41 32 37 28 35 24C33 20 34 16 33 12C32 8 28 6 22 6ZM22 10C24 10 26 11 27 13C28 15 27 17 26 19C25 21 24 23 25 25C26 27 28 29 30 31C32 33 34 35 34 37H14C14 35 15 33 17 31C19 29 20 26 19 23C18 20 17 17 18 14C19 11 20 10 22 10Z" opacity="0.95" />
              <path d="M19 14C19 12.9 19.9 12 21 12C22.1 12 23 12.9 23 14C23 15.1 22.1 16 21 16C19.9 16 19 15.1 19 14Z" fill="#e8c45a" />
            </svg>
          </div>

          <div className="flex items-baseline tracking-widest text-white">
            <span
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: '#ffffff',
                textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)',
              }}
            >
              CHESSGRID
            </span>
            <span className="text-[10px] text-[#c9a84c] font-mono ml-0.5 opacity-80">™</span>
          </div>
        </button>

        {/* ── Center: Sci-Fi / High-Fantasy Angular HUD Navigation ── */}
        <nav
          className="hidden md:flex items-center px-7 py-2.5 cg-hud-nav-bar"
          style={{
            minWidth: '480px',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          {NAV_LINKS.map(({ waypoint: wp, label }) => {
            const isActive = waypoint === wp;
            return (
              <button
                key={wp}
                onClick={() => scrollToWaypoint(wp)}
                className="relative py-1 text-[11px] sm:text-[12px] font-bold tracking-[0.2em] transition-all duration-300 uppercase"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? '#fce8a6' : 'rgba(215, 222, 235, 0.75)',
                  textShadow: isActive ? '0 0 15px rgba(232, 196, 90, 0.7)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.textShadow = '0 0 12px rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? '#fce8a6' : 'rgba(215, 222, 235, 0.75)';
                  e.currentTarget.style.textShadow = isActive ? '0 0 15px rgba(232, 196, 90, 0.7)' : 'none';
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8c45a] to-transparent shadow-[0_0_8px_#e8c45a]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Right: Audio Toggle & "→ GET STARTED" Action Button ── */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Mute/Audio toggle */}
          <button
            onClick={toggleMute}
            className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white transition-all shadow-lg"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* GET STARTED Button */}
          <button
            onClick={onCommandCenter}
            className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 group"
            style={{
              background: 'rgba(18, 22, 28, 0.85)',
              border: '1px solid rgba(220, 230, 245, 0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e8c45a';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(201, 168, 76, 0.45), 0 8px 24px rgba(0,0,0,0.7)';
              e.currentTarget.style.background = 'rgba(28, 34, 44, 0.95)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(220, 230, 245, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(18, 22, 28, 0.85)';
            }}
          >
            <ArrowRight className="w-3.5 h-3.5 text-[#e8c45a] group-hover:translate-x-1 transition-transform" />
            <span>GET STARTED</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-black/60 border border-white/20 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#0e1218]/95 border border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 pointer-events-auto">
          {NAV_LINKS.map(({ waypoint: wp, label }) => (
            <button
              key={wp}
              onClick={() => {
                scrollToWaypoint(wp);
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-3 text-left text-xs font-bold tracking-widest text-slate-200 hover:text-[#e8c45a] hover:bg-white/5 rounded-lg transition-colors"
            >
              {label}
            </button>
          ))}
          {onOpenNewTournament && (
            <button
              onClick={() => {
                onOpenNewTournament();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-bold tracking-wider bg-[rgba(201,168,76,0.2)] text-[#e8c45a] border border-[#e8c45a]/40 rounded-lg"
            >
              + CREATE TOURNAMENT
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default FloatingNav;
