"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from "react";

import LaunchPanel from "@/components/layout/launch-panel";
import PanelShell from "@/components/layout/panel-shell";
import ActionButton from "@/components/ui/action-button";
import GraviiLogo from "@/components/ui/gravii-logo";
import ThemeInkTransition from "@/components/ui/theme-ink-transition";
import { useUserAuth } from "@/features/auth/auth-provider";
import DiscoveryContent from "@/features/discovery/discovery-content";
import HomeContent from "@/features/home/home-content";
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
  home: HomeContent,
  profile: ProfileContent,
  discovery: DiscoveryContent,
  lookup: XRayContent,
  leaderboard: StandingContent,
  myspace: MySpaceContent,
} satisfies Record<PanelId, (props: SharedContentProps) => ReactElement | null>;

const NAV_PANELS = PANELS.filter((panel) => panel.id !== "home");
const THEME_TRANSITION_DURATION_MS = 860;
const THEME_TRANSITION_CLEANUP_DELAY_MS = THEME_TRANSITION_DURATION_MS + 40;

type WorkspaceBoardStyle = CSSProperties & {
  "--workspace-accent": string;
};

type LaunchTheme = "light" | "dark";

type ThemeTransition = {
  key: number;
  from: LaunchTheme;
  to: LaunchTheme;
};

function findPanel(panelId: PanelId) {
  return PANELS.find((panel) => panel.id === panelId) ?? PANELS[0];
}

export default function HomePage() {
  const auth = useUserAuth();
  const shell = useLaunchShell();
  const [theme, setTheme] = useState<LaunchTheme>("light");
  const [themeTransition, setThemeTransition] = useState<ThemeTransition | null>(null);
  const themeTransitionTimeoutRef = useRef<number | null>(null);
  const [panelScrollState, setPanelScrollState] = useState<{
    panelId: PanelId;
    progress: number;
  }>({
    panelId: "home",
    progress: 0,
  });
  const isConnected = auth.isAuthenticated;
  const activePanel = findPanel(shell.activePanel);
  const Content = CONTENT_MAP[activePanel.id];
  const usesDarkContent = activePanel.dark || Boolean(activePanel.hoverDark);
  const isDarkTheme = theme === "dark";
  const workspaceBoardStyle: WorkspaceBoardStyle = {
    "--workspace-accent": activePanel.id === "home" ? "var(--raw-line)" : activePanel.bg,
  };

  useEffect(() => {
    if (isConnected) {
      void prefetchProfileIdentity();
      return;
    }

    clearProfileIdentityCache();
  }, [isConnected]);

  useEffect(() => {
    return () => {
      if (themeTransitionTimeoutRef.current !== null) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
      }

      delete document.documentElement.dataset.themeTransitioning;
    };
  }, []);

  function handlePanelScrollProgress(progress: number) {
    setPanelScrollState({
      panelId: shell.activePanel,
      progress,
    });
  }

  function handleThemeToggle() {
    const nextTheme: LaunchTheme = isDarkTheme ? "light" : "dark";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (themeTransitionTimeoutRef.current !== null) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
        themeTransitionTimeoutRef.current = null;
      }

      delete document.documentElement.dataset.themeTransitioning;
      setThemeTransition(null);
      setTheme(nextTheme);
      return;
    }

    const root = document.documentElement;
    const transitionKey = window.performance.now();

    if (themeTransitionTimeoutRef.current !== null) {
      window.clearTimeout(themeTransitionTimeoutRef.current);
    }

    setThemeTransition({
      key: transitionKey,
      from: theme,
      to: nextTheme,
    });
    root.dataset.themeTransitioning = "true";
    setTheme(nextTheme);

    themeTransitionTimeoutRef.current = window.setTimeout(() => {
      themeTransitionTimeoutRef.current = null;
      setThemeTransition(null);
      delete root.dataset.themeTransitioning;
    }, THEME_TRANSITION_CLEANUP_DELAY_MS);
  }

  if (auth.status === "loading") {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingCard}>
          <GraviiLogo decorative loading="eager" variant="motion" className={styles.loadingLogo} />
          <div className={styles.loadingCopyStack}>
            <span className={styles.loadingEyebrow}>GRAVII SESSION</span>
            <p className={styles.loadingCopy}>Rehydrating your Gravii session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.root}
      data-theme={theme}
      data-theme-transitioning={themeTransition ? "true" : undefined}
    >
      {themeTransition ? (
        <ThemeInkTransition
          key={themeTransition.key}
          from={themeTransition.from}
          to={themeTransition.to}
          durationMs={THEME_TRANSITION_DURATION_MS}
        />
      ) : null}
      <aside className={styles.sidebar} aria-label="Gravii workspace navigation">
        <button
          type="button"
          className={styles.brandTile}
          aria-current={shell.activePanel === "home" ? "page" : undefined}
          aria-label="HOME navigation"
          data-panel-id="home"
          onClick={() => shell.openPanel("home")}
        >
          <GraviiLogo decorative variant="symbol" className={styles.headerSymbol} />
          <span className={styles.headerWordmarkText}>gravii</span>
          <span className={styles.brandMarker} aria-hidden="true" />
        </button>

        <nav className={styles.navList} aria-label="Workspace sections">
          {NAV_PANELS.map((panel) => (
            <LaunchPanel
              key={panel.id}
              panel={panel}
              isActive={shell.activePanel === panel.id}
              isHovered={shell.hoveredPanel === panel.id && shell.activePanel !== panel.id}
              activeProgress={panelScrollState.panelId === panel.id ? panelScrollState.progress : 0}
              onOpen={shell.openPanel}
              onHoverChange={shell.setHoveredPanel}
            />
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.themeToggleGroup}>
            <span className={styles.themeToggleLabel}>THEME</span>
            <button
              type="button"
              className={styles.themeToggle}
              data-theme-state={theme}
              aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={isDarkTheme}
              onClick={handleThemeToggle}
            >
              <span className={styles.themeToggleThumb} aria-hidden="true" />
              <span className={styles.themeToggleOption}>LIGHT</span>
              <span className={styles.themeToggleOption}>DARK</span>
            </button>
          </div>
          <span className={styles.footerLabel}>{isConnected ? "SESSION ACTIVE" : "WALLET REQUIRED"}</span>
          <ActionButton
            size="compact"
            className={isConnected ? styles.sessionButtonConnected : styles.sessionButtonDisconnected}
            pressed={isConnected}
            onClick={isConnected ? () => void auth.signOut() : auth.beginSignIn}
          >
            {isConnected ? "SIGN OUT" : "SIGN IN"}
          </ActionButton>
        </div>
      </aside>

      <main className={styles.workspace}>
        <section
          className={styles.workspaceBoard}
          data-section={activePanel.id}
          style={workspaceBoardStyle}
        >
          {activePanel.id === "home" ? (
            <div className={styles.homeShell}>
              <Content
                dark={usesDarkContent}
                connected={isConnected}
                onConnect={auth.beginSignIn}
                onNavigate={shell.openPanel}
              />
            </div>
          ) : (
            <PanelShell
              title={activePanel.tab}
              dark={usesDarkContent}
              actionLabel="HOME"
              onClose={() => shell.openPanel("home")}
              onScrollProgress={handlePanelScrollProgress}
            >
              <Content
                dark={usesDarkContent}
                connected={isConnected}
                onConnect={auth.beginSignIn}
                onNavigate={shell.openPanel}
              />
            </PanelShell>
          )}
        </section>
      </main>
    </div>
  );
}
