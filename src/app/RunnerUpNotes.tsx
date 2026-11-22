import React from "react";
import { fmt, type Lang } from "@/lib/i18n";
import { contributions, type Criterion, type Option } from "@/lib/explainRanking";
import { singleChangeToLevel } from "@/lib/decisionInsight";
import { OPTION_NOTES_STRINGS } from "@/lib/optionNotesStrings";

type Props = {
  lang: Lang;
  criteria: Criterion[];
  // The option in second place, and the winner it is compared with.
  option: Option & { score: number };
  winner: Option & { score: number };
};

// Notes for the option in second place. They describe this option only, against the winner, using the same points.
export default function RunnerUpNotes({ lang, criteria, option, winner }: Props) {
  const s = OPTION_NOTES_STRINGS[lang];
  const mine = contributions(criteria, option);
  const theirs = contributions(criteria, winner);
  const diffs = mine.map((m, i) => ({ name: m.name, diff: m.points - theirs[i].points }));
  const beats = diffs.filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, 2);
  const behind = diffs.filter((d) => d.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, 2);
  const strongest = [...mine].sort((a, b) => b.points - a.points).slice(0, 2);
  const weakest = [...mine].sort((a, b) => a.points - b.points).slice(0, 2);
  const change = singleChangeToLevel(criteria, option, winner);

  const line = (name: string, n: number) => fmt(s.pointsLine, { name: name || "–", n: Math.round(n) });

  return (
    <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
      {beats.length > 0 && (
        <div className="space-y-1">
          <p className="font-semibold text-emerald-300">{s.beatsWinner}</p>
          {beats.map((d) => (
            <p key={`b-${d.name}`} className="text-slate-400">{line(d.name, d.diff)}</p>
          ))}
        </div>
      )}
      {behind.length > 0 && (
        <div className="space-y-1">
          <p className="font-semibold text-rose-300">{s.behindWinner}</p>
          {behind.map((d) => (
            <p key={`x-${d.name}`} className="text-slate-400">{line(d.name, d.diff)}</p>
          ))}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-semibold text-slate-300">{s.strongest}</p>
        {strongest.map((p) => (
          <p key={`s-${p.criterionId}`} className="text-slate-400">{line(p.name, p.points)}</p>
        ))}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-slate-300">{s.weakest}</p>
        {weakest.map((p) => (
          <p key={`w-${p.criterionId}`} className="text-slate-500">{line(p.name, p.points)}</p>
        ))}
      </div>
      <p className="text-indigo-200">
        {change
          ? fmt(s.toLevel, { name: change.criterionName || "–", from: change.from, to: change.to })
          : s.noSingle}
      </p>
    </div>
  );
}
