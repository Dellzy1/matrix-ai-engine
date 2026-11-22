import type { Lang } from "./i18n";
import type { Classification } from "./decisionInsight";

// Copy for the Rank 2 notes, the decision meaning, and the comparison totals.
// Numbers are filled in with {name}, {n}, {from}, {to}.
export type OptionNotesCopy = {
  beatsWinner: string;
  behindWinner: string;
  strongest: string;
  weakest: string;
  toLevel: string;
  noSingle: string;
  pointsLine: string;
  meaning: Record<Classification, string>;
  totalPoints: string;
  finalScore: string;
};

const en: OptionNotesCopy = {
  beatsWinner: "Where it beats the winner",
  behindWinner: "Where it falls behind the winner",
  strongest: "Its strongest criteria",
  weakest: "Its weakest criteria",
  toLevel: "To draw level with or pass the winner, its {name} rating would need to go from {from} to {to}. Other ratings stay the same.",
  noSingle: "No single rating change on one criterion would be enough to draw level with the winner.",
  pointsLine: "{name}: {n} points",
  meaning: {
    no_strong_option: "No option is strong enough to rely on yet. The ranking only shows which option is least weak under these ratings.",
    close_decision: "The top options are effectively level. Decide on the criteria that matter most to you, not on the ranking alone.",
    clear_winner: "The winner leads clearly under the current weights. Still check its weakest criteria before you commit.",
  },
  totalPoints: "Total points",
  finalScore: "Final score",
};

const fr: OptionNotesCopy = {
  beatsWinner: "Où il devance le gagnant",
  behindWinner: "Où il est en retrait par rapport au gagnant",
  strongest: "Ses critères les plus forts",
  weakest: "Ses critères les plus faibles",
  toLevel: "Pour rejoindre ou dépasser le gagnant, sa note sur {name} devrait passer de {from} à {to}. Les autres notes restent les mêmes.",
  noSingle: "Aucune modification d'une seule note sur un critère ne suffirait à rejoindre le gagnant.",
  pointsLine: "{name} : {n} points",
  meaning: {
    no_strong_option: "Aucune option n'est assez solide pour s'y fier pour l'instant. Le classement indique seulement l'option la moins faible avec ces notes.",
    close_decision: "Les meilleures options sont pratiquement à égalité. Décidez selon les critères qui comptent le plus pour vous, pas seulement selon le classement.",
    clear_winner: "Le gagnant mène nettement avec les poids actuels. Vérifiez quand même ses critères les plus faibles avant de vous engager.",
  },
  totalPoints: "Total des points",
  finalScore: "Score final",
};

const es: OptionNotesCopy = {
  beatsWinner: "Dónde supera al ganador",
  behindWinner: "Dónde queda por detrás del ganador",
  strongest: "Sus criterios más fuertes",
  weakest: "Sus criterios más débiles",
  toLevel: "Para igualar o superar al ganador, su puntuación en {name} tendría que pasar de {from} a {to}. Las demás puntuaciones se mantienen.",
  noSingle: "Ningún cambio de una sola puntuación en un criterio bastaría para igualar al ganador.",
  pointsLine: "{name}: {n} puntos",
  meaning: {
    no_strong_option: "Ninguna opción es lo bastante sólida como para confiar en ella todavía. El ranking solo muestra cuál es la menos débil con estas puntuaciones.",
    close_decision: "Las mejores opciones están prácticamente empatadas. Decide según los criterios que más te importan, no solo según el ranking.",
    clear_winner: "El ganador lidera con claridad con los pesos actuales. Aun así, revisa sus criterios más débiles antes de comprometerte.",
  },
  totalPoints: "Puntos totales",
  finalScore: "Puntuación final",
};

const pt: OptionNotesCopy = {
  beatsWinner: "Onde supera o vencedor",
  behindWinner: "Onde fica atrás do vencedor",
  strongest: "Seus critérios mais fortes",
  weakest: "Seus critérios mais fracos",
  toLevel: "Para empatar ou superar o vencedor, sua nota em {name} precisaria passar de {from} para {to}. As outras notas permanecem iguais.",
  noSingle: "Nenhuma mudança de uma única nota em um critério bastaria para empatar com o vencedor.",
  pointsLine: "{name}: {n} pontos",
  meaning: {
    no_strong_option: "Nenhuma opção é forte o bastante para confiar ainda. O ranking mostra apenas qual é a menos fraca com estas notas.",
    close_decision: "As melhores opções estão praticamente empatadas. Decida pelos critérios que mais importam para você, não só pelo ranking.",
    clear_winner: "O vencedor lidera com clareza com os pesos atuais. Ainda assim, verifique os critérios mais fracos dele antes de se comprometer.",
  },
  totalPoints: "Total de pontos",
  finalScore: "Pontuação final",
};

const sw: OptionNotesCopy = {
  beatsWinner: "Anapomshinda mshindi wapi",
  behindWinner: "Anarudi nyuma ya mshindi wapi",
  strongest: "Vigezo vyake vyenye nguvu zaidi",
  weakest: "Vigezo vyake dhaifu zaidi",
  toLevel: "Ili kufikia au kumpita mshindi, alama yake ya {name} ingehitaji kutoka {from} hadi {to}. Alama nyingine zinabaki vilevile.",
  noSingle: "Hakuna mabadiliko ya alama moja kwenye kigezo kimoja yanayotosha kufikia sawa na mshindi.",
  pointsLine: "{name}: pointi {n}",
  meaning: {
    no_strong_option: "Hakuna chaguo lenye nguvu za kutosha kulitegemea bado. Mpangilio unaonyesha tu chaguo lisilo dhaifu sana kwa alama hizi.",
    close_decision: "Chaguo bora ziko sawa kimsingi. Amua kwa kuzingatia vigezo vinavyokujali zaidi, si kwa mpangilio peke yake.",
    clear_winner: "Mshindi anaongoza wazi kwa uzito wa sasa. Bado kagua vigezo vyake dhaifu zaidi kabla ya kuamua.",
  },
  totalPoints: "Jumla ya pointi",
  finalScore: "Alama ya mwisho",
};

const zh: OptionNotesCopy = {
  beatsWinner: "在哪些方面优于胜者",
  behindWinner: "在哪些方面落后于胜者",
  strongest: "最强的标准",
  weakest: "最弱的标准",
  toLevel: "要与胜者持平或超过，“{name}”的评分需要从 {from} 变为 {to}。其他评分保持不变。",
  noSingle: "仅改变一项标准的一个评分，不足以与胜者持平。",
  pointsLine: "{name}：{n} 分",
  meaning: {
    no_strong_option: "目前没有任何选项足够强，值得依赖。排名只显示在这些评分下相对最不弱的选项。",
    close_decision: "前几名实际上不相上下。请依据对你最重要的标准做决定，而不只看排名。",
    clear_winner: "按当前权重，胜者明显领先。在做最终决定前，仍请检查它最弱的标准。",
  },
  totalPoints: "总分",
  finalScore: "最终得分",
};

export const OPTION_NOTES_STRINGS: Record<Lang, OptionNotesCopy> = { en, fr, es, pt, sw, zh };
