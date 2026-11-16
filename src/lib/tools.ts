// The 12 tools, in home page order. Every tile on the home page is built from this list.
// A tool with action "soon" shows the "Coming soon" box until its screen is built.

export type ToolId =
  | "assistant"
  | "solver"
  | "calc"
  | "plan"
  | "marketing"
  | "opportunity"
  | "growth"
  | "business"
  | "creative"
  | "accountability"
  | "journal"
  | "vault";

export type ToolModule =
  | "intelligence"
  | "decision"
  | "productivity"
  | "business"
  | "opportunities"
  | "growth"
  | "creative"
  | "community";

// Which screen a tile opens. "soon" means no screen yet.
export type ToolAction = "calc" | "plan" | "vault" | "soon";

export type ToolDef = {
  id: ToolId;
  // File name in public/icons, without ".png".
  img: string;
  module: ToolModule;
  action: ToolAction;
};

export const TOOLS: ToolDef[] = [
  { id: "assistant", img: "ai-assistant", module: "intelligence", action: "soon" },
  { id: "solver", img: "problem-solver", module: "intelligence", action: "soon" },
  { id: "calc", img: "decision-calculator", module: "decision", action: "calc" },
  { id: "plan", img: "execution-playbook", module: "productivity", action: "plan" },
  { id: "marketing", img: "marketing-coach", module: "business", action: "soon" },
  { id: "opportunity", img: "opportunity-finder", module: "opportunities", action: "soon" },
  { id: "growth", img: "growth-centre", module: "growth", action: "soon" },
  { id: "business", img: "business-builder", module: "business", action: "soon" },
  { id: "creative", img: "creative-studio", module: "creative", action: "soon" },
  { id: "accountability", img: "accountability-partner", module: "community", action: "soon" },
  { id: "journal", img: "assumption-journal", module: "decision", action: "soon" },
  { id: "vault", img: "decision-vault", module: "decision", action: "vault" },
];

// The most-used tools, shown first on phones.
export const QUICK_TOOLS: ToolId[] = ["calc", "plan", "vault"];
