import type { PanelConfig, PanelId } from "@/features/launch-app/types";

export const PANELS: PanelConfig[] = [
  {
    id: "home",
    num: "00",
    tab: "HOME",
    sub: "COMMAND",
    editorCopy: "Start from the signal.",
    summary: "A command home for the current Gravii session.",
    dark: false,
    bg: "#fffaf3",
    bgHover: "#eee4da",
  },
  {
    id: "profile",
    num: "01",
    tab: "GRAVII ID",
    sub: "GRAVII ID",
    editorCopy: "Your identity, distilled.",
    summary: "Persona, tier, wallet momentum, and identity status.",
    dark: true,
    bg: "#6d5aa6",
    bgHover: "#c8b4f0",
  },
  {
    id: "lookup",
    num: "02",
    tab: "X-RAY",
    sub: "VERIFY",
    editorCopy: "Peel back any account.",
    summary: "Run a wallet lookup and reopen previous analysis.",
    dark: true,
    bg: "#4e62b8",
    bgHover: "#829ff0",
    xray: true,
  },
  {
    id: "discovery",
    num: "03",
    tab: "DISCOVERY",
    sub: "COMING SOON",
    editorCopy: "Campaigns, soon.",
    summary: "Campaign and partner discovery matched to identity.",
    dark: true,
    bg: "#2f6f7a",
    bgHover: "#8bd0d9",
  },
  {
    id: "leaderboard",
    num: "04",
    tab: "RANKING",
    sub: "PUBLIC RANKS",
    editorCopy: "Wallet ranking.",
    summary: "Public rank board with wallet-specific standing gated by sign-in.",
    dark: true,
    bg: "#2f7650",
    bgHover: "#64c882",
  },
  {
    id: "myspace",
    num: "05",
    tab: "MY SPACE",
    sub: "COMING SOON",
    editorCopy: "Personalized curation, soon.",
    summary: "A private feed for saved context and personalized drops.",
    dark: true,
    bg: "#8c4f29",
    bgHover: "#ffc850",
  },
];

// Hidden, not deleted: My Space is intentionally kept in code for the later
// personalized-feed rollout, but it is removed from the current navigation and
// direct panel routing until the product direction is ready again.
export const HIDDEN_PANEL_IDS = new Set<PanelId>(["myspace"]);

export const VISIBLE_PANELS = PANELS.filter((panel) => !HIDDEN_PANEL_IDS.has(panel.id));
