import type { Criterion, Option } from "./explainRanking";

// Automatic Decision Sensitivity. It moves each criterion's share of the total up and down by a small
// and a large step, reruns the calculator's own ranking, and counts how often the winner changes.
// This is rule-based and deterministic: the same inputs always give the same stability label.

export const SMALL_STEP = 5;   // percentage points of total importance
export const LARGE_STEP = 10;

export type Stability = "stable" | "sensitive" | "highly_sensitive";
export type Direction = "raise" | "lower";

export type Flip = {
  criterionId: string;
  criterionName: string;
  step: number;
  direction: Direction;
  newWinnerName: string;
};

export type Analysis = {
  stability: Stability;
  tested: number;
  smallTested: number;
  flips: Flip[];
  // The most useful findings: the smallest change that flips the winner, one per criterion and direction.
  findings: Flip[];
};

// The weights (as percentages of the total) with one criterion moved by `step` points.
// The other criteria are scaled so the total stays 100. Returns null when the move is impossible.
export function shiftedWeights(
  criteria: Criterion[],
  criterionId: string,
  step: number,
  direction: Direction,
): Record<string, number> | null {
  const total = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  if (total <= 0) return null;
  const share = Object.fromEntries(criteria.map((c) => [c.id, ((c.weight || 0) / total) * 100])) as Record<string, number>;
  const current = share[criterionId];
  if (current === undefined) return null;
  const target = direction === "raise" ? current + step : current - step;
  if (target < 0 || target > 100 || current >= 100) return null;
  const factor = (100 - target) / (100 - current);
  return Object.fromEntries(
    criteria.map((c) => [c.id, c.id === criterionId ? target : share[c.id] * factor]),
  ) as Record<string, number>;
}

export function analyseStability(
  criteria: Criterion[],
  original: (Option & { score: number })[],
  rankFor: (weights: Record<string, number>) => (Option & { score: number })[],
): Analysis {
  const winner = original[0];
  const flips: Flip[] = [];
  let tested = 0;
  let smallTested = 0;
  if (!winner) {
    return { stability: "stable", tested: 0, smallTested: 0, flips, findings: [] };
  }

  for (const step of [SMALL_STEP, LARGE_STEP]) {
    for (const c of criteria) {
      for (const direction of ["raise", "lower"] as const) {
        const weights = shiftedWeights(criteria, c.id, step, direction);
        if (!weights) continue;
        tested += 1;
        if (step === SMALL_STEP) smallTested += 1;
        const ranked = rankFor(weights);
        const top = ranked[0];
        const stillThere = ranked.find((o) => o.id === winner.id);
        // A tie at the top counts as the winner surviving, so tie order never decides the result.
        const survives = !!stillThere && !!top && stillThere.score === top.score;
        if (!survives && top) {
          flips.push({
            criterionId: c.id,
            criterionName: c.name,
            step,
            direction,
            newWinnerName: top.name,
          });
        }
      }
    }
  }

  const smallFlips = flips.filter((f) => f.step === SMALL_STEP).length;
  let stability: Stability = "stable";
  if (flips.length > 0) {
    stability = smallTested > 0 && smallFlips / smallTested >= 0.5 ? "highly_sensitive" : "sensitive";
  }

  const seen = new Set<string>();
  const findings = [...flips]
    .sort((a, b) => a.step - b.step)
    .filter((f) => {
      const key = `${f.criterionId}:${f.direction}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);

  return { stability, tested, smallTested, flips, findings };
}
