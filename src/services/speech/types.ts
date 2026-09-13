import type { Square, PieceSymbol, Color } from 'chess.js';

/**
 * Deterministic Voice System States
 */
export type VoiceState =
  | 'OFF'
  | 'READY'
  | 'LISTENING'
  | 'PROCESSING'
  | 'MOVE_DETECTED'
  | 'AWAITING_CONFIRMATION'
  | 'CONFIRMING_RESIGN'
  | 'EXECUTING'
  | 'ERROR'
  | 'UNSUPPORTED';

/**
 * Listening Modes:
 * - 'continuous': Microphone remains active while Voice Control is ON
 * - 'push_to_talk': Microphone listens only while the user activates/holds the push-to-talk button
 */
export type VoiceListenMode = 'continuous' | 'push_to_talk';

/**
 * Structured Chess Voice Commands parsed from spoken transcript
 */
export type ChessCommand =
  | {
      type: 'move';
      piece?: PieceSymbol;
      from?: Square;
      to: Square;
      capture?: boolean;
      promotion?: PieceSymbol;
    }
  | {
      type: 'castle';
      side: 'kingside' | 'queenside';
    }
  | {
      type: 'confirm';
    }
  | {
      type: 'cancel';
    }
  | {
      type: 'undo';
    }
  | {
      type: 'flip';
    }
  | {
      type: 'resign';
    };

/**
 * Candidate Visual Move Preview
 */
export interface VoiceMovePreview {
  from: Square;
  to: Square;
  san: string;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  previewFen: string;
}

/**
 * Move Resolution Results
 */
export type MoveResolutionResult =
  | {
      status: 'resolved';
      preview: VoiceMovePreview;
    }
  | {
      status: 'ambiguous';
      message: string;
      candidates: VoiceMovePreview[];
      ambiguousSquares: Square[];
    }
  | {
      status: 'illegal';
      message: string;
    }
  | {
      status: 'special_command';
      command: 'confirm' | 'cancel' | 'undo' | 'flip' | 'resign';
    }
  | {
      status: 'unrecognized';
      rawTranscript: string;
      reason: string;
    };

/**
 * Voice Error Information
 */
export interface VoiceError {
  code:
    | 'not_supported'
    | 'permission_denied'
    | 'no_microphone'
    | 'network_error'
    | 'aborted'
    | 'audio_capture'
    | 'unknown';
  message: string;
  isFatal: boolean;
}

/**
 * Abstract Speech Recognition Provider Interface
 *
 * Allows decoupling ChessGrid from specific browser APIs or future cloud STT services.
 */
export interface SpeechRecognitionProvider {
  /** Check if the current environment supports this speech provider */
  isSupported(): boolean;
  /** Start listening for speech */
  start(): void;
  /** Gracefully stop listening */
  stop(): void;
  /** Immediately abort recognition */
  abort(): void;
  /** Set listening mode */
  setContinuous(continuous: boolean): void;
  /** Register callback for transcript results */
  onResult(callback: (transcript: string, isFinal: boolean, confidence: number) => void): () => void;
  /** Register callback for errors */
  onError(callback: (error: VoiceError) => void): () => void;
  /** Register callback when recognition starts */
  onStart(callback: () => void): () => void;
  /** Register callback when recognition ends */
  onEnd(callback: () => void): () => void;
}
