import React, { useState } from 'react';
import { useChessGame, TIME_CONTROL_PRESETS, type GameMode, type PlayerSideChoice, type SavedGameRecord } from '../../hooks/useChessGame';
import { ChessBoard } from './ChessBoard';
import { ChessPieceSvg } from './ChessPieceSvg';
import { AnalysisView } from './AnalysisView';
import { DIFFICULTY_PRESETS, type EngineDifficulty } from '../../services/chessEngine';
import { 
  Bot, 
  Users, 
  Search, 
  History, 
  RotateCcw, 
  Flag, 
  Handshake, 
  RotateCw, 
  Settings2, 
  Trophy, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface PlayChessPageProps {
  onNavigateHome?: () => void;
  onNavigateCommand?: () => void;
  initialMode?: GameMode;
}

export const PlayChessPage: React.FC<PlayChessPageProps> = ({
  onNavigateHome,
  onNavigateCommand,
  initialMode = 'vs_computer',
}) => {
  const [activeTab, setActiveTab] = useState<GameMode | 'history'>(initialMode);
  const [difficulty, setDifficulty] = useState<EngineDifficulty>('medium');
  const [playerSide, setPlayerSide] = useState<PlayerSideChoice>('white');
  const [selectedTimeControl, setSelectedTimeControl] = useState(TIME_CONTROL_PRESETS[7]); // 10+5 Rapid
  const [analyzingGamePgn, setAnalyzingGamePgn] = useState<string | null>(null);

  // Saved games list from localStorage
  const [savedGames] = useState<SavedGameRecord[]>(() => {
    try {
      const stored = localStorage.getItem('chessgrid_saved_games');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const {
    chess,
    fen,
    turn,
    humanColor,
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
    restartGame,
    toggleFlip,
    pgn,
  } = useChessGame({
    mode: activeTab === 'history' ? 'vs_computer' : activeTab,
    difficulty,
    playerSide,
    timeControl: selectedTimeControl,
    whitePlayerName: activeTab === 'vs_computer' && playerSide === 'black' ? 'Stockfish Engine' : 'You (White)',
    blackPlayerName: activeTab === 'vs_computer' && playerSide === 'white' ? 'Stockfish Engine' : 'Player 2',
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const legalMoves = selectedSquare ? getLegalMoves(selectedSquare as any) : [];

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
        // In vs_computer mode, only allow human to select their own pieces
        if (activeTab === 'vs_computer' && piece.color !== humanColor) {
          return;
        }
        setSelectedSquare(sq);
      }
    }
  };

  const handleAnalyzeFinishedGame = () => {
    setAnalyzingGamePgn(pgn);
    setActiveTab('analysis');
  };

  const handleStartAnalysisFromHistory = (savedPgn: string) => {
    setAnalyzingGamePgn(savedPgn);
    setActiveTab('analysis');
  };

  // If in Analysis mode, render the Analysis View
  if (activeTab === 'analysis') {
    return (
      <div className="min-h-screen bg-[#0a0a0d] text-slate-100 flex flex-col font-sans">
        <AnalysisView
          initialPgn={analyzingGamePgn || ''}
          onBack={() => {
            setAnalyzingGamePgn(null);
            setActiveTab('vs_computer');
          }}
        />
      </div>
    );
  }

  const topColor = isFlipped ? 'w' : 'b';
  const bottomColor = isFlipped ? 'b' : 'w';

  const topTimeMs = isFlipped ? whiteTimeMs : blackTimeMs;
  const bottomTimeMs = isFlipped ? blackTimeMs : whiteTimeMs;

  const topName = activeTab === 'vs_computer'
    ? (topColor === humanColor ? 'You' : `Stockfish (${DIFFICULTY_PRESETS[difficulty].name})`)
    : (topColor === 'w' ? 'White Contender' : 'Black Contender');

  const bottomName = activeTab === 'vs_computer'
    ? (bottomColor === humanColor ? 'You' : `Stockfish (${DIFFICULTY_PRESETS[difficulty].name})`)
    : (bottomColor === 'w' ? 'White Contender' : 'Black Contender');

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 15%, rgba(201,168,76,0.06) 0%, transparent 60%), #0a0a0d',
      }}
    >
      {/* ── Top Header Navigation Bar ── */}
      <header className="w-full px-4 sm:px-8 py-4 border-b border-amber-500/15 backdrop-blur-xl bg-black/60 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ARENA</span>
            </button>
          )}
          {onNavigateCommand && (
            <button
              onClick={onNavigateCommand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>COMMAND</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-400">♞</span>
            <span
              className="text-lg sm:text-xl font-bold tracking-wider text-white"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              CHESSGRID PLAY
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('vs_computer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'vs_computer'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">VS COMPUTER</span>
          </button>

          <button
            onClick={() => setActiveTab('two_player_local')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'two_player_local'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2-PLAYER</span>
          </button>

          <button
            onClick={() => {
              setAnalyzingGamePgn(null);
              setActiveTab('analysis');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ANALYSIS</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HISTORY</span>
          </button>
        </nav>
      </header>

      {/* ── Main Body Area ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ══════════════════════════════════════════════════════════
            TAB: GAME HISTORY ARCHIVE
            ══════════════════════════════════════════════════════════ */}
        {activeTab === 'history' ? (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-amber-300 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-cinematic)' }}
                >
                  Completed Games History
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Review and analyze your previously played matches
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300">
                {savedGames.length} Games Logged
              </span>
            </div>

            {savedGames.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-panel border border-amber-500/20 space-y-3">
                <Trophy className="w-10 h-10 text-amber-400/40 mx-auto" />
                <p className="text-sm font-mono text-slate-300">No games saved yet.</p>
                <p className="text-xs text-slate-500">Play a match vs Computer or Local 2-Player to log games!</p>
                <button
                  onClick={() => setActiveTab('vs_computer')}
                  className="mt-2 px-5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  PLAY A GAME NOW →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedGames.map(game => (
                  <div
                    key={game.id}
                    className="p-5 rounded-2xl glass-panel border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                        <span>{new Date(game.date).toLocaleDateString()} • {game.timeControl}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          game.winner === 'white' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : game.winner === 'black'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}>
                          {game.winner === 'draw' ? 'DRAW' : `${game.winner?.toUpperCase()} WON`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
                        <span>{game.whiteName}</span>
                        <span className="text-xs text-slate-400 font-mono">VS</span>
                        <span>{game.blackName}</span>
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-1">{game.resultReason}</p>
                    </div>

                    <button
                      onClick={() => handleStartAnalysisFromHistory(game.pgn)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold font-mono tracking-wider bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 transition-all cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>ANALYZE THIS GAME</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              ACTIVE GAME BOARD VIEW (VS COMPUTER / 2-PLAYER)
              ══════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left/Center Area: Players + Board (8 cols) */}
            <div className="lg:col-span-8 flex flex-col items-center gap-3">
              
              {/* ── Top Player Card (Black / Flipped White) ── */}
              <div className="w-full max-w-[560px] p-3 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-black/60 border border-amber-500/30 text-lg">
                    {topColor === 'w' ? '♔' : '♚'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{topName}</span>
                      {turn === topColor && !isGameOver && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    {/* Captured pieces */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {(topColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).map((p, idx) => (
                        <div key={idx} className="w-4 h-4 opacity-70">
                          <ChessPieceSvg type={p} color={topColor === 'w' ? 'b' : 'w'} />
                        </div>
                      ))}
                      {(topColor === 'w' ? capturedPieces.whiteAdvantage : capturedPieces.blackAdvantage) > 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-300 ml-1">
                          +{topColor === 'w' ? capturedPieces.whiteAdvantage : capturedPieces.blackAdvantage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Clock */}
                {selectedTimeControl.initialSeconds > 0 && (
                  <div
                    className={`px-3.5 py-1.5 rounded-lg text-lg sm:text-xl font-mono font-bold tracking-wider ${
                      turn === topColor && isClockRunning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                        : 'bg-black/40 text-slate-400 border border-white/5'
                    }`}
                  >
                    {formatTime(topTimeMs)}
                  </div>
                )}
              </div>

              {/* ── Main Interactive Chess Board ── */}
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

              {/* ── Bottom Player Card (White / Flipped Black) ── */}
              <div className="w-full max-w-[560px] p-3 rounded-xl glass-panel border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 border border-amber-500/30 text-lg">
                    {bottomColor === 'w' ? '♔' : '♚'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{bottomName}</span>
                      {turn === bottomColor && !isGameOver && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    {/* Captured pieces */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {(bottomColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).map((p, idx) => (
                        <div key={idx} className="w-4 h-4 opacity-70">
                          <ChessPieceSvg type={p} color={bottomColor === 'w' ? 'b' : 'w'} />
                        </div>
                      ))}
                      {(bottomColor === 'w' ? capturedPieces.whiteAdvantage : capturedPieces.blackAdvantage) > 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-300 ml-1">
                          +{bottomColor === 'w' ? capturedPieces.whiteAdvantage : capturedPieces.blackAdvantage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Clock */}
                {selectedTimeControl.initialSeconds > 0 && (
                  <div
                    className={`px-3.5 py-1.5 rounded-lg text-lg sm:text-xl font-mono font-bold tracking-wider ${
                      turn === bottomColor && isClockRunning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                        : 'bg-black/40 text-slate-400 border border-white/5'
                    }`}
                  >
                    {formatTime(bottomTimeMs)}
                  </div>
                )}
              </div>

              {/* ── Match Action Buttons ── */}
              <div className="w-full max-w-[560px] flex items-center justify-between gap-2 p-2 rounded-xl glass-panel border border-white/10">
                <button
                  onClick={undoMove}
                  disabled={moveHistory.length === 0 || isGameOver}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Takeback last move"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>UNDO</span>
                </button>

                <button
                  onClick={agreeDraw}
                  disabled={isGameOver || moveHistory.length < 2}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Offer / Agree Draw"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>DRAW</span>
                </button>

                <button
                  onClick={() => resign()}
                  disabled={isGameOver}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono font-semibold bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                  title="Resign Game"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>RESIGN</span>
                </button>

                <button
                  onClick={toggleFlip}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Flip Board"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Game Setup & Move Notation (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* ── Game Over Banner ── */}
              {isGameOver && gameResult && (
                <div className="p-5 rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-black/80 shadow-[0_0_30px_rgba(201,168,76,0.3)] space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="font-bold tracking-wider uppercase font-cinematic text-lg">Game Over</span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">{gameResult.reason}</p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleAnalyzeFinishedGame}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider bg-amber-500/30 text-amber-200 border border-amber-500/60 hover:bg-amber-500/40 shadow-md transition-all cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>ANALYZE GAME</span>
                    </button>
                    <button
                      onClick={() => restartGame()}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                    >
                      REMATCH
                    </button>
                  </div>
                </div>
              )}

              {/* ── Game Configuration Panel ── */}
              <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                    <Settings2 className="w-4 h-4 text-amber-400" />
                    <span>GAME CONFIGURATION</span>
                  </div>
                </div>

                {/* Difficulty selector (vs Computer only) */}
                {activeTab === 'vs_computer' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 block">Stockfish Engine Strength</label>
                    <div className="grid grid-cols-5 gap-1">
                      {(['beginner', 'easy', 'medium', 'hard', 'expert'] as EngineDifficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => {
                            setDifficulty(diff);
                            restartGame();
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            difficulty === diff
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                              : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          {diff.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      {DIFFICULTY_PRESETS[difficulty].description}
                    </p>
                  </div>
                )}

                {/* Time Control Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 block">Time Control</label>
                  <select
                    value={selectedTimeControl.name}
                    onChange={(e) => {
                      const found = TIME_CONTROL_PRESETS.find(tc => tc.name === e.target.value);
                      if (found) {
                        setSelectedTimeControl(found);
                        restartGame();
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {TIME_CONTROL_PRESETS.map((tc) => (
                      <option key={tc.name} value={tc.name} className="bg-neutral-900 text-slate-200">
                        {tc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Side Choice (vs Computer only) */}
                {activeTab === 'vs_computer' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 block">Play As</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['white', 'random', 'black'] as PlayerSideChoice[]).map((side) => (
                        <button
                          key={side}
                          onClick={() => {
                            setPlayerSide(side);
                            restartGame(side);
                          }}
                          className={`py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                            playerSide === side
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                              : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                          }`}
                        >
                          {side === 'white' ? '♔ White' : side === 'black' ? '♚ Black' : '⇌ Random'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => restartGame()}
                  className="w-full py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
                >
                  NEW GAME
                </button>
              </div>

              {/* ── Move Notation Sheet ── */}
              <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 h-[220px] flex flex-col">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                  Move History ({moveHistory.length} plies)
                </span>

                <div className="overflow-y-auto flex-1 space-y-1 pr-1 font-mono text-xs">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, rIdx) => {
                    const whiteMove = moveHistory[rIdx * 2];
                    const blackMove = moveHistory[rIdx * 2 + 1];

                    return (
                      <div
                        key={rIdx}
                        className="grid grid-cols-12 gap-1 items-center p-1 rounded hover:bg-white/5"
                      >
                        <span className="col-span-2 text-slate-500 text-[11px]">{rIdx + 1}.</span>
                        <span className="col-span-5 text-slate-200 font-semibold">{whiteMove?.san}</span>
                        <span className="col-span-5 text-slate-400">{blackMove?.san || ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engine License Notice */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-slate-500 text-center">
                Powered by Stockfish 16 WASM • Licensed under GNU GPLv3
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlayChessPage;
