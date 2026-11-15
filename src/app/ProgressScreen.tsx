"use client";

import React from "react";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

type Summary = {
  total: number;
  awaiting: number;
  completed: number;
  nextReview: string | null;
  recent: any[];
};

type Labels = {
  title: string;
  signInToSee: string;
  signIn: string;
  back: string;
  statTotal: string;
  statAwaiting: string;
  statCompleted: string;
  nextReview: string;
  recentOutcomes: string;
  goalsSoon: string;
  openVault: string;
  outcomeLabel: string;
};

type Props = {
  summary: Summary;
  signedIn: boolean;
  labels: Labels;
  onSignIn: () => void;
  onBack: () => void;
  onOpenVault: () => void;
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";

export default function ProgressScreen({ summary, signedIn, labels, onSignIn, onBack, onOpenVault }: Props) {
  const percent = summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;

  return (
    <div className="space-y-6 text-slate-100">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="w-4 h-4" /> {labels.back}
      </button>

      <h2 className="text-2xl font-bold">{labels.title}</h2>

      {!signedIn ? (
        <div className={`${panel} p-6 text-center space-y-3`}>
          <Lock className="w-6 h-6 mx-auto text-indigo-300" />
          <p className="text-sm text-slate-300">{labels.signInToSee}</p>
          <button
            type="button"
            onClick={onSignIn}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
          >
            {labels.signIn}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: labels.statTotal, value: summary.total },
              { label: labels.statAwaiting, value: summary.awaiting },
              { label: labels.statCompleted, value: summary.completed },
            ].map((stat) => (
              <div key={stat.label} className={`${panel} p-4 text-center`}>
                <p className="text-2xl font-bold text-indigo-200">{stat.value}</p>
                <p className="text-[11px] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <section className={`${panel} p-5 space-y-2`}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{labels.statCompleted}</span>
              <span className="font-bold text-indigo-300">{percent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            {summary.nextReview && (
              <p className="text-xs text-slate-400">
                {labels.nextReview} {summary.nextReview}
              </p>
            )}
          </section>

          {summary.recent.length > 0 && (
            <section className={`${panel} p-5 space-y-2`}>
              <p className="text-sm font-semibold">{labels.recentOutcomes}</p>
              {summary.recent.map((m) => (
                <p key={m.id} className="text-xs text-slate-300 break-words">
                  <span className="font-semibold">{m.title}:</span> {labels.outcomeLabel} {m.actual_outcome}
                </p>
              ))}
            </section>
          )}

          <section className={`${panel} p-5 text-xs text-slate-400`}>{labels.goalsSoon}</section>

          <button
            type="button"
            onClick={onOpenVault}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white"
          >
            <ShieldCheck className="w-4 h-4" /> {labels.openVault}
          </button>
        </>
      )}
    </div>
  );
}
