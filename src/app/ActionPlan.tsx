"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Target, Trash2 } from "lucide-react";
import { fmt, type Lang } from "@/lib/i18n";
import { PLAN_STRINGS } from "@/lib/planStrings";

type Priority = "low" | "medium" | "high";
type Status = "notStarted" | "inProgress" | "completed";

type Task = {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  startDate: string;
  deadline: string;
  status: Status;
};

type Filter = "all" | Status;

type Props = {
  lang: Lang;
  option: string;
  onBack: () => void;
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";
const field =
  "w-full rounded-xl bg-[#11163a]/80 border border-indigo-500/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400";

const PRIORITY_DOT: Record<Priority, string> = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-rose-400",
};
const PRIORITY_TEXT: Record<Priority, string> = {
  low: "text-emerald-300",
  medium: "text-amber-300",
  high: "text-rose-300",
};
const STATUS_STYLE: Record<Status, string> = {
  notStarted: "border-slate-500/50 text-slate-200",
  inProgress: "border-sky-400/60 text-sky-200",
  completed: "border-emerald-400/60 text-emerald-200",
};
const NEXT_STATUS: Record<Status, Status> = {
  notStarted: "inProgress",
  inProgress: "completed",
  completed: "notStarted",
};
const FILTERS: Filter[] = ["all", "notStarted", "inProgress", "completed"];

export default function ActionPlan({ lang, option, onBack }: Props) {
  const t = PLAN_STRINGS[lang];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [nameError, setNameError] = useState(false);

  const statusLabel: Record<Status, string> = {
    notStarted: t.notStarted,
    inProgress: t.inProgress,
    completed: t.completed,
  };
  const priorityLabel: Record<Priority, string> = {
    low: t.low,
    medium: t.medium,
    high: t.high,
  };
  const filterLabel: Record<Filter, string> = {
    all: t.all,
    notStarted: t.notStarted,
    inProgress: t.inProgress,
    completed: t.completed,
  };

  const doneCount = tasks.filter((task) => task.status === "completed").length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const visible = filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        priority,
        startDate,
        deadline,
        status: "notStarted",
      },
    ]);
    setName("");
    setDescription("");
    setPriority("medium");
    setStartDate("");
    setDeadline("");
  };

  const cycleStatus = (id: number) =>
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: NEXT_STATUS[task.status] } : task))
    );

  const removeTask = (id: number) => setTasks((prev) => prev.filter((task) => task.id !== id));

  return (
    <div className="space-y-6 text-slate-100">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      <header className={`${panel} p-5 space-y-3`}>
        <div className="flex items-center gap-4 min-w-0">
          <span className="shrink-0 rounded-xl p-3 text-indigo-300 bg-indigo-500/20">
            <Target className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold break-words">{t.title}</h2>
            {option && (
              <p className="text-xs text-indigo-300 break-words">
                {t.planFor} <span className="font-semibold">{option}</span>
              </p>
            )}
          </div>
        </div>
        <p className="text-xs text-amber-200/80">{t.notice}</p>
      </header>

      <section className={`${panel} p-5 space-y-2`}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{t.progress}</span>
          <span className="font-bold text-indigo-300">{percent}%</span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">{fmt(t.tasksDone, { done: doneCount, total: tasks.length })}</p>
      </section>

      <form onSubmit={addTask} className={`${panel} p-5 space-y-4`}>
        <h3 className="font-bold text-sm">{t.addTaskHeading}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="plan-task-name" className="text-xs text-slate-300">
              {t.taskName}
            </label>
            <input
              id="plan-task-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(false);
              }}
              className={field}
            />
            {nameError && <p className="text-xs text-rose-300">{t.nameRequired}</p>}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label htmlFor="plan-task-desc" className="text-xs text-slate-300">
              {t.taskDescription}
            </label>
            <input
              id="plan-task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={field}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="plan-task-priority" className="text-xs text-slate-300">
              {t.priority}
            </label>
            <select
              id="plan-task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={field}
            >
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="plan-task-start" className="text-xs text-slate-300">
                {t.startDate}
              </label>
              <input
                id="plan-task-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={field}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="plan-task-deadline" className="text-xs text-slate-300">
                {t.deadline}
              </label>
              <input
                id="plan-task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={field}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow"
        >
          <Plus className="w-4 h-4" /> {t.addTask}
        </button>
      </form>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">{t.tasks}</h3>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  filter === f
                    ? "border-indigo-400 bg-indigo-600 text-white"
                    : "border-indigo-500/30 text-slate-300 hover:bg-indigo-500/20"
                }`}
              >
                {filterLabel[f]}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className={`${panel} p-8 text-center space-y-1`}>
            <p className="font-semibold">{t.noTasks}</p>
            <p className="text-xs text-slate-400">{t.noTasksSub}</p>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {visible.map((task) => (
              <li key={task.id} className={`${panel} p-4 space-y-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className={`flex items-center gap-2 text-xs font-semibold ${PRIORITY_TEXT[task.priority]}`}>
                      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
                      {priorityLabel[task.priority]}
                    </p>
                    <p className="font-bold break-words">{task.name}</p>
                    {task.description && <p className="text-xs text-slate-400 break-words">{task.description}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    aria-label={t.remove}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-rose-950/40 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {(task.startDate || task.deadline) && (
                  <p className="text-xs text-slate-400">
                    {task.startDate && (
                      <span>
                        {t.startDate}: {task.startDate}
                      </span>
                    )}
                    {task.startDate && task.deadline && <span> · </span>}
                    {task.deadline && (
                      <span>
                        {t.deadline}: {task.deadline}
                      </span>
                    )}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => cycleStatus(task.id)}
                  title={t.changeStatus}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium ${STATUS_STYLE[task.status]}`}
                >
                  <span>{statusLabel[task.status]}</span>
                  <span className="text-slate-500">{t.changeStatus}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
