import type { SupabaseClient } from "@supabase/supabase-js";

// The Assumption Journal (Round 1). It uses the existing assumptions table. It adds no second status system.
// Confidence is the user's stated belief (0–100). It is never treated as a probability of success.

export const IMPORTANCE = ["low", "medium", "high"] as const;
export type Importance = (typeof IMPORTANCE)[number];

export const STATUSES = ["unvalidated", "testing", "supported", "contradicted", "validated", "dismissed"] as const;
export type JournalStatus = (typeof STATUSES)[number];

export const CATEGORIES = ["market", "money", "operations", "team", "technology", "timing", "legal", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Assumption = {
  id: string;
  statement: string;
  status: JournalStatus;
  importance: Importance | null;
  confidence: number | null;
  category: Category | null;
  review_date: string | null;
  next_validation_action: string | null;
  project_id: string | null;
  decision_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AssumptionInput = {
  statement: string;
  importance: Importance | null;
  confidence: number | null;
  category: Category | null;
  review_date: string | null;
  next_validation_action: string;
  project_id: string | null;
  decision_id: string | null;
};

// Validation returns a message key, not text, so the screen can translate it.
export type ValidationKey = "vStatement" | "vLink" | "vConfidence" | "vDate";

export function validateAssumption(input: AssumptionInput): ValidationKey | null {
  if (!input.statement.trim()) return "vStatement";
  if (!input.project_id && !input.decision_id) return "vLink";
  if (input.confidence !== null && (!Number.isInteger(input.confidence) || input.confidence < 0 || input.confidence > 100)) {
    return "vConfidence";
  }
  if (input.review_date && !/^\d{4}-\d{2}-\d{2}$/.test(input.review_date)) return "vDate";
  return null;
}

// Basic rules for Round 1. Confidence is only judged when the user has given one.
// A missing value is never filled in with a guess.
export type Attention = "high" | "review" | null;

export function attentionFor(a: Assumption): Attention {
  if (a.status === "validated" || a.status === "dismissed") return null;
  if (a.importance === "high" && a.confidence !== null && a.confidence < 50) return "high";
  if (a.status === "contradicted") return "review";
  if (a.importance === "medium" && a.confidence !== null && a.confidence < 30) return "review";
  return null;
}

// True when a review date has passed. Dates are compared as YYYY-MM-DD text, so no time zone is involved.
export function isReviewOverdue(a: Assumption, today: string): boolean {
  return !!a.review_date && a.review_date < today && a.status !== "validated" && a.status !== "dismissed";
}

// Counts for the summary cards, taken from the real rows.
export function summarise(items: Assumption[]) {
  return {
    total: items.length,
    untested: items.filter((a) => a.status === "unvalidated").length,
    testing: items.filter((a) => a.status === "testing").length,
    validated: items.filter((a) => a.status === "validated").length,
  };
}

export type Filters = {
  search: string;
  category: Category | "all";
  status: JournalStatus | "all";
  importance: Importance | "all";
};

export function matchesFilters(a: Assumption, f: Filters, linkName: string): boolean {
  const q = f.search.trim().toLowerCase();
  if (q) {
    const hay = `${a.statement} ${a.next_validation_action ?? ""} ${linkName}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.category !== "all" && a.category !== f.category) return false;
  if (f.status !== "all" && a.status !== f.status) return false;
  if (f.importance !== "all" && a.importance !== f.importance) return false;
  return true;
}

// Attention first, then high importance and low confidence, then the rest by review date.
const IMPORTANCE_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
export function sortForAttention(items: Assumption[]): Assumption[] {
  return [...items].sort((a, b) => {
    const aa = attentionFor(a) ? 0 : 1;
    const ab = attentionFor(b) ? 0 : 1;
    if (aa !== ab) return aa - ab;
    const ia = IMPORTANCE_RANK[a.importance ?? "low"] ?? 3;
    const ib = IMPORTANCE_RANK[b.importance ?? "low"] ?? 3;
    if (ia !== ib) return ia - ib;
    return (a.created_at < b.created_at ? 1 : -1);
  });
}

// What the database row should contain. Empty optional text is stored as null, not as a made-up value.
function toRow(input: AssumptionInput) {
  return {
    statement: input.statement.trim(),
    importance: input.importance,
    confidence: input.confidence,
    category: input.category,
    review_date: input.review_date || null,
    next_validation_action: input.next_validation_action.trim() || null,
    project_id: input.project_id,
    decision_id: input.project_id ? null : input.decision_id,
  };
}

export type LinkOption = { value: string; label: string };

export async function loadAssumptions(sb: SupabaseClient, userId: string): Promise<{ data: Assumption[]; error: string | null }> {
  const { data, error } = await sb
    .from("assumptions")
    .select("id,statement,status,importance,confidence,category,review_date,next_validation_action,project_id,decision_id,created_at,updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Assumption[], error: null };
}

// Projects and saved decisions the user can attach an assumption to. Values are "p:<id>" or "d:<id>".
export async function loadLinkOptions(sb: SupabaseClient, userId: string): Promise<LinkOption[]> {
  const [projects, decisions] = await Promise.all([
    sb.from("projects").select("id,title").eq("user_id", userId).order("created_at", { ascending: false }),
    sb.from("matrices").select("id,title").eq("user_id", userId).order("created_at", { ascending: false }),
  ]);
  const p = (projects.data ?? []).map((r: { id: string; title: string }) => ({ value: `p:${r.id}`, label: r.title || "" }));
  const d = (decisions.data ?? []).map((r: { id: string; title: string }) => ({ value: `d:${r.id}`, label: r.title || "" }));
  return [...p, ...d];
}

export function linkValue(a: Assumption): string {
  if (a.project_id) return `p:${a.project_id}`;
  if (a.decision_id) return `d:${a.decision_id}`;
  return "";
}

// Turns a "p:<id>" or "d:<id>" choice into the two columns.
export function linkColumns(value: string): { project_id: string | null; decision_id: string | null } {
  if (value.startsWith("p:")) return { project_id: value.slice(2), decision_id: null };
  if (value.startsWith("d:")) return { project_id: null, decision_id: value.slice(2) };
  return { project_id: null, decision_id: null };
}

export async function createAssumption(sb: SupabaseClient, userId: string, input: AssumptionInput): Promise<{ error: string | null }> {
  const { error } = await sb.from("assumptions").insert({ user_id: userId, status: "unvalidated", ...toRow(input) });
  return { error: error?.message ?? null };
}

export async function updateAssumption(
  sb: SupabaseClient,
  id: string,
  input: AssumptionInput,
  status: JournalStatus,
): Promise<{ error: string | null }> {
  const { error } = await sb
    .from("assumptions")
    .update({ ...toRow(input), status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function evidenceCount(sb: SupabaseClient, assumptionId: string): Promise<number> {
  const { count } = await sb.from("evidence").select("id", { count: "exact", head: true }).eq("assumption_id", assumptionId);
  return count ?? 0;
}

// Evidence is removed first, on purpose, so nothing is lost by accident. The caller must confirm the count first.
export async function deleteAssumption(sb: SupabaseClient, id: string): Promise<{ error: string | null }> {
  const { error: evidenceError } = await sb.from("evidence").delete().eq("assumption_id", id);
  if (evidenceError) return { error: evidenceError.message };
  const { error } = await sb.from("assumptions").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// Evidence (Round 2). Evidence is kept separate from confidence: counts show what was found,
// they never change the user's confidence or the assumption's status.
export const STANCES = ["supports", "opposes"] as const;
export type Stance = (typeof STANCES)[number];

export type Evidence = {
  id: string;
  assumption_id: string;
  stance: Stance;
  content: string;
  source: string;
  created_at: string;
};

export type EvidenceCounts = { supports: number; opposes: number };

export function validateEvidence(content: string): "vEvidence" | null {
  return content.trim() ? null : "vEvidence";
}

export async function loadEvidence(sb: SupabaseClient, assumptionId: string): Promise<{ data: Evidence[]; error: string | null }> {
  const { data, error } = await sb
    .from("evidence")
    .select("id,assumption_id,stance,content,source,created_at")
    .eq("assumption_id", assumptionId)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Evidence[], error: null };
}

// Counts for every assumption of this user, read in one query.
export async function loadEvidenceCounts(sb: SupabaseClient, userId: string): Promise<Record<string, EvidenceCounts>> {
  const { data } = await sb.from("evidence").select("assumption_id,stance").eq("user_id", userId);
  const map: Record<string, EvidenceCounts> = {};
  for (const row of (data ?? []) as { assumption_id: string; stance: Stance }[]) {
    const entry = (map[row.assumption_id] ??= { supports: 0, opposes: 0 });
    if (row.stance === "supports") entry.supports += 1;
    else entry.opposes += 1;
  }
  return map;
}

export async function addEvidence(
  sb: SupabaseClient,
  userId: string,
  assumptionId: string,
  stance: Stance,
  content: string,
  source: string,
): Promise<{ error: string | null }> {
  const { error } = await sb.from("evidence").insert({
    user_id: userId,
    assumption_id: assumptionId,
    stance,
    content: content.trim(),
    source: source.trim(),
  });
  return { error: error?.message ?? null };
}

export async function deleteEvidence(sb: SupabaseClient, id: string): Promise<{ error: string | null }> {
  const { error } = await sb.from("evidence").delete().eq("id", id);
  return { error: error?.message ?? null };
}
