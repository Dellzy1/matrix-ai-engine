import { fmt, type Lang } from "./i18n";
import type { ChallengeId } from "./challenges";

type Copy = { title: string; fix: string; items: Record<ChallengeId, string> };

const en: Copy = {
  title: "Things to check",
  fix: "Help me fix this",
  items: {
    no_deadline: "This plan has no deadline. A deadline tells you how much time you have.",
    no_success_measure: "No success measure is set. Define how you will know the plan worked.",
    after_deadline: "{count} task(s) are due after the plan's deadline. Move them earlier or change the plan's deadline.",
    overload: "{count} open task(s) and only {days} day(s) left. Consider setting priorities or moving the deadline.",
  },
};

const fr: Copy = {
  title: "Points à vérifier",
  fix: "Aidez-moi à corriger",
  items: {
    no_deadline: "Ce plan n'a pas d'échéance. Une échéance vous indique le temps dont vous disposez.",
    no_success_measure: "Aucune mesure de réussite n'est définie. Précisez comment vous saurez que le plan a réussi.",
    after_deadline: "{count} tâche(s) ont une échéance après celle du plan. Avancez-les ou modifiez l'échéance du plan.",
    overload: "{count} tâche(s) ouvertes pour seulement {days} jour(s). Pensez à définir des priorités ou à repousser l'échéance.",
  },
};

const es: Copy = {
  title: "Puntos a revisar",
  fix: "Ayúdame a corregirlo",
  items: {
    no_deadline: "Este plan no tiene fecha límite. Una fecha límite te indica cuánto tiempo tienes.",
    no_success_measure: "No hay una medida de éxito definida. Define cómo sabrás que el plan funcionó.",
    after_deadline: "{count} tarea(s) vencen después de la fecha límite del plan. Adelántalas o cambia la fecha del plan.",
    overload: "{count} tarea(s) abiertas y solo {days} día(s) disponibles. Considera fijar prioridades o cambiar la fecha límite.",
  },
};

const pt: Copy = {
  title: "Pontos a verificar",
  fix: "Me ajude a corrigir",
  items: {
    no_deadline: "Este plano não tem prazo. Um prazo mostra quanto tempo você tem.",
    no_success_measure: "Não há uma medida de sucesso definida. Defina como você saberá que o plano deu certo.",
    after_deadline: "{count} tarefa(s) vencem depois do prazo do plano. Antecipe-as ou mude o prazo do plano.",
    overload: "{count} tarefa(s) abertas e apenas {days} dia(s) restantes. Considere definir prioridades ou mudar o prazo.",
  },
};

const sw: Copy = {
  title: "Mambo ya kuangalia",
  fix: "Nisaidie kurekebisha",
  items: {
    no_deadline: "Mpango huu hauna tarehe ya mwisho. Tarehe ya mwisho inakuonyesha muda ulio nao.",
    no_success_measure: "Hakuna kipimo cha mafanikio kilichowekwa. Eleza jinsi utakavyojua mpango umefanikiwa.",
    after_deadline: "Kazi {count} zinatakiwa baada ya tarehe ya mwisho ya mpango. Zisogeze mbele au badilisha tarehe ya mpango.",
    overload: "Kazi {count} zilizo wazi na siku {days} tu zilizobaki. Fikiria kuweka vipaumbele au kubadilisha tarehe.",
  },
};

const zh: Copy = {
  title: "需要检查的地方",
  fix: "帮我修正",
  items: {
    no_deadline: "这个计划没有截止日期。截止日期能告诉你还有多少时间。",
    no_success_measure: "尚未设定成功标准。请定义你如何判断计划是否成功。",
    after_deadline: "有 {count} 个任务的截止日期晚于计划的截止日期。请提前这些任务，或调整计划的截止日期。",
    overload: "还有 {count} 个未完成的任务，但只剩 {days} 天。考虑设定优先级，或调整截止日期。",
  },
};

const STRINGS: Record<Lang, Copy> = { en, fr, es, pt, sw, zh };

export function challengeText(lang: Lang, challenge: { id: ChallengeId; count: number; days: number }) {
  const copy = STRINGS[lang];
  return {
    title: copy.title,
    fix: copy.fix,
    body: fmt(copy.items[challenge.id], { count: challenge.count, days: challenge.days }),
  };
}
