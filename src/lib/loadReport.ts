import type { SupabaseClient } from "@supabase/supabase-js";
import { getProject } from "./projects";
import { challengesFor } from "./challenges";
import { todayKey } from "./planDates";
import type { DecisionRecord, ReportInput } from "./reportData";

// Loads everything the report needs for one plan. The saved decision is optional:
// a plan that was not made from a saved decision still gets a report, without that section.
export async function loadReportInput(
  sb: SupabaseClient,
  projectId: string,
): Promise<{ input: ReportInput | null; error: string | null }> {
  const { project, stages, tasks, error } = await getProject(sb, projectId);
  if (error || !project) return { input: null, error: error ?? "not_found" };

  let decision: DecisionRecord | null = null;
  if (project.decision_id) {
    const { data, error: decisionError } = await sb
      .from("matrices")
      .select("title, reason, criteria, options, actual_outcome, review_date")
      .eq("id", project.decision_id)
      .maybeSingle();
    if (!decisionError && data) {
      decision = {
        title: data.title,
        reason: data.reason ?? null,
        criteria: (data.criteria ?? []) as DecisionRecord["criteria"],
        options: (data.options ?? []) as DecisionRecord["options"],
        actual_outcome: data.actual_outcome ?? null,
        review_date: data.review_date ?? null,
      };
    }
  }

  const challenges = challengesFor(project, tasks, todayKey());
  return { input: { project, stages, tasks, decision, challenges }, error: null };
}
