"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
} from "react";

import LaunchPanel from "@/components/layout/launch-panel";
import PanelShell from "@/components/layout/panel-shell";
import ActionButton from "@/components/ui/action-button";
import ExpressiveCursor from "@/components/ui/expressive-cursor";
import GraviiLogo from "@/components/ui/gravii-logo";
import MorphIcon from "@/components/ui/morph-icon";
import ThemeInkTransition from "@/components/ui/theme-ink-transition";
import { useUserAuth } from "@/features/auth/auth-provider";
import { UserSignInLauncher } from "@/features/auth/user-sign-in-launcher";
import DiscoveryContent from "@/features/discovery/discovery-content";
import HomeContent from "@/features/home/home-content";
import { VISIBLE_PANELS } from "@/features/launch-app/panel-config";
import type { PanelId, SharedContentProps } from "@/features/launch-app/types";
import { useLaunchShell } from "@/features/launch-app/use-launch-shell";
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
  myspace: HomeContent,
} satisfies Record<PanelId, (props: SharedContentProps) => ReactElement | null>;

const NAV_PANELS = VISIBLE_PANELS.filter((panel) => panel.id !== "home");
const SECTION_COUNT = NAV_PANELS.length;
const SIDEBAR_NAV_ID = "gravii-workspace-navigation";
const THEME_TRANSITION_DURATION_MS = 860;
const THEME_TRANSITION_CLEANUP_DELAY_MS = THEME_TRANSITION_DURATION_MS + 40;

type WorkspaceSectionStyle = CSSProperties & {
  "--section-accent": string;
  "--section-on-accent": string;
  "--auth-accent": string;
  "--auth-on-accent": string;
  "--brand-logo-filter": string;
};

type LaunchTheme = "light" | "dark";

type ThemeTransition = {
  key: number;
  from: LaunchTheme;
  to: LaunchTheme;
};

function findPanel(panelId: PanelId) {
  return VISIBLE_PANELS.find((panel) => panel.id === panelId) ?? VISIBLE_PANELS[0];
}

function getSectionDotCount(panelId: PanelId) {
  const panelIndex = NAV_PANELS.findIndex((panel) => panel.id === panelId);

  return panelIndex >= 0 ? panelIndex + 1 : 0;
}

export default function HomePage() {
  const auth = useUserAuth();
  const shell = useLaunchShell();
  const [theme, setTheme] = useState<LaunchTheme>("light");
  const [themeTransition, setThemeTransition] = useState<ThemeTransition | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const themeTransitionTimeoutRef = useRef<number | null>(null);
  const isConnected = auth.isAuthenticated;
  const activePanel = findPanel(shell.activePanel);
  const Content = CONTENT_MAP[activePanel.id];
  const isDarkTheme = theme === "dark";
  const usesDarkContent = isDarkTheme || activePanel.dark || Boolean(activePanel.hoverDark);
  const authActionLabel = isConnected ? "SIGN OUT" : "SIGN IN";
  const sidebarAuthActionLabel = isSidebarCollapsed ? (isConnected ? "OUT" : "IN") : authActionLabel;
  const authButtonClassName = `${styles.workspaceAuthButton} ${
    isConnected ? styles.workspaceAuthButtonConnected : styles.workspaceAuthButtonDisconnected
  }`;
  const sectionAccent = activePanel.id === "home" ? "var(--solid-ink-surface)" : activePanel.bg;
  const authAccent = activePanel.id === "home" && isDarkTheme ? "var(--solid-ink-surface)" : activePanel.bg;
  const authOnAccent =
    activePanel.dark || (activePanel.id === "home" && isDarkTheme)
      ? "var(--theme-on-accent)"
      : "var(--raw-ink)";
  const shouldInvertBrandLogo = activePanel.dark || (activePanel.id === "home" && isDarkTheme);
  const sectionStyle: WorkspaceSectionStyle = {
    "--section-accent": sectionAccent,
    "--section-on-accent": activePanel.id === "home" || activePanel.dark ? "var(--theme-on-accent)" : "var(--raw-ink)",
    "--auth-accent": authAccent,
    "--auth-on-accent": authOnAccent,
    "--brand-logo-filter": shouldInvertBrandLogo ? "invert(1)" : "none",
  };
  const activeSectionDotCount = getSectionDotCount(activePanel.id);
  const isMobileSidebarHidden = isMobileViewport && !isMobileNavOpen;
  const sidebarInertAttributes = isMobileSidebarHidden ? { inert: true } : {};

  useEffect(() => {
    if (isConnected) {
      void prefetchProfileIdentity();
      return;
    }

    clearProfileIdentityCache();
  }, [isConnected]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 860px)");

    function syncMobileViewport() {
      const nextIsMobile = mobileQuery.matches;

      setIsMobileViewport(nextIsMobile);

      if (!nextIsMobile) {
        setIsMobileNavOpen(false);
      }
    }

    syncMobileViewport();
    mobileQuery.addEventListener("change", syncMobileViewport);

    return () => {
      mobileQuery.removeEventListener("change", syncMobileViewport);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (themeTransitionTimeoutRef.current !== null) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
      }

      delete document.documentElement.dataset.themeTransitioning;
    };
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileNavOpen]);

  function handleNavigate(panelId: PanelId) {
    shell.openPanel(panelId);
    setIsMobileNavOpen(false);
  }

  function handleDesktopNavBlankClick(event: MouseEvent<HTMLElement>) {
    if (event.currentTarget !== event.target) {
      return;
    }

    if (window.matchMedia("(max-width: 860px)").matches) {
      return;
    }

    setIsSidebarCollapsed((current) => !current);
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

  function handleAuthAction() {
    if (isConnected) {
      void auth.signOut();
      return;
    }

    auth.beginSignIn();
  }

  function renderAuthAction() {
    return (
      <ActionButton
        size="compact"
        className={authButtonClassName}
        hoverIcon={isConnected ? "arrowLeft" : "arrowRight"}
        icon={isConnected ? "check" : "wallet"}
        pressed={isConnected}
        pressedIcon="check"
        onClick={handleAuthAction}
      >
        {authActionLabel}
      </ActionButton>
    );
  }

  if (auth.status === "loading") {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingCard}>
          <GraviiLogo decorative loading="eager" variant="motion" className={styles.loadingLogo} />
          <div className={styles.loadingCopyStack}>
            <span className={styles.loadingEyebrow}>GRAVII SESSION</span>
            <p className={styles.loadingCopy}>Rehydrating your Gravii session…</p>
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
      data-nav-collapsed={isSidebarCollapsed ? "true" : undefined}
      data-mobile-nav-open={isMobileNavOpen ? "true" : undefined}
      style={sectionStyle}
    >
      {themeTransition ? (
        <ThemeInkTransition
          key={themeTransition.key}
          from={themeTransition.from}
          to={themeTransition.to}
          durationMs={THEME_TRANSITION_DURATION_MS}
        />
      ) : null}
      <ExpressiveCursor />
      <UserSignInLauncher
        isOpen={auth.isSignInModalOpen}
        nextPath={auth.signInNextPath}
        onAuthenticated={auth.completeSignIn}
        onCancel={auth.cancelSignIn}
        requestKey={auth.signInRequestKey}
      />
      <header className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.mobileMenuButton}
          aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls={SIDEBAR_NAV_ID}
          aria-expanded={isMobileNavOpen}
          data-cursor-target="mobile-menu"
          data-cursor-label={isMobileNavOpen ? "CLOSE" : "MENU"}
          data-cursor-variant="pill"
          onClick={() => setIsMobileNavOpen((current) => !current)}
        >
          <MorphIcon name={isMobileNavOpen ? "cross" : "menu"} className={styles.mobileMenuIcon} />
        </button>
        <button
          type="button"
          className={styles.mobileBrandButton}
          aria-label="HOME navigation"
          data-cursor-target="brand"
          data-cursor-label="HOME"
          data-cursor-variant="pill"
          onClick={() => handleNavigate("home")}
        >
          <GraviiLogo decorative variant="symbol" className={styles.mobileHeaderLogo} />
          <span>{activePanel.tab}</span>
        </button>
        <div className={styles.mobileHeaderAuth}>{renderAuthAction()}</div>
      </header>
      <button
        type="button"
        className={styles.mobileNavScrim}
        aria-label="Close navigation menu"
        aria-hidden={!isMobileNavOpen}
        tabIndex={isMobileNavOpen ? 0 : -1}
        data-cursor-target="scrim"
        data-cursor-label="CLOSE"
        data-cursor-variant="pill"
        onClick={() => setIsMobileNavOpen(false)}
      />
      <aside
        id={SIDEBAR_NAV_ID}
        className={`${styles.sidebar} ${isMobileNavOpen ? styles.sidebarOpen : ""}`}
        aria-label="Gravii workspace navigation"
        aria-hidden={isMobileSidebarHidden ? true : undefined}
        data-collapse-state={isSidebarCollapsed ? "collapsed" : "expanded"}
        data-mobile-hidden={isMobileSidebarHidden ? "true" : undefined}
        data-cursor-target="nav-rail"
        data-cursor-label={isSidebarCollapsed ? "EXPAND" : "COLLAPSE"}
        data-cursor-variant="pill"
        title={isSidebarCollapsed ? "Click empty rail to expand navigation" : "Click empty rail to collapse navigation"}
        onClick={handleDesktopNavBlankClick}
        {...sidebarInertAttributes}
      >
        <div className={styles.sidebarMobileHead}>
          <span>WORKSPACE</span>
          <button
            type="button"
            className={styles.sidebarMobileClose}
            aria-label="Close navigation menu"
            data-cursor-target="mobile-close"
            data-cursor-label="CLOSE"
            data-cursor-variant="pill"
            onClick={() => setIsMobileNavOpen(false)}
          >
            X
          </button>
        </div>
        <button
          type="button"
          className={styles.brandTile}
          aria-current={shell.activePanel === "home" ? "page" : undefined}
          aria-label="HOME navigation"
          data-panel-id="home"
          data-cursor-target="brand"
          data-cursor-label="HOME"
          data-cursor-variant="pill"
          onClick={() => handleNavigate("home")}
        >
          <span className={styles.headerSymbolMotion} key={`brand-motion-${activePanel.id}`}>
            <GraviiLogo decorative variant="symbol" className={styles.headerSymbol} />
          </span>
          <span className={styles.headerWordmarkText}>gravii</span>
          <span className={styles.brandMarker} aria-hidden="true" />
        </button>

        <nav
          className={styles.navList}
          aria-label="Workspace sections"
          onClick={handleDesktopNavBlankClick}
        >
          {NAV_PANELS.map((panel, index) => (
            <LaunchPanel
              key={panel.id}
              panel={panel}
              isCompact={isSidebarCollapsed}
              isActive={shell.activePanel === panel.id}
              isHovered={shell.hoveredPanel === panel.id && shell.activePanel !== panel.id}
              markerCount={index + 1}
              onOpen={handleNavigate}
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
              data-cursor-target="theme-toggle"
              data-cursor-label={isDarkTheme ? "LIGHT" : "DARK"}
              data-cursor-variant="pill"
              onClick={handleThemeToggle}
            >
              <span className={styles.themeToggleThumb} aria-hidden="true" />
              <span className={styles.themeToggleIcon} aria-hidden="true">
                <MorphIcon name={isDarkTheme ? "moon" : "sun"} />
              </span>
              <span className={`${styles.themeToggleOption} ${styles.themeToggleOptionLight}`}>LIGHT</span>
              <span className={`${styles.themeToggleOption} ${styles.themeToggleOptionDark}`}>DARK</span>
            </button>
          </div>
          <span className={styles.footerLabel}>{isConnected ? "SESSION ACTIVE" : "WALLET REQUIRED"}</span>
          <ActionButton
            size="compact"
            className={isConnected ? styles.sessionButtonConnected : styles.sessionButtonDisconnected}
            hoverIcon={isConnected ? "arrowLeft" : "arrowRight"}
            icon={isConnected ? "check" : "wallet"}
            pressed={isConnected}
            pressedIcon="check"
            aria-label={authActionLabel}
            onClick={handleAuthAction}
          >
            {sidebarAuthActionLabel}
          </ActionButton>
        </div>
      </aside>

      <main className={styles.workspace}>
        <section
          className={styles.workspaceBoard}
          data-section={activePanel.id}
        >
          <article
            key={activePanel.id}
            className={styles.activeSection}
            data-active="true"
            data-section-id={activePanel.id}
            aria-label={`${activePanel.tab} section`}
            style={sectionStyle}
          >
            <div className={styles.sectionTopBar}>
              <div className={styles.sectionTopCopy}>
                <span>{activePanel.tab}</span>
              </div>
              {activeSectionDotCount > 0 ? (
                <div
                  className={styles.sectionTopMeta}
                  aria-label={`${activePanel.tab} section ${activeSectionDotCount} of ${SECTION_COUNT}`}
                >
                  {Array.from({ length: activeSectionDotCount }, (_, index) => (
                    <span className={styles.sectionTopDot} key={`${activePanel.id}-section-dot-${index}`} />
                  ))}
                </div>
              ) : null}
              <div className={styles.sectionTopActions}>{renderAuthAction()}</div>
            </div>

            <div className={styles.sectionFrame}>
              {activePanel.id === "home" ? (
                <div className={styles.homeShell}>
                  <Content
                    dark={usesDarkContent}
                    connected={isConnected}
                    onConnect={auth.beginSignIn}
                    onNavigate={handleNavigate}
                  />
                </div>
              ) : (
                <PanelShell
                  title={activePanel.tab}
                  dark={usesDarkContent}
                  className={styles.sectionPanelShell}
                  actionLabel="HOME"
                  onClose={() => handleNavigate("home")}
                >
                  <Content
                    dark={usesDarkContent}
                    connected={isConnected}
                    onConnect={auth.beginSignIn}
                    onNavigate={handleNavigate}
                  />
                </PanelShell>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
