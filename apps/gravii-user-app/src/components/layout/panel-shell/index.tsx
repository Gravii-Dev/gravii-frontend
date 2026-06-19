"use client";

import type { ReactNode } from "react";

import styles from "./panel-shell.module.css";

type PanelShellProps = {
  title: string;
  dark?: boolean;
  className?: string;
  children: ReactNode;
};

function joinClasses(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export default function PanelShell({
  title,
  dark = false,
  className,
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
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
