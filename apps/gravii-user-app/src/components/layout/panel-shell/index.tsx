"use client";

import type { ReactNode, UIEvent } from "react";

import ActionButton from "@/components/ui/action-button";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  title: string;
  dark?: boolean;
  className?: string;
  actionLabel?: string;
  onClose?: () => void;
  onScrollProgress?: (progress: number) => void;
  children: ReactNode;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function PanelShell({
  title,
  dark = false,
  className,
  actionLabel = "HOME",
  onClose,
  onScrollProgress,
  children,
}: PanelShellProps) {
  function handleScroll(event: UIEvent<HTMLDivElement>) {
    if (!onScrollProgress) {
      return;
    }

    const target = event.currentTarget;
    const scrollableDistance = target.scrollHeight - target.clientHeight;
    const progress = scrollableDistance > 0 ? target.scrollTop / scrollableDistance : 0;

    onScrollProgress(Math.min(1, Math.max(0, progress)));
  }

  return (
    <div
      className={joinClasses(
        styles.root,
        dark ? styles.rootDark : styles.rootLight,
        className,
      )}
      onScroll={handleScroll}
    >
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>GRAVII WORKSPACE</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {onClose ? (
          <ActionButton dark={dark} className={styles.closeButton} onClick={onClose}>
            {actionLabel}
          </ActionButton>
        ) : null}
      </div>

      <div className={styles.divider} />

      <div className={styles.body}>{children}</div>
    </div>
  );
}
