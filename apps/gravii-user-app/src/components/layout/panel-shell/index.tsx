"use client";

import type { ReactNode } from "react";

import ActionButton from "@/components/ui/action-button";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  title: string;
  dark?: boolean;
  className?: string;
  actionLabel?: string;
  headerAction?: ReactNode;
  onClose?: () => void;
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
  headerAction,
  onClose,
  children,
}: PanelShellProps) {
  return (
    <div
      className={joinClasses(
        styles.root,
        dark ? styles.rootDark : styles.rootLight,
        className,
      )}
    >
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>GRAVII WORKSPACE</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.headerActions}>
          {headerAction}
          {onClose ? (
            <ActionButton
              dark={dark}
              className={styles.closeButton}
              hoverIcon="arrowLeft"
              icon="home"
              onClick={onClose}
            >
              {actionLabel}
            </ActionButton>
          ) : null}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.body}>{children}</div>
    </div>
  );
}
