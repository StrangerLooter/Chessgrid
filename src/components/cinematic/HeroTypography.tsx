import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Plus, 
  Compass, 
  Gamepad2, 
  ChevronDown
} from 'lucide-react';

interface HeroTypographyProps {
  onEnter: () => void;
  onOpenNewTournament?: () => void;
  onNavigatePlay?: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ 
  onEnter, 
  onOpenNewTournament, 
  onNavigatePlay 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (heroContentRef.current) gsap.set(heroContentRef.current, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(
      heroContentRef.current,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }
    );

    return () => { tl.kill(); };
  }, []);

  const handlePlayClick = () => {
    if (onNavigatePlay) {
      onNavigatePlay();
    } else {
      window.history.pushState({}, '', '/play');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById('cg-section-features') || document.getElementById('cg-section-players');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 1.1, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="cg-hero-typography"
      className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none z-20 px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Top Spacer to accommodate navigation */}
      <div className="h-16 sm:h-20" />

      {/* ── Main Centerpiece Hero Content ── */}
      <div
        ref={heroContentRef}
        className="pointer-events-auto max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5 my-auto"
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--cg-gold)] shadow-[0_0_15px_rgba(201,168,76,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[var(--cg-gold)] animate-pulse" />
          <span>COLLEGIATE CHESS TOURNAMENT MANAGEMENT</span>
        </div>

        {/* Brand Logo Asset */}
        <div className="w-full flex justify-center py-1">
          <img
            src="/chessgrid-logo.png"
            alt="CHESSGRID"
            className="w-full max-w-[480px] sm:max-w-[620px] md:max-w-[720px] lg:max-w-[800px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Headline */}
        <h1
          className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wider text-[var(--cg-ivory)]"
          style={{ fontFamily: 'var(--font-cinematic)', letterSpacing: '0.08em', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          THE DIGITAL ARENA FOR CHESS TOURNAMENTS
        </h1>

        {/* Short Product Description */}
        <p className="max-w-xl text-xs sm:text-sm md:text-base text-[rgba(200,192,174,0.85)] font-sans leading-relaxed text-center px-4" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}>
          Organize knockout brackets, manage players, control live matches, and track every result in one place.
        </p>

        {/* Dual Primary Action Buttons + Play Chess Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md">
          {/* Primary: OPEN COMMAND CENTER */}
          <button
            onClick={onEnter}
            className="cg-btn cg-btn-primary w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase justify-center shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:scale-105 transition-all"
          >
            <Compass className="w-4 h-4 text-[#0a0a0b]" />
            <span>OPEN COMMAND CENTER</span>
          </button>

          {/* Secondary: CREATE TOURNAMENT */}
          <button
            onClick={onOpenNewTournament || onEnter}
            className="cg-btn cg-btn-ghost w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase justify-center border border-[rgba(201,168,76,0.4)] bg-[rgba(10,10,12,0.7)] hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--cg-gold)] transition-all"
          >
            <Plus className="w-4 h-4 text-[var(--cg-gold)]" />
            <span>CREATE TOURNAMENT</span>
          </button>
        </div>

        {/* Optional small action: PLAY CHESS */}
        <div className="pt-1">
          <button
            onClick={handlePlayClick}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-[rgba(34,166,122,0.12)] border border-[rgba(34,166,122,0.3)] hover:bg-[rgba(34,166,122,0.25)] hover:text-white transition-all cursor-pointer"
            title="Play Chess vs Stockfish or Local 2-Player"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PLAY CHESS VS COMPUTER</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Section: Scroll Indicator & Discrete GitHub Link ── */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pointer-events-auto pb-2 text-xs font-mono text-[rgba(200,192,174,0.6)]">
        <a
          href="https://github.com/StrangerLooter/Chessgrid"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] text-[rgba(200,192,174,0.5)] hover:text-[var(--cg-gold)] transition-colors"
          title="ChessGrid on GitHub"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span className="hidden sm:inline">StrangerLooter/Chessgrid</span>
        </a>

        {/* Center Scroll Prompt */}
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-[var(--cg-gold)] hover:text-[var(--cg-gold-bright)] transition-colors group cursor-pointer"
          aria-label="Scroll to explore features"
        >
          <span>EXPLORE FEATURES</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[var(--cg-gold)]" />
        </button>

        <span className="text-[11px] text-[rgba(200,192,174,0.4)] hidden sm:inline">
          FIDE KNOCKOUT ENGINE
        </span>
      </div>
    </div>
  );
};

export default HeroTypography;
