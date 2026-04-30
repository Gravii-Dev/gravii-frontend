"use client";

import type { KeyboardEvent, ReactNode } from "react";

import PanelShell from "@/components/layout/panel-shell";
import GrainOverlay from "@/components/ui/grain-overlay";

import styles from "./my-space-dock.module.css";

type MySpaceDockProps = {
  isActive: boolean;
  hasAnyActivePanel: boolean;
  isHovered: boolean;
  onOpen: () => void;
  onClose: () => void;
  onHoverChange: (hovered: boolean) => void;
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

export default function MySpaceDock({
  isActive,
  hasAnyActivePanel,
  isHovered,
  onOpen,
  onClose,
  onHoverChange,
  children,
}: MySpaceDockProps) {
  const isCompact = hasAnyActivePanel && !isActive;

  return (
    <section
      className={joinClasses(
        styles.root,
        isActive && styles.rootActive,
        !isActive && hasAnyActivePanel && styles.rootCompact,
        !isActive && !hasAnyActivePanel && styles.rootIdle,
        isHovered && styles.rootHovered,
      )}
      onClick={isActive ? undefined : onOpen}
      onKeyDown={isActive ? undefined : (event) => handleToggleKey(event, onOpen)}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-expanded={isActive}
      aria-label={isActive ? undefined : "My Space panel"}
    >
      <div className={styles.hoverLine} />
      <GrainOverlay variant="dock" active={isActive} />

      <div className={`${styles.preview} ${isCompact ? styles.previewCompact : ""} ${isActive ? styles.previewHidden : ""}`} aria-hidden={isActive}>
        <span className={styles.previewTitle}>MY SPACE</span>
        {!isCompact ? <span className={styles.previewTagline}>&ldquo;Personalized curation, reserved.&rdquo;</span> : null}
      </div>

      {isActive ? (
        <PanelShell className={styles.expanded} title="MY SPACE" dark onClose={onClose}>
          {children}
        </PanelShell>
      ) : null}
    </section>
  );
}
