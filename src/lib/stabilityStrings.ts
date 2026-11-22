import type { Lang } from "./i18n";
import type { Stability } from "./sensitivityAnalysis";

// Copy for the automatic stability card. Numbers are filled in with {name}, {other}, {n}, {tested}.
export type StabilityCopy = {
  heading: string;
  label: Record<Stability, string>;
  text: Record<Stability, string>;
  raise: string;
  lower: string;
  tested: string;
  none: string;
  note: string;
};

const en: StabilityCopy = {
  heading: "Decision stability",
  label: { stable: "Stable", sensitive: "Sensitive", highly_sensitive: "Highly sensitive" },
  text: {
    stable: "The winner stays the same when each priority moves by 5 or 10 points.",
    sensitive: "Some priority changes of 10 points or less change the winner.",
    highly_sensitive: "Small priority changes of 5 points often change the winner.",
  },
  raise: "Raising {name} by {n} points makes {other} the leader.",
  lower: "Lowering {name} by {n} points makes {other} the leader.",
  tested: "Tested {tested} priority changes.",
  none: "No tested change moved the winner.",
  note: "Stability is about your priorities. Confidence on the decision check is about how far the winner leads.",
};

const fr: StabilityCopy = {
  heading: "Stabilité de la décision",
  label: { stable: "Stable", sensitive: "Sensible", highly_sensitive: "Très sensible" },
  text: {
    stable: "Le gagnant reste le même quand chaque priorité change de 5 ou 10 points.",
    sensitive: "Certains changements de priorité de 10 points ou moins changent le gagnant.",
    highly_sensitive: "De petits changements de priorité de 5 points changent souvent le gagnant.",
  },
  raise: "Augmenter {name} de {n} points fait passer {other} en tête.",
  lower: "Réduire {name} de {n} points fait passer {other} en tête.",
  tested: "{tested} changements de priorité testés.",
  none: "Aucun changement testé n'a modifié le gagnant.",
  note: "La stabilité concerne vos priorités. La confiance dans l'analyse indique jusqu'où le gagnant se détache.",
};

const es: StabilityCopy = {
  heading: "Estabilidad de la decisión",
  label: { stable: "Estable", sensitive: "Sensible", highly_sensitive: "Muy sensible" },
  text: {
    stable: "El ganador se mantiene cuando cada prioridad cambia 5 o 10 puntos.",
    sensitive: "Algunos cambios de prioridad de 10 puntos o menos cambian al ganador.",
    highly_sensitive: "Pequeños cambios de prioridad de 5 puntos cambian a menudo al ganador.",
  },
  raise: "Subir {name} en {n} puntos hace que {other} lidere.",
  lower: "Bajar {name} en {n} puntos hace que {other} lidere.",
  tested: "Se probaron {tested} cambios de prioridad.",
  none: "Ningún cambio probado movió al ganador.",
  note: "La estabilidad trata sobre tus prioridades. La confianza de la comprobación indica cuánto lidera el ganador.",
};

const pt: StabilityCopy = {
  heading: "Estabilidade da decisão",
  label: { stable: "Estável", sensitive: "Sensível", highly_sensitive: "Muito sensível" },
  text: {
    stable: "O vencedor continua o mesmo quando cada prioridade muda 5 ou 10 pontos.",
    sensitive: "Algumas mudanças de prioridade de 10 pontos ou menos mudam o vencedor.",
    highly_sensitive: "Pequenas mudanças de prioridade de 5 pontos costumam mudar o vencedor.",
  },
  raise: "Aumentar {name} em {n} pontos faz {other} liderar.",
  lower: "Diminuir {name} em {n} pontos faz {other} liderar.",
  tested: "{tested} mudanças de prioridade testadas.",
  none: "Nenhuma mudança testada alterou o vencedor.",
  note: "A estabilidade trata das suas prioridades. A confiança na verificação mostra o quanto o vencedor lidera.",
};

const sw: StabilityCopy = {
  heading: "Uthabiti wa uamuzi",
  label: { stable: "Imara", sensitive: "Nyeti", highly_sensitive: "Nyeti sana" },
  text: {
    stable: "Mshindi anabaki vilevile kila kipaumbele kinaposogea pointi 5 au 10.",
    sensitive: "Mabadiliko kadhaa ya kipaumbele ya pointi 10 au chini yanabadilisha mshindi.",
    highly_sensitive: "Mabadiliko madogo ya kipaumbele ya pointi 5 mara nyingi yanabadilisha mshindi.",
  },
  raise: "Kuongeza {name} kwa pointi {n} kunamfanya {other} kuwa kiongozi.",
  lower: "Kupunguza {name} kwa pointi {n} kunamfanya {other} kuwa kiongozi.",
  tested: "Mabadiliko ya vipaumbele {tested} yalijaribiwa.",
  none: "Hakuna mabadiliko yaliyojaribiwa yaliyobadilisha mshindi.",
  note: "Uthabiti unahusu vipaumbele vyako. Uhakika kwenye ukaguzi wa uamuzi unaonyesha mshindi anaongoza kwa kiasi gani.",
};

const zh: StabilityCopy = {
  heading: "决定稳定性",
  label: { stable: "稳定", sensitive: "敏感", highly_sensitive: "高度敏感" },
  text: {
    stable: "当每项优先级变化 5 或 10 分时，胜者保持不变。",
    sensitive: "部分 10 分或更小的优先级变化会改变胜者。",
    highly_sensitive: "5 分的小幅优先级变化经常会改变胜者。",
  },
  raise: "把“{name}”提高 {n} 分，会让 {other} 领先。",
  lower: "把“{name}”降低 {n} 分，会让 {other} 领先。",
  tested: "已测试 {tested} 次优先级变化。",
  none: "测试的变化都没有改变胜者。",
  note: "稳定性针对你的优先级。决策检查中的置信度表示胜者领先的程度。",
};

export const STABILITY_STRINGS: Record<Lang, StabilityCopy> = { en, fr, es, pt, sw, zh };
