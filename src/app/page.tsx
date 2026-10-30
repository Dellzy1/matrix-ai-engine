"use client";

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
  Search,
} from "lucide-react";

// --- Currencies & Rates ---
const CURRENCIES: Record<string, { code: string; symbol: string; rate: number }> = {
  USD: { code: "USD", symbol: "$", rate: 1 },
  EUR: { code: "EUR", symbol: "€", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", rate: 0.79 },
  JPY: { code: "JPY", symbol: "¥", rate: 155.0 },
  CAD: { code: "CAD", symbol: "C$", rate: 1.36 },
};

// --- Translations ---
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "MatrixAI Engine",
    subtitle: "AI-Driven Decision Analysis & Evaluation Matrix",
    generate: "Generate Matrix",
    analyzing: "Analyzing...",
    save: "Save Matrix",
    export: "Export Data",
    history: "Saved Matrices",
  },
  es: {
    title: "Motor MatrixAI",
    subtitle: "Análisis de Decisiones e Evaluación Guiado por IA",
    generate: "Generar Matriz",
    analyzing: "Analizando...",
    save: "Guardar Matriz",
    export: "Exportar Datos",
    history: "Matrices Guardadas",
  },
  fr: {
    title: "Moteur MatrixAI",
    subtitle: "Analyse de Décision et Matrice d'Évaluation IA",
    generate: "Générer la Matrice",
    analyzing: "Analyse en cours...",
    save: "Enregistrer",
    export: "Exporter",
    history: "Historique",
  },
};

export default function App() {
  const [lang, setLang] = useState<string>("en");
  const [currency, setCurrency] = useState<string>("USD");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS["en"];
  }, [lang]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <header className="border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold text-xl">{t.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={lang}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLang(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-sm rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <select
              value={currency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-sm rounded px-2 py-1"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 border-r border-slate-800 p-4 min-h-[calc(100vh-65px)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-slate-400">{t.history}</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <p className="text-xs text-slate-500 italic text-center mt-8">No saved matrices yet.</p>
          </aside>
        )}

        {/* Dashboard Canvas */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">{t.subtitle}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Evaluate decisions, assign weights, and generate automated AI matrix recommendations in real-time.
            </p>

            <div className="pt-6 flex justify-center gap-4">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition">
                <Sparkles className="w-5 h-5" />
                {t.generate}
              </button>
              <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium px-6 py-3 rounded-lg transition">
                <Sliders className="w-5 h-5" />
                Configure Weights
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}