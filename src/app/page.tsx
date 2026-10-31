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
  FileSpreadsheet,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<"landing" | "input" | "results">("landing");
  const [promptInput, setPromptInput] = useState<string>("");

  const [criteria, setCriteria] = useState<Array<{ id: string; name: string; weight: number; isInverted: boolean }>>([
    { id: "cost", name: "Cost", weight: 25, isInverted: true },
    { id: "feasibility", name: "Feasibility", weight: 25, isInverted: false },
    { id: "impact", name: "Impact", weight: 25, isInverted: false },
    { id: "risk", name: "Risk", weight: 25, isInverted: true },
  ]);

  const [options, setOptions] = useState<Array<{ name: string; scores: Record<string, number> }>>([
    { name: "Option A", scores: { cost: 5, feasibility: 8, impact: 8, risk: 3 } },
    { name: "Option B", scores: { cost: 7, feasibility: 6, impact: 9, risk: 5 } },
  ]);

  const [reviewDate, setReviewDate] = useState<string>("");
  const [actualOutcome, setActualOutcome] = useState<string>("");
  const [savedMatrices, setSavedMatrices] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const clampScore = (val: number) => Math.min(10, Math.max(1, isNaN(val) ? 1 : val));

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

  const handleAuthSubmit = async () => {
    if (!supabase || !emailInput || !passwordInput) return;
    setAuthError("");
    setAuthSuccessMsg("");
    setAuthLoading(true);

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput,
          password: passwordInput,
        });
        if (error) throw error;
        if (data.user) {
          setShowAuthModal(false);
          setEmailInput("");
          setPasswordInput("");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: emailInput,
          password: passwordInput,
        });
        if (error) throw error;
        
        if (data.user) {
          setAuthSuccessMsg("Account created successfully! You can now sign in.");
          setAuthMode("signin");
          setPasswordInput("");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication process failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoadSavedDecision = (item: any) => {
    setActiveDecisionId(item.id || null);
    setPromptInput(item.title || "Loaded Decision");
    setReviewDate(item.review_date || "");
    setActualOutcome(item.actual_outcome || "");

    if (item.criteria && Array.isArray(item.criteria)) setCriteria(item.criteria);
    if (item.options && Array.isArray(item.options)) setOptions(item.options);

    setViewState("results");
    setIsSidebarOpen(false);
  };

  const handleStartNew = () => {
    setActiveDecisionId(null);
    setPromptInput("");
    setReviewDate("");
    setActualOutcome("");
    setViewState("input");
  };

  const handleLoadTemplate = (templateName: string) => {
    const tmpl = DECISION_TEMPLATES.find((t) => t.name === templateName);
    if (!tmpl) return;
    setActiveDecisionId(null);
    setPromptInput(tmpl.name);
    setCriteria(tmpl.criteria);
    setOptions(tmpl.options);
  };

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

  const handleAddOption = () => {
    const initialScores: Record<string, number> = {};
    criteria.forEach((c) => (initialScores[c.id] = 5));
    setOptions([...options, { name: `Option ${String.fromCharCode(65 + options.length)}`, scores: initialScores }]);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 1) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const calculatedOptions = useMemo(() => {
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0) || 1;

    return options
      .map((opt) => {
        let weightedSum = 0;
        criteria.forEach((crit) => {
          const rawVal = clampScore(opt.scores[crit.id] ?? 5);
          const adjustedVal = crit.isInverted ? Math.max(0, 10 - rawVal) : rawVal;
          weightedSum += adjustedVal * (crit.weight || 0);
        });

        const score = Math.round((weightedSum / totalWeight) * 10);
        return { ...opt, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [options, criteria]);

  const aiAnalysisResult = useMemo(() => {
    const topOption = calculatedOptions[0];
    return {
      summary: `The AI Decision Engine recommends "${topOption?.name}" with a calculated composite score of ${topOption?.score}/100.`,
      warning: `✅ Multi-criteria evaluation processed across ${criteria.length} active criteria.`,
    };
  }, [calculatedOptions, criteria]);

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
        criteria,
        options,
        review_date: reviewDate || null,
        actual_outcome: actualOutcome || null,
        status: "pending",
      };

      let responseData;
      if (activeDecisionId) {
        const { data, error } = await supabase.from("matrices").update(payload).eq("id", activeDecisionId).select();
        if (error) throw error;
        responseData = data;
        setSaveStatus("Updated successfully!");
      } else {
        const { data, error } = await supabase.from("matrices").insert([payload]).select();
        if (error) throw error;
        responseData = data;
        if (data && data[0]) setActiveDecisionId(data[0].id);
        setSaveStatus("Saved to Supabase!");
      }

      if (responseData && responseData[0]) {
        setSavedMatrices((prev) => {
          const exists = prev.some((m) => m.id === responseData[0].id);
          if (exists) return prev.map((m) => (m.id === responseData[0].id ? responseData[0] : m));
          return [responseData[0], ...prev];
        });
      }

      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err: any) {
      setSaveStatus(`Save Error: ${err.message || "Failed to persist data."}`);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Navigation Header */}
      <header className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-xl cursor-pointer" onClick={() => setViewState("landing")}>MatrixAI Engine</h1>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Production v1.2</span>
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
            <button onClick={() => { setAuthMode("signin"); setShowAuthModal(true); }} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition">
              <Lock className="w-3.5 h-3.5" /> Sign In / Register
            </button>
          )}
        </div>
      </header>

      <div className="flex">
        {/* History Sidebar */}
        {isSidebarOpen && (
          <aside className={`w-80 border-r ${theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 min-h-[calc(100vh-73px)] z-20`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">Decision History Vault</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-2">
              {!user ? (
                <p className="text-xs text-slate-500 italic py-4">Sign in to load your saved private decisions.</p>
              ) : savedMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No records found in vault.</p>
              ) : (
                savedMatrices.map((item) => (
                  <div key={item.id} onClick={() => handleLoadSavedDecision(item)} className="p-3 rounded-xl border border-slate-800 bg-slate-900 cursor-pointer hover:border-indigo-500 text-xs space-y-1">
                    <p className="font-bold truncate text-indigo-300">{item.title}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Review: {item.review_date || "None"}</span>
                      <span className="flex items-center gap-0.5 text-slate-400"><Edit3 className="w-3 h-3" /> Edit</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 p-4 sm:p-10 max-w-5xl mx-auto space-y-6">
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400">
              <History className="w-4 h-4" /> Open Decision History Vault
            </button>
          )}

          {viewState === "landing" && (
            <div className="text-center space-y-6 py-12">
              <h2 className="text-4xl font-extrabold tracking-tight">Stage-by-Stage Decision Intelligence</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Fine-tune options, edit historical decisions, run dynamic criteria evaluations, and store securely in Supabase.
              </p>
              <button onClick={handleStartNew} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition text-sm">
                Start New Decision Matrix
              </button>
            </div>
          )}

          {viewState === "input" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setViewState("landing")} className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft className="w-4 h-4" /> Back</button>
                {activeDecisionId && <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-medium">Editing Saved Record</span>}
              </div>

              {/* Decision Templates Picker */}
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">Load Quick Decision Template:</label>
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

              <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6">
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

                {/* Dynamic Criteria */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Dynamic Decision Criteria</h3>
                    <button onClick={handleAddCriterion} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-indigo-300 transition">
                      <Plus className="w-3.5 h-3.5" /> Add Criterion
                    </button>
                  </div>

                  <div className="space-y-2">
                    {criteria.map((crit, idx) => (
                      <div key={crit.id} className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
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

                {/* Mobile Responsive Grid */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Options & Scores (Strict 1–10 Scale)</h3>
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                                updated[optIdx].scores[crit.id] = clampScore(Number(e.target.value));
                                setOptions(updated);
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
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
                <div>
                  <h2 className="text-2xl font-bold">{promptInput || "Decision Analysis"}</h2>
                  {activeDecisionId && <p className="text-[10px] text-amber-400 font-medium">Loaded from Supabase Vault</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setViewState("input")} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Decision Matrix
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
                  </button>
                  <button onClick={handleSaveMatrix} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl shadow">
                    <Save className="w-4 h-4" /> {saveStatus || (activeDecisionId ? "Update in Supabase" : "Save to Supabase")}
                  </button>
                </div>
              </div>

              {saveStatus && saveStatus.includes("Error") && (
                <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{saveStatus}</span>
                </div>
              )}

              <div className="p-4 rounded-xl border border-indigo-800/50 bg-indigo-950/30 text-indigo-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Brain className="w-4 h-4 text-indigo-400" /> AI Dynamic Matrix Assessment
                </div>
                <p>{aiAnalysisResult.summary}</p>
                <p className="text-slate-400 text-[11px]">{aiAnalysisResult.warning}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculatedOptions.map((opt, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${idx === 0 ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-bold text-indigo-400">{idx === 0 ? "⭐ Top Choice" : `Alternative Choice`}</span>
                      <span className="text-lg font-extrabold text-white">{opt.score}/100</span>
                    </div>
                    <h3 className="text-lg font-bold">{opt.name}</h3>
                  </div>
                ))}
              </div>

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
              <h3 className="text-sm font-bold">
                {authMode === "signin" ? "Sign In to Your Decision Vault" : "Create Your Decision Vault"}
              </h3>
              <button onClick={() => setShowAuthModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => { setAuthMode("signin"); setAuthError(""); setAuthSuccessMsg(""); }}
                className={`py-1.5 rounded-lg font-medium transition ${authMode === "signin" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode("signup"); setAuthError(""); setAuthSuccessMsg(""); }}
                className={`py-1.5 rounded-lg font-medium transition ${authMode === "signup" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                Create Account
              </button>
            </div>

            {authError && <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800">{authError}</p>}
            {authSuccessMsg && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
            />

            {/* Password Field with Show/Hide Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="•••••••• (Min 6 characters)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 pr-10 text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleAuthSubmit}
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-medium transition shadow-lg"
            >
              {authLoading ? "Processing..." : authMode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}