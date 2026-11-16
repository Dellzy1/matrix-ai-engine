"use client";

import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { PLAN_STRINGS } from "@/lib/planStrings";
import { addDays, dueState, localDateOf, parseKey, weekDays, weekStart, type DueState } from "@/lib/planDates";
import type { Activity, ActivityType, Stage, Task } from "@/lib/projects";

// Daily view, weekly view and the activity history, shown as tabs in ProjectDetail.

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";
const ghostBtn =
  "rounded-lg border border-indigo-400/40 px-2.5 py-1.5 text-xs text-indigo-200 hover:bg-indigo-500/20 disabled:opacity-50";

const LOCALE: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  pt: "pt-BR",
  sw: "sw-TZ",
  zh: "zh-CN",
};

const BADGE_STYLE: Record<Exclude<DueState, null>, string> = {
  overdue: "bg-rose-500/25 text-rose-200",
  today: "bg-amber-500/25 text-amber-200",
  tomorrow: "bg-sky-500/20 text-sky-200",
  upcoming: "bg-indigo-500/20 text-indigo-200",
};

const ACTIVITY_KEY = {
  project_created: "actProjectCreated",
  project_updated: "actProjectUpdated",
  task_added: "actTaskAdded",
  task_completed: "actTaskCompleted",
  task_reopened: "actTaskReopened",
  task_deleted: "actTaskDeleted",
  deadline_changed: "actDeadlineChanged",
  stage_added: "actStageAdded",
  stage_deleted: "actStageDeleted",
  project_completed: "actProjectCompleted",
} as const satisfies Record<ActivityType, string>;

type ViewProps = {
  lang: Lang;
  tasks: Task[];
  stages: Stage[];
  today: string;
  onToggle: (task: Task) => void;
};

const byDue = (a: Task, b: Task) => (a.due_date ?? "").localeCompare(b.due_date ?? "");
const stageName = (stages: Stage[], id: string | null) => stages.find((s) => s.id === id)?.title ?? "";

// The small label on a task: Overdue, Due today, Due tomorrow or Upcoming.
export function DueBadge({ lang, state }: { lang: Lang; state: DueState }) {
  const t = PLAN_STRINGS[lang];
  if (!state) return null;
  const label = {
    overdue: t.badgeOverdue,
    today: t.badgeToday,
    tomorrow: t.badgeTomorrow,
    upcoming: t.badgeUpcoming,
  }[state];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${BADGE_STYLE[state]}`}>{label}</span>
  );
}

// One task as a row with a tick button. Used by the daily and weekly views.
function TaskLine({
  lang, task, stageTitle, today, onToggle,
}: {
  lang: Lang;
  task: Task;
  stageTitle: string;
  today: string;
  onToggle: (task: Task) => void;
}) {
  const t = PLAN_STRINGS[lang];
  const done = task.status === "completed";
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-500/20 bg-[#11163a]/60 p-3">
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={done ? t.reopen : t.markDone}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          done
            ? "border-emerald-400 bg-emerald-500/30 text-emerald-200"
            : "border-indigo-400/50 text-transparent hover:bg-indigo-500/20"
        }`}
      >
        <Check className="w-3.5 h-3.5" />
      </button>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className={`text-sm break-words ${done ? "line-through text-slate-500" : "text-slate-100"}`}>{task.title}</p>
        <p className="text-[11px] text-slate-500 break-words">
          {stageTitle}
          {task.due_date ? ` · ${t.deadlineDate}: ${task.due_date}` : ""}
        </p>
      </div>
      {!done && <DueBadge lang={lang} state={dueState(task.due_date, task.status, today)} />}
    </li>
  );
}

function TaskGroup({
  lang, title, items, stages, today, onToggle,
}: Omit<ViewProps, "tasks"> & { title: string; items: Task[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {title} <span className="text-slate-500">({items.length})</span>
      </h4>
      <ul className="space-y-2">
        {items.map((task) => (
          <TaskLine
            key={task.id}
            lang={lang}
            task={task}
            stageTitle={stageName(stages, task.stage_id)}
            today={today}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}

// Today: overdue, due today, scheduled to start today, and completed today.
export function DailyView({ lang, tasks, stages, today, onToggle }: ViewProps) {
  const t = PLAN_STRINGS[lang];
  const open = tasks.filter((x) => x.status !== "completed");
  const overdue = open.filter((x) => dueState(x.due_date, x.status, today) === "overdue").sort(byDue);
  const dueToday = open.filter((x) => x.due_date === today);
  const scheduled = open.filter((x) => x.start_date === today && x.due_date !== today);
  const doneToday = tasks.filter((x) => x.status === "completed" && localDateOf(x.completed_at) === today);
  const nothing = overdue.length + dueToday.length + scheduled.length + doneToday.length === 0;
  const shared = { lang, stages, today, onToggle };

  return (
    <section className={`${panel} p-5 space-y-5`}>
      {nothing ? (
        <p className="text-sm text-slate-400">{t.nothingToday}</p>
      ) : (
        <>
          <TaskGroup {...shared} title={t.sectionOverdue} items={overdue} />
          <TaskGroup {...shared} title={t.sectionDueToday} items={dueToday} />
          <TaskGroup {...shared} title={t.sectionScheduled} items={scheduled} />
          <TaskGroup {...shared} title={t.sectionCompletedToday} items={doneToday} />
        </>
      )}
    </section>
  );
}

// Week: seven days from Monday. Each day shows tasks due that day and tasks completed that day.
export function WeeklyView({ lang, tasks, stages, today, onToggle }: ViewProps) {
  const t = PLAN_STRINGS[lang];
  const loc = LOCALE[lang];
  const [start, setStart] = useState(() => weekStart(today));
  const days = weekDays(start);
  const dayText = (key: string, options: Intl.DateTimeFormatOptions) => parseKey(key).toLocaleDateString(loc, options);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-200">
          {dayText(start, { day: "numeric", month: "short" })} – {dayText(days[6], { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => setStart(addDays(start, -7))} className={ghostBtn} aria-label={t.weekPrev}>
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button type="button" onClick={() => setStart(weekStart(today))} className={ghostBtn}>
            {t.thisWeek}
          </button>
          <button type="button" onClick={() => setStart(addDays(start, 7))} className={ghostBtn} aria-label={t.weekNext}>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {days.map((day) => {
          const dueTasks = tasks.filter((x) => x.due_date === day && x.status !== "completed").sort(byDue);
          const doneTasks = tasks.filter((x) => x.status === "completed" && localDateOf(x.completed_at) === day);
          const all = [...dueTasks, ...doneTasks];
          return (
            <div key={day} className={`${panel} p-4 space-y-2 ${day === today ? "ring-1 ring-indigo-400/60" : ""}`}>
              <h4 className="text-sm font-bold">{dayText(day, { weekday: "long", day: "numeric", month: "short" })}</h4>
              {all.length === 0 ? (
                <p className="text-xs text-slate-500">{t.nothingDay}</p>
              ) : (
                <ul className="space-y-2">
                  {all.map((task) => (
                    <TaskLine
                      key={task.id}
                      lang={lang}
                      task={task}
                      stageTitle={stageName(stages, task.stage_id)}
                      today={today}
                      onToggle={onToggle}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Activity history, newest first.
export function ActivityList({ lang, items }: { lang: Lang; items: Activity[] }) {
  const t = PLAN_STRINGS[lang];
  if (items.length === 0) return <p className="text-sm text-slate-400">{t.noActivity}</p>;
  return (
    <ul className={`${panel} divide-y divide-indigo-500/15`}>
      {items.map((a) => (
        <li key={a.id} className="p-4 space-y-0.5">
          <p className="text-sm font-semibold">{t[ACTIVITY_KEY[a.activity_type]]}</p>
          {a.description && <p className="text-xs text-slate-300 break-words">{a.description}</p>}
          <p className="text-[11px] text-slate-500">
            {new Date(a.created_at).toLocaleString(LOCALE[lang], { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </li>
      ))}
    </ul>
  );
}
