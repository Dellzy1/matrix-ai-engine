import type { Lang } from "./i18n";
import type { Classification, Confidence } from "./decisionInsight";

// Copy for the decision check on the results screen. Numbers are filled in with {name}, {n}, {min} and {gap}.
export type InsightCopy = {
  heading: string;
  classLabel: Record<Classification, string>;
  noStrong: string;
  close: string;
  clear: string;
  single: string;
  confidence: string;
  confidenceLevel: Record<Confidence, string>;
  confidenceNote: string;
  leads: string;
  falls: string;
  comparisonHeading: string;
  comparisonHint: string;
  criterion: string;
  max: string;
  total: string;
  lowerIsBetter: string;
  weight: string;
};

const en: InsightCopy = {
  heading: "Decision check",
  classLabel: { no_strong_option: "No strong option", close_decision: "Close decision", clear_winner: "Clear winner" },
  noStrong: "No option reaches {min}/100. Review your scores or add options before you decide.",
  close: "{name} leads by {n} points, which is {gap} or less. A small change in a weight or score could change the winner.",
  clear: "{name} leads by {n} points.",
  single: "Only one option has been scored.",
  confidence: "Confidence",
  confidenceLevel: { low: "Low", moderate: "Moderate", high: "High" },
  confidenceNote: "Confidence shows how clearly the winner leads on your current weights. It does not check whether your scores are right.",
  leads: "Leads most on {name}: +{n} points against {other}.",
  falls: "Falls short most on {name}: -{n} points against {other}.",
  comparisonHeading: "Comparison of all options",
  comparisonHint: "Points each option earned on each criterion. The highest on a criterion is in bold.",
  criterion: "Criterion",
  max: "Max",
  total: "Total",
  lowerIsBetter: " (lower is better)",
  weight: "{n}% of the total",
};

const fr: InsightCopy = {
  heading: "Analyse de la décision",
  classLabel: { no_strong_option: "Aucune option solide", close_decision: "Décision serrée", clear_winner: "Gagnant net" },
  noStrong: "Aucune option n'atteint {min}/100. Vérifiez vos notes ou ajoutez des options avant de décider.",
  close: "{name} devance de {n} points, soit {gap} ou moins. Un petit changement de poids ou de note pourrait changer le gagnant.",
  clear: "{name} devance de {n} points.",
  single: "Une seule option a été notée.",
  confidence: "Confiance",
  confidenceLevel: { low: "Faible", moderate: "Modérée", high: "Élevée" },
  confidenceNote: "La confiance indique à quel point le gagnant se détache avec vos poids actuels. Elle ne vérifie pas si vos notes sont justes.",
  leads: "En tête surtout sur {name} : +{n} points par rapport à {other}.",
  falls: "En retrait surtout sur {name} : -{n} points par rapport à {other}.",
  comparisonHeading: "Comparaison de toutes les options",
  comparisonHint: "Points obtenus par chaque option sur chaque critère. Le meilleur score d'un critère est en gras.",
  criterion: "Critère",
  max: "Max",
  total: "Total",
  lowerIsBetter: " (plus bas = mieux)",
  weight: "{n} % du total",
};

const es: InsightCopy = {
  heading: "Análisis de la decisión",
  classLabel: { no_strong_option: "Ninguna opción sólida", close_decision: "Decisión reñida", clear_winner: "Ganador claro" },
  noStrong: "Ninguna opción llega a {min}/100. Revisa tus puntuaciones o añade opciones antes de decidir.",
  close: "{name} va por delante por {n} puntos, es decir, {gap} o menos. Un pequeño cambio en un peso o en una puntuación podría cambiar al ganador.",
  clear: "{name} va por delante por {n} puntos.",
  single: "Solo se ha puntuado una opción.",
  confidence: "Confianza",
  confidenceLevel: { low: "Baja", moderate: "Moderada", high: "Alta" },
  confidenceNote: "La confianza indica con qué claridad gana la opción con tus pesos actuales. No comprueba si tus puntuaciones son correctas.",
  leads: "Lidera sobre todo en {name}: +{n} puntos frente a {other}.",
  falls: "Queda por detrás sobre todo en {name}: -{n} puntos frente a {other}.",
  comparisonHeading: "Comparación de todas las opciones",
  comparisonHint: "Puntos que obtuvo cada opción en cada criterio. El mejor de cada criterio está en negrita.",
  criterion: "Criterio",
  max: "Máx",
  total: "Total",
  lowerIsBetter: " (menor es mejor)",
  weight: "{n} % del total",
};

const pt: InsightCopy = {
  heading: "Análise da decisão",
  classLabel: { no_strong_option: "Nenhuma opção forte", close_decision: "Decisão apertada", clear_winner: "Vencedor claro" },
  noStrong: "Nenhuma opção chega a {min}/100. Revise suas notas ou adicione opções antes de decidir.",
  close: "{name} está à frente por {n} pontos, ou seja, {gap} ou menos. Uma pequena mudança em um peso ou nota pode mudar o vencedor.",
  clear: "{name} está à frente por {n} pontos.",
  single: "Apenas uma opção foi avaliada.",
  confidence: "Confiança",
  confidenceLevel: { low: "Baixa", moderate: "Moderada", high: "Alta" },
  confidenceNote: "A confiança mostra quão claramente o vencedor lidera com seus pesos atuais. Ela não verifica se suas notas estão certas.",
  leads: "Lidera principalmente em {name}: +{n} pontos em relação a {other}.",
  falls: "Fica para trás principalmente em {name}: -{n} pontos em relação a {other}.",
  comparisonHeading: "Comparação de todas as opções",
  comparisonHint: "Pontos que cada opção obteve em cada critério. O maior de cada critério está em negrito.",
  criterion: "Critério",
  max: "Máx",
  total: "Total",
  lowerIsBetter: " (menor é melhor)",
  weight: "{n}% do total",
};

const sw: InsightCopy = {
  heading: "Uchambuzi wa uamuzi",
  classLabel: { no_strong_option: "Hakuna chaguo imara", close_decision: "Uamuzi wa karibu", clear_winner: "Mshindi wazi" },
  noStrong: "Hakuna chaguo linalofikia {min}/100. Kagua alama zako au ongeza chaguo kabla ya kuamua.",
  close: "{name} inaongoza kwa pointi {n}, yaani {gap} au chini. Mabadiliko madogo ya uzito au alama yanaweza kubadilisha mshindi.",
  clear: "{name} inaongoza kwa pointi {n}.",
  single: "Chaguo moja tu limepewa alama.",
  confidence: "Uhakika",
  confidenceLevel: { low: "Mdogo", moderate: "Wa wastani", high: "Mkubwa" },
  confidenceNote: "Uhakika unaonyesha jinsi mshindi anavyoongoza wazi kwa uzito wako wa sasa. Haukagui kama alama zako ni sahihi.",
  leads: "Anaongoza zaidi kwenye {name}: +{n} pointi dhidi ya {other}.",
  falls: "Anarudi nyuma zaidi kwenye {name}: -{n} pointi dhidi ya {other}.",
  comparisonHeading: "Ulinganisho wa chaguo zote",
  comparisonHint: "Pointi ambazo kila chaguo lilipata kwenye kila kigezo. Ya juu zaidi kwenye kigezo iko kwa herufi nzito.",
  criterion: "Kigezo",
  max: "Kiwango",
  total: "Jumla",
  lowerIsBetter: " (ndogo ni bora)",
  weight: "{n}% ya jumla",
};

const zh: InsightCopy = {
  heading: "决策检查",
  classLabel: { no_strong_option: "没有强势选项", close_decision: "接近的决定", clear_winner: "明显的胜者" },
  noStrong: "没有任何选项达到 {min}/100。在决定之前，请检查你的评分或添加选项。",
  close: "{name} 领先 {n} 分，即 {gap} 分或更少。某个权重或评分的小幅变化就可能改变胜者。",
  clear: "{name} 领先 {n} 分。",
  single: "只有一个选项被评分。",
  confidence: "置信度",
  confidenceLevel: { low: "低", moderate: "中", high: "高" },
  confidenceNote: "置信度表示按你当前的权重，胜者领先的程度有多明显。它不检查你的评分是否正确。",
  leads: "主要领先于 {other} 的是“{name}”：+{n} 分。",
  falls: "主要落后于 {other} 的是“{name}”：-{n} 分。",
  comparisonHeading: "所有选项比较",
  comparisonHint: "每个选项在每项标准上获得的分数。每项标准中的最高分以粗体显示。",
  criterion: "标准",
  max: "满分",
  total: "总计",
  lowerIsBetter: "（越低越好）",
  weight: "占总权重 {n}%",
};

export const INSIGHT_STRINGS: Record<Lang, InsightCopy> = { en, fr, es, pt, sw, zh };
