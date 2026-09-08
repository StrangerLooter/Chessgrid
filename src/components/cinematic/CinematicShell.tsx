import React, { Suspense, useRef, useState } from 'react';
import { ScrollProvider } from '../../context/ScrollContext';
import { ScrollOrchestrator } from './ScrollOrchestrator';
import { FloatingNav } from './FloatingNav';
import { HeroTypography } from './HeroTypography';
import { NewTournamentModal } from '../common/NewTournamentModal';
import { CinematicVideoBackground } from './CinematicVideoBackground';

// Lazy-load rich cinematic scenes for instant initial boot performance
const PlayerGalleryScene = React.lazy(() => import('./PlayerGalleryScene'));
const PairingChamberScene = React.lazy(() => import('./PairingChamberScene'));
const BracketStructureScene = React.lazy(() => import('./BracketStructureScene'));
const ProjectorBroadcastScene = React.lazy(() => import('./ProjectorBroadcastScene'));
const ChampionPodiumScene = React.lazy(() => import('./ChampionPodiumScene'));

/** Suspense fallback with subtle golden glyph */
const SceneFallback: React.FC<{ icon: string }> = ({ icon }) => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,168,76,0.3)', fontSize: '2rem' }}>
    {icon}
  </div>
);

interface CinematicShellProps {
  onCommandCenter: () => void;
  onOpenNewTournament?: () => void;
  onNavigateAbout?: () => void;
  onNavigatePlay?: () => void;
}

export const CinematicShell: React.FC<CinematicShellProps> = ({ 
  onCommandCenter, 
  onOpenNewTournament,
  onNavigateAbout,
  onNavigatePlay
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLocalNewTournamentOpen, setIsLocalNewTournamentOpen] = useState(false);

  const handleOpenTournament = onOpenNewTournament || (() => setIsLocalNewTournamentOpen(true));

  return (
    <ScrollProvider>
      {/* GSAP ScrollTrigger controller that maps scroll percentage to context */}
      <ScrollOrchestrator />

      {/* Floating navigation dock */}
      <FloatingNav 
        onCommandCenter={onCommandCenter} 
        onOpenNewTournament={handleOpenTournament}
        onNavigateAbout={onNavigateAbout}
        onNavigatePlay={onNavigatePlay}
      />

      {/* Persistent Hardware-Accelerated Video Background Engine */}
      <CinematicVideoBackground />

      {/* Main interactive UI overlay container */}
      <main
        ref={scrollContainerRef}
        id="cg-cinematic-container"
        role="main"
        aria-label="ChessGrid 3D Cinematic Arena Experience"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'transparent',
          overflowX: 'hidden',
        }}
      >
        {/* ════════════════════════════════════════════
            CHAPTER 01 — HERO
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-hero"
          aria-label="ChessGrid Tournament Hero"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          {/* Typography & Controls layer */}
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            <HeroTypography 
              onEnter={onCommandCenter} 
              onOpenNewTournament={handleOpenTournament}
              onNavigatePlay={onNavigatePlay}
            />
          </div>

          {/* Subtle bottom vignette feathering */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              background: 'linear-gradient(to bottom, transparent, rgba(10, 10, 11, 0.4))',
              pointerEvents: 'none',
            }}
          />
        </section>

        {/* Scroll spacer — hero range */}
        <div style={{ height: '100vh' }} aria-hidden="true" />

        {/* ════════════════════════════════════════════
            CHAPTER 02 — PLAYERS & ROSTER
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-players"
          aria-label="Tournament Players Gallery"
          className="cg-content-visibility"
          style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}
        >
          <Suspense fallback={<SceneFallback icon="♟" />}>
            <PlayerGalleryScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            CHAPTER 03 — PAIRING CHAMBER
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-pairing"
          aria-label="Tournament Pairing Chamber"
          className="cg-content-visibility"
          style={{ position: 'relative', background: 'transparent' }}
        >
          <Suspense fallback={<SceneFallback icon="⇌" />}>
            <PairingChamberScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            CHAPTER 04 — GIANT KNOCKOUT BRACKET
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-bracket"
          aria-label="Knockout Bracket Structure"
          className="cg-content-visibility"
          style={{ position: 'relative', background: 'transparent' }}
        >
          <Suspense fallback={<SceneFallback icon="♜" />}>
            <BracketStructureScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            CHAPTER 05 — BROADCAST & PROJECTOR WALL
            ════════════════════════════════════════════ */}
        <div className="cg-content-visibility">
          <Suspense fallback={<SceneFallback icon="📺" />}>
            <ProjectorBroadcastScene />
          </Suspense>
        </div>

        {/* ════════════════════════════════════════════
            CHAPTER 06 — CHAMPION CORONATION
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-champion"
          aria-label="Champion Podium"
          className="cg-content-visibility"
          style={{ position: 'relative', background: 'transparent' }}
        >
          <Suspense fallback={<SceneFallback icon="★" />}>
            <ChampionPodiumScene />
          </Suspense>
        </section>
      </main>

      {/* New Tournament Creation Modal */}
      <NewTournamentModal
        isOpen={isLocalNewTournamentOpen}
        onClose={() => setIsLocalNewTournamentOpen(false)}
      />
    </ScrollProvider>
  );
};

export default CinematicShell;
