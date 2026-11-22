import type { Lang } from "./i18n";

// Copy for evidence on an assumption (Round 2). {n}, {s} and {o} are numbers.
export type EvidenceCopy = {
  heading: string;
  hint: string;
  supports: string;
  opposes: string;
  content: string;
  contentPlaceholder: string;
  source: string;
  sourcePlaceholder: string;
  add: string;
  empty: string;
  remove: string;
  counts: string;
  supportingCount: string;
  opposingCount: string;
  vEvidence: string;
};

const en: EvidenceCopy = {
  heading: "Evidence",
  hint: "Evidence is what you have found. It is kept separate from your confidence, and adding it does not change your confidence.",
  supports: "Supports",
  opposes: "Opposes",
  content: "What did you find?",
  contentPlaceholder: "e.g. 6 of 10 interviewed customers said they would pay",
  source: "Source (optional)",
  sourcePlaceholder: "e.g. interview notes, survey, website",
  add: "+ Add evidence",
  empty: "No evidence yet.",
  remove: "Remove",
  counts: "{s} supports · {o} opposes",
  supportingCount: "{n} supporting",
  opposingCount: "{n} opposing",
  vEvidence: "Write what you found.",
};

const fr: EvidenceCopy = {
  heading: "Preuves",
  hint: "Les preuves sont ce que vous avez trouvé. Elles sont séparées de votre confiance, et les ajouter ne modifie pas votre confiance.",
  supports: "Soutient",
  opposes: "Contredit",
  content: "Qu'avez-vous trouvé ?",
  contentPlaceholder: "ex. 6 clients sur 10 ont dit qu'ils paieraient",
  source: "Source (facultatif)",
  sourcePlaceholder: "ex. notes d'entretien, sondage, site web",
  add: "+ Ajouter une preuve",
  empty: "Aucune preuve pour l'instant.",
  remove: "Retirer",
  counts: "{s} soutiennent · {o} contredisent",
  supportingCount: "{n} en soutien",
  opposingCount: "{n} en opposition",
  vEvidence: "Écrivez ce que vous avez trouvé.",
};

const es: EvidenceCopy = {
  heading: "Evidencia",
  hint: "La evidencia es lo que has encontrado. Se mantiene separada de tu confianza, y añadirla no cambia tu confianza.",
  supports: "Apoya",
  opposes: "Se opone",
  content: "¿Qué encontraste?",
  contentPlaceholder: "p. ej. 6 de 10 clientes entrevistados dijeron que pagarían",
  source: "Fuente (opcional)",
  sourcePlaceholder: "p. ej. notas de entrevista, encuesta, sitio web",
  add: "+ Añadir evidencia",
  empty: "Aún no hay evidencia.",
  remove: "Quitar",
  counts: "{s} apoyan · {o} se oponen",
  supportingCount: "{n} a favor",
  opposingCount: "{n} en contra",
  vEvidence: "Escribe lo que encontraste.",
};

const pt: EvidenceCopy = {
  heading: "Evidências",
  hint: "As evidências são o que você encontrou. Elas são separadas da sua confiança, e adicioná-las não altera a sua confiança.",
  supports: "Apoia",
  opposes: "Contraria",
  content: "O que você encontrou?",
  contentPlaceholder: "ex.: 6 de 10 clientes entrevistados disseram que pagariam",
  source: "Fonte (opcional)",
  sourcePlaceholder: "ex.: notas de entrevista, pesquisa, site",
  add: "+ Adicionar evidência",
  empty: "Nenhuma evidência ainda.",
  remove: "Remover",
  counts: "{s} apoiam · {o} contrariam",
  supportingCount: "{n} a favor",
  opposingCount: "{n} contra",
  vEvidence: "Escreva o que você encontrou.",
};

const sw: EvidenceCopy = {
  heading: "Ushahidi",
  hint: "Ushahidi ni kile ulichopata. Umetenganishwa na uhakika wako, na kuuongeza hakubadilishi uhakika wako.",
  supports: "Unaunga mkono",
  opposes: "Unapinga",
  content: "Ulipata nini?",
  contentPlaceholder: "mfano: wateja 6 kati ya 10 waliohojiwa walisema wangelipa",
  source: "Chanzo (si lazima)",
  sourcePlaceholder: "mfano: maelezo ya mahojiano, utafiti, tovuti",
  add: "+ Ongeza ushahidi",
  empty: "Bado hakuna ushahidi.",
  remove: "Ondoa",
  counts: "{s} zinaunga mkono · {o} zinapinga",
  supportingCount: "{n} zinaunga mkono",
  opposingCount: "{n} zinapinga",
  vEvidence: "Andika ulichopata.",
};

const zh: EvidenceCopy = {
  heading: "证据",
  hint: "证据是你找到的信息。它与你的信心分开，添加证据不会改变你的信心。",
  supports: "支持",
  opposes: "反对",
  content: "你发现了什么？",
  contentPlaceholder: "例如：10 位受访客户中有 6 位说会付费",
  source: "来源（可选）",
  sourcePlaceholder: "例如：访谈记录、问卷、网站",
  add: "+ 添加证据",
  empty: "还没有证据。",
  remove: "移除",
  counts: "{s} 条支持 · {o} 条反对",
  supportingCount: "{n} 条支持",
  opposingCount: "{n} 条反对",
  vEvidence: "请写下你发现的内容。",
};

export const EVIDENCE_STRINGS: Record<Lang, EvidenceCopy> = { en, fr, es, pt, sw, zh };
