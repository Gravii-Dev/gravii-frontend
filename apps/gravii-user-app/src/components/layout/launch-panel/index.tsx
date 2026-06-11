"use client";

import type { CSSProperties, KeyboardEvent } from "react";

import DepthIcon from "@/components/ui/depth-icon";
import type { PanelConfig, PanelId } from "@/features/launch-app/types";

import styles from "./launch-panel.module.css";

type LaunchPanelProps = {
  panel: PanelConfig;
  isCompact?: boolean;
  isActive: boolean;
  isHovered: boolean;
  markerCount: number;
  onOpen: (id: PanelId) => void;
  onHoverChange: (id: PanelId | null) => void;
};

function handleToggleKey(event: KeyboardEvent<HTMLButtonElement>, onToggle: () => void) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  onToggle();
}

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

type PanelStyle = CSSProperties & {
  "--panel-bg": string;
  "--panel-bg-hover": string;
  "--depth-icon-front": string;
};

export default function LaunchPanel({
  panel,
  isCompact = false,
  isActive,
  isHovered,
  markerCount,
  onOpen,
  onHoverChange,
}: LaunchPanelProps) {
  const panelStyle: PanelStyle = {
    "--panel-bg": panel.bg,
    "--panel-bg-hover": panel.bgHover,
    "--depth-icon-front": panel.bg,
  };

  return (
    <button
      type="button"
      className={joinClasses(
        styles.panel,
        panel.dark ? styles.dark : styles.light,
        isActive && styles.active,
        isHovered && !isActive && styles.hovered,
      )}
      style={panelStyle}
      aria-current={isActive ? "page" : undefined}
      aria-label={`${panel.tab} navigation`}
      title={isCompact ? panel.tab : undefined}
      data-compact={isCompact ? "true" : undefined}
      data-cursor-target="nav-panel"
      data-cursor-label={isCompact ? panel.tab : undefined}
      data-cursor-variant="pill"
      data-panel-id={panel.id}
      onClick={() => onOpen(panel.id)}
      onKeyDown={(event) => handleToggleKey(event, () => onOpen(panel.id))}
      onMouseEnter={() => onHoverChange(panel.id)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <span className={styles.marker} aria-hidden="true">
        {Array.from({ length: markerCount }, (_, index) => (
          <span className={styles.markerDot} key={`${panel.id}-marker-${index}`} />
        ))}
      </span>
      <DepthIcon name={panel.icon} className={styles.panelIcon} />
      <span className={styles.copyStack}>
        <span className={styles.label}>{panel.tab}</span>
        <span className={styles.summary}>{panel.summary}</span>
      </span>
      <span className={styles.sub}>{panel.sub}</span>
    </button>
  );
}
