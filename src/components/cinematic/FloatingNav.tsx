import React, { useState } from 'react';
import { useScroll, type CinematicWaypoint } from '../../context/ScrollContext';
import { WAYPOINT_RANGES } from '../../context/ScrollContext';

interface FloatingNavProps {
  onCommandCenter: () => void;
}



const NAV_ITEMS: { waypoint: CinematicWaypoint; label: string; icon: string }[] = [
  { waypoint: 'hero',       label: 'HOME',        icon: '⌂' },
  { waypoint: 'tournament', label: 'TOURNAMENT',   icon: '♔' },
  { waypoint: 'players',    label: 'PLAYERS',      icon: '♟' },
  { waypoint: 'pairing',    label: 'PAIRINGS',     icon: '⇌' },
  { waypoint: 'bracket',    label: 'BRACKET',      icon: '♜' },
  { waypoint: 'match',      label: 'MATCHES',      icon: '♞' },
  { waypoint: 'final',      label: 'FINAL',        icon: '♛' },
  { waypoint: 'champion',   label: 'CHAMPION',     icon: '★' },
];

const scrollToWaypoint = (waypoint: CinematicWaypoint) => {
  const [start] = WAYPOINT_RANGES[waypoint];
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = (start / 100) * totalHeight;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
};

export const FloatingNav: React.FC<FloatingNavProps> = ({ onCommandCenter }) => {
  const { waypoint } = useScroll();
  const [hoveredItem, setHoveredItem] = useState<CinematicWaypoint | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ── Top Horizontal Nav (Desktop) ── */}
      <nav
        id="cg-floating-nav"
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          padding: '0.5rem 1rem',
          background: 'rgba(10, 10, 11, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: '2px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
        className="cg-nav-desktop"
      >
        {/* Wordmark */}
        <span
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: '1.1rem',
            fontWeight: 400,
            letterSpacing: '0.18em',
            color: 'var(--cg-ivory)',
            marginRight: '1.5rem',
            paddingRight: '1.5rem',
            borderRight: '1px solid rgba(201,168,76,0.2)',
            cursor: 'pointer',
          }}
          onClick={() => scrollToWaypoint('hero')}
        >
          CHESSGRID™
        </span>

        {/* Nav items */}
        {NAV_ITEMS.slice(1, 7).map(({ waypoint: wp, label }) => (
          <button
            key={wp}
            onClick={() => scrollToWaypoint(wp)}
            aria-label={`Go to ${label} section`}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.4rem 0.75rem',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: waypoint === wp ? 'var(--cg-gold)' : 'rgba(200,192,174,0.55)',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              borderBottom: waypoint === wp ? '1px solid var(--cg-gold)' : '1px solid transparent',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--cg-ivory)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = waypoint === wp ? 'var(--cg-gold)' : 'rgba(200,192,174,0.55)'; }}
          >
            {label}
          </button>
        ))}

        {/* Command Center CTA */}
        <button
          className="cg-btn cg-btn-primary"
          onClick={onCommandCenter}
          id="cg-command-center-btn"
          aria-label="Open Tournament Command Center"
          style={{
            marginLeft: '1rem',
            padding: '0.4rem 1.2rem',
            fontSize: '0.6rem',
          }}
        >
          ⚙ COMMAND CENTER
        </button>
      </nav>



      {/* ── Mobile Top Bar ── */}
      <nav
        id="cg-mobile-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background: 'rgba(10,10,11,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}
        className="cg-nav-mobile"
      >
        <span
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: '1rem',
            letterSpacing: '0.15em',
            color: 'var(--cg-ivory)',
          }}
        >
          CHESSGRID™
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(o => !o)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          style={{
            background: 'none',
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'var(--cg-ivory)',
            padding: '0.35rem 0.65rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '48px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'rgba(10,10,11,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(201,168,76,0.15)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {NAV_ITEMS.map(({ waypoint: wp, label, icon }) => (
            <button
              key={wp}
              onClick={() => { scrollToWaypoint(wp); setIsMobileMenuOpen(false); }}
              aria-label={`Go to ${label} section`}
              style={{
                background: waypoint === wp ? 'rgba(201,168,76,0.08)' : 'none',
                border: 'none',
                borderLeft: waypoint === wp ? '2px solid var(--cg-gold)' : '2px solid transparent',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: waypoint === wp ? 'var(--cg-gold)' : 'var(--cg-ivory-dim)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ opacity: 0.7 }}>{icon}</span>
              {label}
            </button>
          ))}
          <button
            className="cg-btn cg-btn-primary"
            onClick={() => { onCommandCenter(); setIsMobileMenuOpen(false); }}
            aria-label="Open Tournament Command Center"
            style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
          >
            ⚙ COMMAND CENTER
          </button>
        </div>


      )}

      {/* ── Desktop Vertical Side Rail ── */}
      <div
        id="cg-side-rail"
        style={{
          position: 'fixed',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
        className="cg-side-rail"
      >
        {NAV_ITEMS.map(({ waypoint: wp, label, icon }) => (
          <div
            key={wp}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setHoveredItem(wp)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Hovered label */}
            {hoveredItem === wp && (
              <div
                style={{
                  position: 'absolute',
                  left: '2.5rem',
                  background: 'rgba(10,10,11,0.9)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  padding: '0.25rem 0.75rem',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: 'var(--cg-gold)',
                  borderRadius: '2px',
                  pointerEvents: 'none',
                }}
              >
                {label}
              </div>
            )}
            <button
              onClick={() => scrollToWaypoint(wp)}
              title={label}
              aria-label={`Go to ${label} section`}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: waypoint === wp ? 'rgba(201,168,76,0.15)' : 'rgba(10,10,11,0.6)',
                border: waypoint === wp ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.12)',
                borderRadius: '2px',
                color: waypoint === wp ? 'var(--cg-gold)' : 'rgba(200,192,174,0.4)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                transform: hoveredItem === wp ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              {icon}
            </button>
          </div>
        ))}
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .cg-nav-desktop { display: none !important; }
          .cg-side-rail    { display: none !important; }
          .cg-nav-mobile   { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .cg-nav-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default FloatingNav;
