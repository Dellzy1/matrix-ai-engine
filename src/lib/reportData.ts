import type { Project, Stage, Task, TaskStatus } from "./projects";
import type { Challenge } from "./challenges";

// The report's content, built from saved data only. Nothing here is invented:
// a missing value stays missing, and a section with nothing to show is left out.

export type DecisionRecord = {
  title: string;
  reason: string | null;
  criteria: { id: string; name: string; weight: number; isInverted: boolean }[];
  options: { id: string; name: string; scores: Record<string, number | null> }[];
  actual_outcome: string | null;
  review_date: string | null;
};

export type ReportInput = {
  project: Project;
  stages: Stage[];
  tasks: Task[];
  // The saved decision this plan came from, or null if the plan was not linked to one.
  decision: DecisionRecord | null;
  challenges: Challenge[];
};

export type SummaryKey = "goal" | "expected" | "measure" | "start" | "deadline";

export type ReportSection =
  | { kind: "summary"; rows: { label: SummaryKey; value: string | null }[] }
  | { kind: "decision"; question: string; reason: string | null; options: string[] }
  | { kind: "analysis"; criteria: { name: string; weight: number; inverted: boolean }[]; ranking: { name: string; score: number }[] }
  | { kind: "choice"; chosen: string | null; recommended: string | null }
  | { kind: "stages"; done: number; total: number; groups: { title: string | null; tasks: { title: string; status: TaskStatus; due: string | null }[] }[] }
  | { kind: "risks"; items: Challenge[] }
  | { kind: "outcome"; outcome: string | null; lessons: string | null };

export type ReportModel = { title: string; sections: ReportSection[] };

// The same weighting the calculator uses. Keep this in step with scoreOptions in page.tsx.
export function rankOptions(criteria: DecisionRecord["criteria"], options: DecisionRecord["options"]) {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const clamp = (n: number) => (Number.isFinite(n) ? Math.min(10, Math.max(1, n)) : 1);
  return options
    .map((opt) => {
      let weightedSum = 0;
      criteria.forEach((crit) => {
        const raw = clamp(opt.scores[crit.id] ?? 5);
        const adjusted = crit.isInverted ? 10 - raw : raw;
        weightedSum += adjusted * (crit.weight || 0);
      });
      const score = totalWeight === 0 ? 0 : Math.round((weightedSum / (totalWeight * 10)) * 100);
      return { name: opt.name, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function buildReport({ project, stages, tasks, decision, challenges }: ReportInput): ReportModel {
  const sections: ReportSection[] = [];

  const summaryRows = [
    { label: "goal" as const, value: project.goal || null },
    { label: "expected" as const, value: project.expected_result || null },
    { label: "measure" as const, value: project.success_measure || null },
    { label: "start" as const, value: project.start_date || null },
    { label: "deadline" as const, value: project.due_date || null },
  ].filter((r) => r.value);
  if (summaryRows.length > 0) sections.push({ kind: "summary", rows: summaryRows });

  if (decision) {
    sections.push({
      kind: "decision",
      question: decision.title,
      reason: decision.reason,
      options: decision.options.map((o) => o.name),
    });
    sections.push({
      kind: "analysis",
      criteria: decision.criteria.map((c) => ({ name: c.name, weight: c.weight, inverted: c.isInverted })),
      ranking: rankOptions(decision.criteria, decision.options),
    });
  }

  // The chosen option is what the user decided. The recommendation is the calculator's result,
  // and only appears when it came from a saved decision.
  const chosen = project.selected_option || null;
  const recommended = decision && project.recommended_option ? project.recommended_option : null;
  if (chosen || recommended) sections.push({ kind: "choice", chosen, recommended });

  if (tasks.length > 0) {
    const done = tasks.filter((t) => t.status === "completed").length;
    const byStage = [...stages]
      .sort((a, b) => a.position - b.position)
      .map((stage) => ({
        title: stage.title as string | null,
        tasks: tasks
          .filter((t) => t.stage_id === stage.id)
          .sort((a, b) => a.position - b.position)
          .map((t) => ({ title: t.title, status: t.status, due: t.due_date })),
      }))
      .filter((g) => g.tasks.length > 0);
    const loose = tasks
      .filter((t) => !stages.some((s) => s.id === t.stage_id))
      .sort((a, b) => a.position - b.position)
      .map((t) => ({ title: t.title, status: t.status, due: t.due_date }));
    const groups = loose.length > 0 ? [...byStage, { title: null, tasks: loose }] : byStage;
    sections.push({ kind: "stages", done, total: tasks.length, groups });
  }

  if (challenges.length > 0) sections.push({ kind: "risks", items: challenges });

  if (project.status === "completed" || project.status === "archived") {
    sections.push({
      kind: "outcome",
      outcome: project.outcome.trim() || null,
      lessons: project.lessons.trim() || null,
    });
  }

  return { title: project.title, sections };
}
