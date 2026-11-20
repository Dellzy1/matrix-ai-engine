import type { Lang } from "./i18n";

// Help pop-ups for the Calculator. They teach how to decide, not only what the words mean.
export type HelpSection = { heading?: string; lines: string[] };
export type HelpPopup = { title: string; intro?: string; sections: HelpSection[]; footer: string };
export type HelpCopy = { open: string; close: string; criteria: HelpPopup; options: HelpPopup };

const en: HelpCopy = {
  open: "What is this?",
  close: "Close",
  criteria: {
    title: "Understanding Criteria",
    intro: "Criteria are the factors you will use to compare your options. Choose the factors that matter most to the decision you are making.",
    sections: [
      {
        heading: "1. Choose your criteria",
        lines: [
          "Think about what makes an option good or bad for you.",
          "Cost: How much will it cost?",
          "Feasibility: How realistic is it to achieve?",
          "Impact: How much value or benefit will it create?",
          "Risk: How much uncertainty or potential loss is involved?",
        ],
      },
      {
        heading: "2. Assign a weight",
        lines: [
          "Weight shows how important each criterion is to your decision. For example: Cost 40%, Feasibility 30%, Impact 20%, Risk 10%.",
          "The higher the weight, the more influence that criterion has on the final result. All weights should add up to 100%.",
        ],
      },
      {
        heading: "3. Choose \"Lower is better\" when appropriate",
        lines: [
          "Turn this on when a lower score is the better outcome, such as lower cost, less time or lower risk.",
          "Leave it off when a higher score is the better outcome, such as greater impact or better quality.",
        ],
      },
    ],
    footer: "Choose criteria that genuinely matter to your decision, and give them weights that reflect your priorities.",
  },
  options: {
    title: "Understanding Options and Scores",
    sections: [
      {
        heading: "1. Add your options",
        lines: [
          "Options are the different choices you are considering. Add the realistic alternatives you want to compare.",
          "Example: Option A: Build the website in-house. Option B: Hire a freelancer. Option C: Hire an agency.",
        ],
      },
      {
        heading: "2. Score each option",
        lines: [
          "Rate every option against each criterion using a score from 1 to 10.",
          "1 = Very poor performance. 5 = Average performance. 10 = Excellent performance.",
          "Your score should reflect how well that option performs against the specific criterion.",
        ],
      },
      {
        heading: "3. Pay attention to \"Lower is better\"",
        lines: [
          "When a criterion uses \"Lower is better\", a lower score represents a more favourable result.",
          "For Cost (Lower is better on): 1 = Very affordable, 10 = Very expensive.",
          "For Impact (Lower is better off): 1 = Very low impact, 10 = Very high impact.",
        ],
      },
      {
        heading: "4. Be honest with your scores",
        lines: ["Use the information you have, not just what you hope will happen. If you are unsure, make a reasonable estimate."],
      },
    ],
    footer: "Decision Loop uses your criteria, weights and scores to calculate and rank your options. The result helps you compare choices, but your judgement still matters.",
  },
};

const fr: HelpCopy = {
  open: "Qu'est-ce que c'est ?",
  close: "Fermer",
  criteria: {
    title: "Comprendre les critères",
    intro: "Les critères sont les facteurs que vous utiliserez pour comparer vos options. Choisissez ceux qui comptent le plus pour la décision à prendre.",
    sections: [
      {
        heading: "1. Choisissez vos critères",
        lines: [
          "Pensez à ce qui rend une option bonne ou mauvaise pour vous.",
          "Coût : combien cela coûtera-t-il ?",
          "Faisabilité : est-ce réaliste à atteindre ?",
          "Impact : quelle valeur ou quel bénéfice cela créera-t-il ?",
          "Risque : quelle part d'incertitude ou de perte potentielle est en jeu ?",
        ],
      },
      {
        heading: "2. Attribuez un poids",
        lines: [
          "Le poids indique l'importance de chaque critère pour votre décision. Par exemple : Coût 40 %, Faisabilité 30 %, Impact 20 %, Risque 10 %.",
          "Plus le poids est élevé, plus le critère influence le résultat final. Tous les poids doivent totaliser 100 %.",
        ],
      },
      {
        heading: "3. Activez « Plus bas = mieux » si c'est pertinent",
        lines: [
          "Activez-le lorsqu'un score plus bas est le meilleur résultat, par exemple un coût, un délai ou un risque plus faible.",
          "Laissez-le désactivé lorsqu'un score plus haut est le meilleur résultat, par exemple un impact ou une qualité supérieurs.",
        ],
      },
    ],
    footer: "Choisissez des critères qui comptent vraiment pour votre décision, et donnez-leur des poids qui reflètent vos priorités.",
  },
  options: {
    title: "Comprendre les options et les scores",
    sections: [
      {
        heading: "1. Ajoutez vos options",
        lines: [
          "Les options sont les différents choix que vous envisagez. Ajoutez les alternatives réalistes que vous voulez comparer.",
          "Exemple : Option A : construire le site en interne. Option B : faire appel à un freelance. Option C : faire appel à une agence.",
        ],
      },
      {
        heading: "2. Notez chaque option",
        lines: [
          "Évaluez chaque option selon chaque critère, avec une note de 1 à 10.",
          "1 = performance très faible. 5 = performance moyenne. 10 = excellente performance.",
          "Votre note doit refléter la performance de l'option sur ce critère précis.",
        ],
      },
      {
        heading: "3. Faites attention à « Plus bas = mieux »",
        lines: [
          "Pour un critère qui utilise « Plus bas = mieux », une note basse correspond à un résultat plus favorable.",
          "Par exemple, pour le coût (« Plus bas = mieux » activé) : 1 = très abordable, 10 = très cher.",
          "Pour l'impact (« Plus bas = mieux » désactivé) : 1 = impact très faible, 10 = impact très élevé.",
        ],
      },
      {
        heading: "4. Soyez honnête dans vos notes",
        lines: ["Appuyez-vous sur les informations dont vous disposez, pas seulement sur ce que vous espérez. En cas de doute, faites une estimation raisonnable."],
      },
    ],
    footer: "Decision Loop utilise vos critères, poids et notes pour calculer et classer vos options. Le résultat vous aide à comparer les choix, mais votre jugement reste essentiel.",
  },
};

const es: HelpCopy = {
  open: "¿Qué es esto?",
  close: "Cerrar",
  criteria: {
    title: "Entender los criterios",
    intro: "Los criterios son los factores que usarás para comparar tus opciones. Elige los que más importan para la decisión que estás tomando.",
    sections: [
      {
        heading: "1. Elige tus criterios",
        lines: [
          "Piensa en qué hace que una opción sea buena o mala para ti.",
          "Costo: ¿cuánto costará?",
          "Viabilidad: ¿qué tan realista es lograrla?",
          "Impacto: ¿cuánto valor o beneficio generará?",
          "Riesgo: ¿cuánta incertidumbre o posible pérdida implica?",
        ],
      },
      {
        heading: "2. Asigna un peso",
        lines: [
          "El peso muestra qué tan importante es cada criterio para tu decisión. Por ejemplo: Costo 40 %, Viabilidad 30 %, Impacto 20 %, Riesgo 10 %.",
          "Cuanto mayor sea el peso, más influye ese criterio en el resultado final. Todos los pesos deben sumar 100 %.",
        ],
      },
      {
        heading: "3. Elige «Menor es mejor» cuando corresponda",
        lines: [
          "Actívalo cuando una puntuación más baja sea el mejor resultado, como menor costo, menos tiempo o menor riesgo.",
          "Déjalo desactivado cuando una puntuación más alta sea el mejor resultado, como mayor impacto o mejor calidad.",
        ],
      },
    ],
    footer: "Elige criterios que de verdad importen para tu decisión y dales pesos que reflejen tus prioridades.",
  },
  options: {
    title: "Entender las opciones y las puntuaciones",
    sections: [
      {
        heading: "1. Añade tus opciones",
        lines: [
          "Las opciones son las distintas elecciones que estás considerando. Añade las alternativas realistas que quieres comparar.",
          "Ejemplo: Opción A: construir el sitio web en casa. Opción B: contratar a un freelance. Opción C: contratar una agencia.",
        ],
      },
      {
        heading: "2. Puntúa cada opción",
        lines: [
          "Califica cada opción según cada criterio con una puntuación de 1 a 10.",
          "1 = rendimiento muy malo. 5 = rendimiento promedio. 10 = rendimiento excelente.",
          "Tu puntuación debe reflejar qué tan bien se desempeña la opción en ese criterio concreto.",
        ],
      },
      {
        heading: "3. Presta atención a «Menor es mejor»",
        lines: [
          "Cuando un criterio usa «Menor es mejor», una puntuación más baja representa un resultado más favorable.",
          "Por ejemplo, para el costo (con «Menor es mejor» activado): 1 = muy económico, 10 = muy caro.",
          "Para el impacto (con «Menor es mejor» desactivado): 1 = impacto muy bajo, 10 = impacto muy alto.",
        ],
      },
      {
        heading: "4. Sé honesto con tus puntuaciones",
        lines: ["Usa la información que tienes, no solo lo que esperas que pase. Si no estás seguro, haz una estimación razonable."],
      },
    ],
    footer: "Decision Loop usa tus criterios, pesos y puntuaciones para calcular y ordenar tus opciones. El resultado te ayuda a comparar, pero tu criterio sigue siendo importante.",
  },
};

const pt: HelpCopy = {
  open: "O que é isso?",
  close: "Fechar",
  criteria: {
    title: "Entendendo os critérios",
    intro: "Critérios são os fatores que você usará para comparar as opções. Escolha os que mais importam para a decisão que está tomando.",
    sections: [
      {
        heading: "1. Escolha seus critérios",
        lines: [
          "Pense no que torna uma opção boa ou ruim para você.",
          "Custo: quanto vai custar?",
          "Viabilidade: quão realista é alcançá-la?",
          "Impacto: quanto valor ou benefício ela vai gerar?",
          "Risco: quanta incerteza ou possível perda está envolvida?",
        ],
      },
      {
        heading: "2. Defina um peso",
        lines: [
          "O peso mostra a importância de cada critério para a sua decisão. Por exemplo: Custo 40%, Viabilidade 30%, Impacto 20%, Risco 10%.",
          "Quanto maior o peso, mais influência o critério tem no resultado final. Todos os pesos devem somar 100%.",
        ],
      },
      {
        heading: "3. Escolha \"Menor é melhor\" quando fizer sentido",
        lines: [
          "Ative quando uma pontuação menor for o melhor resultado, como menor custo, menos tempo ou menor risco.",
          "Deixe desativado quando uma pontuação maior for o melhor resultado, como maior impacto ou mais qualidade.",
        ],
      },
    ],
    footer: "Escolha critérios que realmente importam para a sua decisão e dê a eles pesos que reflitam as suas prioridades.",
  },
  options: {
    title: "Entendendo as opções e as pontuações",
    sections: [
      {
        heading: "1. Adicione suas opções",
        lines: [
          "Opções são as diferentes escolhas que você está considerando. Adicione as alternativas realistas que quer comparar.",
          "Exemplo: Opção A: construir o site internamente. Opção B: contratar um freelancer. Opção C: contratar uma agência.",
        ],
      },
      {
        heading: "2. Pontue cada opção",
        lines: [
          "Avalie cada opção em cada critério com uma pontuação de 1 a 10.",
          "1 = desempenho muito fraco. 5 = desempenho médio. 10 = desempenho excelente.",
          "Sua pontuação deve refletir o desempenho da opção naquele critério específico.",
        ],
      },
      {
        heading: "3. Preste atenção em \"Menor é melhor\"",
        lines: [
          "Quando um critério usa \"Menor é melhor\", uma pontuação menor representa um resultado mais favorável.",
          "Por exemplo, para o custo (com \"Menor é melhor\" ativado): 1 = muito acessível, 10 = muito caro.",
          "Para o impacto (com \"Menor é melhor\" desativado): 1 = impacto muito baixo, 10 = impacto muito alto.",
        ],
      },
      {
        heading: "4. Seja honesto com suas pontuações",
        lines: ["Use as informações que você tem, não apenas o que espera que aconteça. Se tiver dúvidas, faça uma estimativa razoável."],
      },
    ],
    footer: "O Decision Loop usa seus critérios, pesos e pontuações para calcular e classificar as opções. O resultado ajuda a comparar escolhas, mas o seu julgamento continua sendo importante.",
  },
};

const sw: HelpCopy = {
  open: "Hii ni nini?",
  close: "Funga",
  criteria: {
    title: "Kuelewa vigezo",
    intro: "Vigezo ni mambo utakayotumia kulinganisha chaguo zako. Chagua yale yanayojali zaidi kwa uamuzi unaofanya.",
    sections: [
      {
        heading: "1. Chagua vigezo vyako",
        lines: [
          "Fikiria kinachofanya chaguo liwe zuri au baya kwako.",
          "Gharama: Itagharimu kiasi gani?",
          "Uwezekano: Je, ni rahisi kufikika kwa vitendo?",
          "Athari: Italeta thamani au faida kiasi gani?",
          "Hatari: Kuna kutokuwa na uhakika au hasara inayowezekana kiasi gani?",
        ],
      },
      {
        heading: "2. Weka uzito",
        lines: [
          "Uzito unaonyesha kila kigezo kina umuhimu kiasi gani kwa uamuzi wako. Kwa mfano: Gharama 40%, Uwezekano 30%, Athari 20%, Hatari 10%.",
          "Uzito ukiwa mkubwa, ndivyo kigezo hicho kinavyoathiri matokeo ya mwisho. Uzito wote unapaswa kujumlisha 100%.",
        ],
      },
      {
        heading: "3. Chagua \"Ndogo ni bora\" inapofaa",
        lines: [
          "Washa pale alama ndogo inapomaanisha matokeo bora, kama gharama ndogo, muda mfupi au hatari ndogo.",
          "Acha imezimwa pale alama kubwa inapomaanisha matokeo bora, kama athari kubwa au ubora zaidi.",
        ],
      },
    ],
    footer: "Chagua vigezo vinavyojali kweli kwa uamuzi wako, na upe uzito unaoonyesha vipaumbele vyako.",
  },
  options: {
    title: "Kuelewa chaguo na alama",
    sections: [
      {
        heading: "1. Ongeza chaguo zako",
        lines: [
          "Chaguo ni njia tofauti unazozingatia. Ongeza mbadala halisi unazotaka kulinganisha.",
          "Mfano: Chaguo A: kujenga tovuti ndani ya kampuni. Chaguo B: kuajiri mtaalamu huru. Chaguo C: kuajiri wakala.",
        ],
      },
      {
        heading: "2. Pima kila chaguo",
        lines: [
          "Pima kila chaguo kulingana na kila kigezo kwa alama kuanzia 1 hadi 10.",
          "1 = utendaji mbaya sana. 5 = utendaji wa wastani. 10 = utendaji bora sana.",
          "Alama yako inapaswa kuonyesha jinsi chaguo hilo linavyofanya katika kigezo hicho mahususi.",
        ],
      },
      {
        heading: "3. Zingatia \"Ndogo ni bora\"",
        lines: [
          "Kigezo kinapotumia \"Ndogo ni bora\", alama ndogo inamaanisha matokeo bora zaidi.",
          "Kwa mfano, kwa gharama (\"Ndogo ni bora\" imewashwa): 1 = nafuu sana, 10 = ghali sana.",
          "Kwa athari (\"Ndogo ni bora\" imezimwa): 1 = athari ndogo sana, 10 = athari kubwa sana.",
        ],
      },
      {
        heading: "4. Kuwa mwaminifu katika alama zako",
        lines: ["Tumia taarifa ulizonazo, si tu kile unachotumaini kitatokea. Ukiwa na shaka, tengeneza makadirio ya busara."],
      },
    ],
    footer: "Decision Loop hutumia vigezo, uzito na alama zako kukokotoa na kupanga chaguo zako. Matokeo yanakusaidia kulinganisha, lakini busara yako bado ni muhimu.",
  },
};

const zh: HelpCopy = {
  open: "这是什么？",
  close: "关闭",
  criteria: {
    title: "了解标准",
    intro: "标准是你用来比较各个选项的因素。请选择对你这次决定最重要的因素。",
    sections: [
      {
        heading: "1. 选择你的标准",
        lines: [
          "想一想什么让一个选项对你来说好或不好。",
          "成本：需要花多少钱？",
          "可行性：实现起来有多现实？",
          "影响：能带来多少价值或收益？",
          "风险：存在多少不确定性或潜在损失？",
        ],
      },
      {
        heading: "2. 设定权重",
        lines: [
          "权重表示每个标准对你的决定有多重要。例如：成本 40%，可行性 30%，影响 20%，风险 10%。",
          "权重越高，该标准对最终结果的影响越大。所有权重之和应为 100%。",
        ],
      },
      {
        heading: "3. 适当时选择“越低越好”",
        lines: [
          "当较低的分数代表更好的结果时开启，例如成本更低、耗时更少或风险更低。",
          "当较高的分数代表更好的结果时关闭，例如影响更大或质量更好。",
        ],
      },
    ],
    footer: "请选择真正对你的决定重要的标准，并为它们设定能反映你优先级的权重。",
  },
  options: {
    title: "了解选项和评分",
    sections: [
      {
        heading: "1. 添加选项",
        lines: [
          "选项是你正在考虑的不同选择。请添加你想比较的现实可行的替代方案。",
          "例如：选项 A：自己在公司内部建设网站。选项 B：聘请自由职业者。选项 C：聘请代理机构。",
        ],
      },
      {
        heading: "2. 为每个选项评分",
        lines: [
          "按照每个标准，用 1 到 10 的分数为每个选项打分。",
          "1 = 表现非常差。5 = 表现一般。10 = 表现非常出色。",
          "你的分数应反映该选项在这一具体标准上的表现。",
        ],
      },
      {
        heading: "3. 注意“越低越好”",
        lines: [
          "对于使用“越低越好”的标准，较低的分数代表更有利的结果。",
          "例如成本（开启“越低越好”）：1 = 非常便宜，10 = 非常昂贵。",
          "例如影响（关闭“越低越好”）：1 = 影响很小，10 = 影响很大。",
        ],
      },
      {
        heading: "4. 诚实地评分",
        lines: ["请依据你掌握的信息评分，而不只是你希望发生的事情。如果不确定，请做出合理的估计。"],
      },
    ],
    footer: "Decision Loop 使用你的标准、权重和分数来计算并排列各个选项。结果可以帮助你比较选择，但你的判断依然重要。",
  },
};

export const HELP_STRINGS: Record<Lang, HelpCopy> = { en, fr, es, pt, sw, zh };
