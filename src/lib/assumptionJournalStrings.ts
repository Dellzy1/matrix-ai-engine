import type { Lang } from "./i18n";
import type { Category, Importance, JournalStatus } from "./assumptionJournal";

export type JournalCopy = {
  title: string;
  subtitle: string;
  back: string;
  add: string;
  edit: string;
  save: string;
  cancel: string;
  remove: string;
  cardTotal: string;
  cardUntested: string;
  cardTesting: string;
  cardValidated: string;
  alertHeading: string;
  alertNone: string;
  alertHigh: string;
  alertReview: string;
  yourAssumptions: string;
  searchPlaceholder: string;
  allCategories: string;
  allStatuses: string;
  allImportance: string;
  emptyTitle: string;
  emptyText: string;
  overdue: string;
  notSet: string;
  statement: string;
  statementPlaceholder: string;
  category: string;
  link: string;
  linkPlaceholder: string;
  noLinks: string;
  importance: string;
  confidence: string;
  confidenceHelp: string;
  reviewDate: string;
  nextAction: string;
  nextActionPlaceholder: string;
  status: string;
  evidence: string;
  evidenceCount: string;
  detailNote: string;
  deleteTitle: string;
  deleteText: string;
  deleteWithEvidence: string;
  deleteConfirm: string;
  saved: string;
  saveError: string;
  loading: string;
  vStatement: string;
  vLink: string;
  vConfidence: string;
  vDate: string;
  categories: Record<Category, string>;
  importanceLabels: Record<Importance, string>;
  statuses: Record<JournalStatus, string>;
};

const en: JournalCopy = {
  title: "Assumption Journal",
  subtitle: "Identify what you believe. Test what you know. Learn what is true.",
  back: "Back",
  add: "+ Add Assumption",
  edit: "Edit",
  save: "Save",
  cancel: "Cancel",
  remove: "Delete",
  cardTotal: "Total Assumptions",
  cardUntested: "Untested",
  cardTesting: "Currently Testing",
  cardValidated: "Validated",
  alertHeading: "Attention needed",
  alertNone: "Nothing needs attention right now.",
  alertHigh: "High importance, low confidence",
  alertReview: "Needs review",
  yourAssumptions: "My Assumptions",
  searchPlaceholder: "Search assumptions",
  allCategories: "All categories",
  allStatuses: "All statuses",
  allImportance: "All importance",
  emptyTitle: "No assumptions yet",
  emptyText: "Write down one thing your plan depends on. You can test it later.",
  overdue: "Review overdue",
  notSet: "Not set",
  statement: "Assumption",
  statementPlaceholder: "e.g. Customers will pay the monthly price",
  category: "Category",
  link: "Related decision or project",
  linkPlaceholder: "Choose one",
  noLinks: "Create a decision or project first. An assumption belongs to one of them.",
  importance: "Importance",
  confidence: "Your confidence (0–100)",
  confidenceHelp: "How sure you feel. This is your belief, not a probability of success.",
  reviewDate: "Review date",
  nextAction: "Next validation action",
  nextActionPlaceholder: "e.g. Ask 10 customers before launch",
  status: "Status",
  evidence: "Evidence",
  evidenceCount: "{n} evidence item(s)",
  detailNote: "Evidence is added in the project or decision view.",
  deleteTitle: "Delete this assumption?",
  deleteText: "This cannot be undone.",
  deleteWithEvidence: "Its {n} evidence item(s) will be deleted too.",
  deleteConfirm: "Yes, delete",
  saved: "Saved.",
  saveError: "Could not save. Please try again.",
  loading: "Loading…",
  vStatement: "Write the assumption in one sentence.",
  vLink: "Choose a related decision or project.",
  vConfidence: "Confidence must be a whole number from 0 to 100.",
  vDate: "Choose a valid review date.",
  categories: { market: "Market", money: "Money", operations: "Operations", team: "Team", technology: "Technology", timing: "Timing", legal: "Legal", other: "Other" },
  importanceLabels: { low: "Low", medium: "Medium", high: "High" },
  statuses: { unvalidated: "Untested", testing: "Testing", supported: "Supported", contradicted: "Contradicted", validated: "Validated", dismissed: "Dismissed" },
};

const fr: JournalCopy = {
  title: "Journal des hypothèses",
  subtitle: "Identifiez ce que vous croyez. Testez ce que vous savez. Découvrez ce qui est vrai.",
  back: "Retour",
  add: "+ Ajouter une hypothèse",
  edit: "Modifier",
  save: "Enregistrer",
  cancel: "Annuler",
  remove: "Supprimer",
  cardTotal: "Total des hypothèses",
  cardUntested: "Non testées",
  cardTesting: "En cours de test",
  cardValidated: "Validées",
  alertHeading: "À surveiller",
  alertNone: "Rien à surveiller pour l'instant.",
  alertHigh: "Importance élevée, confiance faible",
  alertReview: "À réexaminer",
  yourAssumptions: "Mes hypothèses",
  searchPlaceholder: "Rechercher une hypothèse",
  allCategories: "Toutes les catégories",
  allStatuses: "Tous les statuts",
  allImportance: "Toutes les importances",
  emptyTitle: "Aucune hypothèse pour l'instant",
  emptyText: "Notez une chose sur laquelle votre plan repose. Vous pourrez la tester plus tard.",
  overdue: "Révision en retard",
  notSet: "Non défini",
  statement: "Hypothèse",
  statementPlaceholder: "ex. Les clients paieront le prix mensuel",
  category: "Catégorie",
  link: "Décision ou projet lié",
  linkPlaceholder: "Choisissez-en un",
  noLinks: "Créez d'abord une décision ou un projet. Une hypothèse appartient à l'un des deux.",
  importance: "Importance",
  confidence: "Votre confiance (0–100)",
  confidenceHelp: "Votre sentiment de certitude. C'est votre conviction, pas une probabilité de succès.",
  reviewDate: "Date de révision",
  nextAction: "Prochaine action de validation",
  nextActionPlaceholder: "ex. Interroger 10 clients avant le lancement",
  status: "Statut",
  evidence: "Preuves",
  evidenceCount: "{n} élément(s) de preuve",
  detailNote: "Les preuves s'ajoutent dans la vue du projet ou de la décision.",
  deleteTitle: "Supprimer cette hypothèse ?",
  deleteText: "Cette action est irréversible.",
  deleteWithEvidence: "Ses {n} élément(s) de preuve seront aussi supprimés.",
  deleteConfirm: "Oui, supprimer",
  saved: "Enregistré.",
  saveError: "Impossible d'enregistrer. Veuillez réessayer.",
  loading: "Chargement…",
  vStatement: "Écrivez l'hypothèse en une phrase.",
  vLink: "Choisissez une décision ou un projet lié.",
  vConfidence: "La confiance doit être un nombre entier de 0 à 100.",
  vDate: "Choisissez une date de révision valide.",
  categories: { market: "Marché", money: "Argent", operations: "Opérations", team: "Équipe", technology: "Technologie", timing: "Calendrier", legal: "Juridique", other: "Autre" },
  importanceLabels: { low: "Faible", medium: "Moyenne", high: "Élevée" },
  statuses: { unvalidated: "Non testée", testing: "En test", supported: "Soutenue", contradicted: "Contredite", validated: "Validée", dismissed: "Écartée" },
};

const es: JournalCopy = {
  title: "Diario de supuestos",
  subtitle: "Identifica lo que crees. Prueba lo que sabes. Aprende lo que es verdad.",
  back: "Volver",
  add: "+ Añadir supuesto",
  edit: "Editar",
  save: "Guardar",
  cancel: "Cancelar",
  remove: "Eliminar",
  cardTotal: "Total de supuestos",
  cardUntested: "Sin probar",
  cardTesting: "En prueba",
  cardValidated: "Validados",
  alertHeading: "Requiere atención",
  alertNone: "Nada requiere atención ahora mismo.",
  alertHigh: "Importancia alta, confianza baja",
  alertReview: "Hay que revisarlo",
  yourAssumptions: "Mis supuestos",
  searchPlaceholder: "Buscar supuestos",
  allCategories: "Todas las categorías",
  allStatuses: "Todos los estados",
  allImportance: "Toda la importancia",
  emptyTitle: "Aún no hay supuestos",
  emptyText: "Escribe una cosa de la que depende tu plan. Podrás probarla después.",
  overdue: "Revisión atrasada",
  notSet: "Sin definir",
  statement: "Supuesto",
  statementPlaceholder: "p. ej. Los clientes pagarán el precio mensual",
  category: "Categoría",
  link: "Decisión o proyecto relacionado",
  linkPlaceholder: "Elige uno",
  noLinks: "Crea primero una decisión o un proyecto. Un supuesto pertenece a uno de los dos.",
  importance: "Importancia",
  confidence: "Tu confianza (0–100)",
  confidenceHelp: "Cuánta seguridad sientes. Es tu creencia, no una probabilidad de éxito.",
  reviewDate: "Fecha de revisión",
  nextAction: "Siguiente acción de validación",
  nextActionPlaceholder: "p. ej. Preguntar a 10 clientes antes del lanzamiento",
  status: "Estado",
  evidence: "Evidencia",
  evidenceCount: "{n} elemento(s) de evidencia",
  detailNote: "La evidencia se añade en la vista del proyecto o la decisión.",
  deleteTitle: "¿Eliminar este supuesto?",
  deleteText: "Esto no se puede deshacer.",
  deleteWithEvidence: "También se eliminarán sus {n} elemento(s) de evidencia.",
  deleteConfirm: "Sí, eliminar",
  saved: "Guardado.",
  saveError: "No se pudo guardar. Inténtalo de nuevo.",
  loading: "Cargando…",
  vStatement: "Escribe el supuesto en una frase.",
  vLink: "Elige una decisión o un proyecto relacionado.",
  vConfidence: "La confianza debe ser un número entero de 0 a 100.",
  vDate: "Elige una fecha de revisión válida.",
  categories: { market: "Mercado", money: "Dinero", operations: "Operaciones", team: "Equipo", technology: "Tecnología", timing: "Momento", legal: "Legal", other: "Otra" },
  importanceLabels: { low: "Baja", medium: "Media", high: "Alta" },
  statuses: { unvalidated: "Sin probar", testing: "En prueba", supported: "Respaldado", contradicted: "Contradicho", validated: "Validado", dismissed: "Descartado" },
};

const pt: JournalCopy = {
  title: "Diário de premissas",
  subtitle: "Identifique o que você acredita. Teste o que você sabe. Descubra o que é verdade.",
  back: "Voltar",
  add: "+ Adicionar premissa",
  edit: "Editar",
  save: "Salvar",
  cancel: "Cancelar",
  remove: "Excluir",
  cardTotal: "Total de premissas",
  cardUntested: "Não testadas",
  cardTesting: "Em teste",
  cardValidated: "Validadas",
  alertHeading: "Precisa de atenção",
  alertNone: "Nada precisa de atenção agora.",
  alertHigh: "Importância alta, confiança baixa",
  alertReview: "Precisa de revisão",
  yourAssumptions: "Minhas premissas",
  searchPlaceholder: "Pesquisar premissas",
  allCategories: "Todas as categorias",
  allStatuses: "Todos os status",
  allImportance: "Toda a importância",
  emptyTitle: "Nenhuma premissa ainda",
  emptyText: "Anote uma coisa da qual seu plano depende. Você pode testá-la depois.",
  overdue: "Revisão atrasada",
  notSet: "Não definido",
  statement: "Premissa",
  statementPlaceholder: "ex.: Os clientes vão pagar o preço mensal",
  category: "Categoria",
  link: "Decisão ou projeto relacionado",
  linkPlaceholder: "Escolha um",
  noLinks: "Crie primeiro uma decisão ou um projeto. Uma premissa pertence a um dos dois.",
  importance: "Importância",
  confidence: "Sua confiança (0–100)",
  confidenceHelp: "O quanto você se sente seguro. É a sua crença, não uma probabilidade de sucesso.",
  reviewDate: "Data de revisão",
  nextAction: "Próxima ação de validação",
  nextActionPlaceholder: "ex.: Perguntar a 10 clientes antes do lançamento",
  status: "Status",
  evidence: "Evidências",
  evidenceCount: "{n} evidência(s)",
  detailNote: "As evidências são adicionadas na tela do projeto ou da decisão.",
  deleteTitle: "Excluir esta premissa?",
  deleteText: "Isto não pode ser desfeito.",
  deleteWithEvidence: "As suas {n} evidência(s) também serão excluídas.",
  deleteConfirm: "Sim, excluir",
  saved: "Salvo.",
  saveError: "Não foi possível salvar. Tente novamente.",
  loading: "Carregando…",
  vStatement: "Escreva a premissa em uma frase.",
  vLink: "Escolha uma decisão ou projeto relacionado.",
  vConfidence: "A confiança deve ser um número inteiro de 0 a 100.",
  vDate: "Escolha uma data de revisão válida.",
  categories: { market: "Mercado", money: "Dinheiro", operations: "Operações", team: "Equipe", technology: "Tecnologia", timing: "Momento", legal: "Jurídico", other: "Outro" },
  importanceLabels: { low: "Baixa", medium: "Média", high: "Alta" },
  statuses: { unvalidated: "Não testada", testing: "Em teste", supported: "Apoiada", contradicted: "Contrariada", validated: "Validada", dismissed: "Descartada" },
};

const sw: JournalCopy = {
  title: "Daftari la Dhana",
  subtitle: "Tambua unachoamini. Jaribu unachojua. Jifunze kilicho kweli.",
  back: "Rudi",
  add: "+ Ongeza Dhana",
  edit: "Hariri",
  save: "Hifadhi",
  cancel: "Ghairi",
  remove: "Futa",
  cardTotal: "Dhana zote",
  cardUntested: "Hazijajaribiwa",
  cardTesting: "Zinajaribiwa",
  cardValidated: "Zimethibitishwa",
  alertHeading: "Zinahitaji umakini",
  alertNone: "Hakuna kinachohitaji umakini sasa.",
  alertHigh: "Umuhimu mkubwa, uhakika mdogo",
  alertReview: "Inahitaji kukaguliwa",
  yourAssumptions: "Dhana zangu",
  searchPlaceholder: "Tafuta dhana",
  allCategories: "Makundi yote",
  allStatuses: "Hali zote",
  allImportance: "Umuhimu wote",
  emptyTitle: "Bado hakuna dhana",
  emptyText: "Andika jambo moja mpango wako unaolitegemea. Unaweza kulijaribu baadaye.",
  overdue: "Ukaguzi umechelewa",
  notSet: "Haijawekwa",
  statement: "Dhana",
  statementPlaceholder: "mfano: Wateja watalipa bei ya kila mwezi",
  category: "Kundi",
  link: "Uamuzi au mradi unaohusiana",
  linkPlaceholder: "Chagua moja",
  noLinks: "Tengeneza uamuzi au mradi kwanza. Dhana ni ya mojawapo kati ya hayo.",
  importance: "Umuhimu",
  confidence: "Uhakika wako (0–100)",
  confidenceHelp: "Unavyohisi uhakika. Ni imani yako, si uwezekano wa mafanikio.",
  reviewDate: "Tarehe ya ukaguzi",
  nextAction: "Hatua inayofuata ya kuthibitisha",
  nextActionPlaceholder: "mfano: Waulize wateja 10 kabla ya uzinduzi",
  status: "Hali",
  evidence: "Ushahidi",
  evidenceCount: "vipengele {n} vya ushahidi",
  detailNote: "Ushahidi huongezwa kwenye skrini ya mradi au uamuzi.",
  deleteTitle: "Futa dhana hii?",
  deleteText: "Hili haliwezi kutenduliwa.",
  deleteWithEvidence: "Vipengele vyake {n} vya ushahidi pia vitafutwa.",
  deleteConfirm: "Ndiyo, futa",
  saved: "Imehifadhiwa.",
  saveError: "Imeshindikana kuhifadhi. Jaribu tena.",
  loading: "Inapakia…",
  vStatement: "Andika dhana kwa sentensi moja.",
  vLink: "Chagua uamuzi au mradi unaohusiana.",
  vConfidence: "Uhakika lazima uwe namba kamili kutoka 0 hadi 100.",
  vDate: "Chagua tarehe sahihi ya ukaguzi.",
  categories: { market: "Soko", money: "Fedha", operations: "Uendeshaji", team: "Timu", technology: "Teknolojia", timing: "Muda", legal: "Sheria", other: "Nyingine" },
  importanceLabels: { low: "Chini", medium: "Wastani", high: "Juu" },
  statuses: { unvalidated: "Haijajaribiwa", testing: "Inajaribiwa", supported: "Inaungwa mkono", contradicted: "Imepingwa", validated: "Imethibitishwa", dismissed: "Imeondolewa" },
};

const zh: JournalCopy = {
  title: "假设日志",
  subtitle: "找出你相信的事。验证你知道的事。了解什么是真的。",
  back: "返回",
  add: "+ 添加假设",
  edit: "编辑",
  save: "保存",
  cancel: "取消",
  remove: "删除",
  cardTotal: "假设总数",
  cardUntested: "未验证",
  cardTesting: "正在验证",
  cardValidated: "已验证",
  alertHeading: "需要关注",
  alertNone: "目前没有需要关注的假设。",
  alertHigh: "重要性高，信心低",
  alertReview: "需要复查",
  yourAssumptions: "我的假设",
  searchPlaceholder: "搜索假设",
  allCategories: "所有类别",
  allStatuses: "所有状态",
  allImportance: "所有重要性",
  emptyTitle: "还没有假设",
  emptyText: "写下你的计划所依赖的一件事，之后可以再去验证。",
  overdue: "复查已逾期",
  notSet: "未设置",
  statement: "假设",
  statementPlaceholder: "例如：客户会支付每月价格",
  category: "类别",
  link: "相关决定或项目",
  linkPlaceholder: "选择一项",
  noLinks: "请先创建一个决定或项目。每个假设都属于其中之一。",
  importance: "重要性",
  confidence: "你的信心（0–100）",
  confidenceHelp: "你感觉有多确定。这是你的判断，不是成功的概率。",
  reviewDate: "复查日期",
  nextAction: "下一步验证行动",
  nextActionPlaceholder: "例如：上线前询问 10 位客户",
  status: "状态",
  evidence: "证据",
  evidenceCount: "{n} 条证据",
  detailNote: "证据在项目或决定页面中添加。",
  deleteTitle: "删除这条假设？",
  deleteText: "此操作无法撤销。",
  deleteWithEvidence: "它的 {n} 条证据也会被删除。",
  deleteConfirm: "是的，删除",
  saved: "已保存。",
  saveError: "无法保存，请重试。",
  loading: "加载中…",
  vStatement: "请用一句话写出这条假设。",
  vLink: "请选择相关的决定或项目。",
  vConfidence: "信心必须是 0 到 100 之间的整数。",
  vDate: "请选择有效的复查日期。",
  categories: { market: "市场", money: "资金", operations: "运营", team: "团队", technology: "技术", timing: "时机", legal: "法律", other: "其他" },
  importanceLabels: { low: "低", medium: "中", high: "高" },
  statuses: { unvalidated: "未验证", testing: "验证中", supported: "有支持", contradicted: "被反驳", validated: "已验证", dismissed: "已排除" },
};

export const JOURNAL_STRINGS: Record<Lang, JournalCopy> = { en, fr, es, pt, sw, zh };

// Named statuses in the copy above, used so the status labels can never drift from the list in the database code.
export type StatusKey = JournalStatus;
