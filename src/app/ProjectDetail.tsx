"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowLeft, ArrowDown, ArrowUp, Copy, Pencil, Trash2 } from "lucide-react";
import { fmt, type Lang } from "@/lib/i18n";
import { PLAN_STRINGS } from "@/lib/planStrings";
import { dueState, todayKey } from "@/lib/planDates";
import { nextStepFor, taskMatchesFocus, type NextAction } from "@/lib/nextStep";
import { nextStepText } from "@/lib/nextStepStrings";
import NextStepCard from "./NextStepCard";
import ChallengePanel from "./ChallengePanel";
import { challengesFor } from "@/lib/challenges";
import {
  addActivity,
  addNote,
  archiveProject,
  completeProject,
  addStage,
  addTask,
  calcProgress,
  deleteNote,
  deleteProject,
  deleteStage,
  deleteTask,
  duplicateTask,
  getProject,
  listActivity,
  renameStage,
  setTaskStatus,
  swapStages,
  updateNote,
  updateProject,
  updateTask,
  type Activity,
  type ActivityType,
  type Note,
  type Priority,
  type Project,
  type Stage,
  type Task,
  type TaskStatus,
} from "@/lib/projects";
import { ActivityList, DailyView, DueBadge, WeeklyView } from "./ProjectViews";

type Props = {
  lang: Lang;
  supabase: SupabaseClient | null;
  userId: string | null;
  projectId: string;
  // The step chosen on the home screen. Null shows every task.
  focus?: NextAction | null;
  onBack: () => void;
};

type Tab = "plan" | "daily" | "weekly" | "activity";
type Done = { error: string | null };
type TaskValues = {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  start_date: string | null;
  due_date: string | null;
  stage_id: string | null;
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";
const field =
  "w-full rounded-xl bg-[#11163a]/80 border border-indigo-500/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400";
const primaryBtn =
  "rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-3 py-1.5 text-xs font-medium text-white";
const ghostBtn =
  "rounded-lg border border-indigo-400/40 px-2.5 py-1.5 text-xs text-indigo-200 hover:bg-indigo-500/20 disabled:opacity-50";
const dangerBtn =
  "rounded-lg border border-rose-700/60 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-950/40 disabled:opacity-50";

const PRIORITY_STYLE: Record<Priority, string> = {
  low: "bg-emerald-500/20 text-emerald-200",
  medium: "bg-amber-500/20 text-amber-200",
  high: "bg-orange-500/20 text-orange-200",
  urgent: "bg-rose-500/25 text-rose-200",
};

export default function ProjectDetail({ lang, supabase, userId, projectId, focus, onBack }: Props) {
  const t = PLAN_STRINGS[lang];
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("plan");
  const [focusOn, setFocusOn] = useState<NextAction | null>(focus ?? null);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Project>>({});
  const [newStageTitle, setNewStageTitle] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [addingTaskFor, setAddingTaskFor] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteEditValue, setNoteEditValue] = useState("");
  const [completing, setCompleting] = useState(false);
  const [outcomeDraft, setOutcomeDraft] = useState("");
  const [lessonsDraft, setLessonsDraft] = useState("");

  // Fetches everything. Used on first load, and to recover if a background save fails.
  const reload = useCallback(async () => {
    if (!supabase) return;
    const res = await getProject(supabase, projectId);
    setProject(res.project);
    setStages(res.stages);
    setTasks(res.tasks);
    setNotes(res.notes);
    setError(res.error);
    setLoading(false);
  }, [supabase, projectId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // The activity history is loaded when its tab opens, so the plan itself loads quickly.
  useEffect(() => {
    if (tab !== "activity" || !supabase) return;
    listActivity(supabase, projectId).then((res) => {
      setActivity(res.data);
      if (res.error) setError(res.error);
    });
  }, [tab, supabase, projectId]);

  // The screen has already been updated. This saves in the background and only reloads if it fails.
  const save = async (fn: () => Promise<Done>) => {
    const res = await fn();
    if (res.error) {
      setError(res.error);
      await reload();
      return false;
    }
    return true;
  };

  if (!supabase || !userId) {
    return <p className="text-sm text-slate-400">{t.loading}</p>;
  }
  if (loading || !project) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={onBack} className="flex items-center gap-1 text-xs text-slate-400">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <p className="text-sm text-slate-400">{error ?? t.loading}</p>
      </div>
    );
  }

  const progress = calcProgress(tasks);
  const today = todayKey();
  const nextStep = project ? nextStepFor(project, tasks, today) : null;
  const challenges = project ? challengesFor(project, tasks, today) : [];
  const overdueCount = tasks.filter((x) => dueState(x.due_date, x.status, today) === "overdue").length;

  const nextPosition = (stageId: string | null) => {
    const inStage = tasks.filter((x) => x.stage_id === stageId).map((x) => x.position);
    return inStage.length ? Math.max(...inStage) + 1 : 0;
  };

  // Records what happened. Runs in the background; a failed log entry never blocks the user's work.
  const log = (type: ActivityType, description: string, taskId: string | null = null) => {
    addActivity(supabase, project.id, userId, taskId, type, description).catch(() => {});
  };

  // ---- Project details ----
  const startEdit = () => {
    setDraft({
      title: project.title,
      description: project.description,
      goal: project.goal,
      expected_result: project.expected_result,
      success_measure: project.success_measure,
      category: project.category,
      start_date: project.start_date,
      due_date: project.due_date,
      selected_option: project.selected_option,
    });
    setEditing(true);
  };

  const saveProjectEdits = () => {
    if (!draft.title?.trim()) return setError(t.needTitle);
    if (draft.start_date && draft.due_date && draft.due_date < draft.start_date) return setError(t.dateOrder);
    const patch = {
      title: draft.title.trim(),
      description: draft.description ?? "",
      goal: draft.goal ?? "",
      expected_result: draft.expected_result ?? "",
      success_measure: draft.success_measure ?? "",
      category: draft.category ?? "Other",
      start_date: draft.start_date || null,
      due_date: draft.due_date || null,
      selected_option: draft.selected_option?.trim() || null,
    };
    setProject({ ...project, ...patch });
    setEditing(false);
    log("project_updated", patch.title);
    save(() => updateProject(supabase, project.id, patch));
  };

  const startPlan = () => {
    setProject({ ...project, status: "active" });
    save(() => updateProject(supabase, project.id, { status: "active" }));
  };

  // Completing a plan records what happened and what was learned. Open tasks don't block it.
  const finishPlan = () => {
    const outcome = outcomeDraft.trim();
    const lessons = lessonsDraft.trim();
    if (!outcome) return setError(t.completeOutcome);
    setProject({ ...project, status: "completed", outcome, lessons, completed_at: new Date().toISOString() });
    setCompleting(false);
    log("project_completed", project.title);
    save(() => completeProject(supabase, project.id, outcome, lessons));
  };

  // A finished plan leaves the active list but stays in the Decision Vault.
  const archive = () => {
    if (!window.confirm(t.confirmArchive)) return;
    setProject({ ...project, status: "archived" });
    save(() => archiveProject(supabase, project.id));
  };

  const removeProject = async () => {
    if (!window.confirm(t.confirmDeleteProject)) return;
    const res = await deleteProject(supabase, project.id);
    if (res.error) return setError(res.error);
    onBack();
  };

  // ---- Stages ----
  const createStage = async () => {
    const title = newStageTitle.trim();
    if (!title) return;
    const position = stages.length ? Math.max(...stages.map((s) => s.position)) + 1 : 0;
    const res = await addStage(supabase, project.id, title, position);
    if (res.error) return setError(res.error);
    if (res.data) setStages((prev) => [...prev, res.data as Stage].sort((a, b) => a.position - b.position));
    log("stage_added", title);
    setNewStageTitle("");
  };

  const saveRename = (stage: Stage) => {
    const title = renameValue.trim();
    if (!title) return;
    setStages((prev) => prev.map((s) => (s.id === stage.id ? { ...s, title } : s)));
    setRenamingId(null);
    save(() => renameStage(supabase, stage.id, title));
  };

  const removeStage = (stage: Stage) => {
    if (!window.confirm(t.confirmDeleteStage)) return;
    setStages((prev) => prev.filter((s) => s.id !== stage.id));
    setTasks((prev) => prev.filter((x) => x.stage_id !== stage.id));
    log("stage_deleted", stage.title);
    save(() => deleteStage(supabase, stage.id));
  };

  const moveStage = (index: number, direction: -1 | 1) => {
    const a = stages[index];
    const b = stages[index + direction];
    if (!a || !b) return;
    setStages((prev) =>
      prev
        .map((s) => (s.id === a.id ? { ...s, position: b.position } : s.id === b.id ? { ...s, position: a.position } : s))
        .sort((x, y) => x.position - y.position),
    );
    save(() => swapStages(supabase, a, b));
  };

  // ---- Tasks ----
  // Each form returns true when it can close. A failed add keeps the form open so nothing is lost.
  const createTask = async (stageId: string, values: TaskValues): Promise<boolean> => {
    const res = await addTask(supabase, project.id, { ...values, stage_id: stageId, position: nextPosition(stageId) });
    if (res.error) {
      setError(res.error);
      return false;
    }
    if (res.data) {
      setTasks((prev) => [...prev, res.data as Task]);
      log("task_added", values.title, res.data.id);
    }
    setAddingTaskFor(null);
    return true;
  };

  const saveTask = (taskId: string, values: TaskValues): boolean => {
    const before = tasks.find((x) => x.id === taskId);
    if (before && (before.due_date ?? null) !== values.due_date) {
      log("deadline_changed", `${values.title}: ${values.due_date ?? t.noDeadline}`, taskId);
    }
    setTasks((prev) => prev.map((x) => (x.id === taskId ? { ...x, ...values } : x)));
    setEditingTaskId(null);
    save(() => updateTask(supabase, taskId, values));
    return true;
  };

  const changeStatus = (task: Task, status: TaskStatus) => {
    if (status === "completed") log("task_completed", task.title, task.id);
    else if (task.status === "completed") log("task_reopened", task.title, task.id);
    setTasks((prev) =>
      prev.map((x) =>
        x.id === task.id
          ? { ...x, status, completed_at: status === "completed" ? new Date().toISOString() : null }
          : x,
      ),
    );
    save(() => setTaskStatus(supabase, task.id, status));
  };

  // Ticking a task in the daily or weekly view. Reopening sets it back to in progress, as the plan does.
  const toggleTask = (task: Task) => {
    changeStatus(task, task.status === "completed" ? "in_progress" : "completed");
  };

  const copyTask = async (task: Task) => {
    const res = await duplicateTask(supabase, task, nextPosition(task.stage_id));
    if (res.error) return setError(res.error);
    if (res.data) {
      setTasks((prev) => [...prev, res.data as Task]);
      log("task_added", res.data.title, res.data.id);
    }
  };

  const removeTask = (task: Task) => {
    if (!window.confirm(t.confirmDeleteTask)) return;
    setTasks((prev) => prev.filter((x) => x.id !== task.id));
    log("task_deleted", task.title);
    save(() => deleteTask(supabase, task.id));
  };

  // ---- Notes ----
  const saveNewNote = async () => {
    const content = noteDraft.trim();
    if (!content || !userId) return;
    const res = await addNote(supabase, project.id, userId, content);
    if (res.error) return setError(res.error);
    if (res.data) setNotes((prev) => [res.data as Note, ...prev]);
    setNoteDraft("");
  };

  const saveNoteEdit = (note: Note) => {
    const content = noteEditValue.trim();
    if (!content) return;
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, content } : n)));
    setEditingNoteId(null);
    save(() => updateNote(supabase, note.id, content));
  };

  const removeNote = (note: Note) => {
    if (!window.confirm(t.confirmDeleteNote)) return;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    save(() => deleteNote(supabase, note.id));
  };

  const statusLabel: Record<TaskStatus, string> = {
    not_started: t.tsNotStarted,
    in_progress: t.tsInProgress,
    completed: t.tsCompleted,
    blocked: t.tsBlocked,
  };
  const priorityLabel: Record<Priority, string> = {
    low: t.priorityLow,
    medium: t.priorityMedium,
    high: t.priorityHigh,
    urgent: t.priorityUrgent,
  };
  const tabs: { key: Tab; label: string }[] = [
    { key: "plan", label: t.tabPlan },
    { key: "daily", label: t.tabDaily },
    { key: "weekly", label: t.tabWeekly },
    { key: "activity", label: t.tabActivity },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </button>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      {/* Overview */}
      <section className={`${panel} p-5 space-y-4`}>
        {!editing ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold break-words">{project.title}</h2>
                {project.description && <p className="text-sm text-slate-300 break-words">{project.description}</p>}
              </div>
              <button type="button" onClick={startEdit} className={ghostBtn}>
                <Pencil className="inline w-3 h-3 mr-1" />{t.edit}
              </button>
            </div>

            <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              {project.goal && <p><span className="text-slate-400">{t.fieldGoal}: </span>{project.goal}</p>}
              {project.expected_result && <p><span className="text-slate-400">{t.fieldExpected} </span>{project.expected_result}</p>}
              {project.success_measure && <p><span className="text-slate-400">{t.fieldMeasure} </span>{project.success_measure}</p>}
              {project.selected_option && <p>{project.selected_option}</p>}
              {project.recommended_option && project.selected_option !== project.recommended_option && (
                <p className="text-xs text-slate-400">{fmt(t.recommendedNote, { option: project.recommended_option })}</p>
              )}
              <p><span className="text-slate-400">{t.startDate}: </span>{project.start_date || t.noDeadline}</p>
              <p><span className="text-slate-400">{t.deadlineDate}: </span>{project.due_date || t.noDeadline}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.progress}</span>
                <span className="font-bold text-indigo-300">{progress.percent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all" style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="text-xs text-slate-400">
                {fmt(t.tasksDone, { done: progress.done, total: progress.total })} · {fmt(t.remaining, { count: progress.remaining })}
              </p>
            </div>

            {project.status === "draft" && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200">
                <span className="flex-1">{t.draftNotice}</span>
                <button type="button" onClick={startPlan} className={primaryBtn}>{t.startPlan}</button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <h3 className="font-bold">{t.editFormTitle}</h3>
            <input className={field} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder={t.fieldTitle} maxLength={200} />
            <textarea className={field} rows={2} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder={t.fieldDescription} />
            <input className={field} value={draft.goal ?? ""} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} placeholder={t.fieldGoal} />
            <input className={field} value={draft.expected_result ?? ""} onChange={(e) => setDraft({ ...draft, expected_result: e.target.value })} placeholder={t.fieldExpected} />
            <input className={field} value={draft.success_measure ?? ""} onChange={(e) => setDraft({ ...draft, success_measure: e.target.value })} placeholder={t.fieldMeasure} />
            <input className={field} value={draft.selected_option ?? ""} onChange={(e) => setDraft({ ...draft, selected_option: e.target.value })} placeholder={t.fieldChosen} maxLength={200} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" className={field} value={draft.start_date ?? ""} onChange={(e) => setDraft({ ...draft, start_date: e.target.value })} aria-label={t.fieldStart} />
              <input type="date" className={field} value={draft.due_date ?? ""} onChange={(e) => setDraft({ ...draft, due_date: e.target.value })} aria-label={t.fieldDue} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveProjectEdits} className={primaryBtn}>{t.saveChanges}</button>
              <button type="button" onClick={() => setEditing(false)} className={ghostBtn}>{t.cancel}</button>
            </div>
          </div>
        )}
      </section>

      {nextStep && (
        <NextStepCard
          lang={lang}
          step={nextStep}
          context="project"
          onPrimary={() => {
            if (nextStep.action === "complete") {
              setTab("plan");
              return setCompleting(true);
            }
            if (nextStep.action === "archive") return archive();
            if (nextStep.action === "no_tasks") return setFocusOn(null);
            setTab("plan");
            setFocusOn(nextStep.action);
          }}
          onSecondary={focusOn ? () => setFocusOn(null) : undefined}
          secondaryLabel={nextStepText(lang, nextStep).showAll}
        />
      )}

      {challenges.length > 0 && <ChallengePanel lang={lang} challenges={challenges} onFix={() => { startEdit(); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

      {/* Overdue reminder, shown on every tab except Daily */}
      {overdueCount > 0 && tab !== "daily" && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200">
          <span className="flex-1">{fmt(t.overdueBanner, { count: overdueCount })}</span>
          <button type="button" onClick={() => setTab("daily")} className={primaryBtn}>{t.viewDaily}</button>
        </div>
      )}

      {/* Tabs */}
      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-medium ${
              tab === item.key
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/20"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "daily" && (
        <DailyView lang={lang} tasks={tasks} stages={stages} today={today} onToggle={toggleTask} />
      )}

      {tab === "weekly" && (
        <WeeklyView lang={lang} tasks={tasks} stages={stages} today={today} onToggle={toggleTask} />
      )}

      {tab === "activity" && <ActivityList lang={lang} items={activity} />}

      {tab === "plan" && (
        <>
          {/* Completion: the form while working, the result once finished */}
          {project.status === "completed" || project.status === "archived" ? (
            <section className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-5 space-y-3">
              <p className="text-xs font-bold tracking-wider text-emerald-300">{t.completedBanner}</p>
              {project.outcome && (
                <p className="text-sm text-slate-100 whitespace-pre-wrap break-words">
                  <span className="text-slate-400">{t.completeOutcome} </span>{project.outcome}
                </p>
              )}
              {project.lessons && (
                <p className="text-sm text-slate-100 whitespace-pre-wrap break-words">
                  <span className="text-slate-400">{t.lessonsLabel} </span>{project.lessons}
                </p>
              )}
              {project.status === "completed" && (
                <button type="button" onClick={archive} className={ghostBtn}>{t.archivePlan}</button>
              )}
            </section>
          ) : !completing ? (
            <section className={`${panel} p-5 flex justify-end`}>
              <button type="button" onClick={() => setCompleting(true)} className={primaryBtn}>{t.completeTitle}</button>
            </section>
          ) : (
            <section className={`${panel} p-5 space-y-3`}>
              <h3 className="font-bold">{t.completeTitle}</h3>
              {progress.remaining > 0 && (
                <p className="text-xs text-amber-200">{fmt(t.openTasksNote, { count: progress.remaining })}</p>
              )}
              <textarea className={field} rows={3} value={outcomeDraft} onChange={(e) => setOutcomeDraft(e.target.value)} placeholder={t.completeOutcome} aria-label={t.completeOutcome} maxLength={2000} />
              <textarea className={field} rows={3} value={lessonsDraft} onChange={(e) => setLessonsDraft(e.target.value)} placeholder={t.completeLessons} aria-label={t.completeLessons} maxLength={2000} />
              <div className="flex gap-2">
                <button type="button" onClick={finishPlan} className={primaryBtn}>{t.completeButton}</button>
                <button type="button" onClick={() => setCompleting(false)} className={ghostBtn}>{t.cancel}</button>
              </div>
            </section>
          )}

          {/* Stages and tasks */}
          <section className="space-y-4">
            <h3 className="text-base font-bold">{t.stagesHeading}</h3>

            {stages.map((stage, index) => {
              const stageTasks = tasks
                .filter((x) => x.stage_id === stage.id && (focusOn ? taskMatchesFocus(focusOn, x, today) : true))
                .sort((a, b) => a.position - b.position);
              return (
                <div key={stage.id} className={`${panel} p-4 space-y-3`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {renamingId === stage.id ? (
                      <div className="flex gap-2 flex-1 min-w-0">
                        <input className={field} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} aria-label={t.newStageName} />
                        <button type="button" onClick={() => saveRename(stage)} className={primaryBtn}>{t.save}</button>
                        <button type="button" onClick={() => setRenamingId(null)} className={ghostBtn}>{t.cancel}</button>
                      </div>
                    ) : (
                      <h4 className="font-bold break-words">{stage.title}</h4>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => moveStage(index, -1)} disabled={index === 0} className={ghostBtn} aria-label={t.moveUp}>
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => moveStage(index, 1)} disabled={index === stages.length - 1} className={ghostBtn} aria-label={t.moveDown}>
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => { setRenamingId(stage.id); setRenameValue(stage.title); }} className={ghostBtn}>
                        {t.rename}
                      </button>
                      <button type="button" onClick={() => removeStage(stage)} className={dangerBtn}>
                        {t.deleteStage}
                      </button>
                    </div>
                  </div>

                  {stageTasks.length === 0 && addingTaskFor !== stage.id && (
                    <p className="text-xs text-slate-500">{t.emptyStage}</p>
                  )}

                  <ul className="space-y-2">
                    {stageTasks.map((task) =>
                      editingTaskId === task.id ? (
                        <li key={task.id}>
                          <TaskForm
                            lang={lang}
                            stages={stages}
                            initial={task}
                            onSave={(values) => saveTask(task.id, values)}
                            onCancel={() => setEditingTaskId(null)}
                          />
                        </li>
                      ) : (
                        <li key={task.id} className="rounded-xl border border-indigo-500/20 bg-[#11163a]/60 p-3 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY_STYLE[task.priority]}`}>
                                  {priorityLabel[task.priority]}
                                </span>
                                {task.status !== "completed" && (
                                  <DueBadge lang={lang} state={dueState(task.due_date, task.status, today)} />
                                )}
                                <span className={`text-xs ${task.status === "completed" ? "line-through text-slate-500" : "text-slate-200"}`}>
                                  {task.title}
                                </span>
                              </div>
                              {task.description && <p className="text-xs text-slate-400 break-words">{task.description}</p>}
                              <p className="text-[11px] text-slate-500">
                                {t.startDate}: {task.start_date || t.noDeadline} · {t.deadlineDate}: {task.due_date || t.noDeadline} · {statusLabel[task.status]}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {task.status === "completed" ? (
                                <button type="button" onClick={() => changeStatus(task, "in_progress")} className={ghostBtn}>{t.reopen}</button>
                              ) : (
                                <button type="button" onClick={() => changeStatus(task, "completed")} className={primaryBtn}>{t.markDone}</button>
                              )}
                              <button type="button" onClick={() => setEditingTaskId(task.id)} className={ghostBtn}>{t.edit}</button>
                              <button type="button" onClick={() => copyTask(task)} className={ghostBtn} aria-label={t.duplicate}>
                                <Copy className="w-3 h-3" />
                              </button>
                              <button type="button" onClick={() => removeTask(task)} className={dangerBtn} aria-label={t.deleteTask}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>

                  {addingTaskFor === stage.id ? (
                    <TaskForm
                      lang={lang}
                      stages={stages}
                      initial={{ stage_id: stage.id }}
                      onSave={(values) => createTask(stage.id, values)}
                      onCancel={() => setAddingTaskFor(null)}
                    />
                  ) : (
                    <button type="button" onClick={() => setAddingTaskFor(stage.id)} className={ghostBtn}>
                      + {t.addTask}
                    </button>
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2">
              <input
                className={`${field} max-w-xs`}
                value={newStageTitle}
                onChange={(e) => setNewStageTitle(e.target.value)}
                placeholder={t.newStageName}
                maxLength={120}
                aria-label={t.newStageName}
              />
              <button type="button" onClick={createStage} disabled={!newStageTitle.trim()} className={primaryBtn}>
                + {t.addStage}
              </button>
            </div>
          </section>

          {/* Notes */}
          <section className={`${panel} p-5 space-y-3`}>
            <h3 className="font-bold">{t.notes}</h3>
            <textarea className={field} rows={2} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder={t.notePlaceholder} maxLength={5000} />
            <button type="button" onClick={saveNewNote} disabled={!noteDraft.trim()} className={primaryBtn}>{t.addNote}</button>

            {notes.length === 0 ? (
              <p className="text-xs text-slate-500">{t.noNotes}</p>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li key={note.id} className="rounded-xl border border-indigo-500/20 bg-[#11163a]/60 p-3 space-y-2">
                    {editingNoteId === note.id ? (
                      <>
                        <textarea className={field} rows={2} value={noteEditValue} onChange={(e) => setNoteEditValue(e.target.value)} maxLength={5000} />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => saveNoteEdit(note)} className={primaryBtn}>{t.save}</button>
                          <button type="button" onClick={() => setEditingNoteId(null)} className={ghostBtn}>{t.cancel}</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap break-words">{note.content}</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setEditingNoteId(note.id); setNoteEditValue(note.content); }} className={ghostBtn}>{t.edit}</button>
                          <button type="button" onClick={() => removeNote(note)} className={dangerBtn}>{t.deleteNote}</button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Delete plan */}
          <div className="flex justify-end">
            <button type="button" onClick={removeProject} className={dangerBtn}>{t.deleteProject}</button>
          </div>
        </>
      )}
    </div>
  );
}

// Used for adding a task (initial has only stage_id) and editing one (initial is the full task).
// onSave returns true when the form can close.
function TaskForm({
  lang, stages, initial, onSave, onCancel,
}: {
  lang: Lang;
  stages: Stage[];
  initial: Partial<Task>;
  onSave: (values: TaskValues) => boolean | Promise<boolean>;
  onCancel: () => void;
}) {
  const t = PLAN_STRINGS[lang];
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial.priority ?? "medium");
  const [status, setStatus] = useState<TaskStatus>(initial.status ?? "not_started");
  const [startDate, setStartDate] = useState(initial.start_date ?? "");
  const [dueDate, setDueDate] = useState(initial.due_date ?? "");
  const [stageId, setStageId] = useState<string | null>(initial.stage_id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    // A second click while saving does nothing, so the same task can't be added twice.
    if (saving) return;
    if (!title.trim()) return setError(t.taskNameRequired);
    if (startDate && dueDate && dueDate < startDate) return setError(t.dateOrder);
    setError(null);
    setSaving(true);
    const ok = await onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      start_date: startDate || null,
      due_date: dueDate || null,
      stage_id: stageId,
    });
    if (!ok) setSaving(false);
  };

  return (
    <div className="rounded-xl border border-indigo-400/40 bg-[#11163a]/80 p-3 space-y-3">
      <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.taskName} maxLength={200} aria-label={t.taskName} />
      <textarea className={field} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.taskDescription} aria-label={t.taskDescription} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select className={field} value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label={t.priority}>
          <option value="low">{t.priorityLow}</option>
          <option value="medium">{t.priorityMedium}</option>
          <option value="high">{t.priorityHigh}</option>
          <option value="urgent">{t.priorityUrgent}</option>
        </select>
        <select className={field} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} aria-label={t.status}>
          <option value="not_started">{t.tsNotStarted}</option>
          <option value="in_progress">{t.tsInProgress}</option>
          <option value="completed">{t.tsCompleted}</option>
          <option value="blocked">{t.tsBlocked}</option>
        </select>
        <input type="date" className={field} value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={t.startDate} />
        <input type="date" className={field} value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label={t.deadlineDate} />
        <select className={`${field} sm:col-span-2`} value={stageId ?? ""} onChange={(e) => setStageId(e.target.value || null)} aria-label={t.moveTo}>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={submit} disabled={saving} className={primaryBtn}>{saving ? t.saving : t.save}</button>
        <button type="button" onClick={onCancel} className={ghostBtn}>{t.cancel}</button>
      </div>
    </div>
  );
}
