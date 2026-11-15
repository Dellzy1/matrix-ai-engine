"use client";

import React, { useState } from "react";
import {
  Home, MessageSquare, LayoutGrid, BarChart3, ShieldCheck, Users, Settings,
  Sparkles, MoreHorizontal, Lightbulb, GraduationCap, Briefcase, Palette, Scale, Target, X,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { HOME_STRINGS } from "@/lib/homeStrings";

type Props = {
  lang: Lang;
  onStartDecision: () => void;
  onOpenVault: () => void;
  onCreatePlan: () => void;
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25";

export default function HomeDashboard({ lang, onStartDecision, onOpenVault, onCreatePlan }: Props) {
  const h = HOME_STRINGS[lang];
  // Title of a tool that is not built yet, shown in the "Coming soon" box.
  const [soonTitle, setSoonTitle] = useState<string | null>(null);

  const features = [
    { key: "assistant", title: h.featAssistant, sub: h.featAssistantSub, img: "ai-assistant", color: "" },
    { key: "solver", title: h.featSolver, sub: h.featSolverSub, img: "problem-solver", color: "" },
    { key: "growth", title: h.featGrowth, sub: h.featGrowthSub, img: "growth-centre", color: "" },
    { key: "business", title: h.featBusiness, sub: h.featBusinessSub, img: "business-builder", color: "" },
    { key: "creative", title: h.featCreative, sub: h.featCreativeSub, img: "creative-studio", color: "" },
    { key: "calc", title: h.featCalc, sub: h.featCalcSub, img: "decision-calculator", color: "" },
  ];

  const openFeature = (key: string, title: string) => {
    if (key === "calc") return onStartDecision();
    setSoonTitle(title);
  };

  return (
    <div
      id="top"
      className="relative overflow-hidden rounded-3xl text-slate-100"
    >
      <div className="flex">
        {/* Sidebar for tablet and computer */}
        <aside className={`hidden md:flex w-52 shrink-0 flex-col gap-1 p-4 ${panel} border-y-0 border-l-0`}>
          <SideItem label={h.navHome} icon={Home} active href="#top" />
          <SideItem label={h.navAssistant} icon={MessageSquare} onClick={() => setSoonTitle(h.navAssistant)} />
          <SideItem label={h.navTools} icon={LayoutGrid} href="#features" />
          <SideItem label={h.navProgress} icon={BarChart3} onClick={onOpenVault} />
          <SideItem label={h.navVault} icon={ShieldCheck} onClick={onOpenVault} />
          <SideItem label={h.navCommunity} icon={Users} onClick={() => setSoonTitle(h.navCommunity)} />
          <SideItem label={h.navSettings} icon={Settings} onClick={() => setSoonTitle(h.navSettings)} />
        </aside>

        <div className="flex-1 min-w-0 p-4 sm:p-6 pb-28 md:pb-6 space-y-6">
          {/* Hero */}
          <section className={`relative grid grid-cols-1 md:grid-cols-[1fr_minmax(0,16rem)] items-center gap-4 rounded-2xl ${panel} p-5 sm:p-7 overflow-hidden`}>
            <div className="space-y-3 max-w-xl">
              <p className="text-xs text-indigo-300">{h.tagline}</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">{h.headline}</h2>
              <p className="text-sm text-slate-300">{h.subline}</p>
              <button
                type="button"
                onClick={() => setSoonTitle(h.askButton)}
                className="mt-1 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg transition"
              >
                <Sparkles className="w-4 h-4" /> {h.askButton}
              </button>
            </div>
            <img
              src="/brain.jpg"
              alt=""
              aria-hidden="true"
              className="w-full max-w-xs mx-auto md:max-w-none mix-blend-screen pointer-events-none select-none"
            />
          </section>

          {/* Quick access for phones */}
          <section className="md:hidden space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">{h.quickAccess}</h3>
              <span className="text-xs text-indigo-300">{h.seeAll}</span>
            </div>
            <div className={`grid grid-cols-3 gap-2 rounded-2xl ${panel} p-3`}>
              {features.slice(0, 3).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => openFeature(f.key, f.title)}
                  className="flex flex-col items-center gap-2 rounded-xl bg-[#11163a]/80 p-3 text-center text-xs font-semibold"
                >
                  <img src={`/icons/${f.img}.png`} alt="" className="w-12 h-12 object-contain" />
                  {f.title}
                </button>
              ))}
            </div>
          </section>

          {/* Ideas banner for phones */}
          <section className="md:hidden rounded-2xl border border-indigo-400/40 bg-gradient-to-r from-indigo-700/60 to-blue-700/40 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold">{h.ideasTitle}</p>
              <p className="text-xs text-slate-200">{h.ideasSub}</p>
            </div>
            <button
              type="button"
              onClick={onCreatePlan}
              className="shrink-0 rounded-full bg-white/10 p-2"
              aria-label={h.getStarted}
            >
              <Target className="w-5 h-5" />
            </button>
          </section>

          {/* Feature grid */}
          <section id="features" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">{h.explore}</h3>
              <span className="text-xs text-indigo-300">{h.viewAll}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => openFeature(f.key, f.title)}
                  className={`text-left rounded-2xl ${panel} p-4 hover:border-indigo-400 transition space-y-2`}
                >
                  <img src={`/icons/${f.img}.png`} alt="" className="w-16 h-16 object-contain" />
                  <p className="font-bold text-sm">{f.title}</p>
                  <p className="text-xs text-slate-400">{f.sub}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Execution Playbook banner */}
          <section className={`flex items-center justify-between gap-4 rounded-2xl ${panel} p-5`}>
            <div className="flex items-center gap-4 min-w-0">
              <span className="shrink-0 rounded-xl p-3 text-indigo-300 bg-indigo-500/20"><Target className="w-6 h-6" /></span>
              <div className="min-w-0">
                <p className="font-bold">{h.playbook}</p>
                <p className="text-xs text-slate-400">{h.playbookSub}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCreatePlan}
              className="shrink-0 rounded-xl border border-indigo-400/50 px-3 py-2 text-xs font-medium text-indigo-200 hover:bg-indigo-500/20"
            >
              {h.getStarted}
            </button>
          </section>
        </div>
      </div>

      {/* Bottom navigation for phones */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-end justify-around border-t border-indigo-500/25 bg-[#0b0f2a]/95 px-2 pt-2 pb-3">
        <BottomItem label={h.navHome} icon={Home} href="#top" />
        <BottomItem label={h.navTools} icon={LayoutGrid} href="#features" />
        <button
          type="button"
          onClick={() => setSoonTitle(h.navAssistant)}
          className="-mt-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 p-3.5 shadow-lg"
          aria-label={h.navAssistant}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <BottomItem label={h.navProgress} icon={BarChart3} onClick={onOpenVault} />
        <BottomItem label={h.navMore} icon={MoreHorizontal} onClick={() => setSoonTitle(h.navMore)} />
      </nav>

      {/* Coming soon box */}
      {soonTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSoonTitle(null)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-indigo-500/40 bg-[#0b0f2a] p-6 space-y-3 text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold">{soonTitle}</p>
              <button type="button" onClick={() => setSoonTitle(null)} aria-label={h.closeNote}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300">
              {h.comingSoon}
            </span>
            <p className="text-sm text-slate-300">{h.comingSoonText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SideItem({
  label, icon: Icon, active, href, onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const cls = `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
    active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-indigo-500/20"
  }`;
  if (href) {
    return (
      <a href={href} className={cls}>
        <Icon className="w-4 h-4" /> {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function BottomItem({
  label, icon: Icon, href, onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <Icon className="w-5 h-5" />
      <span className="text-[10px]">{label}</span>
    </>
  );
  const cls = "flex flex-col items-center gap-1 text-slate-300 px-2";
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}
