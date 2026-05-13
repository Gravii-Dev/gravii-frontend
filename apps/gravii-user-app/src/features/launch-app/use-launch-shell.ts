"use client";

import { useMemo, useState } from "react";

import type { PanelId } from "@/features/launch-app/types";

const panelIds = new Set<PanelId>([
  "home",
  "profile",
  "discovery",
  "leaderboard",
  "lookup",
  "myspace",
]);

function isPanelId(value: string | null): value is PanelId {
  return value !== null && panelIds.has(value as PanelId);
}

function readInitialPanel(): PanelId {
  if (typeof window === "undefined") {
    return "home";
  }

  const panel = new URLSearchParams(window.location.search).get("panel");
  return isPanelId(panel) ? panel : "home";
}

export function useLaunchShell() {
  const [activePanel, setActivePanel] = useState<PanelId>(readInitialPanel);
  const [hoveredPanel, setHoveredPanel] = useState<PanelId | null>(null);

  const shell = useMemo(
    () => ({
      activePanel,
      hoveredPanel,
      openPanel: setActivePanel,
      closePanel: () => setActivePanel("home"),
      setHoveredPanel,
    }),
    [activePanel, hoveredPanel],
  );

  return shell;
}
