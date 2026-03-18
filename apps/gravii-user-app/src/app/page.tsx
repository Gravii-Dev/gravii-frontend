"use client";

import type { ReactElement } from "react";

import LaunchPanel from "@/components/layout/launch-panel";
import MySpaceDock from "@/components/layout/my-space-dock";
import ActionButton from "@/components/ui/action-button";
import DiscoveryContent from "@/features/discovery/discovery-content";
import { PANELS } from "@/features/launch-app/panel-config";
import type { PanelId, SharedContentProps } from "@/features/launch-app/types";
import { useLaunchShell } from "@/features/launch-app/use-launch-shell";
import MySpaceContent from "@/features/my-space/my-space-content";
import ProfileContent from "@/features/profile/profile-content";
import StandingContent from "@/features/standing/standing-content";
import XRayContent from "@/features/x-ray/x-ray-content";

import styles from "./page.module.css";

type LaunchPanelId = Exclude<PanelId, "myspace">;

const CONTENT_MAP = {
  profile: ProfileContent,
  discovery: DiscoveryContent,
  lookup: XRayContent,
  leaderboard: StandingContent,
} satisfies Record<LaunchPanelId, (props: SharedContentProps) => ReactElement | null>;

function panelStripClass(activePanel: PanelId | null) {
  if (activePanel === "myspace") {
    return styles.panelStripHidden;
  }

  if (activePanel) {
    return styles.panelStripCompact;
  }

  return styles.panelStripFull;
}

export default function HomePage() {
  const shell = useLaunchShell();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.brand}>GRAVII</span>
        <ActionButton
          size="compact"
          className={shell.isConnected ? styles.sessionButtonConnected : styles.sessionButtonDisconnected}
          pressed={shell.isConnected}
          onClick={shell.toggleConnection}
        >
          {shell.isConnected ? "SIGN OUT" : "SIGN IN"}
        </ActionButton>
      </header>

      <div className={`${styles.panelStrip} ${panelStripClass(shell.activePanel)}`}>
        {PANELS.map((panel, index) => {
          const Content = CONTENT_MAP[panel.id];
          const darkContent = panel.dark || Boolean(panel.hoverDark);

          return (
            <LaunchPanel
              key={panel.id}
              panel={panel}
              index={index}
              total={PANELS.length}
              isActive={shell.activePanel === panel.id}
              hasAnyActivePanel={shell.activePanel !== null}
              isHovered={shell.hoveredPanel === panel.id && shell.activePanel !== panel.id}
              onOpen={shell.openPanel}
              onClose={shell.closePanel}
              onHoverChange={shell.setHoveredPanel}
            >
              <Content dark={darkContent} connected={shell.isConnected} onConnect={shell.connect} onNavigate={shell.openPanel} />
            </LaunchPanel>
          );
        })}
      </div>

      <MySpaceDock
        isActive={shell.activePanel === "myspace"}
        hasAnyActivePanel={shell.activePanel !== null}
        isHovered={shell.hoveredPanel === "myspace" && shell.activePanel !== "myspace"}
        onOpen={() => shell.openPanel("myspace")}
        onClose={shell.closePanel}
        onHoverChange={(hovered) => shell.setHoveredPanel(hovered ? "myspace" : null)}
      >
        <MySpaceContent dark connected={shell.isConnected} onConnect={shell.connect} onNavigate={shell.openPanel} />
      </MySpaceDock>
    </div>
  );
}
