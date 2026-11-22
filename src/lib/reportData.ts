import type { Project, Stage, Task, TaskStatus } from "./projects";
import type { Finding } from "./intelligence";
import { rankByScore } from "./scoring";

// The report's content, built from saved data only. Nothing here is invented:
// a missing value stays missing, and a section with nothing to show is left out.

export type DecisionRecord = {
  title: string;
  // complete, calculator_only or action_plan_only; set when the decision is saved
  report_type?: string | null;
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
  challenges: Finding[];
};

export type SummaryKey = "description" | "goal" | "expected" | "measure" | "start" | "deadline";

export type ReportSection =
  | { kind: "summary"; rows: { label: SummaryKey; value: string | null }[] }
  | { kind: "decision"; question: string; reason: string | null; options: string[] }
  | { kind: "analysis"; criteria: { name: string; weight: number; inverted: boolean }[]; ranking: { name: string; score: number }[] }
  | { kind: "choice"; chosen: string | null; recommended: string | null }
  | { kind: "stages"; done: number; total: number; groups: { title: string | null; tasks: { title: string; status: TaskStatus; due: string | null }[] }[] }
  | { kind: "budget"; budget: string | null; resources: string | null }
  | { kind: "risks"; items: Finding[] }
  | { kind: "outcome"; outcome: string | null; lessons: string | null };

export type ReportModel = { title: string; sections: ReportSection[] };

// The same weighting the calculator uses. Keep this in step with scoreOptions in page.tsx.
// Uses the shared scoring engine in src/lib/scoring.ts, so saved decisions match the live Calculator.
export function rankOptions(criteria: DecisionRecord["criteria"], options: DecisionRecord["options"]) {
  return rankByScore(criteria, options).map((o) => ({ name: o.name, score: o.score }));
}

export function buildReport({ project, stages, tasks, decision, challenges }: ReportInput): ReportModel {
  const sections: ReportSection[] = [];

  const summaryRows = [
    { label: "description" as const, value: project.description || null },
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

  const budget = (project.budget ?? "").trim() || null;
  const resources = (project.resources ?? "").trim() || null;
  if (budget || resources) sections.push({ kind: "budget", budget, resources });

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

// ---- Export choices: report type, audience and version ----

export type ReportScope = "decision" | "action" | "complete";
export type Audience = "investor" | "partner" | "management" | "team" | "client" | "personal" | "other";
export type ReportVersion = "internal" | "presentation";

export const AUDIENCES: Audience[] = ["investor", "partner", "management", "team", "client", "personal", "other"];

type Kind = ReportSection["kind"];

// Which sections each report type contains.
const SCOPE_KINDS: Record<ReportScope, Kind[]> = {
  decision: ["summary", "decision", "analysis", "choice"],
  action: ["summary", "choice", "budget", "stages", "risks", "outcome"],
  complete: ["summary", "decision", "analysis", "choice", "budget", "stages", "risks", "outcome"],
};

// The order sections are emphasised in for each audience. Every section still appears; only the order changes.
const AUDIENCE_ORDER: Record<Audience, Kind[]> = {
  investor: ["summary", "decision", "analysis", "choice", "budget", "risks", "stages", "outcome"],
  partner: ["summary", "choice", "budget", "stages", "decision", "analysis", "risks", "outcome"],
  management: ["summary", "choice", "stages", "budget", "outcome", "risks", "decision", "analysis"],
  team: ["summary", "stages", "choice", "risks", "decision", "analysis", "budget", "outcome"],
  client: ["summary", "choice", "stages", "outcome", "decision", "analysis", "budget", "risks"],
  personal: ["summary", "stages", "choice", "budget", "risks", "decision", "analysis", "outcome"],
  other: ["summary", "decision", "analysis", "choice", "budget", "stages", "risks", "outcome"],
};

export function hasDecision(model: ReportModel): boolean {
  return model.sections.some((s) => s.kind === "decision");
}

// Builds the report for one export: picks the report type, orders the sections for the audience,
// and removes the sections the user switched off. It never adds information that is not in the model.
export function shapeReport(
  model: ReportModel,
  opts: { scope: ReportScope; audience: Audience; version: ReportVersion; excluded: ReadonlySet<string> },
): ReportModel {
  const allowed = new Set<Kind>(SCOPE_KINDS[opts.scope]);
  // The presentation version leaves out the weak points, which are for internal use.
  if (opts.version === "presentation") allowed.delete("risks");
  const order = AUDIENCE_ORDER[opts.audience];
  const sections = model.sections
    .filter((s) => allowed.has(s.kind) && !opts.excluded.has(s.kind))
    .sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  return { title: model.title, sections };
}
