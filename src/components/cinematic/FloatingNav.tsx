import React, { useState } from 'react';
import { type CinematicWaypoint, WAYPOINT_RANGES } from '../../context/ScrollContext';
import { useTournament } from '../../context/TournamentContext';
import { Volume2, VolumeX } from 'lucide-react';

interface FloatingNavProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
}

const scrollToWaypoint = (waypoint: CinematicWaypoint) => {
  const [start] = WAYPOINT_RANGES[waypoint];
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = (start / 100) * totalHeight;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
};

export const FloatingNav: React.FC<FloatingNavProps> = ({ onCommandCenter }) => {
  const { isMuted, toggleMute } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none p-0 m-0">
      
      {/* ── Main Actual Navbar Graphic Container (Flush top, sleek horizontal bar) ── */}
      <div className="relative w-full max-w-[680px] sm:max-w-[780px] md:max-w-[880px] lg:max-w-[960px] pointer-events-auto select-none">
        
        {/* 1. The Actual Reference Navbar Graphic Asset (0 top padding) */}
        <img
          src="/navbar-graphic.png"
          alt="ChessGrid Navigation Bar"
          className="w-full h-auto object-contain block drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]"
          loading="eager"
          decoding="async"
        />

        {/* 2. Transparent Interactive Click Map (Locked to Graphic Coordinates) */}
        <nav
          className="absolute inset-0 w-full h-full"
          aria-label="ChessGrid Navigation"
        >
          {/* ── Hotspot 1: Brand Crest & ChessGrid Logo (Home) ── */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'absolute',
              left: '4.5%',
              width: '23.5%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="ChessGrid Home"
            aria-label="ChessGrid Home"
          />

          {/* ── Hotspot 2: TOURNAMENTS ── */}
          <button
            onClick={() => scrollToWaypoint('tournament')}
            style={{
              position: 'absolute',
              left: '29.0%',
              width: '10.5%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Tournaments"
            aria-label="Tournaments"
          />

          {/* ── Hotspot 3: PLAYERS ── */}
          <button
            onClick={() => scrollToWaypoint('players')}
            style={{
              position: 'absolute',
              left: '40.5%',
              width: '7.2%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Players"
            aria-label="Players"
          />

          {/* ── Hotspot 4: FEATURES ── */}
          <button
            onClick={() => scrollToWaypoint('match')}
            style={{
              position: 'absolute',
              left: '48.8%',
              width: '8.0%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Features"
            aria-label="Features"
          />

          {/* ── Hotspot 5: COMMUNITY ── */}
          <button
            onClick={() => scrollToWaypoint('projector')}
            style={{
              position: 'absolute',
              left: '58.0%',
              width: '9.2%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Community"
            aria-label="Community"
          />

          {/* ── Hotspot 6: ABOUT ── */}
          <button
            onClick={() => scrollToWaypoint('analysis')}
            style={{
              position: 'absolute',
              left: '68.2%',
              width: '6.8%',
              top: '10%',
              height: '80%',
              borderRadius: '4px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="About"
            aria-label="About"
          />

          {/* ── Hotspot 7: GET STARTED → ── */}
          <button
            onClick={onCommandCenter}
            style={{
              position: 'absolute',
              left: '76.5%',
              width: '16.5%',
              top: '10%',
              height: '80%',
              borderRadius: '6px',
            }}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40 hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all cursor-pointer"
            title="Get Started — Enter Tournament Command Center"
            aria-label="Get Started"
          />
        </nav>

        {/* ── Optional Floating Search Overlay ── */}
        {isSearchOpen && (
          <div
            className="absolute top-[105%] left-1/2 -translate-x-1/2 z-50 w-80 p-2.5 rounded-xl bg-[#0a0a0c]/95 border border-amber-500/40 backdrop-blur-2xl shadow-2xl flex items-center gap-2"
          >
            <input
              type="text"
              autoFocus
              placeholder="Search tournaments, players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCommandCenter();
                  setIsSearchOpen(false);
                }
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => {
                onCommandCenter();
                setIsSearchOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
            >
              Go
            </button>
          </div>
        )}

        {/* ── Auxiliary Floating Audio Control ── */}
        <button
          onClick={toggleMute}
          style={{
            position: 'absolute',
            right: '-38px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          className="hidden xl:flex p-1.5 rounded-full bg-black/70 border border-amber-500/30 hover:border-amber-400 text-slate-300 hover:text-white transition-all shadow-xl backdrop-blur-md"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
};

export default FloatingNav;
