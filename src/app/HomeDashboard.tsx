"use client";

import React, { useState } from "react";
import { Home, LayoutGrid, BarChart3, ShieldCheck, Users, Settings, Sparkles, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { HOME_STRINGS } from "@/lib/homeStrings";
import { TOOL_STRINGS } from "@/lib/toolStrings";

type Props = {
  lang: Lang;
  onStartDecision: () => void;
  onOpenVault: () => void;
  onOpenProgress: () => void;
  onCreatePlan: () => void;
  onOpenSettings: () => void;
};

type Tile = {
  key: string;
  title: string;
  img: string;
  action: "calc" | "plan" | "vault" | "soon";
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25";

// The most-used tools, shown first on phones.
const QUICK_KEYS = ["calc", "plan", "vault"];

export default function HomeDashboard({
  lang, onStartDecision, onOpenVault, onOpenProgress, onCreatePlan, onOpenSettings,
}: Props) {
  const h = HOME_STRINGS[lang];
  const x = TOOL_STRINGS[lang];
  // Title of a tool that is not built yet, shown in the "Coming soon" box.
  const [soonTitle, setSoonTitle] = useState<string | null>(null);
  // On phones the full tools list stays hidden until "See all" is tapped.
  const [showAllTools, setShowAllTools] = useState(false);

  // All tools, in the order of the mockup. Only calc, plan and vault open a working screen.
  const tiles: Tile[] = [
    { key: "assistant", title: h.featAssistant, img: "ai-assistant", action: "soon" },
    { key: "solver", title: h.featSolver, img: "problem-solver", action: "soon" },
    { key: "calc", title: h.featCalc, img: "decision-calculator", action: "calc" },
    { key: "plan", title: h.playbook, img: "execution-playbook", action: "plan" },
    { key: "marketing", title: x.marketing, img: "marketing-coach", action: "soon" },
    { key: "opportunity", title: x.opportunity, img: "opportunity-finder", action: "soon" },
    { key: "growth", title: h.featGrowth, img: "growth-centre", action: "soon" },
    { key: "business", title: h.featBusiness, img: "business-builder", action: "soon" },
    { key: "creative", title: h.featCreative, img: "creative-studio", action: "soon" },
    { key: "accountability", title: x.accountability, img: "accountability-partner", action: "soon" },
    { key: "journal", title: x.journal, img: "assumption-journal", action: "soon" },
    { key: "vault", title: x.vault, img: "decision-vault", action: "vault" },
  ];

  const openTile = (tile: Tile) => {
    if (tile.action === "calc") return onStartDecision();
    if (tile.action === "plan") return onCreatePlan();
    if (tile.action === "vault") return onOpenVault();
    setSoonTitle(tile.title);
  };

  return (
    <div id="top" className="relative overflow-hidden rounded-3xl text-slate-100">
      <div className="flex">
        {/* Sidebar for tablet and computer */}
        <aside className={`hidden md:flex w-52 shrink-0 flex-col gap-1 p-4 mt-8 ${panel} border-y-0 border-l-0`}>
          <SideItem label={h.navHome} icon={Home} active href="#top" />
          <SideItem label={h.navAssistant} icon={Sparkles} onClick={() => setSoonTitle(h.navAssistant)} />
          <SideItem label={h.navTools} icon={LayoutGrid} href="#features" />
          <SideItem label={h.navProgress} icon={BarChart3} onClick={onOpenProgress} />
          <SideItem label={h.navVault} icon={ShieldCheck} onClick={onOpenVault} />
          <SideItem label={h.navCommunity} icon={Users} onClick={() => setSoonTitle(h.navCommunity)} />
          <SideItem label={h.navSettings} icon={Settings} onClick={onOpenSettings} />
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

          {/* Quick access for phones: only the most-used tools */}
          <section className="md:hidden space-y-3">
            <h3 className="text-sm font-bold">{h.quickAccess}</h3>
            <div className={`grid grid-cols-3 gap-2 rounded-2xl ${panel} p-3`}>
              {tiles
                .filter((tile) => QUICK_KEYS.includes(tile.key))
                .map((tile) => (
                  <button
                    key={tile.key}
                    type="button"
                    onClick={() => openTile(tile)}
                    className="flex flex-col items-center gap-2 rounded-xl bg-[#11163a]/80 p-3 text-center text-xs font-semibold"
                  >
                    <img src={`/icons/${tile.img}.png`} alt="" className="w-12 h-12 object-contain" />
                    <span className="leading-tight">{tile.title}</span>
                  </button>
                ))}
            </div>
            {!showAllTools && (
              <button
                type="button"
                onClick={() => setShowAllTools(true)}
                className="w-full rounded-xl border border-indigo-400/50 py-2.5 text-xs font-medium text-indigo-200 hover:bg-indigo-500/20"
              >
                {h.seeAll}
              </button>
            )}
          </section>

          {/* All tools: always on tablet and computer, on phones only after "See all" */}
          <section id="features" className={`${showAllTools ? "block" : "hidden"} md:block space-y-3`}>
            <h3 className="text-base font-bold">{h.explore}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {tiles.map((tile) => (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => openTile(tile)}
                  className={`flex flex-col items-center gap-2 rounded-2xl ${panel} p-3 text-center text-xs font-semibold hover:border-indigo-400 transition`}
                >
                  <img src={`/icons/${tile.img}.png`} alt="" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                  <span className="leading-tight">{tile.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom navigation for phones */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-end justify-around border-t border-indigo-500/25 bg-[#0b0f2a]/95 px-2 pt-2 pb-3">
        <BottomItem label={h.navHome} icon={Home} href="#top" />
        <BottomItem label={h.navProgress} icon={BarChart3} onClick={onOpenProgress} />
        <button
          type="button"
          onClick={() => setSoonTitle(h.navAssistant)}
          className="-mt-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 p-3.5 shadow-lg"
          aria-label={h.navAssistant}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <BottomItem label={h.navVault} icon={ShieldCheck} onClick={onOpenVault} />
        <BottomItem label={h.navSettings} icon={Settings} onClick={onOpenSettings} />
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
