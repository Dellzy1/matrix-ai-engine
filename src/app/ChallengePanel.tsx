"use client";

import { AlertTriangle } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import type { Challenge } from "@/lib/challenges";
import { challengeText } from "@/lib/challengeStrings";

type Props = {
  lang: Lang;
  challenges: Challenge[];
  onFix: () => void;
};

// Notes about weak points in a plan. Each one explains the reason and offers a way to fix it.
// The user can ignore them and carry on.
export default function ChallengePanel({ lang, challenges, onFix }: Props) {
  if (challenges.length === 0) return null;
  const title = challengeText(lang, challenges[0]).title;
  const fix = challengeText(lang, challenges[0]).fix;

  return (
    <section className="rounded-2xl border border-amber-400/40 bg-amber-950/20 p-4 space-y-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
        <AlertTriangle className="w-4 h-4" /> {title}
      </p>
      <ul className="space-y-2 text-sm text-slate-200">
        {challenges.map((challenge) => (
          <li key={challenge.id}>{challengeText(lang, challenge).body}</li>
        ))}
      </ul>
      <button type="button" onClick={onFix} className="text-xs font-semibold text-amber-200 underline underline-offset-4 hover:text-white">
        {fix}
      </button>
    </section>
  );
}
