"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { FEATURE_INFO, INFO_LABELS } from "@/lib/featureInfo";
import type { ToolId } from "@/lib/tools";

// The three sections describing a tool: what it does, how it works, what you get.
export function InfoSections({ toolId, lang }: { toolId: ToolId; lang: Lang }) {
  const entry = FEATURE_INFO[toolId][lang];
  const labels = INFO_LABELS[lang];
  return (
    <div className="space-y-3 text-sm text-slate-300">
      <p><span className="font-semibold text-slate-100">{labels.what}:</span> {entry.what}</p>
      <p><span className="font-semibold text-slate-100">{labels.how}:</span> {entry.how}</p>
      <p><span className="font-semibold text-slate-100">{labels.get}:</span> {entry.get}</p>
    </div>
  );
}

// The small ⓘ button that opens the information panel for a tool.
export function InfoButton({ toolId, lang }: { toolId: ToolId; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const labels = INFO_LABELS[lang];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        title={labels.open}
        className="shrink-0 rounded-full p-1.5 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
      >
        <Info className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-2xl border border-indigo-500/40 bg-[#0b0f2a] p-6 space-y-4 text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold">{labels.open}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label={labels.close}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <InfoSections toolId={toolId} lang={lang} />
          </div>
        </div>
      )}
    </>
  );
}
