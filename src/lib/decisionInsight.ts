import { contributions, explain, type Criterion, type Option } from "./explainRanking";

// The thresholds agreed for Decision Loop. Scores are the 0–100 overall scores on the results screen.
// No Strong Option is checked first, so a low top score is never called a clear winner.
export const NO_STRONG_BELOW = 50;
export const CLOSE_GAP = 3;

export type Classification = "no_strong_option" | "close_decision" | "clear_winner";
export type Confidence = "low" | "moderate" | "high";

export type Insight = {
  classification: Classification;
  confidence: Confidence;
  winnerScore: number;
  // Points between the winner and the runner-up. Null when only one option is scored.
  lead: number | null;
};

// scores must be sorted from highest to lowest.
export function classifyDecision(scores: number[]): Insight {
  const top = scores[0] ?? 0;
  const lead = scores.length > 1 ? top - scores[1] : null;
  if (top < NO_STRONG_BELOW) {
    return { classification: "no_strong_option", confidence: "low", winnerScore: top, lead };
  }
  if (lead !== null && lead <= CLOSE_GAP) {
    return { classification: "close_decision", confidence: "moderate", winnerScore: top, lead };
  }
  return { classification: "clear_winner", confidence: "high", winnerScore: top, lead };
}

export type ComparisonRow = {
  criterionId: string;
  name: string;
  inverted: boolean;
  // This criterion's share of the total weight, as a whole percentage.
  share: number;
  // The most points this criterion can give (weight × 10).
  max: number;
  // Weighted points each option earned, in the order the options were given.
  points: number[];
  // True where that option has the highest points on this criterion (not when every option ties).
  best: boolean[];
};

// Each option's points on each criterion, using the same arithmetic as the ranking.
export function comparisonRows(criteria: Criterion[], options: Option[]): ComparisonRow[] {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const perOption = options.map((o) => contributions(criteria, o));
  return criteria.map((c, i) => {
    const points = perOption.map((items) => items[i].points);
    const top = points.length > 0 ? Math.max(...points) : 0;
    const allTied = points.every((p) => p === top);
    return {
      criterionId: c.id,
      name: c.name,
      inverted: c.isInverted,
      share: totalWeight > 0 ? Math.round(((c.weight || 0) / totalWeight) * 100) : 0,
      max: 10 * (c.weight || 0),
      points,
      best: points.map((p) => !allTied && p === top),
    };
  });
}

// The criterion where the winner gains most on the runner-up, and where it falls behind most.
// Both come from the same arithmetic as the cards on the results screen.
export function winnerContrast(criteria: Criterion[], winner: Option, runnerUp?: Option) {
  if (!runnerUp) return null;
  const { gains, losses } = explain(criteria, winner, runnerUp);
  return {
    gain: gains[0] ?? null,
    loss: losses[0] ?? null,
  };
}
