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
  Compass 
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

    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(
      heroContentRef.current,
      { opacity: 0, y: 35, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
    );

    return () => { tl.kill(); };
  }, []);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab as any);
    onEnter();
  };

  const scrollToNext = () => {
    const nextSection = 
      document.getElementById('cg-section-piece-visualizer') || 
      document.getElementById('cg-section-tournament-creation') || 
      document.getElementById('cg-section-players');
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
      className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none z-20 px-4 sm:px-8 py-4"
    >
      {/* Top Spacer for Nav */}
      <div className="h-16 sm:h-20" />

      {/* ── Left Sidebar Dock (Desktop) ── */}
      <aside className="cg-sidebar-left pointer-events-auto">
        <button onClick={() => handleNavClick('dashboard')} className="cg-sl-item" title="Home">
          <Home />
          <span>Home</span>
        </button>
        <button onClick={() => handleNavClick('bracket')} className="cg-sl-item" title="Tournaments">
          <Trophy />
          <span>Tournaments</span>
        </button>
        <button onClick={() => handleNavClick('players')} className="cg-sl-item" title="Players">
          <Users />
          <span>Players</span>
        </button>
        <button onClick={() => handleNavClick('matches')} className="cg-sl-item" title="Events">
          <CalendarDays />
          <span>Events</span>
        </button>
        <button onClick={() => handleNavClick('live')} className="cg-sl-item" title="Live Matches">
          <Activity />
          <span>Live</span>
        </button>
        <button onClick={() => handleNavClick('history')} className="cg-sl-item" title="Resources">
          <BookOpen />
          <span>Resources</span>
        </button>
      </aside>

      {/* ── Right Sidebar Dock (Desktop Social Icons) ── */}
      <aside className="cg-sidebar-right pointer-events-auto">
        {/* Discord */}
        <a href="https://discord.com" target="_blank" rel="noreferrer" className="cg-sr-icon" title="Discord">
          <svg viewBox="0 0 24 24"><path d="M20.3 4.4A18.4 18.4 0 0015.5 3c-.2.4-.5.9-.6 1.3a17 17 0 00-5.7 0C9 3.9 8.6 3.4 8.4 3a18.5 18.5 0 00-4.8 1.4C1.1 8.6.5 12.6 1 16.5a18.6 18.6 0 005.7 2.9c.5-.6.9-1.3 1.2-2a12 12 0 01-1.9-1c.2-.1.3-.2.5-.3a13.2 13.2 0 0011.4 0l.4.3a12 12 0 01-1.9 1c.4.7.8 1.4 1.2 2a18.5 18.5 0 005.7-2.9c.5-4.5-.8-8.4-3.4-12.1zM8.5 14.1c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3c1.1 0 2 1 2 2.3s-.9 2.3-2 2.3zm7 0c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3c1.1 0 2 1 2 2.3s-.9 2.3-2 2.3z"/></svg>
        </a>
        {/* X / Twitter */}
        <a href="https://x.com" target="_blank" rel="noreferrer" className="cg-sr-icon" title="X (Twitter)">
          <svg viewBox="0 0 24 24"><path d="M18.3 3h3.1L14.5 11l8 10.5h-6.8l-4.9-6.4-5.6 6.4H2.1l7.5-8.6L2 3h7l4.4 5.8L18.3 3z"/></svg>
        </a>
        {/* Instagram */}
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cg-sr-icon" title="Instagram">
          <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>
        </a>
        {/* YouTube */}
        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="cg-sr-icon" title="YouTube">
          <svg viewBox="0 0 24 24"><path d="M22.5 6.5a3 3 0 00-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.4A3 3 0 001.5 6.5C1 8.3 1 12 1 12s0 3.7.5 5.5a3 3 0 002.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.4a3 3 0 002.1-2.1C23 15.7 23 12 23 12s0-3.7-.5-5.5z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/></svg>
        </a>
        {/* LinkedIn */}
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="cg-sr-icon" title="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        {/* GitHub */}
        <a href="https://github.com/StrangerLooter/Chessgrid" target="_blank" rel="noreferrer" className="cg-sr-icon" title="GitHub Repository">
          <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </aside>

      {/* ── Right Vertical Side Banner ── */}
      <div className="cg-side-banner">
        STRATEGY &nbsp;·&nbsp; BRINGS &nbsp;·&nbsp; PEOPLE &nbsp;·&nbsp; TOGETHER
      </div>

      {/* ── Main Centerpiece Hero Content ── */}
      <div
        ref={heroContentRef}
        className="cg-hero-content pointer-events-auto"
      >
        {/* Eyebrow */}
        <p className="cg-hero-eyebrow">
          PLAN <span>·</span> ORGANIZE <span>·</span> COMPETE <span>·</span> EXPERIENCE
        </p>

        {/* ── High-Res Chiseled Metallic Logo Image Asset ── */}
        <div className="cg-hero-logo-container my-2 sm:my-3">
          <img
            src="/chessgrid-logo.png"
            alt="CHESSGRID — The Digital Arena For Chess Tournaments"
            className="cg-hero-logo-img w-full max-w-[560px] sm:max-w-[700px] md:max-w-[820px] lg:max-w-[920px] xl:max-w-[980px] h-auto object-contain select-none pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* ── Subtitle Block ── */}
        <div className="cg-hero-subtitle-block">
          <p className="cg-hero-subtitle-top">
            THE DIGITAL ARENA FOR
          </p>
          <p className="cg-hero-subtitle-bottom">
            CHESS TOURNAMENTS
          </p>
        </div>

        {/* ── 4 Feature Icons Row ── */}
        <div className="cg-hero-features">
          {/* Players */}
          <button className="cg-hero-feat" onClick={() => handleNavClick('players')}>
            <Users />
            <span>PLAYERS</span>
          </button>

          {/* Brackets */}
          <button className="cg-hero-feat" onClick={() => handleNavClick('bracket')}>
            <GitBranch />
            <span>BRACKETS</span>
          </button>

          {/* Live Matches */}
          <button className="cg-hero-feat" onClick={() => handleNavClick('live')}>
            <Radio />
            <span>LIVE MATCHES</span>
          </button>

          {/* Real Results */}
          <button className="cg-hero-feat" onClick={() => handleNavClick('history')}>
            <BarChart2 />
            <span>REAL RESULTS</span>
          </button>
        </div>

        {/* ── Dual Hero CTA Buttons ── */}
        <div className="cg-hero-actions">
          {/* + CREATE TOURNAMENT */}
          <button
            onClick={onOpenNewTournament || onEnter}
            className="cg-btn-primary"
          >
            <Plus className="w-4 h-4 text-[#ffe699]" />
            <span>CREATE TOURNAMENT</span>
          </button>

          {/* EXPLORE TOURNAMENTS */}
          <button
            onClick={onEnter}
            className="cg-btn-secondary"
          >
            <Compass className="w-4 h-4 text-[#e8c45a]" />
            <span>EXPLORE TOURNAMENTS</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Section: Left Quote, Center Scroll, Right Quote ── */}
      <div className="w-full max-w-[1720px] mx-auto flex items-end justify-between pointer-events-auto pb-1">
        
        {/* Bottom Left Quote */}
        <div className="cg-corner-text-left">
          <b>MORE</b><br />
          THAN A GAME<br />
          A BIGGER STAGE
        </div>

        {/* Center Scroll Prompt */}
        <button
          onClick={scrollToNext}
          className="cg-scroll-indicator"
        >
          <span>SCROLL</span>
          <div className="cg-scroll-arrow" />
        </button>

        {/* Bottom Right Quote */}
        <div className="cg-corner-text-right">
          <b>PLAY</b><br />
          ORGANIZE<br />
          INSPIRE
        </div>
      </div>
    </div>
  );
};

export default HeroTypography;

