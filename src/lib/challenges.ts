import type { Project, TaskStatus } from "./projects";
import { parseKey } from "./planDates";

// The Challenge Engine: checks a plan for weak points. Each check uses only stored data.
// Challenges are suggestions. They never block the user from carrying on.
export type ChallengeId = "no_deadline" | "no_success_measure" | "after_deadline" | "overload";

export type Challenge = { id: ChallengeId; count: number; days: number };

type TaskLike = { status: TaskStatus; due_date: string | null };

const MAX_SHOWN = 4;

export function challengesFor(
  project: Pick<Project, "status" | "due_date" | "success_measure">,
  tasks: TaskLike[],
  today: string,
): Challenge[] {
  if (project.status !== "active") return [];
  const found: Challenge[] = [];
  const open = tasks.filter((x) => x.status !== "completed");

  if (!project.due_date) found.push({ id: "no_deadline", count: 0, days: 0 });
  if (!project.success_measure.trim()) found.push({ id: "no_success_measure", count: 0, days: 0 });

  if (project.due_date) {
    // Open tasks scheduled after the plan's own deadline.
    const late = open.filter((x) => x.due_date && x.due_date > project.due_date!).length;
    if (late > 0) found.push({ id: "after_deadline", count: late, days: 0 });

    // More open tasks than days left to finish them.
    const days = Math.round((parseKey(project.due_date).getTime() - parseKey(today).getTime()) / 86400000);
    if (open.length > 0 && open.length > days) found.push({ id: "overload", count: open.length, days: Math.max(days, 0) });
  }

  return found.slice(0, MAX_SHOWN);
}
