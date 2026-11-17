"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowLeft, Lock, Plus, Search, Target } from "lucide-react";
import { fmt, type Lang } from "@/lib/i18n";
import { PLAN_STRINGS } from "@/lib/planStrings";
import { dueState, todayKey } from "@/lib/planDates";
import {
  CATEGORY_VALUES,
  calcProgress,
  createProject,
  listProjects,
  type Project,
  type ProjectStatus,
  type TaskRow,
  type TaskStatus,
} from "@/lib/projects";
import ProjectDetail from "./ProjectDetail";

// What Decision Loop passes in from the Calculator, after the user chooses Create Action Plan.
export type PlanSeed = {
  decisionId: string | null;
  title: string;
  selectedOption: string;
  reason: string;
};

type Props = {
  lang: Lang;
  supabase: SupabaseClient | null;
  userId: string | null;
  seed: PlanSeed | null;
  onSignIn: () => void;
  onBack: () => void;
};

type View = "list" | "new" | { projectId: string };
type StageKey =
  | "stageResearch" | "stagePlanning" | "stagePreparation" | "stageExecution"
  | "stageMarketing" | "stageLaunch" | "stageReview";
type CategoryKey =
  | "catBusiness" | "catCareer" | "catEducation" | "catPersonal"
  | "catFinance" | "catHealth" | "catTech" | "catOther";

export const DEFAULT_STAGE_KEYS: StageKey[] = [
  "stageResearch", "stagePlanning", "stagePreparation", "stageExecution",
  "stageMarketing", "stageLaunch", "stageReview",
];

const CATEGORY_KEY: Record<string, CategoryKey> = {
  "Business": "catBusiness",
  "Career": "catCareer",
  "Education": "catEducation",
  "Personal Development": "catPersonal",
  "Finance": "catFinance",
  "Health and Fitness": "catHealth",
  "Technology": "catTech",
  "Other": "catOther",
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";
const field =
  "w-full rounded-xl bg-[#11163a]/80 border border-indigo-500/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400";
const primaryBtn =
  "rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white shadow";
const secondaryBtn =
  "rounded-xl border border-indigo-400/50 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20";

const STATUS_STYLE: Record<ProjectStatus, string> = {
  draft: "bg-slate-500/20 text-slate-200",
  active: "bg-sky-500/20 text-sky-200",
  completed: "bg-emerald-500/20 text-emerald-200",
  archived: "bg-slate-600/30 text-slate-400",
};

export default function ActionPlan({ lang, supabase, userId, seed, onSignIn, onBack }: Props) {
  const t = PLAN_STRINGS[lang];
  const [view, setView] = useState<View>(seed ? "new" : "list");
  // A step inside the plan (a project or the new-plan form) is recorded in history,
  // so the phone and browser Back buttons return to the plan list.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      if (e.state?.plan !== "detail") setView("list");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (view === "list" || window.history.state?.plan === "detail") return;
    window.history.pushState({ ...window.history.state, plan: "detail" }, "");
  }, [view]);
  const goList = () => {
    if (window.history.state?.plan === "detail") window.history.back();
    else setView("list");
  };
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskRows, setTaskRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const [query, setQuery] = useState("");

  const loadList = useCallback(async () => {
    if (!supabase || !userId) return;
    setLoading(true);
    setError(null);
    const res = await listProjects(supabase, userId);
    setProjects(res.projects);
    setTaskRows(res.taskRows);
    setError(res.error);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    if (view === "list") loadList();
  }, [view, loadList]);

  const tasksByProject = useMemo(() => {
    const map = new Map<string, { status: TaskStatus }[]>();
    for (const row of taskRows) {
      const list = map.get(row.project_id) ?? [];
      list.push({ status: row.status });
      map.set(row.project_id, list);
    }
    return map;
  }, [taskRows]);

  const today = todayKey();
  const isOverdue = (p: Project) => p.status === "active" && !!p.due_date && p.due_date < today;

  // Overdue tasks per plan, shown as a pill on each card.
  const overdueByProject = new Map<string, number>();
  for (const row of taskRows) {
    if (dueState(row.due_date, row.status, today) === "overdue") {
      overdueByProject.set(row.project_id, (overdueByProject.get(row.project_id) ?? 0) + 1);
    }
  }

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    overdue: projects.filter(isOverdue).length,
  };

  const visible = projects.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${p.title} ${p.goal}`.toLowerCase().includes(q);
  });

  const statusLabel: Record<ProjectStatus, string> = {
    draft: t.statusDraft,
    active: t.statusActive,
    completed: t.statusCompleted,
    archived: t.statusArchived,
  };

  // ---- Project detail ----
  if (typeof view === "object") {
    return (
      <ProjectDetail
        lang={lang}
        supabase={supabase}
        userId={userId}
        projectId={view.projectId}
        onBack={goList}
      />
    );
  }

  // ---- New project ----
  if (view === "new") {
    return (
      <NewProjectForm
        lang={lang}
        supabase={supabase}
        userId={userId}
        seed={seed}
        onSignIn={onSignIn}
        onCancel={goList}
        onCreated={(id) => setView({ projectId: id })}
      />
    );
  }

  // ---- Project list ----
  return (
    <div className="space-y-6 text-slate-100">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <header className={`${panel} p-5 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-4 min-w-0">
          <span className="shrink-0 rounded-xl p-3 text-indigo-300 bg-indigo-500/20">
            <Target className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold">{t.title}</h2>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>
        </div>
        {userId && (
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow"
          >
            <Plus className="w-4 h-4" /> {t.newPlan}
          </button>
        )}
      </header>

      {!userId ? (
        <div className={`${panel} p-6 text-center space-y-3`}>
          <Lock className="w-6 h-6 mx-auto text-indigo-300" />
          <p className="text-sm text-slate-300">{t.signInNeeded}</p>
          <button type="button" onClick={onSignIn} className={primaryBtn}>
            {t.signIn}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t.statTotal, value: stats.total },
              { label: t.statActive, value: stats.active },
              { label: t.statCompleted, value: stats.completed },
              { label: t.statOverdue, value: stats.overdue },
            ].map((s) => (
              <div key={s.label} className={`${panel} p-4 text-center`}>
                <p className="text-2xl font-bold text-indigo-200">{s.value}</p>
                <p className="text-[11px] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`${field} pl-9`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "draft", "active", "completed"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    filter === key
                      ? "border-indigo-400 bg-indigo-600 text-white"
                      : "border-indigo-500/30 text-slate-300 hover:bg-indigo-500/20"
                  }`}
                >
                  {key === "all" ? t.filterAll : key === "draft" ? t.filterDraft : key === "active" ? t.filterActive : t.filterCompleted}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {loading && <p className="text-sm text-slate-400">{t.loading}</p>}

          {!loading && visible.length === 0 && (
            <div className={`${panel} p-8 text-center space-y-1`}>
              <p className="font-semibold">{t.emptyTitle}</p>
              <p className="text-xs text-slate-400">{t.emptySub}</p>
            </div>
          )}

          <ul className="grid gap-3 md:grid-cols-2">
            {visible.map((p) => {
              const progress = calcProgress(tasksByProject.get(p.id) ?? []);
              const overdueTasks = overdueByProject.get(p.id) ?? 0;
              return (
                <li key={p.id} className={`${panel} p-4 space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="font-bold break-words">{p.title}</p>
                      {p.goal && <p className="text-xs text-slate-400 break-words">{p.goal}</p>}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{t.progress}</span>
                      <span className="font-semibold text-indigo-300">{progress.percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {fmt(t.tasksDone, { done: progress.done, total: progress.total })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <p className={`text-xs ${isOverdue(p) ? "text-rose-300 font-semibold" : "text-slate-400"}`}>
                        {t.deadline}: {p.due_date || t.noDeadline}
                      </p>
                      {overdueTasks > 0 && (
                        <span className="rounded-full bg-rose-500/25 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                          {fmt(t.overdueCount, { count: overdueTasks })}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setView({ projectId: p.id })}
                      className={secondaryBtn}
                    >
                      {t.open}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

// ---- New project form ----

function NewProjectForm({
  lang, supabase, userId, seed, onSignIn, onCancel, onCreated,
}: {
  lang: Lang;
  supabase: SupabaseClient | null;
  userId: string | null;
  seed: PlanSeed | null;
  onSignIn: () => void;
  onCancel: () => void;
  onCreated: (projectId: string) => void;
}) {
  const t = PLAN_STRINGS[lang];
  const [title, setTitle] = useState(seed?.title ?? "");
  const [description, setDescription] = useState(seed?.reason ?? "");
  const [goal, setGoal] = useState("");
  const [expected, setExpected] = useState("");
  const [measure, setMeasure] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [stages, setStages] = useState<Record<StageKey, boolean>>(
    () => Object.fromEntries(DEFAULT_STAGE_KEYS.map((k) => [k, true])) as Record<StageKey, boolean>,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (asDraft: boolean) => {
    // Prevent double submissions: the second click does nothing while the first is saving.
    if (saving) return;
    if (!supabase || !userId) {
      onSignIn();
      return;
    }
    if (!title.trim()) {
      setFormError(t.needTitle);
      return;
    }
    if (startDate && dueDate && dueDate < startDate) {
      setFormError(t.dateOrder);
      return;
    }
    setSaving(true);
    setFormError(null);
    const stageNames = DEFAULT_STAGE_KEYS.filter((k) => stages[k]).map((k) => t[k]);
    const res = await createProject(
      supabase,
      userId,
      {
        title: title.trim(),
        description: description.trim(),
        goal: goal.trim(),
        expected_result: expected.trim(),
        success_measure: measure.trim(),
        selected_option: seed?.selectedOption || null,
        decision_id: seed?.decisionId || null,
        category,
        start_date: startDate || null,
        due_date: dueDate || null,
        status: asDraft ? "draft" : "active",
      },
      stageNames,
    );
    setSaving(false);
    if (!res.project) {
      setFormError(res.error ?? t.errorGeneric);
      return;
    }
    // The plan exists even if a stage failed to save, so open it rather than leaving the user here.
    onCreated(res.project.id);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <h2 className="text-xl sm:text-2xl font-bold">{t.newFormTitle}</h2>

      {seed && (
        <div className="rounded-xl border border-indigo-400/40 bg-indigo-950/40 p-3 text-xs text-indigo-200">
          {fmt(t.fromDecision, { name: seed.selectedOption || seed.title })}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(false);
        }}
        className={`${panel} p-5 space-y-4`}
      >
        <Field label={t.fieldTitle} htmlFor="ap-title">
          <input id="ap-title" value={title} onChange={(e) => setTitle(e.target.value)} className={field} maxLength={200} />
        </Field>

        <Field label={t.fieldDescription} htmlFor="ap-desc">
          <textarea id="ap-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
        </Field>

        <Field label={t.fieldGoal} htmlFor="ap-goal">
          <input id="ap-goal" value={goal} onChange={(e) => setGoal(e.target.value)} className={field} />
        </Field>

        <Field label={t.fieldExpected} htmlFor="ap-expected">
          <textarea id="ap-expected" rows={2} value={expected} onChange={(e) => setExpected(e.target.value)} className={field} />
        </Field>

        <Field label={t.fieldMeasure} htmlFor="ap-measure">
          <input id="ap-measure" value={measure} onChange={(e) => setMeasure(e.target.value)} className={field} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t.fieldCategory} htmlFor="ap-category">
            <select id="ap-category" value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
              {CATEGORY_VALUES.map((value) => (
                <option key={value} value={value}>{t[CATEGORY_KEY[value]]}</option>
              ))}
            </select>
          </Field>
          <Field label={t.fieldStart} htmlFor="ap-start">
            <input id="ap-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={field} />
          </Field>
          <Field label={t.fieldDue} htmlFor="ap-due">
            <input id="ap-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={field} />
          </Field>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs text-slate-300 pb-1">{t.stagesToStart}</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEFAULT_STAGE_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-2 rounded-lg border border-indigo-500/25 px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={stages[key]}
                  onChange={(e) => setStages((prev) => ({ ...prev, [key]: e.target.checked }))}
                />
                {t[key]}
              </label>
            ))}
          </div>
        </fieldset>

        {formError && <p className="text-sm text-rose-300">{formError}</p>}

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" disabled={saving} className={primaryBtn}>
            {saving ? t.saving : t.startPlan}
          </button>
          <button type="button" disabled={saving} onClick={() => submit(true)} className={secondaryBtn}>
            {t.saveDraft}
          </button>
          <button type="button" disabled={saving} onClick={onCancel} className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-slate-200">
            {t.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-xs text-slate-300">{label}</label>
      {children}
    </div>
  );
}
