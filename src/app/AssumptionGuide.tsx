"use client";

import React, { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { fmt } from "@/lib/i18n";
import { GUIDE_STRINGS } from "@/lib/assumptionGuideStrings";

type Props = {
  lang: Lang;
  isDark: boolean;
  mode: "welcome" | "guide";
  onStart: () => void; // welcome: start the guide
  onSkip: () => void; // welcome: dismiss it
  onClose: () => void; // guide: close it
};

// Optional guide for the Assumption Journal. It only explains existing features and changes no data.
export default function AssumptionGuide({ lang, isDark, mode, onStart, onSkip, onClose }: Props) {
  const g = GUIDE_STRINGS[lang];
  const [step, setStep] = useState(0);
  const surface = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const button = "text-xs rounded-xl px-4 py-2 border";
  const primary = `${button} font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border-indigo-500`;
  const secondary = `${button} ${isDark ? "text-slate-300 bg-slate-800 border-slate-700" : "text-slate-700 bg-slate-100 border-slate-300"}`;

  if (mode === "welcome") {
    return (
      <section className={`p-5 rounded-2xl border space-y-3 ${surface}`}>
        <h3 className="text-sm font-bold text-indigo-400">{g.welcomeTitle}</h3>
        <p className={`text-xs leading-relaxed ${muted}`}>{g.welcomeBody}</p>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onSkip} className={secondary}>
            {g.skip}
          </button>
          <button type="button" onClick={onStart} className={primary}>
            {g.start}
          </button>
        </div>
      </section>
    );
  }

  const stage = g.stages[step];
  const last = step === g.stages.length - 1;

  return (
    <section className={`p-5 rounded-2xl border space-y-4 ${surface}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-indigo-400">{g.guideTitle}</h3>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
          {g.close}
        </button>
      </div>

      {/* Five stages. Each one can be opened directly. */}
      <ol className="grid grid-cols-5 gap-1.5">
        {g.stages.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={`w-full text-[11px] rounded-lg px-1 py-1.5 border break-words ${
                i === step
                  ? "border-indigo-500 text-indigo-200 bg-indigo-950/50"
                  : isDark
                    ? "border-slate-800 text-slate-400"
                    : "border-slate-300 text-slate-600"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          </li>
        ))}
      </ol>

      <div className="space-y-3">
        <p className="text-[11px] text-slate-400">{fmt(g.stepOf, { n: step + 1 })}</p>
        <h4 className="text-base font-semibold break-words">{stage.title}</h4>
        <p className="text-sm break-words">{stage.question}</p>
        <ul className={`list-disc pl-5 space-y-1 text-xs leading-relaxed ${muted}`}>
          {stage.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className={`p-3 rounded-xl border text-xs break-words ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-200 bg-slate-50"}`}>
          <span className="font-semibold text-indigo-300">{g.example}: </span>
          {stage.example}
        </div>
        {stage.note && <p className="text-[11px] text-amber-300 break-words">{stage.note}</p>}
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={`${secondary} disabled:opacity-40`}>
          {g.back}
        </button>
        {last ? (
          <button type="button" onClick={onClose} className={primary}>
            {g.done}
          </button>
        ) : (
          <button type="button" onClick={() => setStep((s) => s + 1)} className={primary}>
            {g.next}
          </button>
        )}
      </div>
    </section>
  );
}

// Shared device-storage check for the welcome screen. Blocked storage just means the welcome shows again.
export const GUIDE_SEEN_KEY = "dl_journal_guide_seen";
export function readGuideSeen(): boolean {
  try {
    return window.localStorage.getItem(GUIDE_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
export function writeGuideSeen(): void {
  try {
    window.localStorage.setItem(GUIDE_SEEN_KEY, "1");
  } catch {
    // Ignored on purpose: the welcome may appear again, and nothing breaks.
  }
}
