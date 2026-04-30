"use client";

import type { KeyboardEvent, ReactNode } from "react";

import PanelShell from "@/components/layout/panel-shell";
import GrainOverlay from "@/components/ui/grain-overlay";
import type { PanelConfig, PanelId } from "@/features/launch-app/types";

import styles from "./launch-panel.module.css";

type LaunchPanelProps = {
  panel: PanelConfig;
  index: number;
  total: number;
  isActive: boolean;
  hasAnyActivePanel: boolean;
  isHovered: boolean;
  onOpen: (id: PanelId) => void;
  onClose: () => void;
  onHoverChange: (id: PanelId | null) => void;
  children: ReactNode;
};

function handleToggleKey(event: KeyboardEvent<HTMLElement>, onToggle: () => void) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  onToggle();
}

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function panelIdClass(panelId: PanelConfig["id"]) {
  if (panelId === "profile") return styles.panelProfile;
  if (panelId === "discovery") return styles.panelDiscovery;
  if (panelId === "leaderboard") return styles.panelStanding;
  if (panelId === "myspace") return styles.panelMySpace;
  return styles.panelXray;
}

function titleClass(panelId: PanelConfig["id"]) {
  if (panelId === "profile") return styles.titleProfile;
  if (panelId === "discovery") return styles.titleDiscovery;
  if (panelId === "myspace") return styles.titleMySpace;
  return styles.titleDefault;
}

function backLabel(panelId: PanelConfig["id"]) {
  if (panelId === "profile") return "View Gravii ID";
  if (panelId === "lookup") return "Run X-Ray";
  if (panelId === "leaderboard") return "Preview Standing";
  if (panelId === "discovery") return "Explore Discovery";
  return "Open My Space";
}

function PreviewTitle({
  panel,
  isCollapsed,
}: {
  panel: PanelConfig;
  isCollapsed: boolean;
}) {
  if (panel.id === "lookup") {
    if (isCollapsed) {
      return (
        <div className={styles.rotatedTitle}>
          <span className={styles.lookupCompactTitle}>X-RAY</span>
        </div>
      );
    }

    return (
      <>
        <div className={styles.lookupThermalOverlay}>
          <div className={styles.lookupThermalCore} />
        </div>
        <div className={styles.lookupCenteredTitle}>
          <span className={styles.lookupTitle}>X-RAY</span>
        </div>
      </>
    );
  }

  return (
    <div className={styles.rotatedTitle}>
      <span className={`${styles.titleText} ${titleClass(panel.id)}`}>{panel.tab}</span>
    </div>
  );
}

export default function LaunchPanel({
  panel,
  index,
  total,
  isActive,
  hasAnyActivePanel,
  isHovered,
  onOpen,
  onClose,
  onHoverChange,
  children,
}: LaunchPanelProps) {
  const isCollapsed = hasAnyActivePanel && !isActive;
  const usesDarkTokens = Boolean(panel.dark || ((isHovered || isActive) && panel.hoverDark));

  return (
    <section
      className={joinClasses(
        styles.panel,
        panelIdClass(panel.id),
        isActive && styles.panelActive,
        !isActive && isCollapsed && styles.panelCollapsed,
        !isActive && !isCollapsed && styles.panelIdle,
        isHovered && styles.panelHovered,
        usesDarkTokens ? styles.tokensDark : styles.tokensLight,
        index === total - 1 && styles.lastPanel,
      )}
      onClick={isActive ? undefined : () => onOpen(panel.id)}
      onKeyDown={isActive ? undefined : (event) => handleToggleKey(event, () => onOpen(panel.id))}
      onMouseEnter={() => onHoverChange(panel.id)}
      onMouseLeave={() => onHoverChange(null)}
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-expanded={isActive}
      aria-label={isActive ? undefined : `${panel.tab} panel`}
    >
      {panel.id === "discovery" ? <GrainOverlay variant="panel" active={isActive} /> : null}

      <div className={`${styles.flipCard} ${isActive ? styles.previewHidden : ""}`} aria-hidden={isActive}>
        <div className={styles.flipBack}>
          <span className={styles.flipBackLabel}>{backLabel(panel.id)}</span>
        </div>

        <div className={styles.previewLayer}>
          {!isCollapsed ? (
            <div className={styles.editorCopy}>
              <span className={styles.editorText}>&ldquo;{panel.editorCopy}&rdquo;</span>
            </div>
          ) : null}

          <PreviewTitle panel={panel} isCollapsed={isCollapsed} />

          {panel.dark && !isCollapsed ? <div className={styles.scanLine} /> : null}
        </div>
      </div>

      {isActive ? (
        <PanelShell title={panel.tab} dark={usesDarkTokens} onClose={onClose}>
          {children}
        </PanelShell>
      ) : null}
    </section>
  );
}
