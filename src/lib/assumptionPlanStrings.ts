import type { Lang } from "./i18n";

// Copy for the validation plan on an assumption (Round 3).
export type PlanCopy = {
  heading: string;
  hint: string;
  method: string;
  methodPlaceholder: string;
  success: string;
  successPlaceholder: string;
  due: string;
  save: string;
  addToPlan: string;
  inPlan: string;
  saved: string;
  added: string;
  alreadyAdded: string;
  noProject: string;
  vMethod: string;
  vSuccess: string;
  vDate: string;
  vNoProject: string;
  taskPrefix: string;
  successLabel: string;
};

const en: PlanCopy = {
  heading: "Validation plan",
  hint: "Describe how you will test this assumption, and what result would count as success. Saving does not change its status or add tasks.",
  method: "How will you test it?",
  methodPlaceholder: "e.g. Call 10 potential customers and ask them to pre-order",
  success: "What result would count as success?",
  successPlaceholder: "e.g. At least 4 of 10 pre-order at the planned price",
  due: "Test by",
  save: "Save plan",
  addToPlan: "Add to Action Plan",
  inPlan: "In your Action Plan",
  saved: "Plan saved.",
  added: "Task added to your Action Plan.",
  alreadyAdded: "This validation is already in your Action Plan.",
  noProject: "Link this assumption to a project to add the test to an Action Plan.",
  vMethod: "Describe how you will test it.",
  vSuccess: "Describe what result would count as success.",
  vDate: "Choose a valid date.",
  vNoProject: "Link this assumption to a project first.",
  taskPrefix: "Validate:",
  successLabel: "Success:",
};

const fr: PlanCopy = {
  heading: "Plan de validation",
  hint: "Décrivez comment vous testerez cette hypothèse et quel résultat compterait comme un succès. Enregistrer ne change ni son statut ni ne crée de tâche.",
  method: "Comment allez-vous la tester ?",
  methodPlaceholder: "ex. Appeler 10 clients potentiels et leur demander une précommande",
  success: "Quel résultat compterait comme un succès ?",
  successPlaceholder: "ex. Au moins 4 clients sur 10 précommandent au prix prévu",
  due: "Tester avant le",
  save: "Enregistrer le plan",
  addToPlan: "Ajouter au plan d'action",
  inPlan: "Dans votre plan d'action",
  saved: "Plan enregistré.",
  added: "Tâche ajoutée à votre plan d'action.",
  alreadyAdded: "Cette validation est déjà dans votre plan d'action.",
  noProject: "Liez cette hypothèse à un projet pour ajouter le test à un plan d'action.",
  vMethod: "Décrivez comment vous la testerez.",
  vSuccess: "Décrivez le résultat qui compterait comme un succès.",
  vDate: "Choisissez une date valide.",
  vNoProject: "Liez d'abord cette hypothèse à un projet.",
  taskPrefix: "Valider :",
  successLabel: "Succès :",
};

const es: PlanCopy = {
  heading: "Plan de validación",
  hint: "Describe cómo probarás este supuesto y qué resultado contaría como éxito. Guardar no cambia su estado ni añade tareas.",
  method: "¿Cómo lo vas a probar?",
  methodPlaceholder: "p. ej. Llamar a 10 clientes potenciales y pedirles una reserva",
  success: "¿Qué resultado contaría como éxito?",
  successPlaceholder: "p. ej. Al menos 4 de 10 reservan al precio previsto",
  due: "Probar antes del",
  save: "Guardar plan",
  addToPlan: "Añadir al plan de acción",
  inPlan: "En tu plan de acción",
  saved: "Plan guardado.",
  added: "Tarea añadida a tu plan de acción.",
  alreadyAdded: "Esta validación ya está en tu plan de acción.",
  noProject: "Vincula este supuesto a un proyecto para añadir la prueba a un plan de acción.",
  vMethod: "Describe cómo lo probarás.",
  vSuccess: "Describe qué resultado contaría como éxito.",
  vDate: "Elige una fecha válida.",
  vNoProject: "Vincula primero este supuesto a un proyecto.",
  taskPrefix: "Validar:",
  successLabel: "Éxito:",
};

const pt: PlanCopy = {
  heading: "Plano de validação",
  hint: "Descreva como você vai testar esta premissa e qual resultado contaria como sucesso. Salvar não muda o status nem adiciona tarefas.",
  method: "Como você vai testar?",
  methodPlaceholder: "ex.: Ligar para 10 clientes potenciais e pedir uma pré-venda",
  success: "Qual resultado contaria como sucesso?",
  successPlaceholder: "ex.: Pelo menos 4 de 10 fazem a pré-venda pelo preço planejado",
  due: "Testar até",
  save: "Salvar plano",
  addToPlan: "Adicionar ao plano de ação",
  inPlan: "No seu plano de ação",
  saved: "Plano salvo.",
  added: "Tarefa adicionada ao seu plano de ação.",
  alreadyAdded: "Esta validação já está no seu plano de ação.",
  noProject: "Vincule esta premissa a um projeto para adicionar o teste a um plano de ação.",
  vMethod: "Descreva como vai testá-la.",
  vSuccess: "Descreva qual resultado contaria como sucesso.",
  vDate: "Escolha uma data válida.",
  vNoProject: "Vincule primeiro esta premissa a um projeto.",
  taskPrefix: "Validar:",
  successLabel: "Sucesso:",
};

const sw: PlanCopy = {
  heading: "Mpango wa kuthibitisha",
  hint: "Eleza utajaribu dhana hii vipi, na matokeo gani yangehesabiwa kuwa mafanikio. Kuhifadhi hakubadilishi hali yake wala hakuongezi kazi.",
  method: "Utaijaribu vipi?",
  methodPlaceholder: "mfano: Piga simu wateja 10 wanaowezekana na uwaombe waagize mapema",
  success: "Matokeo gani yangehesabiwa kuwa mafanikio?",
  successPlaceholder: "mfano: Angalau 4 kati ya 10 waagize mapema kwa bei iliyopangwa",
  due: "Jaribu kabla ya",
  save: "Hifadhi mpango",
  addToPlan: "Ongeza kwenye mpango wa hatua",
  inPlan: "Iko kwenye mpango wako wa hatua",
  saved: "Mpango umehifadhiwa.",
  added: "Kazi imeongezwa kwenye mpango wako wa hatua.",
  alreadyAdded: "Uthibitisho huu tayari uko kwenye mpango wako wa hatua.",
  noProject: "Unganisha dhana hii na mradi ili kuongeza jaribio kwenye mpango wa hatua.",
  vMethod: "Eleza utaijaribu vipi.",
  vSuccess: "Eleza matokeo gani yangehesabiwa kuwa mafanikio.",
  vDate: "Chagua tarehe sahihi.",
  vNoProject: "Unganisha dhana hii na mradi kwanza.",
  taskPrefix: "Thibitisha:",
  successLabel: "Mafanikio:",
};

const zh: PlanCopy = {
  heading: "验证计划",
  hint: "描述你将如何检验这条假设，以及什么结果算作成功。保存不会改变它的状态，也不会添加任务。",
  method: "你打算如何检验？",
  methodPlaceholder: "例如：致电 10 位潜在客户，请他们预订",
  success: "什么结果算作成功？",
  successPlaceholder: "例如：10 位中至少 4 位以计划价格预订",
  due: "检验截止",
  save: "保存计划",
  addToPlan: "添加到行动计划",
  inPlan: "已在你的行动计划中",
  saved: "计划已保存。",
  added: "任务已添加到你的行动计划。",
  alreadyAdded: "这项验证已在你的行动计划中。",
  noProject: "请将这条假设关联到一个项目，才能把检验添加到行动计划。",
  vMethod: "请描述你将如何检验。",
  vSuccess: "请描述什么结果算作成功。",
  vDate: "请选择有效日期。",
  vNoProject: "请先将这条假设关联到一个项目。",
  taskPrefix: "验证：",
  successLabel: "成功标准：",
};

export const PLAN_STRINGS: Record<Lang, PlanCopy> = { en, fr, es, pt, sw, zh };
