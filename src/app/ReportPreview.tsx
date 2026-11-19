"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Download, X } from "lucide-react";
import type { DocumentProps } from "@react-pdf/renderer";
import type { Lang } from "@/lib/i18n";
import { loadReportInput } from "@/lib/loadReport";
import {
  AUDIENCES,
  buildReport,
  hasDecision,
  shapeReport,
  type Audience,
  type ReportModel,
  type ReportScope,
  type ReportSection,
  type ReportVersion,
} from "@/lib/reportData";
import { REPORT_CHOOSER, REPORT_STRINGS, REPORT_UI, fill } from "@/lib/reportStrings";
import { challengeText } from "@/lib/challengeStrings";
import { todayKey } from "@/lib/planDates";

type Props = {
  lang: Lang;
  supabase: SupabaseClient;
  projectId: string;
  onClose: () => void;
};

const card = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";
const choice = (on: boolean) =>
  `rounded-xl border px-3 py-2 text-xs font-semibold transition ${
    on ? "border-indigo-400 bg-indigo-600 text-white" : "border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/20"
  }`;

// Lets the user choose the report type, audience, version and sections, then shows and downloads it.
export default function ReportPreview({ lang, supabase, projectId, onClose }: Props) {
  const s = REPORT_STRINGS[lang];
  const ui = REPORT_UI[lang];
  const ch = REPORT_CHOOSER[lang];
  const [full, setFull] = useState<ReportModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<ReportScope>("complete");
  const [audience, setAudience] = useState<Audience>("other");
  const [version, setVersion] = useState<ReportVersion>("internal");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadReportInput(supabase, projectId).then(({ input, error: loadError }) => {
      if (cancelled) return;
      if (loadError || !input) {
        setError(ui.notFound);
        return;
      }
      const model = buildReport(input);
      setFull(model);
      // A plan with no saved decision can only be an action plan report.
      if (!hasDecision(model)) setScope("action");
    });
    return () => {
      cancelled = true;
    };
  }, [supabase, projectId, ui.notFound]);

  const linked = full ? hasDecision(full) : false;

  // What the user has ticked: every section of this report type, before any were switched off.
  const checklist = useMemo(
    () => (full ? shapeReport(full, { scope, audience, version, excluded: new Set() }) : null),
    [full, scope, audience, version],
  );
  const shaped = useMemo(
    () => (full ? shapeReport(full, { scope, audience, version, excluded }) : null),
    [full, scope, audience, version, excluded],
  );

  const kindLabel = scope === "decision" ? ch.typeDecision : scope === "action" ? ch.typeAction : s.kind;

  const toggle = (kind: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  };

  // The PDF library and the report layout load only when the button is pressed.
  const download = async () => {
    if (!shaped) return;
    setBusy(true);
    setDownloadError(null);
    try {
      const [{ pdf }, { ReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/reportPdf"),
      ]);
      const doc = (
        <ReportDocument report={shaped} lang={lang} createdOn={todayKey()} kindLabel={kindLabel} />
      );
      const blob = await pdf(doc as React.ReactElement<DocumentProps>).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${scope}-report-${todayKey()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setDownloadError(ui.downloadFailed);
    } finally {
      setBusy(false);
    }
  };

  const sectionName = (kind: ReportSection["kind"]) => (kind === "budget" ? s.budgetHeading : s.sections[kind]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070b1f] text-slate-100">
      <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">{ui.preview}</p>
          <button type="button" onClick={onClose} aria-label={ui.close} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!full && !error && <p className="text-sm text-slate-300">{ui.loading}</p>}
        {error && <p className="text-sm text-rose-300">{error}</p>}

        {full && shaped && checklist && (
          <>
            <section className={`${card} p-4 space-y-4`}>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">{ch.typeLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {(["decision", "action", "complete"] as ReportScope[]).map((value) => {
                    const needsDecision = value !== "action" && !linked;
                    const label = value === "decision" ? ch.typeDecision : value === "action" ? ch.typeAction : ch.typeComplete;
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={needsDecision}
                        onClick={() => setScope(value)}
                        className={`${choice(scope === value)} disabled:opacity-40`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {!linked && <p className="text-xs text-amber-300">{ch.typeNeedsDecision}</p>}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">{ch.audienceLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCES.map((value) => (
                    <button key={value} type="button" onClick={() => setAudience(value)} className={choice(audience === value)}>
                      {ch.audience[value]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">{ch.versionLabel}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setVersion("internal")} className={choice(version === "internal")}>
                    {ch.versionInternal}
                  </button>
                  <button type="button" onClick={() => setVersion("presentation")} className={choice(version === "presentation")}>
                    {ch.versionPresentation}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {version === "internal" ? ch.versionInternalHint : ch.versionPresentationHint}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">{ch.includeLabel}</p>
                {checklist.sections.map((section) => (
                  <label key={section.kind} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!excluded.has(section.kind)}
                      onChange={() => toggle(section.kind)}
                      className="h-4 w-4 accent-indigo-500"
                    />
                    {sectionName(section.kind)}
                  </label>
                ))}
              </div>
            </section>

            <p className="text-xs text-slate-400">{ui.note}</p>
            {!linked && <p className="text-xs text-amber-300">{ui.noDecision}</p>}

            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              <Download className="w-4 h-4" /> {ui.download}
            </button>
            {downloadError && <p className="text-sm text-rose-300">{downloadError}</p>}

            <article className={`${card} p-5 space-y-5`}>
              <div>
                <h2 className="text-xl font-bold">{full.title}</h2>
                <p className="text-xs text-slate-400">{`${kindLabel} · ${fill(s.created, { date: todayKey() })}`}</p>
              </div>
              {shaped.sections.map((section, i) => (
                <SectionPreview key={`${section.kind}-${i}`} section={section} s={s} lang={lang} />
              ))}
            </article>
          </>
        )}
      </div>
    </div>
  );
}

function SectionPreview({
  section,
  s,
  lang,
}: {
  section: ReportSection;
  s: (typeof REPORT_STRINGS)[Lang];
  lang: Lang;
}) {
  const heading = (text: string) => <h3 className="text-sm font-bold text-indigo-300">{text}</h3>;
  const row = (label: string, value: string) => (
    <div className="flex gap-3 text-sm">
      <span className="w-36 shrink-0 font-semibold text-slate-400">{label}</span>
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );

  switch (section.kind) {
    case "summary":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.summary)}
          {section.rows.map((r) => row(s.labels[r.label], r.value ?? ""))}
        </section>
      );

    case "decision":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.decision)}
          {row(s.labels.question, section.question)}
          {section.reason && row(s.labels.reason, section.reason)}
          {section.options.length > 0 && row(s.labels.options, section.options.join(", "))}
        </section>
      );

    case "analysis":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.analysis)}
          {section.criteria.map((c, i) => (
            <p key={i} className="text-sm">
              {`${c.name} — ${s.labels.weight} ${c.weight}${c.inverted ? ` (${s.labels.inverted})` : ""}`}
            </p>
          ))}
          <p className="pt-1 text-xs font-semibold text-slate-400">{s.labels.ranking}</p>
          {section.ranking.map((r, i) => (
            <p key={i} className="text-sm">{`${i + 1}. ${r.name} — ${r.score}`}</p>
          ))}
        </section>
      );

    case "choice":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.choice)}
          {section.chosen && row(s.labels.chosen, section.chosen)}
          {section.recommended && row(s.labels.recommended, section.recommended)}
        </section>
      );

    case "stages":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.stages)}
          <p className="text-sm">{fill(s.labels.progress, { done: section.done, total: section.total })}</p>
          {section.groups.map((g, gi) => (
            <div key={gi} className="space-y-1 pt-1">
              <p className="text-sm font-semibold">{g.title ?? s.labels.unstaged}</p>
              {g.tasks.map((t, ti) => (
                <div key={ti} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span>{t.title}</span>
                  <span className="text-xs text-slate-400">
                    {[s.statuses[t.status], t.due ? fill(s.labels.due, { date: t.due }) : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </section>
      );

    case "budget":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.budgetHeading)}
          {section.budget && row(s.labels.budget, section.budget)}
          {section.resources && row(s.labels.resources, section.resources)}
        </section>
      );

    case "risks":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.risks)}
          {section.items.map((c, i) => (
            <p key={i} className="text-sm">{`• ${challengeText(lang, c).body}`}</p>
          ))}
        </section>
      );

    case "outcome":
      return (
        <section className="space-y-2 border-t border-slate-700/60 pt-4">
          {heading(s.sections.outcome)}
          {section.outcome && row(s.labels.outcome, section.outcome)}
          {section.lessons && row(s.labels.lessons, section.lessons)}
        </section>
      );
  }
}
