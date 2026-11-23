import type { Lang } from "./i18n";

// Guide for the Assumption Journal: a five-stage walk-through plus a short welcome.
// It explains the existing features only. It does not add data or change any behaviour.
export type GuideStage = { title: string; question: string; points: string[]; example: string; note?: string };

export type GuideCopy = {
  welcomeTitle: string;
  welcomeBody: string;
  guideButton: string;
  guideTitle: string;
  close: string;
  next: string;
  back: string;
  done: string;
  skip: string;
  start: string;
  stepOf: string;
  example: string;
  stages: GuideStage[];
};

const en: GuideCopy = {
  welcomeTitle: "What is an assumption?",
  welcomeBody:
    "An assumption is something you believe is true but haven't proven yet. Testing your assumptions helps you make better decisions and avoid costly surprises.",
  guideButton: "Guide",
  guideTitle: "Assumption Journal guide",
  close: "Close",
  next: "Next",
  back: "Back",
  done: "Finish",
  skip: "Skip",
  start: "Start the guide",
  stepOf: "Step {n} of 5",
  example: "Example",
  stages: [
    {
      title: "Capture",
      question: "What do I believe?",
      points: [
        "Write the assumption in one clear sentence.",
        "Choose a category.",
        "Link it to a decision or project.",
        "Set its importance and your confidence.",
        "Ask yourself: what could happen if this is wrong?",
      ],
      example: "Customers will pay the monthly price.",
    },
    {
      title: "Challenge",
      question: "Have I questioned this belief?",
      points: [
        "Why do I believe it?",
        "What evidence supports it?",
        "What evidence contradicts it?",
        "What would change my mind?",
      ],
      example: "For: two customers said they would pay. Against: one says the price is too high.",
    },
    {
      title: "Validate",
      question: "How can I test it?",
      points: [
        "Choose a practical test.",
        "Decide what result would count as success.",
        "Set a test-by date.",
        "Add it to your Action Plan.",
      ],
      example: "Call 10 potential customers. Success: at least 6 say yes.",
    },
    {
      title: "Track",
      question: "What is the evidence telling me?",
      points: [
        "Record supporting and contradicting evidence.",
        "Add a source and a date.",
        "Update the status as the evidence builds up.",
      ],
      example: "Interview notes, with the date.",
    },
    {
      title: "Learn",
      question: "What have I discovered?",
      points: [
        "Review the evidence you collected.",
        "Compare your original belief with what happened.",
        "Write down what you learned in your own notes.",
        "Check whether a related decision or Action Plan needs updating.",
      ],
      note: "The journal doesn't have a dedicated place for lessons yet. Use your own notes for now.",
      example: "The price worked for small customers, but not for large ones.",
    },
  ],
};

const fr: GuideCopy = {
  welcomeTitle: "Qu'est-ce qu'une hypothèse ?",
  welcomeBody:
    "Une hypothèse est quelque chose que vous croyez vrai sans l'avoir encore prouvé. Tester vos hypothèses vous aide à mieux décider et à éviter des surprises coûteuses.",
  guideButton: "Guide",
  guideTitle: "Guide du journal des hypothèses",
  close: "Fermer",
  next: "Suivant",
  back: "Retour",
  done: "Terminer",
  skip: "Passer",
  start: "Commencer le guide",
  stepOf: "Étape {n} sur 5",
  example: "Exemple",
  stages: [
    {
      title: "Saisir",
      question: "Que croyez-vous ?",
      points: [
        "Écrivez l'hypothèse en une phrase claire.",
        "Choisissez une catégorie.",
        "Liez-la à une décision ou à un projet.",
        "Indiquez son importance et votre confiance.",
        "Demandez-vous : que se passerait-il si elle était fausse ?",
      ],
      example: "Les clients paieront le prix mensuel.",
    },
    {
      title: "Remettre en question",
      question: "Avez-vous remis cette croyance en question ?",
      points: [
        "Pourquoi y croyez-vous ?",
        "Quelles preuves la soutiennent ?",
        "Quelles preuves la contredisent ?",
        "Qu'est-ce qui vous ferait changer d'avis ?",
      ],
      example: "Pour : deux clients ont dit qu'ils paieraient. Contre : un client trouve le prix trop élevé.",
    },
    {
      title: "Valider",
      question: "Comment la tester ?",
      points: [
        "Choisissez un test concret.",
        "Décidez quel résultat compterait comme succès.",
        "Fixez une date de test.",
        "Ajoutez-le à votre plan d'action.",
      ],
      example: "Appeler 10 clients potentiels. Succès : au moins 6 disent oui.",
    },
    {
      title: "Suivre",
      question: "Que disent les preuves ?",
      points: [
        "Notez les preuves pour et contre.",
        "Ajoutez une source et une date.",
        "Mettez à jour le statut au fil des preuves.",
      ],
      example: "Notes d'entretien, avec la date.",
    },
    {
      title: "Apprendre",
      question: "Qu'avez-vous découvert ?",
      points: [
        "Relisez les preuves recueillies.",
        "Comparez votre croyance initiale avec ce qui s'est passé.",
        "Notez ce que vous avez appris dans vos propres notes.",
        "Vérifiez si une décision liée ou un plan d'action doit être mis à jour.",
      ],
      note: "Le journal n'a pas encore d'espace dédié aux leçons. Utilisez vos propres notes pour l'instant.",
      example: "Le prix convenait aux petits clients, pas aux grands.",
    },
  ],
};

const es: GuideCopy = {
  welcomeTitle: "¿Qué es un supuesto?",
  welcomeBody:
    "Un supuesto es algo que crees que es verdad pero aún no has demostrado. Probar tus supuestos te ayuda a decidir mejor y a evitar sorpresas costosas.",
  guideButton: "Guía",
  guideTitle: "Guía del diario de supuestos",
  close: "Cerrar",
  next: "Siguiente",
  back: "Atrás",
  done: "Terminar",
  skip: "Omitir",
  start: "Empezar la guía",
  stepOf: "Paso {n} de 5",
  example: "Ejemplo",
  stages: [
    {
      title: "Registrar",
      question: "¿Qué crees?",
      points: [
        "Escribe el supuesto en una frase clara.",
        "Elige una categoría.",
        "Vincúlalo a una decisión o proyecto.",
        "Indica su importancia y tu confianza.",
        "Pregúntate: ¿qué pasaría si fuera falso?",
      ],
      example: "Los clientes pagarán el precio mensual.",
    },
    {
      title: "Cuestionar",
      question: "¿Has cuestionado esta creencia?",
      points: [
        "¿Por qué lo crees?",
        "¿Qué pruebas lo apoyan?",
        "¿Qué pruebas lo contradicen?",
        "¿Qué te haría cambiar de opinión?",
      ],
      example: "A favor: dos clientes dijeron que pagarían. En contra: uno dice que el precio es alto.",
    },
    {
      title: "Validar",
      question: "¿Cómo puedes probarlo?",
      points: [
        "Elige una prueba práctica.",
        "Decide qué resultado contaría como éxito.",
        "Fija una fecha de revisión.",
        "Añádelo a tu plan de acción.",
      ],
      example: "Llamar a 10 clientes potenciales. Éxito: al menos 6 dicen que sí.",
    },
    {
      title: "Seguir",
      question: "¿Qué te dice la evidencia?",
      points: [
        "Registra las pruebas a favor y en contra.",
        "Añade la fuente y la fecha.",
        "Actualiza el estado a medida que avanzan las pruebas.",
      ],
      example: "Notas de entrevista, con la fecha.",
    },
    {
      title: "Aprender",
      question: "¿Qué has descubierto?",
      points: [
        "Revisa las pruebas que reuniste.",
        "Compara tu creencia inicial con lo que pasó.",
        "Anota lo que aprendiste en tus propias notas.",
        "Comprueba si una decisión relacionada o un plan de acción necesita actualizarse.",
      ],
      note: "El diario todavía no tiene un lugar específico para las lecciones. Usa tus propias notas por ahora.",
      example: "El precio era aceptable para clientes pequeños, no para los grandes.",
    },
  ],
};

const pt: GuideCopy = {
  welcomeTitle: "O que é uma premissa?",
  welcomeBody:
    "Uma premissa é algo que você acredita ser verdade, mas ainda não comprovou. Testar suas premissas ajuda a decidir melhor e a evitar surpresas caras.",
  guideButton: "Guia",
  guideTitle: "Guia do diário de premissas",
  close: "Fechar",
  next: "Próximo",
  back: "Voltar",
  done: "Concluir",
  skip: "Pular",
  start: "Começar o guia",
  stepOf: "Passo {n} de 5",
  example: "Exemplo",
  stages: [
    {
      title: "Registrar",
      question: "No que você acredita?",
      points: [
        "Escreva a premissa em uma frase clara.",
        "Escolha uma categoria.",
        "Vincule-a a uma decisão ou projeto.",
        "Defina a importância e a sua confiança.",
        "Pergunte-se: o que aconteceria se ela estivesse errada?",
      ],
      example: "Os clientes vão pagar o preço mensal.",
    },
    {
      title: "Questionar",
      question: "Você questionou essa crença?",
      points: [
        "Por que você acredita nisso?",
        "Que evidências a apoiam?",
        "Que evidências a contradizem?",
        "O que faria você mudar de ideia?",
      ],
      example: "A favor: dois clientes disseram que pagariam. Contra: um acha o preço alto.",
    },
    {
      title: "Validar",
      question: "Como testar?",
      points: [
        "Escolha um teste prático.",
        "Decida qual resultado contaria como sucesso.",
        "Defina uma data para o teste.",
        "Adicione ao seu plano de ação.",
      ],
      example: "Ligar para 10 clientes potenciais. Sucesso: pelo menos 6 dizem sim.",
    },
    {
      title: "Acompanhar",
      question: "O que as evidências dizem?",
      points: [
        "Registre as evidências a favor e contra.",
        "Adicione a fonte e a data.",
        "Atualize o status conforme as evidências surgirem.",
      ],
      example: "Anotações de entrevista, com a data.",
    },
    {
      title: "Aprender",
      question: "O que você descobriu?",
      points: [
        "Revise as evidências coletadas.",
        "Compare sua crença inicial com o que aconteceu.",
        "Anote o que aprendeu nas suas próprias notas.",
        "Verifique se uma decisão relacionada ou um plano de ação precisa ser atualizado.",
      ],
      note: "O diário ainda não tem um espaço próprio para lições. Use suas próprias notas por enquanto.",
      example: "O preço era aceitável para clientes pequenos, não para os grandes.",
    },
  ],
};

const sw: GuideCopy = {
  welcomeTitle: "Dhana ni nini?",
  welcomeBody:
    "Dhana ni kitu unachoamini kuwa ni kweli lakini bado hujakithibitisha. Kujaribu dhana zako kunakusaidia kufanya maamuzi bora na kuepuka mshangao wa gharama.",
  guideButton: "Mwongozo",
  guideTitle: "Mwongozo wa Jarida la Dhana",
  close: "Funga",
  next: "Endelea",
  back: "Rudi",
  done: "Maliza",
  skip: "Ruka",
  start: "Anza mwongozo",
  stepOf: "Hatua {n} kati ya 5",
  example: "Mfano",
  stages: [
    {
      title: "Kuandika",
      question: "Unaamini nini?",
      points: [
        "Andika dhana kwa sentensi moja iliyo wazi.",
        "Chagua kundi.",
        "Iunganishe na uamuzi au mradi.",
        "Weka umuhimu wake na kiwango chako cha uhakika.",
        "Jiulize: itatokea nini ikiwa si kweli?",
      ],
      example: "Wateja watalipa bei ya kila mwezi.",
    },
    {
      title: "Kuhoji",
      question: "Umehoji imani hii?",
      points: [
        "Kwa nini unaiamini?",
        "Ni ushahidi gani unaiunga mkono?",
        "Ni ushahidi gani unaipinga?",
        "Ni nini kingekufanya ubadilishe mawazo?",
      ],
      example: "Kwa: wateja wawili walisema watalipa. Dhidi: mmoja anasema bei ni kubwa.",
    },
    {
      title: "Kuthibitisha",
      question: "Unawezaje kuijaribu?",
      points: [
        "Chagua jaribio la vitendo.",
        "Amua matokeo gani yangehesabiwa kuwa mafanikio.",
        "Weka tarehe ya kujaribu.",
        "Iongeze kwenye mpango wako wa hatua.",
      ],
      example: "Piga simu wateja 10 wanaowezekana. Mafanikio: angalau 6 wasema ndiyo.",
    },
    {
      title: "Kufuatilia",
      question: "Ushahidi unakuambia nini?",
      points: [
        "Rekodi ushahidi unaounga mkono na unaopinga.",
        "Ongeza chanzo na tarehe.",
        "Sasisha hali kadri ushahidi unavyojengeka.",
      ],
      example: "Maelezo ya mahojiano, pamoja na tarehe.",
    },
    {
      title: "Kujifunza",
      question: "Umegundua nini?",
      points: [
        "Pitia ushahidi uliokusanya.",
        "Linganisha imani yako ya awali na kilichotokea.",
        "Andika ulichojifunza kwenye maelezo yako mwenyewe.",
        "Angalia kama uamuzi unaohusiana au mpango wa hatua unahitaji kusasishwa.",
      ],
      note: "Jarida bado halina sehemu maalum ya mafunzo. Tumia maelezo yako mwenyewe kwa sasa.",
      example: "Bei ilikubalika kwa wateja wadogo, si kwa wakubwa.",
    },
  ],
};

const zh: GuideCopy = {
  welcomeTitle: "什么是假设？",
  welcomeBody: "假设是你认为是真的、但还未经证实的事情。检验假设能帮助你做出更好的决定，避免代价高昂的意外。",
  guideButton: "指南",
  guideTitle: "假设日志指南",
  close: "关闭",
  next: "下一步",
  back: "上一步",
  done: "完成",
  skip: "跳过",
  start: "开始指南",
  stepOf: "第 {n} 步，共 5 步",
  example: "示例",
  stages: [
    {
      title: "记录",
      question: "你相信什么？",
      points: [
        "用一句清楚的话写下假设。",
        "选择一个类别。",
        "将它关联到一个决策或项目。",
        "设置它的重要性和你的信心。",
        "问自己：如果它是错的，会发生什么？",
      ],
      example: "客户会按月价格付费。",
    },
    {
      title: "质疑",
      question: "你质疑过这个信念吗？",
      points: ["你为什么相信它？", "什么证据支持它？", "什么证据与它矛盾？", "什么会让你改变想法？"],
      example: "支持：两位客户说他们会付费。反对：一位客户认为价格太高。",
    },
    {
      title: "验证",
      question: "你如何检验它？",
      points: ["选择一个可行的检验方式。", "决定什么结果算作成功。", "设定检验日期。", "把它加入你的行动计划。"],
      example: "致电 10 位潜在客户。成功标准：至少 6 位表示愿意。",
    },
    {
      title: "跟踪",
      question: "证据告诉你什么？",
      points: ["记录支持和反对的证据。", "添加来源和日期。", "随着证据积累更新状态。"],
      example: "访谈记录，附日期。",
    },
    {
      title: "学习",
      question: "你发现了什么？",
      points: [
        "回顾你收集的证据。",
        "将最初的信念与实际结果进行比较。",
        "把你学到的东西写在自己的笔记中。",
        "检查相关决策或行动计划是否需要更新。",
      ],
      note: "日志目前还没有专门记录经验教训的地方，暂时请使用你自己的笔记。",
      example: "价格对小客户可以接受，对大客户则不行。",
    },
  ],
};

export const GUIDE_STRINGS: Record<Lang, GuideCopy> = { en, fr, es, pt, sw, zh };
