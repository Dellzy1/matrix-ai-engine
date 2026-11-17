import { fmt, type Lang } from "./i18n";
import { dueState } from "./planDates";
import type { Project, TaskRow } from "./projects";

// The main message on the home screen follows the user's real progress.
// The daily line is chosen by date, so it changes each day and is the same for everyone that day.

export type HomeMessage = { main: string; daily: string };

export type HomeMessageInput = {
  signedIn: boolean;
  lang: Lang;
  today: string; // "YYYY-MM-DD" in the user's local time
  decisionCount: number;
  plans: Project[];
  taskRows: TaskRow[];
};

type Texts = {
  newUser: string;
  decisionSaved: string;
  inProgress: string; // {title}, {done}, {total}
  dueToday: string; // {count}
  overdue: string; // {count}
  planCompleted: string; // {title}
  allCaught: string;
  daily: string[];
};

const en: Texts = {
  newUser: "Start with one decision. Calculate it, then turn it into a plan.",
  decisionSaved: "Your decision is saved. Ready to turn it into action?",
  inProgress: "{title}: {done} of {total} tasks completed. Keep moving forward.",
  dueToday: "{count} task(s) due today. Pick the smallest step and start there.",
  overdue: "{count} task(s) are past their dates. Reschedule them or mark them done.",
  planCompleted: "You finished {title}. Your lessons are saved in the Vault.",
  allCaught: "Nothing urgent today. Good time to review a past decision.",
  daily: [
    "Your next step matters.",
    "Small steps add up.",
    "Progress beats perfection.",
    "Every completed task brings you closer to your goal.",
    "Decide, act, review. That's the loop.",
    "One step today is better than none.",
    "You don't need to finish everything today.",
  ],
};

const fr: Texts = {
  newUser: "Commencez par une décision. Calculez-la, puis transformez-la en plan.",
  decisionSaved: "Votre décision est enregistrée. Prêt à passer à l'action ?",
  inProgress: "{title} : {done} tâche(s) sur {total} terminée(s). Continuez d'avancer.",
  dueToday: "{count} tâche(s) à faire aujourd'hui. Choisissez la plus petite étape et commencez par là.",
  overdue: "{count} tâche(s) ont dépassé leur date. Reprogrammez-les ou marquez-les comme faites.",
  planCompleted: "Vous avez terminé {title}. Vos leçons sont enregistrées dans le Coffre.",
  allCaught: "Rien d'urgent aujourd'hui. Bon moment pour revoir une décision passée.",
  daily: [
    "Votre prochaine étape compte.",
    "Les petits pas s'additionnent.",
    "Avancer vaut mieux que la perfection.",
    "Chaque tâche terminée vous rapproche de votre objectif.",
    "Décider, agir, revoir. C'est la boucle.",
    "Un pas aujourd'hui vaut mieux que rien.",
    "Vous n'avez pas besoin de tout finir aujourd'hui.",
  ],
};

const es: Texts = {
  newUser: "Empieza con una decisión. Calcúlala y luego conviértela en un plan.",
  decisionSaved: "Tu decisión está guardada. ¿Listo para pasar a la acción?",
  inProgress: "{title}: {done} de {total} tareas completadas. Sigue avanzando.",
  dueToday: "{count} tarea(s) para hoy. Elige el paso más pequeño y empieza por ahí.",
  overdue: "{count} tarea(s) ya pasaron su fecha. Reprográmalas o márcalas como hechas.",
  planCompleted: "Terminaste {title}. Tus lecciones están guardadas en la Bóveda.",
  allCaught: "Nada urgente hoy. Buen momento para revisar una decisión pasada.",
  daily: [
    "Tu próximo paso importa.",
    "Los pequeños pasos suman.",
    "Avanzar vale más que la perfección.",
    "Cada tarea completada te acerca a tu meta.",
    "Decidir, actuar, revisar. Ese es el ciclo.",
    "Un paso hoy vale más que ninguno.",
    "No necesitas terminarlo todo hoy.",
  ],
};

const pt: Texts = {
  newUser: "Comece com uma decisão. Calcule-a e depois transforme-a em um plano.",
  decisionSaved: "Sua decisão está salva. Pronto para colocá-la em ação?",
  inProgress: "{title}: {done} de {total} tarefas concluídas. Continue avançando.",
  dueToday: "{count} tarefa(s) para hoje. Escolha o menor passo e comece por ele.",
  overdue: "{count} tarefa(s) passaram do prazo. Reagende ou marque como concluídas.",
  planCompleted: "Você concluiu {title}. Suas lições estão salvas no Cofre.",
  allCaught: "Nada urgente hoje. Bom momento para revisar uma decisão passada.",
  daily: [
    "Seu próximo passo importa.",
    "Pequenos passos somam.",
    "Avançar vale mais que a perfeição.",
    "Cada tarefa concluída te aproxima da meta.",
    "Decidir, agir, revisar. Esse é o ciclo.",
    "Um passo hoje vale mais que nenhum.",
    "Você não precisa terminar tudo hoje.",
  ],
};

const sw: Texts = {
  newUser: "Anza na uamuzi mmoja. Ukokotoe, kisha ugeuze kuwa mpango.",
  decisionSaved: "Uamuzi wako umehifadhiwa. Tayari kuuweka katika vitendo?",
  inProgress: "{title}: kazi {done} kati ya {total} zimekamilika. Endelea mbele.",
  dueToday: "Kazi {count} zinatakiwa leo. Chagua hatua ndogo zaidi uanze nayo.",
  overdue: "Kazi {count} zimepita tarehe zake. Zipange upya au ziweke alama kuwa zimekamilika.",
  planCompleted: "Umemaliza {title}. Mafunzo yako yamehifadhiwa kwenye Hazina.",
  allCaught: "Hakuna cha dharura leo. Ni wakati mzuri wa kukagua uamuzi uliopita.",
  daily: [
    "Hatua yako inayofuata ina maana.",
    "Hatua ndogo zinajumlisha.",
    "Kuendelea ni bora kuliko ukamilifu.",
    "Kila kazi iliyokamilika inakuleta karibu na lengo lako.",
    "Amua, tenda, kagua. Huo ndio mzunguko.",
    "Hatua moja leo ni bora kuliko hakuna.",
    "Huhitaji kumaliza kila kitu leo.",
  ],
};

const zh: Texts = {
  newUser: "从一个决策开始。先计算，再把它变成计划。",
  decisionSaved: "你的决策已保存。准备好付诸行动了吗？",
  inProgress: "{title}：已完成 {done}/{total} 个任务。继续前进。",
  dueToday: "今天有 {count} 个任务到期。选一个最小的步骤，从它开始。",
  overdue: "有 {count} 个任务已超过期限。请重新安排或标记为完成。",
  planCompleted: "你已完成「{title}」。你的经验已保存在决策保险库中。",
  allCaught: "今天没有紧急事项。适合回顾一个过去的决策。",
  daily: [
    "你的下一步很重要。",
    "小步前进，积少成多。",
    "前进比完美更重要。",
    "每完成一个任务，都离目标更近一步。",
    "决策、行动、复盘，这就是循环。",
    "今天迈出一步，胜过什么都不做。",
    "今天不必完成所有事情。",
  ],
};

const TEXTS: Record<Lang, Texts> = { en, fr, es, pt, sw, zh };

// Day of the year, so the daily line changes each day without saving anything.
function dayOfYear(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
}

// Picks one message. The first rule that applies wins:
// overdue tasks, tasks due today, a plan in progress, a finished plan, a saved decision, a new user, then all caught up.
export function buildHomeMessage(input: HomeMessageInput): HomeMessage {
  const s = TEXTS[input.lang];
  const daily = s.daily[dayOfYear(input.today) % s.daily.length];
  const { today, decisionCount, plans, taskRows } = input;

  if (!input.signedIn) return { main: s.newUser, daily };

  const active = plans.filter((p) => p.status === "active");
  const activeIds = new Set(active.map((p) => p.id));
  const activeRows = taskRows.filter((r) => activeIds.has(r.project_id));

  const overdue = activeRows.filter((r) => dueState(r.due_date, r.status, today) === "overdue").length;
  if (overdue > 0) return { main: fmt(s.overdue, { count: overdue }), daily };

  const dueToday = activeRows.filter((r) => dueState(r.due_date, r.status, today) === "today").length;
  if (dueToday > 0) return { main: fmt(s.dueToday, { count: dueToday }), daily };

  // The most recently updated active plan that has tasks.
  for (const plan of active) {
    const rows = taskRows.filter((r) => r.project_id === plan.id);
    if (rows.length === 0) continue;
    const done = rows.filter((r) => r.status === "completed").length;
    return { main: fmt(s.inProgress, { title: plan.title, done, total: rows.length }), daily };
  }

  const finished = plans
    .filter((p) => p.status === "completed" || p.status === "archived")
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
  if (finished.length > 0) return { main: fmt(s.planCompleted, { title: finished[0].title }), daily };

  if (decisionCount > 0) return { main: s.decisionSaved, daily };
  if (plans.length === 0) return { main: s.newUser, daily };

  return { main: s.allCaught, daily };
}
