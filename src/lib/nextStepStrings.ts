import { fmt, type Lang } from "./i18n";
import type { NextAction, NextStep } from "./nextStep";

type Entry = { title: string; body: string; button: string };
type Copy = { heading: string; viewPlan: string; showAll: string; actions: Record<NextAction, Entry> };

const en: Copy = {
  heading: "Your next step",
  viewPlan: "View plan",
  showAll: "Show all tasks",
  actions: {
    overdue: { title: "Review overdue tasks", body: "{count} task(s) are past their due date. Reviewing them now keeps the plan on track.", button: "Show overdue tasks" },
    today: { title: "Focus on today's tasks", body: "{count} task(s) are due today. Pick the smallest one and start there.", button: "Show today's tasks" },
    blocked: { title: "Resolve blocked tasks", body: "{count} task(s) are blocked. Find out what is holding them back.", button: "Show blocked tasks" },
    no_deadlines: { title: "Set task deadlines", body: "{count} task(s) have no deadline. Deadlines make progress easier to track.", button: "Show tasks without deadlines" },
    no_tasks: { title: "Add your first tasks", body: "This plan has no tasks yet. Add the steps you need to reach your goal.", button: "Open plan" },
    continue: { title: "Keep moving forward", body: "{count} task(s) are still open. Continue with the next one.", button: "Show open tasks" },
    complete: { title: "All tasks are done", body: "Every task is finished. Complete the plan and record the outcome.", button: "Complete plan" },
    archive: { title: "Review and archive", body: "This plan is complete. Review the outcome and archive it when you are ready.", button: "Archive plan" },
    create_plan: { title: "Ready to turn it into an Action Plan?", body: "Your decision is saved but has no plan yet. Add the steps, owners and dates that carry it out.", button: "Create Action Plan" },
  },
};

const fr: Copy = {
  heading: "Votre prochaine étape",
  viewPlan: "Voir le plan",
  showAll: "Afficher toutes les tâches",
  actions: {
    overdue: { title: "Revoir les tâches en retard", body: "{count} tâche(s) ont dépassé leur échéance. Les revoir maintenant aide à tenir le plan.", button: "Afficher les tâches en retard" },
    today: { title: "Concentrez-vous sur les tâches du jour", body: "{count} tâche(s) sont à faire aujourd'hui. Choisissez la plus petite et commencez par elle.", button: "Afficher les tâches du jour" },
    blocked: { title: "Débloquer les tâches bloquées", body: "{count} tâche(s) sont bloquées. Identifiez ce qui les retient.", button: "Afficher les tâches bloquées" },
    no_deadlines: { title: "Fixer des échéances aux tâches", body: "{count} tâche(s) n'ont pas d'échéance. Les échéances facilitent le suivi.", button: "Afficher les tâches sans échéance" },
    no_tasks: { title: "Ajoutez vos premières tâches", body: "Ce plan n'a pas encore de tâches. Ajoutez les étapes nécessaires pour atteindre votre objectif.", button: "Ouvrir le plan" },
    continue: { title: "Continuez d'avancer", body: "{count} tâche(s) restent ouvertes. Poursuivez avec la suivante.", button: "Afficher les tâches ouvertes" },
    complete: { title: "Toutes les tâches sont terminées", body: "Chaque tâche est finie. Terminez le plan et notez le résultat.", button: "Terminer le plan" },
    archive: { title: "Revoir et archiver", body: "Ce plan est terminé. Revoyez le résultat et archivez-le quand vous le souhaitez.", button: "Archiver le plan" },
    create_plan: { title: "Prêt à en faire un plan d'action ?", body: "Votre décision est enregistrée mais n'a pas encore de plan. Ajoutez les étapes, responsables et dates pour la mettre en œuvre.", button: "Créer un plan d'action" },
  },
};

const es: Copy = {
  heading: "Tu siguiente paso",
  viewPlan: "Ver el plan",
  showAll: "Mostrar todas las tareas",
  actions: {
    overdue: { title: "Revisar tareas atrasadas", body: "{count} tarea(s) ya pasaron su fecha límite. Revisarlas ahora mantiene el plan en marcha.", button: "Mostrar tareas atrasadas" },
    today: { title: "Concéntrate en las tareas de hoy", body: "{count} tarea(s) vencen hoy. Elige la más pequeña y empieza por ahí.", button: "Mostrar tareas de hoy" },
    blocked: { title: "Resolver tareas bloqueadas", body: "{count} tarea(s) están bloqueadas. Averigua qué las está frenando.", button: "Mostrar tareas bloqueadas" },
    no_deadlines: { title: "Poner fechas límite a las tareas", body: "{count} tarea(s) no tienen fecha límite. Las fechas facilitan seguir el progreso.", button: "Mostrar tareas sin fecha" },
    no_tasks: { title: "Añade tus primeras tareas", body: "Este plan aún no tiene tareas. Añade los pasos que necesitas para alcanzar tu meta.", button: "Abrir el plan" },
    continue: { title: "Sigue avanzando", body: "{count} tarea(s) siguen abiertas. Continúa con la siguiente.", button: "Mostrar tareas abiertas" },
    complete: { title: "Todas las tareas están hechas", body: "Cada tarea está terminada. Completa el plan y registra el resultado.", button: "Completar el plan" },
    archive: { title: "Revisar y archivar", body: "Este plan está terminado. Revisa el resultado y archívalo cuando quieras.", button: "Archivar el plan" },
    create_plan: { title: "¿Listo para convertirlo en un plan de acción?", body: "Tu decisión está guardada, pero aún no tiene plan. Añade los pasos, responsables y fechas para llevarla a cabo.", button: "Crear plan de acción" },
  },
};

const pt: Copy = {
  heading: "Seu próximo passo",
  viewPlan: "Ver o plano",
  showAll: "Mostrar todas as tarefas",
  actions: {
    overdue: { title: "Revisar tarefas atrasadas", body: "{count} tarefa(s) passaram do prazo. Revisá-las agora mantém o plano no caminho certo.", button: "Mostrar tarefas atrasadas" },
    today: { title: "Foque nas tarefas de hoje", body: "{count} tarefa(s) vencem hoje. Escolha a menor e comece por ela.", button: "Mostrar tarefas de hoje" },
    blocked: { title: "Resolver tarefas bloqueadas", body: "{count} tarefa(s) estão bloqueadas. Descubra o que as está travando.", button: "Mostrar tarefas bloqueadas" },
    no_deadlines: { title: "Definir prazos para as tarefas", body: "{count} tarefa(s) não têm prazo. Prazos facilitam acompanhar o progresso.", button: "Mostrar tarefas sem prazo" },
    no_tasks: { title: "Adicione suas primeiras tarefas", body: "Este plano ainda não tem tarefas. Adicione os passos necessários para chegar à sua meta.", button: "Abrir o plano" },
    continue: { title: "Continue avançando", body: "{count} tarefa(s) ainda estão abertas. Siga para a próxima.", button: "Mostrar tarefas abertas" },
    complete: { title: "Todas as tarefas foram concluídas", body: "Todas as tarefas estão prontas. Conclua o plano e registre o resultado.", button: "Concluir o plano" },
    archive: { title: "Revisar e arquivar", body: "Este plano está concluído. Revise o resultado e arquive quando quiser.", button: "Arquivar o plano" },
    create_plan: { title: "Pronto para transformá-la em um plano de ação?", body: "Sua decisão está salva, mas ainda não tem plano. Adicione as etapas, responsáveis e prazos para colocá-la em prática.", button: "Criar plano de ação" },
  },
};

const sw: Copy = {
  heading: "Hatua yako inayofuata",
  viewPlan: "Ona mpango",
  showAll: "Onyesha kazi zote",
  actions: {
    overdue: { title: "Kagua kazi zilizochelewa", body: "Kazi {count} zimepita tarehe zake. Kuzikagua sasa kunaweka mpango kwenye mstari.", button: "Onyesha kazi zilizochelewa" },
    today: { title: "Zingatia kazi za leo", body: "Kazi {count} zinatakiwa leo. Chagua ndogo zaidi uanze nayo.", button: "Onyesha kazi za leo" },
    blocked: { title: "Tatua kazi zilizokwama", body: "Kazi {count} zimekwama. Tafuta kinachozizuia.", button: "Onyesha kazi zilizokwama" },
    no_deadlines: { title: "Weka tarehe za mwisho kwa kazi", body: "Kazi {count} hazina tarehe ya mwisho. Tarehe hurahisisha kufuatilia maendeleo.", button: "Onyesha kazi bila tarehe" },
    no_tasks: { title: "Ongeza kazi zako za kwanza", body: "Mpango huu bado hauna kazi. Ongeza hatua unazohitaji kufikia lengo lako.", button: "Fungua mpango" },
    continue: { title: "Endelea mbele", body: "Kazi {count} bado zinasubiri. Endelea na inayofuata.", button: "Onyesha kazi zilizobaki" },
    complete: { title: "Kazi zote zimekamilika", body: "Kila kazi imekamilika. Maliza mpango na uandike matokeo.", button: "Maliza mpango" },
    archive: { title: "Kagua na uhifadhi", body: "Mpango huu umekamilika. Kagua matokeo na uuhifadhi ukiwa tayari.", button: "Hifadhi mpango" },
    create_plan: { title: "Uko tayari kuigeuza kuwa mpango wa hatua?", body: "Uamuzi wako umehifadhiwa lakini bado hauna mpango. Ongeza hatua, wahusika na tarehe za kuutekeleza.", button: "Unda mpango wa hatua" },
  },
};

const zh: Copy = {
  heading: "你的下一步",
  viewPlan: "查看计划",
  showAll: "显示所有任务",
  actions: {
    overdue: { title: "查看逾期任务", body: "有 {count} 个任务已过期。现在处理它们，计划才能保持正轨。", button: "显示逾期任务" },
    today: { title: "专注于今天的任务", body: "今天有 {count} 个任务到期。选一个最小的，从它开始。", button: "显示今天的任务" },
    blocked: { title: "处理受阻任务", body: "有 {count} 个任务受阻。找出是什么在阻碍它们。", button: "显示受阻任务" },
    no_deadlines: { title: "为任务设置截止日期", body: "有 {count} 个任务没有截止日期。截止日期让进度更容易跟踪。", button: "显示无截止日期的任务" },
    no_tasks: { title: "添加第一批任务", body: "这个计划还没有任务。添加实现目标所需的步骤。", button: "打开计划" },
    continue: { title: "继续前进", body: "还有 {count} 个任务未完成。从下一个开始。", button: "显示未完成的任务" },
    complete: { title: "所有任务已完成", body: "每个任务都已完成。完成计划并记录结果。", button: "完成计划" },
    archive: { title: "回顾并归档", body: "这个计划已完成。回顾结果，准备好后再归档。", button: "归档计划" },
    create_plan: { title: "准备好把它变成行动计划了吗？", body: "你的决定已保存，但还没有计划。添加执行它所需的步骤、负责人和日期。", button: "创建行动计划" },
  },
};

const NEXT_STEP_STRINGS: Record<Lang, Copy> = { en, fr, es, pt, sw, zh };

// The text for one recommendation, in the user's language.
export function nextStepText(lang: Lang, step: Pick<NextStep, "action" | "count">) {
  const copy = NEXT_STEP_STRINGS[lang];
  const entry = copy.actions[step.action];
  return {
    heading: copy.heading,
    viewPlan: copy.viewPlan,
    showAll: copy.showAll,
    title: entry.title,
    body: fmt(entry.body, { count: step.count }),
    button: entry.button,
  };
}
