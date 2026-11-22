import type { SupabaseClient } from "@supabase/supabase-js";

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "not_started" | "in_progress" | "completed" | "blocked";
export type ProjectStatus = "draft" | "active" | "completed" | "archived";

export type Project = {
  id: string;
  user_id: string;
  decision_id: string | null;
  title: string;
  description: string;
  goal: string;
  expected_result: string;
  success_measure: string;
  budget: string;
  // Numeric budget, used by the Challenge Engine. The text budget above stays as the description.
  budget_amount: number | null;
  budget_currency: string;
  budget_status: "" | "estimated" | "committed" | "spent";
  resources: string;
  selected_option: string | null;
  category: string;
  start_date: string | null;
  due_date: string | null;
  status: ProjectStatus;
  recommended_option: string;
  outcome: string;
  lessons: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Stage = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  position: number;
};

export type Task = {
  id: string;
  project_id: string;
  stage_id: string | null;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  notes: string;
  position: number;
};

// A task's status and deadline, as loaded for the plan list.
export type TaskRow = {
  project_id: string;
  status: TaskStatus;
  due_date: string | null;
  // Loaded for the Next Step Engine, which names the task and ranks by priority.
  id?: string;
  title?: string;
  priority?: Priority;
  start_date?: string | null;
  stage_id?: string | null;
};

export type Note = {
  id: string;
  project_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = {
  title: string;
  description: string;
  goal: string;
  expected_result: string;
  success_measure: string;
  budget?: string;
  budget_amount?: number | null;
  budget_currency?: string;
  budget_status?: "" | "estimated" | "committed" | "spent";
  resources?: string;
  selected_option: string | null;
  // The calculator's top choice when the plan was created. The user does not change it.
  recommended_option?: string;
  decision_id: string | null;
  category: string;
  start_date: string | null;
  due_date: string | null;
  status: ProjectStatus;
};

export type TaskInput = {
  title: string;
  description: string;
  priority: Priority;
  status?: TaskStatus;
  stage_id: string | null;
  start_date: string | null;
  due_date: string | null;
  position: number;
};

// Every database call returns an error message instead of throwing, so screens can show it.
type Done = { error: string | null };
// Inserts also return the saved row, so the screen can show it without reloading everything.
type WithData<T> = { data: T | null; error: string | null };

const msg = (error: { message: string } | null) => (error ? error.message : null);

export const CATEGORY_VALUES = [
  "Business",
  "Career",
  "Education",
  "Personal Development",
  "Finance",
  "Health and Fitness",
  "Technology",
  "Other",
] as const;

// ---- Projects ----

export async function listProjects(sb: SupabaseClient, userId: string) {
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) return { projects: [] as Project[], taskRows: [] as TaskRow[], error: error.message };

  const projects = (data ?? []) as Project[];
  if (projects.length === 0) return { projects, taskRows: [] as TaskRow[], error: null };

  // Only the columns needed for the progress bars and overdue labels are loaded here.
  const { data: taskRows, error: taskError } = await sb
    .from("project_tasks")
    .select("id,project_id,stage_id,title,priority,status,start_date,due_date")
    .in("project_id", projects.map((p) => p.id));
  return {
    projects,
    taskRows: (taskRows ?? []) as TaskRow[],
    error: msg(taskError),
  };
}

export async function getProject(sb: SupabaseClient, projectId: string) {
  const [projectRes, stagesRes, tasksRes, notesRes] = await Promise.all([
    sb.from("projects").select("*").eq("id", projectId).single(),
    sb.from("project_stages").select("*").eq("project_id", projectId).order("position", { ascending: true }),
    sb.from("project_tasks").select("*").eq("project_id", projectId).order("position", { ascending: true }),
    sb.from("project_notes").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
  ]);
  const error = msg(projectRes.error) ?? msg(stagesRes.error) ?? msg(tasksRes.error) ?? msg(notesRes.error);
  return {
    project: (projectRes.data ?? null) as Project | null,
    stages: (stagesRes.data ?? []) as Stage[],
    tasks: (tasksRes.data ?? []) as Task[],
    notes: (notesRes.data ?? []) as Note[],
    error,
  };
}

export async function createProject(
  sb: SupabaseClient,
  userId: string,
  input: ProjectInput,
  stageNames: string[],
): Promise<{ project: Project | null; error: string | null }> {
  const { data, error } = await sb
    .from("projects")
    .insert([{ ...input, user_id: userId }])
    .select("*")
    .single();
  if (error || !data) return { project: null, error: msg(error) ?? "Could not create the plan." };

  const project = data as Project;
  await addActivity(sb, project.id, userId, null, "project_created", project.title);
  if (stageNames.length > 0) {
    const { error: stageError } = await sb.from("project_stages").insert(
      stageNames.map((title, index) => ({ project_id: project.id, title, position: index })),
    );
    if (stageError) return { project, error: stageError.message };
  }
  return { project, error: null };
}

export async function updateProject(sb: SupabaseClient, projectId: string, patch: Partial<ProjectInput>): Promise<Done> {
  const { error } = await sb
    .from("projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", projectId);
  return { error: msg(error) };
}

export async function deleteProject(sb: SupabaseClient, projectId: string): Promise<Done> {
  const { error } = await sb.from("projects").delete().eq("id", projectId);
  return { error: msg(error) };
}

// ---- Stages ----

export async function addStage(sb: SupabaseClient, projectId: string, title: string, position: number): Promise<WithData<Stage>> {
  const { data, error } = await sb
    .from("project_stages")
    .insert([{ project_id: projectId, title, position }])
    .select("*")
    .single();
  return { data: (data ?? null) as Stage | null, error: msg(error) };
}

export async function renameStage(sb: SupabaseClient, stageId: string, title: string): Promise<Done> {
  const { error } = await sb.from("project_stages").update({ title }).eq("id", stageId);
  return { error: msg(error) };
}

export async function deleteStage(sb: SupabaseClient, stageId: string): Promise<Done> {
  // Tasks inside the stage are removed by the database (on delete cascade).
  const { error } = await sb.from("project_stages").delete().eq("id", stageId);
  return { error: msg(error) };
}

// Swaps the positions of two neighbouring stages.
export async function swapStages(sb: SupabaseClient, a: Stage, b: Stage): Promise<Done> {
  const [r1, r2] = await Promise.all([
    sb.from("project_stages").update({ position: b.position }).eq("id", a.id),
    sb.from("project_stages").update({ position: a.position }).eq("id", b.id),
  ]);
  return { error: msg(r1.error) ?? msg(r2.error) };
}

// ---- Tasks ----

export async function addTask(sb: SupabaseClient, projectId: string, input: TaskInput): Promise<WithData<Task>> {
  const { data, error } = await sb
    .from("project_tasks")
    .insert([{ ...input, project_id: projectId, status: input.status ?? "not_started" }])
    .select("*")
    .single();
  return { data: (data ?? null) as Task | null, error: msg(error) };
}

export async function updateTask(sb: SupabaseClient, taskId: string, patch: Partial<TaskInput>): Promise<Done> {
  const { error } = await sb
    .from("project_tasks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", taskId);
  return { error: msg(error) };
}

// Completing a task records when it was finished. Reopening clears it.
export async function setTaskStatus(sb: SupabaseClient, taskId: string, status: TaskStatus): Promise<Done> {
  const { error } = await sb
    .from("project_tasks")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);
  return { error: msg(error) };
}

export async function deleteTask(sb: SupabaseClient, taskId: string): Promise<Done> {
  const { error } = await sb.from("project_tasks").delete().eq("id", taskId);
  return { error: msg(error) };
}

export async function duplicateTask(sb: SupabaseClient, task: Task, position: number): Promise<WithData<Task>> {
  const { data, error } = await sb
    .from("project_tasks")
    .insert([
      {
        project_id: task.project_id,
        stage_id: task.stage_id,
        title: `${task.title} (2)`,
        description: task.description,
        priority: task.priority,
        status: "not_started",
        start_date: task.start_date,
        due_date: task.due_date,
        notes: task.notes,
        position,
      },
    ])
    .select("*")
    .single();
  return { data: (data ?? null) as Task | null, error: msg(error) };
}

// ---- Completion (Round 3) ----

// Marks a plan finished and records what happened and what was learned.
export async function completeProject(
  sb: SupabaseClient,
  projectId: string,
  outcome: string,
  lessons: string,
): Promise<Done> {
  const now = new Date().toISOString();
  const { error } = await sb
    .from("projects")
    .update({ status: "completed", outcome, lessons, completed_at: now, updated_at: now })
    .eq("id", projectId);
  return { error: msg(error) };
}

// Moves a finished plan out of the active list. It stays in the Vault.
export async function archiveProject(sb: SupabaseClient, projectId: string): Promise<Done> {
  const { error } = await sb
    .from("projects")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", projectId);
  return { error: msg(error) };
}

// ---- Notes ----

export async function addNote(sb: SupabaseClient, projectId: string, userId: string, content: string): Promise<WithData<Note>> {
  const { data, error } = await sb
    .from("project_notes")
    .insert([{ project_id: projectId, user_id: userId, content }])
    .select("*")
    .single();
  return { data: (data ?? null) as Note | null, error: msg(error) };
}

export async function updateNote(sb: SupabaseClient, noteId: string, content: string): Promise<Done> {
  const { error } = await sb
    .from("project_notes")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", noteId);
  return { error: msg(error) };
}

export async function deleteNote(sb: SupabaseClient, noteId: string): Promise<Done> {
  const { error } = await sb.from("project_notes").delete().eq("id", noteId);
  return { error: msg(error) };
}

// ---- Activity history ----

export type ActivityType =
  | "project_created"
  | "project_updated"
  | "task_added"
  | "task_completed"
  | "task_reopened"
  | "task_deleted"
  | "deadline_changed"
  | "stage_added"
  | "stage_deleted"
  | "project_completed";

export type Activity = {
  id: string;
  project_id: string;
  task_id: string | null;
  activity_type: ActivityType;
  description: string;
  created_at: string;
};

// Records an event. Failures are ignored so that a log entry never blocks the user's real work.
export async function addActivity(
  sb: SupabaseClient,
  projectId: string,
  userId: string,
  taskId: string | null,
  type: ActivityType,
  description: string,
): Promise<void> {
  await sb.from("project_activity").insert([
    { project_id: projectId, user_id: userId, task_id: taskId, activity_type: type, description },
  ]);
}

export async function listActivity(sb: SupabaseClient, projectId: string): Promise<{ data: Activity[]; error: string | null }> {
  const { data, error } = await sb
    .from("project_activity")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(200);
  return { data: (data ?? []) as Activity[], error: msg(error) };
}

// ---- Progress ----

// Completed tasks ÷ all current tasks. Deleted tasks are already gone from the table, so they don't count.
export function calcProgress(tasks: { status: TaskStatus }[]) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "completed").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, remaining: total - done, percent };
}
