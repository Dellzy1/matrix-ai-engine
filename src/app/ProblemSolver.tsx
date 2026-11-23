"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fmt, type Lang } from "@/lib/i18n";
import { todayKey } from "@/lib/planDates";
import {
  CATEGORIES,
  PRIORITIES,
  STAGE_STATUSES,
  STATUSES,
  attentionReasons,
  createProblem,
  deleteProblem,
  loadProblems,
  matchesFilters,
  progressPercent,
  setStageStatus,
  sortProblems,
  stage1Ready,
  stageStatusOf,
  summarise,
  updateProblem,
  validateProblem,
  type AttentionReason,
  type Category,
  type Problem,
  type ProblemFilters,
  type ProblemInput,
  type ProblemKey,
  type ProblemStatus,
  type Priority,
  type StageStatus,
} from "@/lib/problemSolver";
import { PROBLEM_STRINGS } from "@/lib/problemSolverStrings";

type Props = {
  lang: Lang;
  sb: SupabaseClient;
  userId: string;
  isDark: boolean;
  onBack: () => void;
};

type Mode = "list" | "form" | "detail";

const EMPTY_FILTERS: ProblemFilters = { search: "", category: "all", status: "all", priority: "all", sort: "updated" };

const emptyInput = (): ProblemInput => ({
  title: "",
  description: "",
  category: null,
  category_other: "",
  priority: "medium",
  status: "draft",
  desired_outcome: "",
  started_on: "",
  frequency: "",
  affected: "",
  already_tried: "",
});

export default function ProblemSolver({ lang, sb, userId, isDark, onBack }: Props) {
  const t = PROBLEM_STRINGS[lang];
  const surface = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";
  const field = isDark
    ? "bg-slate-950 border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
    : "bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500";
  const muted = isDark ? "text-slate-400" : "text-slate-600";

  const [items, setItems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [filters, setFilters] = useState<ProblemFilters>(EMPTY_FILTERS);

  // Form state
  const [input, setInput] = useState<ProblemInput>(emptyInput());
  const [formError, setFormError] = useState<ProblemKey | "saveError" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteStep, setDeleteStep] = useState(false);
  const [stageError, setStageError] = useState<string | null>(null);

  const today = todayKey();
  const nowMs = Date.now();
  const selected = useMemo(() => items.find((p) => p.id === selectedId) ?? null, [items, selectedId]);

  async function reload() {
    setLoading(true);
    const r = await loadProblems(sb, userId);
    setItems(r.data);
    setLoadError(r.error);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // Loads once when the screen opens. Later changes reload explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const summary = useMemo(() => summarise(items), [items]);
  const attention = useMemo(
    () => items.map((p) => ({ p, reasons: attentionReasons(p, nowMs) })).filter((x) => x.reasons.length > 0),
    // Recalculated when the list changes. The clock is read once per load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );
  const visible = useMemo(
    () => sortProblems(items.filter((p) => matchesFilters(p, filters)), filters.sort),
    [items, filters],
  );

  const titleOf = (p: Problem) => p.title?.trim() || t.untitled;
  const categoryLabel = (p: Problem) => {
    if (!p.category) return t.notSet;
    const base = t.categories[p.category];
    return p.category === "other" && p.category_other ? `${base} · ${p.category_other}` : base;
  };
  const reasonText = (r: AttentionReason) => (r === "stage1Incomplete" ? t.reasonStage1 : r === "staleDraft" ? t.reasonStale : t.reasonNoOutcome);
  const stageName = (n: number) => t.stageNames[n - 1] ?? String(n);

  function openForm(p: Problem | null) {
    setFormError(null);
    setNotice(null);
    setDeleteStep(false);
    setEditing(!!p);
    setInput(
      p
        ? {
            title: p.title ?? "",
            description: p.description ?? "",
            category: p.category,
            category_other: p.category_other ?? "",
            priority: p.priority,
            status: p.status,
            desired_outcome: p.desired_outcome ?? "",
            started_on: p.started_on ?? "",
            frequency: p.frequency ?? "",
            affected: p.affected ?? "",
            already_tried: p.already_tried ?? "",
          }
        : emptyInput(),
    );
    setMode("form");
  }

  function openDetail(p: Problem) {
    setSelectedId(p.id);
    setDeleteStep(false);
    setNotice(null);
    setStageError(null);
    setMode("detail");
  }

  // "Save as draft" and "Save and start working" set the status. An edit keeps the status the user chose.
  async function save(status: ProblemStatus | null) {
    const next: ProblemInput = { ...input, status: status ?? input.status };
    const problem = validateProblem(next);
    if (problem) {
      setFormError(problem);
      return;
    }
    setSaving(true);
    setFormError(null);
    const result = editing && selected ? await updateProblem(sb, selected.id, next) : await createProblem(sb, userId, next);
    setSaving(false);
    if (result.error) {
      setFormError("saveError");
      return;
    }
    setNotice(t.saved);
    await reload();
    setSelectedId(null);
    setMode("list");
  }

  async function changeStage1(status: StageStatus) {
    if (!selected) return;
    setStageError(null);
    const r = await setStageStatus(sb, selected, 1, status);
    if (r.error) {
      setStageError(t.saveError);
      return;
    }
    await reload();
  }

  async function confirmDelete() {
    if (!selected) return;
    setSaving(true);
    const r = await deleteProblem(sb, selected.id);
    setSaving(false);
    if (r.error) {
      setStageError(t.saveError);
      return;
    }
    setSelectedId(null);
    setDeleteStep(false);
    await reload();
    setMode("list");
  }

  const errorText = formError ? (formError === "saveError" ? t.saveError : t[formError]) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1 min-w-0">
          <button type="button" onClick={mode === "list" ? onBack : () => setMode("list")} className="text-xs text-slate-400 hover:text-slate-200">
            ← {t.back}
          </button>
          <h2 className="text-2xl font-bold break-words">{t.title}</h2>
          <p className={`text-xs ${muted}`}>{t.subtitle}</p>
        </div>
        {mode === "list" && (
          <button
            type="button"
            onClick={() => openForm(null)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
          >
            {t.start}
          </button>
        )}
      </div>

      {notice && <p className="text-xs text-emerald-300">{notice}</p>}
      {loadError && <p className="text-xs text-rose-300">{loadError}</p>}

      {/* Form: create or edit */}
      {mode === "form" && (
        <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
          <label className={`block text-xs space-y-1 ${muted}`}>
            {t.fTitle}
            <input
              type="text"
              value={input.title}
              onChange={(e) => setInput({ ...input, title: e.target.value })}
              placeholder={t.phTitle}
              className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
            />
          </label>

          <label className={`block text-xs space-y-1 ${muted}`}>
            {t.fDescription}
            <textarea
              value={input.description}
              onChange={(e) => setInput({ ...input, description: e.target.value })}
              placeholder={t.phDescription}
              rows={4}
              className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fCategory}
              <select
                value={input.category ?? ""}
                onChange={(e) => setInput({ ...input, category: (e.target.value || null) as Category | null })}
                className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
              >
                <option value="">{t.notSet}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fPriority}
              <select
                value={input.priority}
                onChange={(e) => setInput({ ...input, priority: e.target.value as Priority })}
                className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {t.priorities[p]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {input.category === "other" && (
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fCategoryOther}
              <input
                type="text"
                value={input.category_other}
                onChange={(e) => setInput({ ...input, category_other: e.target.value })}
                placeholder={t.phCategoryOther}
                className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
              />
            </label>
          )}

          <label className={`block text-xs space-y-1 ${muted}`}>
            {t.fOutcome}
            <textarea
              value={input.desired_outcome}
              onChange={(e) => setInput({ ...input, desired_outcome: e.target.value })}
              placeholder={t.phOutcome}
              rows={2}
              className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fStarted}
              <input type="date" value={input.started_on} onChange={(e) => setInput({ ...input, started_on: e.target.value })} className={`w-full ${field} border rounded-xl p-2.5 text-sm`} />
            </label>
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fFrequency}
              <input type="text" value={input.frequency} onChange={(e) => setInput({ ...input, frequency: e.target.value })} placeholder={t.phFrequency} className={`w-full ${field} border rounded-xl p-2.5 text-sm`} />
            </label>
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fAffected}
              <input type="text" value={input.affected} onChange={(e) => setInput({ ...input, affected: e.target.value })} placeholder={t.phAffected} className={`w-full ${field} border rounded-xl p-2.5 text-sm`} />
            </label>
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fTried}
              <input type="text" value={input.already_tried} onChange={(e) => setInput({ ...input, already_tried: e.target.value })} placeholder={t.phTried} className={`w-full ${field} border rounded-xl p-2.5 text-sm`} />
            </label>
          </div>

          {editing && (
            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.fStatus}
              <select value={input.status} onChange={(e) => setInput({ ...input, status: e.target.value as ProblemStatus })} className={`w-full ${field} border rounded-xl p-2.5 text-sm`}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.statuses[s]}
                  </option>
                ))}
              </select>
            </label>
          )}

          {errorText && <p className="text-xs text-rose-300">{errorText}</p>}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setMode(editing && selected ? "detail" : "list")} className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2">
              {t.cancel}
            </button>
            {editing ? (
              <button type="button" onClick={() => save(null)} disabled={saving} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl px-4 py-2">
                {t.saveChanges}
              </button>
            ) : (
              <>
                <button type="button" onClick={() => save("draft")} disabled={saving} className="text-xs text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 disabled:opacity-60 rounded-xl px-4 py-2">
                  {t.saveDraft}
                </button>
                <button type="button" onClick={() => save("in_progress")} disabled={saving} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-xl px-4 py-2">
                  {t.saveWork}
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Detail */}
      {mode === "detail" && selected && (
        <section className={`p-5 rounded-2xl border space-y-5 ${surface}`}>
          <div className="space-y-2">
            <p className="text-lg font-semibold break-words">{titleOf(selected)}</p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <Pill>{categoryLabel(selected)}</Pill>
              <Pill>{t.priorities[selected.priority]}</Pill>
              <Pill>{t.statuses[selected.status]}</Pill>
              <Pill>{t.progress}: {progressPercent(selected)}%</Pill>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Field label={t.fDescription} value={selected.description || t.notSet} />
            <Field label={t.fOutcome} value={selected.desired_outcome || t.notSet} />
            <Field label={t.fStarted} value={selected.started_on || t.notSet} />
            <Field label={t.fFrequency} value={selected.frequency || t.notSet} />
            <Field label={t.fAffected} value={selected.affected || t.notSet} />
            <Field label={t.fTried} value={selected.already_tried || t.notSet} />
            <Field label={t.created} value={selected.created_at.slice(0, 10)} />
            <Field label={t.updated} value={selected.updated_at.slice(0, 10)} />
          </dl>

          {/* Eight stages. Only stage 1 is active in Round 1. */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <h4 className="text-sm font-bold text-indigo-400">{t.stagesHeading}</h4>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {t.stageNames.map((name, i) => {
                const n = i + 1;
                const status = stageStatusOf(selected, n);
                if (n === 1) {
                  return (
                    <li key={n}>
                      <div className={`p-3 rounded-xl border text-xs space-y-1 ${isDark ? "border-indigo-700 bg-indigo-950/30" : "border-indigo-300 bg-indigo-50"}`}>
                        <p className="font-semibold">
                          1. {name}: {t.stageStatuses[status]}
                        </p>
                        <p className={muted}>{stage1Ready(selected) ? t.stage1Ready : t.stage1NotReady}</p>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={n} aria-disabled="true" className={`p-3 rounded-xl border text-xs space-y-1 opacity-60 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    <p className="font-semibold">
                      {n}. {name}
                    </p>
                    <p className={muted}>{t.stageLater}</p>
                  </li>
                );
              })}
            </ol>

            <label className={`block text-xs space-y-1 ${muted}`}>
              {t.stageStatusLabel}: 1. {t.stageNames[0]}
              <select
                value={stageStatusOf(selected, 1)}
                onChange={(e) => changeStage1(e.target.value as StageStatus)}
                className={`w-full sm:w-72 ${field} border rounded-xl p-2.5 text-sm`}
              >
                {STAGE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.stageStatuses[s]}
                  </option>
                ))}
              </select>
            </label>
            {stageError && <p className="text-xs text-rose-300">{stageError}</p>}
            <p className={`text-[11px] ${muted}`}>{t.guideHint}</p>
          </div>

          {deleteStep ? (
            <div className="p-3 rounded-xl border border-rose-800 bg-rose-950/40 space-y-2 text-xs">
              <p className="font-bold text-rose-200">{t.deleteTitle}</p>
              <p className="text-rose-200">{t.deleteText}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => setDeleteStep(false)} className="text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                  {t.cancel}
                </button>
                <button type="button" onClick={confirmDelete} disabled={saving} className="text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-xl px-3 py-1.5">
                  {t.deleteConfirm}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setDeleteStep(true)} className="text-xs text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-xl px-4 py-2">
                {t.remove}
              </button>
              <button type="button" onClick={() => openForm(selected)} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2">
                {t.edit}
              </button>
            </div>
          )}
        </section>
      )}

      {/* List */}
      {mode === "list" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label={t.cardTotal} value={summary.total} surface={surface} />
            <Card label={t.cardInProgress} value={summary.inProgress} surface={surface} />
            <Card label={t.cardDrafts} value={summary.drafts} surface={surface} />
            <Card label={t.cardResolved} value={summary.resolved} surface={surface} />
          </div>

          <section className={`p-5 rounded-2xl border space-y-3 ${surface}`}>
            <h3 className="text-sm font-bold text-amber-300">{t.attentionTitle}</h3>
            {attention.length === 0 ? (
              <p className={`text-xs ${muted}`}>{t.attentionNone}</p>
            ) : (
              <ul className="space-y-2">
                {attention.map(({ p, reasons }) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => openDetail(p)} className={`w-full text-left p-3 rounded-xl border space-y-1 ${isDark ? "border-slate-800 hover:border-indigo-500" : "border-slate-200 hover:border-indigo-400"}`}>
                      <span className="block text-sm font-semibold break-words">{titleOf(p)}</span>
                      {reasons.map((r) => (
                        <span key={r} className={`block text-[11px] break-words ${muted}`}>
                          {reasonText(r)}
                        </span>
                      ))}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-400">{t.myProblems}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={t.search}
                aria-label={t.search}
                className={`${field} border rounded-xl p-2.5 text-sm md:col-span-3`}
              />
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as Category | "all" })} aria-label={t.allCategories} className={`${field} border rounded-xl p-2.5 text-sm`}>
                <option value="all">{t.allCategories}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as ProblemStatus | "all" })} aria-label={t.allStatuses} className={`${field} border rounded-xl p-2.5 text-sm`}>
                <option value="all">{t.allStatuses}</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.statuses[s]}
                  </option>
                ))}
              </select>
              <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority | "all" })} aria-label={t.allPriorities} className={`${field} border rounded-xl p-2.5 text-sm`}>
                <option value="all">{t.allPriorities}</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {t.priorities[p]}
                  </option>
                ))}
              </select>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value as "updated" | "priority" })} aria-label={t.sortUpdated} className={`${field} border rounded-xl p-2.5 text-sm`}>
                <option value="updated">{t.sortUpdated}</option>
                <option value="priority">{t.sortPriority}</option>
              </select>
            </div>

            {loading ? (
              <p className={`text-xs ${muted}`}>…</p>
            ) : items.length === 0 ? (
              <div className={`p-6 rounded-2xl border text-center space-y-3 ${surface}`}>
                <p className="text-sm font-semibold">{t.emptyTitle}</p>
                <p className={`text-xs ${muted}`}>{t.emptyText}</p>
                <button type="button" onClick={() => openForm(null)} className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2">
                  {t.emptyStart}
                </button>
              </div>
            ) : visible.length === 0 ? (
              <p className={`text-xs ${muted}`}>{t.attentionNone}</p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visible.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => openDetail(p)} className={`w-full h-full text-left p-4 rounded-2xl border space-y-2 ${surface} hover:border-indigo-500`}>
                      <span className="block text-sm font-semibold break-words">{titleOf(p)}</span>
                      <span className={`block text-[11px] break-words ${muted}`}>{categoryLabel(p)}</span>
                      {p.description && <span className={`block text-xs break-words line-clamp-2 ${muted}`}>{p.description}</span>}
                      <span className="flex flex-wrap gap-1.5 text-[11px]">
                        <Pill>{t.priorities[p.priority]}</Pill>
                        <Pill>{t.statuses[p.status]}</Pill>
                        <Pill>{t.progress}: {progressPercent(p)}%</Pill>
                      </span>
                      <span className={`block text-[11px] break-words ${muted}`}>
                        {t.nextAction}: {fmt(t.nextStageText, { n: p.current_stage, name: stageName(p.current_stage) })}
                      </span>
                      <span className={`block text-[11px] ${muted}`}>
                        {t.created}: {p.created_at.slice(0, 10)} · {t.updated}: {p.updated_at.slice(0, 10)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className={`text-[11px] ${muted}`}>{today}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Card({ label, value, surface }: { label: string; value: number; surface: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${surface}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2.5 py-1 rounded-full border border-slate-700 text-slate-300 bg-slate-800/60">{children}</span>;
}
