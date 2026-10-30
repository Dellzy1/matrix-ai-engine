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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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
        setSaveStatus("Saved!");
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
      {/* Top Header */}
      <header className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          <h1 className="font-bold text-base sm:text-xl cursor-pointer" onClick={() => setViewState("landing")}>MatrixAI</h1>
          <span className="text-[10px] sm:text-xs bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-medium">PRO 3.5</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-100 border-slate-300 text-slate-800"} border text-xs sm:text-sm rounded px-1.5 py-1`}
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-1.5 sm:p-2 rounded-lg ${theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-700"} border`}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 bg-indigo-600/20 border border-indigo-500/30 px-2 py-1 rounded-lg text-[11px] font-medium text-indigo-300">
              <UserCheck className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{user.email}</span>
              <button onClick={() => setUser(null)} className="ml-1 hover:text-white"><LogOut className="w-3 h-3" /></button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition"
            >
              <Lock className="w-3 h-3" /> Sign In
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar Drawer */}
        {isSidebarOpen && (
          <aside className={`w-full md:w-72 border-b md:border-r ${theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 min-h-[auto] md:min-h-[calc(100vh-65px)] flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">Saved History</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-100 border-slate-300 text-slate-900"} border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500`}
              />
            </div>

            <div className="max-h-48 md:max-h-none overflow-y-auto space-y-2">
              {filteredMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4">No saved matrices yet.</p>
              ) : (
                filteredMatrices.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPromptInput(item.title);
                      if (item.options) setEvaluatedOptions(item.options);
                      setViewState("results");
                      setIsSidebarOpen(false);
                    }}
                    className={`p-2.5 rounded-lg border ${theme === "dark" ? "border-slate-800 bg-slate-900/60 hover:border-indigo-500" : "border-slate-200 bg-slate-50 hover:border-indigo-400"} cursor-pointer transition text-xs`}
                  >
                    <p className="font-medium truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 p-4 sm:p-8">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="mb-4 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition">
              <History className="w-3.5 h-3.5" /> History
            </button>
          )}

          {/* Landing View */}
          {viewState === "landing" && (
            <div className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6 pt-4 sm:pt-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">AI Decision Matrix & Evaluation Engine</h2>
              <p className="text-slate-400 text-xs sm:text-base max-w-lg mx-auto">
                Evaluate decisions, assign custom weights, and eliminate cognitive bias in real-time.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button onClick={() => setViewState("input")} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 sm:py-3.5 rounded-xl shadow-lg transition text-sm">
                  <Sparkles className="w-4 h-4" /> Generate Matrix
                </button>
                <button onClick={() => setShowWeightsModal(true)} className={`flex items-center justify-center gap-2 ${theme === "dark" ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200" : "bg-white border-slate-300 hover:bg-slate-100 text-slate-800"} border font-medium px-5 py-3 rounded-xl transition text-sm`}>
                  <Sliders className="w-4 h-4" /> Configure Weights
                </button>
              </div>
            </div>
          )}

          {/* Input View */}
          {viewState === "input" && (
            <div className="max-w-xl mx-auto space-y-4 pt-2 sm:pt-6">
              <button onClick={() => setViewState("landing")} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className={`p-4 sm:p-6 rounded-2xl border ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"} shadow-xl space-y-4`}>
                <label className="block text-xs sm:text-sm font-semibold">Enter choices or dilemma to evaluate:</label>
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. Buying a Home vs Renting vs Commercial Real Estate"
                  className={`w-full ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"} border rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-indigo-500`}
                />

                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
                  <button onClick={() => setShowWeightsModal(true)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:underline">
                    <Sliders className="w-3.5 h-3.5" /> Weights: Cost({weights.cost}%), Feas({weights.feasibility}%)
                  </button>

                  <button
                    onClick={handleGenerateMatrix}
                    disabled={isAnalyzing || !promptInput.trim()}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-5 py-2.5 rounded-xl shadow transition text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" /> {isAnalyzing ? "Analyzing..." : "Generate Matrix"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results View */}
          {viewState === "results" && (
            <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <button onClick={() => setViewState("input")} className="flex items-center gap-1 text-xs text-indigo-400 hover:underline">
                    <ArrowLeft className="w-3 h-3" /> Edit Prompt
                  </button>
                  {saveStatus && <span className="text-xs text-emerald-400 font-medium">{saveStatus}</span>}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold truncate">{promptInput || "Decision Analysis Matrix"}</h2>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setReminderSet(true);
                      setTimeout(() => setReminderSet(false), 4000);
                    }}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition ${reminderSet ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-slate-900 border-slate-700 text-slate-300"}`}
                  >
                    <Bell className="w-3 h-3" /> {reminderSet ? "Reminder Set" : "Reminder"}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShareNotification("Copied!");
                      setTimeout(() => setShareNotification(""), 3000);
                    }}
                    className="flex items-center gap-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1.5 rounded-lg transition"
                  >
                    <Share2 className="w-3 h-3" /> {shareNotification || "Share"}
                  </button>

                  <button onClick={handleSaveToSupabase} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition shadow">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${theme === "dark" ? "bg-indigo-950/30 border-indigo-800/50 text-indigo-200" : "bg-indigo-50 border-indigo-200 text-indigo-900"} text-xs flex items-center gap-2`}>
                <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{biasInsight}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {evaluatedOptions.map((opt, idx) => {
                  const isSelected = selectedWinnerIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-4 sm:p-6 rounded-2xl border-2 ${isSelected ? "border-indigo-500 bg-indigo-950/20 shadow-indigo-500/10" : "border-slate-800 " + (theme === "dark" ? "bg-slate-900/80" : "bg-white")} shadow-lg relative flex flex-col justify-between space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                          {isSelected ? "⭐ Winner" : `Option ${String.fromCharCode(65 + idx)}`}
                        </span>
                        <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full">
                          {opt.score}%
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold mt-1">{opt.name}</h3>
                        <div className="mt-3 flex gap-2">
                          <div className="bg-slate-800/50 p-2 sm:p-3 rounded-xl flex-1 border border-slate-700/50">
                            <span className="text-[9px] uppercase text-slate-400 block">Est. Cost</span>
                            <span className="text-xs sm:text-sm font-bold text-indigo-300">{CURRENCIES[currency].symbol}{opt.cost.toLocaleString()}</span>
                          </div>
                          <div className="bg-slate-800/50 p-2 sm:p-3 rounded-xl flex-1 border border-slate-700/50">
                            <span className="text-[9px] uppercase text-slate-400 block">Timeline</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-200">{opt.timeline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Key Advantages
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                          {opt.advantages.map((adv: string, i: number) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedWinnerIndex(idx)}
                        className={`w-full mt-2 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"} text-xs font-medium py-2 rounded-xl transition`}
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

      {/* Weights Modal */}
      {showWeightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} border rounded-2xl p-5 shadow-2xl space-y-4 relative`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> Evaluation Weights
              </h3>
              <button onClick={() => setShowWeightsModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium"><span>Cost Impact</span><span className="text-indigo-400">{weights.cost}%</span></div>
                <input type="range" min="0" max="100" value={weights.cost} onChange={(e) => setWeights({ ...weights, cost: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium"><span>Feasibility</span><span className="text-indigo-400">{weights.feasibility}%</span></div>
                <input type="range" min="0" max="100" value={weights.feasibility} onChange={(e) => setWeights({ ...weights, feasibility: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium"><span>Strategic Impact</span><span className="text-indigo-400">{weights.impact}%</span></div>
                <input type="range" min="0" max="100" value={weights.impact} onChange={(e) => setWeights({ ...weights, impact: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium"><span>Risk Tolerance</span><span className="text-indigo-400">{weights.risk}%</span></div>
                <input type="range" min="0" max="100" value={weights.risk} onChange={(e) => setWeights({ ...weights, risk: Number(e.target.value) })} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
            </div>

            <button onClick={() => setShowWeightsModal(false)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl shadow transition text-xs">
              Apply Weights
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-xs ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} border rounded-2xl p-5 shadow-2xl space-y-3 relative`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Sign In</h3>
              <button onClick={() => setShowAuthModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-[11px] text-slate-400">Enter your email address to sync matrices to your account.</p>
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={`w-full ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300"} border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500`}
            />
            <button
              onClick={() => {
                if (emailInput.trim()) {
                  setUser({ email: emailInput });
                  setShowAuthModal(false);
                  setEmailInput("");
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-xs transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}