"use client";

import React, { useState } from "react";
import { Home, LayoutGrid, BarChart3, ShieldCheck, Users, Settings, Sparkles, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { HOME_STRINGS } from "@/lib/homeStrings";
import { TOOL_STRINGS } from "@/lib/toolStrings";
import { QUICK_TOOLS, TOOLS, type ToolDef, type ToolId } from "@/lib/tools";
import DesktopHome from "./DesktopHome";
import type { HomeMessage } from "@/lib/homeMessages";
import type { NextStep } from "@/lib/nextStep";
import { PLAN_ONLY_ACTIONS } from "@/lib/nextStep";
import { nextStepText } from "@/lib/nextStepStrings";
import NextStepCard from "./NextStepCard";
import { InfoSections } from "./FeatureInfo";

type Props = {
  lang: Lang;
  onStartDecision: () => void;
  onOpenVault: () => void;
  onOpenProgress: () => void;
  onCreatePlan: () => void;
  onOpenSettings: () => void;
  message: HomeMessage;
  nextStep?: NextStep | null;
  onOpenNextStep?: (step: NextStep, focused: boolean) => void;
};

type HomeText = (typeof HOME_STRINGS)["en"];
type ToolText = (typeof TOOL_STRINGS)["en"];
type Tile = ToolDef & { title: string };

// The name shown on each tile, taken from the home or tool strings.
const titleOf: Record<ToolId, (h: HomeText, x: ToolText) => string> = {
  assistant: (h) => h.featAssistant,
  solver: (h) => h.featSolver,
  calc: (h) => h.featCalc,
  plan: (h) => h.playbook,
  marketing: (_, x) => x.marketing,
  opportunity: (_, x) => x.opportunity,
  growth: (h) => h.featGrowth,
  business: (h) => h.featBusiness,
  creative: (h) => h.featCreative,
  accountability: (_, x) => x.accountability,
  journal: (_, x) => x.journal,
  vault: (_, x) => x.vault,
};

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25";

export default function HomeDashboard({
  lang, onStartDecision, onOpenVault, onOpenProgress, onCreatePlan, onOpenSettings, message, nextStep, onOpenNextStep,
}: Props) {
  const h = HOME_STRINGS[lang];
  const x = TOOL_STRINGS[lang];
  // Title of a tool that is not built yet, shown in the "Coming soon" box.
  const [soonTitle, setSoonTitle] = useState<string | null>(null);
  // The tool behind the "Coming soon" box, so its information can be shown there.
  const [soonTool, setSoonTool] = useState<ToolId | null>(null);
  const showSoon = (title: string, tool: ToolId) => {
    setSoonTitle(title);
    setSoonTool(tool);
  };
  // On phones the full tools list stays hidden until "See all" is tapped.
  const [showAllTools, setShowAllTools] = useState(false);

  // All tools come from the tool list, in home page order.
  const tiles: Tile[] = TOOLS.map((tool) => ({ ...tool, title: titleOf[tool.id](h, x) }));

  const openTile = (tile: Tile) => {
    if (tile.action === "calc") return onStartDecision();
    if (tile.action === "plan") return onCreatePlan();
    if (tile.action === "vault") return onOpenVault();
    showSoon(tile.title, tile.id);
  };

  return (
    <>
    {nextStep && onOpenNextStep && (
      <div className="mb-6">
        <NextStepCard
          lang={lang}
          step={nextStep}
          context="home"
          onPrimary={() => onOpenNextStep(nextStep, !PLAN_ONLY_ACTIONS.includes(nextStep.action))}
          onSecondary={
            PLAN_ONLY_ACTIONS.includes(nextStep.action) || nextStep.action === "create_plan"
              ? undefined
              : () => onOpenNextStep(nextStep, false)
          }
          secondaryLabel={nextStepText(lang, nextStep).viewPlan}
        />
      </div>
    )}
    {/* Phones and tablets: the layout below. Large screens show DesktopHome instead. */}
    <div id="top" className="relative overflow-hidden rounded-3xl text-slate-100 lg:hidden">
      <div className="flex">
        {/* Sidebar for tablet and computer */}
        <aside className={`hidden md:flex w-52 shrink-0 flex-col gap-1 p-4 mt-8 md:mr-10 ${panel} border-y-0 border-l-0`}>
          <SideItem label={h.navHome} icon={Home} active href="#top" />
          <SideItem label={h.navAssistant} icon={Sparkles} onClick={() => showSoon(h.navAssistant, "assistant")} />
          <SideItem label={h.navTools} icon={LayoutGrid} href="#features" />
          <SideItem label={h.navProgress} icon={BarChart3} onClick={onOpenProgress} />
          <SideItem label={h.navVault} icon={ShieldCheck} onClick={onOpenVault} />
          <SideItem label={h.navCommunity} icon={Users} onClick={() => showSoon(h.navCommunity, "accountability")} />
          <SideItem label={h.navSettings} icon={Settings} onClick={onOpenSettings} />
        </aside>

        <div className="flex-1 min-w-0 p-4 sm:p-6 pb-28 md:pb-6 space-y-6">
          {/* Hero */}
          <section className={`relative grid grid-cols-1 md:grid-cols-[1fr_minmax(0,16rem)] items-center gap-4 rounded-2xl ${panel} p-5 sm:p-7 overflow-hidden`}>
            <div className="space-y-3 max-w-xl">
              <p className="text-xs text-indigo-300">{h.tagline}</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">{h.headline}</h2>
              <p className="text-sm text-slate-300">{h.subline}</p>
              <p className="pt-1 text-sm font-semibold text-indigo-100">{message.main}</p>
              <button
                type="button"
                onClick={() => showSoon(h.askButton, "assistant")}
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
                .filter((tile) => QUICK_TOOLS.includes(tile.id))
                .map((tile) => (
                  <button
                    key={tile.id}
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
                  key={tile.id}
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
          onClick={() => showSoon(h.navAssistant, "assistant")}
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
          {soonTool && <InfoSections toolId={soonTool} lang={lang} />}
          </div>
        </div>
      )}
    </div>

    <DesktopHome
      lang={lang}
      tiles={tiles}
      onOpenTile={openTile}
      onOpenVault={onOpenVault}
      onOpenProgress={onOpenProgress}
      message={message}
    />
    </>
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
