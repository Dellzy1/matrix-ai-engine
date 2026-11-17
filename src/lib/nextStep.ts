import type { Project, TaskRow, TaskStatus } from "./projects";
import { dueState } from "./planDates";

// The Next Step Engine: plain rules over the user's real project and task data. No AI.
export type NextAction =
  | "overdue"
  | "today"
  | "blocked"
  | "no_deadlines"
  | "no_tasks"
  | "continue"
  | "complete"
  | "archive";

export type NextStep = { projectId: string; projectTitle: string; action: NextAction; count: number };

export type TaskLike = { status: TaskStatus; due_date: string | null };

// Actions that only open the plan. Clicking them does not filter the task list.
export const PLAN_ONLY_ACTIONS: NextAction[] = ["no_tasks", "complete", "archive"];

// When several projects qualify, the lowest rank wins (1 is the most urgent).
const RANK: Record<NextAction, number> = {
  overdue: 1,
  today: 2,
  blocked: 3,
  no_deadlines: 4,
  no_tasks: 5,
  continue: 6,
  complete: 7,
  archive: 8,
};

// The recommendation for one project. The first rule that applies wins.
export function nextStepFor(
  project: Pick<Project, "id" | "title" | "status">,
  tasks: TaskLike[],
  today: string,
): NextStep | null {
  const make = (action: NextAction, count = 0): NextStep => ({
    projectId: project.id,
    projectTitle: project.title,
    action,
    count,
  });

  if (project.status === "completed") return make("archive");
  if (project.status !== "active") return null;
  if (tasks.length === 0) return make("no_tasks");

  const open = tasks.filter((x) => x.status !== "completed");
  if (open.length === 0) return make("complete");

  const overdue = tasks.filter((x) => dueState(x.due_date, x.status, today) === "overdue").length;
  if (overdue > 0) return make("overdue", overdue);

  const dueToday = tasks.filter((x) => dueState(x.due_date, x.status, today) === "today").length;
  if (dueToday > 0) return make("today", dueToday);

  const blocked = tasks.filter((x) => x.status === "blocked").length;
  if (blocked > 0) return make("blocked", blocked);

  const noDeadline = open.filter((x) => !x.due_date).length;
  if (noDeadline > 0) return make("no_deadlines", noDeadline);

  return make("continue", open.length);
}

// The single most urgent step across all the user's projects, for the home screen.
export function nextStepForHome(projects: Project[], rows: TaskRow[], today: string): NextStep | null {
  let best: NextStep | null = null;
  for (const project of projects) {
    const tasks = rows.filter((r) => r.project_id === project.id);
    const step = nextStepFor(project, tasks, today);
    if (!step) continue;
    if (
      !best ||
      RANK[step.action] < RANK[best.action] ||
      (RANK[step.action] === RANK[best.action] && step.count > best.count)
    ) {
      best = step;
    }
  }
  return best;
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
