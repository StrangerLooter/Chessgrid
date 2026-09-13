import { Chess } from 'chess.js';
import { parseChessVoiceCommand } from '../src/services/speech/chessVoiceParser';
import { resolveLegalMoveFromCommand } from '../src/services/speech/legalMoveResolver';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${detail ? ` (${detail})` : ''}`);
  }
}

console.log('\n======================================================');
console.log('CHESSGRID VOICE CONTROL SYSTEM — COMPREHENSIVE TEST SUITE');
console.log('======================================================\n');

// -----------------------------------------------------------
// 1. CHESS VOICE PARSER TESTS
// -----------------------------------------------------------
console.log('TEST SUITE 1: Voice Command Parser (Transcripts -> AST)');

// 1.1 Simple moves
{
  const cmd1 = parseChessVoiceCommand('e4');
  assert(cmd1?.type === 'move' && cmd1.to === 'e4', 'Parses "e4" with destination e4');

  const cmdPawn = parseChessVoiceCommand('pawn to e4');
  assert(cmdPawn?.type === 'move' && cmdPawn.to === 'e4' && cmdPawn.piece === 'p', 'Parses "pawn to e4" with piece p');

  const cmd2 = parseChessVoiceCommand('knight to f3');
  assert(cmd2?.type === 'move' && cmd2.to === 'f3' && cmd2.piece === 'n', 'Parses "knight to f3"');

  const cmd3 = parseChessVoiceCommand('horse to f3');
  assert(cmd3?.type === 'move' && cmd3.to === 'f3' && cmd3.piece === 'n', 'Parses "horse to f3" as knight');

  const cmd4 = parseChessVoiceCommand('bishop to c4');
  assert(cmd4?.type === 'move' && cmd4.to === 'c4' && cmd4.piece === 'b', 'Parses "bishop to c4"');

  const cmd5 = parseChessVoiceCommand('queen to d8');
  assert(cmd5?.type === 'move' && cmd5.to === 'd8' && cmd5.piece === 'q', 'Parses "queen to d8"');

  const cmd6 = parseChessVoiceCommand('king to e2');
  assert(cmd6?.type === 'move' && cmd6.to === 'e2' && cmd6.piece === 'k', 'Parses "king to e2"');
}

// 1.2 Coordinate-to-coordinate moves
{
  const cmd = parseChessVoiceCommand('e2 to e4');
  assert(cmd?.type === 'move' && cmd.from === 'e2' && cmd.to === 'e4', 'Parses "e2 to e4"');

  const cmdNoTo = parseChessVoiceCommand('e2 e4');
  assert(cmdNoTo?.type === 'move' && cmdNoTo.from === 'e2' && cmdNoTo.to === 'e4', 'Parses "e2 e4" without "to"');
}

// 1.3 Phonetic / NATO coordinates
{
  const cmdNato = parseChessVoiceCommand('echo two to echo four');
  assert(cmdNato?.type === 'move' && cmdNato.from === 'e2' && cmdNato.to === 'e4', 'Parses NATO "echo two to echo four"');

  const cmdAlpha = parseChessVoiceCommand('alpha two to alpha four');
  assert(cmdAlpha?.type === 'move' && cmdAlpha.from === 'a2' && cmdAlpha.to === 'a4', 'Parses NATO "alpha two to alpha four"');

  const cmdFoxtrot = parseChessVoiceCommand('knight to foxtrot three');
  assert(cmdFoxtrot?.type === 'move' && cmdFoxtrot.piece === 'n' && cmdFoxtrot.to === 'f3', 'Parses NATO "foxtrot three" as f3');
}

// 1.4 Captures
{
  const cmd1 = parseChessVoiceCommand('knight takes c6');
  assert(cmd1?.type === 'move' && cmd1.piece === 'n' && cmd1.to === 'c6' && cmd1.capture === true, 'Parses "knight takes c6"');

  const cmd2 = parseChessVoiceCommand('bishop captures on d7');
  assert(cmd2?.type === 'move' && cmd2.piece === 'b' && cmd2.to === 'd7' && cmd2.capture === true, 'Parses "bishop captures on d7"');

  const cmd3 = parseChessVoiceCommand('takes on e4');
  assert(cmd3?.type === 'move' && cmd3.to === 'e4' && cmd3.capture === true, 'Parses "takes on e4"');
}

// 1.5 Castling
{
  const cmd1 = parseChessVoiceCommand('castle kingside');
  assert(cmd1?.type === 'castle' && cmd1.side === 'kingside', 'Parses "castle kingside"');

  const cmd2 = parseChessVoiceCommand('short castle');
  assert(cmd2?.type === 'castle' && cmd2.side === 'kingside', 'Parses "short castle"');

  const cmd3 = parseChessVoiceCommand('castle queenside');
  assert(cmd3?.type === 'castle' && cmd3.side === 'queenside', 'Parses "castle queenside"');

  const cmd4 = parseChessVoiceCommand('long castle');
  assert(cmd4?.type === 'castle' && cmd4.side === 'queenside', 'Parses "long castle"');
}

// 1.6 Pawn Promotion
{
  const cmd1 = parseChessVoiceCommand('pawn to e8 queen');
  assert(cmd1?.type === 'move' && cmd1.to === 'e8' && cmd1.promotion === 'q', 'Parses "pawn to e8 queen"');

  const cmd2 = parseChessVoiceCommand('e7 to e8 promote to knight');
  assert(cmd2?.type === 'move' && cmd2.from === 'e7' && cmd2.to === 'e8' && cmd2.promotion === 'n', 'Parses promotion to knight');
}

// 1.7 Voice Actions
{
  const cmdConfirm = parseChessVoiceCommand('confirm');
  assert(cmdConfirm?.type === 'confirm', 'Parses "confirm" action');

  const cmdYes = parseChessVoiceCommand('yes');
  assert(cmdYes?.type === 'confirm', 'Parses "yes" as confirm action');

  const cmdCancel = parseChessVoiceCommand('cancel');
  assert(cmdCancel?.type === 'cancel', 'Parses "cancel" action');

  const cmdNo = parseChessVoiceCommand('no');
  assert(cmdNo?.type === 'cancel', 'Parses "no" as cancel action');

  const cmdUndo = parseChessVoiceCommand('undo move');
  assert(cmdUndo?.type === 'undo', 'Parses "undo move" action');

  const cmdFlip = parseChessVoiceCommand('flip board');
  assert(cmdFlip?.type === 'flip', 'Parses "flip board" action');

  const cmdResign = parseChessVoiceCommand('resign game');
  assert(cmdResign?.type === 'resign', 'Parses "resign game" action');
}

// 1.8 Noise & Non-Chess Rejection
{
  const noise1 = parseChessVoiceCommand('what is the weather today in Boston');
  assert(noise1 === null, 'Rejects conversational noise: "what is the weather today"');

  const noise2 = parseChessVoiceCommand('hey how are you doing');
  assert(noise2 === null, 'Rejects casual greeting: "hey how are you doing"');

  const noise3 = parseChessVoiceCommand('please pass the salt');
  assert(noise3 === null, 'Rejects random conversation: "please pass the salt"');

  const noise4 = parseChessVoiceCommand('good morning everyone');
  assert(noise4 === null, 'Rejects "good morning everyone"');
}

// -----------------------------------------------------------
// 2. LEGAL MOVE RESOLVER & AMBIGUITY TESTS
// -----------------------------------------------------------
console.log('\nTEST SUITE 2: Legal Move Resolver (Chess Position Validation)');

// 2.1 Starting Position Legal Moves
{
  const chess = new Chess();
  const cmdE4 = parseChessVoiceCommand('e4')!;
  const resE4 = resolveLegalMoveFromCommand(cmdE4, chess, 'w');
  assert(resE4.status === 'resolved' && resE4.preview?.from === 'e2' && resE4.preview?.to === 'e4' && resE4.preview?.san === 'e4', 'Resolves starting move "e4" to e2->e4');

  const cmdNf3 = parseChessVoiceCommand('knight to f3')!;
  const resNf3 = resolveLegalMoveFromCommand(cmdNf3, chess, 'w');
  assert(resNf3.status === 'resolved' && resNf3.preview?.from === 'g1' && resNf3.preview?.to === 'f3' && resNf3.preview?.san === 'Nf3', 'Resolves starting move "knight to f3" to g1->f3');

  const cmdNc3 = parseChessVoiceCommand('knight to c3')!;
  const resNc3 = resolveLegalMoveFromCommand(cmdNc3, chess, 'w');
  assert(resNc3.status === 'resolved' && resNc3.preview?.from === 'b1' && resNc3.preview?.to === 'c3' && resNc3.preview?.san === 'Nc3', 'Resolves starting move "knight to c3" to b1->c3');
}

// 2.2 Illegal Move Detection
{
  const chess = new Chess();
  const cmdIllegalRook = parseChessVoiceCommand('rook to e4')!;
  const resIllegalRook = resolveLegalMoveFromCommand(cmdIllegalRook, chess, 'w');
  assert(resIllegalRook.status === 'illegal', 'Detects illegal move "rook to e4" on move 1');

  const cmdIllegalCastle = parseChessVoiceCommand('castle kingside')!;
  const resIllegalCastle = resolveLegalMoveFromCommand(cmdIllegalCastle, chess, 'w');
  assert(resIllegalCastle.status === 'illegal', 'Detects illegal castling on move 1 (pieces between)');
}

// 2.3 Wrong Turn Rejection
{
  const chess = new Chess();
  const cmdE4 = parseChessVoiceCommand('e4')!;
  // Player is black, but it is white's turn
  const resWrongTurn = resolveLegalMoveFromCommand(cmdE4, chess, 'b');
  assert(resWrongTurn.status === 'illegal' && resWrongTurn.message.includes('not your turn'), 'Rejects move when player color does not match turn');
}

// 2.4 Ambiguity Detection (Two pieces can move to target square)
{
  // Position with White knights on b1 and f3, empty d2 square (PPP1PPPP)
  // Both b1 and f3 can jump to d2!
  const chess = new Chess('r1bqkbnr/pppppppp/8/8/8/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 1');
  const cmdAmbiguous = parseChessVoiceCommand('knight to d2')!;
  const resAmbiguous = resolveLegalMoveFromCommand(cmdAmbiguous, chess, 'w');

  assert(
    resAmbiguous.status === 'ambiguous' &&
    resAmbiguous.candidates?.length === 2 &&
    resAmbiguous.candidates.some(c => c.from === 'f3' && c.to === 'd2') &&
    resAmbiguous.candidates.some(c => c.from === 'b1' && c.to === 'd2'),
    'Detects ambiguous move when two knights can jump to d2'
  );

  // Now disambiguate by specifying source square
  const cmdDisambiguated = parseChessVoiceCommand('knight from f3 to d2')!;
  const resDisambiguated = resolveLegalMoveFromCommand(cmdDisambiguated, chess, 'w');
  assert(
    resDisambiguated.status === 'resolved' &&
    resDisambiguated.preview?.from === 'f3' &&
    resDisambiguated.preview?.to === 'd2',
    'Successfully disambiguates move with explicit source square "knight from f3 to d2"'
  );
}

// 2.5 Castling Execution Resolution
{
  // Custom FEN where White can castle kingside
  // r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4
  const chess = new Chess('r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4');
  const cmdCastle = parseChessVoiceCommand('castle kingside')!;
  const resCastle = resolveLegalMoveFromCommand(cmdCastle, chess, 'w');

  assert(
    resCastle.status === 'resolved' &&
    resCastle.preview?.from === 'e1' &&
    resCastle.preview?.to === 'g1' &&
    resCastle.preview?.san === 'O-O',
    'Resolves legal kingside castling to e1->g1 (O-O)'
  );
}

// 2.6 Action Resolution
{
  const chess = new Chess();
  const cmdResign = parseChessVoiceCommand('resign')!;
  const resResign = resolveLegalMoveFromCommand(cmdResign, chess, 'w');
  assert(resResign.status === 'special_command' && resResign.command === 'resign', 'Resolves resign special command');

  const cmdConfirm = parseChessVoiceCommand('confirm')!;
  const resConfirm = resolveLegalMoveFromCommand(cmdConfirm, chess, 'w');
  assert(resConfirm.status === 'special_command' && resConfirm.command === 'confirm', 'Resolves confirm special command');

  const cmdCancel = parseChessVoiceCommand('cancel')!;
  const resCancel = resolveLegalMoveFromCommand(cmdCancel, chess, 'w');
  assert(resCancel.status === 'special_command' && resCancel.command === 'cancel', 'Resolves cancel special command');
}

// -----------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------
console.log('\n------------------------------------------------------');
console.log(`RESULTS: ${passedTests}/${totalTests} tests passed (${failedTests} failures)`);
console.log('------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
