"use client";

import { useMemo, useState } from "react";

import type { PanelId } from "@/features/launch-app/types";

export function useLaunchShell() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<PanelId | null>(null);

  const shell = useMemo(
    () => ({
      activePanel,
      hoveredPanel,
      openPanel: setActivePanel,
      closePanel: () => setActivePanel(null),
      setHoveredPanel,
    }),
    [activePanel, hoveredPanel],
  );

  return shell;
}
