import type { Lang } from "./i18n";
import type { TaskStatus } from "./projects";
import type { Audience } from "./reportData";

// Labels for the Complete Decision & Action Report, in all six languages.
export type ReportStrings = {
  kind: string;
  budgetHeading: string;
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
    budget: string;
    resources: string;
    lowerBetter: string;
    higherBetter: string;
    description: string;
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
    budgetHeading: "Budget and resources",
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
      budget: "Budget", resources: "Resources",
      lowerBetter: "Lower is better", higherBetter: "Higher is better", description: "Description",
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
    budgetHeading: "Budget et ressources",
    created: "Créé le {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Résumé", decision: "Décision", analysis: "Analyse des options",
      choice: "Option choisie et recommandation", stages: "Plan d'action",
      risks: "Points de vigilance", outcome: "Résultat et enseignements",
    },
    labels: {
      budget: "Budget", resources: "Ressources",
      lowerBetter: "Plus bas est mieux", higherBetter: "Plus haut est mieux", description: "Description",
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
    budgetHeading: "Presupuesto y recursos",
    created: "Creado el {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Resumen", decision: "Decisión", analysis: "Análisis de opciones",
      choice: "Opción elegida y recomendación", stages: "Plan de acción",
      risks: "Puntos a revisar", outcome: "Resultado y aprendizajes",
    },
    labels: {
      budget: "Presupuesto", resources: "Recursos",
      lowerBetter: "Cuanto más bajo, mejor", higherBetter: "Cuanto más alto, mejor", description: "Descripción",
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
    budgetHeading: "Orçamento e recursos",
    created: "Criado em {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Resumo", decision: "Decisão", analysis: "Análise das opções",
      choice: "Opção escolhida e recomendação", stages: "Plano de ação",
      risks: "Pontos de atenção", outcome: "Resultado e aprendizados",
    },
    labels: {
      budget: "Orçamento", resources: "Recursos",
      lowerBetter: "Quanto menor, melhor", higherBetter: "Quanto maior, melhor", description: "Descrição",
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
    budgetHeading: "Bajeti na rasilimali",
    created: "Imeundwa {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "Muhtasari", decision: "Uamuzi", analysis: "Uchambuzi wa chaguo",
      choice: "Chaguo ulilochagua na pendekezo", stages: "Mpango wa hatua",
      risks: "Mambo ya kuzingatia", outcome: "Matokeo na mafunzo",
    },
    labels: {
      budget: "Bajeti", resources: "Rasilimali",
      lowerBetter: "Ndogo ni bora", higherBetter: "Kubwa ni bora", description: "Maelezo",
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
    budgetHeading: "预算与资源",
    created: "创建于 {date}",
    pageOf: "{page} / {total}",
    sections: {
      summary: "摘要", decision: "决策", analysis: "选项分析",
      choice: "最终选择与建议", stages: "行动计划",
      risks: "风险提示", outcome: "结果与经验",
    },
    labels: {
      budget: "预算", resources: "资源",
      lowerBetter: "数值越低越好", higherBetter: "数值越高越好", description: "描述",
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

// Labels for the preview screen and its buttons.
export type ReportUi = {
  openPreview: string;
  preview: string;
  download: string;
  close: string;
  loading: string;
  notFound: string;
  downloadFailed: string;
  note: string;
  noDecision: string;
};

export const REPORT_UI: Record<Lang, ReportUi> = {
  en: {
    openPreview: "Preview report",
    preview: "Report preview",
    download: "Download PDF",
    close: "Close",
    loading: "Preparing your report…",
    notFound: "This plan could not be loaded.",
    downloadFailed: "The PDF could not be made. Please try again.",
    note: "This is how your PDF will look. The file is made on your device and is not uploaded.",
    noDecision: "This plan is not linked to a saved decision, so the report has no calculator section.",
  },
  fr: {
    openPreview: "Aperçu du rapport",
    preview: "Aperçu du rapport",
    download: "Télécharger le PDF",
    close: "Fermer",
    loading: "Préparation de votre rapport…",
    notFound: "Ce plan n'a pas pu être chargé.",
    downloadFailed: "Le PDF n'a pas pu être créé. Veuillez réessayer.",
    note: "Voici à quoi ressemblera votre PDF. Le fichier est créé sur votre appareil et n'est pas envoyé.",
    noDecision: "Ce plan n'est lié à aucune décision enregistrée, le rapport n'a donc pas de section calculatrice.",
  },
  es: {
    openPreview: "Vista previa del informe",
    preview: "Vista previa del informe",
    download: "Descargar PDF",
    close: "Cerrar",
    loading: "Preparando su informe…",
    notFound: "No se pudo cargar este plan.",
    downloadFailed: "No se pudo crear el PDF. Inténtelo de nuevo.",
    note: "Así se verá su PDF. El archivo se crea en su dispositivo y no se sube.",
    noDecision: "Este plan no está vinculado a una decisión guardada, así que el informe no tiene sección de calculadora.",
  },
  pt: {
    openPreview: "Visualizar relatório",
    preview: "Pré-visualização do relatório",
    download: "Baixar PDF",
    close: "Fechar",
    loading: "Preparando seu relatório…",
    notFound: "Não foi possível carregar este plano.",
    downloadFailed: "Não foi possível criar o PDF. Tente novamente.",
    note: "Assim vai ficar o seu PDF. O arquivo é criado no seu dispositivo e não é enviado.",
    noDecision: "Este plano não está ligado a uma decisão salva, então o relatório não tem seção de calculadora.",
  },
  sw: {
    openPreview: "Angalia ripoti",
    preview: "Muhtasari wa ripoti",
    download: "Pakua PDF",
    close: "Funga",
    loading: "Tunaandaa ripoti yako…",
    notFound: "Mpango huu haukuweza kupakiwa.",
    downloadFailed: "PDF haikuweza kutengenezwa. Tafadhali jaribu tena.",
    note: "Hivi ndivyo PDF yako itakavyoonekana. Faili hutengenezwa kwenye kifaa chako na haipakiwi.",
    noDecision: "Mpango huu haujaunganishwa na uamuzi uliohifadhiwa, kwa hivyo ripoti haina sehemu ya kikokotoo.",
  },
  zh: {
    openPreview: "预览报告",
    preview: "报告预览",
    download: "下载 PDF",
    close: "关闭",
    loading: "正在准备您的报告…",
    notFound: "无法加载此计划。",
    downloadFailed: "无法生成 PDF，请重试。",
    note: "这就是您的 PDF 的样子。文件在您的设备上生成，不会上传。",
    noDecision: "此计划未关联已保存的决策，因此报告没有计算器部分。",
  },
};

// Labels for choosing the report type, audience and version.
export type ReportChooser = {
  typeLabel: string;
  typeDecision: string;
  typeAction: string;
  typeComplete: string;
  typeNeedsDecision: string;
  audienceLabel: string;
  audience: Record<Audience, string>;
  versionLabel: string;
  versionInternal: string;
  versionPresentation: string;
  versionInternalHint: string;
  versionPresentationHint: string;
  includeLabel: string;
};

export const REPORT_CHOOSER: Record<Lang, ReportChooser> = {
  en: {
    typeLabel: "Report type", typeDecision: "Decision Report", typeAction: "Action Plan Report",
    typeComplete: "Complete Report", typeNeedsDecision: "Needs a saved decision",
    audienceLabel: "Who is this report for?",
    audience: { investor: "Investor", partner: "Business partner", management: "Management", team: "Project team", client: "Client", personal: "Personal use", other: "Other" },
    versionLabel: "Version", versionInternal: "Internal", versionPresentation: "Presentation",
    versionInternalHint: "All details, including notes and weak points.",
    versionPresentationHint: "Polished for sharing. Leaves out weak points.",
    includeLabel: "What is included (untick to remove)",
  },
  fr: {
    typeLabel: "Type de rapport", typeDecision: "Rapport de décision", typeAction: "Rapport du plan d'action",
    typeComplete: "Rapport complet", typeNeedsDecision: "Nécessite une décision enregistrée",
    audienceLabel: "Pour qui est ce rapport ?",
    audience: { investor: "Investisseur", partner: "Associé", management: "Direction", team: "Équipe projet", client: "Client", personal: "Usage personnel", other: "Autre" },
    versionLabel: "Version", versionInternal: "Interne", versionPresentation: "Présentation",
    versionInternalHint: "Tous les détails, y compris les notes et les points faibles.",
    versionPresentationHint: "Soigné pour le partage. Retire les points faibles.",
    includeLabel: "Ce qui est inclus (décochez pour retirer)",
  },
  es: {
    typeLabel: "Tipo de informe", typeDecision: "Informe de decisión", typeAction: "Informe del plan de acción",
    typeComplete: "Informe completo", typeNeedsDecision: "Requiere una decisión guardada",
    audienceLabel: "¿Para quién es este informe?",
    audience: { investor: "Inversor", partner: "Socio comercial", management: "Dirección", team: "Equipo de proyecto", client: "Cliente", personal: "Uso personal", other: "Otro" },
    versionLabel: "Versión", versionInternal: "Interna", versionPresentation: "Presentación",
    versionInternalHint: "Todos los detalles, incluidas notas y puntos débiles.",
    versionPresentationHint: "Pulida para compartir. Omite los puntos débiles.",
    includeLabel: "Lo que se incluye (desmarque para quitar)",
  },
  pt: {
    typeLabel: "Tipo de relatório", typeDecision: "Relatório de decisão", typeAction: "Relatório do plano de ação",
    typeComplete: "Relatório completo", typeNeedsDecision: "Precisa de uma decisão salva",
    audienceLabel: "Para quem é este relatório?",
    audience: { investor: "Investidor", partner: "Sócio", management: "Gestão", team: "Equipe do projeto", client: "Cliente", personal: "Uso pessoal", other: "Outro" },
    versionLabel: "Versão", versionInternal: "Interna", versionPresentation: "Apresentação",
    versionInternalHint: "Todos os detalhes, incluindo notas e pontos fracos.",
    versionPresentationHint: "Polida para compartilhar. Deixa de fora os pontos fracos.",
    includeLabel: "O que está incluído (desmarque para remover)",
  },
  sw: {
    typeLabel: "Aina ya ripoti", typeDecision: "Ripoti ya uamuzi", typeAction: "Ripoti ya mpango wa hatua",
    typeComplete: "Ripoti kamili", typeNeedsDecision: "Inahitaji uamuzi uliohifadhiwa",
    audienceLabel: "Ripoti hii ni ya nani?",
    audience: { investor: "Mwekezaji", partner: "Mshirika wa biashara", management: "Uongozi", team: "Timu ya mradi", client: "Mteja", personal: "Matumizi binafsi", other: "Nyingine" },
    versionLabel: "Toleo", versionInternal: "La ndani", versionPresentation: "Wasilisho",
    versionInternalHint: "Maelezo yote, pamoja na vidokezo na udhaifu.",
    versionPresentationHint: "Imeboreshwa kwa kushiriki. Haijumuishi udhaifu.",
    includeLabel: "Kilichojumuishwa (ondoa alama kuondoa)",
  },
  zh: {
    typeLabel: "报告类型", typeDecision: "决策报告", typeAction: "行动计划报告",
    typeComplete: "完整报告", typeNeedsDecision: "需要已保存的决策",
    audienceLabel: "这份报告给谁看？",
    audience: { investor: "投资人", partner: "合作伙伴", management: "管理层", team: "项目团队", client: "客户", personal: "个人使用", other: "其他" },
    versionLabel: "版本", versionInternal: "内部版", versionPresentation: "展示版",
    versionInternalHint: "包含全部细节，包括备注和薄弱环节。",
    versionPresentationHint: "适合对外分享，不含薄弱环节。",
    includeLabel: "包含的内容（取消勾选即可移除）",
  },
};
