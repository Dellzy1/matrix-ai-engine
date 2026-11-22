import type { Lang } from "./i18n";

// The weighted-points line printed under each option's score. {earned} and {max} are whole numbers.
export const PDF_POINTS_STRINGS: Record<Lang, string> = {
  en: "{earned} of {max} points",
  fr: "{earned} sur {max} points",
  es: "{earned} de {max} puntos",
  pt: "{earned} de {max} pontos",
  sw: "pointi {earned} kati ya {max}",
  zh: "{earned} / {max} 分",
};
