import React, { useMemo, useState } from "react";
import { fmt, type Lang } from "@/lib/i18n";
import type { Criterion, Option } from "@/lib/explainRanking";
import { SENS_STRINGS } from "@/lib/sensitivityStrings";

type Scored = Option & { score: number };

type Props = {
  lang: Lang;
  criteria: Criterion[];
  // The results as the user saved or entered them. This is never changed by this panel.
  original: Scored[];
  // The calculator's own ranking, run with other weights. Passed in so there is only one scoring engine.
  rankFor: (weights: Record<string, number>) => Scored[];
  surface: string;
};

// Manual Decision Sensitivity. The user tries other priorities and sees whether the winner changes.
// Trial weights live only in this component's state. Nothing is saved, and the original results stay on screen.
export default function SensitivityPanel({ lang, criteria, original, rankFor, surface }: Props) {
  const s = SENS_STRINGS[lang];
  const [open, setOpen] = useState(false);
  const [trial, setTrial] = useState<Record<string, number>>({});

  const weights = useMemo(
    () => Object.fromEntries(criteria.map((c) => [c.id, trial[c.id] ?? c.weight ?? 0])) as Record<string, number>,
    [criteria, trial],
  );
  const totalTrial = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const trialRanked = open && totalTrial > 0 ? rankFor(weights) : [];

  const originalWinner = original[0];
  const trialWinner = trialRanked[0];
  const winnerChanged = !!trialWinner && !!originalWinner && trialWinner.id !== originalWinner.id;
  const originalScore = (id: string) => original.find((o) => o.id === id)?.score ?? 0;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left p-3 rounded-xl border border-indigo-800/50 bg-indigo-950/30 text-indigo-200 text-xs font-bold hover:bg-indigo-900/40"
      >
        ⚡ {s.open}
      </button>
    );
  }

  return (
    <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-indigo-400">⚡ {s.open}</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-200">
          {s.close}
        </button>
      </div>
      <p className="text-[11px] text-slate-400">{s.intro}</p>

      <div className="space-y-3">
        {criteria.map((c) => {
          const value = weights[c.id] ?? 0;
          const share = totalTrial > 0 ? Math.round((value / totalTrial) * 100) : 0;
          return (
            <div key={c.id} className="space-y-1">
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-slate-300 break-words">{c.name || "–"}</span>
                <span className="text-slate-400 whitespace-nowrap">{fmt(s.share, { n: share })}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(100, c.weight || 0)}
                step={1}
                value={value}
                aria-label={`${s.trialWeight}: ${c.name}`}
                onChange={(e) => setTrial((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))}
                className="w-full accent-indigo-500"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setTrial({})}
          className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5"
        >
          {s.reset}
        </button>
      </div>

      {totalTrial <= 0 ? (
        <p className="text-xs text-amber-300">{s.noWeight}</p>
      ) : (
        trialWinner &&
        originalWinner && (
          <div className="space-y-3">
            <p className={`text-sm ${winnerChanged ? "text-amber-200" : "text-emerald-300"}`}>
              {winnerChanged
                ? fmt(s.changes, { name: trialWinner.name, score: trialWinner.score, orig: originalWinner.name })
                : fmt(s.stays, { name: trialWinner.name, score: trialWinner.score })}
            </p>
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-1">{s.scoresHeading}</h4>
              <ul className="space-y-1 text-xs">
                {trialRanked.map((o) => (
                  <li key={o.id} className="flex justify-between gap-3">
                    <span className="text-slate-300 break-words">{o.name}</span>
                    <span className="text-slate-100 whitespace-nowrap">
                      {o.score}/100{" "}
                      <span className="text-slate-500">({fmt(s.was, { n: originalScore(o.id) })})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}
    </section>
  );
}
