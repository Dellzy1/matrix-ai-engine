import type { Project, TaskStatus, Priority } from "./projects";
import { parseKey } from "./planDates";

// The Intelligent Challenge Engine. Plain rules over stored data. No AI.
//
// Every finding is either:
//   confirmed — supported by information the user actually entered, or
//   potential — the information is missing or incomplete, so this is only a concern to review.
// A missing field is never treated as proof that a plan is weak.
//
// Responses from the user change what is shown:
//   accepted  — the user will act on it, so it stays visible as in hand
//   explained — the user gave context, so it is reconsidered as a potential concern
//   rejected  — the user disagrees, so it is not raised again unless the facts change
//   resolved  — the concern has been addressed, so it is hidden
// A response only applies to the facts it was given for. If the facts change, the finding is raised again.

export type FindingLevel = "confirmed" | "potential";
export type FindingStatus = "open" | "accepted" | "explained" | "resolved";

export type FindingCode =
  | "deadline_after_tasks"
  | "deadline_passed"
  | "unrealistic_deadline"
  | "missing_information"
  | "weak_assumption"
  | "conflicting_tasks"
  | "missing_preparation"
  | "financial_inconsistency"
  | "unclear_objective"
  | "unsupported_idea";

export type Finding = {
  key: string; // stable id: code plus the thing it is about
  code: FindingCode;
  level: FindingLevel;
  status: FindingStatus;
  projectId: string;
  projectTitle: string;
  taskId?: string;
  assumptionId?: string;
  // The facts behind the finding. Used in the text, and to decide whether a response still applies.
  detail: Record<string, string | number>;
  fingerprint: string;
  // The user's last response to this finding, if it still applies to these facts.
  response: "accepted" | "rejected" | "explained" | null;
};

export type ChallengeTask = {
  id: string;
  title: string;
  stage_id: string | null;
  status: TaskStatus;
  start_date: string | null;
  due_date: string | null;
  priority: Priority;
};

export type ChallengeAssumption = {
  id: string;
  statement: string;
  status: string;
  project_id: string | null;
  decision_id: string | null;
  evidence: { id?: string; stance: "supports" | "opposes"; content?: string }[];
};

// The latest response for one finding key, from recommendation_history.
export type ResponseRecord = {
  key: string;
  fingerprint: string;
  response: "pending" | "accepted" | "rejected" | "explained";
  resolved: boolean;
};

export type ChallengeInput = {
  today: string;
  project: Pick<Project, "id" | "title" | "status" | "due_date" | "goal" | "expected_result" | "success_measure" | "budget" | "budget_amount" | "budget_currency" | "decision_id">;
  tasks: ChallengeTask[];
  stages: { id: string; position: number }[];
  assumptions: ChallengeAssumption[];
  responses: ResponseRecord[];
};

const DAY = 86400000;
const daysBetween = (from: string, to: string) => Math.round((parseKey(to).getTime() - parseKey(from).getTime()) / DAY);

// Every check that applies to one project, before the user's responses are applied.
function rawFindings(input: ChallengeInput): Omit<Finding, "status" | "response">[] {
  const { project, tasks, stages, assumptions, today } = input;
  const out: Omit<Finding, "status" | "response">[] = [];
  const base = { projectId: project.id, projectTitle: project.title };
  // subject: what the finding is about, so each finding has its own stable key.
  const add = (f: Omit<Finding, "status" | "response" | "fingerprint" | "projectId" | "projectTitle" | "key">, subject?: string) => {
    const fingerprint = JSON.stringify([f.code, f.taskId ?? "", f.assumptionId ?? "", f.detail]);
    const key = `${f.code}:${subject ?? f.taskId ?? f.assumptionId ?? project.id}`;
    out.push({ ...base, ...f, fingerprint, key });
  };
  if (project.status !== "active") return out;

  const open = tasks.filter((t) => t.status !== "completed");

  // 1. Unrealistic deadline
  if (project.due_date) {
    const late = open.filter((t) => t.due_date && t.due_date > project.due_date!);
    if (late.length > 0) add({ code: "deadline_after_tasks", level: "confirmed", detail: { count: late.length } });

    const days = daysBetween(today, project.due_date);
    if (days < 0 && open.length > 0) {
      add({ code: "deadline_passed", level: "confirmed", detail: { count: open.length } });
    } else if (days >= 0 && open.length > days) {
      add({ code: "unrealistic_deadline", level: "potential", detail: { count: open.length, days } });
    }
  }

  // 2. Missing information: the goal and budget are blank. Potential only.
  const missing: string[] = [];
  if (!project.goal.trim()) missing.push("goal");
  if (!project.budget.trim() && project.budget_amount == null) missing.push("budget");
  if (missing.length > 0) add({ code: "missing_information", level: "potential", detail: { fields: missing.join(",") } });

  // 3. Weak assumptions: claims in this plan with no evidence, or with evidence against them.
  for (const a of assumptions.filter((x) => x.project_id === project.id && x.status !== "validated" && x.status !== "dismissed")) {
    const against = a.evidence.filter((e) => e.stance === "opposes").length;
    const forIt = a.evidence.filter((e) => e.stance === "supports").length;
    if (against > 0) add({ code: "weak_assumption", level: "confirmed", assumptionId: a.id, detail: { statement: a.statement, count: against } });
    else if (forIt === 0) add({ code: "weak_assumption", level: "potential", assumptionId: a.id, detail: { statement: a.statement, count: 0 } });
  }

  // 4. Conflicting tasks: a task that ends before it starts (confirmed), or many tasks due the same day (potential).
  for (const t of tasks) {
    if (t.start_date && t.due_date && t.due_date < t.start_date) {
      add({ code: "conflicting_tasks", level: "confirmed", taskId: t.id, detail: { task: t.title, date: t.due_date } });
    }
  }
  const byDay = new Map<string, number>();
  for (const t of open) if (t.due_date) byDay.set(t.due_date, (byDay.get(t.due_date) ?? 0) + 1);
  for (const [date, count] of byDay) {
    if (count >= 3) add({ code: "conflicting_tasks", level: "potential", detail: { date, count } }, `day:${date}`);
  }

  // 5. Missing preparation: a task in a later stage has started while an earlier stage still has open work.
  const order = new Map(stages.map((s) => [s.id, s.position]));
  for (const t of tasks) {
    if (!t.stage_id || !order.has(t.stage_id)) continue;
    if (t.status !== "in_progress" && t.status !== "completed") continue;
    const myStage = order.get(t.stage_id)!;
    const earlierOpen = open.some((x) => x.stage_id && (order.get(x.stage_id) ?? Infinity) < myStage);
    if (earlierOpen) add({ code: "missing_preparation", level: "confirmed", taskId: t.id, detail: { task: t.title } });
  }

  // 6. Financial inconsistency: an amount with no currency is a confirmed problem.
  // A budget written only as text cannot be checked, so that is a potential concern.
  if (project.budget_amount != null && !project.budget_currency.trim()) {
    add({ code: "financial_inconsistency", level: "confirmed", detail: { amount: project.budget_amount } });
  } else if (project.budget.trim() && project.budget_amount == null) {
    add({ code: "financial_inconsistency", level: "potential", detail: { text: project.budget } });
  }

  // 7. Unclear objective: no success measure, or one with no number to check against. Potential only.
  const measure = project.success_measure.trim();
  if (!measure || !/\d/.test(measure)) {
    add({ code: "unclear_objective", level: "potential", detail: { measure: measure || "" } });
  }

  // 8. Unsupported business idea: the decision behind the plan has assumptions with no evidence.
  if (project.decision_id) {
    const decisionAssumptions = assumptions.filter((x) => x.decision_id === project.decision_id && x.status !== "validated" && x.status !== "dismissed");
    const against = decisionAssumptions.filter((a) => a.evidence.some((e) => e.stance === "opposes")).length;
    const unsupported = decisionAssumptions.filter((a) => !a.evidence.some((e) => e.stance === "supports")).length;
    if (against > 0) add({ code: "unsupported_idea", level: "confirmed", detail: { count: against } });
    else if (unsupported > 0) add({ code: "unsupported_idea", level: "potential", detail: { count: unsupported } });
  }

  return out;
}

// All findings for one project, with the user's responses applied.
export function challengesForProject(input: ChallengeInput): Finding[] {
  const responses = new Map(input.responses.map((r) => [r.key, r]));
  const result: Finding[] = [];
  for (const raw of rawFindings(input)) {
    const r = responses.get(raw.key);
    // A response only applies to the same facts. If they changed, the finding is raised again.
    const applies = r && r.fingerprint === raw.fingerprint;
    if (applies && r.resolved) continue;
    let status: FindingStatus = "open";
    let level = raw.level;
    let response: Finding["response"] = null;
    if (applies && r.response === "accepted") {
      status = "accepted";
      response = "accepted";
    }
    if (applies && (r.response === "explained" || r.response === "rejected")) {
      status = "explained";
      response = r.response;
      // The user has given context, so the system reconsiders: it can no longer call this confirmed.
      level = "potential";
    }
    result.push({ ...raw, level, status, response });
  }
  // Confirmed first, then potential. Open items before ones the user has responded to.
  const rank = (f: Finding) => (f.level === "confirmed" ? 0 : 2) + (f.status === "open" ? 0 : 1);
  return result.sort((a, b) => rank(a) - rank(b));
}

// Findings for every active project on the home screen, the most important first.
export function challengesForHome(inputs: ChallengeInput[]): Finding[] {
  return inputs.flatMap((i) => challengesForProject(i));
}
