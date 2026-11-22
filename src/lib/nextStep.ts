import type { Priority, Project, TaskRow, TaskStatus } from "./projects";
import { dueState } from "./planDates";

// The Next Step Engine: plain rules over the user's real project, task and decision data. No AI.
// It returns one primary recommendation and at most two alternatives, each with a reason.
export type NextAction =
  | "overdue"
  | "today"
  | "blocked"
  | "no_tasks"
  | "no_project_deadline"
  | "no_deadlines"
  | "continue"
  | "complete"
  | "archive"
  | "create_plan";

export type NextStep = {
  projectId: string;
  projectTitle: string;
  action: NextAction;
  count: number;
  // Set only for create_plan: the saved decision that needs a plan.
  decisionId?: string;
  // The task the reason refers to, when the action is about one task.
  taskId?: string;
  taskTitle?: string;
  date?: string | null;
};

export type TaskLike = {
  id?: string;
  title?: string;
  status: TaskStatus;
  due_date: string | null;
  priority?: Priority;
};

export type DecisionLike = { id: string; title: string; report_type?: string | null };

// Actions that only open the plan. Clicking them does not filter the task list.
export const PLAN_ONLY_ACTIONS: NextAction[] = ["no_tasks", "complete", "archive"];

// Lower rank is more urgent. This follows the spec's order: overdue, due today, blocked, then the rest.
const RANK: Record<NextAction, number> = {
  overdue: 1,
  today: 2,
  blocked: 3,
  no_tasks: 4,
  no_project_deadline: 5,
  no_deadlines: 6,
  continue: 7,
  complete: 8,
  archive: 9,
  create_plan: 10,
};

const PRIORITY_WEIGHT: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

// The most important task in a list: highest priority first, then the earliest due date.
function mostUrgent(list: TaskLike[]): TaskLike | undefined {
  return [...list].sort((a, b) => {
    const p = (PRIORITY_WEIGHT[b.priority ?? "medium"] ?? 2) - (PRIORITY_WEIGHT[a.priority ?? "medium"] ?? 2);
    if (p !== 0) return p;
    return (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999");
  })[0];
}

// The recommendation for one project. The first rule that applies wins.
export function nextStepFor(
  project: Pick<Project, "id" | "title" | "status" | "due_date">,
  tasks: TaskLike[],
  today: string,
): NextStep | null {
  const make = (action: NextAction, count = 0, subject?: TaskLike): NextStep => ({
    projectId: project.id,
    projectTitle: project.title,
    action,
    count,
    ...(subject ? { taskId: subject.id, taskTitle: subject.title, date: subject.due_date ?? null } : {}),
  });

  if (project.status === "completed") return make("archive");
  if (project.status !== "active") return null;
  if (tasks.length === 0) return make("no_tasks");

  const open = tasks.filter((x) => x.status !== "completed");
  if (open.length === 0) return make("complete");

  const overdue = open.filter((x) => dueState(x.due_date, x.status, today) === "overdue");
  if (overdue.length > 0) return make("overdue", overdue.length, mostUrgent(overdue));

  const dueToday = open.filter((x) => dueState(x.due_date, x.status, today) === "today");
  if (dueToday.length > 0) return make("today", dueToday.length, mostUrgent(dueToday));

  const blocked = open.filter((x) => x.status === "blocked");
  if (blocked.length > 0) return make("blocked", blocked.length, mostUrgent(blocked));

  if (!project.due_date) return make("no_project_deadline");

  const noDeadline = open.filter((x) => !x.due_date).length;
  if (noDeadline > 0) return make("no_deadlines", noDeadline);

  return make("continue", open.length);
}

// Every recommendation across the user's projects and saved decisions, most urgent first.
// Each project gives at most one. Only the first saved decision without a plan is offered.
export function rankedNextSteps(
  projects: Project[],
  rows: TaskRow[],
  today: string,
  decisions: DecisionLike[] = [],
): NextStep[] {
  const steps: NextStep[] = [];
  for (const project of projects) {
    const tasks = rows.filter((r) => r.project_id === project.id);
    const step = nextStepFor(project, tasks, today);
    if (step) steps.push(step);
  }
  for (const decision of decisions) {
    if (decision.report_type === "calculator_only") continue;
    if (projects.some((p) => p.decision_id === decision.id)) continue;
    steps.push({ projectId: "", projectTitle: decision.title, action: "create_plan", count: 0, decisionId: decision.id });
    break;
  }
  return steps.sort(
    (a, b) =>
      RANK[a.action] - RANK[b.action] ||
      b.count - a.count ||
      a.projectTitle.localeCompare(b.projectTitle),
  );
}

// The home screen: one primary recommendation and up to two alternatives.
export function nextStepsForHome(
  projects: Project[],
  rows: TaskRow[],
  today: string,
  decisions: DecisionLike[] = [],
): { primary: NextStep | null; alternatives: NextStep[] } {
  const steps = rankedNextSteps(projects, rows, today, decisions);
  return { primary: steps[0] ?? null, alternatives: steps.slice(1, 3) };
}

// Kept for callers that only need the primary recommendation.
export function nextStepForHome(
  projects: Project[],
  rows: TaskRow[],
  today: string,
  decisions: DecisionLike[] = [],
): NextStep | null {
  return nextStepsForHome(projects, rows, today, decisions).primary;
}

// Which tasks a focused action shows. Other actions show every task.
export function taskMatchesFocus(action: NextAction, task: TaskLike, today: string): boolean {
  switch (action) {
    case "overdue":
      return dueState(task.due_date, task.status, today) === "overdue";
    case "today":
      return dueState(task.due_date, task.status, today) === "today";
    case "blocked":
      return task.status === "blocked";
    case "no_deadlines":
      return task.status !== "completed" && !task.due_date;
    case "continue":
      return task.status !== "completed";
    default:
      return true;
  }
}
