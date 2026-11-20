"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import type { HelpPopup as HelpContent } from "@/lib/helpStrings";

type Props = { openLabel: string; closeLabel: string; help: HelpContent };

// A small ⓘ button that opens a help pop-up. Closes on the close button, a backdrop tap or Escape.
export default function HelpPopup({ openLabel, closeLabel, help }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        title={openLabel}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-indigo-300 hover:text-white hover:bg-slate-800"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={help.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl border border-indigo-500/40 bg-[#0b0f2a] p-5 text-sm text-slate-200 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-base font-bold text-slate-100">{help.title}</h4>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {help.intro && <p className="text-slate-300">{help.intro}</p>}
            {help.sections.map((section, i) => (
              <div key={i} className="space-y-1.5">
                {section.heading && <p className="font-semibold text-indigo-300">{section.heading}</p>}
                {section.lines.map((line, j) => (
                  <p key={j} className="text-slate-300">{line}</p>
                ))}
              </div>
            ))}
            <p className="border-t border-slate-700 pt-3 text-xs text-slate-400">{help.footer}</p>
          </div>
        </div>
      )}
    </>
  );
}
