import { Chess, type Color } from 'chess.js';
import type { ChessCommand, MoveResolutionResult, VoiceMovePreview } from './types';

/**
 * Pure function to resolve a parsed ChessCommand against the active Chess position.
 * Detects legality, ambiguity, castling, captures, and special commands.
 */
export function resolveLegalMoveFromCommand(
  command: ChessCommand,
  chess: Chess,
  humanColor: Color
): MoveResolutionResult {
  // 1. Handle special system commands
  if (
    command.type === 'confirm' ||
    command.type === 'cancel' ||
    command.type === 'undo' ||
    command.type === 'flip' ||
    command.type === 'resign'
  ) {
    return {
      status: 'special_command',
      command: command.type,
    };
  }

  // Verify it is human's turn
  if (chess.turn() !== humanColor) {
    return {
      status: 'illegal',
      message: "It is not your turn to move.",
    };
  }

  const allLegalMoves = chess.moves({ verbose: true });
  const currentFen = chess.fen();

  // 2. Handle Castling Commands
  if (command.type === 'castle') {
    const isKingside = command.side === 'kingside';
    const targetSan = isKingside ? 'O-O' : 'O-O-O';

    const castleMove = allLegalMoves.find(
      m => m.san === targetSan || m.flags.includes(isKingside ? 'k' : 'q')
    );

    if (castleMove) {
      const preview: VoiceMovePreview = {
        from: castleMove.from,
        to: castleMove.to,
        san: castleMove.san,
        piece: 'k',
        color: humanColor,
        previewFen: currentFen,
      };
      return { status: 'resolved', preview };
    }

    return {
      status: 'illegal',
      message: `Castling ${command.side} is not legal in this position.`,
    };
  }

  // 3. Handle Regular Moves
  if (command.type === 'move') {
    let candidates = allLegalMoves.filter(m => m.to === command.to);

    // Filter by explicit source square if user said e.g. "knight g1 to f3"
    if (command.from) {
      candidates = candidates.filter(m => m.from === command.from);
    }

    // Filter by piece type if spoken
    if (command.piece) {
      candidates = candidates.filter(m => m.piece === command.piece);
    }

    // Filter by capture requirement if spoken (e.g. "takes c4")
    if (command.capture) {
      const captureCandidates = candidates.filter(m => !!m.captured || m.flags.includes('e'));
      if (captureCandidates.length === 0 && candidates.length > 0) {
        return {
          status: 'illegal',
          message: `Move to ${command.to} is not a capture.`,
        };
      }
      candidates = captureCandidates;
    }

    // Filter by promotion piece if spoken
    if (command.promotion) {
      candidates = candidates.filter(m => m.promotion === command.promotion);
    }

    // Evaluate Candidate Count
    if (candidates.length === 1) {
      const m = candidates[0];
      const preview: VoiceMovePreview = {
        from: m.from,
        to: m.to,
        san: m.san,
        piece: m.piece,
        color: humanColor,
        captured: m.captured,
        promotion: m.promotion,
        previewFen: currentFen,
      };
      return { status: 'resolved', preview };
    }

    if (candidates.length > 1) {
      const previews: VoiceMovePreview[] = candidates.map(m => ({
        from: m.from,
        to: m.to,
        san: m.san,
        piece: m.piece,
        color: humanColor,
        captured: m.captured,
        promotion: m.promotion,
        previewFen: currentFen,
      }));

      const pieceName = command.piece ? command.piece.toUpperCase() : 'Piece';
      return {
        status: 'ambiguous',
        message: `Ambiguous move. Multiple ${pieceName}s can reach ${command.to}.`,
        candidates: previews,
        ambiguousSquares: previews.map(p => p.from),
      };
    }

    // candidates.length === 0 -> Illegal Move
    const pieceDescription = command.piece
      ? command.piece === 'n' ? 'Knight' : command.piece.toUpperCase()
      : 'Move';

    return {
      status: 'illegal',
      message: `${pieceDescription} to ${command.to} is not legal in this position.`,
    };
  }

  return {
    status: 'unrecognized',
    rawTranscript: '',
    reason: 'Unrecognized chess command structure.',
  };
}
