"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { Lang } from "@/lib/i18n";

// The roll up / roll down labels, in the app's six languages.
const LABELS: Record<Lang, { hide: string; show: string }> = {
  en: { hide: "Hide warning", show: "Show warning" },
  fr: { hide: "Masquer l'avertissement", show: "Afficher l'avertissement" },
  es: { hide: "Ocultar aviso", show: "Mostrar aviso" },
  pt: { hide: "Ocultar aviso", show: "Mostrar aviso" },
  sw: { hide: "Ficha onyo", show: "Onyesha onyo" },
  zh: { hide: "收起提示", show: "展开提示" },
};

type Props = {
  lang: Lang;
  message: string;
  // rose for errors, amber for notes and warnings that are not errors
  tone?: "rose" | "amber";
  className?: string;
};

// Every warning in the app uses this. It rolls up to one line, and rolls down to show the full message.
// It starts open, so the user sees it first.
export default function WarningBox({ lang, message, tone = "rose", className = "" }: Props) {
  const [open, setOpen] = useState(true);
  const label = open ? LABELS[lang].hide : LABELS[lang].show;
  const palette =
    tone === "amber"
      ? "border-amber-700 bg-amber-950/30 text-amber-200"
      : "border-rose-800 bg-rose-950/40 text-rose-200";

  return (
    <div role="alert" className={`rounded-xl border p-2.5 ${palette} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={label}
        title={label}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-start gap-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className={open ? "whitespace-normal" : "truncate"}>{message}</span>
        </span>
        {open ? <ChevronUp className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
      </button>
    </div>
  );
}
