/**
 * ratingEngine.ts — FIDE & USCF Rating Calculation Engine
 * Calculates expected scores, rating deltas, and Tournament Performance Ratings (TPR).
 */

export interface EloCalculationResult {
  playerRating: number;
  opponentRating: number;
  expectedScore: number;
  actualScore: number; // 1 for win, 0.5 for draw, 0 for loss
  kFactor: number;
  ratingDelta: number;
  newRating: number;
}

/**
 * Calculates the expected score for player A against player B using standard logistic curve.
 * Expected = 1 / (1 + 10^((RatingB - RatingA) / 400))
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Determines default FIDE K-factor based on player rating and game count.
 */
export function getKFactor(rating: number, gamesPlayed: number = 30): number {
  if (gamesPlayed < 30) return 40; // New player / provisional
  if (rating < 2400) return 20;    // Standard club / tournament player
  return 10;                       // Masters & Grandmasters
}

/**
 * Calculates the Elo rating change after a match outcome.
 */
export function calculateRatingDelta(
  playerRating: number,
  opponentRating: number,
  actualScore: 0 | 0.5 | 1,
  kFactor?: number
): EloCalculationResult {
  const k = kFactor ?? getKFactor(playerRating);
  const expected = calculateExpectedScore(playerRating, opponentRating);
  const delta = Math.round(k * (actualScore - expected));
  const newRating = Math.max(100, playerRating + delta);

  return {
    playerRating,
    opponentRating,
    expectedScore: Number(expected.toFixed(3)),
    actualScore,
    kFactor: k,
    ratingDelta: delta,
    newRating,
  };
}

/**
 * Calculates Tournament Performance Rating (TPR) based on opponent ratings and total score.
 * Linear approximation: Average Opponent Rating + 400 * (Wins - Losses) / Total Games
 */
export function calculateTournamentPerformanceRating(
  opponentRatings: number[],
  score: number
): number {
  if (opponentRatings.length === 0) return 1500;
  const avgOpponent = opponentRatings.reduce((a, b) => a + b, 0) / opponentRatings.length;
  const totalGames = opponentRatings.length;
  const scorePercent = score / totalGames;

  // Approximate standard normal inverse offset
  let offset = 0;
  if (scorePercent === 1) offset = 800;
  else if (scorePercent === 0) offset = -800;
  else {
    offset = Math.round(400 * Math.log10(scorePercent / (1 - scorePercent)));
  }

  return Math.round(avgOpponent + offset);
}
