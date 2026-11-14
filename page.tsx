"use client";

import { APP_NAME } from "@/lib/appConfig";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { explain } from "@/lib/explainRanking";
import {
  Sparkles, History, Sun, Moon, X, Save, Lock, LogOut, UserCheck, Brain, Calendar,
  ArrowLeft, Plus, Trash2, Edit3, AlertCircle, CheckCircle2, Eye, EyeOff, Clock,
} from "lucide-react";
import { STRINGS, LANGUAGE_LABELS, fmt, type Lang } from "@/lib/i18n";
import { CHECKLISTS, type ChecklistCategory } from "@/lib/checklists";
import { suggestCriteria, type Suggestion } from "@/lib/criteriaSuggestions";
import ExportMenu from "./ExportMenu";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type T = (typeof STRINGS)["en"];
type Criterion = { id: string; name: string; weight: number; isInverted: boolean };
type Option = { id: string; name: string; scores: Record<string, number | null> };
type ScoredOption = Option & { score: number };
type Notice = { type: "error" | "success"; text: string } | null;
type AuthUser = { id: string; email: string };

const uid = () => Math.random().toString(36).slice(2, 10);
const clampScore = (n: number) => (Number.isFinite(n) ? Math.min(10, Math.max(1, n)) : 1);
const parseScoreInput = (raw: string): number | null => {
  if (raw.trim() === "") return null;
  const n = Math.round(Number(raw));
  return Number.isNaN(n) ? null : n;
};

const DEFAULT_CRITERIA: Criterion[] = [
  { id: "cost", name: "Cost", weight: 25, isInverted: true },
  { id: "feasibility", name: "Feasibility", weight: 25, isInverted: false },
  { id: "impact", name: "Impact", weight: 25, isInverted: false },
  { id: "risk", name: "Risk", weight: 25, isInverted: true },
];

// Scores always start blank, so the user enters their own numbers.
const blankScores = (crits: Criterion[]): Record<string, number | null> =>
  Object.fromEntries(crits.map((c) => [c.id, null] as const));

// Fixed IDs, so nothing random runs during the server build.
const DEFAULT_OPTIONS: Option[] = [
  { id: "opt-a", name: "Option A", scores: blankScores(DEFAULT_CRITERIA) },
  { id: "opt-b", name: "Option B", scores: blankScores(DEFAULT_CRITERIA) },
];

// Templates provide criteria and option names only, never sample scores.
const DECISION_TEMPLATES: Array<{
  name: string;
  criteria: Criterion[];
  options: string[];
}> = [
  {
    name: "Vendor Selection",
    criteria: [
      { id: "pricing", name: "Pricing / Cost", weight: 30, isInverted: true },
      { id: "features", name: "Feature Alignment", weight: 30, isInverted: false },
      { id: "support", name: "SLA & Support", weight: 20, isInverted: false },
      { id: "security", name: "Compliance & Security", weight: 20, isInverted: false },
    ],
    options: ["Vendor A", "Vendor B"],
  },
  {
    name: "Build vs. Buy",
    criteria: [
      { id: "upfrontCost", name: "Upfront Cost / Resource", weight: 25, isInverted: true },
      { id: "timeToMarket", name: "Time to Market", weight: 35, isInverted: false },
      { id: "customization", name: "Customization & Control", weight: 25, isInverted: false },
      { id: "maintenance", name: "Long-term Maintenance Burden", weight: 15, isInverted: true },
    ],
    options: ["Build In-House", "Buy Off-the-Shelf SaaS"],
  },
  {
    name: "Hire vs. Contract",
    criteria: [
      { id: "hourlyRate", name: "Financial Cost Rate", weight: 30, isInverted: true },
      { id: "speed", name: "Onboarding Speed", weight: 25, isInverted: false },
      { id: "retention", name: "Long-term Knowledge Retention", weight: 25, isInverted: false },
      { id: "flexibility", name: "Engagement Flexibility", weight: 20, isInverted: false },
    ],
    options: ["Full-Time Employee", "External Contractor / Agency"],
  },
  {
    name: "Tool / Software Comparison",
    criteria: [
      { id: "cost", name: "Subscription Cost", weight: 20, isInverted: true },
      { id: "usability", name: "Ease of Use / UX", weight: 30, isInverted: false },
      { id: "integrations", name: "Ecosystem Integrations", weight: 30, isInverted: false },
      { id: "performance", name: "Performance & Reliability", weight: 20, isInverted: false },
    ],
    options: ["Tool A", "Tool B"],
  },
  {
    name: "Job Offer Comparison",
    criteria: [
      { id: "compensation", name: "Base + Equity Compensation", weight: 35, isInverted: false },
      { id: "growth", name: "Career Growth Potential", weight: 25, isInverted: false },
      { id: "wfb", name: "Work-Life Balance & Remote", weight: 25, isInverted: false },
      { id: "stability", name: "Company Stability / Risk", weight: 15, isInverted: false },
    ],
    options: ["Offer A", "Offer B"],
  },
];

const hydrateOptions = (rows: any[]): Option[] =>
  rows.map((o) => ({ id: o.id ?? uid(), name: String(o.name ?? "Option"), scores: { ...(o.scores ?? {}) } }));

const hydrateCriteria = (rows: any[]): Criterion[] =>
  rows.map((c) => ({
    id: c.id ?? uid(),
    name: String(c.name ?? "Criterion"),
    weight: Number(c.weight) || 0,
    isInverted: Boolean(c.isInverted),
  }));

// Shared by the live results and the history cards.
function scoreOptions(criteria: Criterion[], options: Option[]): ScoredOption[] {
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  return options
    .map((opt) => {
      let weightedSum = 0;
      criteria.forEach((crit) => {
        const raw = clampScore(opt.scores[crit.id] ?? 5);
        const adjusted = crit.isInverted ? 10 - raw : raw;
        weightedSum += adjusted * (crit.weight || 0);
      });
      const score = totalWeight === 0 ? 0 : Math.round((weightedSum / (totalWeight * 10)) * 100);
      return { ...opt, score };
    })
    .sort((a, b) => b.score - a.score);
}

function validateDecision(title: string, criteria: Criterion[], options: Option[], t: T): string | null {
  if (!title.trim()) return t.vTitle;
  if (criteria.length === 0) return t.vCriteria;
  if (criteria.some((c) => !c.name.trim())) return t.vCriterionName;
  if (criteria.reduce((sum, c) => sum + (c.weight || 0), 0) <= 0) return t.vWeight;
  if (options.length < 2) return t.vOptions;
  if (options.some((o) => !o.name.trim())) return t.vOptionName;
  const missingOrInvalid = options.some((o) =>
    criteria.some((c) => {
      const v = o.scores[c.id];
      return v == null || v < 1 || v > 10;
    })
  );
  if (missingOrInvalid) return t.vScores;
  return null;
}

// Rule-based checks. These are not AI, and the UI labels them that way.
function automaticChecks(
  criteria: Criterion[],
  ranked: Array<{ name: string; score: number }>,
  t: T
): string[] {
  const notes: string[] = [];
  const total = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const heaviest = [...criteria].sort((a, b) => b.weight - a.weight)[0];
  if (heaviest && total > 0 && heaviest.weight / total > 0.5) {
    notes.push(fmt(t.chkHeavy, { name: heaviest.name }));
  }
  if (ranked.length > 1 && ranked[0].score - ranked[1].score <= 3) {
    notes.push(t.chkClose);
  }
  if (criteria.length < 3) {
    notes.push(t.chkFewCriteria);
  }
  if (notes.length === 0) {
    notes.push(t.chkOk);
  }
  return notes;
}

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const [lang, setLang] = useState<Lang>("en");
  const t = STRINGS[lang];
  const isDark = theme === "dark";
  const surface = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";
  const field = isDark
    ? "bg-slate-950 border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
    : "bg-slate-50 border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewState, setViewState] = useState<"landing" | "input" | "results">("landing");
  const [notice, setNotice] = useState<Notice>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Auth
  const [user, setUser] = useState<AuthUser | null>(null);
  const ownerRef = useRef<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [workspaceBranding, setWorkspaceBranding] = useState({
    company_name: "MatrixAI Engine",
    logo_url: "",
  });

  useEffect(() => {
    async function fetchBranding() {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("matrices")
          .select("company_name, logo_url")
          .limit(1)
          .maybeSingle();

        if (data && (data.company_name || data.logo_url)) {
          setWorkspaceBranding({
            company_name: data.company_name || "MatrixAI Engine",
            logo_url: data.logo_url || "",
          });
        }
      } catch (err) {
        console.log("Using default branding");
      }
    }
    fetchBranding();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Decision draft
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState("");
  const [reason, setReason] = useState("");
  const [checkCategory, setCheckCategory] = useState<ChecklistCategory | "">("");
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [reviewDate, setReviewDate] = useState("");
  const [actualOutcome, setActualOutcome] = useState("");

  const [savedMatrices, setSavedMatrices] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const handleForgotPassword = async () => {
    if (!emailInput.trim()) {
      setNotice({ type: "error", text: t.forgotNeedEmail });
      return;
    }

    const res = await supabase?.auth.resetPasswordForEmail(emailInput, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    const error = res?.error;

    if (error) {
      setNotice({ type: "error", text: error.message });
    } else {
      setNotice({ type: "success", text: t.forgotSent });
    }
  };

  // Derived values
  const ranked = useMemo(() => scoreOptions(criteria, options), [criteria, options]);
  const checks = useMemo(() => automaticChecks(criteria, ranked, t), [criteria, ranked, t]);
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const shareOf = (weight: number) => (totalWeight > 0 ? Math.round((weight / totalWeight) * 100) : 0);
  const missingScores = options.some((o) =>
    criteria.some((c) => {
      const v = o.scores[c.id];
      return v == null || v < 1 || v > 10;
    })
  );
  const weakResult = ranked.length > 0 && ranked[0].score < 60;
  const summary = useMemo(() => {
    const completed = savedMatrices.filter((m) => (m.actual_outcome ?? "").trim() !== "");
    const awaiting = savedMatrices.filter((m) => (m.actual_outcome ?? "").trim() === "");
    const upcoming = awaiting
      .filter((m) => m.review_date && m.review_date >= today)
      .sort((a, b) => (a.review_date > b.review_date ? 1 : -1));
    return {
      total: savedMatrices.length,
      awaiting: awaiting.length,
      completed: completed.length,
      nextReview: upcoming[0]?.review_date ?? null,
      recent: completed.slice(0, 3),
    };
  }, [savedMatrices, today]);
  const showError = (text: string) => {
    setNotice({ type: "error", text });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const suggestions = useMemo(
    () =>
      suggestCriteria(promptInput).filter(
        (s) => !criteria.some((c) => c.name.toLowerCase() === s.name.toLowerCase())
      ),
    [promptInput, criteria]
  );

  const addSuggestion = (s: Suggestion) => {
    const id = `crit_${uid()}`;
    setCriteria((prev) => [...prev, { id, name: s.name, weight: 20, isInverted: s.isInverted }]);
    setOptions((prev) => prev.map((o) => ({ ...o, scores: { ...o.scores, [id]: null } })));
  };

  // Clears the draft so one account never sees another account's work.
  const resetDecisionForm = () => {
    setActiveDecisionId(null);
    setPromptInput("");
    setReason("");
    setCriteria(DEFAULT_CRITERIA);
    setOptions(DEFAULT_OPTIONS);
    setReviewDate("");
    setActualOutcome("");
    setNotice(null);
    setViewState("landing");
    setIsSidebarOpen(false);
  };

  const applySession = (next: AuthUser | null) => {
    const nextId = next?.id ?? null;
    if (ownerRef.current && ownerRef.current !== nextId) resetDecisionForm();
    ownerRef.current = nextId;
    setUser(next);
    if (!next) setSavedMatrices([]);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) applySession({ id: session.user.id, email: session.user.email || "" });
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ? { id: session.user.id, email: session.user.email || "" } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const userId = user?.id;
  useEffect(() => {
    async function fetchMatrices() {
      if (!supabase || !userId) return;
      const { data, error } = await supabase
        .from("matrices")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setSavedMatrices(data);
    }
    fetchMatrices();
  }, [userId]);

  // Auth
  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthError("");
    setAuthSuccessMsg("");
    setShowAuthModal(true);
  };

  const closeAuth = () => {
    setShowAuthModal(false);
    setAuthError("");
    setAuthSuccessMsg("");
  };

  const handleAuthSubmit = async () => {
    if (!supabase) {
      setAuthError(t.authNotConfigured);
      return;
    }
    if (!emailInput.trim() || !passwordInput) {
      setAuthError(t.authEnterFields);
      return;
    }
    if (authMode === "signup" && passwordInput.length < 6) {
      setAuthError(t.authPasswordLength);
      return;
    }

    setAuthError("");
    setAuthSuccessMsg("");
    setAuthLoading(true);
    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput.trim(),
          password: passwordInput,
        });
        if (error) throw error;
        if (data.user) {
          setEmailInput("");
          setPasswordInput("");
          setShowAuthModal(false);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: emailInput.trim(),
          password: passwordInput,
        });
        if (error) throw error;
        setPasswordInput("");
        if (data.session) {
          setEmailInput("");
          setShowAuthModal(false);
        } else {
          setAuthSuccessMsg(t.authCreated);
          setAuthMode("signin");
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || t.authFailed);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return;
    const confirmed = window.confirm(t.deleteAccountConfirm);
    if (!confirmed) return;

    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      showError(`${t.deleteAccountFailed} ${error.message}`);
      return;
    }
    await supabase.auth.signOut();
    setNotice({ type: "success", text: t.deleteAccountDone });
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // Navigation
  const handleStartNew = () => {
    resetDecisionForm();
    setViewState("input");
  };

  const handleLoadSavedDecision = (item: any) => {
    setActiveDecisionId(item.id ?? null);
    setPromptInput(item.title || "");
    setReason(item.reason || "");
    setReviewDate(item.review_date || "");
    setActualOutcome(item.actual_outcome || "");
    setCriteria(item.criteria?.length ? hydrateCriteria(item.criteria) : DEFAULT_CRITERIA);
    setOptions(item.options?.length ? hydrateOptions(item.options) : DEFAULT_OPTIONS);
    setNotice(null);
    setViewState("results");
    setIsSidebarOpen(false);
  };

  const handleLoadTemplate = (templateName: string) => {
    const tmpl = DECISION_TEMPLATES.find((item) => item.name === templateName);
    if (!tmpl) return;
    const templateCriteria: Criterion[] = tmpl.criteria.map((c) => ({ ...c }));
    setActiveDecisionId(null);
    setPromptInput(tmpl.name);
    setCriteria(templateCriteria);
    setOptions(
      tmpl.options.map((name) => ({ id: uid(), name, scores: blankScores(templateCriteria) }))
    );
    setNotice(null);
  };

  // Criteria
  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const handleAddCriterion = () => {
    const id = `crit_${uid()}`;
    // Blank name and blank scores, so the user must fill them in.
    setCriteria((prev) => [...prev, { id, name: "", weight: 20, isInverted: false }]);
    setOptions((prev) => prev.map((o) => ({ ...o, scores: { ...o.scores, [id]: null } })));
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length <= 1) return;
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setOptions((prev) =>
      prev.map((o) => {
        const scores = { ...o.scores };
        delete scores[id];
        return { ...o, scores };
      })
    );
  };

  // Options and scores
  const updateOptionName = (optId: string, name: string) =>
    setOptions((prev) => prev.map((o) => (o.id === optId ? { ...o, name } : o)));

  const setScore = (optId: string, critId: string, value: number | null) =>
    setOptions((prev) =>
      prev.map((o) => (o.id === optId ? { ...o, scores: { ...o.scores, [critId]: value } } : o))
    );

  const clampOnBlur = (optId: string, critId: string) =>
    setOptions((prev) =>
      prev.map((o) => {
        if (o.id !== optId) return o;
        const v = o.scores[critId];
        return v == null ? o : { ...o, scores: { ...o.scores, [critId]: clampScore(v) } };
      })
    );

  const handleAddOption = () =>
    setOptions((prev) => [
      ...prev,
      {
        id: uid(),
        name: `${t.optionWord} ${String.fromCharCode(65 + (prev.length % 26))}`,
        scores: blankScores(criteria),
      },
    ]);

  const handleRemoveOption = (optId: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  const handleCalculate = () => {
    const problem = validateDecision(promptInput, criteria, options, t);
    if (problem) return showError(problem);
    setNotice(null);
    setViewState("results");
  };

  const handleExportCSV = () => {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = [
      "Rank",
      "Option",
      "Overall (100)",
      ...criteria.map((c) => `${c.name} (weight ${c.weight}%${c.isInverted ? ", lower is better" : ""})`),
    ];
    const rows = ranked.map((o, i) =>
      [i + 1, o.name, o.score, ...criteria.map((c) => o.scores[c.id] ?? "")].map(esc).join(",")
    );
    const csv = [header.map(esc).join(","), ...rows].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(promptInput.trim() || "decision_matrix").toLowerCase().replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteMatrix = async () => {
    if (!supabase || !user || !activeDecisionId) return;
    const confirmed = window.confirm(t.deleteDecisionConfirm);
    if (!confirmed) return;

    const { error } = await supabase.from("matrices").delete().eq("id", activeDecisionId);
    if (error) {
      showError(`${t.deleteFailed} ${error.message}`);
      return;
    }

    setSavedMatrices((prev) => prev.filter((m) => m.id !== activeDecisionId));
    resetDecisionForm();
    setNotice({ type: "success", text: t.decisionDeleted });
  };

  const handleSaveMatrix = async () => {
    if (!supabase || !user) {
      openAuth("signin");
      return;
    }
    const problem = validateDecision(promptInput, criteria, options, t);
    if (problem) return showError(problem);

    const hasOutcome = actualOutcome.trim().length > 0;
    const payload = {
      user_id: user.id,
      title: promptInput.trim(),
      reason: reason.trim() || null,
      criteria: criteria.map((c) => ({ ...c, name: c.name.trim() })),
      options: options.map((o) => ({
        id: o.id,
        name: o.name.trim(),
        scores: Object.fromEntries(criteria.map((c) => [c.id, clampScore(o.scores[c.id] as number)] as const)),
      })),
      review_date: reviewDate || null,
      actual_outcome: hasOutcome ? actualOutcome.trim() : null,
      status: hasOutcome ? "reviewed" : "pending",
    };

    setSaving(true);
    setNotice(null);
    try {
      const request = activeDecisionId
        ? supabase.from("matrices").update(payload).eq("id", activeDecisionId).select()
        : supabase.from("matrices").insert([payload]).select();
      const { data, error } = await request;
      if (error) throw error;

      // RLS can block a write without returning an error, so an empty result counts as a failure.
      const row = data?.[0];
      if (!row) {
        throw new Error(activeDecisionId ? t.notUpdated : t.notSaved);
      }

      setActiveDecisionId(row.id);
      setSavedMatrices((prev) => {
        const exists = prev.some((m) => m.id === row.id);
        return exists ? prev.map((m) => (m.id === row.id ? row : m)) : [row, ...prev];
      });
      setNotice({ type: "success", text: activeDecisionId ? t.changesSaved : t.savedToVault });
      window.setTimeout(() => setNotice((n) => (n?.type === "success" ? null : n)), 3000);
    } catch (err: any) {
      const detail = [err?.message, err?.hint].filter(Boolean).join(" ");
      showError(`${t.saveFailed} ${detail || t.unknownError}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <style>{`
        @media print {
          body { background: #ffffff !important; }
          * {
            background-color: transparent !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className={`print:hidden border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/50"} backdrop-blur-md px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <a href="/settings/branding" className="flex items-center gap-3 group">
            {workspaceBranding.logo_url ? (
              <img
                src={workspaceBranding.logo_url}
                alt={t.logoAlt}
                className="w-8 h-8 object-contain rounded-lg border border-slate-700 bg-slate-900 p-0.5 group-hover:border-indigo-500 transition-colors"
              />
            ) : (
              <Sparkles className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            )}
            <h1 className="font-bold text-xl cursor-pointer text-slate-100 group-hover:text-indigo-400 transition-colors">
              {workspaceBranding.company_name}
            </h1>
          </a>
          <span className="hidden sm:inline text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
            {t.badgeProduction}
          </span>
        </div>

        {/* Right side controls (language, theme and auth) */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          aria-label={t.languageLabel}
          className="px-2 py-1 rounded-lg border border-slate-700 text-xs bg-slate-900 text-slate-100"
        >
          {(Object.keys(LANGUAGE_LABELS) as Lang[]).map((code) => (
            <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
            aria-label={t.themeToggle}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                aria-expanded={accountOpen}
                className="flex items-center gap-1.5 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300"
              >
                <UserCheck className="w-4 h-4" />
                <span className="max-w-[7rem] truncate">{user.email.split("@")[0]}</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1 z-50">
                  <p className="px-3 py-2 text-[11px] text-slate-400 break-all border-b border-slate-800">
                    {user.email}
                  </p>
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t.signOut}
                  </button>
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      handleDeleteAccount();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-slate-800 border-t border-slate-800"
                  >
                    {t.deleteAccount}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuth("signin")}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> {t.signIn}
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
        {/* History sidebar */}
        {isSidebarOpen && (
          <aside
            className={`print:hidden w-full md:w-96 shrink-0 border-b md:border-b-0 md:border-r ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white"} p-4 max-h-[70vh] md:max-h-none overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold text-slate-400">{t.historyHeading}</span>
              <button onClick={() => setIsSidebarOpen(false)} aria-label={t.closeHistory}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {user && (
              <div className={`p-3 rounded-xl border text-xs space-y-2 ${surface}`}>
                <p className="font-semibold text-slate-300">{t.yourDecisions}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{summary.total}</p>
                    <p className="text-[10px] text-slate-400">{t.statTotal}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{summary.awaiting}</p>
                    <p className="text-[10px] text-slate-400">{t.statAwaiting}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{summary.completed}</p>
                    <p className="text-[10px] text-slate-400">{t.statCompleted}</p>
                  </div>
                </div>
                {summary.nextReview && (
                  <p className="text-slate-400">{t.nextReview} {summary.nextReview}</p>
                )}
                {summary.recent.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <p className="text-slate-400">{t.recentOutcomes}</p>
                    {summary.recent.map((m) => (
                      <p key={m.id} className="text-slate-300 break-words">
                        <span className="font-semibold">{m.title}:</span> {m.actual_outcome}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              {!user ? (
                <p className="text-xs text-slate-500 italic py-4">{t.signInToSee}</p>
              ) : savedMatrices.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">{t.noDecisions}</p>
              ) : (
                savedMatrices.map((item) => {
                  const top = scoreOptions(
                    hydrateCriteria(item.criteria ?? []),
                    hydrateOptions(item.options ?? [])
                  )[0];
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleLoadSavedDecision(item)}
                      className={`p-3 rounded-xl border ${isDark ? "border-slate-800 bg-slate-900 hover:border-indigo-500" : "border-slate-200 bg-slate-50 hover:border-indigo-400"} cursor-pointer text-xs space-y-1.5`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${item.actual_outcome ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}
                        >
                          {item.actual_outcome ? t.reviewed : t.pendingReview}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString(lang) : ""}
                        </span>
                      </div>
                      <p className="font-bold text-indigo-300 break-words">{item.title}</p>
                      {top && (
                        <p className="text-slate-300">
                          {t.topChoiceLabel} {top.name} ({top.score}/100)
                        </p>
                      )}
                      {item.reason && <p className="text-slate-400 break-words">{t.whyLabel} {item.reason}</p>}
                      <p className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" /> {t.reviewLabel} {item.review_date || t.notSet}
                      </p>
                      {item.actual_outcome && (
                        <p className="text-slate-400 break-words">{t.outcomeLabel} {item.actual_outcome}</p>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-indigo-400">
                        <Edit3 className="w-3 h-3" /> {t.openToEdit}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-10 space-y-6">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="print:hidden flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400"
            >
              <History className="w-4 h-4" /> {t.history}
            </button>
          )}

          {/* Landing */}
          {viewState === "landing" && (
            <div className="text-center space-y-6 py-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {t.landingTitle}
              </h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                {t.landingLead}
              </p>
              <div className={`max-w-md mx-auto text-left text-sm space-y-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <p className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{t.howItWorks}</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t.step1}</li>
                  <li>{t.step2}</li>
                  <li>{t.step3}</li>
                  <li>{t.step4}</li>
                </ol>
              </div>
              <button
                onClick={handleStartNew}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition text-sm"
              >
                {t.startNew}
              </button>
            </div>
          )}

          {/* Input */}
          {viewState === "input" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setViewState(activeDecisionId ? "results" : "landing")}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" /> {t.back}
                </button>
                {activeDecisionId && (
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-medium">
                    {t.editingSaved}
                  </span>
                )}
              </div>

              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
                <label htmlFor="template" className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {t.templates}
                </label>
                <select
                  id="template"
                  value=""
                  onChange={(e) => handleLoadTemplate(e.target.value)}
                  className={`w-full ${field} border rounded-xl p-2.5 text-xs font-medium`}
                >
                  <option value="" disabled>
                    {t.selectTemplate}
                  </option>
                  {DECISION_TEMPLATES.map((tpl) => (
                    <option key={tpl.name} value={tpl.name}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">{t.templateHelp}</p>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl border ${surface} space-y-6`}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">{t.decisionTitle}</label>
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={t.titlePlaceholder}
                    className={`w-full ${field} border rounded-xl p-3 text-sm`}
                  />
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-400">{t.suggestedCriteria}</span>
                      {suggestions.map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => addSuggestion(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full border border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/40"
                        >
                          + {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">{t.thinkBefore}</label>
                  <select
                    value={checkCategory}
                    onChange={(e) => setCheckCategory(e.target.value as ChecklistCategory)}
                    className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
                  >
                    <option value="">{t.chooseCategory}</option>
                    {(Object.keys(CHECKLISTS) as ChecklistCategory[]).map((key) => (
                      <option key={key} value={key}>{CHECKLISTS[key].label}</option>
                    ))}
                  </select>
                  {checkCategory && (
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {CHECKLISTS[checkCategory].prompts.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">{t.whyMattersOptional}</label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t.whyPlaceholder}
                    className={`w-full ${field} border rounded-xl p-3 text-xs`}
                  />
                </div>

                {/* Criteria */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">{t.criteria}</h3>
                      <p className={`text-[11px] ${totalWeight === 0 ? "text-rose-400" : "text-slate-400"}`}>
                        {fmt(t.totalWeight, { total: totalWeight })}
                      </p>
                    </div>
                    <button
                      onClick={handleAddCriterion}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-indigo-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.addCriterion}
                    </button>
                  </div>

                  {criteria.map((crit) => (
                    <div
                      key={crit.id}
                      className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800"
                    >
                      <input
                        type="text"
                        value={crit.name}
                        placeholder={t.nameCriterion}
                        onChange={(e) => updateCriterion(crit.id, { name: e.target.value })}
                        className={`flex-1 min-w-[10rem] ${field} border rounded-lg px-2.5 py-1.5 text-xs font-bold`}
                      />
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        {t.weightPercent}
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={crit.weight}
                          onChange={(e) =>
                            updateCriterion(crit.id, {
                              weight: Math.min(100, Math.max(0, Math.round(Number(e.target.value) || 0))),
                            })
                          }
                          className={`w-16 ${field} border rounded-lg px-2 py-1 text-xs text-center`}
                        />
                      </label>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        {t.importance} {shareOf(crit.weight)}%
                      </span>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <input
                          type="checkbox"
                          checked={crit.isInverted}
                          onChange={(e) => updateCriterion(crit.id, { isInverted: e.target.checked })}
                        />
                        {t.lowerIsBetter}
                      </label>
                      <button
                        onClick={() => handleRemoveCriterion(crit.id)}
                        disabled={criteria.length <= 1}
                        className="text-rose-400 hover:text-rose-300 disabled:opacity-30 p-1"
                        aria-label={t.removeCriterion}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Options and scores */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">{t.optionsAndScores}</h3>
                    <button
                      onClick={handleAddOption}
                      className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-indigo-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.addOption}
                    </button>
                  </div>

                  {options.map((opt) => (
                    <div key={opt.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={opt.name}
                          placeholder={t.optionName}
                          onChange={(e) => updateOptionName(opt.id, e.target.value)}
                          className={`${field} border rounded-lg px-3 py-1.5 text-xs font-bold w-full max-w-xs`}
                        />
                        <button
                          onClick={() => handleRemoveOption(opt.id)}
                          disabled={options.length <= 2}
                          className="text-rose-400 hover:text-rose-300 disabled:opacity-30"
                          aria-label={t.removeOption}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {criteria.map((crit) => (
                          <label key={crit.id} className="space-y-1">
                            <span className="text-[10px] text-slate-400 block truncate">
                              {crit.name || t.unnamedCriterion}
                              {crit.isInverted ? t.lowerIsBetterParen : ""}
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              placeholder="1–10"
                              value={opt.scores[crit.id] ?? ""}
                              onChange={(e) => setScore(opt.id, crit.id, parseScoreInput(e.target.value))}
                              onBlur={() => clampOnBlur(opt.id, crit.id)}
                              className={`w-full ${field} border rounded-lg px-2.5 py-1.5 text-xs`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {missingScores && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800">
                    {t.scoresEmpty}
                  </p>
                )}
                <button
                  onClick={handleCalculate}
                  disabled={missingScores}
                  className={`w-full font-medium py-3 rounded-xl transition text-sm shadow ${
                    missingScores
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {t.calculate}
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {viewState === "results" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1 min-w-0">
                  <h2 className="text-2xl font-bold break-words">{promptInput.trim() || t.decisionAnalysis}</h2>
                  {activeDecisionId && <p className="text-[11px] text-amber-400 print:hidden">{t.savedInVault}</p>}
                </div>
                <div className="print:hidden flex flex-wrap gap-2">
                  <button
                    onClick={() => setViewState("input")}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" /> {t.edit}
                  </button>
                  <ExportMenu
                    onExportCSV={handleExportCSV}
                    label={t.exportCsv}
                    csvLabel={t.exportCsvOption}
                    printLabel={t.exportPrintOption}
                    phoneHint={t.exportPhoneHint}
                  />
                  <button
                    onClick={handleSaveMatrix}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-medium px-4 py-2 rounded-xl shadow"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? t.saving : activeDecisionId ? t.update : t.save}
                  </button>
                  {activeDecisionId && (
                    <button
                      onClick={handleDeleteMatrix}
                      className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium px-4 py-2 rounded-xl border border-rose-800"
                    >
                      {t.deleteDecision}
                    </button>
                  )}
                </div>
              </div>

              {reason.trim() && (
                <div className={`p-3 rounded-xl border text-sm ${surface}`}>
                  <span className="block text-xs font-bold text-slate-400 mb-1">{t.whyMattersTitle}</span>
                  <span className="break-words">{reason}</span>
                </div>
              )}
              {weakResult && (
                <div className="p-3 rounded-xl border border-amber-700 bg-amber-950/40 text-amber-200 text-xs">
                  {fmt(t.weakResult, { score: ranked[0].score })}
                </div>
              )}
              <p className="text-[11px] text-slate-400">
                {fmt(t.overallFormula, { score: ranked[0]?.score ?? 0 })}
              </p>
              <div className="p-4 rounded-xl border border-indigo-800/50 bg-indigo-950/30 text-indigo-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Brain className="w-4 h-4 text-indigo-400" /> {t.automaticCheck}
                </div>
                {ranked[0] && (
                  <p>
                    {fmt(t.highestScore, { name: ranked[0].name, score: ranked[0].score })}
                  </p>
                )}
                <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-1">
                  {checks.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ranked.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`p-5 rounded-2xl border space-y-3 ${idx === 0 ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800 bg-slate-900"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-bold text-indigo-400">
                        {idx === 0 ? t.topChoice : fmt(t.rankN, { n: idx + 1 })}
                      </span>
                      <span className="text-lg font-extrabold">{opt.score}/100</span>
                    </div>
                    <h3 className="text-lg font-bold break-words">{opt.name}</h3>
                    <ul className="space-y-1.5 border-t border-slate-800 pt-3">
                      {criteria.map((crit) => (
                        <li key={crit.id} className="flex justify-between gap-3 text-xs">
                          <span className="text-slate-400 break-words">
                            {crit.name || t.unnamedCriterion}
                            {crit.isInverted ? t.lowerIsBetterParen : ""} · {t.importance} {shareOf(crit.weight)}%
                          </span>
                          <span className="font-semibold text-slate-200 whitespace-nowrap">
                            {opt.scores[crit.id] ?? "–"}/10
                          </span>
                        </li>
                      ))}
                    </ul>
                    {(() => {
                      const runnerUp = idx === 0 ? ranked[1] : undefined;
                      const ex = explain(criteria, opt, runnerUp);
                      return (
                        <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                          <p className="font-semibold text-slate-300">{t.whyItRanks}</p>
                          {ex.top.map((item) => (
                            <p key={item.criterionId} className="text-slate-400">
                              {fmt(t.addedPoints, {
                                name: item.name,
                                points: Math.round(item.points),
                                max: Math.round(item.maxPoints),
                              })}
                            </p>
                          ))}
                          {ex.weak.map((w) => (
                            <p key={w.criterionId} className="text-slate-500">
                              {fmt(t.weakest, {
                                name: w.name,
                                points: Math.round(w.points),
                                max: Math.round(w.maxPoints),
                              })}
                            </p>
                          ))}
                          {ex.gains.map((g) => (
                            <p key={g.name} className="text-emerald-400">
                              {fmt(t.aheadRunnerUp, { name: g.name, n: Math.round(g.diff) })}
                            </p>
                          ))}
                          {ex.losses.map((l) => (
                            <p key={l.name} className="text-rose-400">
                              {fmt(t.behindRunnerUp, { name: l.name, n: Math.round(-l.diff) })}
                            </p>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-2xl border space-y-4 ${surface}`}>
                <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                  <Calendar className="w-4 h-4" /> {t.reviewLoop}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-xs text-slate-400 space-y-1">
                    {t.reviewDate}
                    <input
                      type="date"
                      value={reviewDate}
                      onChange={(e) => setReviewDate(e.target.value)}
                      className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
                    />
                  </label>
                  <label className="block text-xs text-slate-400 space-y-1">
                    {t.actualOutcome}
                    <input
                      type="text"
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder={t.outcomePlaceholder}
                      className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">
                  {fmt(t.statusLine, {
                    status: actualOutcome.trim() ? t.reviewed : t.statusPending,
                  })}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-slate-800 p-4 text-center text-xs text-slate-400 space-x-4">
        <a href="/privacy" className="underline hover:text-slate-200">{t.privacyPolicy}</a>
        <a href="/terms" className="underline hover:text-slate-200">{t.termsOfUse}</a>
        <a href="mailto:decisionloop.help@gmail.com" className="underline hover:text-slate-200">{t.contact}</a>
      </footer>

      {/* Auth modal */}
      {showAuthModal && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            {notice && (
              <div
                className={`print:hidden p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  notice.type === "error"
                    ? "bg-rose-950/40 border-rose-800 text-rose-300"
                    : "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                }`}
              >
                {notice.type === "error" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                )}
                <span>{notice.text}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">
                {authMode === "signin" ? t.signIn : t.createVault}
              </h3>
              <button onClick={closeAuth} aria-label={t.close}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => openAuth("signin")}
                className={`py-1.5 rounded-lg font-medium transition ${authMode === "signin" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                {t.signIn}
              </button>
              <button
                onClick={() => openAuth("signup")}
                className={`py-1.5 rounded-lg font-medium transition ${authMode === "signup" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                {t.createAccount}
              </button>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800">{authError}</p>
            )}
            {authSuccessMsg && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800 flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccessMsg}</span>
              </div>
            )}

            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={`w-full ${field} border rounded-xl p-2.5 text-xs`}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={authMode === "signup" ? t.passwordPlaceholderSignup : t.passwordPlaceholder}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full ${field} border rounded-xl p-2.5 pr-10 text-xs`}
              />
              {authMode === "signin" && (
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleAuthSubmit}
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-medium transition shadow-lg"
            >
              {authLoading ? t.pleaseWait : authMode === "signin" ? t.signIn : t.createAccount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
