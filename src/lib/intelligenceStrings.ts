import { fmt, type Lang } from "./i18n";
import type { Finding, FindingCode } from "./intelligence";

// Text for the Challenge Engine and the assumptions section, in the app's six languages.
// Sentences use facts from the finding. Missing fields are described as details to add, not as failures.
export type IntelCopy = {
  heading: string;
  review: string;
  accept: string;
  explain: string;
  reject: string;
  resolve: string;
  explainPlaceholder: string;
  save: string;
  cancel: string;
  confirmed: string;
  potential: string;
  explained: string;
  accepted: string;
  discussed: string;
  resolved: string;
  fields: { goal: string; budget: string };
  texts: Record<FindingCode, { confirmed?: string; potential?: string }>;
  assumptionsHeading: string;
  addAssumption: string;
  statementPlaceholder: string;
  add: string;
  evidencePlaceholder: string;
  supports: string;
  opposes: string;
  addEvidence: string;
  budgetAmount: string;
  budgetCurrency: string;
  budgetStatus: string;
  statusNone: string;
  statusEstimated: string;
  statusCommitted: string;
  statusSpent: string;
  assumptionStatus: Record<"unvalidated" | "supported" | "contradicted" | "validated" | "dismissed", string>;
};

const en: IntelCopy = {
  heading: "A challenge to consider",
  review: "Review concern",
  accept: "I'll act on it",
  explain: "Explain",
  reject: "This isn't a problem",
  resolve: "Mark as resolved",
  explainPlaceholder: "Add the context that is missing (optional)",
  save: "Save",
  cancel: "Cancel",
  confirmed: "Confirmed issue",
  potential: "Potential concern",
  explained: "Your explanation was received",
  accepted: "In hand",
  discussed: "Already discussed",
  resolved: "Resolved",
  fields: { goal: "goal", budget: "budget" },
  texts: {
    deadline_after_tasks: { confirmed: "{count} task(s) are scheduled after the project deadline." },
    deadline_passed: { confirmed: "The project deadline has passed with {count} task(s) still open." },
    unrealistic_deadline: { potential: "Your deadline may be unrealistic: {count} open task(s) with {days} day(s) left. This check does not know your available hours." },
    missing_information: { potential: "Some details are blank: {fields}. They help the plan make sense. They are not a sign that the plan is weak." },
    weak_assumption: { confirmed: "“{statement}” has evidence against it ({count})." , potential: "“{statement}” has no evidence yet." },
    conflicting_tasks: { confirmed: "“{task}” ends before it starts. Check its start and due dates.", potential: "{count} open tasks are due on {date}. Check that you can handle them together." },
    missing_preparation: { confirmed: "“{task}” has started, but an earlier stage still has open tasks." },
    financial_inconsistency: { confirmed: "A budget amount of {amount} is set without a currency.", potential: "The budget is written as text only ({text}), so it can't be checked against amounts. Add an amount if you have one." },
    unclear_objective: { potential: "The success measure is blank or has no number to check against. Describe a result you can measure." },
    unsupported_idea: { confirmed: "The decision behind this plan has evidence against {count} assumption(s).", potential: "The decision behind this plan has {count} assumption(s) with no evidence yet." },
  },
  assumptionsHeading: "Assumptions",
  addAssumption: "Add an assumption",
  statementPlaceholder: "What does this plan assume?",
  add: "Add",
  evidencePlaceholder: "Evidence (what supports or contradicts it)",
  supports: "Supports",
  opposes: "Opposes",
  addEvidence: "Add evidence",
  budgetAmount: "Budget amount",
  budgetCurrency: "Currency",
  budgetStatus: "Budget status",
  statusNone: "—",
  statusEstimated: "Estimated",
  statusCommitted: "Committed",
  statusSpent: "Spent",
  assumptionStatus: { unvalidated: "Not validated", supported: "Supported", contradicted: "Contradicted", validated: "Validated", dismissed: "Dismissed" },
};

const fr: IntelCopy = {
  heading: "Un point à examiner",
  review: "Examiner ce point",
  accept: "Je vais agir",
  explain: "Expliquer",
  reject: "Ce n'est pas un problème",
  resolve: "Marquer comme résolu",
  explainPlaceholder: "Donnez le contexte qui manque (facultatif)",
  save: "Enregistrer",
  cancel: "Annuler",
  confirmed: "Problème confirmé",
  potential: "Point de vigilance",
  explained: "Votre explication a été reçue",
  accepted: "Pris en charge",
  discussed: "Déjà discuté",
  resolved: "Résolu",
  fields: { goal: "objectif", budget: "budget" },
  texts: {
    deadline_after_tasks: { confirmed: "{count} tâche(s) sont prévues après l'échéance du projet." },
    deadline_passed: { confirmed: "L'échéance du projet est passée alors que {count} tâche(s) sont encore ouvertes." },
    unrealistic_deadline: { potential: "L'échéance peut être irréaliste : {count} tâche(s) ouvertes et {days} jour(s) restants. Cette vérification ne connaît pas vos heures disponibles." },
    missing_information: { potential: "Certains détails sont vides : {fields}. Ils aident le plan à tenir debout. Ce n'est pas un signe de faiblesse." },
    weak_assumption: { confirmed: "« {statement} » est contredite par des preuves ({count}).", potential: "« {statement} » n'a encore aucune preuve." },
    conflicting_tasks: { confirmed: "« {task} » se termine avant de commencer. Vérifiez ses dates de début et d'échéance.", potential: "{count} tâches ouvertes sont dues le {date}. Vérifiez que vous pouvez les gérer ensemble." },
    missing_preparation: { confirmed: "« {task} » a commencé, mais une étape précédente a encore des tâches ouvertes." },
    financial_inconsistency: { confirmed: "Un montant de budget de {amount} est indiqué sans devise.", potential: "Le budget n'est écrit qu'en texte ({text}), il ne peut donc pas être vérifié. Ajoutez un montant si vous en avez un." },
    unclear_objective: { potential: "Le critère de réussite est vide ou ne contient aucun chiffre à vérifier. Décrivez un résultat mesurable." },
    unsupported_idea: { confirmed: "La décision derrière ce plan contient des preuves contraires à {count} hypothèse(s).", potential: "La décision derrière ce plan a {count} hypothèse(s) sans aucune preuve pour l'instant." },
  },
  assumptionsHeading: "Hypothèses",
  addAssumption: "Ajouter une hypothèse",
  statementPlaceholder: "Qu'est-ce que ce plan suppose ?",
  add: "Ajouter",
  evidencePlaceholder: "Preuve (ce qui le confirme ou le contredit)",
  supports: "Pour",
  opposes: "Contre",
  addEvidence: "Ajouter une preuve",
  budgetAmount: "Montant du budget",
  budgetCurrency: "Devise",
  budgetStatus: "Statut du budget",
  statusNone: "—",
  statusEstimated: "Estimé",
  statusCommitted: "Engagé",
  statusSpent: "Dépensé",
  assumptionStatus: { unvalidated: "Non validée", supported: "Soutenue", contradicted: "Contredite", validated: "Validée", dismissed: "Écartée" },
};

const es: IntelCopy = {
  heading: "Un punto a revisar",
  review: "Revisar este punto",
  accept: "Lo voy a atender",
  explain: "Explicar",
  reject: "No es un problema",
  resolve: "Marcar como resuelto",
  explainPlaceholder: "Añade el contexto que falta (opcional)",
  save: "Guardar",
  cancel: "Cancelar",
  confirmed: "Problema confirmado",
  potential: "Posible preocupación",
  explained: "Tu explicación fue recibida",
  accepted: "En marcha",
  discussed: "Ya comentado",
  resolved: "Resuelto",
  fields: { goal: "objetivo", budget: "presupuesto" },
  texts: {
    deadline_after_tasks: { confirmed: "{count} tarea(s) están programadas después de la fecha límite del proyecto." },
    deadline_passed: { confirmed: "La fecha límite del proyecto ya pasó y {count} tarea(s) siguen abiertas." },
    unrealistic_deadline: { potential: "La fecha límite podría no ser realista: {count} tarea(s) abiertas y {days} día(s) restantes. Esta revisión no conoce tus horas disponibles." },
    missing_information: { potential: "Faltan algunos datos: {fields}. Ayudan a que el plan se entienda. No es señal de que el plan sea débil." },
    weak_assumption: { confirmed: "«{statement}» tiene evidencia en contra ({count}).", potential: "«{statement}» todavía no tiene evidencia." },
    conflicting_tasks: { confirmed: "«{task}» termina antes de empezar. Revisa sus fechas de inicio y de entrega.", potential: "{count} tareas abiertas vencen el {date}. Revisa si puedes con todas a la vez." },
    missing_preparation: { confirmed: "«{task}» ya empezó, pero una etapa anterior todavía tiene tareas abiertas." },
    financial_inconsistency: { confirmed: "Hay un monto de presupuesto de {amount} sin moneda.", potential: "El presupuesto está escrito solo como texto ({text}), así que no se puede comparar con montos. Añade un monto si lo tienes." },
    unclear_objective: { potential: "El criterio de éxito está vacío o no tiene un número para comprobarlo. Describe un resultado medible." },
    unsupported_idea: { confirmed: "La decisión detrás de este plan tiene evidencia en contra de {count} supuesto(s).", potential: "La decisión detrás de este plan tiene {count} supuesto(s) sin evidencia todavía." },
  },
  assumptionsHeading: "Supuestos",
  addAssumption: "Añadir un supuesto",
  statementPlaceholder: "¿Qué supone este plan?",
  add: "Añadir",
  evidencePlaceholder: "Evidencia (lo que lo apoya o lo contradice)",
  supports: "A favor",
  opposes: "En contra",
  addEvidence: "Añadir evidencia",
  budgetAmount: "Monto del presupuesto",
  budgetCurrency: "Moneda",
  budgetStatus: "Estado del presupuesto",
  statusNone: "—",
  statusEstimated: "Estimado",
  statusCommitted: "Comprometido",
  statusSpent: "Gastado",
  assumptionStatus: { unvalidated: "Sin validar", supported: "Apoyado", contradicted: "Contradicho", validated: "Validado", dismissed: "Descartado" },
};

const pt: IntelCopy = {
  heading: "Um ponto para considerar",
  review: "Revisar este ponto",
  accept: "Vou cuidar disso",
  explain: "Explicar",
  reject: "Não é um problema",
  resolve: "Marcar como resolvido",
  explainPlaceholder: "Dê o contexto que falta (opcional)",
  save: "Salvar",
  cancel: "Cancelar",
  confirmed: "Problema confirmado",
  potential: "Possível preocupação",
  explained: "Sua explicação foi recebida",
  accepted: "Em andamento",
  discussed: "Já discutido",
  resolved: "Resolvido",
  fields: { goal: "objetivo", budget: "orçamento" },
  texts: {
    deadline_after_tasks: { confirmed: "{count} tarefa(s) estão marcadas para depois do prazo do projeto." },
    deadline_passed: { confirmed: "O prazo do projeto já passou com {count} tarefa(s) ainda abertas." },
    unrealistic_deadline: { potential: "O prazo pode não ser realista: {count} tarefa(s) abertas e {days} dia(s) restantes. Esta verificação não conhece suas horas disponíveis." },
    missing_information: { potential: "Alguns detalhes estão em branco: {fields}. Eles ajudam o plano a fazer sentido. Não é sinal de que o plano é fraco." },
    weak_assumption: { confirmed: "“{statement}” tem evidência contrária ({count}).", potential: "“{statement}” ainda não tem evidência." },
    conflicting_tasks: { confirmed: "“{task}” termina antes de começar. Confira as datas de início e de entrega.", potential: "{count} tarefas abertas vencem em {date}. Confira se você consegue dar conta delas juntas." },
    missing_preparation: { confirmed: "“{task}” já começou, mas uma etapa anterior ainda tem tarefas abertas." },
    financial_inconsistency: { confirmed: "Há um valor de orçamento de {amount} sem moeda.", potential: "O orçamento está só escrito como texto ({text}), então não dá para comparar com valores. Adicione um valor se tiver." },
    unclear_objective: { potential: "O critério de sucesso está vazio ou não tem número para checar. Descreva um resultado mensurável." },
    unsupported_idea: { confirmed: "A decisão por trás deste plano tem evidência contrária a {count} premissa(s).", potential: "A decisão por trás deste plano tem {count} premissa(s) sem evidência ainda." },
  },
  assumptionsHeading: "Premissas",
  addAssumption: "Adicionar uma premissa",
  statementPlaceholder: "O que este plano pressupõe?",
  add: "Adicionar",
  evidencePlaceholder: "Evidência (o que apoia ou contradiz)",
  supports: "A favor",
  opposes: "Contra",
  addEvidence: "Adicionar evidência",
  budgetAmount: "Valor do orçamento",
  budgetCurrency: "Moeda",
  budgetStatus: "Situação do orçamento",
  statusNone: "—",
  statusEstimated: "Estimado",
  statusCommitted: "Comprometido",
  statusSpent: "Gasto",
  assumptionStatus: { unvalidated: "Não validada", supported: "Apoiada", contradicted: "Contestada", validated: "Validada", dismissed: "Descartada" },
};

const sw: IntelCopy = {
  heading: "Kitu cha kuzingatiwa",
  review: "Kagua jambo hili",
  accept: "Nitalishughulikia",
  explain: "Eleza",
  reject: "Sio tatizo",
  resolve: "Weka kuwa limetatuliwa",
  explainPlaceholder: "Ongeza muktadha unaokosekana (si lazima)",
  save: "Hifadhi",
  cancel: "Ghairi",
  confirmed: "Tatizo lililothibitishwa",
  potential: "Wasiwasi unaowezekana",
  explained: "Maelezo yako yamepokelewa",
  accepted: "Inashughulikiwa",
  discussed: "Tayari limejadiliwa",
  resolved: "Limetatuliwa",
  fields: { goal: "lengo", budget: "bajeti" },
  texts: {
    deadline_after_tasks: { confirmed: "Kazi {count} zimepangwa baada ya tarehe ya mwisho ya mradi." },
    deadline_passed: { confirmed: "Tarehe ya mwisho ya mradi imepita huku kazi {count} zikiwa bado wazi." },
    unrealistic_deadline: { potential: "Tarehe ya mwisho inaweza kuwa haihalisiki: kazi {count} zilizo wazi na siku {days} zilizobaki. Ukaguzi huu hauijui saa zako za kazi." },
    missing_information: { potential: "Baadhi ya taarifa ni tupu: {fields}. Zinasaidia mpango kueleweka. Si ishara kwamba mpango ni dhaifu." },
    weak_assumption: { confirmed: "“{statement}” ina ushahidi unaopinga ({count}).", potential: "“{statement}” bado haina ushahidi wowote." },
    conflicting_tasks: { confirmed: "“{task}” inamalizika kabla haijaanza. Kagua tarehe zake za kuanza na za mwisho.", potential: "Kazi {count} zilizo wazi zinatakiwa {date}. Hakikisha unaweza kuzishughulikia pamoja." },
    missing_preparation: { confirmed: "“{task}” imeanza, lakini hatua ya awali bado ina kazi zilizo wazi." },
    financial_inconsistency: { confirmed: "Kiasi cha bajeti cha {amount} kimewekwa bila sarafu.", potential: "Bajeti imeandikwa kwa maandishi tu ({text}), kwa hiyo haiwezi kulinganishwa na kiasi. Ongeza kiasi ukiwa nacho." },
    unclear_objective: { potential: "Kigezo cha mafanikio ni tupu au hakina namba ya kukagua. Eleza matokeo yanayoweza kupimwa." },
    unsupported_idea: { confirmed: "Uamuzi nyuma ya mpango huu una ushahidi unaopinga dhana {count}.", potential: "Uamuzi nyuma ya mpango huu una dhana {count} bila ushahidi bado." },
  },
  assumptionsHeading: "Dhana",
  addAssumption: "Ongeza dhana",
  statementPlaceholder: "Mpango huu unadhania nini?",
  add: "Ongeza",
  evidencePlaceholder: "Ushahidi (unaounga mkono au kupinga)",
  supports: "Inaunga mkono",
  opposes: "Inapinga",
  addEvidence: "Ongeza ushahidi",
  budgetAmount: "Kiasi cha bajeti",
  budgetCurrency: "Sarafu",
  budgetStatus: "Hali ya bajeti",
  statusNone: "—",
  statusEstimated: "Makadirio",
  statusCommitted: "Imeahidiwa",
  statusSpent: "Imetumika",
  assumptionStatus: { unvalidated: "Haijathibitishwa", supported: "Imeungwa mkono", contradicted: "Imepingwa", validated: "Imethibitishwa", dismissed: "Imeondolewa" },
};

const zh: IntelCopy = {
  heading: "值得考虑的挑战",
  review: "查看此问题",
  accept: "我会处理",
  explain: "说明原因",
  reject: "这不是问题",
  resolve: "标记为已解决",
  explainPlaceholder: "补充缺少的背景（可选）",
  save: "保存",
  cancel: "取消",
  confirmed: "已确认的问题",
  potential: "潜在顾虑",
  explained: "已收到你的说明",
  accepted: "处理中",
  discussed: "已讨论",
  resolved: "已解决",
  fields: { goal: "目标", budget: "预算" },
  texts: {
    deadline_after_tasks: { confirmed: "有 {count} 个任务安排在项目截止日期之后。" },
    deadline_passed: { confirmed: "项目截止日期已过，仍有 {count} 个任务未完成。" },
    unrealistic_deadline: { potential: "截止日期可能不现实：有 {count} 个未完成任务，距离截止还有 {days} 天。此检查不了解你可用的工作时间。" },
    missing_information: { potential: "有些信息为空：{fields}。它们有助于计划更清晰，但这并不说明计划薄弱。" },
    weak_assumption: { confirmed: "“{statement}”有相反的证据（{count} 条）。", potential: "“{statement}”目前还没有证据。" },
    conflicting_tasks: { confirmed: "“{task}”在开始之前就结束了。请检查它的开始和截止日期。", potential: "有 {count} 个未完成任务都在 {date} 到期。请确认你能同时应付。" },
    missing_preparation: { confirmed: "“{task}”已经开始，但前面的阶段仍有未完成的任务。" },
    financial_inconsistency: { confirmed: "已设定 {amount} 的预算金额，但没有货币单位。", potential: "预算只以文字形式填写（{text}），无法与金额对照检查。如有金额，请补充。" },
    unclear_objective: { potential: "成功标准为空，或没有可供检查的数字。请描述一个可以衡量的结果。" },
    unsupported_idea: { confirmed: "此计划背后的决定有 {count} 个假设存在相反的证据。", potential: "此计划背后的决定有 {count} 个假设目前还没有证据。" },
  },
  assumptionsHeading: "假设",
  addAssumption: "添加假设",
  statementPlaceholder: "这个计划依赖什么假设？",
  add: "添加",
  evidencePlaceholder: "证据（支持或反对的内容）",
  supports: "支持",
  opposes: "反对",
  addEvidence: "添加证据",
  budgetAmount: "预算金额",
  budgetCurrency: "货币",
  budgetStatus: "预算状态",
  statusNone: "—",
  statusEstimated: "估算",
  statusCommitted: "已承诺",
  statusSpent: "已花费",
  assumptionStatus: { unvalidated: "未验证", supported: "已支持", contradicted: "已被反驳", validated: "已验证", dismissed: "已排除" },
};

export const INTEL_STRINGS: Record<Lang, IntelCopy> = { en, fr, es, pt, sw, zh };

// The sentence for one finding, with its facts filled in. Field names are translated.
export function findingSentence(lang: Lang, f: Finding): string {
  const copy = INTEL_STRINGS[lang];
  const variant = copy.texts[f.code][f.level] ?? copy.texts[f.code].potential ?? copy.texts[f.code].confirmed ?? "";
  const d = f.detail;
  const fields = String(d.fields ?? "")
    .split(",")
    .filter(Boolean)
    .map((k) => copy.fields[k as "goal" | "budget"] ?? k)
    .join(", ");
  return fmt(variant, {
    count: d.count ?? 0,
    days: d.days ?? 0,
    statement: String(d.statement ?? ""),
    task: String(d.task ?? ""),
    date: String(d.date ?? ""),
    amount: d.amount != null ? String(d.amount) : "",
    text: String(d.text ?? ""),
    fields,
  });
}
