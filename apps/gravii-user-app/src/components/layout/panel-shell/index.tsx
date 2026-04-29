"use client";

import type { ReactNode } from "react";

import ActionButton from "@/components/ui/action-button";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  title: string;
  dark?: boolean;
  className?: string;
  onClose: () => void;
  children: ReactNode;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function PanelShell({
  title,
  dark = false,
  className,
  onClose,
  children,
}: PanelShellProps) {
  return (
    <div className={joinClasses(styles.root, dark ? styles.rootDark : styles.rootLight, className)}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <ActionButton dark={dark} className={styles.closeButton} onClick={onClose}>
          CLOSE ×
        </ActionButton>
      </div>

      <div className={styles.divider} />

      <div className={styles.body}>{children}</div>
    </div>
  );
}
