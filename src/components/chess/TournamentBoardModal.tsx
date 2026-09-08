import React, { useState } from 'react';
import type { Match, ResultType } from '../../types/tournament';
import { useTournament } from '../../context/TournamentContext';
import { useChessGame } from '../../hooks/useChessGame';
import { ChessBoard } from './ChessBoard';
import { ChessPieceSvg } from './ChessPieceSvg';
import { formatTime } from '../../utils/formatters';
import { 
  X, 
  Trophy, 
  Swords, 
  CheckCircle2 
} from 'lucide-react';

interface TournamentBoardModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyResult?: (matchId: string, resultType: ResultType) => void;
}

export const TournamentBoardModal: React.FC<TournamentBoardModalProps> = ({
  match,
  isOpen,
  onClose,
  onApplyResult,
}) => {
  const { players, recordResult, settings } = useTournament();

  const whitePlayer = players.find(p => p.id === match?.whitePlayerId);
  const blackPlayer = players.find(p => p.id === match?.blackPlayerId);

  // Map tournament time control
  const initialSeconds = (settings.defaultTimeControl.initialMinutes || 10) * 60;
  const incrementSeconds = settings.defaultTimeControl.incrementSeconds || 5;

  const timeControl = {
    name: settings.defaultTimeControl.label || '10+5',
    initialSeconds,
    incrementSeconds,
  };

  const {
    chess,
    fen,
    turn,
    moveHistory,
    lastMove,
    inCheck,
    isGameOver,
    gameResult,
    whiteTimeMs,
    blackTimeMs,
    isClockRunning,
    capturedPieces,
    isFlipped,
    pendingPromotion,
    handleSquareClickMove,
    resolvePromotion,
    getLegalMoves,
    undoMove,
    resign,
    agreeDraw,
    toggleFlip,
  } = useChessGame({
    mode: 'tournament_match',
    timeControl,
    whitePlayerName: whitePlayer?.name || 'White Contender',
    blackPlayerName: blackPlayer?.name || 'Black Contender',
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const legalMoves = selectedSquare ? getLegalMoves(selectedSquare as any) : [];

  if (!isOpen || !match) return null;

  const handleSquareClick = (sq: string) => {
    if (isGameOver) return;

    if (selectedSquare) {
      if (selectedSquare === sq) {
        setSelectedSquare(null);
      } else {
        handleSquareClickMove(selectedSquare as any, sq as any);
        setSelectedSquare(null);
      }
    } else {
      const piece = chess.get(sq as any);
      if (piece && piece.color === turn) {
        setSelectedSquare(sq);
      }
    }
  };

  const handleConfirmResult = () => {
    if (!gameResult) return;

    let resultType: ResultType = 'draw';

    if (gameResult.winner === 'white') {
      resultType = 'white_win';
    } else if (gameResult.winner === 'black') {
      resultType = 'black_win';
    }

    if (onApplyResult) {
      onApplyResult(match.id, resultType);
    } else {
      recordResult(match.id, resultType, `Live Interactive Board: ${gameResult.reason}`);
    }

    onClose();
  };

  const topColor = isFlipped ? 'w' : 'b';
  const bottomColor = isFlipped ? 'b' : 'w';

  const topPlayer = isFlipped ? whitePlayer : blackPlayer;
  const bottomPlayer = isFlipped ? blackPlayer : whitePlayer;

  const topTimeMs = isFlipped ? whiteTimeMs : blackTimeMs;
  const bottomTimeMs = isFlipped ? blackTimeMs : whiteTimeMs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-amber-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]"
        style={{ background: 'linear-gradient(145deg, #18181e 0%, #0d0d10 100%)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-amber-300 tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                Match #{match.matchNumber} Live Board
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {whitePlayer?.name || 'White'} vs {blackPlayer?.name || 'Black'} • Board {match.boardNumber || 1}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: Players & Chessboard (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center gap-2">
            
            {/* Top Player Card */}
            <div className="w-full max-w-[460px] p-2.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{topColor === 'w' ? '♔' : '♚'}</span>
                <div>
                  <span className="text-xs font-bold text-slate-100">{topPlayer?.name || 'Contender'}</span>
                  <div className="flex items-center gap-0.5">
                    {(topColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).map((p, i) => (
                      <div key={i} className="w-3.5 h-3.5 opacity-70">
                        <ChessPieceSvg type={p} color={topColor === 'w' ? 'b' : 'w'} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded text-sm font-mono font-bold ${
                  turn === topColor && isClockRunning
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                {formatTime(topTimeMs)}
              </div>
            </div>

            {/* Board */}
            <div className="w-full max-w-[460px]">
              <ChessBoard
                fen={fen}
                isFlipped={isFlipped}
                turn={turn}
                inCheck={inCheck}
                lastMove={lastMove}
                selectedSquare={selectedSquare as any}
                legalMoves={legalMoves as any}
                pendingPromotion={pendingPromotion}
                onSquareClick={handleSquareClick}
                onResolvePromotion={resolvePromotion}
              />
            </div>

            {/* Bottom Player Card */}
            <div className="w-full max-w-[460px] p-2.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{bottomColor === 'w' ? '♔' : '♚'}</span>
                <div>
                  <span className="text-xs font-bold text-slate-100">{bottomPlayer?.name || 'Contender'}</span>
                  <div className="flex items-center gap-0.5">
                    {(bottomColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).map((p, i) => (
                      <div key={i} className="w-3.5 h-3.5 opacity-70">
                        <ChessPieceSvg type={p} color={bottomColor === 'w' ? 'b' : 'w'} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded text-sm font-mono font-bold ${
                  turn === bottomColor && isClockRunning
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                {formatTime(bottomTimeMs)}
              </div>
            </div>
          </div>

          {/* Right: Controls & Results Confirmation (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Game over result banner */}
            {isGameOver && gameResult ? (
              <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/50 space-y-3 animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-amber-300">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span className="font-bold uppercase tracking-wider text-base font-cinematic">Result Decided</span>
                </div>
                <p className="text-xs text-slate-200">{gameResult.reason}</p>

                <button
                  onClick={handleConfirmResult}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-emerald-500/40 to-emerald-600/40 hover:from-emerald-500/50 hover:to-emerald-600/50 text-emerald-200 border border-emerald-500/60 shadow-lg transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>APPLY RESULT TO TOURNAMENT</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase block">Arbiter Controls</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={undoMove}
                    disabled={moveHistory.length === 0}
                    className="py-2 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 transition-all cursor-pointer"
                  >
                    Takeback
                  </button>
                  <button
                    onClick={agreeDraw}
                    className="py-2 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                  >
                    Draw
                  </button>
                  <button
                    onClick={toggleFlip}
                    className="py-2 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                  >
                    Flip
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => resign('w')}
                    className="py-2 rounded-lg text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                  >
                    White Resigns
                  </button>
                  <button
                    onClick={() => resign('b')}
                    className="py-2 rounded-lg text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                  >
                    Black Resigns
                  </button>
                </div>
              </div>
            )}

            {/* Move Notation */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 h-[200px] flex flex-col">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Move Sheet ({moveHistory.length} plies)
              </span>
              <div className="overflow-y-auto flex-1 space-y-1 font-mono text-xs pr-1">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-1 items-center p-1 rounded hover:bg-white/5">
                    <span className="col-span-2 text-slate-500">{idx + 1}.</span>
                    <span className="col-span-5 text-slate-200">{moveHistory[idx * 2]?.san}</span>
                    <span className="col-span-5 text-slate-400">{moveHistory[idx * 2 + 1]?.san || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBoardModal;
