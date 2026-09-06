import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Home, 
  Trophy, 
  Users, 
  CalendarDays, 
  Activity, 
  BookOpen, 
  GitBranch, 
  Radio, 
  BarChart2, 
  Plus, 
  Compass, 
  ChevronDown 
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface HeroTypographyProps {
  onEnter: () => void;
  onOpenNewTournament?: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ onEnter, onOpenNewTournament }) => {
  const { setActiveTab } = useTournament();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (heroContentRef.current) gsap.set(heroContentRef.current, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      heroContentRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' }
    );

    return () => { tl.kill(); };
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab as any);
    onEnter();
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById('cg-section-piece-visualizer') || document.getElementById('cg-section-players');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      id="cg-hero-typography"
      className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none z-20 px-4 sm:px-8 py-6"
    >
      {/* Top Spacer for Nav */}
      <div className="h-16 sm:h-20" />

      {/* ── Left Floating Navigation Dock (Desktop) ── */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col items-center py-4 px-2 cg-floating-dock pointer-events-auto z-40 gap-4">
        {[
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'bracket', label: 'Tournaments', icon: Trophy },
          { id: 'players', label: 'Players', icon: Users },
          { id: 'matches', label: 'Events', icon: CalendarDays },
          { id: 'live', label: 'Live', icon: Activity },
          { id: 'history', label: 'Resources', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className="flex flex-col items-center justify-center w-12 py-2 rounded-lg text-slate-400 hover:text-[#fce8a6] hover:bg-white/5 transition-all group relative"
            title={label}
          >
            <Icon className="w-4 h-4 mb-1 group-hover:scale-110 group-hover:text-[#e8c45a] transition-all" />
            <span className="text-[9px] font-sans font-medium tracking-wider text-slate-400 group-hover:text-white">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Right Floating Social Dock (Desktop) ── */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col items-center py-5 px-3 cg-floating-dock pointer-events-auto z-40 gap-5 text-slate-300">
        {/* Discord */}
        <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="Discord">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        </a>
        {/* X / Twitter */}
        <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="X (Twitter)">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="Instagram">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        {/* YouTube */}
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="YouTube">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
        {/* LinkedIn */}
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="LinkedIn">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </a>
        {/* GitHub */}
        <a href="https://github.com/StrangerLooter/Chessgrid" target="_blank" rel="noreferrer" className="hover:text-[#e8c45a] hover:scale-110 transition-all" title="GitHub Repository">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>

      {/* ── Main Centerpiece Hero Content ── */}
      <div
        ref={heroContentRef}
        className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto pointer-events-auto"
      >
        {/* Top Eyebrow Tag */}
        <p
          className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#f5efe6]/80 tracking-[0.38em] uppercase mb-3 sm:mb-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          PLAN &nbsp; • &nbsp; ORGANIZE &nbsp; • &nbsp; COMPETE &nbsp; • &nbsp; EXPERIENCE
        </p>

        {/* ── Grand Chiseled Metallic Logo Title ── */}
        <div className="relative my-1 sm:my-2 select-none">
          <h1
            className="cg-title-metallic"
            style={{
              fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)',
              lineHeight: 1.02,
              letterSpacing: '0.06em',
            }}
          >
            <span>CHESS</span>
            {/* Glowing Sword Star Cross */}
            <span className="cg-star-cross">
              <svg className="w-[0.55em] h-[0.55em]" viewBox="0 0 36 36" fill="currentColor">
                {/* 8-Pointed Star Sword Cross */}
                <polygon points="18,0 21,14 36,18 21,22 18,36 15,22 0,18 15,14" fill="url(#goldStarGrad)" />
                <circle cx="18" cy="18" r="3" fill="#ffffff" />
                <defs>
                  <linearGradient id="goldStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e8c45a" />
                    <stop offset="100%" stopColor="#c9a84c" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span>GRID</span>
          </h1>
        </div>

        {/* ── Subtitles ── */}
        <div className="space-y-1 mt-2 sm:mt-3 mb-6 sm:mb-8">
          <p
            className="text-[11px] sm:text-[13px] md:text-[14px] font-semibold text-[#d4cdbf] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            THE DIGITAL ARENA FOR
          </p>
          <p
            className="text-[14px] sm:text-[18px] md:text-[22px] font-bold tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ecd89f] via-[#fff4d1] to-[#e0be6c]"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              textShadow: '0 2px 20px rgba(201,168,76,0.4)',
            }}
          >
            CHESS TOURNAMENTS
          </p>
        </div>

        {/* ── 4 Feature Icons Row ── */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-8 sm:mb-10 text-slate-300">
          {/* Players */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => handleNavClick('players')}>
            <Users className="w-5 h-5 text-slate-300 group-hover:text-[#e8c45a] group-hover:scale-110 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-[0.2em] text-slate-400 group-hover:text-white uppercase">
              PLAYERS
            </span>
          </div>

          {/* Brackets */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => handleNavClick('bracket')}>
            <GitBranch className="w-5 h-5 text-slate-300 group-hover:text-[#e8c45a] group-hover:scale-110 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-[0.2em] text-slate-400 group-hover:text-white uppercase">
              BRACKETS
            </span>
          </div>

          {/* Live Matches */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => handleNavClick('live')}>
            <Radio className="w-5 h-5 text-slate-300 group-hover:text-[#e8c45a] group-hover:scale-110 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-[0.2em] text-slate-400 group-hover:text-white uppercase">
              LIVE MATCHES
            </span>
          </div>

          {/* Real Results */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => handleNavClick('history')}>
            <BarChart2 className="w-5 h-5 text-slate-300 group-hover:text-[#e8c45a] group-hover:scale-110 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-[0.2em] text-slate-400 group-hover:text-white uppercase">
              REAL RESULTS
            </span>
          </div>
        </div>

        {/* ── Dual Hero CTA Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-md mx-auto justify-center">
          {/* + CREATE TOURNAMENT */}
          <button
            onClick={onOpenNewTournament || onEnter}
            className="w-full sm:w-auto px-7 py-3.5 cg-btn-hero-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-[0.16em]"
          >
            <Plus className="w-4 h-4 text-[#ffd875]" />
            <span>CREATE TOURNAMENT</span>
          </button>

          {/* EXPLORE TOURNAMENTS */}
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-7 py-3.5 cg-btn-hero-secondary flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-[0.16em]"
          >
            <Compass className="w-4 h-4 text-[#e8c45a]" />
            <span>EXPLORE TOURNAMENTS</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Section: Left Quote, Scroll Prompt, Right Quote ── */}
      <div className="w-full max-w-[1720px] mx-auto flex items-end justify-between text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-slate-400 font-sans pointer-events-auto pb-2">
        
        {/* Bottom Left Quote */}
        <div className="hidden sm:block text-left leading-relaxed opacity-75">
          <p className="font-semibold text-slate-300">MORE</p>
          <p>THAN A GAME</p>
          <p className="text-slate-500">A BIGGER STAGE</p>
        </div>

        {/* Center Scroll Prompt */}
        <button
          onClick={scrollToNext}
          className="mx-auto flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] group-hover:text-[#e8c45a]">
            SCROLL
          </span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white/40 via-[#e8c45a] to-transparent group-hover:h-8 transition-all duration-300" />
          <ChevronDown className="w-3.5 h-3.5 text-[#e8c45a] animate-bounce -mt-1" />
        </button>

        {/* Bottom Right Quote */}
        <div className="hidden sm:block text-right leading-relaxed opacity-75">
          <p className="font-semibold text-slate-300">PLAY</p>
          <p>ORGANIZE</p>
          <p className="text-slate-500">INSPIRE</p>
        </div>
      </div>
    </div>
  );
};

export default HeroTypography;
