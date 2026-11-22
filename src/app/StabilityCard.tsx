import React, { useMemo } from "react";
import { fmt, type Lang } from "@/lib/i18n";
import type { Criterion, Option } from "@/lib/explainRanking";
import { analyseStability, type Stability } from "@/lib/sensitivityAnalysis";
import { STABILITY_STRINGS } from "@/lib/stabilityStrings";

type Props = {
  lang: Lang;
  criteria: Criterion[];
  original: (Option & { score: number })[];
  rankFor: (weights: Record<string, number>) => (Option & { score: number })[];
  surface: string;
};

// Colours follow the existing decision check card.
const TONE: Record<Stability, string> = {
  stable: "border-emerald-700 bg-emerald-950/30 text-emerald-200",
  sensitive: "border-sky-700 bg-sky-950/40 text-sky-200",
  highly_sensitive: "border-amber-700 bg-amber-950/40 text-amber-200",
};

// Runs the stability check on the results screen. It is calculated, not guessed, and it never saves anything.
export default function StabilityCard({ lang, criteria, original, rankFor, surface }: Props) {
  const s = STABILITY_STRINGS[lang];
  const result = useMemo(() => analyseStability(criteria, original, rankFor), [criteria, original, rankFor]);
  if (original.length < 2 || result.tested === 0) return null;

  return (
    <section className={`p-5 rounded-2xl border space-y-3 ${surface}`}>
      <h3 className="text-sm font-bold text-indigo-400">{s.heading}</h3>
      <div className={`p-4 rounded-xl border space-y-2 text-sm ${TONE[result.stability]}`}>
        <p className="font-bold">{s.label[result.stability]}</p>
        <p className="text-xs">{s.text[result.stability]}</p>
        {result.findings.length > 0 ? (
          <ul className="list-disc list-inside text-xs space-y-1">
            {result.findings.map((f) => (
              <li key={`${f.criterionId}:${f.direction}`}>
                {fmt(f.direction === "raise" ? s.raise : s.lower, {
                  name: f.criterionName || "–",
                  n: f.step,
                  other: f.newWinnerName,
                })}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">{s.none}</p>
        )}
      </div>
      <p className="text-[11px] text-slate-400">{fmt(s.tested, { tested: result.tested })}</p>
      <p className="text-[11px] text-slate-400">{s.note}</p>
    </section>
  );
}
