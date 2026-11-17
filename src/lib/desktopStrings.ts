import type { Lang } from "./i18n";

// Text for the computer home screen only: the journey strip and the closing card.
type DesktopStrings = {
  journeyTitle: string;
  decide: string;
  plan: string;
  execute: string;
  market: string;
  review: string;
  achieve: string;
  starText: string;
  starSub: string;
};

const en: DesktopStrings = {
  journeyTitle: "Your Complete Journey",
  decide: "Decide",
  plan: "Plan",
  execute: "Execute",
  market: "Market",
  review: "Review",
  achieve: "Achieve",
  starText: "More than a calculator...",
  starSub: "A partner in your success.",
};

const fr: DesktopStrings = {
  journeyTitle: "Votre parcours complet",
  decide: "Décider",
  plan: "Planifier",
  execute: "Exécuter",
  market: "Promouvoir",
  review: "Réviser",
  achieve: "Réussir",
  starText: "Plus qu'un calculateur...",
  starSub: "Un partenaire dans votre réussite.",
};

const es: DesktopStrings = {
  journeyTitle: "Tu recorrido completo",
  decide: "Decidir",
  plan: "Planificar",
  execute: "Ejecutar",
  market: "Comercializar",
  review: "Revisar",
  achieve: "Lograr",
  starText: "Más que una calculadora...",
  starSub: "Un socio en tu éxito.",
};

const pt: DesktopStrings = {
  journeyTitle: "Sua jornada completa",
  decide: "Decidir",
  plan: "Planejar",
  execute: "Executar",
  market: "Divulgar",
  review: "Revisar",
  achieve: "Conquistar",
  starText: "Mais que uma calculadora...",
  starSub: "Um parceiro no seu sucesso.",
};

const sw: DesktopStrings = {
  journeyTitle: "Safari yako kamili",
  decide: "Amua",
  plan: "Panga",
  execute: "Tekeleza",
  market: "Tangaza",
  review: "Kagua",
  achieve: "Fikia",
  starText: "Zaidi ya kikokotoo...",
  starSub: "Mshirika katika mafanikio yako.",
};

const zh: DesktopStrings = {
  journeyTitle: "你的完整旅程",
  decide: "决策",
  plan: "规划",
  execute: "执行",
  market: "推广",
  review: "复盘",
  achieve: "达成",
  starText: "不止是计算器……",
  starSub: "助你成功的伙伴。",
};

export const DESKTOP_STRINGS: Record<Lang, DesktopStrings> = { en, fr, es, pt, sw, zh };
