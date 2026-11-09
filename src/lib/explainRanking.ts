export type Criterion = { id: string; name: string; weight: number; isInverted: boolean };
export type Option = { id: string; name: string; scores: Record<string, number | null> };

export type Contribution = {
  criterionId: string;
  name: string;
  points: number;        // weighted points this option earned
  maxPoints: number;     // weight × 10, the most this criterion could give
  rawScore: number;      // the score the user entered
  inverted: boolean;
};

// Same arithmetic as the ranking: adjusted score × weight, scaled so 10 = max.
export function contributions(criteria: Criterion[], option: Option): Contribution[] {
  return criteria.map((c) => {
    const raw = Math.min(10, Math.max(1, option.scores[c.id] ?? 5));
    const adjusted = c.isInverted ? 10 - raw : raw;
    return {
      criterionId: c.id,
      name: c.name,
      points: adjusted * (c.weight || 0),
      maxPoints: 10 * (c.weight || 0),
      rawScore: raw,
      inverted: c.isInverted,
    };
  });
}

export function explain(criteria: Criterion[], option: Option, runnerUp?: Option) {
  const items = contributions(criteria, option);
  const top = [...items].sort((a, b) => b.points - a.points).slice(0, 2);
  const weak = [...items].sort((a, b) => a.points - b.points).slice(0, 2);

  let gains: { name: string; diff: number }[] = [];
  let losses: { name: string; diff: number }[] = [];
  if (runnerUp) {
    const other = contributions(criteria, runnerUp);
    const diffs = items.map((it, i) => ({ name: it.name, diff: it.points - other[i].points }));
    gains = diffs.filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, 2);
    losses = diffs.filter((d) => d.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 2);
  }
  return { top, weak, gains, losses };
}