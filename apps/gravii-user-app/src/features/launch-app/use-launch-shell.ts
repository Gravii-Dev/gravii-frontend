"use client";

import { useMemo, useState } from "react";

import type { PanelId } from "@/features/launch-app/types";

export function useLaunchShell() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<PanelId | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const shell = useMemo(
    () => ({
      activePanel,
      hoveredPanel,
      isConnected,
      openPanel: setActivePanel,
      closePanel: () => setActivePanel(null),
      toggleConnection: () => setIsConnected((current) => !current),
      connect: () => setIsConnected(true),
      setHoveredPanel,
    }),
    [activePanel, hoveredPanel, isConnected],
  );

  return shell;
}
