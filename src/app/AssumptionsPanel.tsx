"use client";

import { JOURNAL_STRINGS } from "@/lib/assumptionJournalStrings";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import type { ChallengeAssumption } from "@/lib/intelligence";
import { INTEL_STRINGS } from "@/lib/intelligenceStrings";

type Status = "unvalidated" | "testing" | "supported" | "contradicted" | "validated" | "dismissed";
type Props = {
  lang: Lang;
  assumptions: ChallengeAssumption[];
  field: string;
  onAdd: (statement: string) => void;
  onStatus: (id: string, status: Status) => void;
  onEvidence: (id: string, stance: "supports" | "opposes", content: string) => void;
};

// The assumptions a plan depends on, and the evidence for and against each one.
// The user records these. The app never fills them in.
export default function AssumptionsPanel({ lang, assumptions, field, onAdd, onStatus, onEvidence }: Props) {
  const copy = INTEL_STRINGS[lang];
  const [statement, setStatement] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { stance: "supports" | "opposes"; content: string }>>({});
  const statuses: Status[] = ["unvalidated", "testing", "supported", "contradicted", "validated", "dismissed"];
  // "Testing" is shown in the same language as the Assumption Journal. It is one shared status, not a second system.
  const statusLabel = (s: Status) => (s === "testing" ? JOURNAL_STRINGS[lang].statuses.testing : copy.assumptionStatus[s]);

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">{copy.assumptionsHeading}</h3>
      <div className="flex flex-wrap gap-2">
        <input
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder={copy.statementPlaceholder}
          maxLength={300}
          className={`flex-1 min-w-[12rem] ${field} border rounded-lg px-3 py-1.5 text-xs`}
        />
        <button
          type="button"
          disabled={!statement.trim()}
          onClick={() => {
            onAdd(statement);
            setStatement("");
          }}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg"
        >
          {copy.add}
        </button>
      </div>

      <ul className="space-y-4">
        {assumptions.map((a) => {
          const draft = drafts[a.id] ?? { stance: "supports" as const, content: "" };
          return (
            <li key={a.id} className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-slate-200">{a.statement}</p>
                <select
                  value={a.status}
                  onChange={(e) => onStatus(a.id, e.target.value as Status)}
                  className={`${field} border rounded-lg px-2 py-1 text-xs`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              {a.evidence.length > 0 && (
                <ul className="space-y-1">
                  {a.evidence.map((e, i) => (
                    <li key={e.id ?? i} className="text-xs text-slate-400">
                      <span className={e.stance === "supports" ? "text-emerald-300" : "text-rose-300"}>
                        {e.stance === "supports" ? copy.supports : copy.opposes}:
                      </span>{" "}
                      {e.content}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                <select
                  value={draft.stance}
                  onChange={(e) => setDrafts({ ...drafts, [a.id]: { ...draft, stance: e.target.value as "supports" | "opposes" } })}
                  className={`${field} border rounded-lg px-2 py-1 text-xs`}
                >
                  <option value="supports">{copy.supports}</option>
                  <option value="opposes">{copy.opposes}</option>
                </select>
                <input
                  value={draft.content}
                  onChange={(e) => setDrafts({ ...drafts, [a.id]: { ...draft, content: e.target.value } })}
                  placeholder={copy.evidencePlaceholder}
                  maxLength={300}
                  className={`flex-1 min-w-[10rem] ${field} border rounded-lg px-2 py-1 text-xs`}
                />
                <button
                  type="button"
                  disabled={!draft.content.trim()}
                  onClick={() => {
                    onEvidence(a.id, draft.stance, draft.content);
                    setDrafts({ ...drafts, [a.id]: { stance: draft.stance, content: "" } });
                  }}
                  className="text-xs text-indigo-300 hover:text-white disabled:opacity-40"
                >
                  {copy.addEvidence}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
