"use client";

import React, { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lang } from "@/lib/i18n";
import {
  addPlanToActionPlan,
  savePlan,
  validatePlan,
  type Assumption,
  type PlanKey,
} from "@/lib/assumptionJournal";
import { PLAN_STRINGS } from "@/lib/assumptionPlanStrings";
import { JOURNAL_STRINGS } from "@/lib/assumptionJournalStrings";

type Props = {
  lang: Lang;
  sb: SupabaseClient;
  userId: string;
  isDark: boolean;
  assumption: Assumption;
  // Reloads the journal and returns the refreshed assumption, so the panel shows saved values.
  onChanged: () => Promise<void>;
};

// Validation plan for one assumption (Round 3).
// Saving changes only the plan. Adding to the Action Plan happens only when the user presses the button.
export default function AssumptionPlanPanel({ lang, sb, userId, isDark, assumption, onChanged }: Props) {
  const p = PLAN_STRINGS[lang];
  const field = isDark
    ? "bg-slate-950 border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
    : "bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500";

  const [method, setMethod] = useState("");
  const [success, setSuccess] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Fills the form from the saved values whenever a different assumption is opened.
  useEffect(() => {
    setMethod(assumption.validation_method ?? "");
    setSuccess(assumption.validation_success_measure ?? "");
    setDue(assumption.validation_due_date ?? "");
    setError(null);
    setNotice(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assumption.id]);

  const planMessage = (key: PlanKey): string => {
    if (key === "vPlanMethod") return p.vMethod;
    if (key === "vPlanSuccess") return p.vSuccess;
    if (key === "vPlanDate") return p.vDate;
    return p.vNoProject;
  };

  async function save() {
    const plan = { method, success_measure: success, due_date: due || null };
    const problem = validatePlan(plan);
    if (problem) {
      setError(planMessage(problem));
      setNotice(null);
      return;
    }
    setBusy(true);
    setError(null);
    const r = await savePlan(sb, assumption.id, plan);
    setBusy(false);
    if (r.error) {
      setError(JOURNAL_STRINGS[lang].saveError);
      return;
    }
    setNotice(p.saved);
    await onChanged();
  }

  async function addToPlan() {
    setBusy(true);
    setError(null);
    setNotice(null);
    const plan = { method, success_measure: success, due_date: due || null };
    const r = await addPlanToActionPlan(sb, userId, assumption, plan, { taskPrefix: p.taskPrefix, successLabel: p.successLabel });
    setBusy(false);
    if (r.kind === "added") {
      setNotice(p.added);
      await onChanged();
      return;
    }
    if (r.kind === "already") {
      setNotice(p.alreadyAdded);
      await onChanged();
      return;
    }
    if (r.kind === "problem") {
      setError(planMessage(r.key));
      return;
    }
    setError(JOURNAL_STRINGS[lang].saveError);
  }

  const inPlan = !!assumption.validation_task_id;
  const hasProject = !!assumption.project_id;

  return (
    <div className="space-y-3 border-t border-slate-800 pt-4">
      <h4 className="text-sm font-bold text-indigo-400">{p.heading}</h4>
      <p className="text-[11px] text-slate-400">{p.hint}</p>

      <label className="block text-xs space-y-1">
        <span className="text-slate-300">{p.method}</span>
        <textarea
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder={p.methodPlaceholder}
          rows={2}
          className={`w-full ${field} border rounded-xl p-2 text-xs`}
        />
      </label>

      <label className="block text-xs space-y-1">
        <span className="text-slate-300">{p.success}</span>
        <textarea
          value={success}
          onChange={(e) => setSuccess(e.target.value)}
          placeholder={p.successPlaceholder}
          rows={2}
          className={`w-full ${field} border rounded-xl p-2 text-xs`}
        />
      </label>

      <label className="block text-xs space-y-1">
        <span className="text-slate-300">{p.due}</span>
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={`${field} border rounded-xl p-2 text-xs`} />
      </label>

      {error && <p className="text-xs text-rose-300">{error}</p>}
      {notice && <p className="text-xs text-emerald-300">{notice}</p>}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {!hasProject && <p className="text-[11px] text-slate-400 mr-auto">{p.noProject}</p>}
        {inPlan ? (
          <span className="text-xs text-emerald-300 border border-emerald-800 rounded-xl px-3 py-2">{p.inPlan}</span>
        ) : (
          hasProject && (
            <button
              type="button"
              onClick={addToPlan}
              disabled={busy}
              className="text-xs text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 disabled:opacity-60 rounded-xl px-4 py-2"
            >
              {p.addToPlan}
            </button>
          )
        )}
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl px-4 py-2"
        >
          {p.save}
        </button>
      </div>
    </div>
  );
}
