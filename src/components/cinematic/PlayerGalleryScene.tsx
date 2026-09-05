import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import type { Player } from '../../types/tournament';
import { PlayerProfileCinematic } from './PlayerProfileCinematic';

/* ── Chess piece per status ── */
const PIECE_ICONS: Record<string, string> = {
  champion:   '♛',
  active:     '♟',
  eliminated: '♙',
  registered: '♞',
  withdrawn:  '♜',
};

const STATUS_COLORS: Record<string, string> = {
  champion:   '#c9a84c',
  active:     '#22a67a',
  eliminated: '#444',
  registered: '#c8c0ae',
  withdrawn:  '#3a3a3a',
};

const STATUS_LABELS: Record<string, string> = {
  champion:   'CHAMPION',
  active:     'ACTIVE',
  eliminated: 'ELIMINATED',
  registered: 'REGISTERED',
  withdrawn:  'WITHDRAWN',
};

/* ── Individual player card ── */
const PlayerCard: React.FC<{
  player: Player;
  index: number;
  isRevealed: boolean;
  onSelect: (p: Player) => void;
}> = ({ player, index, isRevealed, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const piece = PIECE_ICONS[player.status] ?? '♟';
  const color = STATUS_COLORS[player.status] ?? '#c8c0ae';
  const label = STATUS_LABELS[player.status] ?? 'PLAYER';
  const delay = (index % 8) * 0.07;

  return (
    <div
      ref={cardRef}
      id={`cg-player-card-${player.id}`}
      onClick={() => onSelect(player)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        background: isHovered
          ? `rgba(${player.status === 'active' ? '34,166,122' : player.status === 'champion' ? '201,168,76' : '30,30,35'},0.12)`
          : 'rgba(10,10,11,0.65)',
        border: `1px solid ${isHovered ? color + '50' : 'rgba(201,168,76,0.08)'}`,
        outline: `1px solid ${isHovered ? color + '40' : 'transparent'}`,
        outlineOffset: '-1px',
        padding: '1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
        transition: `
          background 0.3s ease,
          border-color 0.3s ease,
          outline-color 0.3s ease,
          transform 0.4s cubic-bezier(0.16,1,0.3,1),
          box-shadow 0.4s ease,
          opacity 0.6s ${delay}s ease
        `,
        transform: isRevealed
          ? isHovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)'
          : 'translateY(30px)',
        opacity: isRevealed ? 1 : 0,
        boxShadow: isHovered ? `0 12px 40px rgba(0,0,0,0.5), 0 0 20px -8px ${color}` : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Eliminated overlay */}
      {player.status === 'eliminated' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 8px)',
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        />
      )}

      {/* Seed badge */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          left: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          color: color,
          opacity: 0.6,
          letterSpacing: '0.05em',
        }}
      >
        #{player.seed}
      </div>

      {/* Top right corner arrow (from Kage) */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          width: '16px',
          height: '16px',
          opacity: isHovered ? 0.9 : 0,
          transform: isHovered ? 'none' : 'translate3d(-3px, 3px, 0)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 14 14" fill="none" style={{ width: '100%', height: '100%' }}>
          <path d="M3 11L11 3M11 3H5M11 3V9" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>


      {/* Chess piece */}
      <div
        style={{
          fontSize: '2.2rem',
          lineHeight: 1,
          color,
          filter: isHovered ? `drop-shadow(0 0 12px ${color}80)` : 'none',
          transition: 'filter 0.3s ease, transform 0.3s ease',
          transform: isHovered ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
        }}
      >
        {piece}
      </div>

      {/* Name */}
      <p
        style={{
          fontFamily: 'var(--font-cinematic)',
          fontSize: '1rem',
          fontWeight: 400,
          letterSpacing: '0.06em',
          color: player.status === 'eliminated' ? 'rgba(200,192,174,0.3)' : 'var(--cg-ivory)',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {player.name}
      </p>

      {/* Course */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.58rem',
          letterSpacing: '0.1em',
          color: 'rgba(200,192,174,0.4)',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        {player.course}
      </p>

      {/* Status + round */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'rgba(200,192,174,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          {player.currentRound || 'Pre-Tournament'}
        </span>
      </div>

      {/* Win stat */}
      {player.matchesPlayed > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '0.1rem',
            paddingTop: '0.6rem',
            borderTop: '1px solid rgba(201,168,76,0.06)',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'W', value: player.wins, color: 'var(--cg-emerald-bright)' },
            { label: 'L', value: player.losses, color: '#c0392b' },
            { label: 'D', value: player.draws, color: 'var(--cg-ivory-dim)' },
          ].map(({ label: l, value, color: c }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-stat)', fontSize: '0.9rem', color: c, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(200,192,174,0.3)', marginTop: '1px' }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Hover — click hint */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '0.4rem',
            right: '0.5rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.45rem',
            letterSpacing: '0.15em',
            color: color,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          View ›
        </div>
      )}
    </div>
  );
};

/* ── Filter buttons ── */
const FILTERS = ['ALL', 'ACTIVE', 'ELIMINATED', 'REGISTERED'] as const;
type FilterType = typeof FILTERS[number];

/* ── Main Player Gallery Scene ── */
export const PlayerGalleryScene: React.FC = () => {
  const { players } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isRevealed, setIsRevealed] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waypoint === 'players' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.querySelectorAll('[data-animate]'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
        );
      }
    }
    if (waypoint === 'pairing' && waypointProgress > 0.5) {
      setIsRevealed(false);
    }
    if (waypoint === 'hero' || waypoint === 'tournament') {
      setIsRevealed(false);
    }
  }, [waypoint, waypointProgress, isRevealed]);

  const filteredPlayers = players.filter(p => {
    if (filter === 'ALL') return true;
    return p.status.toUpperCase() === filter;
  });

  const activeCount = players.filter(p => p.status === 'active' || p.status === 'champion').length;
  const eliminatedCount = players.filter(p => p.status === 'eliminated').length;

  return (
    <>
      <div
        id="cg-player-gallery"
        style={{
          minHeight: '100vh',
          padding: 'clamp(4rem, 8vh, 7rem) clamp(1.5rem, 5vw, 5rem) 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background atmosphere */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 20% 30%, rgba(201,168,76,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(26,122,94,0.04) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient chessboard grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
          }}
        />

        {/* Section header */}
        <div
          ref={headerRef}
          style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative' }}
        >
          {/* Vertical decorative line */}
          <div
            data-animate
            style={{
              width: '1px',
              height: '60px',
              background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))',
              margin: '0 auto 1.5rem',
              opacity: 0,
            }}
          />

          <p data-animate className="cg-label-gold" style={{ marginBottom: '0.75rem', opacity: 0 }}>
            ♟ &nbsp; THE COMPETITORS &nbsp; ♟
          </p>

          <h2
            data-animate
            className="cg-section-title"
            style={{ margin: '0 0 0.5rem', opacity: 0 }}
          >
            THE PLAYERS
          </h2>

          <div data-animate className="cg-gold-line-full" style={{ maxWidth: '200px', margin: '1rem auto', opacity: 0 }} />

          {/* Live stats */}
          <div
            data-animate
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2.5rem',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
              opacity: 0,
            }}
          >
            {[
              { num: players.length, label: 'REGISTERED' },
              { num: activeCount, label: 'ACTIVE' },
              { num: eliminatedCount, label: 'ELIMINATED' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-stat)',
                    fontSize: '2rem',
                    color: 'var(--cg-gold)',
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <p className="cg-label" style={{ margin: '0.2rem 0 0', opacity: 0.5 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.5s 0.4s ease',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'rgba(201,168,76,0.12)' : 'rgba(10,10,11,0.6)',
                border: `1px solid ${filter === f ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                color: filter === f ? 'var(--cg-gold)' : 'var(--cg-ivory-dim)',
                padding: '0.4rem 1.1rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.58rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s ease',
                borderRadius: '1px',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Player grid */}
        {filteredPlayers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }}>♟</div>
            <p className="cg-body" style={{ opacity: 0.4 }}>No players in this category yet.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1rem',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {filteredPlayers.map((player, i) => (
              <PlayerCard
                key={player.id}
                player={player}
                index={i}
                isRevealed={isRevealed}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>
        )}

        {/* Bottom gold line */}
        <div
          style={{
            marginTop: '4rem',
            opacity: isRevealed ? 0.3 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <div className="cg-gold-line-full" />
        </div>
      </div>

      {/* Player profile modal */}
      <PlayerProfileCinematic
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </>
  );
};

export default PlayerGalleryScene;
