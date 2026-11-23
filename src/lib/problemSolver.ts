import type { SupabaseClient } from "@supabase/supabase-js";

// Problem Solver, Round 1: saved problems, their eight stages, and progress.
// Stored values are English keys, so the data reads the same in every language.
// Round 1 does not record causes, challenges, solutions, evaluations, Action Plans or outcome reviews.

export const CATEGORIES = [
  "personal_life", "education", "career", "finance", "health_lifestyle", "relationships_family",
  "business", "work_projects", "technology", "team_organisation", "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = ["draft", "in_progress", "resolved", "archived"] as const;
export type ProblemStatus = (typeof STATUSES)[number];

export const STAGE_STATUSES = ["not_started", "in_progress", "completed", "needs_review"] as const;
export type StageStatus = (typeof STAGE_STATUSES)[number];

export const STAGE_COUNT = 8;
export const STALE_DAYS = 7;

export type Problem = {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  category: Category | null;
  category_other: string | null;
  priority: Priority;
  status: ProblemStatus;
  desired_outcome: string | null;
  started_on: string | null;
  frequency: string | null;
  affected: string | null;
  already_tried: string | null;
  current_stage: number;
  stage_statuses: Record<string, string> | null;
  created_at: string;
  updated_at: string;
};

export type ProblemInput = {
  title: string;
  description: string;
  category: Category | null;
  category_other: string;
  priority: Priority;
  status: ProblemStatus;
  desired_outcome: string;
  started_on: string;
  frequency: string;
  affected: string;
  already_tried: string;
};

export type ProblemKey = "vTitle" | "vOther" | "vDate";

// Only the title is required, and only once a problem is no longer a draft.
export function validateProblem(input: ProblemInput): ProblemKey | null {
  if (input.status !== "draft" && !input.title.trim()) return "vTitle";
  if (input.category === "other" && !input.category_other.trim()) return "vOther";
  if (input.started_on && !/^\d{4}-\d{2}-\d{2}$/.test(input.started_on)) return "vDate";
  return null;
}

// Missing or unknown stage values count as not started. Nothing is guessed.
export function stageStatusOf(p: Pick<Problem, "stage_statuses">, n: number): StageStatus {
  const v = p.stage_statuses?.[String(n)];
  return (STAGE_STATUSES as readonly string[]).includes(v ?? "") ? (v as StageStatus) : "not_started";
}

// Completed stages divided by eight, rounded down. Drafts with nothing completed show 0%.
export function progressPercent(p: Pick<Problem, "stage_statuses">): number {
  let done = 0;
  for (let n = 1; n <= STAGE_COUNT; n++) if (stageStatusOf(p, n) === "completed") done++;
  return Math.floor((done / STAGE_COUNT) * 100);
}

// Stage 1 can be marked complete only when these three are filled in. The user still makes the choice.
export function stage1Ready(p: Pick<Problem, "title" | "description" | "desired_outcome">): boolean {
  return [p.title, p.description, p.desired_outcome].every((v) => !!v && v.trim().length > 0);
}

// Each reason is shown to the user in words, so nothing is a hidden score.
export type AttentionReason = "stage1Incomplete" | "staleDraft" | "noOutcome";

export function attentionReasons(p: Problem, nowMs: number): AttentionReason[] {
  if (p.status === "resolved" || p.status === "archived") return [];
  const reasons: AttentionReason[] = [];
  if (p.priority === "high" && stageStatusOf(p, 1) !== "completed") reasons.push("stage1Incomplete");
  if (p.status === "draft" && nowMs - Date.parse(p.updated_at) > STALE_DAYS * 86400000) reasons.push("staleDraft");
  if (!p.desired_outcome || !p.desired_outcome.trim()) reasons.push("noOutcome");
  return reasons;
}

// Dashboard counts from real rows only.
export function summarise(items: Problem[]) {
  return {
    total: items.length,
    inProgress: items.filter((p) => p.status === "in_progress").length,
    drafts: items.filter((p) => p.status === "draft").length,
    resolved: items.filter((p) => p.status === "resolved").length,
  };
}

export type SortKey = "updated" | "priority";
export type ProblemFilters = {
  search: string;
  category: Category | "all";
  status: ProblemStatus | "all";
  priority: Priority | "all";
  sort: SortKey;
};

export function matchesFilters(p: Problem, f: ProblemFilters): boolean {
  const q = f.search.trim().toLowerCase();
  if (q) {
    const hay = `${p.title ?? ""} ${p.description ?? ""} ${p.category_other ?? ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.category !== "all" && p.category !== f.category) return false;
  if (f.status !== "all" && p.status !== f.status) return false;
  if (f.priority !== "all" && p.priority !== f.priority) return false;
  return true;
}

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
export function sortProblems(items: Problem[], sort: SortKey): Problem[] {
  return [...items].sort((a, b) => {
    if (sort === "priority" && PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    }
    return a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0;
  });
}

// Empty optional text is stored as null, never as invented text.
function toRow(input: ProblemInput) {
  const t = (s: string) => s.trim() || null;
  return {
    title: t(input.title),
    description: t(input.description),
    category: input.category,
    category_other: input.category === "other" ? t(input.category_other) : null,
    priority: input.priority,
    status: input.status,
    desired_outcome: t(input.desired_outcome),
    started_on: input.started_on || null,
    frequency: t(input.frequency),
    affected: t(input.affected),
    already_tried: t(input.already_tried),
    updated_at: new Date().toISOString(),
  };
}

export async function loadProblems(sb: SupabaseClient, userId: string): Promise<{ data: Problem[]; error: string | null }> {
  const { data, error } = await sb.from("problems").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Problem[], error: null };
}

export async function createProblem(sb: SupabaseClient, userId: string, input: ProblemInput): Promise<{ error: string | null }> {
  const { error } = await sb.from("problems").insert({ user_id: userId, current_stage: 1, stage_statuses: {}, ...toRow(input) });
  return { error: error?.message ?? null };
}

export async function updateProblem(sb: SupabaseClient, id: string, input: ProblemInput): Promise<{ error: string | null }> {
  const { error } = await sb.from("problems").update(toRow(input)).eq("id", id);
  return { error: error?.message ?? null };
}

// Saves one stage's status. Other stages are left exactly as they are.
export async function setStageStatus(sb: SupabaseClient, p: Problem, n: number, status: StageStatus): Promise<{ error: string | null }> {
  const next = { ...(p.stage_statuses ?? {}), [String(n)]: status };
  const { error } = await sb.from("problems").update({ stage_statuses: next, updated_at: new Date().toISOString() }).eq("id", p.id);
  return { error: error?.message ?? null };
}

export async function setCurrentStage(sb: SupabaseClient, id: string, n: number): Promise<{ error: string | null }> {
  const { error } = await sb.from("problems").update({ current_stage: n }).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteProblem(sb: SupabaseClient, id: string): Promise<{ error: string | null }> {
  const { error } = await sb.from("problems").delete().eq("id", id);
  return { error: error?.message ?? null };
}
