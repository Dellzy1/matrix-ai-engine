"use client";

import React, { useState } from "react";
import {
  ArrowRight, BarChart3, Home, LayoutGrid, ShieldCheck, Sparkles, Users, X,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { HOME_STRINGS } from "@/lib/homeStrings";
import { DESKTOP_STRINGS } from "@/lib/desktopStrings";
import type { ToolDef, ToolId } from "@/lib/tools";
import type { HomeMessage } from "@/lib/homeMessages";
import { InfoSections } from "./FeatureInfo";

// The computer home screen (large screens only). Phones and tablets use HomeDashboard.
type Tile = ToolDef & { title: string };

type Props = {
  lang: Lang;
  tiles: Tile[];
  onOpenTile: (tile: Tile) => void;
  onOpenVault: () => void;
  onOpenProgress: () => void;
  message: HomeMessage;
};

// Placement follows the mockup: three tools on each side of the hero, six along the bottom.
const LEFT: ToolId[] = ["assistant", "solver", "opportunity"];
const RIGHT: ToolId[] = ["growth", "business", "creative"];
const BOTTOM: ToolId[] = ["calc", "plan", "marketing", "accountability", "journal", "vault"];

const panel = "bg-[#0b0f2a]/70 border border-indigo-500/25 rounded-2xl";

export default function DesktopHome({ lang, tiles, onOpenTile, onOpenVault, onOpenProgress, message }: Props) {
  const h = HOME_STRINGS[lang];
  const d = DESKTOP_STRINGS[lang];
  // Title of a tool that is not built yet, shown in the "Coming soon" box.
  const [soonTitle, setSoonTitle] = useState<string | null>(null);
  // The tool behind the "Coming soon" box, so its information can be shown there.
  const [soonTool, setSoonTool] = useState<ToolId | null>(null);
  const showSoon = (title: string, tool: ToolId) => {
    setSoonTitle(title);
    setSoonTool(tool);
  };

  const pick = (ids: ToolId[]) =>
    ids.map((id) => tiles.find((x) => x.id === id)).filter((x): x is Tile => !!x);

  const openTile = (tile: Tile) => {
    if (tile.action === "soon") return showSoon(tile.title, tile.id);
    onOpenTile(tile);
  };

  const sideCard = (tile: Tile) => (
    <button
      key={tile.id}
      type="button"
      onClick={() => openTile(tile)}
      className={`flex w-full items-center gap-4 text-left ${panel} p-4 hover:border-indigo-400 transition`}
    >
      <img src={`/icons/${tile.img}.png`} alt="" className="w-20 h-20 shrink-0 object-contain" />
      <span className="text-base font-bold leading-tight">{tile.title}</span>
    </button>
  );

  const bottomCard = (tile: Tile) => (
    <button
      key={tile.id}
      type="button"
      onClick={() => openTile(tile)}
      className={`flex flex-col items-center gap-2 text-center ${panel} p-3 hover:border-indigo-400 transition`}
    >
      <img src={`/icons/${tile.img}.png`} alt="" className="w-16 h-16 object-contain" />
      <span className="text-xs font-semibold leading-tight">{tile.title}</span>
    </button>
  );

  const nav = [
    { label: h.navHome, icon: Home, active: true, onClick: () => {} },
    { label: h.navAssistant, icon: Sparkles, active: false, onClick: () => showSoon(h.navAssistant, "assistant") },
    {
      label: h.navTools,
      icon: LayoutGrid,
      active: false,
      onClick: () => document.getElementById("desktop-tools")?.scrollIntoView({ behavior: "smooth" }),
    },
    { label: h.navProgress, icon: BarChart3, active: false, onClick: onOpenProgress },
    { label: h.navVault, icon: ShieldCheck, active: false, onClick: onOpenVault },
    { label: h.navCommunity, icon: Users, active: false, onClick: () => showSoon(h.navCommunity, "accountability") },
  ];

  // Each stage opens the tool that matches it. Market is not built yet, so it shows "Coming soon".
  const openById = (id: ToolId) => {
    const tile = tiles.find((x) => x.id === id);
    if (tile) openTile(tile);
  };
  const journey = [
    { key: "decide", img: "journey-decide", label: d.decide, go: () => openById("calc") },
    { key: "plan", img: "journey-plan", label: d.plan, go: () => openById("plan") },
    { key: "execute", img: "journey-execute", label: d.execute, go: () => openById("plan") },
    { key: "market", img: "journey-market", label: d.market, go: () => openById("marketing") },
    { key: "review", img: "journey-review", label: d.review, go: onOpenProgress },
    { key: "achieve", img: "journey-achieve", label: d.achieve, go: onOpenVault },
  ];

  return (
    <div className="hidden lg:block text-slate-100 space-y-6">
      {/* Top navigation */}
      <nav className={`${panel} flex items-center justify-center gap-2 px-4 py-2`}>
        {nav.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center gap-1 rounded-xl px-5 py-2 text-xs font-medium ${
              item.active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-indigo-500/20"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Headline */}
      <section className="text-center space-y-2">
        <h2 className="text-3xl xl:text-4xl font-extrabold">{h.headline}</h2>
        <p className="text-slate-300">{h.subline}</p>
        <p className="pt-2 text-base font-semibold text-indigo-100">{message.main}</p>
      </section>

      {/* Three tools on each side of the hero */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-center">
        <div className="space-y-4">{pick(LEFT).map(sideCard)}</div>

        <div className="flex flex-col items-center gap-5">
          <img
            src="/brain.jpg"
            alt=""
            aria-hidden="true"
            className="w-full max-w-md mix-blend-screen pointer-events-none select-none"
          />
          <button
            type="button"
            onClick={() => showSoon(h.askButton, "assistant")}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> {h.askButton}
          </button>
        </div>

        <div className="space-y-4">{pick(RIGHT).map(sideCard)}</div>
      </div>

      {/* All tools along the bottom */}
      <section id="desktop-tools" className="space-y-3">
        <h3 className="text-base font-bold">{h.explore}</h3>
        <div className="grid grid-cols-6 gap-3">{pick(BOTTOM).map(bottomCard)}</div>
      </section>

      {/* Journey strip and closing card */}
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
        <div className={`${panel} p-5 flex flex-wrap items-center gap-4`}>
          <p className="font-bold">{d.journeyTitle}</p>
          <div className="flex flex-1 items-center justify-around gap-2">
            {journey.map((stage, index) => (
              <React.Fragment key={stage.key}>
                {index > 0 && <ArrowRight className="w-4 h-4 text-indigo-400" />}
                <button
                  type="button"
                  onClick={stage.go}
                  className="flex flex-col items-center gap-1 text-xs hover:text-indigo-300"
                >
                  <img src={`/icons/${stage.img}.png`} alt="" className="w-16 h-16 object-contain" />
                  <span>{stage.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={`${panel} p-5 flex items-center gap-3`}>
          <img src="/icons/star-badge.png" alt="" className="w-14 h-14 shrink-0 object-contain" />
          <div>
            <p className="text-sm font-semibold">{message.daily}</p>
            <p className="text-xs text-indigo-200">{d.starSub}</p>
          </div>
        </div>
      </div>

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
  );
}
