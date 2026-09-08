import React from 'react';
import type { PieceSymbol, Color } from 'chess.js';

interface ChessPieceSvgProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
  size?: number | string;
}

/**
 * Luxury vector chess piece renderer for ChessGrid.
 * White pieces: Luminous Ivory (#f5f0e8) with metallic warm gold trim and depth.
 * Black pieces: Obsidian Dark (#141418) with metallic burnished brass rim.
 */
export const ChessPieceSvg: React.FC<ChessPieceSvgProps> = ({
  type,
  color,
  className = '',
  size = '100%',
}) => {
  const isWhite = color === 'w';

  // Gradient ID generators to prevent SVG ID collisions
  const fillGradId = `cg-piece-fill-${color}-${type}`;
  const strokeGradId = `cg-piece-stroke-${color}-${type}`;
  const shadowId = `cg-piece-shadow-${color}-${type}`;

  const renderPath = () => {
    switch (type) {
      case 'k': // King
        return (
          <g>
            {/* Cross */}
            <path d="M22.5 7.5v3M21 9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crown Base */}
            <path
              d="M12 36c4-1 17-1 21 0v-4c-3-1-18-1-21 0v4zM12 32c1-3 4-8 5-11 1.5 2.5 3.5 4 5.5 4s4-1.5 5.5-4c1 3 4 8 5 11-4-1-17-1-21 0z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Head Dome */}
            <path
              d="M16 18c0-3.3 2.7-6 6.5-6s6.5 2.7 6.5 6c0 1.5-.5 3-1.5 4-2-1-8-1-10 0-1-1-1.5-2.5-1.5-4z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Base Pedestal */}
            <path
              d="M11.5 37h22c1 0 1.5 1 1.5 2s-.5 2-1.5 2h-22c-1 0-1.5-1-1.5-2s.5-2 1.5-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'q': // Queen
        return (
          <g>
            {/* Pearls on crown tips */}
            <circle cx="9" cy="14" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
            <circle cx="22.5" cy="9" r="1.5" fill="currentColor" />
            <circle cx="29.5" cy="10.5" r="1.5" fill="currentColor" />
            <circle cx="36" cy="14" r="1.5" fill="currentColor" />
            {/* Crown Spikes */}
            <path
              d="M9 16l3 15h21l3-15-6.5 5.5-7-7-7 7L9 16z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Mid Waist */}
            <path
              d="M12 31c3-1 18-1 21 0v4c-3-1-18-1-21 0v-4z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Pedestal */}
            <path
              d="M11.5 36h22c1 0 1.5 1 1.5 2s-.5 2-1.5 2h-22c-1 0-1.5-1-1.5-2s.5-2 1.5-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'r': // Rook
        return (
          <g>
            {/* Battlements */}
            <path
              d="M12 12v5h4v-3h3v3h4v-3h3v3h4v-5H12z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Main Tower Body */}
            <path
              d="M14 17l1 14h15l1-14H14z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Tiered Base */}
            <path
              d="M12 31c4-1 17-1 21 0v4c-3-1-18-1-21 0v-4z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            <path
              d="M11 36h23c1 0 1.5 1 1.5 2s-.5 2-1.5 2h-23c-1 0-1.5-1-1.5-2s.5-2 1.5-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'b': // Bishop
        return (
          <g>
            {/* Cross finial */}
            <circle cx="22.5" cy="8.5" r="1.5" fill="currentColor" />
            {/* Mitre (Head) with cut slit */}
            <path
              d="M15 22c-1-5 2-10 7.5-10s8.5 5 7.5 10c-2 3-5 5-7.5 5s-5.5-2-7.5-5z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Cut Slit */}
            <path d="M19 14l7 7M26 14l-7 7" stroke={isWhite ? '#a88d3b' : '#c9a84c'} strokeWidth="1.2" strokeLinecap="round" />
            {/* Stem */}
            <path
              d="M15 27c2-1 13-1 15 0v4c-2-1-13-1-15 0v-4z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Base */}
            <path
              d="M12 32c4-1 17-1 21 0v4c-3-1-18-1-21 0v-4zM11.5 37h22c1 0 1.5 1 1.5 2s-.5 2-1.5 2h-22c-1 0-1.5-1-1.5-2s.5-2 1.5-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'n': // Knight
        return (
          <g>
            {/* Obsidian/Ivory Mane & Snout */}
            <path
              d="M22 10c-3 0-6 2-7 5-1 3-3 6-5 7 0 2 2 3 4 3 0 2 2 3 4 3-1 2-2 4-2 6 2-1 4-2 7-2 1 2 2 4 4 4 1-2 2-4 2-6 2 1 4 2 6 2-1-2-1-4-1-6 2 0 3-1 3-3-1 0-2-1-2-2 3-1 4-4 3-7-1-2-3-4-6-4-3 0-5 0-6 0z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Eye */}
            <circle cx="17.5" cy="15.5" r="1.2" fill={isWhite ? '#222' : '#e8c45a'} />
            {/* Nostril */}
            <circle cx="12.5" cy="20.5" r="0.8" fill={isWhite ? '#a88d3b' : '#c9a84c'} />
            {/* Base */}
            <path
              d="M12 32c4-1 17-1 21 0v4c-3-1-18-1-21 0v-4zM11.5 37h22c1 0 1.5 1 1.5 2s-.5 2-1.5 2h-22c-1 0-1.5-1-1.5-2s.5-2 1.5-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'p': // Pawn
      default:
        return (
          <g>
            {/* Head Sphere */}
            <circle cx="22.5" cy="14" r="5" fill={`url(#${fillGradId})`} stroke={`url(#${strokeGradId})`} strokeWidth="1.5" />
            {/* Collar */}
            <path
              d="M17.5 19.5c1.5-.5 8.5-.5 10 0v2c-1.5-.5-8.5-.5-10 0v-2z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Bell Curve Stem */}
            <path
              d="M19 22c-.5 4-2.5 7-4 9 3-.5 12-.5 15 0-1.5-2-3.5-5-4-9H19z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
            {/* Base Pedestal */}
            <path
              d="M13 32c3-.8 16-.8 19 0v3.5c-3-.8-16-.8-19 0V32zM12 36.5h21c1 0 1.5 1 1.5 1.8s-.5 1.8-1.5 1.8h-21c-1 0-1.5-1-1.5-1.8s.5-1.8 1.5-1.8z"
              fill={`url(#${fillGradId})`}
              stroke={`url(#${strokeGradId})`}
              strokeWidth="1.5"
            />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 45 45"
      width={size}
      height={size}
      className={`select-none pointer-events-none transition-transform duration-150 ${className}`}
      style={{
        color: isWhite ? 'var(--cg-gold-bright)' : '#c9a84c',
        filter: isWhite
          ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.6)) drop-shadow(0 0 10px rgba(232,196,90,0.25))'
          : 'drop-shadow(0 3px 6px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(201,168,76,0.3))',
      }}
    >
      <defs>
        {/* White Piece Gradient: Luminous Pearl Ivory */}
        <linearGradient id={fillGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f7f2ea" />
              <stop offset="85%" stopColor="#e8dec8" />
              <stop offset="100%" stopColor="#d4c5a5" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#2c2c34" />
              <stop offset="40%" stopColor="#1a1a20" />
              <stop offset="85%" stopColor="#101014" />
              <stop offset="100%" stopColor="#08080a" />
            </>
          )}
        </linearGradient>

        {/* Piece Rim / Contour Stroke Gradient */}
        <linearGradient id={strokeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#e8c45a" />
              <stop offset="50%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#8c7028" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#e8c45a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#a38234" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4a3a14" stopOpacity="0.7" />
            </>
          )}
        </linearGradient>

        {/* Subtle Ambient Glow */}
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#e8c45a'} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {renderPath()}
    </svg>
  );
};

export default ChessPieceSvg;
