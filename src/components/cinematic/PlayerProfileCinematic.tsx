import React, { useState, useEffect, useRef } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';

interface PlayerProfileCinematicProps {
  player: Player | null;
  onClose: () => void;
}

const PIECE_BY_STATUS: Record<string, string> = {
  champion: '♛',
  active: '♟',
  eliminated: '♙',
  registered: '♞',
  withdrawn: '♜',
};

const STATUS_COLORS: Record<string, string> = {
  champion: 'var(--cg-gold)',
  active: 'var(--cg-emerald-bright)',
  eliminated: '#666',
  registered: 'var(--cg-ivory-dim)',
  withdrawn: '#555',
};

export const PlayerProfileCinematic: React.FC<PlayerProfileCinematicProps> = ({ player, onClose }) => {
  const { players } = useTournament();
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (player) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [player]);

  if (!player) return null;

  const eliminatedBy = player.eliminatedByPlayerId
    ? players.find(p => p.id === player.eliminatedByPlayerId)
    : null;

  const winRate = player.matchesPlayed > 0
    ? Math.round((player.wins / player.matchesPlayed) * 100)
    : 0;

  const piece = PIECE_BY_STATUS[player.status] ?? '♟';
  const statusColor = STATUS_COLORS[player.status] ?? 'var(--cg-ivory-dim)';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(10, 10, 11, 0.96)',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px -10px rgba(201,168,76,0.3)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
          overflow: 'hidden',
        }}
      >
        {/* Corner decorations */}
        {[
          { top: 0, left: 0, borderTop: '2px solid', borderLeft: '2px solid' },
          { top: 0, right: 0, borderTop: '2px solid', borderRight: '2px solid' },
          { bottom: 0, left: 0, borderBottom: '2px solid', borderLeft: '2px solid' },
          { bottom: 0, right: 0, borderBottom: '2px solid', borderRight: '2px solid' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              borderColor: 'var(--cg-gold)',
              opacity: 0.5,
              ...s,
            }}
          />
        ))}

        {/* Header */}
        <div
          style={{
            padding: '2rem 2rem 1.5rem',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.5rem',
          }}
        >
          {/* Piece avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              flexShrink: 0,
              border: `1px solid ${statusColor}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              background: `${statusColor}08`,
              position: 'relative',
            }}
          >
            {piece}
            {/* Seed badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                background: 'var(--cg-obsidian)',
                border: '1px solid rgba(201,168,76,0.2)',
                padding: '1px 5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'var(--cg-gold)',
                letterSpacing: '0.1em',
              }}
            >
              #{player.seed}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Status label */}
            <p
              className="cg-label"
              style={{ color: statusColor, margin: '0 0 0.3rem', letterSpacing: '0.25em' }}
            >
              {player.status.toUpperCase()}
            </p>
            {/* Name */}
            <h2
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: 'var(--cg-ivory)',
                margin: '0 0 0.3rem',
                lineHeight: 1.1,
              }}
            >
              {player.name}
            </h2>
            {/* Course info */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                color: 'var(--cg-ivory-dim)',
                margin: 0,
                opacity: 0.7,
              }}
            >
              {player.course} · {player.year}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'rgba(200,192,174,0.4)',
                margin: '0.2rem 0 0',
                letterSpacing: '0.08em',
              }}
            >
              {player.rollNumber}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'var(--cg-ivory-dim)',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              flexShrink: 0,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cg-gold)'; e.currentTarget.style.color = 'var(--cg-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = 'var(--cg-ivory-dim)'; }}
          >
            ✕
          </button>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(201,168,76,0.08)',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}
        >
          {[
            { label: 'MATCHES', value: player.matchesPlayed },
            { label: 'WINS', value: player.wins },
            { label: 'LOSSES', value: player.losses },
            { label: 'WIN RATE', value: `${winRate}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: 'rgba(10,10,11,0.9)',
                padding: '1.25rem 0.75rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-stat)',
                  fontSize: '1.6rem',
                  color: 'var(--cg-ivory)',
                  lineHeight: 1,
                  marginBottom: '0.35rem',
                }}
              >
                {value}
              </div>
              <p className="cg-label" style={{ margin: 0, opacity: 0.5, fontSize: '0.5rem' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Details section */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem 1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              { label: 'CURRENT ROUND', value: player.currentRound },
              { label: 'SECTION', value: `Section ${player.section}` },
              { label: 'SEMESTER', value: player.semester },
              { label: 'SEED', value: `#${player.seed}` },
              ...(eliminatedBy ? [{ label: 'ELIMINATED BY', value: eliminatedBy.name }] : []),
              ...(player.email ? [{ label: 'CONTACT', value: player.email }] : []),
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="cg-label" style={{ margin: '0 0 0.2rem', opacity: 0.5, fontSize: '0.5rem' }}>{label}</p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.82rem',
                    color: 'var(--cg-ivory)',
                    margin: 0,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <p className="cg-label" style={{ margin: 0, opacity: 0.5, fontSize: '0.5rem' }}>TOURNAMENT SCORE</p>
              <p className="cg-label-gold" style={{ margin: 0, fontSize: '0.55rem' }}>{player.score} PTS</p>
            </div>
            <div style={{ height: '2px', background: 'rgba(201,168,76,0.1)', borderRadius: '2px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (player.score / Math.max(1, player.matchesPlayed)) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--cg-gold-dim), var(--cg-gold))',
                  boxShadow: '0 0 8px rgba(201,168,76,0.5)',
                  borderRadius: '2px',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Subtle chess piece watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '1.5rem',
            fontSize: '8rem',
            opacity: 0.025,
            pointerEvents: 'none',
            lineHeight: 1,
            color: 'var(--cg-gold)',
            fontFamily: 'serif',
          }}
        >
          {piece}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileCinematic;
