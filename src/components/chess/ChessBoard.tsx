import React, { useState, useCallback, useRef } from 'react';
import type { Square, PieceSymbol, Color, Piece } from 'chess.js';
import { ChessPieceSvg } from './ChessPieceSvg';

export interface ChessBoardProps {
  fen: string;
  isFlipped?: boolean;
  turn?: Color;
  inCheck?: boolean;
  lastMove?: { from: Square; to: Square } | null;
  selectedSquare?: Square | null;
  legalMoves?: Square[];
  pendingPromotion?: { from: Square; to: Square } | null;
  interactive?: boolean;
  onSquareClick?: (square: Square) => void;
  onMove?: (from: Square, to: Square) => void;
  onResolvePromotion?: (piece: PieceSymbol) => void;
  customSquareStyles?: Record<string, React.CSSProperties>;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  isFlipped = false,
  turn = 'w',
  inCheck = false,
  lastMove = null,
  selectedSquare: controlledSelectedSquare,
  legalMoves: controlledLegalMoves,
  pendingPromotion = null,
  interactive = true,
  onSquareClick,
  onMove,
  onResolvePromotion,
  customSquareStyles = {},
}) => {
  const [localSelectedSquare, setLocalSelectedSquare] = useState<Square | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const selectedSquare = controlledSelectedSquare !== undefined ? controlledSelectedSquare : localSelectedSquare;

  // Parse FEN into 8x8 piece grid
  const boardGrid = React.useMemo(() => {
    const grid: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const [placement] = fen.split(' ');
    const rows = placement.split('/');

    rows.forEach((rowStr, r) => {
      let c = 0;
      for (const char of rowStr) {
        if (/\d/.test(char)) {
          c += parseInt(char, 10);
        } else {
          const color: Color = char === char.toUpperCase() ? 'w' : 'b';
          const type = char.toLowerCase() as PieceSymbol;
          grid[r][c] = { type, color };
          c++;
        }
      }
    });

    return grid;
  }, [fen]);

  // Find King square if in check
  const kingInCheckSquare = React.useMemo<Square | null>(() => {
    if (!inCheck) return null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = boardGrid[r][c];
        if (p && p.type === 'k' && p.color === turn) {
          const file = FILES[c];
          const rank = RANKS[r];
          return `${file}${rank}` as Square;
        }
      }
    }
    return null;
  }, [inCheck, boardGrid, turn]);

  // Get piece at square
  const getPieceAtSquare = useCallback((sq: Square): Piece | null => {
    const fileIdx = FILES.indexOf(sq[0]);
    const rankIdx = RANKS.indexOf(sq[1]);
    if (fileIdx === -1 || rankIdx === -1) return null;
    return boardGrid[rankIdx][fileIdx];
  }, [boardGrid]);

  // Handle Square Click
  const handleSquareClick = (sq: Square) => {
    if (!interactive) return;

    if (onSquareClick) {
      onSquareClick(sq);
      return;
    }

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setLocalSelectedSquare(null);
      } else {
        if (onMove) {
          onMove(selectedSquare, sq);
        }
        setLocalSelectedSquare(null);
      }
    } else {
      const piece = getPieceAtSquare(sq);
      if (piece) {
        setLocalSelectedSquare(sq);
      }
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, sq: Square) => {
    if (!interactive) {
      e.preventDefault();
      return;
    }
    const piece = getPieceAtSquare(sq);
    if (!piece) {
      e.preventDefault();
      return;
    }

    setDraggedSquare(sq);
    setLocalSelectedSquare(sq);
    e.dataTransfer.setData('text/plain', sq);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSq: Square) => {
    e.preventDefault();
    if (!interactive) return;

    const fromSq = (e.dataTransfer.getData('text/plain') || draggedSquare) as Square;
    if (fromSq && fromSq !== targetSq && onMove) {
      onMove(fromSq, targetSq);
    }
    setDraggedSquare(null);
    setLocalSelectedSquare(null);
  };

  const ranks = isFlipped ? [...RANKS].reverse() : RANKS;
  const files = isFlipped ? [...FILES].reverse() : FILES;

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto select-none">
      {/* Outer Luxury Chassis */}
      <div
        ref={boardContainerRef}
        id="cg-chessboard-chassis"
        className="w-full h-full rounded-xl overflow-hidden p-2 sm:p-3 relative flex flex-col justify-between"
        style={{
          background: 'linear-gradient(145deg, #18181d 0%, #0c0c0f 100%)',
          border: '1px solid rgba(201, 168, 76, 0.35)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(201,168,76,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* 8x8 Grid Container */}
        <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden relative shadow-inner">
          {ranks.map((rank, rIdx) =>
            files.map((file, fIdx) => {
              const sq = `${file}${rank}` as Square;
              const isLight = (FILES.indexOf(file) + RANKS.indexOf(rank)) % 2 === 0;
              const piece = getPieceAtSquare(sq);

              const isSelected = selectedSquare === sq;
              const isLastMove = lastMove?.from === sq || lastMove?.to === sq;
              const isLegal = controlledLegalMoves?.includes(sq);
              const isKingCheck = kingInCheckSquare === sq;

              return (
                <div
                  key={sq}
                  data-square={sq}
                  onClick={() => handleSquareClick(sq)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, sq)}
                  className="relative flex items-center justify-center cursor-pointer transition-colors duration-150 group"
                  style={{
                    backgroundColor: isLight ? '#2a2a34' : '#141419',
                    backgroundImage: isLight
                      ? 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 80%)'
                      : 'radial-gradient(circle at 50% 50%, rgba(10,10,14,0.4) 0%, transparent 80%)',
                    boxShadow: isLight ? 'inset 0 0 8px rgba(0,0,0,0.25)' : 'inset 0 0 12px rgba(0,0,0,0.45)',
                    ...customSquareStyles[sq],
                  }}
                >
                  {/* Last Move Overlay */}
                  {isLastMove && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'rgba(201, 168, 76, 0.22)',
                        boxShadow: 'inset 0 0 10px rgba(201, 168, 76, 0.3)',
                      }}
                    />
                  )}

                  {/* Selected Square Highlight */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'rgba(232, 196, 90, 0.28)',
                        border: '2px solid var(--cg-gold-bright)',
                        boxShadow: '0 0 15px rgba(232, 196, 90, 0.5), inset 0 0 10px rgba(232, 196, 90, 0.3)',
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* King in Check Crimson Pulse */}
                  {isKingCheck && (
                    <div
                      className="absolute inset-0 pointer-events-none animate-pulse"
                      style={{
                        background: 'radial-gradient(circle, rgba(239,68,68,0.7) 0%, rgba(185,28,28,0.2) 70%, transparent 100%)',
                        border: '2px solid #ef4444',
                        boxShadow: '0 0 20px #ef4444, inset 0 0 15px #b91c1c',
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Legal Move Dot / Capture Ring */}
                  {isLegal && (
                    <div
                      className="absolute pointer-events-none z-10 flex items-center justify-center"
                      style={{ inset: 0 }}
                    >
                      {piece ? (
                        /* Capture Target Ring */
                        <div
                          className="w-[85%] h-[85%] rounded-full transition-transform group-hover:scale-105"
                          style={{
                            border: '3px solid rgba(232, 196, 90, 0.85)',
                            boxShadow: '0 0 12px rgba(201, 168, 76, 0.75)',
                          }}
                        />
                      ) : (
                        /* Empty Square Move Dot */
                        <div
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform group-hover:scale-125"
                          style={{
                            background: 'rgba(232, 196, 90, 0.75)',
                            boxShadow: '0 0 8px rgba(201, 168, 76, 0.8)',
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Rank Coordinate Label (Top-Left on first column) */}
                  {fIdx === 0 && (
                    <span
                      className="absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-mono font-bold select-none pointer-events-none"
                      style={{
                        color: isLight ? 'rgba(200, 192, 174, 0.45)' : 'rgba(200, 192, 174, 0.3)',
                      }}
                    >
                      {rank}
                    </span>
                  )}

                  {/* File Coordinate Label (Bottom-Right on last row) */}
                  {rIdx === 7 && (
                    <span
                      className="absolute bottom-0.5 right-1 text-[9px] sm:text-[10px] font-mono font-bold select-none pointer-events-none"
                      style={{
                        color: isLight ? 'rgba(200, 192, 174, 0.45)' : 'rgba(200, 192, 174, 0.3)',
                      }}
                    >
                      {file}
                    </span>
                  )}

                  {/* Piece Representation */}
                  {piece && (
                    <div
                      draggable={interactive}
                      onDragStart={(e) => handleDragStart(e, sq)}
                      className="w-[88%] h-[88%] flex items-center justify-center relative z-2 transition-transform duration-100 active:scale-110 hover:scale-105"
                    >
                      <ChessPieceSvg
                        type={piece.type}
                        color={piece.color}
                        className={draggedSquare === sq ? 'opacity-40' : 'opacity-100'}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Pawn Promotion Dialog Modal ── */}
        {pendingPromotion && onResolvePromotion && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95">
            <div
              className="p-6 rounded-2xl border border-amber-500/40 text-center max-w-sm w-full shadow-[0_0_40px_rgba(201,168,76,0.35)]"
              style={{ background: 'linear-gradient(145deg, #18181d 0%, #0d0d10 100%)' }}
            >
              <h3
                className="text-base font-bold text-amber-300 tracking-widest uppercase mb-1"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                Promote Pawn
              </h3>
              <p className="text-xs font-mono text-slate-400 mb-5">Select promotion piece</p>

              <div className="grid grid-cols-4 gap-3">
                {(['q', 'r', 'b', 'n'] as PieceSymbol[]).map((pType) => (
                  <button
                    key={pType}
                    onClick={() => onResolvePromotion(pType)}
                    className="aspect-square p-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <div className="w-10 h-10">
                      <ChessPieceSvg type={pType} color={turn} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                      {pType === 'q' ? 'Queen' : pType === 'r' ? 'Rook' : pType === 'b' ? 'Bishop' : 'Knight'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
