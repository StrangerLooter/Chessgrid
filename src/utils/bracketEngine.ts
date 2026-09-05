import type { Match, Player, TournamentSize, TimeControl, ResultType, TieBreakInfo } from '../types/tournament';

export function getRoundNames(totalPlayers: TournamentSize): string[] {
  const rounds: string[] = [];
  let currentCount: number = totalPlayers;

  while (currentCount >= 2) {
    if (currentCount === 2) {
      rounds.push('Final');
    } else if (currentCount === 4) {
      rounds.push('Semifinal');
    } else if (currentCount === 8) {
      rounds.push('Quarterfinal');
    } else {
      rounds.push(`Round of ${currentCount}`);
    }
    currentCount = Math.floor(currentCount / 2);
  }

  return rounds;
}

export function generateInitialMatches(
  totalPlayers: TournamentSize,
  defaultTimeControl: TimeControl,
  pairedPlayers?: { white: Player | null; black: Player | null }[]
): Match[] {
  const roundNames = getRoundNames(totalPlayers);
  const totalRounds = roundNames.length;
  const matches: Match[] = [];

  // Create matches round by round from round 0 to final
  const roundMatchesMap: { [roundIndex: number]: Match[] } = {};

  let globalMatchCounter = 1;

  for (let r = 0; r < totalRounds; r++) {
    const roundName = roundNames[r];
    const matchCount = Math.pow(2, totalRounds - 1 - r);
    roundMatchesMap[r] = [];

    for (let m = 0; m < matchCount; m++) {
      const matchId = `match-r${r}-m${m + 1}`;
      const defaultTimeMs = defaultTimeControl.initialMinutes * 60 * 1000;

      let whiteId: string | null = null;
      let blackId: string | null = null;

      // First round can have paired players if provided
      if (r === 0 && pairedPlayers && pairedPlayers[m]) {
        const pair = pairedPlayers[m];
        whiteId = pair?.white ? pair.white.id : null;
        blackId = pair?.black ? pair.black.id : null;
      }

      const match: Match = {
        id: matchId,
        roundIndex: r,
        roundName,
        matchNumber: globalMatchCounter++,
        boardNumber: r === 0 ? m + 1 : null,
        whitePlayerId: whiteId,
        blackPlayerId: blackId,
        winnerPlayerId: null,
        loserPlayerId: null,
        status: (whiteId && blackId) ? 'ready' : 'upcoming',
        timeControl: { ...defaultTimeControl },
        whiteTimeRemainingMs: defaultTimeMs,
        blackTimeRemainingMs: defaultTimeMs,
        isTimerRunning: false,
        activeClock: null,
        resultType: null,
        notes: '',
      };

      roundMatchesMap[r].push(match);
      matches.push(match);
    }
  }

  // Link each match to its next match and slot
  for (let r = 0; r < totalRounds - 1; r++) {
    const currentRoundMatches = roundMatchesMap[r];
    const nextRoundMatches = roundMatchesMap[r + 1];

    for (let m = 0; m < currentRoundMatches.length; m++) {
      const nextMatchIndex = Math.floor(m / 2);
      const slot: 'white' | 'black' = m % 2 === 0 ? 'white' : 'black';
      const targetMatch = nextRoundMatches[nextMatchIndex];

      if (targetMatch) {
        currentRoundMatches[m].nextMatchId = targetMatch.id;
        currentRoundMatches[m].nextMatchSlot = slot;

        // Also track previous match link on the destination match
        if (!targetMatch.previousMatchIds) {
          targetMatch.previousMatchIds = {};
        }
        if (slot === 'white') {
          targetMatch.previousMatchIds.whiteFromMatchId = currentRoundMatches[m].id;
        } else {
          targetMatch.previousMatchIds.blackFromMatchId = currentRoundMatches[m].id;
        }
      }
    }
  }

  return matches;
}

// Random shuffle using Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateRandomPairings(players: Player[]): { white: Player | null; black: Player | null }[] {
  const shuffled = shuffleArray(players);
  const pairings: { white: Player | null; black: Player | null }[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    pairings.push({
      white: shuffled[i] || null,
      black: shuffled[i + 1] || null,
    });
  }

  return pairings;
}

// Seeded pairing (1 vs N, 2 vs N-1, etc.)
export function generateSeededPairings(players: Player[]): { white: Player | null; black: Player | null }[] {
  const sorted = [...players].sort((a, b) => a.seed - b.seed);
  const pairings: { white: Player | null; black: Player | null }[] = [];
  const n = sorted.length;

  for (let i = 0; i < n / 2; i++) {
    pairings.push({
      white: sorted[i] || null,
      black: sorted[n - 1 - i] || null,
    });
  }

  return pairings;
}

// Result advancement and bracket propagation
export function applyMatchResult(
  matches: Match[],
  players: Player[],
  matchId: string,
  resultType: ResultType,
  resultDetails?: string,
  tieBreakInfo?: TieBreakInfo
): { updatedMatches: Match[]; updatedPlayers: Player[]; winner: Player | null; loser: Player | null } {
  const matchesMap = new Map(matches.map(m => [m.id, { ...m }]));
  const playersMap = new Map(players.map(p => [p.id, { ...p }]));

  const match = matchesMap.get(matchId);
  if (!match || !match.whitePlayerId || !match.blackPlayerId) {
    return { updatedMatches: matches, updatedPlayers: players, winner: null, loser: null };
  }

  const whitePlayer = playersMap.get(match.whitePlayerId);
  const blackPlayer = playersMap.get(match.blackPlayerId);

  if (!whitePlayer || !blackPlayer) {
    return { updatedMatches: matches, updatedPlayers: players, winner: null, loser: null };
  }

  let winnerId: string | null = null;
  let loserId: string | null = null;

  if (resultType === 'white_win' || resultType === 'walkover_white') {
    winnerId = whitePlayer.id;
    loserId = blackPlayer.id;
  } else if (resultType === 'black_win' || resultType === 'walkover_black') {
    winnerId = blackPlayer.id;
    loserId = whitePlayer.id;
  } else if (resultType === 'draw' && tieBreakInfo) {
    winnerId = tieBreakInfo.winnerId;
    loserId = tieBreakInfo.winnerId === whitePlayer.id ? blackPlayer.id : whitePlayer.id;
  } else if (resultType === 'disqualification') {
    // If one is disqualified, the other wins
    winnerId = tieBreakInfo?.winnerId || whitePlayer.id;
    loserId = winnerId === whitePlayer.id ? blackPlayer.id : whitePlayer.id;
  }

  if (!winnerId || !loserId) {
    return { updatedMatches: matches, updatedPlayers: players, winner: null, loser: null };
  }

  const winner = playersMap.get(winnerId)!;
  const loser = playersMap.get(loserId)!;

  // Update match object
  match.status = 'completed';
  match.isTimerRunning = false;
  match.activeClock = null;
  match.winnerPlayerId = winner.id;
  match.loserPlayerId = loser.id;
  match.resultType = resultType;
  match.resultDetails = resultDetails || '';
  match.tieBreakInfo = tieBreakInfo;
  match.endTime = new Date().toISOString();

  // Update Player Stats
  winner.matchesPlayed += 1;
  winner.wins += 1;
  winner.score += 1;

  loser.matchesPlayed += 1;
  loser.losses += 1;
  loser.status = 'eliminated';
  loser.eliminatedInRound = match.roundName;
  loser.eliminatedByPlayerId = winner.id;
  loser.eliminatedAt = new Date().toISOString();

  // If this is the Final match, mark winner as Champion!
  if (match.roundName === 'Final' || !match.nextMatchId) {
    winner.status = 'champion';
  } else if (match.nextMatchId && match.nextMatchSlot) {
    // Advance winner into next match
    const nextMatch = matchesMap.get(match.nextMatchId);
    if (nextMatch) {
      if (match.nextMatchSlot === 'white') {
        nextMatch.whitePlayerId = winner.id;
      } else {
        nextMatch.blackPlayerId = winner.id;
      }

      // Update next round name on winner
      winner.currentRound = nextMatch.roundName;

      // If both slots filled, mark next match as ready
      if (nextMatch.whitePlayerId && nextMatch.blackPlayerId) {
        if (nextMatch.status === 'upcoming') {
          nextMatch.status = 'ready';
        }
      }
    }
  }

  return {
    updatedMatches: Array.from(matchesMap.values()),
    updatedPlayers: Array.from(playersMap.values()),
    winner,
    loser,
  };
}

// Automatic Bracket Repair Algorithm for Result Undo & Result Edits
export function repairBracketAfterResultChange(
  matches: Match[],
  players: Player[],
  targetMatchId: string,
  newResultType: ResultType,
  newTieBreakInfo?: TieBreakInfo
): { updatedMatches: Match[]; updatedPlayers: Player[] } {
  const matchesMap = new Map(matches.map(m => [m.id, { ...m }]));
  const playersMap = new Map(players.map(p => [p.id, { ...p }]));

  const targetMatch = matchesMap.get(targetMatchId);
  if (!targetMatch) return { updatedMatches: matches, updatedPlayers: players };

  const oldWinnerId = targetMatch.winnerPlayerId;
  const oldLoserId = targetMatch.loserPlayerId;

  // 1. Rollback old player records if targetMatch was completed
  if (oldWinnerId && playersMap.has(oldWinnerId)) {
    const oldW = playersMap.get(oldWinnerId)!;
    oldW.wins = Math.max(0, oldW.wins - 1);
    oldW.matchesPlayed = Math.max(0, oldW.matchesPlayed - 1);
    oldW.score = Math.max(0, oldW.score - 1);
    if (oldW.status === 'champion') {
      oldW.status = 'active';
    }
  }

  if (oldLoserId && playersMap.has(oldLoserId)) {
    const oldL = playersMap.get(oldLoserId)!;
    oldL.losses = Math.max(0, oldL.losses - 1);
    oldL.matchesPlayed = Math.max(0, oldL.matchesPlayed - 1);
    oldL.status = 'active';
    oldL.eliminatedInRound = undefined;
    oldL.eliminatedByPlayerId = undefined;
    oldL.eliminatedAt = undefined;
  }

  // 2. Recursively clear downstream matches that depended on the old winner
  function clearDownstreamMatches(match: Match, playerToClearId: string) {
    if (!match.nextMatchId) return;
    const nextMatch = matchesMap.get(match.nextMatchId);
    if (!nextMatch) return;

    let cleared = false;
    if (nextMatch.whitePlayerId === playerToClearId) {
      nextMatch.whitePlayerId = null;
      cleared = true;
    }
    if (nextMatch.blackPlayerId === playerToClearId) {
      nextMatch.blackPlayerId = null;
      cleared = true;
    }

    if (cleared) {
      // If downstream was also completed, rollback its winner too
      if (nextMatch.status === 'completed' && nextMatch.winnerPlayerId) {
        const subWinnerId = nextMatch.winnerPlayerId;
        const subLoserId = nextMatch.loserPlayerId;

        if (subWinnerId && playersMap.has(subWinnerId)) {
          const sw = playersMap.get(subWinnerId)!;
          sw.wins = Math.max(0, sw.wins - 1);
          sw.matchesPlayed = Math.max(0, sw.matchesPlayed - 1);
          sw.score = Math.max(0, sw.score - 1);
          if (sw.status === 'champion') sw.status = 'active';
        }
        if (subLoserId && playersMap.has(subLoserId)) {
          const sl = playersMap.get(subLoserId)!;
          sl.losses = Math.max(0, sl.losses - 1);
          sl.matchesPlayed = Math.max(0, sl.matchesPlayed - 1);
          sl.status = 'active';
          sl.eliminatedInRound = undefined;
          sl.eliminatedByPlayerId = undefined;
        }

        nextMatch.winnerPlayerId = null;
        nextMatch.loserPlayerId = null;
        nextMatch.resultType = null;
        nextMatch.resultDetails = undefined;
        nextMatch.tieBreakInfo = undefined;

        // Continue downstream clearing
        clearDownstreamMatches(nextMatch, subWinnerId);
      }

      nextMatch.status = 'upcoming';
      nextMatch.isTimerRunning = false;
      nextMatch.activeClock = null;
    }
  }

  if (oldWinnerId) {
    clearDownstreamMatches(targetMatch, oldWinnerId);
  }

  // 3. Reset or apply new result
  if (newResultType === null) {
    // Complete Undo to Ready/Upcoming
    targetMatch.status = (targetMatch.whitePlayerId && targetMatch.blackPlayerId) ? 'ready' : 'upcoming';
    targetMatch.winnerPlayerId = null;
    targetMatch.loserPlayerId = null;
    targetMatch.resultType = null;
    targetMatch.resultDetails = undefined;
    targetMatch.tieBreakInfo = undefined;
    targetMatch.isTimerRunning = false;
    targetMatch.activeClock = null;
    targetMatch.endTime = undefined;

    return {
      updatedMatches: Array.from(matchesMap.values()),
      updatedPlayers: Array.from(playersMap.values()),
    };
  }

  // If applying a new modified result, apply it via applyMatchResult logic
  return applyMatchResult(
    Array.from(matchesMap.values()),
    Array.from(playersMap.values()),
    targetMatchId,
    newResultType,
    undefined,
    newTieBreakInfo
  );
}
