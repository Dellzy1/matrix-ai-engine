"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DecisionOption {
  id: string;
  title: string;
  tag: string;
  cost: number; // Stored as base numeric value
  timeCommitment: string;
  pros: string[];
  cons: string[];
  score: number;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "JPY", symbol: "¥", rate: 155 },
  { code: "INR", symbol: "₹", rate: 83 },
];

const LOCALIZATIONS: Record<string, Record<string, string>> = {
  en: { title: "MatrixAI Engine", subtitle: "Visual Option & Decision Comparison for Modern Teams & Creators", generate: "Generate Matrix ✨", analyzing: "Analyzing Matrix...", save: "Save to Cloud ☁️", print: "Print / Export PDF 📄", cost: "Est. Cost", time: "Time Commitment", pros: "Key Advantages", cons: "Trade-offs & Risks" },
  es: { title: "Motor MatrixAI", subtitle: "Comparación Visual de Opciones y Decisiones", generate: "Generar Matriz ✨", analyzing: "Analizando...", save: "Guardar en la Nube ☁️", print: "Imprimir / Exportar 📄", cost: "Costo Est.", time: "Tiempo Dedicado", pros: "Ventajas Clave", cons: "Riesgos y Desventajas" },
  fr: { title: "Moteur MatrixAI", subtitle: "Comparaison Visuelle d'Options et de Décisions", generate: "Générer la Matrice ✨", analyzing: "Analyse en cours...", save: "Sauvegarder ☁️", print: "Imprimer / Exporter 📄", cost: "Coût Est.", time: "Temps Requis", pros: "Avantages Clés", cons: "Inconvénients & Risques" },
  de: { title: "MatrixAI Engine", subtitle: "Visueller Entscheidungsvergleich für Teams", generate: "Matrix Generieren ✨", analyzing: "Analysiere...", save: "In Cloud Speichern ☁️", print: "Drucken / PDF 📄", cost: "Gesch. Kosten", time: "Zeitaufwand", pros: "Hauptvorteile", cons: "Nachteile & Risiken" },
  zh: { title: "MatrixAI 决策引擎", subtitle: "团队与创作者的视觉化决策对比工具", generate: "生成决策矩阵 ✨", analyzing: "正在分析...", save: "保存至云端 ☁️", print: "打印 / 导出 PDF 📄", cost: "预估成本", time: "时间投入", pros: "核心优势", cons: "权衡与风险" },
  ja: { title: "MatrixAI エンジン", subtitle: "チームとクリエイターのための視覚的意志決定比較", generate: "マトリックス生成 ✨", analyzing: "解析中...", save: "クラウドに保存 ☁️", print: "印刷 / PDF 📄", cost: "概算費用", time: "所要時間", pros: "主なメリット", cons: "リスクとデメリット" }
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Currency, Language, & Theme states
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [lang, setLang] = useState("en");
  const [darkMode, setDarkMode] = useState(true);

  const t = LOCALIZATIONS[lang] || LOCALIZATIONS.en;

  const [options, setOptions] = useState<DecisionOption[]>([
    {
      id: "opt-1",
      title: "Option A: React (Next.js)",
      tag: "High Scalability",
      cost: 50,
      timeCommitment: "15 hrs/wk",
      pros: ["Massive ecosystem & talent pool", "Great long-term enterprise viability", "Rich library support"],
      cons: ["Slightly steeper boilerplate", "Higher complexity"],
      score: 88,
    },
    {
      id: "opt-2",
      title: "Option B: Vue / Svelte",
      tag: "Rapid DX & Speed",
      cost: 20,
      timeCommitment: "10 hrs/wk",
      pros: ["Faster setup time & lean bundle", "Gentle learning curve", "High developer satisfaction"],
      cons: ["Smaller job market", "Fewer third-party UI packages"],
      score: 82,
    },
  ]);

  // Fetch the latest saved matrix on page load / client reload
  const fetchLastSavedMatrix = async () => {
    try {
      const { data, error } = await supabase
        .from("matrices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastSaved = data[0];
        setPrompt(lastSaved.query || "");
        if (lastSaved.options_data) {
          setOptions(lastSaved.options_data);
        }
        if (lastSaved.selected_option) {
          setSelectedOptionId(lastSaved.selected_option);
        }
        setSaveMessage("Loaded your last saved session! 🔄");
        setTimeout(() => setSaveMessage(""), 4000);
      }
    } catch (err: any) {
      console.error("Failed to load last matrix:", err.message);
    }
  };

  // Automatically fetch last saved search on page mount
  useEffect(() => {
    fetchLastSavedMatrix();
  }, []);

  // Handle Field Edits
  const handleOptionFieldChange = (id: string, field: "cost" | "timeCommitment", value: string | number) => {
    setOptions((prevOptions) =>
      prevOptions.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  // Smart dynamic generator that parses user input and creates tailored matrix results
  const handleGenerateMatrix = () => {
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Split by common delimiters like ' vs ', ' versus ', ' or ', or commas
      let parsedChoices = prompt
        .split(/vs|versus|\bor\b|,/i)
        .map((s) => s.replace(/should i choose|compare|which is better|what about/gi, "").trim())
        .filter(Boolean);

      const choiceA = parsedChoices[0] || "Primary Option";
      const choiceB = parsedChoices[1] || "Alternative Option";

      const isTech = /react|vue|svelte|node|python|aws|vercel|supabase|app|code|software/i.test(prompt);
      const isBusiness = /saas|agency|startup|business|marketing|revenue|product/i.test(prompt);

      setOptions([
        {
          id: "opt-1",
          title: `Option A: ${choiceA}`,
          tag: isTech ? "High Performance" : isBusiness ? "Scalable Revenue" : "Primary Approach",
          cost: isTech ? 45 : isBusiness ? 120 : 50,
          timeCommitment: isTech ? "15 hrs/wk" : "25 hrs/wk",
          pros: [
            `Directly addresses your goal regarding ${choiceA}`,
            isTech ? "Strong ecosystem and community backing" : "Proven track record in the market",
            "High growth ceiling with proper execution"
          ],
          cons: [
            isTech ? "Requires steeper initial technical setup" : "Demands consistent upfront capital",
            "Moderate ongoing maintenance overhead"
          ],
          score: Math.floor(Math.random() * 8) + 85,
        },
        {
          id: "opt-2",
          title: `Option B: ${choiceB}`,
          tag: isTech ? "Rapid Delivery" : isBusiness ? "Low Risk / Lean" : "Alternative Route",
          cost: isTech ? 20 : isBusiness ? 40 : 25,
          timeCommitment: isTech ? "10 hrs/wk" : "15 hrs/wk",
          pros: [
            `Faster turnaround time for ${choiceB}`,
            "Lower financial and resource risk upfront",
            "Simpler day-to-day management"
          ],
          cons: [
            isTech ? "Limited long-term customization ceiling" : "Slower path to aggressive scaling",
            "Fewer built-in advanced features"
          ],
          score: Math.floor(Math.random() * 8) + 75,
        },
      ]);

      setLoading(false);
    }, 700);
  };

  // Save to Supabase Cloud
  const handleSaveToCloud = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      const { data, error } = await supabase.from("matrices").insert([
        {
          query: prompt || "Custom Comparison Matrix",
          options_data: options,
          selected_option: selectedOptionId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSaveMessage("Saved to Cloud successfully! ☁️");
    } catch (err: any) {
      console.error(err);
      setSaveMessage(`Save failed: ${err.message || "Check Supabase connection"}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 4000);
    }
  };

  return (
    <main className={`min-h-screen p-6 md:p-12 font-sans transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Control Bar: Language, Currency, & Theme Switchers */}
        <div className={`flex flex-wrap justify-start items-center border p-3 rounded-xl gap-6 ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>🌐 Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className={`border rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 ${darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-100 border-slate-300 text-slate-800"}`}
            >
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className={`font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>💰 Currency:</span>
            <select
              value={currency.code}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className={`border rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 ${darkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-100 border-slate-300 text-slate-800"}`}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ml-auto ${darkMode ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"}`}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Header Section */}
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{t.subtitle}</p>
          </div>
          <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border ${darkMode ? "text-emerald-400 bg-emerald-950/50 border-emerald-800/60" : "text-emerald-700 bg-emerald-50 border-emerald-300"}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Model Active</span>
          </div>
        </header>

        {/* Input & Action Box */}
        <div className={`border rounded-xl p-5 shadow-xl backdrop-blur-sm ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-md"}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type any comparison (e.g., 'Should I choose React, Vue, or Svelte for my next startup?')..."
            className={`w-full border rounded-lg p-4 focus:outline-none focus:border-purple-500 transition-colors resize-none h-28 ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-200 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"}`}
          />
          <div className="flex flex-wrap justify-start items-center mt-4 gap-3">
            <button
              onClick={handleSaveToCloud}
              disabled={saving}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-md cursor-pointer"
            >
              {saving ? "Saving..." : t.save}
            </button>

            <button
              onClick={fetchLastSavedMatrix}
              className={`font-medium px-4 py-2 rounded-lg text-sm transition-all cursor-pointer border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"}`}
            >
              Load Last Search 🔄
            </button>

            <button
              onClick={() => window.print()}
              className={`font-medium px-4 py-2 rounded-lg text-sm transition-all cursor-pointer border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"}`}
            >
              {t.print}
            </button>

            <button
              onClick={handleGenerateMatrix}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-purple-900/30 flex items-center space-x-2 cursor-pointer ml-auto"
            >
              <span>{loading ? t.analyzing : t.generate}</span>
            </button>
          </div>

          {saveMessage && (
            <p className={`text-sm mt-3 font-medium ${saveMessage.includes("failed") ? "text-rose-400" : "text-emerald-400"}`}>
              {saveMessage}
            </p>
          )}
        </div>

        {/* Option Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const convertedCost = Math.round(option.cost * currency.rate);

            return (
              <div
                key={option.id}
                className={`border rounded-xl p-6 space-y-6 transition-all duration-200 ${
                  isSelected
                    ? darkMode
                      ? "border-purple-500 ring-2 ring-purple-500/30 shadow-2xl shadow-purple-900/20 bg-slate-900"
                      : "border-purple-500 ring-2 ring-purple-500/20 shadow-xl bg-purple-50/40"
                    : darkMode
                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                }`}
              >
                {/* Header & Badges */}
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${darkMode ? "bg-purple-950/80 text-purple-300 border-purple-800/60" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                    {option.tag}
                  </span>
                  <div className={`border rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"}`}>
                    <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Score: </span>
                    <span className="text-emerald-500 font-bold">{option.score}%</span>
                  </div>
                </div>

                <h2 className={`text-xl font-bold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{option.title}</h2>

                {/* Editable Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`border p-3 rounded-lg ${darkMode ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                    <label className={`text-xs block mb-1 font-medium ${darkMode ? "text-slate-500" : "text-slate-600"}`}>{t.cost}</label>
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm font-semibold ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{currency.symbol}</span>
                      <input
                        type="number"
                        value={convertedCost}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          handleOptionFieldChange(option.id, "cost", val / currency.rate);
                        }}
                        className={`bg-transparent font-semibold text-sm w-full focus:outline-none focus:border-b focus:border-purple-500 ${darkMode ? "text-slate-200" : "text-slate-900"}`}
                      />
                      <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-600"}`}>/mo</span>
                    </div>
                  </div>
                  <div className={`border p-3 rounded-lg ${darkMode ? "bg-slate-950/80 border-slate-800/80" : "bg-slate-50 border-slate-200"}`}>
                    <label className={`text-xs block mb-1 font-medium ${darkMode ? "text-slate-500" : "text-slate-600"}`}>{t.time}</label>
                    <input
                      type="text"
                      value={option.timeCommitment}
                      onChange={(e) => handleOptionFieldChange(option.id, "timeCommitment", e.target.value)}
                      className={`bg-transparent font-semibold text-sm w-full focus:outline-none focus:border-b focus:border-purple-500 ${darkMode ? "text-slate-200" : "text-slate-900"}`}
                    />
                  </div>
                </div>

                {/* Advantages */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500">{t.pros}</h3>
                  <ul className={`space-y-1 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {option.pros.map((pro, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trade-offs */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500">{t.cons}</h3>
                  <ul className={`space-y-1 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {option.cons.map((con, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Selection Button */}
                <button
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40"
                      : darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  }`}
                >
                  {isSelected ? "✓ Selected Option" : "Select This Option"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}