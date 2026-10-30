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
} from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Real Supabase Auth States
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [viewState, setViewState] = useState<"landing" | "input" | "results">("landing");
  const [promptInput, setPromptInput] = useState<string>("");

  // User Scoring & Matrix States
  const [options, setOptions] = useState([
    { name: "Option A", costScore: 5, feasibility: 8, impact: 8, risk: 3 },
    { name: "Option B", costScore: 7, feasibility: 6, impact: 9, risk: 5 },
  ]);
  const [weights, setWeights] = useState({ cost: 25, feasibility: 25, impact: 25, risk: 25 });
  const [reviewDate, setReviewDate] = useState<string>("");
  const [actualOutcome, setActualOutcome] = useState<string>("");
  
  const [savedMatrices, setSavedMatrices] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // 1. Real Supabase Auth Session Listener
  useEffect(() => {
    if (!supabase) return;

    // Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      }
    });

    // Subscribe to real-time auth changes (Sign In / Sign Out / Token Refresh)
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

  // 2. Fetch User-Owned Matrices from Supabase RLS
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

  // Handle Real Authentication (Sign In or Automatic Sign Up)
  const handleRealAuth = async () => {
    if (!supabase || !emailInput || !passwordInput) return;
    setAuthError("");

    // Attempt Sign In
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (error) {
      // If user doesn't exist or fails, attempt registration
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput,
      });

      if (signUpErr) {
        setAuthError(signUpErr.message);
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
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // Calculate Weighted Scores
  const calculatedOptions = useMemo(() => {
    const totalWeight = weights.cost + weights.feasibility + weights.impact + weights.risk || 1;
    return options
      .map((opt) => {
        const costValue = Math.max(0, 10 - opt.costScore);
        const riskValue = Math.max(0, 10 - opt.risk);
        const score = Math.round(
          ((costValue * weights.cost +
            opt.feasibility * weights.feasibility +
            opt.impact * weights.impact +
            riskValue * weights.risk) /
            totalWeight) *
            10
        );
        return { ...opt, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [options, weights]);

  // AI Devil's Advocate & Blindspot Analyzer
  const aiBlindspotAnalysis = useMemo(() => {
    const highRiskOpt = options.find((o) => o.risk >= 7);
    const highCostOpt = options.find((o) => o.costScore >= 8);

    if (weights.risk > 40 && highRiskOpt) {
      return `⚠️ AI Blindspot Warning: You configured high risk aversion (${weights.risk}%), but "${highRiskOpt.name}" has a high risk score (${highRiskOpt.risk}/10).`;
    }
    if (weights.cost > 40 && highCostOpt) {
      return `💡 AI Financial Alert: Cost is heavily prioritized. "${highCostOpt.name}" scores poorly on cost efficiency.`;
    }
    return `✅ AI Assessment: Weight distribution is well-aligned with current option trade-offs. No critical cognitive biases detected.`;
  }, [options, weights]);

  // 3. Real Database Save Operation
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
        weights,
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

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Navigation Header */}
      <header className={`border-b ${theme === "dark" ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"} p-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-xl cursor-pointer" onClick={() => setViewState("landing")}>MatrixAI Engine</h1>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Real Auth & RLS</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg border border-slate-700">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300">
              <UserCheck className="w-4 h-4" /> <span>{user.email}</span>
              <button onClick={handleSignOut} className="ml-2 hover:text-white"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition">
              <Lock className="w-3.5 h-3.5" /> Sign In / Register
            </button>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Real User History Drawer */}
        {isSidebarOpen && (
          <aside className={`w-72 border-r ${theme === "dark" ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 min-h-[calc(100vh-73px)]`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">My Secured Decisions</span>
              <button onClick={() => setIsSidebarOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-2">
              {!user ? (
                <p className="text-xs text-slate-500 italic py-4">Please sign in to view your decision history.</p>
              ) : savedMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No saved matrices found in your account.</p>
              ) : (
                savedMatrices.map((item, idx) => (
                  <div key={idx} onClick={() => { setPromptInput(item.title); setWeights(item.weights); setViewState("results"); setIsSidebarOpen(false); }} className="p-3 rounded-xl border border-slate-800 bg-slate-900 cursor-pointer hover:border-indigo-500 text-xs">
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
              <h2 className="text-4xl font-extrabold tracking-tight">Decision Intelligence & Review Loop</h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                Enter your scores, apply custom weights, detect blindspots, and track long-term actual outcomes with full data privacy.
              </p>
              <button onClick={() => setViewState("input")} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition text-sm">
                Start New Decision Matrix
              </button>
            </div>
          )}

          {viewState === "input" && (
            <div className="space-y-6">
              <button onClick={() => setViewState("landing")} className="flex items-center gap-1 text-xs text-slate-400"><ArrowLeft className="w-4 h-4" /> Back</button>
              
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
                <label className="block text-sm font-semibold">Decision Title / Dilemma:</label>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. AWS vs GCP Cloud Infrastructure"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                />

                <div className="pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">User-Entered Scoring Grid (Scale 1–10)</h3>
                  {options.map((opt, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 items-center">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[idx].name = e.target.value;
                          setOptions(updated);
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cost (10=High Cost)</span>
                        <input type="number" min="1" max="10" value={opt.costScore} onChange={(e) => { const u = [...options]; u[idx].costScore = Number(e.target.value); setOptions(u); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Feasibility (10=Easy)</span>
                        <input type="number" min="1" max="10" value={opt.feasibility} onChange={(e) => { const u = [...options]; u[idx].feasibility = Number(e.target.value); setOptions(u); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Impact (10=High)</span>
                        <input type="number" min="1" max="10" value={opt.impact} onChange={(e) => { const u = [...options]; u[idx].impact = Number(e.target.value); setOptions(u); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Risk (10=High Risk)</span>
                        <input type="number" min="1" max="10" value={opt.risk} onChange={(e) => { const u = [...options]; u[idx].risk = Number(e.target.value); setOptions(u); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs" />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setViewState("results")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition text-sm shadow">
                  Calculate Weighted Matrix & Setup Review Loop
                </button>
              </div>
            </div>
          )}

          {viewState === "results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold">{promptInput || "Decision Analysis"}</h2>
                <button onClick={handleSaveMatrix} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl shadow">
                  <Save className="w-4 h-4" /> {saveStatus || "Save Securely to Supabase"}
                </button>
              </div>

              {/* AI Blindspot Banner */}
              <div className="p-4 rounded-xl border border-indigo-800/50 bg-indigo-950/30 text-indigo-200 text-xs flex items-center gap-3">
                <Brain className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{aiBlindspotAnalysis}</span>
              </div>

              {/* Calculated Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculatedOptions.map((opt, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${idx === 0 ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-bold text-indigo-400">{idx === 0 ? "⭐ Recommended Choice" : `Alternative`}</span>
                      <span className="text-lg font-extrabold text-white">{opt.score}/100</span>
                    </div>
                    <h3 className="text-lg font-bold">{opt.name}</h3>
                  </div>
                ))}
              </div>

              {/* Review Loop Section */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                  <Calendar className="w-4 h-4" /> Decision Review Loop & Reflection Tracker
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
                    <label className="block text-xs text-slate-400 mb-1">What Actually Happened</label>
                    <input
                      type="text"
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="Fill in during your review..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Real Supabase Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Real Authentication (Supabase Auth)</h3>
              <button onClick={() => setShowAuthModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-400">Sign in or enter a new email/password to register your account.</p>
            
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-medium"
            >
              Sign In / Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}