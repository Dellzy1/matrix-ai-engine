"use client";

import React, { useState } from "react";
import { ArrowLeft, Clock, Lock } from "lucide-react";

type Labels = {
  title: string;
  myDecisions: string;
  lessons: string;
  noLessons: string;
  signInToSee: string;
  signIn: string;
  noDecisions: string;
  reviewed: string;
  pendingReview: string;
  reviewLabel: string;
  outcomeLabel: string;
  notSet: string;
  back: string;
  planCompletedBadge: string;
  lessonsLabel: string;
  linkedPlan: string;
};

// The plan linked to a saved decision, with its progress.
type DecisionPlan = { title: string; percent: number; status: string };

type Props = {
  items: any[];
  // Completed and archived plans, shown in the lessons tab.
  plans: any[];
  // Keyed by decision ID.
  decisionPlans: Record<string, DecisionPlan>;
  signedIn: boolean;
  labels: Labels;
  onOpen: (item: any) => void;
  onSignIn: () => void;
  onBack: () => void;
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";

export default function VaultScreen({ items, plans, decisionPlans, signedIn, labels, onOpen, onSignIn, onBack }: Props) {
  const [tab, setTab] = useState<"mine" | "lessons">("mine");
  const lessons = items.filter((i) => (i.actual_outcome ?? "").trim() !== "");
  const isEmpty = tab === "mine" ? items.length === 0 : plans.length + lessons.length === 0;

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
          <div className="flex gap-2">
            {(["mine", "lessons"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-pressed={tab === key}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
                  tab === key
                    ? "border-indigo-400 bg-indigo-600 text-white"
                    : "border-indigo-500/30 text-slate-300 hover:bg-indigo-500/20"
                }`}
              >
                {key === "mine" ? labels.myDecisions : labels.lessons}
              </button>
            ))}
          </div>

          {isEmpty ? (
            <div className={`${panel} p-8 text-center`}>
              <p className="text-sm text-slate-400">{tab === "mine" ? labels.noDecisions : labels.noLessons}</p>
            </div>
          ) : (
            <>
              {/* Completed plans: what happened and what was learned */}
              {tab === "lessons" && plans.length > 0 && (
                <ul className="grid gap-3 md:grid-cols-2">
                  {plans.map((plan) => (
                    <li key={plan.id} className={`${panel} p-4 space-y-2`}>
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {labels.planCompletedBadge}
                      </span>
                      <p className="font-bold break-words">{plan.title}</p>
                      {plan.outcome && (
                        <p className="text-xs text-slate-300 break-words whitespace-pre-wrap">
                          {labels.outcomeLabel} {plan.outcome}
                        </p>
                      )}
                      {plan.lessons && (
                        <p className="text-xs text-slate-300 break-words whitespace-pre-wrap">
                          {labels.lessonsLabel} {plan.lessons}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Saved decisions (mine), or decisions that have been reviewed (lessons) */}
              {(tab === "mine" ? items : lessons).length > 0 && (
                <ul className="grid gap-3 md:grid-cols-2">
                  {(tab === "mine" ? items : lessons).map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(item)}
                        className={`w-full text-left ${panel} p-4 space-y-2 hover:border-indigo-400 transition`}
                      >
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.actual_outcome ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {item.actual_outcome ? labels.reviewed : labels.pendingReview}
                        </span>
                        <p className="font-bold break-words">{item.title}</p>
                        {item.reason && <p className="text-xs text-slate-400 break-words">{item.reason}</p>}
                        {decisionPlans[item.id] && (
                          <p className="text-xs text-indigo-200 break-words">
                            {labels.linkedPlan} {decisionPlans[item.id].title} · {decisionPlans[item.id].percent}%
                          </p>
                        )}
                        {item.actual_outcome && (
                          <p className="text-xs text-slate-300 break-words">
                            {labels.outcomeLabel} {item.actual_outcome}
                          </p>
                        )}
                        <p className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" /> {labels.reviewLabel} {item.review_date || labels.notSet}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
