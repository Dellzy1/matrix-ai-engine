import React from "react";
import { fmt, type Lang } from "@/lib/i18n";
import type { Criterion, Option } from "@/lib/explainRanking";
import {
  CLOSE_GAP,
  NO_STRONG_BELOW,
  classifyDecision,
  comparisonRows,
  winnerContrast,
  type Classification,
} from "@/lib/decisionInsight";
import { INSIGHT_STRINGS } from "@/lib/insightStrings";
import { OPTION_NOTES_STRINGS } from "@/lib/optionNotesStrings";
import { pointsTotals } from "@/lib/decisionInsight";

type Props = {
  lang: Lang;
  criteria: Criterion[];
  // Options already sorted by score, highest first.
  ranked: (Option & { score: number })[];
  surface: string;
};

// Colours follow the existing warning and success cards.
const TONE: Record<Classification, string> = {
  no_strong_option: "border-amber-700 bg-amber-950/40 text-amber-200",
  close_decision: "border-sky-700 bg-sky-950/40 text-sky-200",
  clear_winner: "border-emerald-700 bg-emerald-950/30 text-emerald-200",
};

// The decision check: how strong the winner is, how sure the result is, and how every option compares.
// Every number comes from the same arithmetic as the ranking. Nothing here is estimated.
export default function DecisionInsight({ lang, criteria, ranked, surface }: Props) {
  const s = INSIGHT_STRINGS[lang];
  if (ranked.length === 0) return null;

  const insight = classifyDecision(ranked.map((o) => o.score));
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const contrast = winnerContrast(criteria, winner, runnerUp);
  const rows = comparisonRows(criteria, ranked);
  const n = OPTION_NOTES_STRINGS[lang];
  const totalMax = rows.reduce((sum, r) => sum + r.max, 0);

  const text =
    insight.classification === "no_strong_option"
      ? fmt(s.noStrong, { min: NO_STRONG_BELOW })
      : insight.lead === null
        ? s.single
        : insight.classification === "close_decision"
          ? fmt(s.close, { name: winner.name, n: insight.lead, gap: CLOSE_GAP })
          : fmt(s.clear, { name: winner.name, n: insight.lead });

  return (
    <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
      <h3 className="text-sm font-bold text-indigo-400">{s.heading}</h3>

      <div className={`p-4 rounded-xl border space-y-2 text-sm ${TONE[insight.classification]}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">{s.classLabel[insight.classification]}</span>
          <span className="text-xs">
            {s.confidence}: <span className="font-bold">{s.confidenceLevel[insight.confidence]}</span>
          </span>
        </div>
        <p className="text-xs">{text}</p>
        <p className="text-xs opacity-90">{n.meaning[insight.classification]}</p>
        {contrast?.gain && (
          <p className="text-xs text-emerald-300">
            {fmt(s.leads, { name: contrast.gain.name, n: Math.round(contrast.gain.diff), other: runnerUp.name })}
          </p>
        )}
        {contrast?.loss && (
          <p className="text-xs text-rose-300">
            {fmt(s.falls, { name: contrast.loss.name, n: Math.round(-contrast.loss.diff), other: runnerUp.name })}
          </p>
        )}
        <p className="text-[11px] opacity-80">{s.confidenceNote}</p>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300">{s.comparisonHeading}</h4>
        <p className="text-[11px] text-slate-400">{s.comparisonHint}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] text-xs">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="py-1.5 pr-2 font-semibold">{s.criterion}</th>
                <th className="py-1.5 px-2 text-right font-semibold whitespace-nowrap">{s.max}</th>
                {ranked.map((o) => (
                  <th key={o.id} className="py-1.5 px-2 text-right font-semibold break-words">
                    {o.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.criterionId} className="border-t border-slate-800 align-top">
                  <td className="py-1.5 pr-2 text-slate-300 break-words">
                    {row.name || "–"}
                    {row.inverted ? s.lowerIsBetter : ""}
                    <span className="block text-[10px] text-slate-500">{fmt(s.weight, { n: row.share })}</span>
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-400 whitespace-nowrap">{Math.round(row.max)}</td>
                  {row.points.map((p, i) => (
                    <td
                      key={ranked[i].id}
                      className={`py-1.5 px-2 text-right whitespace-nowrap ${row.best[i] ? "font-bold text-emerald-300" : "text-slate-300"}`}
                    >
                      {Math.round(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-slate-600 font-semibold">
                <td className="py-1.5 pr-2 text-slate-200">{n.totalPoints}</td>
                <td className="py-1.5 px-2 text-right text-slate-400 whitespace-nowrap">{Math.round(totalMax)}</td>
                {ranked.map((o) => (
                  <td key={o.id} className="py-1.5 px-2 text-right text-slate-100 whitespace-nowrap">
                    {Math.round(pointsTotals(criteria, o).earned)}
                  </td>
                ))}
              </tr>
              <tr className="font-bold">
                <td className="py-1.5 pr-2 text-slate-100">{n.finalScore}</td>
                <td className="py-1.5 px-2 text-right text-slate-400 whitespace-nowrap">100</td>
                {ranked.map((o) => (
                  <td key={o.id} className="py-1.5 px-2 text-right text-slate-100 whitespace-nowrap">
                    {o.score}/100
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
