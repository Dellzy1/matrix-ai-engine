import { maxPoints, weightedPoints } from "./scoring";

// Turns the Calculator's current results into the data the PDF shows.
// It reads the scores and ranking the Calculator already displays. It never recalculates them,
// and it never invents a value the Calculator does not have.

export type CalculatorReportCriterion = { id: string; name: string; weight: number; lowerIsBetter: boolean };

export type CalculatorReportOption = {
  id: string;
  name: string;
  criterionScores: { criterionId: string; score: number | null }[];
  finalScore: number;
  // Weighted points this option earned, and the most the criteria could give. Both from the shared scoring engine.
  earnedPoints: number;
  maxPoints: number;
  rank: number;
  // Only the reasons the user typed, in criteria order. Never generated.
  reasons: { criterionId: string; criterionName: string; score: number | null; text: string }[];
};

export type CalculatorReportData = {
  title: string;
  reason: string | null;
  reviewDate: string | null;
  generatedAt: string;
  // true only when this exact result is saved in Decision Vault
  saved: boolean;
  criteria: CalculatorReportCriterion[];
  options: CalculatorReportOption[];
};

type InputCriterion = { id: string; name: string; weight: number; isInverted: boolean };
type InputOption = {
  id: string;
  name: string;
  scores: Record<string, number | null>;
  notes?: Record<string, string>;
  score: number;
};

export function buildCalculatorReport(input: {
  title: string;
  reason: string;
  reviewDate: string;
  generatedAt: string;
  saved: boolean;
  criteria: InputCriterion[];
  // The Calculator's options, already in the order it displays them (highest score first).
  ranked: InputOption[];
}): CalculatorReportData {
  const criteria = input.criteria.map((c) => ({
    id: c.id,
    name: c.name.trim(),
    weight: c.weight,
    lowerIsBetter: c.isInverted,
  }));
  const options = input.ranked.map((o, index) => ({
    id: o.id,
    name: o.name.trim(),
    criterionScores: input.criteria.map((c) => ({ criterionId: c.id, score: o.scores[c.id] ?? null })),
    finalScore: o.score,
    earnedPoints: Math.round(input.criteria.reduce((sum, c) => sum + weightedPoints(c, o), 0)),
    maxPoints: Math.round(input.criteria.reduce((sum, c) => sum + maxPoints(c), 0)),
    rank: index + 1,
    reasons: input.criteria.flatMap((c) => {
      const text = (o.notes?.[c.id] ?? "").trim();
      return text ? [{ criterionId: c.id, criterionName: c.name.trim(), score: o.scores[c.id] ?? null, text }] : [];
    }),
  }));
  return {
    title: input.title.trim(),
    reason: input.reason.trim() || null,
    reviewDate: input.reviewDate || null,
    generatedAt: input.generatedAt,
    saved: input.saved,
    criteria,
    options,
  };
}
