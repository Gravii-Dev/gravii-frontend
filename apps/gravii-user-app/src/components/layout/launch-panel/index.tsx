"use client";

import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";

import type { PanelConfig, PanelId } from "@/features/launch-app/types";

import styles from "./launch-panel.module.css";

type LaunchPanelProps = {
  panel: PanelConfig;
  isActive: boolean;
  isHovered: boolean;
  activeProgress: number;
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
  "--panel-progress": string;
};

export default function LaunchPanel({
  panel,
  isActive,
  isHovered,
  activeProgress,
  onOpen,
  onHoverChange,
}: LaunchPanelProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelStyle: PanelStyle = {
    "--panel-bg": panel.bg,
    "--panel-bg-hover": panel.bgHover,
    "--panel-progress": String(activeProgress),
  };

  useEffect(() => {
    const scrollTarget = buttonRef.current;

    if (!isActive || !scrollTarget || typeof scrollTarget.scrollIntoView !== "function") {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollTimer = window.setTimeout(() => {
      scrollTarget.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion ? "instant" : "smooth",
      });
    }, 120);

    return () => window.clearTimeout(scrollTimer);
  }, [isActive]);

  return (
    <button
      ref={buttonRef}
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
      data-panel-id={panel.id}
      onClick={() => onOpen(panel.id)}
      onKeyDown={(event) => handleToggleKey(event, () => onOpen(panel.id))}
      onMouseEnter={() => onHoverChange(panel.id)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <span className={styles.marker} aria-hidden="true" />
      <span className={styles.copyStack}>
        <span className={styles.label}>{panel.tab}</span>
        <span className={styles.summary}>{panel.summary}</span>
      </span>
      <span className={styles.sub}>{panel.sub}</span>
    </button>
  );
}
