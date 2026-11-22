import type { Lang } from "./i18n";

// Copy for Manual Decision Sensitivity. Numbers are filled in with {name}, {score}, {orig}, {n}.
export type SensitivityCopy = {
  open: string;
  close: string;
  intro: string;
  trialWeight: string;
  share: string;
  reset: string;
  stays: string;
  changes: string;
  noWeight: string;
  scoresHeading: string;
  was: string;
};

const en: SensitivityCopy = {
  open: "Explore decision sensitivity",
  close: "Hide sensitivity",
  intro: "Change the priorities below to see whether the winner changes. This only affects this screen. Your saved decision and the results above stay the same.",
  trialWeight: "Trial weight",
  share: "{n}% of total",
  reset: "Reset to my weights",
  stays: "{name} stays the leader with these priorities ({score}/100).",
  changes: "With these priorities, {name} leads ({score}/100). The original leader was {orig}.",
  noWeight: "Set at least one weight above 0.",
  scoresHeading: "Scores with these priorities",
  was: "was {n}",
};

const fr: SensitivityCopy = {
  open: "Explorer la sensibilité de la décision",
  close: "Masquer la sensibilité",
  intro: "Modifiez les priorités ci-dessous pour voir si le gagnant change. Cela n'affecte que cet écran. Votre décision enregistrée et les résultats ci-dessus restent inchangés.",
  trialWeight: "Poids test",
  share: "{n} % du total",
  reset: "Revenir à mes poids",
  stays: "{name} reste en tête avec ces priorités ({score}/100).",
  changes: "Avec ces priorités, {name} est en tête ({score}/100). Le premier initial était {orig}.",
  noWeight: "Donnez un poids supérieur à 0 à au moins un critère.",
  scoresHeading: "Notes avec ces priorités",
  was: "était {n}",
};

const es: SensitivityCopy = {
  open: "Explorar la sensibilidad de la decisión",
  close: "Ocultar sensibilidad",
  intro: "Cambia las prioridades de abajo para ver si cambia el ganador. Solo afecta a esta pantalla. Tu decisión guardada y los resultados de arriba no cambian.",
  trialWeight: "Peso de prueba",
  share: "{n} % del total",
  reset: "Volver a mis pesos",
  stays: "{name} sigue liderando con estas prioridades ({score}/100).",
  changes: "Con estas prioridades, {name} lidera ({score}/100). El líder original era {orig}.",
  noWeight: "Asigna al menos un peso mayor que 0.",
  scoresHeading: "Puntuaciones con estas prioridades",
  was: "era {n}",
};

const pt: SensitivityCopy = {
  open: "Explorar a sensibilidade da decisão",
  close: "Ocultar sensibilidade",
  intro: "Altere as prioridades abaixo para ver se o vencedor muda. Isto afeta apenas esta tela. Sua decisão salva e os resultados acima permanecem iguais.",
  trialWeight: "Peso de teste",
  share: "{n}% do total",
  reset: "Voltar aos meus pesos",
  stays: "{name} continua na liderança com estas prioridades ({score}/100).",
  changes: "Com estas prioridades, {name} lidera ({score}/100). O líder original era {orig}.",
  noWeight: "Defina pelo menos um peso acima de 0.",
  scoresHeading: "Notas com estas prioridades",
  was: "era {n}",
};

const sw: SensitivityCopy = {
  open: "Chunguza unyeti wa uamuzi",
  close: "Ficha unyeti",
  intro: "Badilisha vipaumbele hapa chini ili kuona kama mshindi anabadilika. Hii inaathiri skrini hii tu. Uamuzi wako uliohifadhiwa na matokeo ya juu yanabaki vilevile.",
  trialWeight: "Uzito wa majaribio",
  share: "{n}% ya jumla",
  reset: "Rudi kwenye uzito wangu",
  stays: "{name} anabaki kiongozi kwa vipaumbele hivi ({score}/100).",
  changes: "Kwa vipaumbele hivi, {name} anaongoza ({score}/100). Kiongozi wa awali alikuwa {orig}.",
  noWeight: "Weka angalau uzito mmoja zaidi ya 0.",
  scoresHeading: "Alama kwa vipaumbele hivi",
  was: "ilikuwa {n}",
};

const zh: SensitivityCopy = {
  open: "探索决策敏感度",
  close: "隐藏敏感度",
  intro: "调整下方的优先级，看看胜者是否会改变。这只影响此页面。你保存的决定和上方的结果保持不变。",
  trialWeight: "试验权重",
  share: "占总数 {n}%",
  reset: "恢复我的权重",
  stays: "按这些优先级，{name} 仍然领先（{score}/100）。",
  changes: "按这些优先级，{name} 领先（{score}/100）。原来的领先者是 {orig}。",
  noWeight: "请至少设置一个大于 0 的权重。",
  scoresHeading: "按这些优先级的得分",
  was: "原为 {n}",
};

export const SENS_STRINGS: Record<Lang, SensitivityCopy> = { en, fr, es, pt, sw, zh };
