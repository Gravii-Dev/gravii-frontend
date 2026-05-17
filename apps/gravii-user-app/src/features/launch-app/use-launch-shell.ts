"use client";

import { useCallback, useMemo, useState } from "react";

import { VISIBLE_PANELS } from "@/features/launch-app/panel-config";
import type { PanelId } from "@/features/launch-app/types";

const panelIds = new Set<PanelId>(VISIBLE_PANELS.map((panel) => panel.id));

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

  const openPanel = useCallback((panelId: PanelId) => {
    if (!panelIds.has(panelId)) {
      setActivePanel("home");
      return;
    }

    setActivePanel(panelId);
  }, []);

  const shell = useMemo(
    () => ({
      activePanel,
      hoveredPanel,
      openPanel,
      closePanel: () => setActivePanel("home"),
      setHoveredPanel,
    }),
    [activePanel, hoveredPanel, openPanel],
  );

  return shell;
}
