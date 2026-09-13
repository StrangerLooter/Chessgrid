import type { PieceSymbol, Square } from 'chess.js';
import type { ChessCommand } from './types';
import {
  PIECE_VOCABULARY,
  NUMBER_WORDS,
  FILE_PHONETICS,
  CONFIRMATION_PHRASES,
  CANCELLATION_PHRASES,
  UNDO_PHRASES,
  FLIP_PHRASES,
  RESIGN_PHRASES,
  isValidSquare,
} from './chessVoiceVocabulary';

/**
 * Normalizes raw spoken transcript string into uniform tokens
 */
export function normalizeTranscript(text: string): string {
  let s = text.toLowerCase().trim();

  // Strip non-alphanumeric characters except basic spaces
  s = s.replace(/[^a-z0-9\s]/g, ' ');

  // Split into tokens
  let tokens = s.split(/\s+/).filter(Boolean);

  // Normalize phonetic files and number words
  tokens = tokens.map(t => {
    if (FILE_PHONETICS[t]) return FILE_PHONETICS[t];
    if (NUMBER_WORDS[t]) return NUMBER_WORDS[t];
    return t;
  });

  // Re-join tokens
  let joined = tokens.join(' ');

  // Compact separate file and rank into coordinate: e.g. "e 4" -> "e4"
  joined = joined.replace(/\b([a-h])\s+([1-8])\b/g, '$1$2');

  return joined;
}

/**
 * Pure Deterministic Chess Voice Command Parser
 *
 * Converts a spoken natural transcript into a structured ChessCommand AST.
 * Returns null if the phrase cannot be safely parsed as a valid chess intent.
 */
export function parseChessVoiceCommand(rawTranscript: string): ChessCommand | null {
  if (!rawTranscript || typeof rawTranscript !== 'string') return null;

  const normalized = normalizeTranscript(rawTranscript);
  if (!normalized) return null;

  // ══════════════════════════════════════════════════════════
  // 1. CONFIRMATION / CANCELLATION COMMANDS
  // ══════════════════════════════════════════════════════════
  for (const phrase of CONFIRMATION_PHRASES) {
    if (normalized === phrase || normalized.startsWith(phrase + ' ') || normalized.endsWith(' ' + phrase)) {
      return { type: 'confirm' };
    }
  }

  for (const phrase of CANCELLATION_PHRASES) {
    if (normalized === phrase || normalized.startsWith(phrase + ' ') || normalized.endsWith(' ' + phrase)) {
      return { type: 'cancel' };
    }
  }

  // ══════════════════════════════════════════════════════════
  // 2. SPECIAL SYSTEM COMMANDS
  // ══════════════════════════════════════════════════════════
  for (const phrase of UNDO_PHRASES) {
    if (normalized === phrase || normalized.includes(phrase)) {
      return { type: 'undo' };
    }
  }

  for (const phrase of FLIP_PHRASES) {
    if (normalized === phrase || normalized.includes(phrase)) {
      return { type: 'flip' };
    }
  }

  for (const phrase of RESIGN_PHRASES) {
    if (normalized === phrase || normalized.includes(phrase)) {
      return { type: 'resign' };
    }
  }

  // ══════════════════════════════════════════════════════════
  // 3. CASTLING COMMANDS
  // ══════════════════════════════════════════════════════════
  if (
    normalized.includes('castle kingside') ||
    normalized.includes('castles kingside') ||
    normalized.includes('short castle') ||
    normalized.includes('castle right') ||
    normalized === '0 0' ||
    normalized === 'o o'
  ) {
    return { type: 'castle', side: 'kingside' };
  }

  if (
    normalized.includes('castle queenside') ||
    normalized.includes('castles queenside') ||
    normalized.includes('long castle') ||
    normalized.includes('castle left') ||
    normalized === '0 0 0' ||
    normalized === 'o o o'
  ) {
    return { type: 'castle', side: 'queenside' };
  }

  // ══════════════════════════════════════════════════════════
  // 4. CHESS MOVE PARSING
  // ══════════════════════════════════════════════════════════
  const tokens = normalized.split(/\s+/);

  // Check for capture indication
  const capture =
    tokens.includes('takes') ||
    tokens.includes('take') ||
    tokens.includes('captures') ||
    tokens.includes('capture');

  // Detect piece if specified
  let piece: PieceSymbol | undefined = undefined;
  for (const token of tokens) {
    if (PIECE_VOCABULARY[token]) {
      piece = PIECE_VOCABULARY[token];
      break;
    }
  }

  // Detect promotion piece if mentioned (e.g. "promote to queen", "to e8 queen")
  let promotion: PieceSymbol | undefined = undefined;
  const promoIdx = tokens.findIndex(t => t === 'promote' || t === 'promotes' || t === 'promotion');
  if (promoIdx !== -1 && promoIdx < tokens.length - 1) {
    const nextPiece = tokens[promoIdx + 1] === 'to' ? tokens[promoIdx + 2] : tokens[promoIdx + 1];
    if (nextPiece && PIECE_VOCABULARY[nextPiece]) {
      promotion = PIECE_VOCABULARY[nextPiece];
    }
  } else {
    // Check if the last word is a promotion piece after a destination rank 8 or 1
    const lastToken = tokens[tokens.length - 1];
    if (PIECE_VOCABULARY[lastToken] && ['q', 'r', 'b', 'n'].includes(PIECE_VOCABULARY[lastToken])) {
      // Only treat as promotion if preceded by a rank 8 or 1 coordinate
      const secondLastToken = tokens[tokens.length - 2];
      if (secondLastToken && isValidSquare(secondLastToken) && (secondLastToken[1] === '8' || secondLastToken[1] === '1')) {
        promotion = PIECE_VOCABULARY[lastToken];
      }
    }
  }

  // Find all coordinates in tokens (e.g. ["e2", "e4"] or ["f3"])
  const foundSquares: Square[] = [];
  for (const token of tokens) {
    if (isValidSquare(token)) {
      foundSquares.push(token);
    }
  }

  if (foundSquares.length === 0) {
    // No valid destination square found in speech (e.g. unrelated chat)
    return null;
  }

  let from: Square | undefined = undefined;
  let to: Square;

  if (foundSquares.length >= 2) {
    from = foundSquares[0];
    to = foundSquares[1];
  } else {
    to = foundSquares[0];
  }

  return {
    type: 'move',
    piece,
    from,
    to,
    capture,
    promotion,
  };
}
