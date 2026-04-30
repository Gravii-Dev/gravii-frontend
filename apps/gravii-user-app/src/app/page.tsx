"use client";

import { useEffect, type ReactElement } from "react";

import LaunchPanel from "@/components/layout/launch-panel";
import GraviiLogo from "@/components/ui/gravii-logo";
import ActionButton from "@/components/ui/action-button";
import { useUserAuth } from "@/features/auth/auth-provider";
import DiscoveryContent from "@/features/discovery/discovery-content";
import { PANELS } from "@/features/launch-app/panel-config";
import type { PanelId, SharedContentProps } from "@/features/launch-app/types";
import { useLaunchShell } from "@/features/launch-app/use-launch-shell";
import MySpaceContent from "@/features/my-space/my-space-content";
import ProfileContent from "@/features/profile/profile-content";
import {
  clearProfileIdentityCache,
  prefetchProfileIdentity,
} from "@/features/profile/profile-identity-cache";
import StandingContent from "@/features/standing/standing-content";
import XRayContent from "@/features/x-ray/x-ray-content";

import styles from "./page.module.css";

const CONTENT_MAP = {
  profile: ProfileContent,
  discovery: DiscoveryContent,
  lookup: XRayContent,
  leaderboard: StandingContent,
  myspace: MySpaceContent,
} satisfies Record<PanelId, (props: SharedContentProps) => ReactElement | null>;

export default function HomePage() {
  const auth = useUserAuth();
  const shell = useLaunchShell();
  const isConnected = auth.isAuthenticated;

  useEffect(() => {
    if (isConnected) {
      void prefetchProfileIdentity();
      return;
    }

    clearProfileIdentityCache();
  }, [isConnected]);

  if (auth.status === "loading") {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingCard}>
          <GraviiLogo decorative priority variant="motion" className={styles.loadingLogo} />
          <div className={styles.loadingCopyStack}>
            <span className={styles.loadingEyebrow}>GRAVII SESSION</span>
            <p className={styles.loadingCopy}>Rehydrating your Gravii session…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brandCluster}>
          <GraviiLogo decorative priority variant="symbol" spinY className={styles.headerSymbol} />
          <div className={styles.brandStack}>
            <GraviiLogo decorative priority variant="wordmark" className={styles.headerWordmark} />
          </div>
        </div>
        <ActionButton
          size="compact"
          className={isConnected ? styles.sessionButtonConnected : styles.sessionButtonDisconnected}
          pressed={isConnected}
          onClick={isConnected ? () => void auth.signOut() : auth.beginSignIn}
        >
          {isConnected ? "SIGN OUT" : "SIGN IN"}
        </ActionButton>
      </header>

      <div
        className={`${styles.panelStrip} ${
          shell.activePanel ? styles.panelStripCompact : styles.panelStripFull
        }`}
      >
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
              <Content dark={darkContent} connected={isConnected} onConnect={auth.beginSignIn} onNavigate={shell.openPanel} />
            </LaunchPanel>
          );
        })}
      </div>
    </div>
  );
}
