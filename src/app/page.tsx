"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Sparkles,
  History,
  Sun,
  Moon,
  X,
  Save,
  Lock,
  LogOut,
  UserCheck,
  Brain,
  Calendar,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  FileSpreadsheet,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Pre-filled Decision Templates (1-5)
const DECISION_TEMPLATES = [
  {
    name: "Vendor Selection",
    criteria: [
      { id: "pricing", name: "Pricing / Cost", weight: 30, isInverted: true },
      { id: "features", name: "Feature Alignment", weight: 30, isInverted: false },
      { id: "support", name: "SLA & Support", weight: 20, isInverted: false },
      { id: "security", name: "Compliance & Security", weight: 20, isInverted: false },
    ],
    options: [
      { name: "Vendor A (Established Enterprise)", scores: { pricing: 8, features: 9, support: 9, security: 9 } },
      { name: "Vendor B (Agile Challenger)", scores: { pricing: 4, features: 8, support: 7, security: 7 } },
    ],
  },
  {
    name: "Build vs. Buy",
    criteria: [
      { id: "upfrontCost", name: "Upfront Cost / Resource", weight: 25, isInverted: true },
      { id: "timeToMarket", name: "Time to Market", weight: 35, isInverted: false },
      { id: "customization", name: "Customization & Control", weight: 25, isInverted: false },
      { id: "maintenance", name: "Long-term Maintenance Burden", weight: 15, isInverted: true },
    ],
    options: [
      { name: "Build In-House", scores: { upfrontCost: 9, timeToMarket: 3, customization: 10, maintenance: 8 } },
      { name: "Buy Off-the-Shelf SaaS", scores: { upfrontCost: 4, timeToMarket: 9, customization: 5, maintenance: 2 } },
    ],
  },
  {
    name: "Hire vs. Contract",
    criteria: [
      { id: "hourlyRate", name: "Financial Cost Rate", weight: 30, isInverted: true },
      { id: "speed", name: "Onboarding Speed", weight: 25, isInverted: false },
      { id: "retention", name: "Long-term Knowledge Retention", weight: 25, isInverted: false },
      { id: "flexibility", name: "Engagement Flexibility", weight: 20, isInverted: false },
    ],
    options: [
      { name: "Full-Time Employee (FTE)", scores: { hourlyRate: 6, speed: 4, retention: 9, flexibility: 3 } },
      { name: "External Contractor / Agency", scores: { hourlyRate: 8, speed: 9, retention: 4, flexibility: 9 } },
    ],
  },
  {
    name: "Tool / Software Comparison",
    criteria: [
      { id: "cost", name: "Subscription Cost", weight: 20, isInverted: true },
      { id: "usability", name: "Ease of Use / UX", weight: 30, isInverted: false },
      { id: "integrations", name: "Ecosystem Integrations", weight: 30, isInverted: false },
      { id: "performance", name: "Performance & Reliability", weight: 20, isInverted: false },
    ],
    options: [
      { name: "Tool Alpha", scores: { cost: 5, usability: 8, integrations: 9, performance: 8 } },
      { name: "Tool Beta", scores: { cost: 3, usability: 9, integrations: 6, performance: 9 } },
    ],
  },
  {
    name: "Job Offer Comparison",
    criteria: [
      { id: "compensation", name: "Base + Equity Compensation", weight: 35, isInverted: false },
      { id: "growth", name: "Career Growth Potential", weight: 25, isInverted: false },
      { id: "wfb", name: "Work-Life Balance & Remote", weight: 25, isInverted: false },
      { id: "stability", name: "Company Stability / Risk", weight: 15, isInverted: false },
    ],
    options: [
      { name: "Offer A (Tech Scale-Up)", scores: { compensation: 8, growth: 9, wfb: 6, stability: 6 } },
      { name: "Offer B (Established Corp)", scores: { compensation: 7, growth: 6, wfb: 8, stability: 9 } },
    ],
  },
];

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Auth States
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const [viewState, setViewState] = useState<"landing" | "input" | "results">("landing");
  const [promptInput, setPromptInput] = useState<string>("");

  // Dynamic Criteria (Feature 7)
  const [criteria, setCriteria] = useState<Array<{ id: string; name: string; weight: number; isInverted: boolean }>>([
    { id: "cost", name: "Cost (10=High)", weight: 25, isInverted: true },
    { id: "feasibility", name: "Feasibility (10=Easy)", weight: 25, isInverted: false },
    { id: "impact", name: "Impact (10=High)", weight: 25, isInverted: false },
    { id: "risk", name: "Risk (10=High)", weight: 25, isInverted: true },
  ]);

  // Options & Matrix
  const [options, setOptions] = useState<Array<{ name: string; scores: Record<string, number> }>>([
    { name: "Option A", scores: { cost: 5, feasibility: 8, impact: 8, risk: 3 } },
    { name: "Option B", scores: { cost: 7, feasibility: 6, impact: 9, risk: 5 } },
  ]);

  const [reviewDate, setReviewDate] = useState<string>("");
  const [actualOutcome, setActualOutcome] = useState<string>("");
  
  const [savedMatrices, setSavedMatrices] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("");

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      } else {
        setUser(null);
        setSavedMatrices([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchMatrices() {
      if (!supabase || !user) return;
      const { data, error } = await supabase
        .from("matrices")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error) setSavedMatrices(data);
    }
    fetchMatrices();
  }, [user]);

  // Load Preset Template
  const handleLoadTemplate = (templateName: string) => {
    const tmpl = DECISION_TEMPLATES.find((t) => t.name === templateName);
    if (!tmpl) return;
    setPromptInput(tmpl.name);
    setCriteria(tmpl.criteria);
    setOptions(tmpl.options);
  };

  // Add & Remove Dynamic Criteria
  const handleAddCriterion = () => {
    const newId = `crit_${Date.now()}`;
    setCriteria([...criteria, { id: newId, name: "New Criterion", weight: 20, isInverted: false }]);
    setOptions(options.map((opt) => ({ ...opt, scores: { ...opt.scores, [newId]: 5 } })));
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((c) => c.id !== id));
    setOptions(
      options.map((opt) => {
        const updatedScores = { ...opt.scores };
        delete updatedScores[id];
        return { ...opt, scores: updatedScores };
      })
    );
  };

  // Add & Remove Option Rows
  const handleAddOption = () => {
    const initialScores: Record<string, number> = {};
    criteria.forEach((c) => (initialScores[c.id] = 5));
    setOptions([...options, { name: `Option ${String.fromCharCode(65 + options.length)}`, scores: initialScores }]);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 1) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  // Calculate Dynamic Scores
  const calculatedOptions = useMemo(() => {
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0) || 1;

    return options
      .map((opt) => {
        let weightedSum = 0;
        criteria.forEach((crit) => {
          const rawVal = opt.scores[crit.id] ?? 5;
          const adjustedVal = crit.isInverted ? Math.max(0, 10 - rawVal) : rawVal;
          weightedSum += adjustedVal * (crit.weight || 0);
        });

        const score = Math.round((weightedSum / totalWeight) * 10);
        return { ...opt, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [options, criteria]);

  // AI Devil's Advocate Analysis
  const aiAnalysisResult = useMemo(() => {
    const topOption = calculatedOptions[0];
    return {
      summary: `The AI Engine recommends "${topOption?.name}" with a calculated score of ${topOption?.score}/100.`,
      warning: `✅ Multi-criteria evaluation complete across ${criteria.length} dynamic metrics.`,
    };
  }, [calculatedOptions, criteria]);

  // Feature 6: Export to CSV Utility
  const handleExportCSV = () => {
    const headers = ["Rank", "Option Name", "Overall Score (100)", ...criteria.map((c) => `${c.name} (Weight: ${c.weight}%)`)];
    const rows = calculatedOptions.map((opt, idx) => {
      const critScores = criteria.map((c) => opt.scores[c.id] ?? "");
      return [`${idx + 1}`, `"${opt.name.replace(/"/g, '""')}"`, opt.score, ...critScores];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(promptInput || "decision_matrix").toLowerCase().replace(/\s+/g, "_")}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveMatrix = async () => {
    if (!supabase || !user) {
      setShowAuthModal(true);
      return;
    }
    try {
      setSaveStatus("Saving...");
      const payload = {
        user_id: user.id,
        title: promptInput || "Untitled Decision Matrix",
        weights: criteria.reduce((acc, c) => ({ ...acc, [c.id]: c.weight }), {}),
        options: calculatedOptions,
        review_date: reviewDate || null,
        actual_outcome: actualOutcome || null,
        status: "pending",
      };

      const { data, error } = await supabase.from("matrices").insert([payload]).select();
      if (error) throw error;
      if (data) {
        setSavedMatrices([data[0], ...savedMatrices]);
        setSaveStatus("Saved to Supabase!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (err: any) {
      setSaveStatus("Error saving.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleRealAuth = async () => {
    if (!supabase || !emailInput || !passwordInput) return;
    setAuthError("");
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });

      if (error) {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: emailInput,
          password: passwordInput,
        });

        if (signUpErr) {
          setAuthError(signUpErr.message);
          setAuthLoading(false);
          return;
        }

        if (signUpData.user) {
          setShowAuthModal(false);
          setEmailInput("");
          setPasswordInput("");
        }
      } else if (data.user) {
        setShowAuthModal(false);
        setEmailInput("");
        setPasswordInput("");
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <header className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-xl cursor-pointer" onClick={() => setViewState("landing")}>MatrixAI Engine</h1>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Templates & Dynamic Criteria</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg border border-slate-700">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300">
              <UserCheck className="w-4 h-4" /> <span>{user.email}</span>
              <button onClick={async () => { if (supabase) await supabase.auth.signOut(); }} className="ml-2 hover:text-white"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition">
              <Lock className="w-3.5 h-3.5" /> Sign In / Register
            </button>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Vault */}
        {isSidebarOpen && (
          <aside className={`w-72 border-r ${theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 min-h-[calc(100vh-73px)]`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">Decision History Vault</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-2">
              {!user ? (
                <p className="text-xs text-slate-500 italic py-4">Sign in to view saved secure decisions.</p>
              ) : savedMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No records found in vault.</p>
              ) : (
                savedMatrices.map((item, idx) => (
                  <div key={idx} onClick={() => { setPromptInput(item.title); setReviewDate(item.review_date || ""); setActualOutcome(item.actual_outcome || ""); setViewState("results"); setIsSidebarOpen(false); }} className="p-3 rounded-xl border border-slate-800 bg-slate-900 cursor-pointer hover:border-indigo-500 text-xs">
                    <p className="font-bold truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-500">Review: {item.review_date || "Not set"}</span>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400">
              <History className="w-4 h-4" /> Open Decision History Vault
            </button>
          )}

          {viewState === "landing" && (
            <div className="text-center space-y-6 py-12">
              <h2 className="text-4xl font-extrabold tracking-tight">Professional Decision Matrix Suite</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Use pre-filled decision templates, customize dynamic criteria, analyze outcomes, and export to CSV.
              </p>
              <button onClick={() => setViewState("input")} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition text-sm">
                Start New Decision Matrix
              </button>
            </div>
          )}

          {viewState === "input" && (
            <div className="space-y-6">
              <button onClick={() => setViewState("landing")} className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft className="w-4 h-4" /> Back</button>
              
              {/* Feature 1-5: Decision Templates Library Dropdown */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">⚡ Load Quick Decision Template (1–5):</label>
                <select
                  onChange={(e) => handleLoadTemplate(e.target.value)}
                  defaultValue=""
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="" disabled>Select a pre-filled decision template...</option>
                  {DECISION_TEMPLATES.map((tmpl, idx) => (
                    <option key={idx} value={tmpl.name}>{tmpl.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Decision Title / Dilemma:</label>
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. AWS vs GCP Infrastructure"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Feature 7: Dynamic Criteria Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Dynamic Decision Criteria & Weights</h3>
                    <button onClick={handleAddCriterion} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-indigo-300 transition">
                      <Plus className="w-3.5 h-3.5" /> Add Custom Criterion
                    </button>
                  </div>

                  <div className="space-y-2">
                    {criteria.map((crit, idx) => (
                      <div key={crit.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                        <input
                          type="text"
                          value={crit.name}
                          onChange={(e) => {
                            const updated = [...criteria];
                            updated[idx].name = e.target.value;
                            setCriteria(updated);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold flex-1"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Weight %:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={crit.weight}
                            onChange={(e) => {
                              const updated = [...criteria];
                              updated[idx].weight = Number(e.target.value);
                              setCriteria(updated);
                            }}
                            className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center"
                          />
                        </div>
                        <button onClick={() => handleRemoveCriterion(crit.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option Scoring Matrix Grid */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Options & Scoring Matrix (Scale 1–10)</h3>
                    <button onClick={handleAddOption} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-indigo-300 transition">
                      <Plus className="w-3.5 h-3.5" /> Add Option
                    </button>
                  </div>

                  {options.map((opt, optIdx) => (
                    <div key={optIdx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => {
                            const updated = [...options];
                            updated[optIdx].name = e.target.value;
                            setOptions(updated);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold w-full max-w-xs"
                        />
                        {options.length > 1 && (
                          <button onClick={() => handleRemoveOption(optIdx)} className="text-rose-400 hover:text-rose-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {criteria.map((crit) => (
                          <div key={crit.id} className="space-y-1">
                            <span className="text-[10px] text-slate-400 block truncate">{crit.name}</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={opt.scores[crit.id] ?? 5}
                              onChange={(e) => {
                                const updated = [...options];
                                updated[optIdx].scores[crit.id] = Number(e.target.value);
                                setOptions(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setViewState("results")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition text-sm shadow">
                  Calculate Dynamic Matrix & View Results
                </button>
              </div>
            </div>
          )}

          {viewState === "results" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold">{promptInput || "Decision Analysis"}</h2>
                <div className="flex items-center gap-2">
                  {/* Feature 6: CSV Export Button */}
                  <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2 rounded-xl border border-slate-700 shadow transition">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export to CSV
                  </button>
                  <button onClick={handleSaveMatrix} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl shadow">
                    <Save className="w-4 h-4" /> {saveStatus || "Save to Supabase"}
                  </button>
                </div>
              </div>

              {/* AI Analysis Banner */}
              <div className="p-4 rounded-xl border border-indigo-800/50 bg-indigo-950/30 text-indigo-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Brain className="w-4 h-4 text-indigo-400" /> AI Dynamic Matrix Assessment
                </div>
                <p>{aiAnalysisResult.summary}</p>
                <p className="text-slate-400 text-[11px]">{aiAnalysisResult.warning}</p>
              </div>

              {/* Options Rankings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculatedOptions.map((opt, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${idx === 0 ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-bold text-indigo-400">{idx === 0 ? "⭐ Top Recommended Choice" : `Alternative Choice`}</span>
                      <span className="text-lg font-extrabold text-white">{opt.score}/100</span>
                    </div>
                    <h3 className="text-lg font-bold">{opt.name}</h3>
                  </div>
                ))}
              </div>

              {/* Outcome Review Section */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                  <Calendar className="w-4 h-4" /> Decision Review Loop
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Target Review Date</label>
                    <input
                      type="date"
                      value={reviewDate}
                      onChange={(e) => setReviewDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Actual Outcome Notes</label>
                    <input
                      type="text"
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="Enter reflection later..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Supabase Authentication</h3>
              <button onClick={() => setShowAuthModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-400">Sign in or create an account to access your decision vault.</p>
            
            {authError && <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800">{authError}</p>}

            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs"
            />
            <input
              type="password"
              placeholder="•••••••• (Min 6 characters)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs"
            />
            <button
              onClick={handleRealAuth}
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-medium transition"
            >
              {authLoading ? "Authenticating..." : "Sign In / Create Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}