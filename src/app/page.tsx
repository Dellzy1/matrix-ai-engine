"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Sparkles,
  History,
  Sliders,
  Sun,
  Moon,
  DollarSign,
  X,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Search,
  ArrowLeft,
  Save,
  Lock,
  LogOut,
  UserCheck,
  Share2,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CURRENCIES: Record<string, { code: string; symbol: string; rate: number }> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79 },
  JPY: { code: "JPY", symbol: "¥", rate: 155.0 },
  CAD: { code: "CAD", symbol: "C$", rate: 1.36 },
};

export default function App() {
  const [currency, setCurrency] = useState<string>("USD");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");

  const [viewState, setViewState] = useState<"landing" | "input" | "results">("landing");
  const [promptInput, setPromptInput] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showWeightsModal, setShowWeightsModal] = useState<boolean>(false);
  const [reminderSet, setReminderSet] = useState<boolean>(false);
  const [shareNotification, setShareNotification] = useState<string>("");
  const [selectedWinnerIndex, setSelectedWinnerIndex] = useState<number>(0);

  const [weights, setWeights] = useState({
    cost: 30,
    feasibility: 25,
    impact: 25,
    risk: 20,
  });

  const [evaluatedOptions, setEvaluatedOptions] = useState<any[]>([]);
  const [savedMatrices, setSavedMatrices] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    async function fetchMatrices() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("matrices").select("*").order("created_at", { ascending: false });
        if (data && !error) setSavedMatrices(data);
      } catch (err) {
        console.error("Error fetching matrices:", err);
      }
    }
    fetchMatrices();
  }, []);

  const handleGenerateMatrix = () => {
    if (!promptInput.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const rawOptions = promptInput.split(/vs|or|,/i).map((s) => s.trim()).filter(Boolean);
      const optionsList = rawOptions.length > 0 ? rawOptions.slice(0, 4) : ["Primary Choice", "Secondary Alternative", "Exploratory Path"];

      const calculated = optionsList.map((name, index) => {
        const costVal = Math.floor(1200 + index * 850 + Math.random() * 400);
        const feasibilityScore = Math.max(50, Math.min(95, 90 - index * 12 + Math.floor(Math.random() * 10)));
        const impactScore = Math.max(55, Math.min(98, 85 - index * 10 + Math.floor(Math.random() * 15)));
        const riskScore = Math.max(20, Math.min(80, 40 + index * 15));

        const totalScore = Math.round(
          (feasibilityScore * weights.feasibility +
            impactScore * weights.impact +
            (100 - riskScore) * weights.risk +
            (costVal < 3000 ? 90 : 60) * weights.cost) /
            (weights.cost + weights.feasibility + weights.impact + weights.risk || 1)
        );

        return {
          name,
          cost: Math.round(costVal * CURRENCIES[currency].rate),
          timeline: index === 0 ? "Short-term (3 mo)" : index === 1 ? "Medium-term (6 mo)" : "Long-term (1 yr)",
          feasibility: feasibilityScore,
          impact: impactScore,
          risk: riskScore,
          score: totalScore,
          advantages: [
            index === 0 ? "High execution predictability" : "Optimized resource distribution",
            index === 0 ? "Strong alignment with core objectives" : "Scalable growth framework",
          ],
          risks: [index === 0 ? "Upfront capital requirement" : "Higher execution complexity"],
        };
      });

      calculated.sort((a, b) => b.score - a.score);
      setEvaluatedOptions(calculated);
      setSelectedWinnerIndex(0);
      setIsAnalyzing(false);
      setViewState("results");
    }, 1000);
  };

  const biasInsight = useMemo(() => {
    if (weights.cost > 60) return "⚠️ Bias Warning: Cost is weighted heavily (>60%), which may undervalue long-term strategic growth.";
    if (weights.risk > 50) return "⚠️ Bias Warning: High risk aversion detected. The engine may favor safer options.";
    if (weights.impact > 60) return "💡 Insight: High strategic impact focus selected. Prioritizing upside potential.";
    return "✅ Balanced weighting profile detected across all strategic decision pillars.";
  }, [weights]);

  const handleSaveToSupabase = async () => {
    if (!supabase) {
      setSaveStatus("Supabase not connected");
      return;
    }
    try {
      const newEntry = {
        title: promptInput || "Untitled Decision Matrix",
        weights,
        options: evaluatedOptions,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from("matrices").insert([newEntry]).select();
      if (error) throw error;
      if (data) {
        setSavedMatrices([data[0], ...savedMatrices]);
        setSaveStatus("Saved to Cloud!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (err: any) {
      setSaveStatus("Save failed.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const filteredMatrices = savedMatrices.filter((m) =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <header className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-xl cursor-pointer" onClick={() => setViewState("landing")}>MatrixAI Engine</h1>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">PRO 3.5</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-100 border-slate-300 text-slate-800"} border text-sm rounded px-2 py-1`}
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-700"} border`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300">
              <UserCheck className="w-4 h-4" /> {user.email}
              <button onClick={() => setUser(null)} className="ml-2 hover:text-white"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In
            </button>
          )}
        </div>
      </header>

      <div className="flex">
        {isSidebarOpen && (
          <aside className={`w-72 border-r ${theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 min-h-[calc(100vh-65px)] flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-slate-400">Saved History</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-100 border-slate-300 text-slate-900"} border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500`}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center mt-8">No saved matrices yet.</p>
              ) : (
                filteredMatrices.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPromptInput(item.title);
                      if (item.options) setEvaluatedOptions(item.options);
                      setViewState("results");
                    }}
                    className={`p-3 rounded-lg border ${theme === "dark" ? "border-slate-800 bg-slate-900/60 hover:border-indigo-500" : "border-slate-200 bg-slate-50 hover:border-indigo-400"} cursor-pointer transition text-sm`}
                  >
                    <p className="font-medium truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 p-8">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition">
              <History className="w-4 h-4" /> Open Saved History
            </button>
          )}

          {viewState === "landing" && (
            <div className="max-w-3xl mx-auto text-center space-y-6 pt-12">
              <h2 className="text-4xl font-extrabold tracking-tight">AI-Driven Decision Analysis & Evaluation Matrix</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base">
                Evaluate decisions, assign weights, run scoring algorithms, and eliminate cognitive bias in real-time.
              </p>

              <div className="pt-6 flex justify-center gap-4">
                <button onClick={() => setViewState("input")} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-xl shadow-lg transition">
                  <Sparkles className="w-5 h-5" /> Generate Matrix
                </button>
                <button onClick={() => setShowWeightsModal(true)} className={`flex items-center gap-2 ${theme === "dark" ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200" : "bg-white border-slate-300 hover:bg-slate-100 text-slate-800"} border font-medium px-6 py-4 rounded-xl transition`}>
                  <Sliders className="w-5 h-5" /> Configure Weights
                </button>
              </div>
            </div>
          )}

          {viewState === "input" && (
            <div className="max-w-2xl mx-auto space-y-6 pt-8">
              <button onClick={() => setViewState("landing")} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              <div className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"} shadow-xl space-y-4`}>
                <label className="block text-sm font-semibold">Enter choices or dilemma to evaluate:</label>
                <textarea
                  rows={4}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Buying a Home vs Renting vs Commercial Real Estate"
                  className={`w-full ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"} border rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500`}
                />
                <p className="text-xs text-slate-500">Tip: Separate choices using "vs", "or", or commas.</p>

                <div className="flex justify-between items-center pt-4">
                  <button onClick={() => setShowWeightsModal(true)} className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:underline">
                    <Sliders className="w-4 h-4" /> Weights: Cost({weights.cost}%), Feas({weights.feasibility}%)
                  </button>

                  <button
                    onClick={handleGenerateMatrix}
                    disabled={isAnalyzing || !promptInput.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" /> {isAnalyzing ? "Running Scoring Engine..." : "Generate Matrix"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {viewState === "results" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <button onClick={() => setViewState("input")} className="flex items-center gap-1 text-xs text-indigo-400 hover:underline mb-1">
                    <ArrowLeft className="w-3 h-3" /> Edit Prompt
                  </button>
                  <h2 className="text-2xl font-bold">{promptInput || "Decision Analysis Matrix"}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setReminderSet(true);
                      setTimeout(() => setReminderSet(false), 4000);
                    }}
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition ${reminderSet ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-900 border-slate-700 text-slate-300"}`}
                  >
                    <Bell className="w-3.5 h-3.5" /> {reminderSet ? "Reminder Set (30 Days)" : "Set Check-in Reminder"}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShareNotification("Link copied!");
                      setTimeout(() => setShareNotification(""), 3000);
                    }}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Card
                  </button>

                  <button onClick={handleSaveToSupabase} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  {saveStatus && <span className="text-xs text-emerald-400 font-medium">{saveStatus}</span>}
                  {shareNotification && <span className="text-xs text-indigo-400 font-medium">{shareNotification}</span>}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-indigo-950/30 border-indigo-800/50 text-indigo-200" : "bg-indigo-50 border-indigo-200 text-indigo-900"} text-sm flex items-center gap-3`}>
                <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{biasInsight}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {evaluatedOptions.map((opt, idx) => {
                  const isSelected = selectedWinnerIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border-2 ${isSelected ? "border-indigo-500 bg-indigo-950/20 shadow-indigo-500/10" : "border-slate-800 " + (theme === "dark" ? "bg-slate-900/80" : "bg-white")} shadow-xl relative flex flex-col justify-between space-y-4`}
                    >
                      <div className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-full">
                        Score: {opt.score}%
                      </div>
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                          {isSelected ? "⭐ Recommended Winner" : `Option ${String.fromCharCode(65 + idx)}`}
                        </span>
                        <h3 className="text-lg font-bold mt-1">{opt.name}</h3>
                        <div className="mt-4 flex gap-4">
                          <div className="bg-slate-800/50 p-3 rounded-xl flex-1 border border-slate-700/50">
                            <span className="text-[10px] uppercase text-slate-400 block">Est. Cost</span>
                            <span className="text-base font-bold text-indigo-300">{CURRENCIES[currency].symbol}{opt.cost.toLocaleString()}</span>
                          </div>
                          <div className="bg-slate-800/50 p-3 rounded-xl flex-1 border border-slate-700/50">
                            <span className="text-[10px] uppercase text-slate-400 block">Timeline</span>
                            <span className="text-base font-bold text-slate-200">{opt.timeline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                          {opt.advantages.map((adv: string, i: number) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedWinnerIndex(idx)}
                        className={`w-full mt-4 ${isSelected ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"} text-sm font-medium py-2.5 rounded-xl transition`}
                      >
                        {isSelected ? "Selected Winner ✓" : "Select Option"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {showWeightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} border rounded-2xl p-6 shadow-2xl space-y-6 relative`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" /> Evaluation Weights
              </h3>
              <button onClick={() => setShowWeightsModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium"><span>Cost Impact</span><span className="text-indigo-400">{weights.cost}%</span></div>
                <input type="range" min="0" max="100" value={weights.cost} onChange={(e) => setWeights({ ...weights, cost: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium"><span>Feasibility</span><span className="text-indigo-400">{weights.feasibility}%</span></div>
                <input type="range" min="0" max="100" value={weights.feasibility} onChange={(e) => setWeights({ ...weights, feasibility: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium"><span>Strategic Impact</span><span className="text-indigo-400">{weights.impact}%</span></div>
                <input type="range" min="0" max="100" value={weights.impact} onChange={(e) => setWeights({ ...weights, impact: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium"><span>Risk Tolerance</span><span className="text-indigo-400">{weights.risk}%</span></div>
                <input type="range" min="0" max="100" value={weights.risk} onChange={(e) => setWeights({ ...weights, risk: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
            </div>

            <button onClick={() => setShowWeightsModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg transition">
              Apply Weights
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} border rounded-2xl p-6 shadow-2xl space-y-4 relative`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Sign In to MatrixAI</h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-400">Enter your email address to sync matrices to your cloud account.</p>
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={`w-full ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"} border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500`}
            />
            <button
              onClick={() => {
                if (emailInput.trim()) {
                  setUser({ email: emailInput });
                  setShowAuthModal(false);
                  setEmailInput("");
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl text-sm transition"
            >
              Continue with Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}