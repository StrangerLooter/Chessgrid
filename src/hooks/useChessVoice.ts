import { useState, useEffect, useRef, useCallback } from 'react';
import type { Chess, Square, PieceSymbol, Color } from 'chess.js';
import type {
  VoiceState,
  VoiceListenMode,
  VoiceMovePreview,
  VoiceError,
  SpeechRecognitionProvider,
} from '../services/speech/types';
import { createSpeechRecognitionProvider } from '../services/speech/SpeechRecognitionService';
import { parseChessVoiceCommand } from '../services/speech/chessVoiceParser';
import { resolveLegalMoveFromCommand } from '../services/speech/legalMoveResolver';

export interface UseChessVoiceOptions {
  chess: Chess;
  fen: string;
  turn: Color;
  humanColor: Color;
  mode: string;
  isGameOver: boolean;
  isEngineThinking: boolean;
  makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  undoMove?: () => void;
  toggleFlip?: () => void;
  resign?: () => void;
}

export function useChessVoice({
  chess,
  fen,
  turn,
  humanColor,
  mode,
  isGameOver,
  isEngineThinking,
  makeMove,
  undoMove,
  toggleFlip,
  resign,
}: UseChessVoiceOptions) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<VoiceState>('OFF');
  const [listenMode, setListenMode] = useState<VoiceListenMode>('continuous');
  const [isPushToTalkActive, setIsPushToTalkActive] = useState<boolean>(false);

  const [transcript, setTranscript] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [previewMove, setPreviewMove] = useState<VoiceMovePreview | null>(null);
  const [ambiguousCandidates, setAmbiguousCandidates] = useState<VoiceMovePreview[]>([]);
  const [ambiguousSquares, setAmbiguousSquares] = useState<Square[]>([]);
  const [error, setError] = useState<VoiceError | null>(null);

  const providerRef = useRef<SpeechRecognitionProvider | null>(null);
  const lastProcessedTranscriptRef = useRef<string>('');
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Speech Provider lazily
  if (!providerRef.current && typeof window !== 'undefined') {
    providerRef.current = createSpeechRecognitionProvider();
  }

  const isSupported = providerRef.current ? providerRef.current.isSupported() : false;

  // Clear transient feedback helper
  const setTimedFeedback = useCallback((msg: string, durationMs = 4000) => {
    setFeedbackMessage(msg);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, durationMs);
  }, []);

  // Cancel current move preview
  const cancelPreview = useCallback(() => {
    setPreviewMove(null);
    setAmbiguousCandidates([]);
    setAmbiguousSquares([]);
    setStatus(enabled ? 'LISTENING' : 'OFF');
    setTimedFeedback('Move cancelled.');
  }, [enabled, setTimedFeedback]);

  // Execute confirmed candidate move
  const confirmMove = useCallback(() => {
    if (!previewMove) return false;

    // 1. Stale preview verification
    if (fen !== previewMove.previewFen || chess.fen() !== previewMove.previewFen) {
      cancelPreview();
      setTimedFeedback('Position changed. Please say your move again.');
      return false;
    }

    // 2. Turn and game validation
    if (isGameOver || isEngineThinking || turn !== humanColor) {
      cancelPreview();
      setTimedFeedback('Cannot execute move right now.');
      return false;
    }

    setStatus('EXECUTING');

    // 3. Authoritative move execution via existing makeMove
    const success = makeMove(previewMove.from, previewMove.to, previewMove.promotion);

    if (success) {
      setPreviewMove(null);
      setAmbiguousCandidates([]);
      setAmbiguousSquares([]);
      setStatus('READY');
      setTimedFeedback(`Played: ${previewMove.san}`);
      return true;
    } else {
      cancelPreview();
      setTimedFeedback('Move execution failed.');
      return false;
    }
  }, [previewMove, fen, chess, isGameOver, isEngineThinking, turn, humanColor, makeMove, cancelPreview, setTimedFeedback]);

  // Select an ambiguous candidate directly
  const selectCandidate = useCallback((candidate: VoiceMovePreview) => {
    setPreviewMove(candidate);
    setAmbiguousCandidates([]);
    setAmbiguousSquares([]);
    setStatus('AWAITING_CONFIRMATION');
    setTimedFeedback(`Selected: ${candidate.san}. Say "Confirm" or click to play.`);
  }, [setTimedFeedback]);

  // Handle Voice Resignation Confirmation
  const confirmResign = useCallback(() => {
    if (resign) {
      resign();
      setStatus('READY');
      setTimedFeedback('Game resigned.');
    }
  }, [resign, setTimedFeedback]);

  // Handle Speech Result
  const handleTranscript = useCallback((rawText: string, isFinal: boolean) => {
    if (!isFinal || !rawText.trim()) return;

    // Debounce duplicate transcripts
    if (rawText.trim().toLowerCase() === lastProcessedTranscriptRef.current.toLowerCase()) {
      return;
    }
    lastProcessedTranscriptRef.current = rawText.trim();
    setTranscript(rawText);

    // If waiting for resignation confirmation
    if (status === 'CONFIRMING_RESIGN') {
      const lower = rawText.toLowerCase();
      if (lower.includes('confirm') || lower.includes('yes') || lower.includes('resign')) {
        confirmResign();
      } else if (lower.includes('cancel') || lower.includes('no')) {
        setStatus('LISTENING');
        setTimedFeedback('Resignation cancelled.');
      }
      return;
    }

    // If awaiting confirmation of a move preview
    if (status === 'AWAITING_CONFIRMATION' && previewMove) {
      const lower = rawText.toLowerCase();
      if (lower.includes('confirm') || lower.includes('yes') || lower.includes('play')) {
        confirmMove();
        return;
      } else if (lower.includes('cancel') || lower.includes('no') || lower.includes('never mind')) {
        cancelPreview();
        return;
      }
    }

    // Parse chess command
    setStatus('PROCESSING');
    const command = parseChessVoiceCommand(rawText);

    if (!command) {
      // Unrelated natural language or unrecognizable input
      setStatus('LISTENING');
      setTimedFeedback(`Unrecognized command: "${rawText}"`);
      return;
    }

    // Handle special system commands
    if (command.type === 'confirm') {
      if (previewMove) {
        confirmMove();
      } else {
        setStatus('LISTENING');
      }
      return;
    }

    if (command.type === 'cancel') {
      cancelPreview();
      return;
    }

    if (command.type === 'undo') {
      if (undoMove && !isGameOver && !isEngineThinking) {
        undoMove();
        cancelPreview();
        setTimedFeedback('Move undone.');
      }
      return;
    }

    if (command.type === 'flip') {
      if (toggleFlip) {
        toggleFlip();
        setTimedFeedback('Board flipped.');
      }
      return;
    }

    if (command.type === 'resign') {
      setStatus('CONFIRMING_RESIGN');
      setTimedFeedback('Resign game? Say "Confirm" or "Cancel".');
      return;
    }

    // Resolve candidate move
    const resolution = resolveLegalMoveFromCommand(command, chess, humanColor);

    if (resolution.status === 'resolved') {
      setPreviewMove(resolution.preview);
      setAmbiguousCandidates([]);
      setAmbiguousSquares([]);
      setStatus('AWAITING_CONFIRMATION');
      setTimedFeedback(`Detected: ${resolution.preview.san}. Say "Confirm" or click to play.`);
    } else if (resolution.status === 'ambiguous') {
      setPreviewMove(null);
      setAmbiguousCandidates(resolution.candidates);
      setAmbiguousSquares(resolution.ambiguousSquares);
      setStatus('MOVE_DETECTED');
      setTimedFeedback(resolution.message);
    } else if (resolution.status === 'illegal') {
      setPreviewMove(null);
      setAmbiguousCandidates([]);
      setAmbiguousSquares([]);
      setStatus('LISTENING');
      setTimedFeedback(resolution.message);
    }
  }, [
    status,
    previewMove,
    confirmMove,
    cancelPreview,
    confirmResign,
    undoMove,
    toggleFlip,
    isGameOver,
    isEngineThinking,
    chess,
    humanColor,
    setTimedFeedback,
  ]);

  // ══════════════════════════════════════════════════════════
  // LIFECYCLE & PROVIDER WIRING
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) return;

    if (!provider.isSupported()) {
      setStatus('UNSUPPORTED');
      return;
    }

    const unregResult = provider.onResult((text, isFinal) => {
      handleTranscript(text, isFinal);
    });

    const unregError = provider.onError((err) => {
      setError(err);
      setStatus('ERROR');
      setTimedFeedback(err.message, 6000);
    });

    const unregStart = provider.onStart(() => {
      setStatus('LISTENING');
      setError(null);
    });

    const unregEnd = provider.onEnd(() => {
      if (enabled && listenMode === 'continuous' && !isEngineThinking && !isGameOver) {
        setStatus('READY');
      } else if (!enabled) {
        setStatus('OFF');
      }
    });

    return () => {
      unregResult();
      unregError();
      unregStart();
      unregEnd();
    };
  }, [enabled, listenMode, isEngineThinking, isGameOver, handleTranscript, setTimedFeedback]);

  // Engine Thinking & Turn Safety Loop
  useEffect(() => {
    const provider = providerRef.current;
    if (!provider || !enabled) return;

    if (isEngineThinking) {
      // Pause recognition while Stockfish calculates
      provider.stop();
      setStatus('PROCESSING');
      if (previewMove) cancelPreview();
    } else if (isGameOver) {
      provider.stop();
      setStatus('READY');
      if (previewMove) cancelPreview();
    } else if (turn === humanColor) {
      if (listenMode === 'continuous') {
        provider.setContinuous(true);
        provider.start();
        setStatus('LISTENING');
      } else {
        setStatus('READY');
      }
    } else {
      // Opponent's turn
      provider.stop();
      setStatus('READY');
    }
  }, [enabled, isEngineThinking, isGameOver, turn, humanColor, listenMode, previewMove, cancelPreview]);

  // Invalidate move preview if board state changed externally
  useEffect(() => {
    if (previewMove && previewMove.previewFen !== fen) {
      cancelPreview();
    }
  }, [fen, previewMove, cancelPreview]);

  // Disable voice control if switching to a non-vs-computer mode
  useEffect(() => {
    if (mode !== 'vs_computer' && mode !== 'vs-computer' && enabled) {
      setEnabled(false);
      setStatus('OFF');
      providerRef.current?.abort();
    }
  }, [mode, enabled]);

  // Push to Talk Handlers
  const startPushToTalk = useCallback(() => {
    if (!enabled || isEngineThinking || isGameOver || turn !== humanColor) return;
    const provider = providerRef.current;
    if (!provider) return;

    setIsPushToTalkActive(true);
    provider.setContinuous(false);
    provider.start();
    setStatus('LISTENING');
  }, [enabled, isEngineThinking, isGameOver, turn, humanColor]);

  const stopPushToTalk = useCallback(() => {
    if (!enabled) return;
    const provider = providerRef.current;
    if (!provider) return;

    setIsPushToTalkActive(false);
    provider.stop();
  }, [enabled]);

  // Toggle Voice Control ON/OFF
  const toggleEnabled = useCallback(() => {
    const next = !enabled;
    setEnabled(next);

    const provider = providerRef.current;
    if (!provider) return;

    if (next) {
      setError(null);
      if (listenMode === 'continuous' && !isEngineThinking && !isGameOver && turn === humanColor) {
        provider.setContinuous(true);
        provider.start();
        setStatus('LISTENING');
      } else {
        setStatus('READY');
      }
      setTimedFeedback('Voice Control enabled.');
    } else {
      provider.abort();
      setStatus('OFF');
      setPreviewMove(null);
      setAmbiguousCandidates([]);
      setAmbiguousSquares([]);
      setTranscript('');
      setTimedFeedback('Voice Control disabled.');
    }
  }, [enabled, listenMode, isEngineThinking, isGameOver, turn, humanColor, setTimedFeedback]);

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      providerRef.current?.abort();
    };
  }, []);

  return {
    isSupported,
    enabled,
    status,
    listenMode,
    isPushToTalkActive,
    transcript,
    feedbackMessage,
    previewMove,
    ambiguousCandidates,
    ambiguousSquares,
    error,
    toggleEnabled,
    setListenMode,
    startPushToTalk,
    stopPushToTalk,
    confirmMove,
    cancelPreview,
    selectCandidate,
    confirmResign,
  };
}
