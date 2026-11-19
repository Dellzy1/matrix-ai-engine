import type { Lang } from "./i18n";

// What a new saved decision should include. Saved in matrices.report_type.
export type SaveChoice = "complete" | "calculator_only" | "action_plan_only";

export type SaveChoiceStrings = {
  title: string;
  complete: string;
  completeHint: string;
  calculatorOnly: string;
  calculatorOnlyHint: string;
  planOnly: string;
  planOnlyHint: string;
  cancel: string;
};

export const SAVE_CHOICE_STRINGS: Record<Lang, SaveChoiceStrings> = {
  en: {
    title: "How would you like to save this decision?",
    complete: "Complete Plan",
    completeHint: "Save the decision and create an Action Plan linked to it.",
    calculatorOnly: "Calculator Only",
    calculatorOnlyHint: "Save the decision analysis without creating an Action Plan.",
    planOnly: "Action Plan Only",
    planOnlyHint: "Create an Action Plan. Its report leaves out the Calculator analysis.",
    cancel: "Cancel",
  },
  fr: {
    title: "Comment voulez-vous enregistrer cette décision ?",
    complete: "Plan complet",
    completeHint: "Enregistrer la décision et créer un plan d'action qui lui est lié.",
    calculatorOnly: "Calculatrice seule",
    calculatorOnlyHint: "Enregistrer l'analyse sans créer de plan d'action.",
    planOnly: "Plan d'action seul",
    planOnlyHint: "Créer un plan d'action. Son rapport omet l'analyse de la calculatrice.",
    cancel: "Annuler",
  },
  es: {
    title: "¿Cómo quiere guardar esta decisión?",
    complete: "Plan completo",
    completeHint: "Guardar la decisión y crear un plan de acción vinculado a ella.",
    calculatorOnly: "Solo calculadora",
    calculatorOnlyHint: "Guardar el análisis sin crear un plan de acción.",
    planOnly: "Solo plan de acción",
    planOnlyHint: "Crear un plan de acción. Su informe omite el análisis de la calculadora.",
    cancel: "Cancelar",
  },
  pt: {
    title: "Como você quer salvar esta decisão?",
    complete: "Plano completo",
    completeHint: "Salvar a decisão e criar um plano de ação vinculado a ela.",
    calculatorOnly: "Somente calculadora",
    calculatorOnlyHint: "Salvar a análise sem criar um plano de ação.",
    planOnly: "Somente plano de ação",
    planOnlyHint: "Criar um plano de ação. O relatório deixa de fora a análise da calculadora.",
    cancel: "Cancelar",
  },
  sw: {
    title: "Ungependa kuhifadhi uamuzi huu vipi?",
    complete: "Mpango kamili",
    completeHint: "Hifadhi uamuzi na uunde mpango wa hatua unaohusiana nao.",
    calculatorOnly: "Kikokotoo pekee",
    calculatorOnlyHint: "Hifadhi uchambuzi bila kuunda mpango wa hatua.",
    planOnly: "Mpango wa hatua pekee",
    planOnlyHint: "Unda mpango wa hatua. Ripoti yake haijumuishi uchambuzi wa kikokotoo.",
    cancel: "Ghairi",
  },
  zh: {
    title: "您希望如何保存这个决策？",
    complete: "完整计划",
    completeHint: "保存决策，并创建与之关联的行动计划。",
    calculatorOnly: "仅计算器",
    calculatorOnlyHint: "保存分析结果，不创建行动计划。",
    planOnly: "仅行动计划",
    planOnlyHint: "创建行动计划。其报告不包含计算器分析。",
    cancel: "取消",
  },
};
