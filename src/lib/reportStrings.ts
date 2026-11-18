import type { Lang } from "./i18n";
import type { TaskStatus } from "./projects";

// Labels for the Complete Decision & Action Report, in all six languages.
export type ReportStrings = {
  kind: string;
  created: string;
  pageOf: string;
  sections: {
    summary: string;
    decision: string;
    analysis: string;
    choice: string;
    stages: string;
    risks: string;
    outcome: string;
  };
  labels: {
    goal: string;
    expected: string;
    measure: string;
    start: string;
    deadline: string;
    question: string;
    reason: string;
    options: string;
    criteria: string;
    weight: string;
    inverted: string;
    yes: string;
    no: string;
    ranking: string;
    chosen: string;
    recommended: string;
    outcome: string;
    lessons: string;
    due: string;
    progress: string;
    unstaged: string;
  };
  statuses: Record<TaskStatus, string>;
};

export const REPORT_STRINGS: Record<Lang, ReportStrings> = {
  en: {
    kind: "Complete Decision & Action Report",
    created: "Created {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Summary",
      decision: "Decision",
      analysis: "Option analysis",
      choice: "Chosen option and recommendation",
      stages: "Action plan",
      risks: "Things to check",
      outcome: "Outcome and lessons",
    },
    labels: {
      goal: "Goal", expected: "Expected result", measure: "Success measure",
      start: "Start", deadline: "Deadline", question: "Question", reason: "Reason",
      options: "Options", criteria: "Criteria", weight: "Weight", inverted: "Reversed",
      yes: "Yes", no: "No", ranking: "Calculator ranking", chosen: "Chosen option",
      recommended: "Calculator recommended", outcome: "Outcome", lessons: "Lessons",
      due: "Due {date}", progress: "{done} of {total} tasks done", unstaged: "Tasks without a stage",
    },
    statuses: { not_started: "Not started", in_progress: "In progress", completed: "Completed", blocked: "Blocked" },
  },
  fr: {
    kind: "Rapport complet de décision et d'action",
    created: "Créé le {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Résumé", decision: "Décision", analysis: "Analyse des options",
      choice: "Option choisie et recommandation", stages: "Plan d'action",
      risks: "Points de vigilance", outcome: "Résultat et enseignements",
    },
    labels: {
      goal: "Objectif", expected: "Résultat attendu", measure: "Mesure de réussite",
      start: "Début", deadline: "Échéance", question: "Question", reason: "Raison",
      options: "Options", criteria: "Critères", weight: "Poids", inverted: "Inversé",
      yes: "Oui", no: "Non", ranking: "Classement de la calculatrice", chosen: "Option choisie",
      recommended: "La calculatrice recommandait", outcome: "Résultat", lessons: "Enseignements",
      due: "Échéance {date}", progress: "{done} sur {total} tâches terminées", unstaged: "Tâches sans étape",
    },
    statuses: { not_started: "Pas commencé", in_progress: "En cours", completed: "Terminé", blocked: "Bloqué" },
  },
  es: {
    kind: "Informe completo de decisión y acción",
    created: "Creado el {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Resumen", decision: "Decisión", analysis: "Análisis de opciones",
      choice: "Opción elegida y recomendación", stages: "Plan de acción",
      risks: "Puntos a revisar", outcome: "Resultado y aprendizajes",
    },
    labels: {
      goal: "Objetivo", expected: "Resultado esperado", measure: "Medida de éxito",
      start: "Inicio", deadline: "Fecha límite", question: "Pregunta", reason: "Razón",
      options: "Opciones", criteria: "Criterios", weight: "Peso", inverted: "Invertido",
      yes: "Sí", no: "No", ranking: "Clasificación de la calculadora", chosen: "Opción elegida",
      recommended: "La calculadora recomendó", outcome: "Resultado", lessons: "Aprendizajes",
      due: "Vence {date}", progress: "{done} de {total} tareas completadas", unstaged: "Tareas sin etapa",
    },
    statuses: { not_started: "No iniciado", in_progress: "En curso", completed: "Completado", blocked: "Bloqueado" },
  },
  pt: {
    kind: "Relatório completo de decisão e ação",
    created: "Criado em {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Resumo", decision: "Decisão", analysis: "Análise das opções",
      choice: "Opção escolhida e recomendação", stages: "Plano de ação",
      risks: "Pontos de atenção", outcome: "Resultado e aprendizados",
    },
    labels: {
      goal: "Objetivo", expected: "Resultado esperado", measure: "Medida de sucesso",
      start: "Início", deadline: "Prazo", question: "Pergunta", reason: "Motivo",
      options: "Opções", criteria: "Critérios", weight: "Peso", inverted: "Invertido",
      yes: "Sim", no: "Não", ranking: "Classificação da calculadora", chosen: "Opção escolhida",
      recommended: "A calculadora recomendou", outcome: "Resultado", lessons: "Aprendizados",
      due: "Vence em {date}", progress: "{done} de {total} tarefas concluídas", unstaged: "Tarefas sem etapa",
    },
    statuses: { not_started: "Não iniciado", in_progress: "Em andamento", completed: "Concluído", blocked: "Bloqueado" },
  },
  sw: {
    kind: "Ripoti Kamili ya Uamuzi na Hatua",
    created: "Imeundwa {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Muhtasari", decision: "Uamuzi", analysis: "Uchambuzi wa chaguo",
      choice: "Chaguo ulilochagua na pendekezo", stages: "Mpango wa hatua",
      risks: "Mambo ya kuzingatia", outcome: "Matokeo na mafunzo",
    },
    labels: {
      goal: "Lengo", expected: "Matokeo yanayotarajiwa", measure: "Kipimo cha mafanikio",
      start: "Kuanza", deadline: "Tarehe ya mwisho", question: "Swali", reason: "Sababu",
      options: "Chaguo", criteria: "Vigezo", weight: "Uzito", inverted: "Imegeuzwa",
      yes: "Ndiyo", no: "Hapana", ranking: "Mpangilio wa kikokotoo", chosen: "Chaguo ulilochagua",
      recommended: "Kikokotoo kilipendekeza", outcome: "Matokeo", lessons: "Mafunzo",
      due: "Tarehe ya mwisho {date}", progress: "{done} kati ya {total} kazi zimekamilika", unstaged: "Kazi zisizo na hatua",
    },
    statuses: { not_started: "Haujaanza", in_progress: "Inaendelea", completed: "Imekamilika", blocked: "Imezuiwa" },
  },
  zh: {
    kind: "完整决策与行动报告",
    created: "创建于 {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "摘要", decision: "决策", analysis: "选项分析",
      choice: "最终选择与建议", stages: "行动计划",
      risks: "风险提示", outcome: "结果与经验",
    },
    labels: {
      goal: "目标", expected: "预期结果", measure: "成功衡量标准",
      start: "开始日期", deadline: "截止日期", question: "问题", reason: "理由",
      options: "选项", criteria: "标准", weight: "权重", inverted: "反向计分",
      yes: "是", no: "否", ranking: "计算器排名", chosen: "最终选择",
      recommended: "计算器推荐", outcome: "结果", lessons: "经验教训",
      due: "截止 {date}", progress: "已完成 {done} / {total} 项任务", unstaged: "未分阶段的任务",
    },
    statuses: { not_started: "未开始", in_progress: "进行中", completed: "已完成", blocked: "受阻" },
  },
};

// Fill {name} placeholders in a template string.
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}
