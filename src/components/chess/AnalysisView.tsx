import React, { useState, useEffect, useRef } from 'react';
import { Chess, type Square } from 'chess.js';
import { ChessBoard } from './ChessBoard';
import { EvaluationBar } from './EvaluationBar';
import { 
  getChessEngine, 
  type EngineEvaluation, 
  type GameAnalysisReport, 
  type MoveQuality 
} from '../../services/chessEngine';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowLeft,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface AnalysisViewProps {
  initialPgn?: string;
  initialFen?: string;
  whiteName?: string;
  blackName?: string;
  onBack?: () => void;
}

const QUALITY_STYLES: Record<MoveQuality, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  best: { label: 'Best', bg: 'rgba(34, 166, 122, 0.2)', text: '#22a67a', border: 'rgba(34, 166, 122, 0.4)', icon: <Sparkles className="w-3 h-3" /> },
  excellent: { label: 'Excellent', bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.4)', icon: <Check className="w-3 h-3" /> },
  good: { label: 'Good', bg: 'rgba(148, 163, 184, 0.15)', text: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)', icon: null },
  inaccuracy: { label: 'Inaccuracy', bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15', border: 'rgba(234, 179, 8, 0.4)', icon: <HelpCircle className="w-3 h-3" /> },
  mistake: { label: 'Mistake', bg: 'rgba(249, 115, 22, 0.2)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.4)', icon: <AlertTriangle className="w-3 h-3" /> },
  blunder: { label: 'Blunder', bg: 'rgba(239, 68, 68, 0.25)', text: '#f87171', border: 'rgba(239, 68, 68, 0.5)', icon: <XCircle className="w-3 h-3" /> },
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  initialPgn = '',
  initialFen,
  whiteName = 'White',
  blackName = 'Black',
  onBack,
}) => {
  const [chess] = useState<Chess>(() => {
    const c = new Chess(initialFen);
    if (initialPgn) {
      try {
        c.loadPgn(initialPgn);
      } catch {
        // Ignore PGN parse fallback
      }
    }
    return c;
  });

  // Extract move list and FEN history
  const [moveList, setMoveList] = useState<{ san: string; uci: string; from: Square; to: Square; fen: string; color: 'w' | 'b' }[]>([]);
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedPgn, setCopiedPgn] = useState(false);
  const [copiedFen, setCopiedFen] = useState(false);

  // Engine evaluation
  const [engineEval, setEngineEval] = useState<EngineEvaluation | null>(null);
  const [isAnalyzingGame, setIsAnalyzingGame] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number } | null>(null);
  const [analysisReport, setAnalysisReport] = useState<GameAnalysisReport | null>(null);

  const engine = useRef(getChessEngine());
  const cancelEvalRef = useRef<(() => void) | null>(null);

  // Build move history array from starting position
  useEffect(() => {
    const replayChess = new Chess(initialFen);
    const history = chess.history({ verbose: true });
    const moves = history.map(m => {
      replayChess.move({ from: m.from, to: m.to, promotion: m.promotion });
      return {
        san: m.san,
        uci: `${m.from}${m.to}${m.promotion || ''}`,
        from: m.from as Square,
        to: m.to as Square,
        fen: replayChess.fen(),
        color: m.color as 'w' | 'b',
      };
    });

    setMoveList(moves);
    setCurrentPly(moves.length); // Start at final position
  }, [chess, initialFen]);

  // Current displayed FEN
  const currentFen = React.useMemo(() => {
    if (currentPly === 0) {
      const starting = new Chess(initialFen);
      return starting.fen();
    }
    return moveList[currentPly - 1]?.fen || chess.fen();
  }, [currentPly, moveList, chess, initialFen]);

  // Last move highlight
  const currentLastMove = React.useMemo(() => {
    if (currentPly === 0) return null;
    const m = moveList[currentPly - 1];
    return m ? { from: m.from, to: m.to } : null;
  }, [currentPly, moveList]);

  // Real-time Stockfish evaluation of the current position
  useEffect(() => {
    if (cancelEvalRef.current) {
      cancelEvalRef.current();
    }

    const cancel = engine.current.startAnalysis(
      currentFen,
      (evalData) => {
        setEngineEval(evalData);
      },
      16
    );

    cancelEvalRef.current = cancel;
    return () => {
      if (cancelEvalRef.current) {
        cancelEvalRef.current();
      }
    };
  }, [currentFen]);

  // Auto-play replay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentPly((prev) => {
        if (prev >= moveList.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlaying, moveList.length]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPly((p) => Math.max(0, p - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPly((p) => Math.min(moveList.length, p + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveList.length]);

  // Run full game batch analysis
  const handleRunFullAnalysis = async () => {
    if (moveList.length === 0 || isAnalyzingGame) return;
    setIsAnalyzingGame(true);

    const positions = moveList.map((m, idx) => ({
      fenBefore: idx === 0 ? new Chess(initialFen).fen() : moveList[idx - 1].fen,
      fenAfter: m.fen,
      san: m.san,
      uci: m.uci,
      color: m.color,
      moveNumber: Math.floor(idx / 2) + 1,
    }));

    try {
      const report = await engine.current.analyzeGame(positions, (current, total) => {
        setAnalysisProgress({ current, total });
      });
      setAnalysisReport(report);
    } catch (err) {
      console.warn('[Analysis] Error analyzing game:', err);
    } finally {
      setIsAnalyzingGame(false);
      setAnalysisProgress(null);
    }
  };

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(chess.pgn());
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(currentFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 select-none font-sans animate-in fade-in">
      
      {/* ── Top Header & Actions ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-amber-500/20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Play Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold tracking-wider text-amber-300 uppercase"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              Game Analysis & Telemetry
            </h1>
            <p className="text-xs font-mono text-slate-400">
              {whiteName} vs {blackName} • {moveList.length} Half-Moves
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Copy current position FEN"
          >
            {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFen ? 'FEN COPIED' : 'COPY FEN'}</span>
          </button>

          <button
            onClick={handleCopyPgn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Copy complete game PGN"
          >
            {copiedPgn ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPgn ? 'PGN COPIED' : 'COPY PGN'}</span>
          </button>

          <button
            onClick={() => setIsFlipped(prev => !prev)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Flip Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Analysis Split View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Board + Evaluation Bar (7 cols) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-4">
          
          {/* Evaluation Bar */}
          <div className="hidden sm:block shrink-0">
            <EvaluationBar evaluation={engineEval} isFlipped={isFlipped} />
          </div>

          {/* Chess Board Container */}
          <div className="w-full flex-1">
            <ChessBoard
              fen={currentFen}
              isFlipped={isFlipped}
              lastMove={currentLastMove}
              interactive={false}
            />

            {/* Replay Controls Toolbar */}
            <div className="flex items-center justify-between mt-4 p-3 rounded-xl glass-panel border border-amber-500/20 gap-2">
              <button
                onClick={() => setCurrentPly(0)}
                disabled={currentPly === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors cursor-pointer"
                title="First Move"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPly(prev => Math.max(0, prev - 1))}
                disabled={currentPly === 0}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors cursor-pointer"
                title="Previous Move"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Play / Pause auto replay */}
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-amber-300" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => setCurrentPly(prev => Math.min(moveList.length, prev + 1))}
                disabled={currentPly >= moveList.length}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors cursor-pointer"
                title="Next Move"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPly(moveList.length)}
                disabled={currentPly >= moveList.length}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors cursor-pointer"
                title="Last Move"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Engine Telemetry, Accuracy, & Move List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ── Live Engine Telemetry Card ── */}
          <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>STOCKFISH 16 WASM ENGINE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DEPTH {engineEval?.depth || 0}
              </span>
            </div>

            {/* Eval readout + Best Move */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Evaluation</span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {engineEval
                    ? engineEval.isMate
                      ? `Mate in ${engineEval.mateIn}`
                      : (engineEval.score / 100 > 0 ? `+${(engineEval.score / 100).toFixed(2)}` : (engineEval.score / 100).toFixed(2))
                    : '0.00'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Best Line</span>
                <span className="text-sm font-mono font-semibold text-amber-300 truncate block">
                  {engineEval?.bestMove || '—'}
                </span>
              </div>
            </div>

            {/* Principal variation sequence */}
            {engineEval?.pv && engineEval.pv.length > 0 && (
              <div className="text-[11px] font-mono text-slate-400 truncate">
                <span className="text-slate-500 mr-1">PV:</span>
                {engineEval.pv.slice(0, 6).join(' ')}
              </div>
            )}
          </div>

          {/* ── Full Game Review Runner / Accuracy Card ── */}
          <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-bold tracking-wider text-slate-200 uppercase"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                Accuracy & Move Quality
              </span>
              
              {!analysisReport && (
                <button
                  onClick={handleRunFullAnalysis}
                  disabled={isAnalyzingGame || moveList.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-500/40 hover:to-amber-600/40 text-amber-200 border border-amber-500/50 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAnalyzingGame ? 'ANALYZING...' : 'RUN GAME REVIEW'}</span>
                </button>
              )}
            </div>

            {/* Progress Bar when running */}
            {isAnalyzingGame && analysisProgress && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Calculating move deltas...</span>
                  <span>{analysisProgress.current} / {analysisProgress.total}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-200"
                    style={{ width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Accuracy summary if analyzed */}
            {analysisReport && (
              <div className="space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">White Accuracy</span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">
                      {analysisReport.whiteAccuracy}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Black Accuracy</span>
                    <span className="text-2xl font-mono font-bold text-emerald-400">
                      {analysisReport.blackAccuracy}%
                    </span>
                  </div>
                </div>

                {/* Move quality breakdown summary */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <span className="font-bold">{analysisReport.whiteStats.best + analysisReport.blackStats.best}</span> Best
                  </div>
                  <div className="p-1.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <span className="font-bold">{analysisReport.whiteStats.mistake + analysisReport.blackStats.mistake}</span> Mistakes
                  </div>
                  <div className="p-1.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                    <span className="font-bold">{analysisReport.whiteStats.blunder + analysisReport.blackStats.blunder}</span> Blunders
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Interactive Move List Table ── */}
          <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 max-h-[320px] flex flex-col">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase mb-3">
              Move Notation History
            </span>

            <div className="overflow-y-auto flex-1 space-y-1 pr-1 font-mono text-xs">
              {Array.from({ length: Math.ceil(moveList.length / 2) }).map((_, rIdx) => {
                const whiteMoveIdx = rIdx * 2;
                const blackMoveIdx = rIdx * 2 + 1;
                const whiteMove = moveList[whiteMoveIdx];
                const blackMove = moveList[blackMoveIdx];

                const whiteAnalyzed = analysisReport?.moves[whiteMoveIdx];
                const blackAnalyzed = analysisReport?.moves[blackMoveIdx];

                return (
                  <div
                    key={rIdx}
                    className="grid grid-cols-12 gap-1 items-center p-1 rounded hover:bg-white/5 transition-colors"
                  >
                    {/* Move Number */}
                    <span className="col-span-2 text-slate-500 text-[11px]">
                      {rIdx + 1}.
                    </span>

                    {/* White Move Button */}
                    <button
                      onClick={() => setCurrentPly(whiteMoveIdx + 1)}
                      className={`col-span-5 px-2 py-1 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                        currentPly === whiteMoveIdx + 1
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{whiteMove?.san}</span>
                      {whiteAnalyzed && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded border ${QUALITY_STYLES[whiteAnalyzed.quality].bg} ${QUALITY_STYLES[whiteAnalyzed.quality].text} ${QUALITY_STYLES[whiteAnalyzed.quality].border}`}
                        >
                          {QUALITY_STYLES[whiteAnalyzed.quality].label}
                        </span>
                      )}
                    </button>

                    {/* Black Move Button */}
                    {blackMove ? (
                      <button
                        onClick={() => setCurrentPly(blackMoveIdx + 1)}
                        className={`col-span-5 px-2 py-1 rounded text-left flex items-center justify-between transition-all cursor-pointer ${
                          currentPly === blackMoveIdx + 1
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{blackMove.san}</span>
                        {blackAnalyzed && (
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded border ${QUALITY_STYLES[blackAnalyzed.quality].bg} ${QUALITY_STYLES[blackAnalyzed.quality].text} ${QUALITY_STYLES[blackAnalyzed.quality].border}`}
                          >
                            {QUALITY_STYLES[blackAnalyzed.quality].label}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="col-span-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
