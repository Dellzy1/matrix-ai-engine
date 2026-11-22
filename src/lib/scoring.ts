// The one scoring engine for the Calculator, saved decisions, explanations and the PDF.
// Every ratings value is 1–10. Higher is better keeps the rating. Lower is better uses 11 − rating,
// so the best possible rating (1) gives the full 10 points and the worst (10) gives 1.

export const SCORE_MIN = 1;
export const SCORE_MAX = 10;
// A missing rating counts as the middle of the scale, as the Calculator has always done.
const MISSING_RATING = 5;

export type ScoringCriterion = { id: string; weight: number; isInverted: boolean };
export type ScoringOption = { scores: Record<string, number | null | undefined> };

export function clampRating(value: number | null | undefined): number {
  const n = value == null ? MISSING_RATING : Number(value);
  return Number.isFinite(n) ? Math.min(SCORE_MAX, Math.max(SCORE_MIN, n)) : SCORE_MIN;
}

// The rating after the direction is applied. Always between 1 and 10.
export function adjustedRating(rating: number | null | undefined, isInverted: boolean): number {
  const r = clampRating(rating);
  return isInverted ? SCORE_MAX + SCORE_MIN - r : r;
}

// Weighted points one option earns on one criterion. The most it can earn is SCORE_MAX × weight.
export function weightedPoints(criterion: ScoringCriterion, option: ScoringOption): number {
  return adjustedRating(option.scores[criterion.id], criterion.isInverted) * (criterion.weight || 0);
}

// The most points one criterion can give.
export function maxPoints(criterion: ScoringCriterion): number {
  return SCORE_MAX * (criterion.weight || 0);
}

// The overall score out of 100: points earned ÷ maximum possible × 100, rounded.
export function overallScore(criteria: ScoringCriterion[], option: ScoringOption): number {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  if (totalWeight === 0) return 0;
  const earned = criteria.reduce((sum, c) => sum + weightedPoints(c, option), 0);
  return Math.round((earned / (totalWeight * SCORE_MAX)) * 100);
}

// Options sorted highest score first. Ties keep the order they were given in.
export function rankByScore<T extends ScoringOption>(criteria: ScoringCriterion[], options: T[]): (T & { score: number })[] {
  return options
    .map((o) => ({ ...o, score: overallScore(criteria, o) }))
    .sort((a, b) => b.score - a.score);
}
