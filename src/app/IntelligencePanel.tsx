"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import type { Finding } from "@/lib/intelligence";
import { INTEL_STRINGS, findingSentence } from "@/lib/intelligenceStrings";

type Response = "accepted" | "rejected" | "explained" | "resolved";
type Props = {
  lang: Lang;
  findings: Finding[];
  onRespond: (finding: Finding, response: Response, note: string) => void;
};

// The challenges for one plan. Each one says whether it is a confirmed issue or a potential concern,
// and the user can act on it, explain it, dismiss it or mark it resolved. Nothing is changed for them.
export default function IntelligencePanel({ lang, findings, onRespond }: Props) {
  const copy = INTEL_STRINGS[lang];
  const [explaining, setExplaining] = useState<string | null>(null);
  const [note, setNote] = useState("");
  if (findings.length === 0) return null;

  const button = "text-xs font-semibold text-amber-200 underline underline-offset-4 hover:text-white";

  return (
    <section className="rounded-2xl border border-amber-400/40 bg-amber-950/20 p-4 space-y-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
        <AlertTriangle className="w-4 h-4" /> {copy.heading}
      </p>
      <ul className="space-y-4">
        {findings.map((f) => {
          const muted = f.status === "explained";
          return (
            <li key={f.key} className="space-y-2">
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${f.level === "confirmed" ? "text-rose-300" : "text-amber-300"}`}>
                {f.level === "confirmed" ? copy.confirmed : copy.potential}
                {f.status === "accepted" && <span className="ml-2 text-emerald-300">· {copy.accepted}</span>}
                {f.status === "explained" && (
                  <span className="ml-2 text-slate-400">· {f.response === "rejected" ? copy.discussed : copy.explained}</span>
                )}
              </p>
              <p className={`text-sm ${muted ? "text-slate-400" : "text-slate-200"}`}>{findingSentence(lang, f)}</p>

              {explaining === f.key ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    autoFocus
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={copy.explainPlaceholder}
                    maxLength={300}
                    className="flex-1 min-w-[12rem] rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (note.trim()) onRespond(f, "explained", note);
                      setExplaining(null);
                      setNote("");
                    }}
                    className="text-xs font-semibold text-amber-200"
                  >
                    {copy.save}
                  </button>
                  <button type="button" onClick={() => setExplaining(null)} className="text-xs text-slate-400">
                    {copy.cancel}
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {f.status === "open" && (
                    <button type="button" onClick={() => onRespond(f, "accepted", "")} className={button}>
                      {copy.accept}
                    </button>
                  )}
                  <button type="button" onClick={() => setExplaining(f.key)} className={button}>
                    {copy.explain}
                  </button>
                  <button type="button" onClick={() => onRespond(f, "rejected", "")} className={button}>
                    {copy.reject}
                  </button>
                  <button type="button" onClick={() => onRespond(f, "resolved", "")} className={button}>
                    {copy.resolve}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
