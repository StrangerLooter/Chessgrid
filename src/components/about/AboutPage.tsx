import React, { useState, useEffect } from 'react';
import { 
  User, 
  Target, 
  Lightbulb, 
  Cpu, 
  BarChart3, 
  Mail, 
  ArrowRight, 
  X, 
  Home, 
  Trophy, 
  Users, 
  Calendar, 
  Radio, 
  BookOpen, 
  Info,
  CheckCircle2,
  Copy,
  Crown,
  Zap,
  ShieldCheck,
  Compass,
  Clock,
  Gamepad2
} from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateCommand: () => void;
  onNavigatePlay?: () => void;
}

type ActiveModal = 'creator' | 'vision' | 'why' | 'technology' | 'status' | 'connect' | null;

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateCommand,
  onNavigatePlay,
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Sync route and handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handlePlayClick = () => {
    if (onNavigatePlay) {
      onNavigatePlay();
    } else {
      window.history.pushState({}, '', '/play');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, onClick: onNavigateHome },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-4 h-4" />, onClick: onNavigateCommand },
    { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" />, onClick: onNavigateCommand },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" />, onClick: onNavigateCommand },
    { id: 'live', label: 'Live', icon: <Radio className="w-4 h-4" />, onClick: onNavigateCommand },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" />, onClick: () => setActiveModal('technology') },
    { id: 'play', label: 'Play', icon: <Gamepad2 className="w-4 h-4" />, onClick: handlePlayClick },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" />, isActive: true, onClick: () => {} },
  ];

  return (
    <div
      id="cg-about-page"
      className="relative min-h-screen w-full overflow-x-hidden text-[#f5f0e8] select-none font-sans"
      style={{
        backgroundColor: '#070405',
        backgroundImage: `
          radial-gradient(ellipse at 50% 15%, rgba(185, 28, 28, 0.18) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 40%, rgba(220, 38, 38, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 15% 80%, rgba(153, 27, 27, 0.15) 0%, transparent 60%),
          url('/about-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* ── Ambient Futuristic Grid & Smoke Overlay ── */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(220, 38, 38, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(220, 38, 38, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Top Atmospheric Vignette ── */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(7, 4, 5, 0.85) 100%)',
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          TOP HORIZONTAL NAVBAR (Matching Image 2 Reference)
          ══════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Crest & Tagline */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group transition-transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-red-950/80 border border-amber-500/40 shadow-[0_0_15px_rgba(201,168,76,0.3)]">
            <span className="text-xl">♞</span>
          </div>
          <div className="flex flex-col">
            <span 
              className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white leading-tight"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              CHESSGRID™
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-amber-400/80 font-mono uppercase">
              PLAN • ORGANIZE • COMPETE
            </span>
          </div>
        </div>

        {/* Center: Floating Cockpit Pill Navigation */}
        <nav 
          className="hidden md:flex items-center gap-1 p-1 rounded-full backdrop-blur-xl border border-red-500/30 shadow-[0_0_25px_rgba(220,38,38,0.25)]"
          style={{ background: 'rgba(15, 8, 10, 0.85)' }}
          aria-label="About Main Navigation"
        >
          <button
            onClick={onNavigateCommand}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            TOURNAMENTS
          </button>
          <button
            onClick={onNavigateCommand}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            PLAYERS
          </button>
          <button
            onClick={onNavigateHome}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            FEATURES
          </button>
          <button
            onClick={() => setActiveModal('connect')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            COMMUNITY
          </button>
          <button
            onClick={handlePlayClick}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-all cursor-pointer"
          >
            PLAY CHESS
          </button>
          {/* Active ABOUT pill */}
          <button
            className="px-5 py-1.5 rounded-full text-xs font-bold tracking-widest text-red-400 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-default"
            style={{ background: 'rgba(185, 28, 28, 0.25)' }}
          >
            ABOUT
          </button>
        </nav>

        {/* Right: GET STARTED Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateCommand}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wider text-white border border-red-500/60 hover:border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all cursor-pointer group active:scale-95"
            style={{ background: 'linear-gradient(135deg, rgba(185,28,28,0.35), rgba(15,8,10,0.9))' }}
          >
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            <span>GET STARTED</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════
          MAIN BODY WITH LEFT DOCK, CENTER CONTENT, & RIGHT DOCK
          ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 flex items-start justify-between gap-4">
        
        {/* ── LEFT VERTICAL DOCK (Matching Image 2 Reference) ── */}
        <aside className="hidden lg:flex flex-col items-center gap-2 p-2 rounded-2xl backdrop-blur-xl border border-red-500/30 shadow-[0_0_25px_rgba(220,38,38,0.2)] shrink-0 sticky top-24" style={{ background: 'rgba(12, 6, 8, 0.88)' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-16 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative group ${
                item.isActive 
                  ? 'bg-red-950/60 border border-red-500/80 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title={item.label}
            >
              {item.isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-red-500 shadow-[0_0_8px_#ef4444]" />
              )}
              {item.icon}
              <span className="text-[9px] font-mono tracking-wider font-semibold uppercase">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* ── CENTER CONTENT WRAPPER ── */}
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* ── HERO BANNER: ABOUT CHESSGRID + 3D KNIGHT PIECE ── */}
          <div className="w-full relative py-4 sm:py-8 flex flex-col items-center text-center">
            
            {/* Top Tag */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-red-500/60" />
              <p 
                className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-red-400 uppercase"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                — A B O U T —
              </p>
              <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-red-500/60" />
            </div>

            {/* Giant 3D Metallic Title */}
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.08em] uppercase select-none leading-none my-1"
              style={{
                fontFamily: 'var(--font-cinematic)',
                background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 25%, #cbd5e1 50%, #94a3b8 75%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 35px rgba(239,68,68,0.45)) drop-shadow(0 10px 20px rgba(0,0,0,0.9))',
              }}
            >
              CHESSGRID
            </h1>

            {/* Tagline */}
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] font-mono text-slate-300 mt-2 uppercase font-medium">
              PEOPLE • TOURNAMENTS • A BIGGER TOMORROW
            </p>

            {/* 3D Black Knight Graphic (Positioned in Upper Right / Ambient Glow) */}
            <div 
              className="hidden xl:block absolute right-[-40px] top-[-10px] w-44 h-44 pointer-events-none opacity-90 transition-transform duration-700 hover:scale-105"
              style={{
                filter: 'drop-shadow(0 0 25px rgba(220,38,38,0.5))',
              }}
            >
              <img 
                src="/about-knight.jpg" 
                alt="Obsidian Knight Chess Piece" 
                className="w-full h-full object-contain rounded-2xl mask-radial"
                style={{
                  maskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              THE 6 CORE HUD CARDS (3x2 Grid Matching Image 2)
              ══════════════════════════════════════════════════════════ */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            
            {/* ── CARD 1: THE CREATOR ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                {/* Header Icon + Ring */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  THE CREATOR
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  The person behind ChessGrid, and the journey that started it all.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('creator')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* ── CARD 2: VISION ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  VISION
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  The goals and future we are building towards.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('vision')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* ── CARD 3: WHY CHESSGRID ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  WHY CHESSGRID
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  The ideas, problems, and inspiration behind the platform.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('why')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* ── CARD 4: TECHNOLOGY ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  TECHNOLOGY
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  The tools and technologies that power ChessGrid.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('technology')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* ── CARD 5: PROJECT STATUS ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  PROJECT STATUS
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Current progress, development status, and what's next.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('status')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* ── CARD 6: CONNECT ── */}
            <div 
              className="relative p-6 rounded-2xl border border-red-500/30 hover:border-red-500/70 transition-all duration-300 backdrop-blur-xl group hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.85) 0%, rgba(10, 5, 7, 0.95) 100%)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-red-500/50 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <h2 
                  className="text-lg font-bold tracking-wider text-white uppercase mb-2"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  CONNECT
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Get in touch and follow the journey ahead.
                </p>
              </div>

              <button
                onClick={() => setActiveModal('connect')}
                className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
              >
                <span>LEARN MORE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              BOTTOM FOOTER HUD ELEMENTS (Matching Image 2 Reference)
              ══════════════════════════════════════════════════════════ */}
          <footer className="w-full mt-12 pt-6 border-t border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] sm:text-xs font-mono">
            <div>
              <span className="text-red-400 font-bold">BUILT FOR PLAYERS</span> BY A DEVELOPER
            </div>

            <div className="flex items-center gap-2 tracking-[0.25em] text-amber-400 uppercase">
              <Crown className="w-4 h-4 text-red-400" />
              <span>ORGANIZE • COMPETE • BELONG</span>
            </div>

            <div className="text-right">
              ONE MOVE CLOSER TO A <span className="text-red-400 font-bold">BRIGHTER TOMORROW</span>
            </div>
          </footer>
        </main>

        {/* ── RIGHT VERTICAL SOCIAL DOCK (Matching Image 2 Reference) ── */}
        <aside className="hidden lg:flex flex-col items-center gap-3 p-3 rounded-2xl backdrop-blur-xl border border-red-500/30 shadow-[0_0_25px_rgba(220,38,38,0.2)] shrink-0 sticky top-24" style={{ background: 'rgba(12, 6, 8, 0.88)' }}>
          {[
            { id: 'discord', label: 'Discord', symbol: '👾' },
            { id: 'x', label: 'X (Twitter)', symbol: '𝕏' },
            { id: 'instagram', label: 'Instagram', symbol: '📸' },
            { id: 'youtube', label: 'YouTube', symbol: '▶' },
            { id: 'linkedin', label: 'LinkedIn', symbol: 'in' },
            { id: 'github', label: 'GitHub', symbol: '⌥' },
          ].map((soc) => (
            <button
              key={soc.id}
              onClick={() => setActiveModal('connect')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-950/40 hover:border-red-500/60 border border-transparent transition-all cursor-pointer shadow-sm"
              title={soc.label}
              aria-label={soc.label}
            >
              <span>{soc.symbol}</span>
            </button>
          ))}
        </aside>

      </div>

      {/* ══════════════════════════════════════════════════════════
          FUNCTIONAL LEARN MORE MODALS
          ══════════════════════════════════════════════════════════ */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border border-red-500/60 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-left"
            style={{
              background: 'linear-gradient(145deg, rgba(20, 8, 10, 0.98) 0%, rgba(10, 4, 6, 0.98) 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>

            {/* ── MODAL 1: THE CREATOR ── */}
            {activeModal === 'creator' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      RAM VISHWAKARMA
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      Creator & Developer
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-4">
                  <p className="text-sm leading-relaxed text-slate-200 font-sans">
                    "Ram Vishwakarma is the creator and developer of ChessGrid, building a modern platform that brings chess tournament management, real-time competition, and immersive digital experiences together. ChessGrid is being developed with a focus on making tournaments easier to organize, manage, and experience."
                  </p>
                </div>

                {/* Structured placeholders for future public links */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <span>PUBLIC PROFILES & REPOSITORIES</span>
                  <span className="text-red-400 font-semibold">[ Public links will be linked here ]</span>
                </div>
              </div>
            )}

            {/* ── MODAL 2: VISION ── */}
            {activeModal === 'vision' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      PLATFORM VISION
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      Goals & Future Direction
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-200 leading-relaxed font-sans">
                  <p>
                    ChessGrid exists to transform chess tournament management from fragmented, paper-heavy chaos into an elegant, high-precision digital arena.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-lg bg-black/40 border border-red-500/20">
                      <h4 className="font-bold text-red-400 text-xs mb-1 font-mono uppercase flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> Frictionless Arbiters
                      </h4>
                      <p className="text-xs text-slate-300">
                        Zero delays between rounds with automated bracket pairing, deterministic tie-breaking, and live digital boards.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/40 border border-red-500/20">
                      <h4 className="font-bold text-red-400 text-xs mb-1 font-mono uppercase flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" /> Stage Broadcast Wall
                      </h4>
                      <p className="text-xs text-slate-300">
                        Venue projector broadcast mode to stream live tournament brackets and timer clocks directly onto venue screens.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/40 border border-red-500/20">
                      <h4 className="font-bold text-red-400 text-xs mb-1 font-mono uppercase flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Arbiter Rollback Safety
                      </h4>
                      <p className="text-xs text-slate-300">
                        Immutable snapshot-based undo history allowing arbiters to repair accidental score inputs without corrupting brackets.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/40 border border-red-500/20">
                      <h4 className="font-bold text-red-400 text-xs mb-1 font-mono uppercase flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" /> Universal Tournament Scale
                      </h4>
                      <p className="text-xs text-slate-300">
                        Built for clubs, schools, open championships, and competitive global organizers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MODAL 3: WHY CHESSGRID ── */}
            {activeModal === 'why' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Lightbulb className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      WHY CHESSGRID
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      The Problem & The Solution
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-200 leading-relaxed font-sans">
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30">
                    <h4 className="font-bold text-red-400 text-xs mb-1 font-mono uppercase">
                      ⚠️ The Problem With Traditional Chess Events
                    </h4>
                    <p className="text-xs text-slate-300">
                      Most chess events still rely on paper pairings pinned to walls, physical chess clocks that can't sync with organizers, and decades-old desktop software with confusing interfaces. Players and spectators are left waiting in confusion between rounds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <h4 className="font-bold text-emerald-400 text-xs mb-1 font-mono uppercase">
                      ✨ The ChessGrid Solution
                    </h4>
                    <p className="text-xs text-slate-300">
                      A single unified web platform that handles player registration, deterministic knockout and swiss brackets, synchronized digital Fischer chess timers, and a fullscreen broadcast mode. Everything updates instantly across arbiters, players, and venue screens.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── MODAL 4: TECHNOLOGY ── */}
            {activeModal === 'technology' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Cpu className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      TECHNOLOGY STACK
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      Verified Production Architecture
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'React 19', desc: 'Modern component architecture' },
                    { name: 'TypeScript 6', desc: 'Strict type safety & models' },
                    { name: 'Vite 8', desc: 'Ultra-fast HMR & bundler' },
                    { name: 'Tailwind CSS 4', desc: 'CSS tokens & fluid utility' },
                    { name: 'GSAP 3', desc: 'ScrollTrigger & ticker physics' },
                    { name: 'Web Audio API', desc: 'Synthesized Fischer buzzers' },
                    { name: 'Canvas Confetti', desc: 'Championship victory effects' },
                    { name: 'Lucide Icons', desc: 'Crisp vector interface icons' },
                    { name: 'LocalStorage I/O', desc: 'Throttled snapshot persistence' },
                  ].map((tech) => (
                    <div key={tech.name} className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <div className="font-bold text-xs text-white font-mono">{tech.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MODAL 5: PROJECT STATUS ── */}
            {activeModal === 'status' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <BarChart3 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      PROJECT STATUS
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      Verified Progress & Roadmap
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Live & Verified Features
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li>Deterministic binary knockout bracket tree generator</li>
                      <li>Live dual Fischer digital chess clocks with flag fall buzzers</li>
                      <li>Arbiter board management & match assignment table</li>
                      <li>Player roster pool, manual pairing & CSV bulk import</li>
                      <li>Hall of Honor golden podium & eliminated leaderboard</li>
                      <li>Snapshot-based result undo & bracket repair engine</li>
                      <li>Fullscreen projector wall display mode for venue streaming</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-amber-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-2">
                      <Clock className="w-4 h-4" /> In Progress / Roadmap
                    </h4>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li>Swiss-System pairing engine for open large tournaments</li>
                      <li>FIDE ELO performance rating calculator</li>
                      <li>WebRTC multi-device arbiter synchronization</li>
                      <li>Mobile PWA offline support for field arbiters</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ── MODAL 6: CONNECT ── */}
            {activeModal === 'connect' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border border-red-500/60 bg-red-950/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <Mail className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      CONNECT
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400">
                      Get in Touch
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                    <p className="text-slate-300 text-sm font-sans">
                      Have feedback, tournament suggestions, or want to collaborate on ChessGrid development?
                    </p>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/70 border border-red-500/30">
                      <span className="text-slate-300">Project Channel:</span>
                      <button
                        onClick={() => handleCopy('chessgrid.dev@gmail.com', 'email')}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/50 border border-red-500/50 text-red-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedText === 'email' ? 'COPIED!' : 'Copy Project Contact'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 text-center text-slate-400">
                    [ Structured placeholders for public GitHub repository & social channels will be added here ]
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AboutPage;
