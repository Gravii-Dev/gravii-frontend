import type { PanelConfig, PanelId } from "@/features/launch-app/types";

export const PANELS: PanelConfig[] = [
  {
    id: "home",
    num: "00",
    tab: "HOME",
    editorCopy: "Start from the signal.",
    dark: false,
    bg: "#fbf6ff",
  },
  {
    id: "profile",
    num: "01",
    tab: "GRAVII ID",
    editorCopy: "Your identity, distilled.",
    dark: true,
    bg: "#7562b7",
  },
  {
    id: "lookup",
    num: "02",
    tab: "X-RAY",
    editorCopy: "Peel back any account.",
    dark: true,
    bg: "#586ec9",
    xray: true,
  },
  {
    id: "discovery",
    num: "03",
    tab: "DISCOVERY",
    editorCopy: "Campaigns, soon.",
    dark: true,
    bg: "#a36a9e",
  },
  {
    id: "leaderboard",
    num: "04",
    tab: "RANKING",
    editorCopy: "Wallet ranking.",
    dark: true,
    bg: "#5b477f",
  },
  {
    id: "myspace",
    num: "05",
    tab: "MY SPACE",
    editorCopy: "Personalized curation, soon.",
    dark: true,
    bg: "#8d637d",
  },
];

// Hidden, not deleted: My Space is intentionally kept in code for the later
// personalized-feed rollout, but it is removed from the current navigation and
// direct panel routing until the product direction is ready again.
export const HIDDEN_PANEL_IDS = new Set<PanelId>(["myspace"]);

export const VISIBLE_PANELS = PANELS.filter((panel) => !HIDDEN_PANEL_IDS.has(panel.id));
