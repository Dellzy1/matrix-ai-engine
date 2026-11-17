import type { Lang } from "./i18n";
import type { ToolId } from "./tools";

// The information panel for each of the 12 tools. Every tool must have an entry in every
// language: the type below makes the build fail if one is missing.
export type FeatureInfoEntry = { what: string; how: string; get: string };

export const INFO_LABELS: Record<Lang, { open: string; close: string; what: string; how: string; get: string }> = {
  en: { open: "About this tool", close: "Close", what: "What it does", how: "How it works", get: "What you get" },
  fr: { open: "À propos de cet outil", close: "Fermer", what: "Ce qu'il fait", how: "Comment ça marche", get: "Ce que vous obtenez" },
  es: { open: "Acerca de esta herramienta", close: "Cerrar", what: "Qué hace", how: "Cómo funciona", get: "Qué obtienes" },
  pt: { open: "Sobre esta ferramenta", close: "Fechar", what: "O que faz", how: "Como funciona", get: "O que você obtém" },
  sw: { open: "Kuhusu zana hii", close: "Funga", what: "Inachofanya", how: "Inavyofanya kazi", get: "Utakachopata" },
  zh: { open: "关于此工具", close: "关闭", what: "功能", how: "使用方法", get: "你将获得" },
};

export const FEATURE_INFO: Record<ToolId, Record<Lang, FeatureInfoEntry>> = {
  assistant: {
    en: { what: "Answers your questions and helps you think through a decision, step by step.", how: "Type your question or describe your situation, then ask follow-up questions in the same conversation.", get: "Clear next steps and a better-reasoned answer to your question." },
    fr: { what: "Répond à vos questions et vous aide à réfléchir à une décision, étape par étape.", how: "Tapez votre question ou décrivez votre situation, puis posez vos questions de suivi dans la même conversation.", get: "Des prochaines étapes claires et une réponse mieux argumentée." },
    es: { what: "Responde tus preguntas y te ayuda a pensar una decisión, paso a paso.", how: "Escribe tu pregunta o describe tu situación, y haz preguntas de seguimiento en la misma conversación.", get: "Próximos pasos claros y una respuesta mejor razonada." },
    pt: { what: "Responde às suas perguntas e ajuda você a pensar em uma decisão, passo a passo.", how: "Digite sua pergunta ou descreva sua situação e faça perguntas de acompanhamento na mesma conversa.", get: "Próximos passos claros e uma resposta mais bem fundamentada." },
    sw: { what: "Hujibu maswali yako na kukusaidia kufikiria uamuzi hatua kwa hatua.", how: "Andika swali lako au eleza hali yako, kisha uulize maswali zaidi kwenye mazungumzo hayo hayo.", get: "Hatua wazi za kufuata na jibu lililofikiriwa vizuri." },
    zh: { what: "回答你的问题，并一步步帮你梳理一个决策。", how: "输入你的问题或描述你的情况，然后在同一对话中继续追问。", get: "清晰的下一步行动和更有依据的回答。" },
  },
  solver: {
    en: { what: "Breaks a big problem into smaller parts and suggests ways to tackle each one.", how: "Describe the problem, list what you have already tried, then review the options it suggests.", get: "A structured plan of attack for the problem." },
    fr: { what: "Découpe un grand problème en petites parties et propose des moyens de traiter chacune.", how: "Décrivez le problème, listez ce que vous avez déjà essayé, puis examinez les options proposées.", get: "Un plan d'action structuré pour le problème." },
    es: { what: "Divide un problema grande en partes más pequeñas y sugiere formas de abordar cada una.", how: "Describe el problema, indica lo que ya probaste y revisa las opciones que propone.", get: "Un plan estructurado para resolver el problema." },
    pt: { what: "Divide um problema grande em partes menores e sugere formas de resolver cada uma.", how: "Descreva o problema, liste o que você já tentou e analise as opções sugeridas.", get: "Um plano estruturado para resolver o problema." },
    sw: { what: "Hugawanya tatizo kubwa katika sehemu ndogo na kupendekeza njia za kushughulikia kila sehemu.", how: "Eleza tatizo, orodhesha ulichojaribu tayari, kisha pitia chaguzi zilizopendekezwa.", get: "Mpango wa kimfumo wa kutatua tatizo." },
    zh: { what: "把大问题拆分成若干小部分，并为每一部分提出解决思路。", how: "描述问题，列出你已经尝试过的方法，然后查看它给出的选项。", get: "针对该问题的结构化解决方案。" },
  },
  calc: {
    en: { what: "Helps you compare different choices and make more informed decisions.", how: "Enter your options, choose your criteria, give each criterion an importance, and score each option.", get: "A comparison that shows which option best matches your priorities." },
    fr: { what: "Vous aide à comparer différents choix pour prendre des décisions plus éclairées.", how: "Saisissez vos options, choisissez vos critères, donnez une importance à chaque critère et notez chaque option.", get: "Une comparaison qui montre l'option la plus proche de vos priorités." },
    es: { what: "Te ayuda a comparar distintas opciones para tomar decisiones más informadas.", how: "Introduce tus opciones, elige tus criterios, asigna una importancia a cada criterio y puntúa cada opción.", get: "Una comparación que muestra qué opción se ajusta mejor a tus prioridades." },
    pt: { what: "Ajuda você a comparar diferentes escolhas e tomar decisões mais bem informadas.", how: "Informe suas opções, escolha seus critérios, defina a importância de cada critério e avalie cada opção.", get: "Uma comparação que mostra qual opção melhor combina com suas prioridades." },
    sw: { what: "Hukusaidia kulinganisha chaguo tofauti ili kufanya maamuzi yenye ufahamu zaidi.", how: "Ingiza chaguo zako, chagua vigezo, mpe kila kigezo umuhimu, kisha upime kila chaguo.", get: "Ulinganisho unaoonyesha chaguo linalolingana vyema na vipaumbele vyako." },
    zh: { what: "帮助你比较不同的选择，做出更明智的决定。", how: "输入你的选项，选择评判标准，为每个标准设定重要性，并为每个选项打分。", get: "一份比较结果，显示哪个选项最符合你的优先事项。" },
  },
  plan: {
    en: { what: "Turns a decision into a step-by-step plan with stages, tasks, dates and notes.", how: "Create a plan, add stages and tasks, set due dates, and mark tasks as you go.", get: "A clear plan you can follow day by day, with progress you can see." },
    fr: { what: "Transforme une décision en plan étape par étape, avec des phases, des tâches, des dates et des notes.", how: "Créez un plan, ajoutez des phases et des tâches, fixez des échéances et cochez les tâches au fil de l'avancement.", get: "Un plan clair à suivre jour après jour, avec une progression visible." },
    es: { what: "Convierte una decisión en un plan paso a paso, con etapas, tareas, fechas y notas.", how: "Crea un plan, añade etapas y tareas, fija fechas límite y marca las tareas a medida que avanzas.", get: "Un plan claro que puedes seguir día a día, con un progreso visible." },
    pt: { what: "Transforma uma decisão em um plano passo a passo, com etapas, tarefas, datas e notas.", how: "Crie um plano, adicione etapas e tarefas, defina prazos e marque as tarefas conforme avança.", get: "Um plano claro para seguir dia a dia, com progresso visível." },
    sw: { what: "Hubadilisha uamuzi kuwa mpango wa hatua kwa hatua wenye hatua, kazi, tarehe na maelezo.", how: "Unda mpango, ongeza hatua na kazi, weka tarehe za mwisho, na weka alama kazi unapoendelea.", get: "Mpango wazi wa kufuata kila siku, pamoja na maendeleo yanayoonekana." },
    zh: { what: "把一个决策转化为分步计划，包含阶段、任务、日期和备注。", how: "创建计划，添加阶段和任务，设置截止日期，并在完成后标记任务。", get: "一份清晰的计划，便于你每天跟进，并能看到进展。" },
  },
  marketing: {
    en: { what: "Helps you plan how to tell people about what you offer.", how: "Describe your product or idea and your audience, then review the messages and channels it suggests.", get: "A simple marketing plan you can start on this week." },
    fr: { what: "Vous aide à planifier la manière de faire connaître ce que vous proposez.", how: "Décrivez votre produit ou votre idée et votre public, puis examinez les messages et les canaux suggérés.", get: "Un plan marketing simple que vous pouvez commencer cette semaine." },
    es: { what: "Te ayuda a planear cómo dar a conocer lo que ofreces.", how: "Describe tu producto o idea y tu público, y revisa los mensajes y canales que sugiere.", get: "Un plan de marketing sencillo que puedes empezar esta semana." },
    pt: { what: "Ajuda você a planejar como divulgar o que você oferece.", how: "Descreva seu produto ou ideia e seu público, e analise as mensagens e canais sugeridos.", get: "Um plano de marketing simples para começar nesta semana." },
    sw: { what: "Hukusaidia kupanga jinsi ya kuwajulisha watu kuhusu unachotoa.", how: "Eleza bidhaa au wazo lako na hadhira yako, kisha pitia ujumbe na njia zilizopendekezwa.", get: "Mpango rahisi wa masoko unaoweza kuanza wiki hii." },
    zh: { what: "帮助你规划如何让人们了解你所提供的内容。", how: "描述你的产品或想法以及目标受众，然后查看它建议的信息和渠道。", get: "一份简单的营销计划，本周就能开始执行。" },
  },
  opportunity: {
    en: { what: "Looks for opportunities that match your skills, interests and goals.", how: "Tell it about yourself and what you are looking for, then review the suggestions.", get: "A short list of opportunities worth exploring further." },
    fr: { what: "Recherche des opportunités correspondant à vos compétences, intérêts et objectifs.", how: "Parlez-lui de vous et de ce que vous cherchez, puis examinez les suggestions.", get: "Une courte liste d'opportunités à explorer." },
    es: { what: "Busca oportunidades que encajen con tus habilidades, intereses y metas.", how: "Háblale de ti y de lo que buscas, y revisa las sugerencias.", get: "Una lista corta de oportunidades que vale la pena explorar." },
    pt: { what: "Procura oportunidades que combinem com suas habilidades, interesses e objetivos.", how: "Conte sobre você e o que procura, e analise as sugestões.", get: "Uma lista curta de oportunidades que vale a pena explorar." },
    sw: { what: "Hutafuta fursa zinazolingana na ujuzi, mambo unayopenda na malengo yako.", how: "Mweleze kukuhusu na unachotafuta, kisha pitia mapendekezo.", get: "Orodha fupi ya fursa zinazostahili kuchunguzwa zaidi." },
    zh: { what: "寻找与你的技能、兴趣和目标相匹配的机会。", how: "告诉它你的情况和你在寻找什么，然后查看建议。", get: "一份值得进一步了解的机会简短清单。" },
  },
  growth: {
    en: { what: "Offers learning material to help you build the skills good decisions need.", how: "Choose a topic, follow the lessons, and track what you have learned.", get: "Skills you can apply to your decisions and plans." },
    fr: { what: "Propose des contenus d'apprentissage pour développer les compétences dont vous avez besoin pour bien décider.", how: "Choisissez un sujet, suivez les leçons et suivez ce que vous avez appris.", get: "Des compétences à appliquer à vos décisions et à vos plans." },
    es: { what: "Ofrece material de aprendizaje para desarrollar las habilidades que necesitan las buenas decisiones.", how: "Elige un tema, sigue las lecciones y registra lo que has aprendido.", get: "Habilidades que puedes aplicar a tus decisiones y planes." },
    pt: { what: "Oferece material de aprendizado para desenvolver as habilidades que boas decisões exigem.", how: "Escolha um tema, siga as lições e acompanhe o que você aprendeu.", get: "Habilidades que você pode aplicar às suas decisões e planos." },
    sw: { what: "Hutoa nyenzo za kujifunza ili kukusaidia kujenga ujuzi ambao maamuzi mazuri yanahitaji.", how: "Chagua mada, fuata masomo, kisha fuatilia ulichojifunza.", get: "Ujuzi unaoweza kutumia katika maamuzi na mipango yako." },
    zh: { what: "提供学习材料，帮助你培养做出好决策所需的能力。", how: "选择一个主题，学习课程，并记录你学到的内容。", get: "可以运用到你的决策和计划中的能力。" },
  },
  business: {
    en: { what: "Helps you shape a business idea into a plan you can test and grow.", how: "Describe your idea, answer the key questions, and review the business plan it builds.", get: "A clear business plan with the first steps to test your idea." },
    fr: { what: "Vous aide à transformer une idée d'entreprise en un plan que vous pouvez tester et développer.", how: "Décrivez votre idée, répondez aux questions clés et examinez le plan d'affaires créé.", get: "Un plan d'affaires clair avec les premières étapes pour tester votre idée." },
    es: { what: "Te ayuda a convertir una idea de negocio en un plan que puedas probar y hacer crecer.", how: "Describe tu idea, responde las preguntas clave y revisa el plan de negocio que se construye.", get: "Un plan de negocio claro con los primeros pasos para probar tu idea." },
    pt: { what: "Ajuda você a transformar uma ideia de negócio em um plano que pode ser testado e crescer.", how: "Descreva sua ideia, responda às perguntas principais e analise o plano de negócios gerado.", get: "Um plano de negócios claro com os primeiros passos para testar sua ideia." },
    sw: { what: "Hukusaidia kugeuza wazo la biashara kuwa mpango unaoweza kujaribiwa na kukua.", how: "Eleza wazo lako, jibu maswali muhimu, kisha pitia mpango wa biashara unaojengwa.", get: "Mpango wa biashara wazi wenye hatua za kwanza za kujaribu wazo lako." },
    zh: { what: "帮助你把一个商业想法发展成可以测试和成长的计划。", how: "描述你的想法，回答关键问题，然后查看它生成的商业计划。", get: "一份清晰的商业计划，附有测试想法的第一步行动。" },
  },
  creative: {
    en: { what: "Helps you come up with ideas and content for your projects.", how: "Describe what you are making and who it is for, then choose from the ideas it suggests.", get: "Fresh ideas and drafts you can refine." },
    fr: { what: "Vous aide à trouver des idées et des contenus pour vos projets.", how: "Décrivez ce que vous créez et pour qui, puis choisissez parmi les idées proposées.", get: "Des idées nouvelles et des brouillons à affiner." },
    es: { what: "Te ayuda a generar ideas y contenidos para tus proyectos.", how: "Describe lo que estás creando y para quién es, y elige entre las ideas sugeridas.", get: "Ideas frescas y borradores que puedes pulir." },
    pt: { what: "Ajuda você a encontrar ideias e conteúdos para seus projetos.", how: "Descreva o que você está criando e para quem é, e escolha entre as ideias sugeridas.", get: "Ideias novas e rascunhos para você aperfeiçoar." },
    sw: { what: "Hukusaidia kupata mawazo na maudhui kwa miradi yako.", how: "Eleza unachotengeneza na kwa ajili ya nani, kisha chagua kutoka mawazo yaliyopendekezwa.", get: "Mawazo mapya na rasimu za kuboresha." },
    zh: { what: "帮助你为项目想出创意和内容。", how: "描述你正在创作的内容和受众，然后从它建议的创意中选择。", get: "新鲜的创意和可以继续完善的草稿。" },
  },
  accountability: {
    en: { what: "Helps you stay on track by sharing your goals with a partner who checks your progress.", how: "Invite a partner, share your plan, and agree on regular check-ins.", get: "Regular check-ins that keep your decisions moving." },
    fr: { what: "Vous aide à rester sur la bonne voie en partageant vos objectifs avec un partenaire qui suit vos progrès.", how: "Invitez un partenaire, partagez votre plan et convenez de points réguliers.", get: "Des points réguliers qui font avancer vos décisions." },
    es: { what: "Te ayuda a mantenerte en el camino compartiendo tus metas con un compañero que revisa tu progreso.", how: "Invita a un compañero, comparte tu plan y acuerden revisiones periódicas.", get: "Revisiones periódicas que mantienen tus decisiones en marcha." },
    pt: { what: "Ajuda você a manter o foco compartilhando suas metas com um parceiro que acompanha seu progresso.", how: "Convide um parceiro, compartilhe seu plano e combinem check-ins regulares.", get: "Check-ins regulares que mantêm suas decisões em andamento." },
    sw: { what: "Hukusaidia kubaki kwenye mstari kwa kushiriki malengo yako na mshirika anayefuatilia maendeleo yako.", how: "Mwalike mshirika, shiriki mpango wako, na mkubaliane kukutana mara kwa mara.", get: "Mikutano ya mara kwa mara inayoweka maamuzi yako yakisonga mbele." },
    zh: { what: "通过与一位伙伴分享目标，帮助你保持正轨，由对方跟进你的进展。", how: "邀请伙伴，分享你的计划，并约定定期检查。", get: "定期检查，让你的决策持续推进。" },
  },
  journal: {
    en: { what: "A private place to write down the assumptions behind your decisions and check them later.", how: "Write each assumption when you make a decision, then mark whether it turned out to be true.", get: "Lessons from past decisions, so you learn faster next time." },
    fr: { what: "Un espace privé pour noter les hypothèses derrière vos décisions et les vérifier plus tard.", how: "Notez chaque hypothèse au moment de décider, puis indiquez si elle s'est avérée juste.", get: "Des leçons tirées des décisions passées, pour apprendre plus vite la prochaine fois." },
    es: { what: "Un espacio privado para anotar los supuestos detrás de tus decisiones y revisarlos después.", how: "Anota cada supuesto al tomar una decisión y luego indica si resultó ser cierto.", get: "Lecciones de decisiones pasadas, para aprender más rápido la próxima vez." },
    pt: { what: "Um espaço privado para anotar as suposições por trás das suas decisões e verificá-las depois.", how: "Anote cada suposição ao tomar uma decisão e depois marque se ela se confirmou.", get: "Lições de decisões passadas, para aprender mais rápido da próxima vez." },
    sw: { what: "Mahali pa faragha pa kuandika dhana zilizo nyuma ya maamuzi yako na kuzikagua baadaye.", how: "Andika kila dhana unapofanya uamuzi, kisha weka alama kama ilithibitika kuwa ya kweli.", get: "Mafunzo kutoka kwa maamuzi ya zamani, ili ujifunze haraka zaidi wakati mwingine." },
    zh: { what: "一个私密的地方，用来记录决策背后的假设，并在之后进行检验。", how: "做决策时记下每个假设，之后标记它是否成立。", get: "从过去的决策中吸取经验，让你下次学得更快。" },
  },
  vault: {
    en: { what: "Stores your saved decisions, finished plans and the lessons you learned.", how: "Open any decision or plan to review it, and read past lessons in the Lessons tab.", get: "A record of your decisions and what you learned from them." },
    fr: { what: "Conserve vos décisions enregistrées, vos plans terminés et les leçons apprises dans le Coffre.", how: "Ouvrez une décision ou un plan pour le revoir, et lisez les leçons dans l'onglet Leçons.", get: "Un historique de vos décisions et de ce que vous en avez appris." },
    es: { what: "Guarda tus decisiones, planes terminados y las lecciones aprendidas en la Bóveda.", how: "Abre una decisión o un plan para revisarlo, y lee las lecciones pasadas en la pestaña de Lecciones.", get: "Un registro de tus decisiones y de lo que aprendiste de ellas." },
    pt: { what: "Guarda suas decisões salvas, planos concluídos e as lições aprendidas no Cofre.", how: "Abra uma decisão ou um plano para revisá-lo e leia as lições anteriores na aba Lições.", get: "Um registro das suas decisões e do que você aprendeu com elas." },
    sw: { what: "Huhifadhi maamuzi yako uliyohifadhi, mipango iliyokamilika na mafunzo uliyojifunza katika Hazina.", how: "Fungua uamuzi au mpango wowote ili kuupitia, na usome mafunzo ya zamani kwenye kichupo cha Mafunzo.", get: "Rekodi ya maamuzi yako na ulichojifunza kutokana nayo." },
    zh: { what: "在决策保险库中保存你已保存的决策、已完成的计划以及你学到的经验。", how: "打开任一决策或计划进行回顾，并在“经验”标签中阅读过去的经验。", get: "你的决策记录，以及你从中学到的东西。" },
  },
};
