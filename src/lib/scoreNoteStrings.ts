import type { Lang } from "./i18n";

// Text for the optional "Why this score?" note under each score in the Calculator.
export type ScoreNoteCopy = { addContext: string; placeholder: string; viewNote: string };

const copy: Record<Lang, ScoreNoteCopy> = {
  en: { addContext: "+ Add context (optional)", placeholder: "Why did you give this score? (Optional)", viewNote: "View or edit note" },
  fr: { addContext: "+ Ajouter un contexte (facultatif)", placeholder: "Pourquoi avez-vous attribué cette note ? (facultatif)", viewNote: "Voir ou modifier la note" },
  es: { addContext: "+ Añadir contexto (opcional)", placeholder: "¿Por qué diste esta puntuación? (opcional)", viewNote: "Ver o editar la nota" },
  pt: { addContext: "+ Adicionar contexto (opcional)", placeholder: "Por que você deu esta pontuação? (opcional)", viewNote: "Ver ou editar a nota" },
  sw: { addContext: "+ Ongeza maelezo (si lazima)", placeholder: "Kwa nini umepa alama hii? (si lazima)", viewNote: "Tazama au hariri maelezo" },
  zh: { addContext: "+ 添加说明（可选）", placeholder: "你为什么给这个分数？（可选）", viewNote: "查看或编辑说明" },
};

export const SCORE_NOTE_STRINGS = copy;
