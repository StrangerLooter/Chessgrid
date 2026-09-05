import React, { Suspense, useRef } from 'react';
import { ScrollProvider } from '../../context/ScrollContext';
import { ScrollOrchestrator } from './ScrollOrchestrator';
import { FloatingNav } from './FloatingNav';
import { HeroTypography } from './HeroTypography';
import { TournamentIntroScene } from './TournamentIntroScene';


// Lazy-load heavy scenes
const HeroScene = React.lazy(() => import('./HeroScene'));
const PlayerGalleryScene = React.lazy(() => import('./PlayerGalleryScene'));
const PairingChamberScene = React.lazy(() => import('./PairingChamberScene'));
const BracketStructureScene = React.lazy(() => import('./BracketStructureScene'));
const MatchArenaScene = React.lazy(() => import('./MatchArenaScene'));
const FinalArenaScene = React.lazy(() => import('./FinalArenaScene'));
const ChampionPodiumScene = React.lazy(() => import('./ChampionPodiumScene'));

/** Suspense fallback with chess piece */
const SceneFallback: React.FC<{ icon: string }> = ({ icon }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,168,76,0.3)', fontSize: '2rem' }}>
    {icon}
  </div>
);

interface CinematicShellProps {
  onCommandCenter: () => void;
}

export const CinematicShell: React.FC<CinematicShellProps> = ({ onCommandCenter }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollProvider>
      {/* GSAP ScrollTrigger controller */}
      <ScrollOrchestrator />

      {/* Floating navigation */}
      <FloatingNav onCommandCenter={onCommandCenter} />

      {/* Scroll container — this is what GSAP measures */}


      <main
        ref={scrollContainerRef}
        id="cg-cinematic-container"
        role="main"
        aria-label="ChessGrid 3D Tournament Experience"
        style={{
          position: 'relative',
          background: 'var(--cg-obsidian)',
          overflowX: 'hidden',
        }}
      >

        {/* ════════════════════════════════════════════
            SECTION 01 — HERO (sticky 3D canvas)
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-hero"
          aria-label="ChessGrid Tournament Hero"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            background: '#0a0a0b',
          }}
        >

          {/* 3D Canvas — full bleed */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Suspense
              fallback={
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--cg-obsidian)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: '1.5rem',
                      letterSpacing: '0.3em',
                      color: 'rgba(201,168,76,0.5)',
                    }}
                  >
                    ♛
                  </div>
                </div>
              }
            >
              <HeroScene />
            </Suspense>
          </div>

          {/* Typography layer — transitions between hero text and tournament intro */}
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            <HeroTypography onEnter={onCommandCenter} />
            <TournamentIntroScene />
          </div>

          {/* Bottom vignette */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to bottom, transparent, var(--cg-obsidian))',
              pointerEvents: 'none',
            }}
          />
        </section>

        {/* ════════════════════════════════════════════
            Scroll spacer — hero section (100vh = hero scroll range)
            ════════════════════════════════════════════ */}
        <div style={{ height: '200vh' }} aria-hidden="true" />

        {/* ════════════════════════════════════════════
            SECTION 03 — PLAYERS
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-players"
          aria-label="Tournament Players Gallery"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle ambient background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(26,122,94,0.03) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
          <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,168,76,0.3)', fontSize: '2rem' }}>♟</div>}>
            <PlayerGalleryScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 04 — PAIRING
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-pairing"
          aria-label="Tournament Pairing Chamber"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,168,76,0.3)', fontSize: '2rem' }}>⇌</div>}>
            <PairingChamberScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 05 — BRACKET
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-bracket"
          aria-label="Knockout Bracket Structure"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<SceneFallback icon="♜" />}>
            <BracketStructureScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 06 — MATCH
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-match"
          aria-label="Live Match Arena"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<SceneFallback icon="♞" />}>
            <MatchArenaScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 07 — FINAL
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-final"
          aria-label="The Decisive Final Arena"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<SceneFallback icon="♛" />}>
            <FinalArenaScene />
          </Suspense>
        </section>

        {/* ════════════════════════════════════════════
            SECTION 08 — CHAMPION
            ════════════════════════════════════════════ */}
        <section
          id="cg-section-champion"
          aria-label="Champion Podium"
          style={{ position: 'relative' }}
        >
          <Suspense fallback={<SceneFallback icon="★" />}>
            <ChampionPodiumScene />
          </Suspense>
        </section>

      </main>
    </ScrollProvider>
  );
};

export default CinematicShell;
