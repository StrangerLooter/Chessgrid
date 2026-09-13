import type { PieceSymbol, Square } from 'chess.js';

export const PIECE_VOCABULARY: Record<string, PieceSymbol> = {
  knight: 'n',
  night: 'n',
  nite: 'n',
  horse: 'n',
  bishop: 'b',
  rook: 'r',
  rock: 'r',
  tower: 'r',
  castle: 'r',
  queen: 'q',
  king: 'k',
  pawn: 'p',
};

export const NUMBER_WORDS: Record<string, string> = {
  one: '1',
  two: '2',
  too: '2',
  three: '3',
  four: '4',
  for: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  ate: '8',
};

export const FILE_PHONETICS: Record<string, string> = {
  a: 'a',
  alpha: 'a',
  ay: 'a',
  eh: 'a',
  b: 'b',
  bravo: 'b',
  bee: 'b',
  be: 'b',
  c: 'c',
  charlie: 'c',
  see: 'c',
  sea: 'c',
  d: 'd',
  delta: 'd',
  dee: 'd',
  e: 'e',
  echo: 'e',
  f: 'f',
  foxtrot: 'f',
  fox: 'f',
  g: 'g',
  golf: 'g',
  gee: 'g',
  h: 'h',
  hotel: 'h',
  aitch: 'h',
};

export const CONFIRMATION_PHRASES = [
  'confirm',
  'yes',
  'play it',
  'make the move',
  'make move',
  'play',
  'go ahead',
  'sure',
  'correct',
];

export const CANCELLATION_PHRASES = [
  'cancel',
  'no',
  'never mind',
  'nevermind',
  'stop',
  'abort',
  'wrong',
  'discard',
];

export const UNDO_PHRASES = [
  'undo',
  'take back',
  'takeback',
  'undo move',
];

export const FLIP_PHRASES = [
  'flip',
  'flip board',
  'rotate board',
  'rotate',
];

export const RESIGN_PHRASES = [
  'resign',
  'i resign',
  'surrender',
  'give up',
];

/**
 * Validates if string is a valid algebraic chess square (a1 through h8)
 */
export function isValidSquare(sq: string): sq is Square {
  if (sq.length !== 2) return false;
  const file = sq[0];
  const rank = sq[1];
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}
