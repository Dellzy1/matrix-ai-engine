"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { PLAN_ONLY_ACTIONS, type NextStep } from "@/lib/nextStep";
import { nextStepText } from "@/lib/nextStepStrings";

type Props = {
  lang: Lang;
  step: NextStep;
  // On the home screen the card names the project. Inside a plan it works on that plan.
  context: "home" | "project";
  onPrimary: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
};

// The "Your next step" card: one recommendation, one main button, at most one alternative.
export default function NextStepCard({ lang, step, context, onPrimary, onSecondary, secondaryLabel }: Props) {
  const text = nextStepText(lang, step);
  const planOnly = context === "home" && PLAN_ONLY_ACTIONS.includes(step.action);
  const primaryLabel = planOnly ? text.viewPlan : text.button;

  return (
    <section className="rounded-2xl border border-violet-400/50 bg-[#0b0f2a]/80 p-5 space-y-3 shadow-[0_0_28px_rgba(139,92,246,0.3)]">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
        <Sparkles className="w-4 h-4" /> {text.heading}
      </p>
      {context === "home" && <p className="text-xs text-indigo-200">{step.projectTitle}</p>}
      <h3 className="text-lg font-bold text-slate-100">{text.title}</h3>
      <p className="text-sm text-slate-300">{text.body}</p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-90"
        >
          {primaryLabel} <ArrowRight className="w-4 h-4" />
        </button>
        {onSecondary && secondaryLabel && (
          <button type="button" onClick={onSecondary} className="text-xs text-indigo-200 underline underline-offset-4 hover:text-white">
            {secondaryLabel}
          </button>
        )}
      </div>
    </section>
  );
}
