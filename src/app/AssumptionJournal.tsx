"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fmt, type Lang } from "@/lib/i18n";
import { todayKey } from "@/lib/planDates";
import {
  CATEGORIES,
  IMPORTANCE,
  STATUSES,
  attentionFor,
  createAssumption,
  deleteAssumption,
  evidenceCount,
  isReviewOverdue,
  linkColumns,
  linkValue,
  loadAssumptions,
  loadLinkOptions,
  matchesFilters,
  sortForAttention,
  summarise,
  updateAssumption,
  validateAssumption,
  type Assumption,
  type Category,
  type Filters,
  type Importance,
  type JournalStatus,
  type LinkOption,
  type ValidationKey,
} from "@/lib/assumptionJournal";
import { JOURNAL_STRINGS } from "@/lib/assumptionJournalStrings";

type Props = {
  lang: Lang;
  sb: SupabaseClient;
  userId: string;
  isDark: boolean;
  onBack: () => void;
};

type Mode = "list" | "form" | "detail";

const EMPTY_FILTERS: Filters = { search: "", category: "all", status: "all", importance: "all" };

export default function AssumptionJournal({ lang, sb, userId, isDark, onBack }: Props) {
  const t = JOURNAL_STRINGS[lang];
  const surface = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";
  const field = isDark
    ? "bg-slate-950 border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
    : "bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500";

  const [items, setItems] = useState<Assumption[]>([]);
  const [links, setLinks] = useState<LinkOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<Assumption | null>(null);
  const [editing, setEditing] = useState(false);

  // Form fields
  const [statement, setStatement] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [link, setLink] = useState("");
  const [importance, setImportance] = useState<Importance | "">("");
  const [confidence, setConfidence] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [status, setStatus] = useState<JournalStatus>("unvalidated");
  const [formError, setFormError] = useState<ValidationKey | "saveError" | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete flow
  const [deleteStep, setDeleteStep] = useState<null | { count: number }>(null);

  const today = todayKey();

  async function reload() {
    setLoading(true);
    const [a, l] = await Promise.all([loadAssumptions(sb, userId), loadLinkOptions(sb, userId)]);
    setItems(a.data);
    setLoadError(a.error);
    setLinks(l);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // Loads once when the journal opens. Later changes reload explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const linkName = (a: Assumption) => links.find((l) => l.value === linkValue(a))?.label ?? "";
  const summary = useMemo(() => summarise(items), [items]);
  const attention = useMemo(() => sortForAttention(items).filter((a) => attentionFor(a)), [items]);
  const visible = useMemo(
    () => sortForAttention(items).filter((a) => matchesFilters(a, filters, linkName(a))),
    // linkName depends on links, so links is listed as well.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, filters, links],
  );

  function openForm(a: Assumption | null) {
    setFormError(null);
    setNotice(null);
    setEditing(!!a);
    setStatement(a?.statement ?? "");
    setCategory(a?.category ?? "");
    setLink(a ? linkValue(a) : "");
    setImportance(a?.importance ?? "");
    setConfidence(a?.confidence !== null && a?.confidence !== undefined ? String(a.confidence) : "");
    setReviewDate(a?.review_date ?? "");
    setNextAction(a?.next_validation_action ?? "");
    setStatus(a?.status ?? "unvalidated");
    setMode("form");
  }

  function openDetail(a: Assumption) {
    setSelected(a);
    setDeleteStep(null);
    setNotice(null);
    setMode("detail");
  }

  async function save() {
    const confidenceValue = confidence.trim() === "" ? null : Number(confidence);
    const input = {
      statement,
      importance: (importance || null) as Importance | null,
      confidence: confidenceValue,
      category: (category || null) as Category | null,
      review_date: reviewDate || null,
      next_validation_action: nextAction,
      ...linkColumns(link),
    };
    const problem = validateAssumption(input);
    if (problem) {
      setFormError(problem);
      return;
    }
    setSaving(true);
    setFormError(null);
    const result =
      editing && selected
        ? await updateAssumption(sb, selected.id, input, status)
        : await createAssumption(sb, userId, input);
    setSaving(false);
    if (result.error) {
      setFormError("saveError");
      return;
    }
    setNotice(t.saved);
    await reload();
    setSelected(null);
    setMode("list");
  }

  async function confirmDelete() {
    if (!selected) return;
    setSaving(true);
    const result = await deleteAssumption(sb, selected.id);
    setSaving(false);
    if (result.error) {
      setNotice(t.saveError);
      return;
    }
    setSelected(null);
    setDeleteStep(null);
    await reload();
    setMode("list");
  }

  async function askDelete() {
    if (!selected) return;
    const count = await evidenceCount(sb, selected.id);
    setDeleteStep({ count });
  }

  const errorText = formError ? t[formError === "saveError" ? "saveError" : formError] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1 min-w-0">
          <button type="button" onClick={mode === "list" ? onBack : () => setMode("list")} className="text-xs text-slate-400 hover:text-slate-200">
            ← {t.back}
          </button>
          <h2 className="text-2xl font-bold break-words">{t.title}</h2>
          <p className="text-xs text-slate-400">{t.subtitle}</p>
        </div>
        {mode === "list" && (
          <button
            type="button"
            onClick={() => openForm(null)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
          >
            {t.add}
          </button>
        )}
      </div>

      {notice && <p className="text-xs text-emerald-300">{notice}</p>}
      {loadError && <p className="text-xs text-rose-300">{loadError}</p>}

      {/* Form: add or edit */}
      {mode === "form" && (
        <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
          <h3 className="text-sm font-bold text-indigo-400">{editing ? t.edit : t.add}</h3>

          <label className="block text-xs text-slate-400 space-y-1">
            {t.statement}
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder={t.statementPlaceholder}
              rows={2}
              className={`w-full ${field} border rounded-xl p-2.5 text-sm`}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-xs text-slate-400 space-y-1">
              {t.link}
              {links.length === 0 ? (
                <p className="text-[11px] text-amber-300">{t.noLinks}</p>
              ) : (
                <select value={link} onChange={(e) => setLink(e.target.value)} className={`w-full ${field} border rounded-xl p-2.5 text-xs`}>
                  <option value="">{t.linkPlaceholder}</option>
                  {links.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label || "—"}
                    </option>
                  ))}
                </select>
              )}
            </label>
            <label className="block text-xs text-slate-400 space-y-1">
              {t.category}
              <select value={category} onChange={(e) => setCategory(e.target.value as Category | "")} className={`w-full ${field} border rounded-xl p-2.5 text-xs`}>
                <option value="">{t.notSet}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400 space-y-1">
              {t.importance}
              <select value={importance} onChange={(e) => setImportance(e.target.value as Importance | "")} className={`w-full ${field} border rounded-xl p-2.5 text-xs`}>
                <option value="">{t.notSet}</option>
                {IMPORTANCE.map((i) => (
                  <option key={i} value={i}>
                    {t.importanceLabels[i]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400 space-y-1">
              {t.confidence}
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
              />
              <span className="block text-[11px] text-slate-500">{t.confidenceHelp}</span>
            </label>
            <label className="block text-xs text-slate-400 space-y-1">
              {t.reviewDate}
              <input type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} className={`w-full ${field} border rounded-xl p-2.5 text-xs`} />
            </label>
            {editing && (
              <label className="block text-xs text-slate-400 space-y-1">
                {t.status}
                <select value={status} onChange={(e) => setStatus(e.target.value as JournalStatus)} className={`w-full ${field} border rounded-xl p-2.5 text-xs`}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t.statuses[s]}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <label className="block text-xs text-slate-400 space-y-1">
            {t.nextAction}
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder={t.nextActionPlaceholder}
              className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
            />
          </label>

          {errorText && <p className="text-xs text-rose-300">{errorText}</p>}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setMode(editing ? "detail" : "list")} className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2">
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || links.length === 0}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 rounded-xl px-4 py-2"
            >
              {t.save}
            </button>
          </div>
        </section>
      )}

      {/* Detail */}
      {mode === "detail" && selected && (
        <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
          <p className="text-base font-semibold break-words">{selected.statement}</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Field label={t.link} value={linkName(selected) || t.notSet} />
            <Field label={t.category} value={selected.category ? t.categories[selected.category] : t.notSet} />
            <Field label={t.importance} value={selected.importance ? t.importanceLabels[selected.importance] : t.notSet} />
            <Field label={t.confidence} value={selected.confidence !== null ? `${selected.confidence}%` : t.notSet} />
            <Field label={t.status} value={t.statuses[selected.status]} />
            <Field label={t.reviewDate} value={selected.review_date ?? t.notSet} />
            <Field label={t.nextAction} value={selected.next_validation_action || t.notSet} />
            <Field label={t.evidence} value={t.detailNote} />
          </dl>

          {deleteStep ? (
            <div className="p-3 rounded-xl border border-rose-800 bg-rose-950/40 space-y-2 text-xs">
              <p className="font-bold text-rose-200">{t.deleteTitle}</p>
              <p className="text-rose-200">{t.deleteText}</p>
              {deleteStep.count > 0 && <p className="text-rose-200">{fmt(t.deleteWithEvidence, { n: deleteStep.count })}</p>}
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => setDeleteStep(null)} className="text-xs text-slate-300 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
                  {t.cancel}
                </button>
                <button type="button" onClick={confirmDelete} disabled={saving} className="text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-xl px-3 py-1.5">
                  {t.deleteConfirm}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={askDelete} className="text-xs text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-xl px-4 py-2">
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
            <Card label={t.cardUntested} value={summary.untested} surface={surface} />
            <Card label={t.cardTesting} value={summary.testing} surface={surface} />
            <Card label={t.cardValidated} value={summary.validated} surface={surface} />
          </div>

          <section className={`p-4 rounded-2xl border space-y-3 ${surface}`}>
            <h3 className="text-sm font-bold text-amber-300">{t.alertHeading}</h3>
            {attention.length === 0 ? (
              <p className="text-xs text-slate-400">{t.alertNone}</p>
            ) : (
              <ul className="space-y-2">
                {attention.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => openDetail(a)} className="w-full text-left p-3 rounded-xl border border-amber-800/60 bg-amber-950/30 hover:bg-amber-950/50">
                      <span className="block text-xs font-semibold text-amber-200 break-words">{a.statement}</span>
                      <span className="block text-[11px] text-amber-300/80">
                        {attentionFor(a) === "high" ? t.alertHigh : t.alertReview}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-400">{t.yourAssumptions}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder={t.searchPlaceholder}
                className={`md:col-span-1 ${field} border rounded-xl p-2.5 text-xs`}
              />
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as Category | "all" })} className={`${field} border rounded-xl p-2.5 text-xs`}>
                <option value="all">{t.allCategories}</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as JournalStatus | "all" })} className={`${field} border rounded-xl p-2.5 text-xs`}>
                <option value="all">{t.allStatuses}</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t.statuses[s]}
                  </option>
                ))}
              </select>
              <select value={filters.importance} onChange={(e) => setFilters({ ...filters, importance: e.target.value as Importance | "all" })} className={`${field} border rounded-xl p-2.5 text-xs`}>
                <option value="all">{t.allImportance}</option>
                {IMPORTANCE.map((i) => (
                  <option key={i} value={i}>
                    {t.importanceLabels[i]}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">{t.loading}</p>
            ) : items.length === 0 ? (
              <div className={`p-6 rounded-2xl border text-center space-y-1 ${surface}`}>
                <p className="text-sm font-semibold">{t.emptyTitle}</p>
                <p className="text-xs text-slate-400">{t.emptyText}</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visible.map((a) => {
                  const attn = attentionFor(a);
                  return (
                    <li key={a.id}>
                      <button type="button" onClick={() => openDetail(a)} className={`w-full h-full text-left p-4 rounded-2xl border space-y-2 ${surface} hover:border-indigo-500`}>
                        <span className="block text-sm font-semibold break-words">{a.statement}</span>
                        <span className="block text-[11px] text-slate-400 break-words">
                          {[a.category ? t.categories[a.category] : null, linkName(a) || null].filter(Boolean).join(" · ") || t.notSet}
                        </span>
                        <span className="flex flex-wrap gap-1.5 text-[11px]">
                          <Pill>{t.importance}: {a.importance ? t.importanceLabels[a.importance] : t.notSet}</Pill>
                          <Pill>{t.confidence}: {a.confidence !== null ? `${a.confidence}%` : t.notSet}</Pill>
                          <Pill>{t.statuses[a.status]}</Pill>
                          {attn && <Pill tone="amber">{attn === "high" ? t.alertHigh : t.alertReview}</Pill>}
                          {isReviewOverdue(a, today) && <Pill tone="rose">{t.overdue}</Pill>}
                        </span>
                        <span className="block text-[11px] text-slate-400 break-words">
                          {a.review_date ? `${t.reviewDate}: ${a.review_date}` : `${t.reviewDate}: ${t.notSet}`}
                          {a.next_validation_action ? ` · ${a.next_validation_action}` : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Card({ label, value, surface }: { label: string; value: number; surface: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${surface}`}>
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-slate-100 break-words">{value}</dd>
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "amber" | "rose" }) {
  const cls =
    tone === "amber"
      ? "bg-amber-950/60 border-amber-800 text-amber-200"
      : tone === "rose"
        ? "bg-rose-950/60 border-rose-800 text-rose-200"
        : "bg-slate-800/60 border-slate-700 text-slate-300";
  return <span className={`px-2 py-0.5 rounded-full border ${cls}`}>{children}</span>;
}
