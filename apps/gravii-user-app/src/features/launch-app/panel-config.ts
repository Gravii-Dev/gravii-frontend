import type { PanelConfig, PanelId } from "@/features/launch-app/types";

export const PANELS: PanelConfig[] = [
  {
    id: "home",
    icon: "home",
    num: "00",
    tab: "HOME",
    sub: "COMMAND",
    editorCopy: "Start from the signal.",
    summary: "A command home for the current Gravii session.",
    dark: false,
    bg: "#fbf6ff",
    bgHover: "#e8ddff",
  },
  {
    id: "profile",
    icon: "identity",
    num: "01",
    tab: "GRAVII ID",
    sub: "GRAVII ID",
    editorCopy: "Your identity, distilled.",
    summary: "Persona, tier, wallet momentum, and identity status.",
    dark: true,
    bg: "#7562b7",
    bgHover: "#d7c8ff",
  },
  {
    id: "lookup",
    icon: "xray",
    num: "02",
    tab: "X-RAY",
    sub: "VERIFY",
    editorCopy: "Peel back any account.",
    summary: "Run a wallet lookup and reopen previous analysis.",
    dark: true,
    bg: "#586ec9",
    bgHover: "#c8d5ff",
    xray: true,
  },
  {
    id: "discovery",
    icon: "discovery",
    num: "03",
    tab: "DISCOVERY",
    sub: "COMING SOON",
    editorCopy: "Campaigns, soon.",
    summary: "Campaign and partner discovery matched to identity.",
    dark: true,
    bg: "#a36a9e",
    bgHover: "#f1c7e5",
  },
  {
    id: "leaderboard",
    icon: "ranking",
    num: "04",
    tab: "RANKING",
    sub: "PUBLIC RANKS",
    editorCopy: "Wallet ranking.",
    summary: "Public rank board with wallet-specific standing gated by sign-in.",
    dark: true,
    bg: "#5b477f",
    bgHover: "#cbb6e8",
  },
  {
    id: "myspace",
    icon: "myspace",
    num: "05",
    tab: "MY SPACE",
    sub: "COMING SOON",
    editorCopy: "Personalized curation, soon.",
    summary: "A private feed for saved context and personalized drops.",
    dark: true,
    bg: "#8d637d",
    bgHover: "#efd0df",
  },
];

// Hidden, not deleted: My Space is intentionally kept in code for the later
// personalized-feed rollout, but it is removed from the current navigation and
// direct panel routing until the product direction is ready again.
export const HIDDEN_PANEL_IDS = new Set<PanelId>(["myspace"]);

export const VISIBLE_PANELS = PANELS.filter((panel) => !HIDDEN_PANEL_IDS.has(panel.id));
