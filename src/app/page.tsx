import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  History,
  Sliders,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Trash2,
  UserCheck,
  UserX,
  Sun,
  Moon,
  Globe,
  DollarSign,
  X,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Search
} from "lucide-react";

// --- Currencies & Rates ---
const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "JPY", symbol: "¥", rate: 155 },
  { code: "INR", symbol: "₹", rate: 83 },
];

// --- Multi-Language Dictionary ---
const LOCALIZATIONS = {
  en: {
    title: "MatrixAI Engine",
    subtitle: "Enterprise Decision Matrix & Multi-Option Comparison Engine",
    generate: "Generate Matrix ✨",
    analyzing: "Analyzing Options...",
    save: "Save Session ☁️",
    export: "Export Workspace 📥",
    history: "Saved History 📜",
    weights: "Criteria Weights ⚙️",
    cost: "Est. Cost",
    time: "Time / Commitment",
    pros: "Key Advantages",
    cons: "Trade-offs & Risks",
    publicMode: "Public Workspace",
    userMode: "Pro Account Session",
    optionsCount: "Compared Options",
    weightedScore: "Weighted Score",
  },
  es: {
    title: "Motor MatrixAI",
    subtitle: "Plataforma Empresarial para la Comparación Visual de Opciones",
    generate: "Generar Matriz ✨",
    analyzing: "Analizando opciones...",
    save: "Guardar Sesión ☁️",
    export: "Exportar 📥",
    history: "Historial 📜",
    weights: "Ponderaciones ⚙️",
    cost: "Costo Est.",
    time: "Tiempo / Compromiso",
    pros: "Ventajas Clave",
    cons: "Riesgos y Desventajas",
    publicMode: "Modo Público",
    userMode: "Cuenta Pro",
    optionsCount: "Opciones Comparadas",
    weightedScore: "Puntaje Ponderado",
  },
  fr: {
    title: "Moteur MatrixAI",
    subtitle: "Plateforme d'Aide à la Décision et Comparaison Multi-Options",
    generate: "Générer la Matrice ✨",
    analyzing: "Analyse en cours...",
    save: "Sauvegarder ☁️",
    export: "Exporter 📥",
    history: "Historique 📜",
    weights: "Pondération ⚙️",
    cost: "Coût Est.",
    time: "Temps Requis",
    pros: "Avantages Clés",
    cons: "Inconvénients & Risques",
    publicMode: "Mode Public",
    userMode: "Compte Pro",
    optionsCount: "Options Comparées",
    weightedScore: "Score Pondéré",
  },
  de: {
    title: "MatrixAI Engine",
    subtitle: "Visueller Entscheidungsvergleich für Unternehmens-Teams",
    generate: "Matrix Generieren ✨",
    analyzing: "Analysiere Optionen...",
    save: "Speichern ☁️",
    export: "Exportieren 📥",
    history: "Verlauf 📜",
    weights: "Gewichtung ⚙️",
    cost: "Gesch. Kosten",
    time: "Zeitaufwand",
    pros: "Hauptvorteile",
    cons: "Nachteile & Risiken",
    publicMode: "Öffentlich",
    userMode: "Pro-Konto Session",
    optionsCount: "Verglichene Optionen",
    weightedScore: "Gewichtete Punktzahl",
  },
  zh: {
    title: "MatrixAI 决策引擎",
    subtitle: "现代团队与企业的多维视觉化决策对比工具",
    generate: "生成决策矩阵 ✨",
    analyzing: "正在分析框架...",
    save: "保存会话 ☁️",
    export: "导出工作区 📥",
    history: "历史记录 📜",
    weights: "标准权重 ⚙️",
    cost: "预估成本",
    time: "时间投入",
    pros: "核心优势",
    cons: "权衡与风险",
    publicMode: "公共模式",
    userMode: "专业版账号",
    optionsCount: "对比项数量",
    weightedScore: "加权综合得分",
  },
  ja: {
    title: "MatrixAI エンジン",
    subtitle: "企業チームとクリエイターのための多角的意思決定エンジン",
    generate: "マトリックス生成 ✨",
    analyzing: "解析中...",
    save: "クラウド保存 ☁️",
    export: "エクスポート 📥",
    history: "保存履歴 📜",
    weights: "評価重み ⚙️",
    cost: "概算費用",
    time: "所要時間",
    pros: "主なメリット",
    cons: "リスクとデメリット",
    publicMode: "パブリック",
    userMode: "Pro アカウント",
    optionsCount: "比較オプション数",
    weightedScore: "加重スコア",
  },
};

// --- Initial Preset Real Estate Data ---
const REAL_ESTATE_DEFAULT_OPTIONS = [
  {
    id: "opt-1",
    title: "Option A: Buying a Home",
    tag: "Equity Building",
    cost: 2500,
    timeCommitment: "Long-term (15-30 yrs)",
    pros: ["Builds wealth & equity over time", "Full freedom for customization", "Predictable fixed mortgage payments"],
    cons: ["High upfront down payment & closing costs", "Responsible for maintenance & repairs"],
    baseScores: { costScore: 72, timeScore: 68, performanceScore: 92, dxScore: 85 },
  },
  {
    id: "opt-2",
    title: "Option B: Renting a Home",
    tag: "Maximum Flexibility",
    cost: 1800,
    timeCommitment: "1-Year Leases",
    pros: ["Zero property maintenance overhead", "High liquidity & flexibility to relocate", "Lower capital requirements upfront"],
    cons: ["No home equity accumulation", "Subject to annual rent increases"],
    baseScores: { costScore: 88, timeScore: 92, performanceScore: 70, dxScore: 90 },
  },
  {
    id: "opt-3",
    title: "Option C: Commercial Real Estate",
    tag: "Cash Flow & Yield",
    cost: 4500,
    timeCommitment: "Multi-Year Business Leases",
    pros: ["High potential rental yield & cash flow", "Triple Net Lease (NNN) opportunities", "Strong asset appreciation potential"],
    cons: ["Higher market dependency & vacancy risks", "Complex management & lease negotiations"],
    baseScores: { costScore: 60, timeScore: 62, performanceScore: 95, dxScore: 78 },
  },
];

export default function App() {
  // App Core States
  const [prompt, setPrompt] = useState("Buying a Home vs Renting vs Commercial Real Estate");
  const [options, setOptions] = useState(REAL_ESTATE_DEFAULT_OPTIONS);
  const [selectedOptionId, setSelectedOptionId] = useState("opt-1");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // System Controls
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // History Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedHistory, setSavedHistory] = useState([
    {
      id: "hist-101",
      query: "Buying a Home vs Renting vs Commercial Real Estate",
      optionsCount: 3,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      userEmail: "alex.dev@matrixai.io",
      optionsData: REAL_ESTATE_DEFAULT_OPTIONS,
      selectedOptionId: "opt-1",
    },
    {
      id: "hist-102",
      query: "Bootstrapping vs VC Funding vs Revenue Based Financing",
      optionsCount: 3,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      userEmail: "alex.dev@matrixai.io",
      optionsData: [
        {
          id: "opt-a",
          title: "Option A: Bootstrapping",
          tag: "100% Equity Retention",
          cost: 500,
          timeCommitment: "20 hrs/wk",
          pros: ["Full ownership and strategic control", "Disciplined profitability focus", "No investor pressure"],
          cons: ["Slower initial scaling speed", "Personal financial risk burden"],
          baseScores: { costScore: 90, timeScore: 80, performanceScore: 75, dxScore: 88 },
        },
        {
          id: "opt-b",
          title: "Option B: VC Funding",
          tag: "Hyper Growth",
          cost: 0,
          timeCommitment: "40 hrs/wk",
          pros: ["Massive capital injection", "Investor network and advice", "Aggressive market capture"],
          cons: ["Equity dilution", "High board pressure and loss of control"],
          baseScores: { costScore: 65, timeScore: 60, performanceScore: 98, dxScore: 70 },
        },
      ],
      selectedOptionId: "opt-a",
    },
  ]);
  const [historySearchTerm, setHistorySearchTerm] = useState("");

  // Criteria Weights Sliders State
  const [weightsOpen, setWeightsOpen] = useState(false);
  const [criteriaWeights, setCriteriaWeights] = useState({
    cost: 25,
    time: 25,
    performance: 25,
    dx: 25,
  });

  // User Auth Simulation State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const userAccount = {
    name: "Alex Rivera",
    email: "alex.dev@matrixai.io",
    role: "Senior Solutions Architect",
    plan: "Pro Tier",
  };

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const t = LOCALIZATIONS[lang] || LOCALIZATIONS.en;

  // --- Dynamic Recalculation Engine based on Sliders ---
  const calculatedOptions = useMemo(() => {
    const totalWeight =
      criteriaWeights.cost +
      criteriaWeights.time +
      criteriaWeights.performance +
      criteriaWeights.dx || 1;

    return options.map((opt) => {
      const weightedSum =
        opt.baseScores.costScore * (criteriaWeights.cost / totalWeight) +
        opt.baseScores.timeScore * (criteriaWeights.time / totalWeight) +
        opt.baseScores.performanceScore * (criteriaWeights.performance / totalWeight) +
        opt.baseScores.dxScore * (criteriaWeights.dx / totalWeight);

      return {
        ...opt,
        calculatedScore: Math.round(weightedSum),
      };
    });
  }, [options, criteriaWeights]);

  // Filter history based on Auth State and Search filter
  const filteredHistory = useMemo(() => {
    return savedHistory.filter((item) => {
      const matchesUser = isAuthenticated ? item.userEmail === userAccount.email : true;
      const matchesSearch = item.query.toLowerCase().includes(historySearchTerm.toLowerCase());
      return matchesUser && matchesSearch;
    });
  }, [savedHistory, isAuthenticated, userAccount.email, historySearchTerm]);

  // --- Multi-Option Prompt Parsing Logic (Supports 2, 3, or 4 options) ---
  const handleGenerateMatrix = () => {
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      let rawSegments = prompt
        .split(/vs|versus|\bor\b|,/i)
        .map((s) => s.replace(/should i choose|compare|which is better|what about/gi, "").trim())
        .filter(Boolean);

      if (rawSegments.length < 2) {
        rawSegments = [prompt.trim(), "Alternative Option"];
      }

      const choices = rawSegments.slice(0, 4);

      const isRealEstate = /home|house|rent|buying|property|mortgage|real estate|commercial/i.test(prompt);
      const isTech = /react|vue|svelte|angular|node|python|aws|cloudflare|supabase|docker/i.test(prompt);
      const isBusiness = /saas|agency|marketing|startup|business|pricing|hire|funding/i.test(prompt);

      const generated = choices.map((choice, index) => {
        const charCode = String.fromCharCode(65 + index); // A, B, C, D
        return {
          id: `opt-${Date.now()}-${index}`,
          title: `Option ${charCode}: ${choice}`,
          tag: isRealEstate
            ? index === 0
              ? "Equity Accumulation"
              : index === 1
              ? "Flexibility & Liquidity"
              : index === 2
              ? "Yield & Cash Flow"
              : "Alternative Asset"
            : isTech
            ? index === 0
              ? "Enterprise Leader"
              : "Rapid Development"
            : index === 0
            ? "Primary Strategy"
            : "Lean Execution",
          cost: isRealEstate
            ? index === 0
              ? 2500
              : index === 1
              ? 1800
              : index === 2
              ? 4500
              : 3000
            : isTech
            ? Math.floor(Math.random() * 40) + 20
            : Math.floor(Math.random() * 100) + 50,
          timeCommitment: isRealEstate
            ? index === 1
              ? "1-Year Lease"
              : "Long-term (5-15+ yrs)"
            : `${Math.floor(Math.random() * 15) + 5} hrs/wk`,
          pros: [
            `Directly optimized strategy for ${choice}`,
            isRealEstate
              ? index === 0
                ? "Builds long-term ownership equity"
                : index === 1
                ? "Zero maintenance and repair responsibilities"
                : "High potential income yield"
              : isTech
              ? "Strong developer ecosystem and community support"
              : "High growth potential and scalability",
            "Clear execution path with defined milestones",
          ],
          cons: [
            isRealEstate
              ? index === 0
                ? "Substantial upfront capital requirement"
                : index === 1
                ? "No equity accumulation over time"
                : "Tenant management and market occupancy risk"
              : "Requires ongoing operational overhead",
            "Market volatility risk factor",
          ],
          baseScores: {
            costScore: Math.floor(Math.random() * 25) + 70,
            timeScore: Math.floor(Math.random() * 25) + 70,
            performanceScore: Math.floor(Math.random() * 20) + 80,
            dxScore: Math.floor(Math.random() * 20) + 78,
          },
        };
      });

      setOptions(generated);
      setSelectedOptionId(generated[0]?.id || null);
      setLoading(false);
      setStatusMessage("Generated new multi-option matrix!");
      setTimeout(() => setStatusMessage(""), 3000);
    }, 600);
  };

  // --- Save Session to History ---
  const handleSaveToHistory = () => {
    const newEntry = {
      id: `hist-${Date.now()}`,
      query: prompt || "Custom Comparison Matrix",
      optionsCount: options.length,
      createdAt: new Date().toISOString(),
      userEmail: isAuthenticated ? userAccount.email : "guest@public.workspace",
      optionsData: options,
      selectedOptionId: selectedOptionId,
    };

    setSavedHistory((prev) => [newEntry, ...prev]);
    setStatusMessage("Saved session to cloud workspace! ☁️");
    setTimeout(() => setStatusMessage(""), 3500);
  };

  // --- Restore Session from History ---
  const handleLoadHistorySession = (item) => {
    setPrompt(item.query);
    setOptions(item.optionsData);
    if (item.selectedOptionId) {
      setSelectedOptionId(item.selectedOptionId);
    }
    setSidebarOpen(false);
    setStatusMessage(`Restored matrix session: "${item.query}"`);
    setTimeout(() => setStatusMessage(""), 3500);
  };

  // --- Delete History Entry ---
  const handleDeleteHistorySession = (id, e) => {
    e.stopPropagation();
    setSavedHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Export Utilities ---
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Option,Tag,Cost,Time,Score,Pros,Cons\n";
    calculatedOptions.forEach((opt) => {
      const prosStr = `"${opt.pros.join("; ")}"`;
      const consStr = `"${opt.cons.join("; ")}"`;
      csvContent += `"${opt.title}","${opt.tag}",${opt.cost},"${opt.timeCommitment}",${opt.calculatedScore}%,${prosStr},${consStr}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MatrixAI_Evaluation_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMarkdown = () => {
    let mdContent = `# MatrixAI Decision Evaluation Report\n\n`;
    mdContent += `**Query / Context:** ${prompt}\n`;
    mdContent += `**Generated Date:** ${new Date().toLocaleDateString()}\n`;
    mdContent += `**Evaluated Options:** ${calculatedOptions.length}\n\n`;
    mdContent += `| Option | Tag | Est Cost/mo | Time Commitment | Weighted Score |\n`;
    mdContent += `|---|---|---|---|---|\n`;

    calculatedOptions.forEach((opt) => {
      mdContent += `| ${opt.title} | ${opt.tag} | ${currency.symbol}${Math.round(opt.cost * currency.rate)} | ${opt.timeCommitment} | **${opt.calculatedScore}%** |\n`;
    });

    mdContent += `\n\n## Detailed Breakdowns\n\n`;
    calculatedOptions.forEach((opt) => {
      mdContent += `### ${opt.title}\n`;
      mdContent += `- **Tag:** ${opt.tag}\n`;
      mdContent += `- **Key Advantages:**\n`;
      opt.pros.forEach((p) => (mdContent += `  - ✓ ${p}\n`));
      mdContent += `- **Trade-offs:**\n`;
      opt.cons.forEach((c) => (mdContent += `  - ✕ ${c}\n`));
      mdContent += `\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MatrixAI_${prompt.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* ---------------- TOP NAVBAR & UTILITIES ---------------- */}
      <nav className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors ${darkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
                MatrixAI
              </span>
              <span className="text-xs ml-1 font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                PRO 3.5
              </span>
            </div>
          </div>

          {/* Center Utility Controls */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-medium">
            {/* Language Switcher */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="en" className={darkMode ? "bg-slate-900" : "bg-white"}>English (US)</option>
                <option value="es" className={darkMode ? "bg-slate-900" : "bg-white"}>Español</option>
                <option value="fr" className={darkMode ? "bg-slate-900" : "bg-white"}>Français</option>
                <option value="de" className={darkMode ? "bg-slate-900" : "bg-white"}>Deutsch</option>
                <option value="zh" className={darkMode ? "bg-slate-900" : "bg-white"}>中文</option>
                <option value="ja" className={darkMode ? "bg-slate-900" : "bg-white"}>日本語</option>
              </select>
            </div>

            {/* Currency Switcher */}
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={currency.code}
                onChange={(e) => {
                  const found = CURRENCIES.find((c) => c.code === e.target.value);
                  if (found) setCurrency(found);
                }}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className={darkMode ? "bg-slate-900" : "bg-white"}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Criteria Weights Drawer Toggle */}
            <button
              onClick={() => setWeightsOpen(!weightsOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                weightsOpen
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/40"
                  : darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Weights & Criteria</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* History Drawer Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-purple-300 hover:bg-slate-800"
                  : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <History className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">{t.history}</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-purple-500/20 text-purple-300">
                {filteredHistory.length}
              </span>
            </button>

            {/* Simulated Auth User Switcher Toggle */}
            <button
              onClick={() => setIsAuthenticated(!isAuthenticated)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isAuthenticated
                  ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                  : darkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
              title="Toggle Authentication Mode"
            >
              {isAuthenticated ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline font-semibold">{userAccount.name}</span>
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden md:inline">Public Guest</span>
                </>
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------- MAIN CONTAINER ---------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Hero Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className={`text-sm mt-1 max-w-2xl ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              {t.subtitle}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className={`flex items-center space-x-4 px-4 py-2 rounded-xl border text-xs font-semibold ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <div>
              <span className={darkMode ? "text-slate-500" : "text-slate-400"}>Options: </span>
              <span className="text-purple-400 font-bold">{options.length} Active</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div>
              <span className={darkMode ? "text-slate-500" : "text-slate-400"}>Mode: </span>
              <span className={isAuthenticated ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isAuthenticated ? t.userMode : t.publicMode}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------- PROMPT INPUT & CONTROL PANEL ---------------- */}
        <div className={`border rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-lg"}`}>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type any multi-option comparison (e.g. 'Buying a Home vs Renting vs Commercial Real Estate')..."
              className={`w-full border rounded-xl p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none h-28 ${
                darkMode
                  ? "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            
            {/* Real Estate & Multi-Domain Helper Tip */}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center space-x-1.5 text-purple-400 font-medium">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Tip: Separate up to 4 choices using <strong>"vs"</strong>, <strong>"or"</strong>, or <strong>commas</strong>.</span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Example: <em>Buying a Home vs Renting vs Commercial Real Estate</em>
              </span>
            </div>
          </div>

          {/* Left-Aligned Control Toolbar */}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToHistory}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <span>{t.save}</span>
              </button>

              <button
                onClick={() => setExportModalOpen(true)}
                className={`font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border flex items-center space-x-1.5 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.export}</span>
              </button>

              <button
                onClick={() => setWeightsOpen(!weightsOpen)}
                className={`font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border flex items-center space-x-1.5 lg:hidden ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Weights</span>
              </button>
            </div>

            {/* Primary Action Button (Right Aligned) */}
            <button
              onClick={handleGenerateMatrix}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-purple-900/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50 ml-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? t.analyzing : t.generate}</span>
            </button>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* ---------------- WEIGHTS SLIDER DRAWER PANEL (TOGGLEABLE) ---------------- */}
        {weightsOpen && (
          <div className={`border rounded-2xl p-6 transition-all space-y-4 ${darkMode ? "bg-slate-900/90 border-purple-500/30" : "bg-purple-50/50 border-purple-200"}`}>
            <div className="flex justify-between items-center border-b pb-3 border-purple-500/20">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm sm:text-base">Custom Criteria Weights Customization</h3>
              </div>
              <button
                onClick={() => setWeightsOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                Close Panel ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Adjust sliders to prioritize factors. Option scores automatically recalculate in real-time based on your custom criteria balance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400">Cost Priority</span>
                  <span>{criteriaWeights.cost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteriaWeights.cost}
                  onChange={(e) => setCriteriaWeights({ ...criteriaWeights, cost: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-400">Time / Velocity</span>
                  <span>{criteriaWeights.time}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteriaWeights.time}
                  onChange={(e) => setCriteriaWeights({ ...criteriaWeights, time: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-400">Performance / Scale</span>
                  <span>{criteriaWeights.performance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteriaWeights.performance}
                  onChange={(e) => setCriteriaWeights({ ...criteriaWeights, performance: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-purple-400">Developer DX / Usability</span>
                  <span>{criteriaWeights.dx}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criteriaWeights.dx}
                  onChange={(e) => setCriteriaWeights({ ...criteriaWeights, dx: Number(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MULTI-OPTION COMPARISON GRID ---------------- */}
        <div
          className={`grid gap-6 ${
            calculatedOptions.length === 1
              ? "grid-cols-1 max-w-xl mx-auto"
              : calculatedOptions.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : calculatedOptions.length === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {calculatedOptions.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const convertedCost = Math.round(option.cost * currency.rate);

            return (
              <div
                key={option.id}
                className={`border rounded-2xl p-6 space-y-6 transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? darkMode
                      ? "border-purple-500 ring-2 ring-purple-500/30 shadow-2xl shadow-purple-950/50 bg-slate-900"
                      : "border-purple-500 ring-2 ring-purple-500/20 shadow-xl bg-purple-50/40"
                    : darkMode
                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                }`}
              >
                <div className="space-y-5">
                  {/* Option Tag & Weighted Score Badge */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${darkMode ? "bg-purple-950/80 text-purple-300 border-purple-800/60" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                      {option.tag}
                    </span>
                    <div className={`border rounded-full px-3 py-1 text-xs font-bold ${darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
                      <span className={darkMode ? "text-slate-500" : "text-slate-400"}>Score: </span>
                      <span className="text-emerald-400 font-extrabold">{option.calculatedScore}%</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                    {option.title}
                  </h2>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className={`border p-2.5 rounded-xl ${darkMode ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                      <label className={`text-[10px] uppercase tracking-wider block font-bold mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                        {t.cost}
                      </label>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                          {currency.symbol}
                        </span>
                        <input
                          type="number"
                          value={convertedCost}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setOptions((prev) =>
                              prev.map((o) => (o.id === option.id ? { ...o, cost: val / currency.rate } : o))
                            );
                          }}
                          className={`bg-transparent font-bold text-sm w-full focus:outline-none focus:border-b focus:border-purple-500 ${darkMode ? "text-slate-100" : "text-slate-900"}`}
                        />
                        <span className="text-[10px] text-slate-500">/mo</span>
                      </div>
                    </div>

                    <div className={`border p-2.5 rounded-xl ${darkMode ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                      <label className={`text-[10px] uppercase tracking-wider block font-bold mb-0.5 ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                        {t.time}
                      </label>
                      <input
                        type="text"
                        value={option.timeCommitment}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOptions((prev) =>
                            prev.map((o) => (o.id === option.id ? { ...o, timeCommitment: val } : o))
                          );
                        }}
                        className={`bg-transparent font-bold text-sm w-full focus:outline-none focus:border-b focus:border-purple-500 ${darkMode ? "text-slate-100" : "text-slate-900"}`}
                      />
                    </div>
                  </div>

                  {/* Advantages list */}
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                      <span>{t.pros}</span>
                    </h3>
                    <ul className={`space-y-1.5 text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {option.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons list */}
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                      <span>{t.cons}</span>
                    </h3>
                    <ul className={`space-y-1.5 text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {option.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-rose-400 font-bold shrink-0">✕</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Selection Action Button */}
                <button
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer mt-4 ${
                    isSelected
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40"
                      : darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`}
                >
                  {isSelected ? "✓ Selected Winner" : "Select Option"}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* ---------------- FEATURE 1: HISTORY SIDEBAR DRAWER ---------------- */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className={`relative w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l z-10 ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b pb-4 border-slate-800">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-purple-400" />
                  <h2 className="font-bold text-lg">Evaluation Workspace History</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search saved evaluations..."
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-purple-500 ${
                    darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                <span className="text-slate-400">User Scope:</span>
                <span className="font-semibold text-purple-400">
                  {isAuthenticated ? userAccount.email : "Public Guest Mode"}
                </span>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No saved evaluation history found for this session.
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistorySession(item)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex justify-between items-start ${
                        darkMode
                          ? "bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-950"
                          : "bg-slate-50 border-slate-200 hover:border-purple-400 hover:bg-purple-50/30"
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs sm:text-sm line-clamp-1">{item.query}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="text-purple-400 font-semibold">{item.optionsCount} Options</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteHistorySession(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t pt-4 border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                MatrixAI Engine Cloud Data Isolation Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FEATURE 5: PROFESSIONAL EXPORT PREVIEW MODAL ---------------- */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setExportModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 z-10 space-y-6 border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
            <div className="flex justify-between items-center border-b pb-4 border-slate-800">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg">Export Workspace Evaluation</h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Download your structured evaluation in various professional formats for client delivery or team review:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={downloadCSV}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20"
                      : "bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50"
                  }`}
                >
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  <h4 className="font-bold text-xs sm:text-sm">CSV Spreadsheet</h4>
                  <p className="text-[10px] text-slate-500">Excel or Google Sheets data row structure.</p>
                </button>

                <button
                  onClick={downloadMarkdown}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20"
                      : "bg-slate-50 border-slate-200 hover:border-purple-500 hover:bg-purple-50"
                  }`}
                >
                  <FileText className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-xs sm:text-sm">Markdown Document</h4>
                  <p className="text-[10px] text-slate-500">Formatted markdown for Notion, GitHub, or Jira.</p>
                </button>

                <button
                  onClick={() => window.print()}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                    darkMode
                      ? "bg-slate-950 border-slate-800 hover:border-blue-500/60 hover:bg-blue-950/20"
                      : "bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <Printer className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-xs sm:text-sm">Print / PDF Report</h4>
                  <p className="text-[10px] text-slate-500">Clean print preview stylesheet output.</p>
                </button>
              </div>
            </div>

            <div className="flex justify-end border-t pt-4 border-slate-800">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}