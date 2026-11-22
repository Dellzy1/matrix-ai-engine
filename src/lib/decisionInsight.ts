import { contributions, explain, type Criterion, type Option } from "./explainRanking";
import { clampRating } from "./scoring";

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

// The total weighted points an option earns, and the most they could earn.
export function pointsTotals(criteria: Criterion[], option: Option): { earned: number; max: number } {
  const items = contributions(criteria, option);
  return {
    earned: items.reduce((sum, i) => sum + i.points, 0),
    max: items.reduce((sum, i) => sum + i.maxPoints, 0),
  };
}

// The smallest single rating change on one criterion that would bring this option level with the target
// (on weighted points, other ratings unchanged). Returns null when no single change is enough.
// Ratings stay between 1 and 10. Raw ratings move in the direction that helps the option.
export function singleChangeToLevel(
  criteria: Criterion[],
  option: Option,
  target: Option,
): { criterionName: string; from: number; to: number } | null {
  const earned = pointsTotals(criteria, option).earned;
  const goal = pointsTotals(criteria, target).earned;
  const gap = goal - earned;
  if (gap <= 0) return null;
  let best: { criterionName: string; from: number; to: number; steps: number } | null = null;
  for (const c of criteria) {
    const weight = c.weight || 0;
    if (weight <= 0) continue;
    const raw = clampRating(option.scores[c.id]);
    // The most this criterion can still give is 10 adjusted points, so the rating can move this many steps.
    const adjusted = c.isInverted ? 11 - raw : raw;
    const room = 10 - adjusted;
    const steps = Math.ceil(gap / weight);
    if (steps > room) continue;
    if (!best || steps < best.steps) {
      const to = c.isInverted ? raw - steps : raw + steps;
      best = { criterionName: c.name, from: raw, to, steps };
    }
  }
  return best ? { criterionName: best.criterionName, from: best.from, to: best.to } : null;
}
