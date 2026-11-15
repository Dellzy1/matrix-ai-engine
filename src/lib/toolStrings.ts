import type { Lang } from "@/lib/i18n";

const en = {
  marketing: "Marketing Coach",
  opportunity: "Opportunity Finder",
  accountability: "Accountability Partner",
  journal: "Assumption Journal",
  vault: "Decision Vault",
  myProgress: "My Progress",
  myDecisions: "My Decisions",
  lessons: "Lessons",
  noLessons: "No lessons yet. Add an actual outcome to a decision to see it here.",
  goalsSoon: "Goals and habits are coming soon.",
};

type ToolStrings = typeof en;

const fr: ToolStrings = {
  marketing: "Coach marketing",
  opportunity: "Chercheur d'opportunités",
  accountability: "Partenaire de responsabilité",
  journal: "Journal des hypothèses",
  vault: "Coffre des décisions",
  myProgress: "Ma progression",
  myDecisions: "Mes décisions",
  lessons: "Leçons",
  noLessons: "Aucune leçon pour l'instant. Ajoutez un résultat réel à une décision pour la voir ici.",
  goalsSoon: "Les objectifs et les habitudes arrivent bientôt.",
};

const es: ToolStrings = {
  marketing: "Coach de marketing",
  opportunity: "Buscador de oportunidades",
  accountability: "Compañero de responsabilidad",
  journal: "Diario de supuestos",
  vault: "Bóveda de decisiones",
  myProgress: "Mi progreso",
  myDecisions: "Mis decisiones",
  lessons: "Lecciones",
  noLessons: "Aún no hay lecciones. Añade un resultado real a una decisión para verla aquí.",
  goalsSoon: "Los objetivos y hábitos llegarán pronto.",
};

const pt: ToolStrings = {
  marketing: "Coach de marketing",
  opportunity: "Buscador de oportunidades",
  accountability: "Parceiro de responsabilidade",
  journal: "Diário de premissas",
  vault: "Cofre de decisões",
  myProgress: "Meu progresso",
  myDecisions: "Minhas decisões",
  lessons: "Lições",
  noLessons: "Ainda não há lições. Adicione um resultado real a uma decisão para vê-la aqui.",
  goalsSoon: "Metas e hábitos em breve.",
};

const sw: ToolStrings = {
  marketing: "Mkocha wa masoko",
  opportunity: "Mtafuta fursa",
  accountability: "Mshirika wa uwajibikaji",
  journal: "Jarida la dhana",
  vault: "Hazina ya maamuzi",
  myProgress: "Maendeleo yangu",
  myDecisions: "Maamuzi yangu",
  lessons: "Mafunzo",
  noLessons: "Bado hakuna mafunzo. Ongeza matokeo halisi kwenye uamuzi ili uone hapa.",
  goalsSoon: "Malengo na tabia zitakuja hivi karibuni.",
};

const zh: ToolStrings = {
  marketing: "营销教练",
  opportunity: "机会查找器",
  accountability: "问责伙伴",
  journal: "假设日志",
  vault: "决策保险库",
  myProgress: "我的进度",
  myDecisions: "我的决策",
  lessons: "经验教训",
  noLessons: "还没有经验教训。给某个决策添加实际结果，即可在这里查看。",
  goalsSoon: "目标和习惯即将推出。",
};

export const TOOL_STRINGS: Record<Lang, ToolStrings> = { en, fr, es, pt, sw, zh };
