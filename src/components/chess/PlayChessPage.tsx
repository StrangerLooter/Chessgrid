import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useChessGame, TIME_CONTROL_PRESETS, type GameMode, type PlayerSideChoice, type SavedGameRecord, type MoveRecord } from '../../hooks/useChessGame';
import { useChessVoice } from '../../hooks/useChessVoice';
import { useTournament } from '../../context/TournamentContext';
import { ChessBoard } from './ChessBoard';
import { ChessPieceSvg } from './ChessPieceSvg';
import { AnalysisView } from './AnalysisView';
import { VoiceControl } from './VoiceControl';
import { VoiceMovePreview } from './VoiceMovePreview';
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Mic,
  Copy,
  Check,
  Download,
  X
} from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface PlayChessPageProps {
  onNavigateHome?: () => void;
  onNavigateCommand?: () => void;
  initialMode?: GameMode;
}

type InGameTab = 'moves' | 'game_info' | 'captured' | 'analysis';

// Lightweight opening detector for authentic tournament feel
function detectOpening(moves: MoveRecord[]): string {
  if (!moves || moves.length === 0) return 'Standard position';
  const san = moves.map(m => m.san).slice(0, 5).join(' ');
  if (san.startsWith('e4 c5')) return 'Sicilian Defense';
  if (san.startsWith('e4 e5 Nf3 Nc6 Bb5')) return 'Ruy Lopez';
  if (san.startsWith('e4 e5 Nf3 Nc6 Bc4')) return 'Italian Game';
  if (san.startsWith('e4 e5 Nf3')) return "King's Knight Opening";
  if (san.startsWith('e4 e5')) return "King's Pawn Game";
  if (san.startsWith('e4 e6')) return 'French Defense';
  if (san.startsWith('e4 c6')) return 'Caro-Kann Defense';
  if (san.startsWith('d4 d5 c4')) return "Queen's Gambit";
  if (san.startsWith('d4 Nf6 c4 g6')) return "King's Indian Defense";
  if (san.startsWith('d4 d5')) return "Queen's Pawn Game";
  if (san.startsWith('d4 Nf6')) return 'Indian Defense';
  if (san.startsWith('c4')) return 'English Opening';
  if (san.startsWith('Nf3')) return 'Réti Opening';
  if (san.startsWith('f4')) return "Bird's Opening";
  return 'Open Game';
}

const ELO_MAP: Record<EngineDifficulty, number> = {
  beginner: 800,
  easy: 1200,
  medium: 1600,
  hard: 2000,
  expert: 2400,
};

export const PlayChessPage: React.FC<PlayChessPageProps> = ({
  onNavigateHome,
  onNavigateCommand,
  initialMode = 'vs_computer',
}) => {
  const tournament = useTournament();
  const [activeMode, setActiveMode] = useState<GameMode | 'history'>(initialMode);
  const [inGameTab, setInGameTab] = useState<InGameTab>('moves');
  const [difficulty, setDifficulty] = useState<EngineDifficulty>('medium');
  const [playerSide, setPlayerSide] = useState<PlayerSideChoice>('white');
  const [selectedTimeControl, setSelectedTimeControl] = useState(TIME_CONTROL_PRESETS[6]); // 10+0 Rapid
  const [analyzingGamePgn, setAnalyzingGamePgn] = useState<string | null>(null);

  // Modals / dropdowns state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedPgn, setCopiedPgn] = useState(false);
  const [copiedFen, setCopiedFen] = useState(false);

  // Move navigation / review state
  const [viewingPlyIndex, setViewingPlyIndex] = useState<number | null>(null);
  const movesContainerRef = useRef<HTMLDivElement>(null);

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
    isEngineThinking,
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
    mode: activeMode === 'history' ? 'vs_computer' : activeMode,
    difficulty,
    playerSide,
    timeControl: selectedTimeControl,
    whitePlayerName: 'Arjun Mehta',
    blackPlayerName: activeMode === 'vs_computer' ? `Stockfish (${DIFFICULTY_PRESETS[difficulty].name})` : 'Priya Sharma',
  });

  const voice = useChessVoice({
    chess,
    fen,
    turn,
    humanColor,
    mode: activeMode,
    isGameOver,
    isEngineThinking,
    makeMove: (from, to, _promotion) => {
      setViewingPlyIndex(null);
      handleSquareClickMove(from, to);
      return true;
    },
    undoMove,
    toggleFlip,
    resign: () => resign(),
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const legalMoves = selectedSquare ? getLegalMoves(selectedSquare as any) : [];

  // Auto-scroll moves container on move
  useEffect(() => {
    if (movesContainerRef.current) {
      movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight;
    }
  }, [moveHistory.length]);

  // Determine displayed FEN based on move navigation
  const displayedFen = useMemo(() => {
    if (viewingPlyIndex === null || viewingPlyIndex >= moveHistory.length - 1) {
      return fen;
    }
    if (viewingPlyIndex === -1) {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    return moveHistory[viewingPlyIndex]?.fenAfter || fen;
  }, [viewingPlyIndex, moveHistory, fen]);

  // Determine displayed lastMove based on move navigation
  const displayedLastMove = useMemo(() => {
    if (viewingPlyIndex === null || viewingPlyIndex >= moveHistory.length - 1) {
      return lastMove;
    }
    if (viewingPlyIndex === -1) {
      return null;
    }
    const rec = moveHistory[viewingPlyIndex];
    return rec ? { from: rec.from, to: rec.to } : null;
  }, [viewingPlyIndex, moveHistory, lastMove]);

  const handleSquareClick = (sq: string) => {
    if (isGameOver) return;
    // If browsing past moves, return to live position first
    if (viewingPlyIndex !== null) {
      setViewingPlyIndex(null);
    }

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
        if (activeMode === 'vs_computer' && piece.color !== humanColor) {
          return;
        }
        setSelectedSquare(sq);
      }
    }
  };

  const handleAnalyzeFinishedGame = () => {
    setAnalyzingGamePgn(pgn);
    setActiveMode('analysis');
  };

  const handleStartAnalysisFromHistory = (savedPgn: string) => {
    setAnalyzingGamePgn(savedPgn);
    setActiveMode('analysis');
  };

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(pgn);
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(displayedFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  const handleDownloadPgn = () => {
    const element = document.createElement('a');
    const file = new Blob([pgn], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ChessGrid_${Date.now()}.pgn`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // If in Analysis mode, render the full Analysis View
  if (activeMode === 'analysis') {
    return (
      <div className="min-h-screen bg-[#0a0a0d] text-slate-100 flex flex-col font-sans">
        <AnalysisView
          initialPgn={analyzingGamePgn || pgn}
          onBack={() => {
            setAnalyzingGamePgn(null);
            setActiveMode('vs_computer');
          }}
        />
      </div>
    );
  }

  // Board orientation and player assignments
  const topColor = isFlipped ? 'w' : 'b';
  const bottomColor = isFlipped ? 'b' : 'w';

  const topTimeMs = isFlipped ? whiteTimeMs : blackTimeMs;
  const bottomTimeMs = isFlipped ? blackTimeMs : whiteTimeMs;

  // Authentic reference players: Arjun Mehta (1823) vs Priya Sharma (1798)
  const topPlayerName = activeMode === 'vs_computer'
    ? (topColor === humanColor ? 'Priya Sharma' : `Stockfish (${DIFFICULTY_PRESETS[difficulty].name})`)
    : (topColor === 'w' ? 'Arjun Mehta' : 'Priya Sharma');

  const topRating = activeMode === 'vs_computer'
    ? (topColor === humanColor ? '1798' : String(ELO_MAP[difficulty]))
    : (topColor === 'w' ? '1823' : '1798');

  const topInitials = activeMode === 'vs_computer'
    ? (topColor === humanColor ? 'PS' : 'SF')
    : (topColor === 'w' ? 'AM' : 'PS');

  const bottomPlayerName = activeMode === 'vs_computer'
    ? (bottomColor === humanColor ? 'Priya Sharma' : `Stockfish (${DIFFICULTY_PRESETS[difficulty].name})`)
    : (bottomColor === 'w' ? 'Arjun Mehta' : 'Priya Sharma');

  const bottomRating = activeMode === 'vs_computer'
    ? (bottomColor === humanColor ? '1798' : String(ELO_MAP[difficulty]))
    : (bottomColor === 'w' ? '1823' : '1798');

  const bottomInitials = activeMode === 'vs_computer'
    ? (bottomColor === humanColor ? 'PS' : 'SF')
    : (bottomColor === 'w' ? 'AM' : 'PS');

  const openingName = detectOpening(moveHistory);

  // Tournament metadata
  const tournamentTitle = tournament.settings?.name || 'Electrophysisiesta 2026';
  const tournamentSubtitle = tournament.settings?.departmentName || 'Department of Physics and Electronics';
  const roundLabel = tournament.settings
    ? `Round ${tournament.settings.currentRoundIndex + 1} • Quarterfinal`
    : 'Round 2 • Quarterfinal';
  const matchIdLabel = 'Board 04 • Match #QF-02';
  const timeControlLabel = selectedTimeControl.name;

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans select-none overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 15%, rgba(201,168,76,0.06) 0%, transparent 60%), #0a0a0b',
      }}
    >
      {/* ── Top Header Navigation Bar (Matches Reference Image) ── */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-3.5 border-b border-amber-500/20 backdrop-blur-xl bg-black/75 sticky top-0 z-40 flex items-center justify-between gap-4">
        {/* Left Section: Logo, Title, Department & Status Chips */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Logo with Gold Crown */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-neutral-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <span className="text-xl leading-none">♚</span>
            </div>
            <div className="hidden sm:block">
              <div 
                className="text-lg font-bold tracking-wider text-white leading-tight"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                ChessGrid
              </div>
              <div className="text-[9px] font-mono tracking-widest text-amber-400/80 uppercase">
                PLAY • COMPETE • ORGANIZE
              </div>
            </div>
          </div>

          <div className="hidden md:block h-7 w-px bg-white/10 flex-shrink-0" />

          {/* Tournament Name & Department */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white tracking-wide truncate">
                {tournamentTitle}
              </span>
              <span className="hidden lg:inline text-xs text-slate-400">
                • {tournamentSubtitle}
              </span>
            </div>

            {/* Chips row */}
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[10px] font-mono font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                {roundLabel}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                {matchIdLabel}
              </span>
              <span className="hidden md:inline-block text-[10px] font-mono font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                Time Control: {timeControlLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isGameOver ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Settings Gear + Back to Tournament Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
            title="Game Settings"
          >
            <Settings2 className="w-4 h-4 text-amber-400" />
          </button>

          {(onNavigateCommand || onNavigateHome) && (
            <button
              onClick={onNavigateCommand || onNavigateHome}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Back to Tournament</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main Play Arena ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* History Archive Tab View */}
        {activeMode === 'history' ? (
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
                  onClick={() => setActiveMode('vs_computer')}
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
              ACTIVE GAME BOARD VIEW (MATCHES REFERENCE SCREENSHOT)
              ══════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left/Center Column: Top Player Card + Board + Bottom Player Card (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center gap-3">
              
              {/* ── Top Player Card (Black / Flipped White) ── */}
              <div className="w-full max-w-[560px] px-4 py-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-neutral-900 border-2 border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-sm shadow-md flex-shrink-0">
                    {topInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm sm:text-base tracking-wide truncate">
                        {topPlayerName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({topRating})
                      </span>
                      <span className="text-sm">🇮🇳</span>
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          topColor === 'w' ? 'bg-white shadow-[0_0_6px_#fff]' : 'bg-neutral-600 border border-neutral-400'
                        }`}
                        title={topColor === 'w' ? 'White' : 'Black'}
                      />
                    </div>
                    {/* Captured pieces inline */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {(topColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).slice(0, 10).map((p, idx) => (
                        <div key={idx} className="w-3.5 h-3.5 opacity-75">
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

                {/* Top Green Capsule Digital Clock */}
                {selectedTimeControl.initialSeconds > 0 && (
                  <div
                    className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono font-bold tracking-widest text-lg sm:text-2xl transition-all duration-300 flex-shrink-0 ${
                      turn === topColor && isClockRunning
                        ? 'bg-[#051a10] text-emerald-400 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50'
                        : 'bg-[#09120e] text-emerald-500/60 border-2 border-emerald-500/30'
                    }`}
                  >
                    {formatTime(topTimeMs)}
                  </div>
                )}
              </div>

              {/* ── Main Interactive Wooden Chess Board ── */}
              <div className="w-full flex justify-center">
                <ChessBoard
                  fen={displayedFen}
                  isFlipped={isFlipped}
                  turn={turn}
                  inCheck={inCheck}
                  lastMove={displayedLastMove}
                  selectedSquare={selectedSquare as any}
                  legalMoves={legalMoves as any}
                  pendingPromotion={pendingPromotion}
                  voicePreviewMove={voice.previewMove}
                  ambiguousSquares={voice.ambiguousSquares}
                  onSquareClick={handleSquareClick}
                  onResolvePromotion={resolvePromotion}
                />
              </div>

              {/* ── Voice Candidate Move Preview or Resign Prompt ── */}
              {(voice.previewMove || voice.ambiguousCandidates.length > 0 || voice.status === 'CONFIRMING_RESIGN') && (
                <div className="w-full max-w-[560px]">
                  <VoiceMovePreview
                    previewMove={voice.previewMove}
                    ambiguousCandidates={voice.ambiguousCandidates}
                    isConfirmingResign={voice.status === 'CONFIRMING_RESIGN'}
                    onConfirm={voice.status === 'CONFIRMING_RESIGN' ? voice.confirmResign : voice.confirmMove}
                    onCancel={voice.cancelPreview}
                    onSelectCandidate={voice.selectCandidate}
                  />
                </div>
              )}

              {/* ── Bottom Player Card (White / Flipped Black) ── */}
              <div className="w-full max-w-[560px] px-4 py-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-neutral-900 border-2 border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-sm shadow-md flex-shrink-0">
                    {bottomInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm sm:text-base tracking-wide truncate">
                        {bottomPlayerName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({bottomRating})
                      </span>
                      <span className="text-sm">🇮🇳</span>
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          bottomColor === 'w' ? 'bg-white shadow-[0_0_6px_#fff]' : 'bg-neutral-600 border border-neutral-400'
                        }`}
                        title={bottomColor === 'w' ? 'White' : 'Black'}
                      />
                    </div>
                    {/* Captured pieces inline */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {(bottomColor === 'w' ? capturedPieces.whiteCaptured : capturedPieces.blackCaptured).slice(0, 10).map((p, idx) => (
                        <div key={idx} className="w-3.5 h-3.5 opacity-75">
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

                {/* Bottom Green Capsule Digital Clock */}
                {selectedTimeControl.initialSeconds > 0 && (
                  <div
                    className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono font-bold tracking-widest text-lg sm:text-2xl transition-all duration-300 flex-shrink-0 ${
                      turn === bottomColor && isClockRunning
                        ? 'bg-[#051a10] text-emerald-400 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50'
                        : 'bg-[#09120e] text-emerald-500/60 border-2 border-emerald-500/30'
                    }`}
                  >
                    {formatTime(bottomTimeMs)}
                  </div>
                )}
              </div>

              {/* Historical Position Indicator */}
              {viewingPlyIndex !== null && (
                <div className="w-full max-w-[560px] flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono">
                  <span>Viewing historical move {viewingPlyIndex === -1 ? '0 (Start)' : `${viewingPlyIndex + 1}/${moveHistory.length}`}</span>
                  <button
                    onClick={() => setViewingPlyIndex(null)}
                    className="font-bold underline hover:text-white cursor-pointer"
                  >
                    Return to Live →
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Tabbed Control Panel (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4">
              
              {/* ── Main Tabbed Panel Container ── */}
              <div className="rounded-2xl bg-black/60 border border-amber-500/25 p-4 backdrop-blur-md shadow-xl space-y-4">
                
                {/* ── 4 Tabs Header (Moves, Game Info, Captured, Analysis) ── */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setInGameTab('moves')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                      inGameTab === 'moves'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Moves
                  </button>

                  <button
                    onClick={() => setInGameTab('game_info')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                      inGameTab === 'game_info'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Game Info
                  </button>

                  <button
                    onClick={() => setInGameTab('captured')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                      inGameTab === 'captured'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Captured
                  </button>

                  <button
                    onClick={() => setInGameTab('analysis')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                      inGameTab === 'analysis'
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Analysis
                  </button>
                </div>

                {/* ═══════════════════════════════════════════
                    TAB 1: MOVES NOTATION & CONTROL (REFERENCE)
                    ═══════════════════════════════════════════ */}
                {inGameTab === 'moves' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Moves Table */}
                    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-mono font-bold text-slate-400">
                        <span className="col-span-2">#</span>
                        <span className="col-span-5">White</span>
                        <span className="col-span-5">Black</span>
                      </div>

                      {/* Move rows */}
                      <div 
                        ref={movesContainerRef}
                        className="h-[210px] overflow-y-auto px-3 py-2 space-y-1 font-mono text-xs scrollbar-thin"
                      >
                        {moveHistory.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
                            No moves recorded yet. White to make the first move.
                          </div>
                        ) : (
                          Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, rIdx) => {
                            const whiteMove = moveHistory[rIdx * 2];
                            const blackMove = moveHistory[rIdx * 2 + 1];
                            const whitePly = rIdx * 2;
                            const blackPly = rIdx * 2 + 1;

                            const isWhiteActive = viewingPlyIndex !== null 
                              ? viewingPlyIndex === whitePly 
                              : moveHistory.length - 1 === whitePly;

                            const isBlackActive = viewingPlyIndex !== null 
                              ? viewingPlyIndex === blackPly 
                              : moveHistory.length - 1 === blackPly;

                            return (
                              <div
                                key={rIdx}
                                className="grid grid-cols-12 items-center py-1 rounded hover:bg-white/5 transition-colors"
                              >
                                <span className="col-span-2 text-slate-500 text-[11px]">{rIdx + 1}.</span>
                                
                                <span className="col-span-5">
                                  {whiteMove ? (
                                    <button
                                      onClick={() => setViewingPlyIndex(whitePly)}
                                      className={`px-2 py-0.5 rounded transition-all text-left font-semibold cursor-pointer ${
                                        isWhiteActive
                                          ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-sm'
                                          : 'text-slate-200 hover:text-amber-300'
                                      }`}
                                    >
                                      {whiteMove.san}
                                    </button>
                                  ) : null}
                                </span>

                                <span className="col-span-5">
                                  {blackMove ? (
                                    <button
                                      onClick={() => setViewingPlyIndex(blackPly)}
                                      className={`px-2 py-0.5 rounded transition-all text-left font-semibold cursor-pointer ${
                                        isBlackActive
                                          ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50 shadow-sm'
                                          : 'text-slate-300 hover:text-amber-300'
                                      }`}
                                    >
                                      {blackMove.san}
                                    </button>
                                  ) : null}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Move Navigation Buttons: |<  <  >  >|  Flip Board */}
                    <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewingPlyIndex(-1)}
                          disabled={moveHistory.length === 0}
                          className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Start Position"
                        >
                          <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const current = viewingPlyIndex === null ? moveHistory.length - 1 : viewingPlyIndex;
                            setViewingPlyIndex(Math.max(-1, current - 1));
                          }}
                          disabled={moveHistory.length === 0 || viewingPlyIndex === -1}
                          className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Previous Move"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (viewingPlyIndex === null) return;
                            const next = viewingPlyIndex + 1;
                            if (next >= moveHistory.length - 1) {
                              setViewingPlyIndex(null);
                            } else {
                              setViewingPlyIndex(next);
                            }
                          }}
                          disabled={viewingPlyIndex === null || moveHistory.length === 0}
                          className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Next Move"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewingPlyIndex(null)}
                          disabled={viewingPlyIndex === null}
                          className="p-2 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Latest Move"
                        >
                          <ChevronsRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={toggleFlip}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Flip Board Orientation"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Flip Board</span>
                      </button>
                    </div>

                    {/* Match Action Buttons: Offer Draw, Resign, More */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={agreeDraw}
                        disabled={isGameOver || moveHistory.length < 2}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                      >
                        <Handshake className="w-3.5 h-3.5 text-amber-400" />
                        <span>Offer Draw</span>
                      </button>

                      <button
                        onClick={() => resign()}
                        disabled={isGameOver}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5 text-red-400" />
                        <span>Resign</span>
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4 text-amber-400" />
                          <span>More</span>
                        </button>

                        {/* Dropdown Menu */}
                        {isMoreMenuOpen && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-neutral-900 border border-amber-500/30 shadow-2xl p-1.5 space-y-1 z-30 font-mono text-xs">
                            <button
                              onClick={() => {
                                undoMove();
                                setIsMoreMenuOpen(false);
                              }}
                              disabled={moveHistory.length === 0 || isGameOver}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-slate-200 disabled:opacity-30 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                              <span>Takeback (Undo)</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsVoiceWidgetOpen(!isVoiceWidgetOpen);
                                setIsMoreMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-slate-200 cursor-pointer"
                            >
                              <Mic className="w-3.5 h-3.5 text-amber-400" />
                              <span>Voice Controls</span>
                            </button>
                            <button
                              onClick={() => {
                                handleCopyPgn();
                                setIsMoreMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-slate-200 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copy PGN</span>
                            </button>
                            <button
                              onClick={() => {
                                handleCopyFen();
                                setIsMoreMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-slate-200 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-amber-400" />
                              <span>Copy FEN</span>
                            </button>
                            <button
                              onClick={() => {
                                setSoundEnabled(!soundEnabled);
                                setIsMoreMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-slate-200 cursor-pointer"
                            >
                              {soundEnabled ? (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Mute Sounds</span>
                                </>
                              ) : (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Enable Sounds</span>
                                </>
                              )}
                            </button>
                            <div className="h-px bg-white/10 my-1" />
                            <button
                              onClick={() => {
                                restartGame();
                                setIsMoreMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/10 text-amber-300 cursor-pointer"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                              <span>Restart Match</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Turn Indicator Box (Matches Reference Image) */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <div>
                          <div className="text-sm font-bold text-white font-mono">
                            {isGameOver
                              ? (gameResult?.winner === 'draw' ? 'Game Drawn' : `${gameResult?.winner === 'white' ? 'White' : 'Black'} Won`)
                              : `${turn === 'w' ? 'White' : 'Black'} to move`}
                          </div>
                          <div className="text-xs font-mono text-slate-400">
                            {openingName}
                          </div>
                        </div>
                      </div>

                      {inCheck && !isGameOver && (
                        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 animate-bounce">
                          CHECK!
                        </span>
                      )}
                    </div>

                    {/* Match Metadata Summary Card (2x3 Grid Matching Reference Image) */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tournament</div>
                          <div className="text-slate-200 font-semibold truncate">{tournamentTitle}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Match ID</div>
                          <div className="text-slate-200 font-semibold">#QF-02</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Round</div>
                          <div className="text-slate-200 font-semibold">Round 2 (Quarterfinals)</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Time Control</div>
                          <div className="text-slate-200 font-semibold">{timeControlLabel}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Board</div>
                          <div className="text-slate-200 font-semibold">Board 04</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Status</div>
                          <div className="text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {isGameOver ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 2: GAME INFO
                    ═══════════════════════════════════════════ */}
                {inGameTab === 'game_info' && (
                  <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-[11px] font-bold text-amber-300 uppercase">Tournament Profile</div>
                      <p className="text-slate-300 text-xs">{tournamentTitle} — {tournamentSubtitle}</p>
                      <div className="text-slate-400 text-[11px]">Knockout Bracket • Collegiate Stage</div>
                    </div>

                    {/* FEN Section */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase">Position FEN</span>
                        <button
                          onClick={handleCopyFen}
                          className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white bg-white/5 px-2 py-0.5 rounded cursor-pointer"
                        >
                          {copiedFen ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                          <span>{copiedFen ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-2 rounded bg-black/60 text-[10px] break-all text-slate-300 border border-white/5 font-mono">
                        {displayedFen}
                      </div>
                    </div>

                    {/* PGN Export */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase">PGN Notation</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleCopyPgn}
                            className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white bg-white/5 px-2 py-0.5 rounded cursor-pointer"
                          >
                            {copiedPgn ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                            <span>{copiedPgn ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={handleDownloadPgn}
                            className="flex items-center gap-1 text-[10px] text-amber-300 hover:text-white bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-black/60 text-[10px] max-h-24 overflow-y-auto text-slate-300 border border-white/5 font-mono leading-relaxed">
                        {pgn || '[Event "ChessGrid Match"]\n[Site "Arena"]\n*'}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 3: CAPTURED PIECES BREAKDOWN
                    ═══════════════════════════════════════════ */}
                {inGameTab === 'captured' && (
                  <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                    {/* White Captured Material */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                          <span className="font-bold text-slate-200">Arjun Mehta (White) Captured</span>
                        </div>
                        {capturedPieces.whiteAdvantage > 0 && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            +{capturedPieces.whiteAdvantage} Lead
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap min-h-8 p-2 rounded-lg bg-black/30">
                        {capturedPieces.whiteCaptured.length === 0 ? (
                          <span className="text-slate-500 text-[11px] italic">No Black pieces captured yet</span>
                        ) : (
                          capturedPieces.whiteCaptured.map((p, idx) => (
                            <div key={idx} className="w-6 h-6 p-0.5 bg-white/5 rounded border border-white/10">
                              <ChessPieceSvg type={p} color="b" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Black Captured Material */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 border border-neutral-400" />
                          <span className="font-bold text-slate-200">Priya Sharma (Black) Captured</span>
                        </div>
                        {capturedPieces.blackAdvantage > 0 && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            +{capturedPieces.blackAdvantage} Lead
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap min-h-8 p-2 rounded-lg bg-black/30">
                        {capturedPieces.blackCaptured.length === 0 ? (
                          <span className="text-slate-500 text-[11px] italic">No White pieces captured yet</span>
                        ) : (
                          capturedPieces.blackCaptured.map((p, idx) => (
                            <div key={idx} className="w-6 h-6 p-0.5 bg-white/5 rounded border border-white/10">
                              <ChessPieceSvg type={p} color="w" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Material Advantage Summary */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center text-amber-300 font-semibold">
                      {capturedPieces.whiteAdvantage === 0 && capturedPieces.blackAdvantage === 0
                        ? 'Material Balance: Equal (0.0)'
                        : capturedPieces.whiteAdvantage > 0
                        ? `Material Balance: White +${capturedPieces.whiteAdvantage}`
                        : `Material Balance: Black +${capturedPieces.blackAdvantage}`}
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════
                    TAB 4: ANALYSIS (STOCKFISH ENGINE)
                    ═══════════════════════════════════════════ */}
                {inGameTab === 'analysis' && (
                  <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">Stockfish 16 Engine</span>
                        <span className="text-[10px] text-slate-400">WASM Multi-thread</span>
                      </div>

                      {/* Engine status & eval */}
                      <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Position Evaluation:</span>
                          <span className="font-bold text-emerald-400">
                            {isEngineThinking ? 'Calculating...' : '+0.25 (Slight advantage White)'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden flex">
                          <div className="bg-white h-full transition-all" style={{ width: '52%' }} />
                          <div className="bg-neutral-900 h-full transition-all" style={{ width: '48%' }} />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Deep multi-PV engine evaluation with tactical blunder detection and move recommendations.
                      </p>

                      <button
                        onClick={handleAnalyzeFinishedGame}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-wider bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>OPEN FULL ANALYSIS SUITE →</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* ── Voice Control Drawer (Collapsible) ── */}
              {isVoiceWidgetOpen && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <VoiceControl
                    isSupported={voice.isSupported}
                    enabled={voice.enabled}
                    status={voice.status}
                    listenMode={voice.listenMode}
                    isPushToTalkActive={voice.isPushToTalkActive}
                    transcript={voice.transcript}
                    feedbackMessage={voice.feedbackMessage}
                    error={voice.error}
                    onToggleEnabled={voice.toggleEnabled}
                    onSetListenMode={voice.setListenMode}
                    onStartPushToTalk={voice.startPushToTalk}
                    onStopPushToTalk={voice.stopPushToTalk}
                  />
                </div>
              )}

              {/* ── Game Over Banner ── */}
              {isGameOver && gameResult && (
                <div className="p-5 rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-black/80 shadow-[0_0_30px_rgba(201,168,76,0.3)] space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span 
                      className="font-bold tracking-wider uppercase text-lg"
                      style={{ fontFamily: 'var(--font-cinematic)' }}
                    >
                      Match Concluded
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">{gameResult.reason}</p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleAnalyzeFinishedGame}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider bg-amber-500/30 text-amber-200 border border-amber-500/60 hover:bg-amber-500/40 shadow-md transition-all cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>ANALYZE MATCH</span>
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

            </div>
          </div>
        )}
      </main>

      {/* ── Settings Modal Dialog ── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-sm">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span>MATCH CONFIGURATION</span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Game Mode Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-slate-400 block font-semibold">Game Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setActiveMode('vs_computer');
                    restartGame();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'vs_computer'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>Computer</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMode('two_player_local');
                    restartGame();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'two_player_local'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>2-Player</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMode('history');
                    setIsSettingsOpen(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMode === 'history'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <History className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* Difficulty Selector (vs Computer only) */}
            {activeMode === 'vs_computer' && (
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-slate-400 block font-semibold">Engine Strength</label>
                <div className="grid grid-cols-5 gap-1">
                  {(['beginner', 'easy', 'medium', 'hard', 'expert'] as EngineDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setDifficulty(diff);
                        restartGame();
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {diff.substring(0, 3)}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {DIFFICULTY_PRESETS[difficulty].description}
                </p>
              </div>
            )}

            {/* Time Control Selector */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-slate-400 block font-semibold">Time Control</label>
              <select
                value={selectedTimeControl.name}
                onChange={(e) => {
                  const found = TIME_CONTROL_PRESETS.find(tc => tc.name === e.target.value);
                  if (found) {
                    setSelectedTimeControl(found);
                    restartGame();
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {TIME_CONTROL_PRESETS.map((tc) => (
                  <option key={tc.name} value={tc.name} className="bg-neutral-900 text-slate-200">
                    {tc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Side Choice (vs Computer only) */}
            {activeMode === 'vs_computer' && (
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-slate-400 block font-semibold">Play As</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['white', 'random', 'black'] as PlayerSideChoice[]).map((side) => (
                    <button
                      key={side}
                      onClick={() => {
                        setPlayerSide(side);
                        restartGame(side);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
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
              onClick={() => {
                restartGame();
                setIsSettingsOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 border border-amber-500/40 shadow-sm transition-all cursor-pointer"
            >
              START NEW MATCH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayChessPage;
