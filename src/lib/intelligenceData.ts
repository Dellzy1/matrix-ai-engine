import type { SupabaseClient } from "@supabase/supabase-js";
import type { Finding, ChallengeInput, ResponseRecord } from "./intelligence";
import { challengesForProject } from "./intelligence";
import type { Project, TaskStatus, Priority } from "./projects";

// Loads what the Challenge Engine needs, and saves the user's responses.
// Everything is read from the user's own rows. Row Level Security makes sure no one else's rows come back.

type ProjectLike = Pick<Project, "id" | "title" | "status" | "due_date" | "goal" | "expected_result" | "success_measure" | "budget" | "budget_amount" | "budget_currency" | "decision_id">;

// The inputs for a set of projects, in one pass per table.
export async function loadChallengeInputs(
  sb: SupabaseClient,
  today: string,
  projects: ProjectLike[],
): Promise<ChallengeInput[]> {
  if (projects.length === 0) return [];
  const ids = projects.map((p) => p.id);

  const [stagesRes, tasksRes, assumptionsRes, historyRes] = await Promise.all([
    sb.from("project_stages").select("id,project_id,position").in("project_id", ids),
    sb.from("project_tasks").select("id,project_id,stage_id,title,status,start_date,due_date,priority").in("project_id", ids),
    sb.from("assumptions").select("id,statement,status,project_id,decision_id,evidence(id,stance,content)").in("project_id", ids),
    sb
      .from("recommendation_history")
      .select("kind,fingerprint,response,resolved,recommended_at")
      .eq("source", "challenge")
      .order("recommended_at", { ascending: false }),
  ]);

  // Only the latest response for each finding counts.
  const latest = new Map<string, ResponseRecord>();
  for (const row of (historyRes.data ?? []) as any[]) {
    if (latest.has(row.kind)) continue;
    latest.set(row.kind, {
      key: row.kind,
      fingerprint: row.fingerprint ?? "",
      response: row.response,
      resolved: !!row.resolved,
    });
  }
  const responses = [...latest.values()];

  // Assumptions linked to a decision are read too, for the unsupported-idea check.
  const decisionIds = projects.map((p) => p.decision_id).filter((x): x is string => !!x);
  let decisionAssumptions: any[] = [];
  if (decisionIds.length > 0) {
    const { data } = await sb
      .from("assumptions")
      .select("id,statement,status,project_id,decision_id,evidence(id,stance,content)")
      .in("decision_id", decisionIds);
    decisionAssumptions = data ?? [];
  }
  const allAssumptions = [...((assumptionsRes.data ?? []) as any[]), ...decisionAssumptions];
  const seen = new Set<string>();
  const assumptions = allAssumptions
    .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
    .map((a) => ({
      id: a.id,
      statement: a.statement,
      status: a.status,
      project_id: a.project_id ?? null,
      decision_id: a.decision_id ?? null,
      evidence: (a.evidence ?? []) as { id: string; stance: "supports" | "opposes"; content: string }[],
    }));

  return projects.map((project) => ({
    today,
    project,
    tasks: ((tasksRes.data ?? []) as any[])
      .filter((t) => t.project_id === project.id)
      .map((t) => ({
        id: t.id,
        title: t.title ?? "",
        stage_id: t.stage_id ?? null,
        status: t.status as TaskStatus,
        start_date: t.start_date ?? null,
        due_date: t.due_date ?? null,
        priority: (t.priority ?? "medium") as Priority,
      })),
    stages: ((stagesRes.data ?? []) as any[])
      .filter((s) => s.project_id === project.id)
      .map((s) => ({ id: s.id, position: s.position ?? 0 })),
    assumptions,
    responses,
  }));
}

// The findings for a project, with saved responses applied.
export function findingsFor(input: ChallengeInput): Finding[] {
  return challengesForProject(input);
}

// Saves one response. It is a new history row each time, so the full record is kept.
export async function respondToFinding(
  sb: SupabaseClient,
  userId: string,
  finding: Finding,
  response: "accepted" | "rejected" | "explained" | "resolved",
  note = "",
): Promise<{ error: string | null }> {
  const row = {
    user_id: userId,
    project_id: finding.projectId,
    task_id: finding.taskId ?? null,
    source: "challenge",
    kind: finding.key,
    title: finding.code,
    reason: note.trim(),
    fingerprint: finding.fingerprint,
    response: response === "resolved" ? "explained" : response,
    response_note: note.trim(),
    responded_at: new Date().toISOString(),
    resolved: response === "resolved",
    resolved_at: response === "resolved" ? new Date().toISOString() : null,
  };
  const { error } = await sb.from("recommendation_history").insert([row]);
  return { error: error ? error.message : null };
}

// Adds an assumption to a plan. If the plan came from a decision, it is linked to that decision too.
export async function addAssumption(
  sb: SupabaseClient,
  userId: string,
  projectId: string,
  decisionId: string | null,
  statement: string,
): Promise<{ error: string | null }> {
  const { error } = await sb.from("assumptions").insert([
    { user_id: userId, project_id: projectId, decision_id: decisionId, statement: statement.trim() },
  ]);
  return { error: error ? error.message : null };
}

export async function setAssumptionStatus(
  sb: SupabaseClient,
  assumptionId: string,
  status: "unvalidated" | "supported" | "contradicted" | "validated" | "dismissed",
): Promise<{ error: string | null }> {
  const { error } = await sb
    .from("assumptions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", assumptionId);
  return { error: error ? error.message : null };
}

export async function addEvidence(
  sb: SupabaseClient,
  userId: string,
  assumptionId: string,
  stance: "supports" | "opposes",
  content: string,
): Promise<{ error: string | null }> {
  const { error } = await sb
    .from("evidence")
    .insert([{ user_id: userId, assumption_id: assumptionId, stance, content: content.trim() }]);
  return { error: error ? error.message : null };
}

// Records that the user acted on a next step. Only a real click is logged, not every time the page shows it.
export async function logNextStepAccepted(
  sb: SupabaseClient,
  userId: string,
  step: { projectId: string; action: string; taskId?: string; decisionId?: string; projectTitle: string; taskTitle?: string },
): Promise<void> {
  await sb.from("recommendation_history").insert([
    {
      user_id: userId,
      project_id: step.projectId || null,
      task_id: step.taskId ?? null,
      decision_id: step.decisionId ?? null,
      source: "next_step",
      kind: step.action,
      title: step.taskTitle ? `${step.action}: ${step.taskTitle}` : step.action,
      reason: step.projectTitle,
      fingerprint: "",
      response: "accepted",
      responded_at: new Date().toISOString(),
    },
  ]);
}
