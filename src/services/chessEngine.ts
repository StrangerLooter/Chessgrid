/**
 * ChessGrid — Stockfish Chess Engine Service
 *
 * Runs Stockfish in a dedicated Web Worker to provide:
 * - Best move computation with difficulty presets (Beginner to Expert)
 * - Real-time position evaluation (centipawns & mate-in-N)
 * - Principal variation (PV) line tracking
 * - Full game move-by-move accuracy and quality classification (Best, Inaccuracy, Mistake, Blunder)
 * - Clean lifecycle management (worker pooling & termination)
 *
 * Stockfish is open-source under GPLv3.
 */

export type EngineDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  id: EngineDifficulty;
  name: string;
  skillLevel: number; // 0–20 (Stockfish UCI option)
  depth: number;
  maxThinkingMs: number;
  description: string;
}

export const DIFFICULTY_PRESETS: Record<EngineDifficulty, DifficultyConfig> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    skillLevel: 0,
    depth: 3,
    maxThinkingMs: 350,
    description: 'Casual level making frequent tactical oversights.',
  },
  easy: {
    id: 'easy',
    name: 'Easy',
    skillLevel: 4,
    depth: 6,
    maxThinkingMs: 600,
    description: 'Foundational play with basic opening principles.',
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    skillLevel: 10,
    depth: 10,
    maxThinkingMs: 1000,
    description: 'Solid intermediate tactical vision and defense.',
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    skillLevel: 16,
    depth: 14,
    maxThinkingMs: 1600,
    description: 'Strong club player with deep calculating ability.',
  },
  expert: {
    id: 'expert',
    name: 'Expert (Grandmaster)',
    skillLevel: 20,
    depth: 18,
    maxThinkingMs: 2500,
    description: 'Full-strength engine calculating master-level lines.',
  },
};

export interface EngineEvaluation {
  score: number; // In centipawns (from White perspective)
  isMate: boolean;
  mateIn?: number;
  depth: number;
  bestMove?: string;
  pv?: string[]; // Principal variation
  nps?: number;
}

export type MoveQuality = 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export interface AnalyzedMove {
  moveNumber: number;
  color: 'w' | 'b';
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  evalBefore: number; // Centipawns from perspective of mover
  evalAfter: number; // Centipawns from perspective of mover
  bestMove: string;
  quality: MoveQuality;
  evalDelta: number; // Centipawn loss (>= 0)
}

export interface GameAnalysisReport {
  whiteAccuracy: number; // 0–100%
  blackAccuracy: number; // 0–100%
  moves: AnalyzedMove[];
  whiteStats: {
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
  blackStats: {
    best: number;
    excellent: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
}

export class ChessEngine {
  private worker: Worker | null = null;
  private isReady = false;
  private isSearching = false;
  private messageListeners: ((msg: string) => void)[] = [];
  private onEvalCallback: ((evalData: EngineEvaluation) => void) | null = null;
  private onBestMoveCallback: ((bestMove: string) => void) | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      // Load Stockfish from public/engine/stockfish.js
      this.worker = new Worker('/engine/stockfish.js');

      this.worker.onmessage = (e: MessageEvent) => {
        const line = typeof e.data === 'string' ? e.data : '';
        this.handleEngineOutput(line);
      };

      this.worker.onerror = (err) => {
        console.warn('[ChessEngine] Worker error or fallback:', err);
      };

      // Initialize UCI
      this.sendCommand('uci');
      this.sendCommand('isready');
    } catch (err) {
      console.warn('[ChessEngine] Could not initialize Web Worker:', err);
    }
  }

  private sendCommand(cmd: string) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }

  private handleEngineOutput(line: string) {
    // Notify general listeners
    this.messageListeners.forEach(listener => listener(line));

    if (line === 'readyok' || line.includes('readyok')) {
      this.isReady = true;
    }

    // Parse info line: "info depth 14 seldepth 18 score cp 45 nodes 18234 pv e2e4 e7e5"
    if (line.startsWith('info ') && line.includes('score ')) {
      const parsedEval = this.parseInfoLine(line);
      if (parsedEval && this.onEvalCallback) {
        this.onEvalCallback(parsedEval);
      }
    }

    // Parse bestmove line: "bestmove e2e4 ponder e7e5"
    if (line.startsWith('bestmove ')) {
      this.isSearching = false;
      const parts = line.split(' ');
      const bestMove = parts[1];
      if (bestMove && bestMove !== '(none)' && this.onBestMoveCallback) {
        this.onBestMoveCallback(bestMove);
      }
    }
  }

  public getIsReady(): boolean {
    return this.isReady;
  }

  public getIsSearching(): boolean {
    return this.isSearching;
  }

  private parseInfoLine(line: string): EngineEvaluation | null {
    try {
      const parts = line.split(' ');
      let depth = 0;
      let score = 0;
      let isMate = false;
      let mateIn: number | undefined;
      let nps: number | undefined;
      const pv: string[] = [];

      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'depth' && parts[i + 1]) {
          depth = parseInt(parts[i + 1], 10) || 0;
        } else if (parts[i] === 'score') {
          const type = parts[i + 1];
          const val = parseInt(parts[i + 2], 10) || 0;
          if (type === 'cp') {
            score = val;
            isMate = false;
          } else if (type === 'mate') {
            isMate = true;
            mateIn = val;
            score = val > 0 ? 10000 - val * 100 : -10000 - val * 100;
          }
        } else if (parts[i] === 'nps' && parts[i + 1]) {
          nps = parseInt(parts[i + 1], 10);
        } else if (parts[i] === 'pv') {
          for (let j = i + 1; j < parts.length; j++) {
            if (parts[j] && !parts[j].includes('=')) {
              pv.push(parts[j]);
            }
          }
          break;
        }
      }

      return {
        score,
        isMate,
        mateIn,
        depth,
        pv,
        bestMove: pv[0],
        nps,
      };
    } catch {
      return null;
    }
  }

  /** Set new game and clear hash tables */
  public newGame() {
    this.sendCommand('ucinewgame');
    this.sendCommand('isready');
  }

  /** Set difficulty level */
  public setDifficulty(difficulty: EngineDifficulty) {
    const config = DIFFICULTY_PRESETS[difficulty];
    this.sendCommand(`setoption name Skill Level value ${config.skillLevel}`);
  }

  /** Compute best computer move for given FEN */
  public findBestMove(
    fen: string,
    difficulty: EngineDifficulty,
    onBestMove: (move: string) => void,
    onEval?: (evalData: EngineEvaluation) => void
  ): () => void {
    const config = DIFFICULTY_PRESETS[difficulty];
    this.stop();

    this.onBestMoveCallback = onBestMove;
    this.onEvalCallback = onEval || null;

    this.setDifficulty(difficulty);
    this.sendCommand(`position fen ${fen}`);
    this.isSearching = true;

    // Search with depth & movetime limit
    this.sendCommand(`go depth ${config.depth} movetime ${config.maxThinkingMs}`);

    // Return cancellation function
    return () => this.stop();
  }

  /** Real-time continuous analysis of a single position */
  public startAnalysis(
    fen: string,
    onEval: (evalData: EngineEvaluation) => void,
    depth = 18
  ): () => void {
    this.stop();
    this.onEvalCallback = onEval;
    this.onBestMoveCallback = null;

    this.sendCommand(`setoption name Skill Level value 20`);
    this.sendCommand(`position fen ${fen}`);
    this.isSearching = true;
    this.sendCommand(`go depth ${depth}`);

    return () => this.stop();
  }

  /** Evaluate a single FEN statically with a quick search */
  public evaluatePosition(fen: string, depth = 10, maxMs = 500): Promise<EngineEvaluation> {
    return new Promise((resolve) => {
      let latestEval: EngineEvaluation = { score: 0, isMate: false, depth: 0 };

      const timeout = setTimeout(() => {
        this.stop();
        resolve(latestEval);
      }, maxMs);

      const cancel = this.startAnalysis(
        fen,
        (evalData) => {
          latestEval = evalData;
          if (evalData.depth >= depth) {
            clearTimeout(timeout);
            cancel();
            resolve(latestEval);
          }
        },
        depth
      );
    });
  }

  /** Analyze an entire sequence of game positions */
  public async analyzeGame(
    positions: { fenBefore: string; fenAfter: string; san: string; uci: string; color: 'w' | 'b'; moveNumber: number }[],
    onProgress?: (current: number, total: number) => void
  ): Promise<GameAnalysisReport> {
    const analyzedMoves: AnalyzedMove[] = [];
    const whiteStats = { best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 };
    const blackStats = { best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 };

    let prevEval = 0; // Starting position is approximately 0.0

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      if (onProgress) {
        onProgress(i + 1, positions.length);
      }

      // Quick evaluate the resulting position
      const evalResult = await this.evaluatePosition(pos.fenAfter, 8, 300);
      
      // Normalized score from perspective of the active mover
      const rawScore = evalResult.score;
      const moverEvalAfter = pos.color === 'w' ? rawScore : -rawScore;
      const moverEvalBefore = pos.color === 'w' ? prevEval : -prevEval;

      // Calculate centipawn drop (eval loss)
      const evalLoss = Math.max(0, moverEvalBefore - moverEvalAfter);

      // Classify move quality
      let quality: MoveQuality = 'good';
      if (evalLoss <= 15) {
        quality = 'best';
      } else if (evalLoss <= 35) {
        quality = 'excellent';
      } else if (evalLoss <= 70) {
        quality = 'good';
      } else if (evalLoss <= 160) {
        quality = 'inaccuracy';
      } else if (evalLoss <= 300) {
        quality = 'mistake';
      } else {
        quality = 'blunder';
      }

      if (pos.color === 'w') {
        whiteStats[quality]++;
      } else {
        blackStats[quality]++;
      }

      analyzedMoves.push({
        moveNumber: pos.moveNumber,
        color: pos.color,
        san: pos.san,
        uci: pos.uci,
        fenBefore: pos.fenBefore,
        fenAfter: pos.fenAfter,
        evalBefore: moverEvalBefore,
        evalAfter: moverEvalAfter,
        bestMove: evalResult.bestMove || pos.uci,
        quality,
        evalDelta: evalLoss,
      });

      prevEval = rawScore;
    }

    // Calculate accuracy percentage using weighted move error formula
    const calcAccuracy = (moves: AnalyzedMove[]) => {
      if (moves.length === 0) return 100;
      const totalScore = moves.reduce((sum, m) => {
        // Standard sigmoid mapping: 0 loss = 100%, 100cp loss = 75%, 300cp loss = 30%
        const moveAcc = 100 * (2 / (1 + Math.exp(m.evalDelta / 120)));
        return sum + moveAcc;
      }, 0);
      return Math.round(Math.min(100, Math.max(10, totalScore / moves.length)));
    };

    const whiteMoves = analyzedMoves.filter(m => m.color === 'w');
    const blackMoves = analyzedMoves.filter(m => m.color === 'b');

    return {
      whiteAccuracy: calcAccuracy(whiteMoves),
      blackAccuracy: calcAccuracy(blackMoves),
      moves: analyzedMoves,
      whiteStats,
      blackStats,
    };
  }

  /** Stop current search */
  public stop() {
    if (this.isSearching) {
      this.sendCommand('stop');
      this.isSearching = false;
    }
  }

  /** Clean up worker completely */
  public terminate() {
    this.stop();
    this.sendCommand('quit');
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Global engine singleton factory
let globalEngineInstance: ChessEngine | null = null;

export function getChessEngine(): ChessEngine {
  if (!globalEngineInstance) {
    globalEngineInstance = new ChessEngine();
  }
  return globalEngineInstance;
}
