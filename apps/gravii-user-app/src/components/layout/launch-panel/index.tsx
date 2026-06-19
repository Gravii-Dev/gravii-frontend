"use client";

import type { CSSProperties, KeyboardEvent } from "react";

import type { PanelConfig, PanelId } from "@/features/launch-app/types";

import styles from "./launch-panel.module.css";

type LaunchPanelProps = {
  panel: PanelConfig;
  isActive: boolean;
  onOpen: (id: PanelId) => void;
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
};

export default function LaunchPanel({
  panel,
  isActive,
  onOpen,
}: LaunchPanelProps) {
  const panelStyle: PanelStyle = {
    "--panel-bg": panel.bg,
  };

  return (
    <button
      type="button"
      className={joinClasses(
        styles.panel,
        panel.dark ? styles.dark : styles.light,
        isActive && styles.active,
      )}
      style={panelStyle}
      aria-current={isActive ? "page" : undefined}
      aria-label={`${panel.tab} navigation`}
      data-cursor-target="nav-panel"
      data-cursor-label={panel.tab}
      data-cursor-variant="pill"
      data-panel-id={panel.id}
      onClick={() => onOpen(panel.id)}
      onKeyDown={(event) => handleToggleKey(event, () => onOpen(panel.id))}
    >
      <span className={styles.copyStack}>
        <span className={styles.label}>{panel.tab}</span>
      </span>
    </button>
  );
}
