import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, type Square, type Move, type PieceSymbol, type Color } from 'chess.js';
import { getChessEngine, type EngineDifficulty, type EngineEvaluation } from '../services/chessEngine';
import { soundEffects } from '../utils/soundEffects';

export type GameMode = 'vs_computer' | 'two_player_local' | 'tournament_match' | 'analysis';
export type PlayerColor = 'w' | 'b';
export type PlayerSideChoice = 'white' | 'black' | 'random';

export interface TimeControl {
  name: string;
  initialSeconds: number;
  incrementSeconds: number;
}

export const TIME_CONTROL_PRESETS: TimeControl[] = [
  { name: '1+0 Bullet', initialSeconds: 60, incrementSeconds: 0 },
  { name: '2+1 Bullet', initialSeconds: 120, incrementSeconds: 1 },
  { name: '3+0 Blitz', initialSeconds: 180, incrementSeconds: 0 },
  { name: '3+2 Blitz', initialSeconds: 180, incrementSeconds: 2 },
  { name: '5+0 Blitz', initialSeconds: 300, incrementSeconds: 0 },
  { name: '5+3 Blitz', initialSeconds: 300, incrementSeconds: 3 },
  { name: '10+0 Rapid', initialSeconds: 600, incrementSeconds: 0 },
  { name: '10+5 Rapid', initialSeconds: 600, incrementSeconds: 5 },
  { name: '15+10 Rapid', initialSeconds: 900, incrementSeconds: 10 },
  { name: '30+0 Classical', initialSeconds: 1800, incrementSeconds: 0 },
  { name: 'Unlimited (Casual)', initialSeconds: 0, incrementSeconds: 0 },
];

export interface SavedGameRecord {
  id: string;
  date: string;
  mode: GameMode;
  whiteName: string;
  blackName: string;
  winner: 'white' | 'black' | 'draw' | null;
  resultReason: string;
  pgn: string;
  fen: string;
  movesCount: number;
  timeControl: string;
}

export interface UseChessGameOptions {
  mode?: GameMode;
  difficulty?: EngineDifficulty;
  playerSide?: PlayerSideChoice;
  timeControl?: TimeControl;
  whitePlayerName?: string;
  blackPlayerName?: string;
  initialFen?: string;
  onGameOver?: (winner: 'white' | 'black' | 'draw', reason: string, pgn: string) => void;
}

export interface MoveRecord {
  moveNumber: number;
  color: Color;
  san: string;
  uci: string;
  from: Square;
  to: Square;
  captured?: PieceSymbol;
  fenBefore: string;
  fenAfter: string;
}

export function useChessGame(options: UseChessGameOptions = {}) {
  const {
    mode = 'vs_computer',
    difficulty = 'medium',
    playerSide = 'white',
    timeControl = TIME_CONTROL_PRESETS[7], // 10+5 Rapid default
    whitePlayerName = 'Player 1',
    blackPlayerName = mode === 'vs_computer' ? 'Stockfish Engine' : 'Player 2',
    initialFen,
    onGameOver,
  } = options;

  // Resolved player color for human in vs_computer mode
  const [humanColor, setHumanColor] = useState<Color>(() => {
    if (playerSide === 'random') {
      return Math.random() < 0.5 ? 'w' : 'b';
    }
    return playerSide === 'black' ? 'b' : 'w';
  });

  // Core chess state
  const chessRef = useRef<Chess>(new Chess(initialFen));
  const [fen, setFen] = useState<string>(() => chessRef.current.fen());
  const [turn, setTurn] = useState<Color>(() => chessRef.current.turn());
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [inCheck, setInCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: 'white' | 'black' | 'draw' | null;
    reason: string;
  } | null>(null);

  // Clocks
  const [whiteTimeMs, setWhiteTimeMs] = useState<number>(timeControl.initialSeconds * 1000);
  const [blackTimeMs, setBlackTimeMs] = useState<number>(timeControl.initialSeconds * 1000);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);
  const lastTickTimeRef = useRef<number | null>(null);

  // Engine state
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [currentEval, setCurrentEval] = useState<EngineEvaluation | null>(null);
  const engineRef = useRef(getChessEngine());
  const cancelEngineRef = useRef<(() => void) | null>(null);

  // Promotion pending state
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Board orientation
  const [isFlipped, setIsFlipped] = useState<boolean>(humanColor === 'b' && mode === 'vs_computer');

  // Captured pieces calculation
  const capturedPieces = useMemo(() => {
    const whiteCaptured: PieceSymbol[] = [];
    const blackCaptured: PieceSymbol[] = [];

    moveHistory.forEach(m => {
      if (m.captured) {
        // If white moved and captured, white captured black's piece
        if (m.color === 'w') {
          whiteCaptured.push(m.captured);
        } else {
          blackCaptured.push(m.captured);
        }
      }
    });

    // Material advantage calculation (p=1, n=3, b=3, r=5, q=9)
    const PIECE_VALUES: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    const whiteVal = whiteCaptured.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    const blackVal = blackCaptured.reduce((sum, p) => sum + (PIECE_VALUES[p] || 0), 0);
    const materialDiff = whiteVal - blackVal; // Positive: White has more captured material

    return {
      whiteCaptured,
      blackCaptured,
      whiteAdvantage: materialDiff > 0 ? materialDiff : 0,
      blackAdvantage: materialDiff < 0 ? Math.abs(materialDiff) : 0,
    };
  }, [moveHistory]);

  // Save game to localStorage
  const saveGameRecord = useCallback((winner: 'white' | 'black' | 'draw', reason: string) => {
    try {
      const pgn = chessRef.current.pgn();
      const currentFen = chessRef.current.fen();
      const record: SavedGameRecord = {
        id: `game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: new Date().toISOString(),
        mode,
        whiteName: whitePlayerName,
        blackName: blackPlayerName,
        winner,
        resultReason: reason,
        pgn,
        fen: currentFen,
        movesCount: chessRef.current.history().length,
        timeControl: timeControl.name,
      };

      const stored = localStorage.getItem('chessgrid_saved_games');
      const games: SavedGameRecord[] = stored ? JSON.parse(stored) : [];
      games.unshift(record);
      localStorage.setItem('chessgrid_saved_games', JSON.stringify(games.slice(0, 100)));
    } catch {
      // Ignore storage errors
    }
  }, [mode, whitePlayerName, blackPlayerName, timeControl.name]);

  // Handle Game Over
  const handleEndGame = useCallback((winner: 'white' | 'black' | 'draw', reason: string) => {
    setIsGameOver(true);
    setIsClockRunning(false);
    setGameResult({ winner, reason });
    soundEffects.playVictoryChime();

    saveGameRecord(winner, reason);

    if (onGameOver) {
      onGameOver(winner, reason, chessRef.current.pgn());
    }
  }, [onGameOver, saveGameRecord]);

  // Check game state conditions (Checkmate, Stalemate, 3-fold, 50-move, Insufficient Material)
  const checkGameConditions = useCallback(() => {
    const chess = chessRef.current;
    setInCheck(chess.inCheck());

    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'black' : 'white';
        handleEndGame(winner, `Checkmate! ${winner === 'white' ? 'White' : 'Black'} wins.`);
      } else if (chess.isStalemate()) {
        handleEndGame('draw', 'Draw by Stalemate.');
      } else if (chess.isThreefoldRepetition()) {
        handleEndGame('draw', 'Draw by Threefold Repetition.');
      } else if (chess.isInsufficientMaterial()) {
        handleEndGame('draw', 'Draw by Insufficient Material.');
      } else if (chess.isDraw()) {
        handleEndGame('draw', 'Draw by 50-move rule.');
      }
    }
  }, [handleEndGame]);

  // Make move execution
  const makeMove = useCallback((from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (isGameOver) return false;

    const chess = chessRef.current;
    const fenBefore = chess.fen();
    const activeColor = chess.turn();

    try {
      const moveResult: Move = chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (!moveResult) return false;

      // Play audio
      if (chess.inCheck()) {
        soundEffects.playCheckAlert();
      } else if (moveResult.captured) {
        soundEffects.playPieceMove();
      } else {
        soundEffects.playPieceMove();
      }

      // Add time increment
      if (timeControl.incrementSeconds > 0) {
        if (activeColor === 'w') {
          setWhiteTimeMs(prev => prev + timeControl.incrementSeconds * 1000);
        } else {
          setBlackTimeMs(prev => prev + timeControl.incrementSeconds * 1000);
        }
      }

      // Start clock on first move
      if (!isClockRunning && timeControl.initialSeconds > 0) {
        setIsClockRunning(true);
        lastTickTimeRef.current = performance.now();
      }

      const fenAfter = chess.fen();
      const uci = `${from}${to}${promotion || ''}`;

      setLastMove({ from, to });
      setFen(fenAfter);
      setTurn(chess.turn());
      setMoveHistory(prev => [
        ...prev,
        {
          moveNumber: Math.floor(prev.length / 2) + 1,
          color: activeColor,
          san: moveResult.san,
          uci,
          from,
          to,
          captured: moveResult.captured,
          fenBefore,
          fenAfter,
        },
      ]);

      checkGameConditions();
      return true;
    } catch {
      return false;
    }
  }, [isGameOver, timeControl, isClockRunning, checkGameConditions]);

  // Request bot move in vs_computer mode
  useEffect(() => {
    if (mode !== 'vs_computer' || isGameOver) return;

    const currentTurn = chessRef.current.turn();
    if (currentTurn !== humanColor) {
      setIsEngineThinking(true);

      const cancel = engineRef.current.findBestMove(
        chessRef.current.fen(),
        difficulty,
        (bestMoveUci) => {
          setIsEngineThinking(false);
          if (bestMoveUci && bestMoveUci.length >= 4) {
            const from = bestMoveUci.substring(0, 2) as Square;
            const to = bestMoveUci.substring(2, 4) as Square;
            const promo = bestMoveUci.length > 4 ? (bestMoveUci[4] as PieceSymbol) : undefined;
            makeMove(from, to, promo);
          }
        },
        (evalData) => {
          setCurrentEval(evalData);
        }
      );

      cancelEngineRef.current = cancel;
      return () => {
        if (cancelEngineRef.current) {
          cancelEngineRef.current();
        }
      };
    }
  }, [mode, turn, humanColor, difficulty, isGameOver, makeMove]);

  // Digital clock countdown loop
  useEffect(() => {
    if (!isClockRunning || isGameOver || timeControl.initialSeconds === 0) return;

    let animFrame: number;

    const tick = () => {
      const now = performance.now();
      if (lastTickTimeRef.current !== null) {
        const delta = now - lastTickTimeRef.current;
        const currentTurn = chessRef.current.turn();

        if (currentTurn === 'w') {
          setWhiteTimeMs(prev => {
            const remaining = Math.max(0, prev - delta);
            if (remaining <= 0) {
              soundEffects.playFlagFall();
              handleEndGame('black', 'White ran out of time! Black wins.');
            }
            return remaining;
          });
        } else {
          setBlackTimeMs(prev => {
            const remaining = Math.max(0, prev - delta);
            if (remaining <= 0) {
              soundEffects.playFlagFall();
              handleEndGame('white', 'Black ran out of time! White wins.');
            }
            return remaining;
          });
        }
      }

      lastTickTimeRef.current = now;
      animFrame = requestAnimationFrame(tick);
    };

    lastTickTimeRef.current = performance.now();
    animFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrame);
  }, [isClockRunning, isGameOver, timeControl.initialSeconds, handleEndGame]);

  // Get legal moves for a square
  const getLegalMoves = useCallback((square: Square): Square[] => {
    if (isGameOver) return [];
    const moves = chessRef.current.moves({ square, verbose: true });
    return moves.map(m => m.to as Square);
  }, [isGameOver]);

  // Execute move with automatic pawn promotion detection
  const handleSquareClickMove = useCallback((from: Square, to: Square): boolean => {
    const piece = chessRef.current.get(from);
    if (!piece) return false;

    // Check if move is pawn promotion
    const isPawn = piece.type === 'p';
    const isPromotionRank = (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');

    if (isPawn && isPromotionRank) {
      const legalMoves = chessRef.current.moves({ square: from, verbose: true });
      const isLegal = legalMoves.some(m => m.to === to);
      if (isLegal) {
        setPendingPromotion({ from, to });
        return true;
      }
    }

    return makeMove(from, to);
  }, [makeMove]);

  // Complete pending promotion
  const resolvePromotion = useCallback((pieceSymbol: PieceSymbol) => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, pieceSymbol);
      setPendingPromotion(null);
    }
  }, [pendingPromotion, makeMove]);

  // Takeback / Undo
  const undoMove = useCallback(() => {
    if (isGameOver || moveHistory.length === 0) return;

    if (cancelEngineRef.current) {
      cancelEngineRef.current();
    }
    setIsEngineThinking(false);

    const chess = chessRef.current;
    
    // In vs_computer mode, undo 2 plies if bot moved, or 1 ply if player's turn
    const pliesToUndo = mode === 'vs_computer' && chess.turn() === humanColor ? 2 : 1;
    
    for (let i = 0; i < pliesToUndo; i++) {
      chess.undo();
    }

    const newHistory = moveHistory.slice(0, Math.max(0, moveHistory.length - pliesToUndo));
    const lastRec = newHistory[newHistory.length - 1];

    setFen(chess.fen());
    setTurn(chess.turn());
    setMoveHistory(newHistory);
    setLastMove(lastRec ? { from: lastRec.from, to: lastRec.to } : null);
    setInCheck(chess.inCheck());
  }, [isGameOver, moveHistory, mode, humanColor]);

  // Resign
  const resign = useCallback((color?: Color) => {
    if (isGameOver) return;
    const resigningColor = color || (mode === 'vs_computer' ? humanColor : chessRef.current.turn());
    const winner = resigningColor === 'w' ? 'black' : 'white';
    handleEndGame(winner, `${resigningColor === 'w' ? 'White' : 'Black'} resigned.`);
  }, [isGameOver, mode, humanColor, handleEndGame]);

  // Offer Draw / Agree Draw
  const agreeDraw = useCallback(() => {
    if (isGameOver) return;
    handleEndGame('draw', 'Draw agreed by mutual consent.');
  }, [isGameOver, handleEndGame]);

  // Restart / Reset Game
  const restartGame = useCallback((newSide?: PlayerSideChoice) => {
    if (cancelEngineRef.current) {
      cancelEngineRef.current();
    }
    setIsEngineThinking(false);
    engineRef.current.newGame();

    const chosenSide = newSide || playerSide;
    const resolvedColor: Color = chosenSide === 'random' 
      ? (Math.random() < 0.5 ? 'w' : 'b') 
      : (chosenSide === 'black' ? 'b' : 'w');

    setHumanColor(resolvedColor);
    setIsFlipped(resolvedColor === 'b' && mode === 'vs_computer');

    chessRef.current = new Chess(initialFen);
    setFen(chessRef.current.fen());
    setTurn(chessRef.current.turn());
    setMoveHistory([]);
    setLastMove(null);
    setInCheck(false);
    setIsGameOver(false);
    setGameResult(null);
    setPendingPromotion(null);
    setWhiteTimeMs(timeControl.initialSeconds * 1000);
    setBlackTimeMs(timeControl.initialSeconds * 1000);
    setIsClockRunning(false);
    lastTickTimeRef.current = null;
    setCurrentEval(null);
  }, [playerSide, mode, initialFen, timeControl.initialSeconds]);

  // Flip board manually
  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  return {
    chess: chessRef.current,
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
    currentEval,
    capturedPieces,
    isFlipped,
    pendingPromotion,
    makeMove,
    handleSquareClickMove,
    resolvePromotion,
    getLegalMoves,
    undoMove,
    resign,
    agreeDraw,
    restartGame,
    toggleFlip,
    pgn: chessRef.current.pgn(),
  };
}
